/* Ficcraft: dialogs, menus, toasts, the [[link]] helper and other UI plumbing.
   No alert/confirm/prompt: those are blocked inside a Claude viewer. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;
  const UI = {};

  /* ───────────── Modal dialogs ───────────── */

  let openModals = 0;
  UI.modal = function (opts) {
    return new Promise((resolve) => {
      const prevFocus = document.activeElement;
      const wrap = U.el(
        '<div class="dlg-backdrop" role="presentation">' +
          '<div class="dlg' + (opts.wide ? ' dlg-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="dlg-title">' +
            '<h2 class="dlg-title" id="dlg-title"></h2>' +
            '<div class="dlg-body"></div>' +
            '<div class="dlg-actions"></div>' +
          '</div>' +
        '</div>'
      );
      const dlg = wrap.firstElementChild;
      U.qs('.dlg-title', dlg).textContent = opts.title || '';
      const body = U.qs('.dlg-body', dlg);
      if (typeof opts.body === 'string') body.innerHTML = opts.body;
      else if (opts.body) body.appendChild(opts.body);
      const actions = U.qs('.dlg-actions', dlg);
      let done = false;
      function close(v) {
        if (done) return;
        done = true;
        wrap.classList.add('is-closing');
        document.removeEventListener('keydown', onKey, true);
        setTimeout(() => wrap.remove(), 120);
        openModals--;
        if (prevFocus && prevFocus.focus) {
          try { prevFocus.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        }
        resolve(v);
      }
      for (const a of opts.actions || [{ label: 'Close', value: null }]) {
        const b = document.createElement('button');
        b.type = a.submit ? 'submit' : 'button';
        b.className = 'btn ' + (a.tone === 'primary' ? 'btn-primary' : a.tone === 'danger' ? 'btn-danger' : 'btn-ghost');
        b.textContent = a.label;
        b.addEventListener('click', () => {
          if (a.validate) {
            const err = a.validate(dlg);
            if (err) { UI.fieldError(dlg, err); return; }
          }
          close(typeof a.value === 'function' ? a.value(dlg) : a.value);
        });
        actions.appendChild(b);
      }
      function onKey(ev) {
        if (ev.key === 'Escape') { ev.stopPropagation(); ev.preventDefault(); close(null); }
        else if (ev.key === 'Tab') trapTab(ev, dlg);
        else if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
          const primary = U.qs('.btn-primary, .btn-danger', actions);
          if (primary) { ev.preventDefault(); primary.click(); }
        }
      }
      wrap.addEventListener('mousedown', (ev) => { if (ev.target === wrap) close(null); });
      dlg.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const primary = U.qs('.btn-primary, .btn-danger', actions);
        if (primary) primary.click();
      });
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(wrap);
      openModals++;
      if (opts.onOpen) opts.onOpen(dlg, close);
      const focusEl = U.qs('[autofocus]', dlg) || U.qs('input, textarea, select', dlg) || U.qs('.btn-primary, .btn-danger', actions) || U.qs('button', actions);
      if (focusEl) setTimeout(() => focusEl.focus(), 20);
    });
  };
  UI.isModalOpen = () => openModals > 0;

  function trapTab(ev, root) {
    const f = U.qsa('a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])', root).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  }

  UI.fieldError = function (root, msg) {
    let el = U.qs('.dlg-error', root);
    if (!el) {
      el = U.el('<p class="dlg-error" role="alert"></p>');
      U.qs('.dlg-body', root).appendChild(el);
    }
    el.textContent = msg;
  };

  UI.confirm = function (o) {
    return UI.modal({
      title: o.title,
      body: '<p>' + U.esc(o.body || '') + '</p>',
      actions: [
        { label: o.cancel || 'Cancel', value: false },
        { label: o.confirm || 'Confirm', value: true, tone: o.danger ? 'danger' : 'primary' },
      ],
    }).then((v) => !!v);
  };

  /* Ask for a typed word before something irreversible. */
  UI.confirmTyped = function (o) {
    const body = U.el(
      '<form class="form"><p></p><label class="field"><span class="field-label"></span><input type="text" id="dlg-typed" autocomplete="off" spellcheck="false"></label></form>'
    );
    body.querySelector('p').textContent = o.body;
    body.querySelector('.field-label').textContent = 'Type “' + o.word + '” to confirm';
    return UI.modal({
      title: o.title,
      body,
      actions: [
        { label: 'Cancel', value: false },
        {
          label: o.confirm || 'Delete',
          tone: 'danger',
          value: true,
          validate: (d) => (U.qs('#dlg-typed', d).value.trim() === o.word ? null : 'Type “' + o.word + '” exactly to confirm.'),
        },
      ],
    }).then((v) => !!v);
  };

  /* ───────────── Popover menus ───────────── */

  let openMenu = null;
  UI.closeMenu = function () {
    if (openMenu) { openMenu.close(null); openMenu = null; }
  };
  UI.menu = function (anchor, items, opts) {
    UI.closeMenu();
    opts = opts || {};
    return new Promise((resolve) => {
      const m = U.el('<div class="menu" role="menu"></div>');
      if (opts.label) m.setAttribute('aria-label', opts.label);
      for (const it of items) {
        if (it.sep) { m.appendChild(U.el('<div class="menu-sep" role="separator"></div>')); continue; }
        if (it.heading) { const h = U.el('<div class="menu-head"></div>'); h.textContent = it.heading; m.appendChild(h); continue; }
        const b = U.el(
          '<button type="button" role="menuitem" class="menu-item' + (it.danger ? ' is-danger' : '') + (it.checked ? ' is-checked' : '') + (it.cls ? ' ' + it.cls : '') + '">' +
            (it.icon ? U.icon(it.icon) : '<span class="ic-gap"></span>') +
            '<span class="menu-text"><span class="menu-label"></span>' + (it.gloss ? '<span class="menu-gloss"></span>' : '') + '</span>' +
            (it.checked ? U.icon('check', 'menu-check') : '') +
          '</button>'
        );
        U.qs('.menu-label', b).textContent = it.label;
        if (it.gloss) U.qs('.menu-gloss', b).textContent = it.gloss;
        b.addEventListener('click', () => close(it.value));
        m.appendChild(b);
      }
      document.body.appendChild(m);
      const r = anchor.getBoundingClientRect();
      const mw = m.offsetWidth;
      const mh = m.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      let left = opts.align === 'left' ? r.left : r.right - mw;
      left = U.clamp(left, 8, vw - mw - 8);
      let top = r.bottom + 6;
      if (top + mh > vh - 8) top = Math.max(8, r.top - mh - 6);
      m.style.left = left + 'px';
      m.style.top = top + 'px';
      const first = U.qs('.menu-item', m);
      if (first) first.focus();
      let done = false;
      function close(v) {
        if (done) return;
        done = true;
        m.remove();
        document.removeEventListener('mousedown', onDown, true);
        document.removeEventListener('keydown', onKey, true);
        window.removeEventListener('resize', onResize);
        if (openMenu && openMenu.el === m) openMenu = null;
        if (v != null) { /* the caller handles focus */ } else if (anchor && anchor.focus) anchor.focus({ preventScroll: true });
        resolve(v);
      }
      function onDown(ev) { if (!m.contains(ev.target)) close(null); }
      function onResize() { close(null); }
      function onKey(ev) {
        const itemsEls = U.qsa('.menu-item', m);
        const i = itemsEls.indexOf(document.activeElement);
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); close(null); }
        else if (ev.key === 'ArrowDown') { ev.preventDefault(); (itemsEls[i + 1] || itemsEls[0]).focus(); }
        else if (ev.key === 'ArrowUp') { ev.preventDefault(); (itemsEls[i - 1] || itemsEls[itemsEls.length - 1]).focus(); }
        else if (ev.key === 'Tab') { close(null); }
      }
      setTimeout(() => {
        document.addEventListener('mousedown', onDown, true);
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('resize', onResize);
      }, 0);
      openMenu = { el: m, close };
    });
  };

  /* ───────────── Toasts ───────────── */

  UI.toast = function (msg, o) {
    o = o || {};
    const host = U.qs('#toasts');
    if (!host) return;
    const t = U.el('<div class="toast' + (o.tone ? ' toast-' + o.tone : '') + '" role="status"><span class="toast-msg"></span></div>');
    U.qs('.toast-msg', t).textContent = msg;
    let timer = 0;
    const kill = () => {
      clearTimeout(timer);
      t.classList.add('is-leaving');
      setTimeout(() => t.remove(), 200);
    };
    if (o.action) {
      const b = U.el('<button type="button" class="toast-btn"></button>');
      b.textContent = o.action.label;
      b.addEventListener('click', () => { kill(); o.action.fn(); });
      t.appendChild(b);
    }
    host.appendChild(t);
    while (host.children.length > 3) host.firstElementChild.remove();
    timer = setTimeout(kill, o.ms || (o.action ? 7000 : 3200));
  };

  /* ───────────── Textareas ───────────── */

  UI.autosize = function (ta, maxPx) {
    const fit = () => {
      ta.style.height = 'auto';
      const max = typeof maxPx === 'function' ? maxPx() : maxPx || 9999;
      ta.style.height = Math.min(max, ta.scrollHeight + 2) + 'px';
      ta.style.overflowY = ta.scrollHeight + 2 > max ? 'auto' : 'hidden';
    };
    ta.addEventListener('input', fit);
    requestAnimationFrame(fit);
    return fit;
  };

  /* [[ autocomplete: suggest codex names while typing a link. */
  UI.linker = function (ta, getRealmId) {
    let pop = null;
    let items = [];
    let sel = 0;
    let start = -1;

    function query() {
      const pos = ta.selectionStart;
      if (pos !== ta.selectionEnd) return null;
      const before = ta.value.slice(Math.max(0, pos - 80), pos);
      const m = /\[\[([^\[\]\n|]*)$/.exec(before);
      if (!m) return null;
      return { q: m[1], at: pos - m[1].length };
    }
    function hide() {
      if (pop) { pop.remove(); pop = null; }
      items = [];
    }
    function show(q, at) {
      const rid = getRealmId();
      if (!rid) return hide();
      const n = U.normName(q);
      const all = FC.model.codexOf(rid);
      const scored = [];
      for (const x of all) {
        const names = [x.name].concat(x.aliases);
        let best = -1;
        for (const nm of names) {
          const l = U.normName(nm);
          const i = l.indexOf(n);
          if (i === 0) best = Math.max(best, 3);
          else if (i > 0) best = Math.max(best, 1);
        }
        if (!n) best = 1;
        if (best >= 0) scored.push({ x, best });
      }
      scored.sort((a, b) => b.best - a.best || a.x.name.localeCompare(b.x.name));
      items = scored.slice(0, 7).map((s) => s.x.name);
      if (q.trim() && !items.some((i) => U.normName(i) === n)) items.push({ create: q.trim() });
      if (!items.length) return hide();
      start = at;
      sel = U.clamp(sel, 0, items.length - 1);
      if (!pop) {
        pop = U.el('<div class="linker" role="listbox" aria-label="Codex names"></div>');
        pop.addEventListener('mousedown', (ev) => {
          const b = ev.target.closest('[data-i]');
          if (!b) return;
          ev.preventDefault();
          pick(+b.dataset.i);
        });
        document.body.appendChild(pop);
      }
      pop.innerHTML = items
        .map((it, i) =>
          '<div class="linker-item' + (i === sel ? ' is-sel' : '') + '" role="option" data-i="' + i + '" aria-selected="' + (i === sel) + '">' +
            (typeof it === 'string'
              ? U.icon((FC.model.KINDS[(FC.model.findCodex(rid, it) || {}).kind] || FC.model.KINDS.concept).icon) + '<span>' + U.esc(it) + '</span>'
              : U.icon('plus') + '<span>Link “' + U.esc(it.create) + '” (not in the codex yet)</span>') +
          '</div>'
        )
        .join('');
      const r = ta.getBoundingClientRect();
      const ph = pop.offsetHeight;
      const vh = document.documentElement.clientHeight;
      const vw = document.documentElement.clientWidth;
      const w = Math.min(320, vw - 16);
      pop.style.width = w + 'px';
      pop.style.left = U.clamp(r.left + 12, 8, vw - w - 8) + 'px';
      const below = r.bottom + 4;
      pop.style.top = (below + ph < vh - 8 ? below : Math.max(8, r.top - ph - 4)) + 'px';
    }
    function pick(i) {
      const it = items[i];
      if (it == null) return;
      const name = typeof it === 'string' ? it : it.create;
      const pos = ta.selectionStart;
      const after = ta.value.slice(pos);
      const close = after.startsWith(']]') ? '' : ']]';
      ta.value = ta.value.slice(0, start) + name + close + after;
      const caret = start + name.length + 2;
      ta.setSelectionRange(caret, caret);
      hide();
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.focus();
    }
    function update() {
      const q = query();
      if (!q) return hide();
      show(q.q, q.at);
    }
    ta.addEventListener('input', update);
    ta.addEventListener('click', update);
    ta.addEventListener('blur', () => setTimeout(hide, 120));
    ta.addEventListener('keydown', (ev) => {
      if (!pop || !items.length) return;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); sel = (sel + 1) % items.length; update(); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); sel = (sel - 1 + items.length) % items.length; update(); }
      else if ((ev.key === 'Enter' && !ev.ctrlKey && !ev.metaKey && !ev.shiftKey) || ev.key === 'Tab') { ev.preventDefault(); ev.stopPropagation(); pick(sel); }
      else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); hide(); }
    });
    return { hide };
  };

  /* Wrap search terms in <mark> inside an element, touching text nodes only. */
  UI.highlight = function (root, terms) {
    if (!terms || !terms.length) return 0;
    const re = new RegExp('(' + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let count = 0;
    for (const n of nodes) {
      if (!re.test(n.nodeValue)) continue;
      re.lastIndex = 0;
      const f = document.createDocumentFragment();
      let last = 0;
      n.nodeValue.replace(re, (m, _g, off) => {
        if (off > last) f.appendChild(document.createTextNode(n.nodeValue.slice(last, off)));
        const mk = document.createElement('mark');
        mk.textContent = m;
        f.appendChild(mk);
        last = off + m.length;
        count++;
        return m;
      });
      if (last < n.nodeValue.length) f.appendChild(document.createTextNode(n.nodeValue.slice(last)));
      n.parentNode.replaceChild(f, n);
    }
    return count;
  };

  /* A plain-text snippet around the first matching term, with <mark>s. */
  UI.markSnippet = function (text, terms, radius) {
    radius = radius || 90;
    const plain = U.stripMd(text);
    const low = plain.toLowerCase();
    let at = -1;
    for (const t of terms) {
      const i = low.indexOf(t);
      if (i >= 0 && (at < 0 || i < at)) at = i;
    }
    let s = 0;
    let e = plain.length;
    if (at > radius) s = plain.lastIndexOf(' ', at - radius) + 1 || at - radius;
    if (e - s > radius * 2.4) e = plain.indexOf(' ', s + radius * 2.4) > 0 ? plain.indexOf(' ', s + radius * 2.4) : s + radius * 2.4;
    let out = U.esc(plain.slice(s, e));
    if (terms.length) {
      const re = new RegExp('(' + terms.map((t) => U.esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    }
    return (s > 0 ? '…' : '') + out + (e < plain.length ? '…' : '');
  };

  /* ───────────── Files ───────────── */

  UI.saveFile = async function (filename, text, mime) {
    const dl = FC.caps && FC.caps.downloads;
    if (dl) {
      try {
        await dl.save({ filename, data: text });
        UI.toast('Saved ' + filename);
        return true;
      } catch (e) {
        if (e && e.code === 'declined') return false;
        if (e && e.code === 'rate_limited') { UI.toast('A save is already waiting for your answer.'); return false; }
        /* fall through to the copy dialog */
      }
    } else if (!FC.inViewer) {
      const blob = new Blob([text], { type: mime || 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      UI.toast('Saved ' + filename);
      return true;
    }
    return UI.showText(filename, text);
  };

  UI.showText = function (title, text) {
    const body = U.el(
      '<div class="form"><p class="muted">This page can’t save files here. Copy the text below and keep it somewhere safe.</p><textarea class="mono-box" id="dlg-copytext" readonly></textarea></div>'
    );
    U.qs('textarea', body).value = text;
    return UI.modal({
      title,
      body,
      wide: true,
      actions: [
        { label: 'Close', value: false },
        {
          label: 'Copy to clipboard',
          tone: 'primary',
          value: (d) => {
            UI.copy(U.qs('textarea', d).value, U.qs('textarea', d));
            return true;
          },
        },
      ],
    });
  };

  UI.copy = function (text, fallbackEl) {
    const done = () => UI.toast('Copied');
    const fail = () => {
      if (fallbackEl && fallbackEl.select) { fallbackEl.focus(); fallbackEl.select(); UI.toast('Press Ctrl+C (or ⌘C) to copy the selection.'); }
      else UI.toast('Copying isn’t allowed here. Select the text and copy it by hand.', { tone: 'warn' });
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    } catch (e) {
      fail();
    }
  };

  UI.pickFile = function (accept) {
    return new Promise((resolve) => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = accept || '';
      inp.style.display = 'none';
      inp.addEventListener('change', () => {
        const f = inp.files && inp.files[0];
        inp.remove();
        if (!f) return resolve(null);
        const r = new FileReader();
        r.onload = () => resolve({ name: f.name, text: String(r.result || '') });
        r.onerror = () => resolve(null);
        r.readAsText(f);
      });
      document.body.appendChild(inp);
      inp.click();
    });
  };

  FC.ui = UI;
})();
