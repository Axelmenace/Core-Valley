/* Ficcraft: where the archive lives.
   The model is kept in memory and written through to one of these adapters as
   key/value documents (realms, threads, codex entries, and entries packed into
   size-checked chunks per thread). Every adapter speaks the same three verbs. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;

  /* The Claude page store caps a document at 256 KiB; stay well under it everywhere. */
  const MAX_DOC_BYTES = 240 * 1024;

  function req(r) {
    return new Promise((res, rej) => {
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }

  async function idb() {
    if (!window.indexedDB) throw new Error('IndexedDB is not available');
    const db = await new Promise((res, rej) => {
      let r;
      try {
        r = indexedDB.open('ficcraft', 1);
      } catch (e) {
        rej(e);
        return;
      }
      r.onupgradeneeded = () => {
        if (!r.result.objectStoreNames.contains('kv')) r.result.createObjectStore('kv');
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error || new Error('IndexedDB failed to open'));
      r.onblocked = () => rej(new Error('IndexedDB is blocked by another tab'));
    });
    return {
      kind: 'browser',
      label: 'this browser',
      debounce: 350,
      async loadAll() {
        return req(db.transaction('kv', 'readonly').objectStore('kv').getAll());
      },
      writeBatch(ops) {
        return new Promise((res) => {
          let tx;
          try {
            tx = db.transaction('kv', 'readwrite');
          } catch (e) {
            res(ops.map((o) => ({ k: o.k, ok: false, code: 'unavailable', message: String(e) })));
            return;
          }
          const st = tx.objectStore('kv');
          try {
            for (const o of ops) {
              if (o.v == null) st.delete(o.k);
              else st.put(o.v, o.k);
            }
          } catch (e) {
            try { tx.abort(); } catch (_) { /* already aborted */ }
          }
          tx.oncomplete = () => res(ops.map((o) => ({ k: o.k, ok: true })));
          tx.onerror = tx.onabort = () => {
            const err = tx.error;
            const code = err && err.name === 'QuotaExceededError' ? 'quota_exceeded' : 'unavailable';
            res(ops.map((o) => ({ k: o.k, ok: false, code, message: err ? err.message : 'Write failed' })));
          };
        });
      },
    };
  }

  function local() {
    const P = 'ficcraft:kv:';
    localStorage.setItem(P + '__probe', '1');
    localStorage.removeItem(P + '__probe');
    return {
      kind: 'browser',
      label: 'this browser',
      debounce: 400,
      async loadAll() {
        const out = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(P)) {
            try { out.push(JSON.parse(localStorage.getItem(k))); } catch (e) { /* skip a corrupt record */ }
          }
        }
        return out;
      },
      async writeBatch(ops) {
        return ops.map((o) => {
          try {
            if (o.v == null) localStorage.removeItem(P + o.k);
            else localStorage.setItem(P + o.k, JSON.stringify(o.v));
            return { k: o.k, ok: true };
          } catch (e) {
            return { k: o.k, ok: false, code: e && e.name === 'QuotaExceededError' ? 'quota_exceeded' : 'unavailable', message: String(e) };
          }
        });
      },
    };
  }

  function memory() {
    const store = new Map();
    return {
      kind: 'memory',
      label: 'memory only',
      debounce: 200,
      async loadAll() {
        return [...store.values()].map((v) => JSON.parse(v));
      },
      async writeBatch(ops) {
        for (const o of ops) {
          if (o.v == null) store.delete(o.k);
          else store.set(o.k, JSON.stringify(o.v));
        }
        return ops.map((o) => ({ k: o.k, ok: true }));
      },
    };
  }

  /* The viewer's private subtree of a published Claude page's database. */
  function claudeDb(db, uid) {
    const col = db.collection('data/users/' + uid);
    async function retryOnce(fn) {
      try {
        return await fn();
      } catch (e) {
        if (e && e.code === 'unavailable') {
          await U.sleep(400 + Math.random() * 700);
          return fn();
        }
        throw e;
      }
    }
    return {
      kind: 'account',
      label: 'your Claude account',
      debounce: 900,
      async loadAll() {
        const out = [];
        let last = null;
        for (let guard = 0; guard < 100; guard++) {
          const q = last == null ? col.orderBy('k').limit(500) : col.where('k', '>', last).orderBy('k').limit(500);
          const snap = await retryOnce(() => q.get());
          for (const d of snap.docs) {
            const v = d.data();
            if (v && typeof v.k === 'string') out.push(JSON.parse(JSON.stringify(v)));
          }
          if (snap.size < 500) break;
          last = snap.docs[snap.docs.length - 1].data().k;
        }
        return out;
      },
      async writeBatch(ops) {
        const results = [];
        let idx = 0;
        async function worker() {
          while (idx < ops.length) {
            const o = ops[idx++];
            try {
              const ref = col.doc(o.k);
              await retryOnce(() => (o.v == null ? ref.delete() : ref.set(o.v)));
              results.push({ k: o.k, ok: true });
            } catch (e) {
              results.push({ k: o.k, ok: false, code: (e && e.code) || 'unavailable', message: (e && e.message) || String(e) });
            }
          }
        }
        await Promise.all([worker(), worker(), worker()]);
        return results;
      },
    };
  }

  async function openLocal() {
    try { return await idb(); } catch (e) { /* fall through */ }
    try { return local(); } catch (e) { /* fall through */ }
    return memory();
  }

  /* Write-behind queue. Marks keys dirty; flushes them in batches after a pause. */
  const TRANSIENT = new Set(['unavailable', 'resource_exhausted', 'upstream_error', 'queue_overflow']);
  const DENIED = new Set(['invalid_argument', 'revoked', 'not_granted', 'capability_disabled', 'capability_removed', 'transform_error']);

  function Persist(adapter, model, hooks) {
    this.adapter = adapter;
    this.model = model;
    this.hooks = hooks || {};
    this.dirty = new Set();
    this.timer = 0;
    this.retryTimer = 0;
    this.retryDelay = 2000;
    this.busy = null;
    this.again = false;
    this.state = 'saved';
    this.detail = null;
    this.lastSaved = null;
  }

  Persist.prototype.setState = function (state, detail) {
    if (this.state === state && this.detail === (detail || null)) return;
    this.state = state;
    this.detail = detail || null;
    if (this.hooks.onState) this.hooks.onState(state, this.detail);
  };

  Persist.prototype.mark = function (k) {
    this.dirty.add(k);
    if (this.state === 'saved') this.setState('pending');
    this.schedule();
  };

  Persist.prototype.markAll = function (keys) {
    for (const k of keys) this.dirty.add(k);
    this.setState('pending');
    this.schedule(50);
  };

  Persist.prototype.schedule = function (ms) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), ms == null ? this.adapter.debounce : ms);
  };

  Persist.prototype.flush = async function () {
    clearTimeout(this.timer);
    if (this.busy) {
      this.again = true;
      return this.busy;
    }
    if (!this.dirty.size) return;
    this.setState('saving');
    this.busy = this._run();
    let failed;
    try {
      failed = await this.busy;
    } catch (e) {
      failed = [{ k: null, code: 'unavailable', message: String(e) }];
    }
    this.busy = null;

    if (failed.length) {
      for (const f of failed) if (f.k && f.code !== 'too_large') this.dirty.add(f.k);
      const codes = new Set(failed.map((f) => f.code));
      if ([...codes].some((c) => DENIED.has(c))) {
        this.setState('error', 'denied');
        if (this.hooks.onDenied) this.hooks.onDenied(failed);
        return;
      }
      if (codes.has('quota_exceeded')) {
        this.setState('error', 'full');
        return;
      }
      if (codes.has('too_large')) {
        this.setState(this.dirty.size ? 'pending' : 'saved');
        if (this.hooks.onTooLarge) this.hooks.onTooLarge(failed.filter((f) => f.code === 'too_large'));
        if (this.dirty.size) this.schedule(1500);
        return;
      }
      this.setState('retrying');
      clearTimeout(this.retryTimer);
      this.retryTimer = setTimeout(() => this.flush(), this.retryDelay);
      this.retryDelay = Math.min(30000, this.retryDelay * 2);
      return;
    }

    this.retryDelay = 2000;
    this.lastSaved = Date.now();
    this.setState(this.dirty.size ? 'pending' : 'saved');
    if (this.again || this.dirty.size) {
      this.again = false;
      if (this.dirty.size) this.schedule(40);
    }
  };

  Persist.prototype._run = async function () {
    const failed = [];
    for (let guard = 0; this.dirty.size && guard < 25; guard++) {
      const keys = [...this.dirty];
      this.dirty.clear();
      const ops = [];
      for (const k of keys) {
        let v;
        try {
          v = this.model.serialize(k);
        } catch (e) {
          console.error('Ficcraft: could not prepare', k, e);
          continue;
        }
        if (v && v.__tooLarge) {
          failed.push({ k, code: 'too_large' });
          continue;
        }
        ops.push({ k, v });
      }
      if (ops.length) {
        const res = await this.adapter.writeBatch(ops);
        for (const r of res) if (!r.ok) failed.push(r);
      }
      if (failed.some((f) => f.code !== 'too_large')) break;
    }
    return failed;
  };

  Persist.prototype.pending = function () {
    return this.dirty.size > 0 || !!this.busy;
  };

  FC.storage = { MAX_DOC_BYTES, idb, local, memory, claudeDb, openLocal, Persist, TRANSIENT };
})();
