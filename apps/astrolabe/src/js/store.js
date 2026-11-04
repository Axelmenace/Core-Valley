/* ── store: one key–value interface over three backends ────────────────────
   cloud  → claude.ai artifact database, each writer's own private subtree (data/users/<id>/…)
   local  → IndexedDB in this browser
   memory → nothing survives a reload (last resort; the UI says so loudly)
   Keys: meta · p.<pid> project · c.<pid> codex · t.<pid>.<nid> scene text · s.<pid>.<nid> snapshots */
const Store = (() => {
  let be = null;
  const pending = new Map(), inflight = new Set();
  let failures = 0, lastError = "", listeners = [];
  const CHUNK = 60000; // characters per cloud document (worst case ~180 KB of UTF-8, under the 256 KB cap)

  function emit() { const s = status(); listeners.forEach(f => f(s)); }
  function status() {
    if (failures) return { state: "error", text: "Not saved", detail: lastError };
    if (pending.size || inflight.size) return { state: "saving", text: "Saving" };
    return { state: "ok", text: be && be.kind === "memory" ? "Unsaved session" : "Saved" };
  }
  const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error(label + " timed out")), ms))]);

  function idb() {
    return new Promise((res, rej) => {
      if (!("indexedDB" in window)) return rej(new Error("IndexedDB unavailable"));
      let req;
      try { req = indexedDB.open("astrolabe", 1); } catch (e) { return rej(e); }
      req.onupgradeneeded = () => req.result.createObjectStore("kv");
      req.onerror = () => rej(req.error || new Error("IndexedDB refused"));
      req.onblocked = () => rej(new Error("IndexedDB blocked"));
      req.onsuccess = () => {
        const db = req.result;
        const tx = (mode, fn) => new Promise((ok, no) => {
          const t = db.transaction("kv", mode), r = fn(t.objectStore("kv"));
          t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error); t.onabort = () => no(t.error || new Error("aborted"));
        });
        res({
          kind: "local",
          get: k => tx("readonly", s => s.get(k)),
          set: (k, v) => tx("readwrite", s => s.put(v, k)),
          del: k => tx("readwrite", s => s.delete(k)),
        });
      };
    });
  }

  function memory() {
    const m = new Map();
    return { kind: "memory", get: async k => m.get(k), set: async (k, v) => { m.set(k, structuredClone(v)); }, del: async k => { m.delete(k); } };
  }

  async function cloud() {
    if (!window.claude || typeof window.claude.use !== "function") return null;
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!db || !user) return null;
    const id = await user.id();
    if (!id) return null;
    let canWrite = null; try { canWrite = await user.can("data.write"); } catch { canWrite = null; }
    if (canWrite === false) return null; // a view-only visitor keeps their drafts in this browser instead
    const col = db.collection("data/users/" + id);
    await withTimeout(col.doc("meta").get(), 10000, "Cloud store");
    const getRaw = async k => { const s = await col.doc(k).get(); return s.exists ? s.data() : undefined; };
    const known = new Map(); // key → number of chunk documents it currently spans
    const chunksOf = async k => { if (!known.has(k)) { const d = await getRaw(k); known.set(k, (d && d.chunks) || 0); } return known.get(k); };
    return {
      kind: "cloud",
      async get(k) {
        const d = await getRaw(k);
        if (!d) { known.set(k, 0); return undefined; }
        known.set(k, d.chunks || 0);
        let json = d.v;
        if (d.chunks) {
          const parts = await Promise.all(Array.from({ length: d.chunks }, (_, i) => getRaw(k + "~" + i)));
          if (parts.some(p => !p)) throw new Error("A part of " + k + " is missing");
          json = parts.map(p => p.v).join("");
        }
        try { return JSON.parse(json); } catch { return undefined; }
      },
      async set(k, v) {
        const json = JSON.stringify(v);
        const prevChunks = await chunksOf(k);
        if (json.length <= CHUNK) {
          await col.doc(k).set({ v: json, t: Date.now() });
          for (let i = 0; i < prevChunks; i++) await col.doc(k + "~" + i).delete();
          known.set(k, 0);
          return;
        }
        const n = Math.ceil(json.length / CHUNK);
        for (let i = 0; i < n; i++) await col.doc(k + "~" + i).set({ v: json.slice(i * CHUNK, (i + 1) * CHUNK) });
        await col.doc(k).set({ chunks: n, t: Date.now() });
        for (let i = n; i < prevChunks; i++) await col.doc(k + "~" + i).delete();
        known.set(k, n);
      },
      async del(k) {
        const n = await chunksOf(k);
        for (let i = 0; i < n; i++) await col.doc(k + "~" + i).delete();
        await col.doc(k).delete();
        known.set(k, 0);
      },
    };
  }

  async function flushKey(k) {
    if (inflight.has(k)) return;
    while (pending.has(k)) {
      const op = pending.get(k); pending.delete(k); inflight.add(k); emit();
      try {
        if (op.del) await be.del(k); else await be.set(k, op.v);
        failures = 0; lastError = "";
      } catch (e) {
        failures++; lastError = (e && (e.message || e.code)) || "Write failed";
        if (!pending.has(k)) pending.set(k, op); // keep the newest value queued
        inflight.delete(k); emit();
        const wait = Math.min(30000, 1500 * 2 ** Math.min(failures, 4)) * (0.75 + Math.random() * .5);
        setTimeout(() => flushKey(k), wait);
        return;
      }
      inflight.delete(k);
    }
    emit();
  }

  return {
    async init(onStep) {
      if (window.claude && typeof window.claude.use === "function") {
        onStep && onStep("Reaching your private archive…");
        try { const c = await cloud(); if (c) { be = c; return be.kind; } } catch (e) { console.warn("cloud store unavailable", e); }
      }
      try { be = await idb(); await be.get("meta"); return be.kind; } catch (e) { console.warn("IndexedDB unavailable", e); }
      be = memory(); return be.kind;
    },
    kind: () => be && be.kind,
    get: k => (pending.has(k) ? Promise.resolve(pending.get(k).del ? undefined : structuredClone(pending.get(k).v)) : be.get(k)),
    put(k, v) { pending.set(k, { v: structuredClone(v) }); flushKey(k); emit(); },
    del(k) { pending.set(k, { del: true }); flushKey(k); emit(); },
    busy: () => pending.size > 0 || inflight.size > 0,
    status,
    onStatus(f) { listeners.push(f); },
    async drain(ms = 8000) {
      const t0 = Date.now();
      while ((pending.size || inflight.size) && Date.now() - t0 < ms) {
        [...pending.keys()].forEach(flushKey);
        await new Promise(r => setTimeout(r, 120));
      }
      return !(pending.size || inflight.size);
    },
  };
})();
