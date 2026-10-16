/* Ficcraft: the thread view.
   Long threads are rendered as a sliding window of entries; the spine on the right
   maps the whole thread (every entry, by kind) and replaces the scrollbar. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;
  const M = FC.model;
  const UI = FC.ui;
  const esc = U.esc;
  const icon = U.icon;

  const WIN = 60;
  const STEP = 40;
  const MAXR = 240;
  const EDGE = 1400;
  const PAD = 8;

  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mount(root, tid, opts) {
    opts = opts || {};
    const t = M.threads.get(tid);
    const ac = new AbortController();
    const sig = { signal: ac.signal };

    const S = {
      all: M.entriesOf(tid),
      list: [],
      s: 0,
      e: 0,
      filter: null,
      ribbonsOnly: false,
      filterOpen: false,
      findOpen: false,
      skim: !!U.pref.get('skim', false),
      find: { q: '', terms: [], hits: [], i: -1 },
      editing: null,
      editDraft: '',
      type: 'musing',
      vis: [0, 0],
      branchIdx: new Map(),
      resolve: M.resolver(t.realmId),
      spineCache: null,
      spineDirty: true,
      colors: null,
      dragging: false,
      distilling: false,
      distillDraft: '',
      mgExpand: new Set(),
      card: null,
      touched: false,
    };

    root.innerHTML =
      '<section class="thread' + (S.skim ? ' is-skim' : '') + '" aria-label="Thread">' +
        '<header class="th-head">' +
          '<div id="th-head-main"></div>' +
          '<div class="th-find" id="th-find" hidden>' +
            '<label class="sr-only" for="th-find-input">Find in this thread</label>' +
            '<input type="search" id="th-find-input" placeholder="Find in this thread…" autocomplete="off" spellcheck="false">' +
            '<span class="th-find-count" id="th-find-count" aria-live="polite"></span>' +
            '<button type="button" class="icon-btn" data-act="find-prev" title="Previous match (Shift+Enter)">' + icon('up') + '</button>' +
            '<button type="button" class="icon-btn" data-act="find-next" title="Next match (Enter)">' + icon('down') + '</button>' +
            '<button type="button" class="icon-btn" data-act="find-close" title="Close find">' + icon('close') + '</button>' +
          '</div>' +
          '<div class="th-filters" id="th-filters" hidden></div>' +
        '</header>' +
        '<div class="th-body">' +
          '<div class="th-scroller" id="th-scroller" tabindex="-1">' +
            '<div class="th-col">' +
              '<div id="th-origin"></div>' +
              '<div class="th-entries" id="th-entries"></div>' +
              '<div id="th-end"></div>' +
            '</div>' +
          '</div>' +
          '<canvas class="spine" id="th-spine" tabindex="0" role="slider" aria-orientation="vertical" aria-label="Thread map. Drag, or use the arrow keys, to move through the thread." aria-valuemin="1"></canvas>' +
          '<div class="spine-tip" id="th-tip" hidden></div>' +
          '<button type="button" class="th-latest" id="th-latest" hidden>' + icon('down') + '<span>Latest</span></button>' +
        '</div>' +
        '<form class="composer" id="composer" autocomplete="off"></form>' +
      '</section>';

    const $ = (id) => root.querySelector('#' + id);
    const SEC = root.querySelector('.thread');
    const HEAD = root.querySelector('.th-head');
    const HM = $('th-head-main');
    const FIND = $('th-find');
    const FINDIN = $('th-find-input');
    const FINDCT = $('th-find-count');
    const FB = $('th-filters');
    const SC = $('th-scroller');
    const EL = $('th-entries');
    const OR = $('th-origin');
    const END = $('th-end');
    const SP = $('th-spine');
    const TIP = $('th-tip');
    const LATEST = $('th-latest');
    const CMP = $('composer');
    let TA = null;
    let fitTA = () => {};

    /* ───────────── list & indexes ───────────── */

    function computeList() {
      S.all = M.entriesOf(tid);
      if (!S.filter && !S.ribbonsOnly) S.list = S.all;
      else S.list = S.all.filter((e) => (!S.filter || S.filter.has(e.type)) && (!S.ribbonsOnly || e.ribbon));
      if (S.find.terms.length) computeHits();
      S.spineDirty = true;
    }
    function buildBranchIdx() {
      S.branchIdx = new Map();
      for (const th of M.threads.values()) {
        if (th.parentId === tid && th.parentEntryId) {
          const a = S.branchIdx.get(th.parentEntryId) || [];
          a.push(th);
          S.branchIdx.set(th.parentEntryId, a);
        }
      }
    }

    /* ───────────── header ───────────── */

    function tool(act, ic, label, on) {
      return '<button type="button" class="icon-btn' + (on ? ' is-on' : '') + '" data-act="' + act + '" title="' + esc(label) + '" aria-label="' + esc(label) + '"' +
        (on != null ? ' aria-pressed="' + !!on + '"' : '') + '>' + icon(ic) + '</button>';
    }
    function renderHead() {
      const st = M.STATUSES[t.status];
      const parent = t.parentId ? M.threads.get(t.parentId) : null;
      HM.innerHTML =
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="#threads">Threads</a>' +
          (parent ? '<span aria-hidden="true">›</span><a href="#t-' + parent.id + '">' + esc(parent.title) + '</a>' : '') +
        '</nav>' +
        '<div class="th-titlebar">' +
          '<h1 class="th-title"><button type="button" class="th-title-btn" data-act="rename" title="Rename this thread">' + esc(t.title) + '</button></h1>' +
          '<div class="th-tools">' +
            tool('find', 'search', 'Find in this thread (Ctrl+F)', S.findOpen) +
            tool('filter', 'filter', 'Show only some kinds of entry', !!(S.filter || S.ribbonsOnly || S.filterOpen)) +
            tool('skim', 'skim', 'Skim: shorten long entries', S.skim) +
            tool('margin', 'margin', 'Margin: distillation, waypoints, canon, riddles', FC.app.marginOpen()) +
            tool('more', 'more', 'More thread actions') +
          '</div>' +
        '</div>' +
        '<div class="th-meta">' +
          '<button type="button" class="status-pill st-' + t.status + '" data-act="status" title="' + esc(st.label + ': ' + st.gloss) + '">' +
            icon(st.icon) + '<span>' + st.label + '</span>' + icon('chev', 'ic-sm') +
          '</button>' +
          '<span class="th-tags">' +
            t.tags.map((x) => '<span class="tag">#' + esc(x) + '</span>').join('') +
            '<button type="button" class="tag tag-add" data-act="tags">' + (t.tags.length ? 'Edit tags' : '+ Add tags') + '</button>' +
          '</span>' +
          '<span class="th-count" id="th-count"></span>' +
        '</div>';
      updateCount();
    }
    function updateCount() {
      const c = HM.querySelector('#th-count');
      if (c) c.textContent = U.plural(S.all.length, 'entry', 'entries') + ' · ' + U.plural(M.threadWords(tid), 'word') + ' · begun ' + U.fmtDate(t.created);
    }

    function renderFilters() {
      const on = (ty) => S.filter && S.filter.has(ty);
      FB.innerHTML =
        '<span class="fb-label">Show only</span>' +
        M.TYPE_ORDER.concat(['oracle'])
          .map((ty) =>
            '<button type="button" class="chip t-' + ty + (on(ty) ? ' is-on' : '') + '" data-act="filter-type" data-type="' + ty + '" aria-pressed="' + !!on(ty) + '">' +
              icon(M.TYPES[ty].icon) + '<span>' + M.TYPES[ty].label + '</span></button>'
          )
          .join('') +
        '<button type="button" class="chip' + (S.ribbonsOnly ? ' is-on' : '') + '" data-act="filter-ribbon" aria-pressed="' + S.ribbonsOnly + '">' + icon('ribbon') + '<span>Ribboned</span></button>' +
        ((S.filter || S.ribbonsOnly) ? '<button type="button" class="btn btn-ghost btn-sm" data-act="filter-clear">Show everything</button>' : '');
      FB.hidden = !S.filterOpen;
    }

    function renderOrigin() {
      if (!t.parentId) { OR.innerHTML = ''; return; }
      const p = M.threads.get(t.parentId);
      if (!p) { OR.innerHTML = ''; return; }
      const pe = t.parentEntryId ? M.byId.get(t.parentEntryId) : null;
      OR.innerHTML =
        '<p class="origin">' + icon('branch') + '<span>Branched from <a href="#t-' + p.id + (pe ? '.e-' + pe.id : '') + '">' + esc(p.title) + '</a>' +
        (pe ? ', at: <q>' + esc(U.snippet(pe.body, 100)) + '</q>' : '') + '</span></p>';
    }

    function updateEnd() {
      if (S.e < S.list.length) { END.innerHTML = ''; return; }
      if (!S.all.length) {
        END.innerHTML =
          '<div class="th-empty">' + icon('musing', 'ic-xl') +
            '<p class="th-empty-title">A clean page.</p>' +
            '<p>Write the first entry below. A thread can hold one thought or a thousand: musings, what-ifs, riddles to answer later, passages of prose. Pick the kind of entry above the box.</p>' +
          '</div>';
      } else if (!S.list.length) {
        END.innerHTML = '<p class="th-empty">Nothing in this thread matches the filter. <button type="button" class="linkish" data-act="filter-clear">Show everything</button></p>';
      } else {
        END.innerHTML = '<div class="th-tail" aria-hidden="true">' + icon('fleuron') + '</div>';
      }
    }

    /* ───────────── entries ───────────── */

    function bodyHTML(e) {
      if (S.editing === e.id) return editorHTML(e);
      return '<div class="en-body prose">' + (FC.md.render(e.body, { resolve: S.resolve }) || '<p class="muted">(empty)</p>') + '</div>';
    }
    function editorHTML(e) {
      return '<div class="en-edit"><label class="sr-only" for="edit-' + e.id + '">Edit entry</label>' +
        '<textarea class="en-edit-ta" id="edit-' + e.id + '">' + esc(S.editDraft) + '</textarea>' +
        '<div class="en-edit-actions"><span class="hint">Ctrl+Enter saves · Esc cancels</span>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-act="edit-cancel">Cancel</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-act="edit-save">Save</button>' +
        '</div></div>';
    }
    function actionsHTML(e) {
      return '<div class="en-actions" role="group" aria-label="Entry actions">' +
        (e.type === 'riddle'
          ? '<button type="button" class="en-act en-quick en-resolve" data-act="resolve" title="' + (e.resolved ? 'Reopen this riddle' : 'Mark this riddle answered') + '">' +
            icon(e.resolved ? 'riddle' : 'check') + '<span>' + (e.resolved ? 'Reopen' : 'Answered') + '</span></button>'
          : '') +
        '<button type="button" class="en-act en-quick' + (e.ribbon ? ' is-on' : '') + '" data-act="ribbon" aria-pressed="' + !!e.ribbon + '" title="' + (e.ribbon ? 'Remove the ribbon' : 'Ribbon: bookmark this entry') + '" aria-label="Ribbon">' + icon('ribbon') + '</button>' +
        '<button type="button" class="en-act en-quick" data-act="branch" title="Branch a new thread from here" aria-label="Branch">' + icon('branch') + '</button>' +
        '<button type="button" class="en-act en-quick" data-act="edit" title="Edit" aria-label="Edit">' + icon('edit') + '</button>' +
        '<button type="button" class="en-act" data-act="menu" title="More" aria-label="More entry actions" aria-haspopup="menu">' + icon('more') + '</button>' +
      '</div>';
    }
    function articleHTML(e) {
      const T = M.TYPES[e.type] || M.TYPES.musing;
      let cls = 'entry t-' + e.type;
      if (e.ribbon) cls += ' is-ribbon';
      if (e.resolved) cls += ' is-resolved';
      if (S.editing === e.id) cls += ' is-editing';
      const label = e.type === 'oracle' ? 'The Oracle asks' + (e.oracle ? ' · ' + esc(FC.oracle.catLabel(e.oracle)) : '') : T.label;
      const branches = S.branchIdx.get(e.id) || [];
      return '<article class="' + cls + '" id="e-' + e.id + '">' +
        '<div class="en-mark" title="' + esc(T.label + ': ' + T.gloss) + '">' + icon(T.icon) + '</div>' +
        '<div class="en-main">' +
          '<div class="en-meta">' +
            '<span class="en-type">' + label + '</span>' +
            (e.type === 'riddle' && e.resolved ? '<span class="en-answered">' + icon('check', 'ic-sm') + 'Answered</span>' : '') +
            '<time datetime="' + U.isoish(e.created) + '" title="' + esc(U.fmtStamp(e.created)) + '">' + esc(U.fmtTime(e.created)) + '</time>' +
            (e.edited ? '<span class="en-edited" title="Edited ' + esc(U.fmtStamp(e.edited)) + '">edited</span>' : '') +
            (e.ribbon ? '<span class="en-ribbon" title="Ribboned">' + icon('ribbon', 'ic-sm') + '</span>' : '') +
          '</div>' +
          bodyHTML(e) +
          (branches.length
            ? '<div class="en-branches">' + branches.map((b) => '<a href="#t-' + b.id + '" class="en-branch">' + icon('branch', 'ic-sm') + '<span>' + esc(b.title) + '</span></a>').join('') + '</div>'
            : '') +
          actionsHTML(e) +
        '</div>' +
      '</article>';
    }
    function waypointHTML(e) {
      const lines = String(e.body || '').split('\n');
      const title = lines[0].trim() || 'Waypoint';
      const rest = lines.slice(1).join('\n').trim();
      const editing = S.editing === e.id;
      return '<section class="entry waypoint' + (e.ribbon ? ' is-ribbon' : '') + (editing ? ' is-editing' : '') + '" id="e-' + e.id + '">' +
        '<div class="wp-rule" aria-hidden="true">' + icon('fleuron') + '</div>' +
        (editing
          ? editorHTML(e)
          : '<h2 class="wp-title">' + FC.md.inline(title, { resolve: S.resolve }) + '</h2>' +
            (rest ? '<div class="wp-note prose">' + FC.md.render(rest, { resolve: S.resolve }) + '</div>' : '')) +
        '<p class="wp-meta">' + icon('waypoint', 'ic-sm') + 'Waypoint · ' + esc(U.fmtDate(e.created)) + (e.ribbon ? ' · ribboned' : '') + '</p>' +
        actionsHTML(e) +
      '</section>';
    }
    function entryHTML(e, i) {
      const prev = S.list[i - 1];
      let sep = '';
      if (!prev || U.dayKey(prev.created) !== U.dayKey(e.created)) sep = '<div class="day-sep"><span>' + esc(U.fmtDay(e.created)) + '</span></div>';
      else if (e.created - prev.created > 3 * 3600000) sep = '<div class="gap-sep" aria-hidden="true">' + icon('fleuron') + '</div>';
      return '<div class="ew" data-id="' + e.id + '">' + sep + (e.type === 'waypoint' ? waypointHTML(e) : articleHTML(e)) + '</div>';
    }
    function renderRange(a, b) {
      let h = '';
      for (let i = a; i < b; i++) h += entryHTML(S.list[i], i);
      return h;
    }
    function post(nodes) {
      const cur = S.find.i >= 0 ? S.list[S.find.hits[S.find.i]] : null;
      for (const n of nodes) {
        if (S.find.terms.length) {
          for (const b of n.querySelectorAll('.en-body, .wp-title, .wp-note')) UI.highlight(b, S.find.terms);
          if (cur && n.dataset.id === cur.id) n.classList.add('is-current-hit');
        }
        const ta = n.querySelector('.en-edit-ta');
        if (ta) wireEditor(ta);
      }
    }
    function insert(where, html) {
      const frag = U.frag(html);
      const nodes = Array.from(frag.children);
      if (where === 'top') EL.prepend(frag);
      else EL.append(frag);
      post(nodes);
      return nodes;
    }
    function nodeAt(i) {
      return EL.children[i - S.s] || null;
    }
    function rerenderEntry(id) {
      const node = EL.querySelector('.ew[data-id="' + id + '"]');
      const i = S.list.findIndex((x) => x.id === id);
      if (!node || i < 0) return null;
      const nn = U.frag(entryHTML(S.list[i], i)).firstElementChild;
      node.replaceWith(nn);
      post([nn]);
      return nn;
    }

    /* ───────────── the window ───────────── */

    function resetWindow(center, align) {
      const n = S.list.length;
      center = U.clamp(center, 0, Math.max(0, n - 1));
      let s = Math.max(0, center - Math.floor(WIN / 2));
      const e = Math.min(n, s + WIN);
      s = Math.max(0, e - WIN);
      S.s = s;
      S.e = e;
      EL.innerHTML = '';
      if (n) insert('bottom', renderRange(s, e));
      updateEnd();
      if (!n) SC.scrollTop = 0;
      else if (align === 'end') SC.scrollTop = SC.scrollHeight;
      else scrollToIndex(center, align || 'start');
      S.spineDirty = true;
      checkEdges();
      onScrollWork();
    }
    function extendTop() {
      if (S.s <= 0) return false;
      const ns = Math.max(0, S.s - STEP);
      const anchor = EL.firstElementChild;
      const before = anchor ? anchor.getBoundingClientRect().top : 0;
      insert('top', renderRange(ns, S.s));
      S.s = ns;
      if (anchor) SC.scrollTop += anchor.getBoundingClientRect().top - before;
      trim('bottom');
      return true;
    }
    function extendBottom() {
      if (S.e >= S.list.length) return false;
      const ne = Math.min(S.list.length, S.e + STEP);
      insert('bottom', renderRange(S.e, ne));
      S.e = ne;
      trim('top');
      updateEnd();
      return true;
    }
    function trim(side) {
      const excess = S.e - S.s - MAXR;
      if (excess <= 0) return;
      if (side === 'bottom') {
        for (let k = 0; k < excess; k++) {
          const last = EL.lastElementChild;
          if (S.editing && last.dataset.id === S.editing) break;
          last.remove();
          S.e--;
        }
        updateEnd();
      } else {
        const anchor = EL.children[excess];
        const before = anchor.getBoundingClientRect().top;
        for (let k = 0; k < excess; k++) {
          const first = EL.firstElementChild;
          if (S.editing && first.dataset.id === S.editing) break;
          first.remove();
          S.s++;
        }
        SC.scrollTop += anchor.getBoundingClientRect().top - before;
      }
    }
    function checkEdges() {
      for (let guard = 0; guard < 8; guard++) {
        const top = SC.scrollTop;
        const bottom = SC.scrollHeight - SC.scrollTop - SC.clientHeight;
        if (top < EDGE && S.s > 0) { extendTop(); continue; }
        if (bottom < EDGE && S.e < S.list.length) { extendBottom(); continue; }
        break;
      }
    }
    function refreshWindow() {
      const n = S.list.length;
      const scTop = SC.getBoundingClientRect().top;
      let anchorId = null;
      let offset = 0;
      for (const k of EL.children) {
        const r = k.getBoundingClientRect();
        if (r.bottom > scTop + 4) { anchorId = k.dataset.id; offset = r.top - scTop; break; }
      }
      const atBottom = SC.scrollHeight - SC.scrollTop - SC.clientHeight < 40 && S.e >= S.list.length;
      let s = Math.min(S.s, Math.max(0, n - 1));
      let e = Math.min(Math.max(S.e, s + 1), n);
      if (anchorId) {
        const ai = S.list.findIndex((x) => x.id === anchorId);
        if (ai >= 0 && (ai < s || ai >= e)) { s = Math.max(0, ai - 10); e = Math.min(n, ai + WIN); }
      }
      if (!n) { s = 0; e = 0; }
      S.s = s;
      S.e = e;
      EL.innerHTML = '';
      if (n) insert('bottom', renderRange(s, e));
      updateEnd();
      if (atBottom) SC.scrollTop = SC.scrollHeight;
      else if (anchorId) {
        const node = EL.querySelector('.ew[data-id="' + anchorId + '"]');
        if (node) SC.scrollTop += node.getBoundingClientRect().top - scTop - offset;
      }
      S.spineDirty = true;
      checkEdges();
      onScrollWork();
    }
    function scrollToIndex(i, align) {
      const node = nodeAt(i);
      if (!node) return;
      const art = node.querySelector('.entry') || node;
      const top = art.getBoundingClientRect().top - SC.getBoundingClientRect().top + SC.scrollTop;
      const target = align === 'center' ? top - SC.clientHeight / 3 : top - 20;
      SC.scrollTop = Math.max(0, target);
    }
    function jumpTo(i, o) {
      o = o || {};
      if (i < 0 || i >= S.list.length) return;
      if (i >= S.s && i < S.e) {
        scrollToIndex(i, o.align || 'start');
        checkEdges();
        if (nodeAt(i)) scrollToIndex(i, o.align || 'start');
      } else resetWindow(i, o.align || 'start');
      if (o.flash !== false) flash(S.list[i].id);
      onScrollWork();
    }
    function jumpToId(id, o) {
      let i = S.list.findIndex((e) => e.id === id);
      if (i < 0 && (S.filter || S.ribbonsOnly)) {
        S.filter = null;
        S.ribbonsOnly = false;
        computeList();
        renderFilters();
        renderHead();
        i = S.list.findIndex((e) => e.id === id);
      }
      if (i >= 0) jumpTo(i, o);
    }
    function flash(id) {
      const el = document.getElementById('e-' + id);
      if (!el) return;
      el.classList.remove('is-flash');
      void el.offsetWidth;
      el.classList.add('is-flash');
      setTimeout(() => el.classList.remove('is-flash'), 1900);
    }

    /* ───────────── scrolling, reading position ───────────── */

    const saveLastRead = U.debounce((id) => U.pref.set('lr:' + tid, id), 700);
    function computeVis() {
      const kids = EL.children;
      if (!kids.length) return [0, 0];
      const top = SC.getBoundingClientRect().top;
      const h = SC.clientHeight;
      let lo = 0;
      let hi = kids.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (kids[mid].getBoundingClientRect().bottom < top + 32) lo = mid + 1;
        else hi = mid;
      }
      let last = lo;
      while (last + 1 < kids.length && kids[last + 1].getBoundingClientRect().top < top + h) last++;
      return [S.s + lo, S.s + last];
    }
    function onScrollWork() {
      if (ac.signal.aborted || !SC.isConnected) return;
      checkEdges();
      const n = S.list.length;
      if (!n) {
        S.vis = [0, 0];
        LATEST.hidden = true;
        drawSpine();
        return;
      }
      S.vis = computeVis();
      const nearBottom = SC.scrollHeight - SC.scrollTop - SC.clientHeight < 120;
      LATEST.hidden = S.e >= n && nearBottom;
      const first = S.list[S.vis[0]];
      if (first && S.touched) saveLastRead(first.id);
      SP.setAttribute('aria-valuemax', String(n));
      SP.setAttribute('aria-valuenow', String(S.vis[0] + 1));
      SP.setAttribute('aria-valuetext', 'Entry ' + (S.vis[0] + 1) + ' of ' + n + (first ? ', ' + U.fmtDate(first.created) : ''));
      drawSpine();
    }
    SC.addEventListener('scroll', U.rafThrottle(onScrollWork), Object.assign({ passive: true }, sig));
    for (const evName of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
      SC.addEventListener(evName, () => { S.touched = true; }, Object.assign({ passive: true }, sig));
    }

    /* ───────────── the spine ───────────── */

    function spineColors() {
      const cs = getComputedStyle(SEC);
      const g = (n) => cs.getPropertyValue(n).trim() || '#888';
      return {
        rule: g('--rule'), view: g('--spine-view'), musing: g('--ink-3'), whatif: g('--t-whatif'), riddle: g('--t-riddle'),
        canon: g('--t-canon'), fragment: g('--t-fragment'), lore: g('--t-lore'), waypoint: g('--gold-leaf'), oracle: g('--t-oracle'),
        ribbon: g('--rubric'), hit: g('--mark-strong'),
      };
    }
    function buildSpineCache(w, h, dpr) {
      const cv = document.createElement('canvas');
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      const C = spineColors();
      S.colors = C;
      const n = S.list.length;
      const H = h - PAD * 2;
      ctx.fillStyle = C.rule;
      ctx.fillRect(Math.round(w / 2) - 0.5, PAD, 1, H);
      const hits = new Set(S.find.hits);
      for (let i = 0; i < n; i++) {
        const e = S.list[i];
        const y = PAD + ((i + 0.5) / n) * H;
        let col = C[e.type] || C.musing;
        let len = 6;
        let th = 1.5;
        let alpha = 1;
        switch (e.type) {
          case 'musing': len = 4; th = 1; alpha = 0.6; break;
          case 'canon': len = w - 4; th = 2; break;
          case 'waypoint': len = w; th = 2.5; break;
          case 'riddle': len = e.resolved ? 4 : 9; th = 2; if (e.resolved) { col = C.musing; alpha = 0.6; } break;
          case 'fragment': len = 9; break;
          default: break;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = col;
        ctx.fillRect((w - len) / 2, y - th / 2, len, th);
        if (e.ribbon) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = C.ribbon;
          ctx.beginPath();
          ctx.moveTo(w, y - 3.5);
          ctx.lineTo(w - 5, y);
          ctx.lineTo(w, y + 3.5);
          ctx.closePath();
          ctx.fill();
        }
        if (hits.has(i)) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = C.hit;
          ctx.fillRect(0, y - 1.25, w, 2.5);
        }
      }
      ctx.globalAlpha = 1;
      return cv;
    }
    function drawSpine() {
      if (ac.signal.aborted || !SP.isConnected) return;
      const dpr = window.devicePixelRatio || 1;
      const w = SP.clientWidth;
      const h = SP.clientHeight;
      if (!w || !h) return;
      const pw = Math.round(w * dpr);
      const ph = Math.round(h * dpr);
      if (SP.width !== pw || SP.height !== ph) { SP.width = pw; SP.height = ph; S.spineDirty = true; }
      if (S.spineDirty || !S.spineCache) { S.spineCache = buildSpineCache(w, h, dpr); S.spineDirty = false; }
      const ctx = SP.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      const n = S.list.length;
      if (n) {
        const H = h - PAD * 2;
        const y0 = PAD + (S.vis[0] / n) * H;
        const y1 = PAD + ((S.vis[1] + 1) / n) * H;
        const bh = Math.max(8, y1 - y0);
        const by = Math.min(y0, h - PAD - bh);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = S.colors ? S.colors.view : 'rgba(0,0,0,.08)';
        ctx.fillRect(0, by, w, bh);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.drawImage(S.spineCache, 0, 0);
    }
    function idxAtY(clientY) {
      const r = SP.getBoundingClientRect();
      const f = (clientY - r.top - PAD) / (r.height - PAD * 2);
      return U.clamp(Math.floor(f * S.list.length), 0, S.list.length - 1);
    }
    function showTip(clientY) {
      if (!S.list.length) return;
      const i = idxAtY(clientY);
      const e = S.list[i];
      const T = M.TYPES[e.type];
      TIP.innerHTML =
        '<span class="tip-head"><span class="tip-type t-' + e.type + '">' + (e.type === 'waypoint' ? esc(U.firstLine(e.body)) : T.label) + '</span>' +
        '<span class="tip-date">' + esc(U.fmtDate(e.created)) + ' · ' + (i + 1) + '/' + S.list.length + '</span></span>' +
        (e.type === 'waypoint' ? '' : '<span class="tip-text">' + esc(U.snippet(e.body, 120)) + '</span>');
      TIP.hidden = false;
      const body = SP.parentElement.getBoundingClientRect();
      const top = U.clamp(clientY - body.top - TIP.offsetHeight / 2, 6, body.height - TIP.offsetHeight - 6);
      TIP.style.top = top + 'px';
    }
    function hideTip() {
      TIP.hidden = true;
    }
    const dragJump = U.rafThrottle((y) => {
      jumpTo(idxAtY(y), { flash: false });
      showTip(y);
    });
    SP.addEventListener('pointerdown', (ev) => {
      if (!S.list.length) return;
      S.touched = true;
      S.dragging = true;
      try { SP.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      dragJump(ev.clientY);
      ev.preventDefault();
    }, sig);
    SP.addEventListener('pointermove', (ev) => {
      if (S.dragging) dragJump(ev.clientY);
      else if (ev.pointerType === 'mouse') showTip(ev.clientY);
    }, sig);
    const endDrag = () => {
      if (!S.dragging) return;
      S.dragging = false;
      setTimeout(hideTip, 600);
    };
    SP.addEventListener('pointerup', endDrag, sig);
    SP.addEventListener('pointercancel', endDrag, sig);
    SP.addEventListener('pointerleave', () => { if (!S.dragging) hideTip(); }, sig);
    SP.addEventListener('wheel', (ev) => {
      S.touched = true;
      SC.scrollTop += ev.deltaMode === 1 ? ev.deltaY * 32 : ev.deltaY;
      ev.preventDefault();
    }, Object.assign({ passive: false }, sig));
    SP.addEventListener('keydown', (ev) => {
      const n = S.list.length;
      if (!n) return;
      const cur = S.vis[0];
      const page = Math.max(1, Math.round(n / 10));
      let to = null;
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') to = cur + 1;
      else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') to = cur - 1;
      else if (ev.key === 'PageDown') to = cur + page;
      else if (ev.key === 'PageUp') to = cur - page;
      else if (ev.key === 'Home') to = 0;
      else if (ev.key === 'End') to = n - 1;
      if (to == null) return;
      ev.preventDefault();
      S.touched = true;
      jumpTo(U.clamp(to, 0, n - 1), { flash: false });
    }, sig);
    LATEST.addEventListener('click', () => {
      S.touched = true;
      if (S.e >= S.list.length) SC.scrollTo({ top: SC.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' });
      else resetWindow(S.list.length - 1, 'end');
    }, sig);

    const ro = new ResizeObserver(U.rafThrottle(() => { S.spineDirty = true; onScrollWork(); }));
    ro.observe(SP);
    window.addEventListener('fc:theme', () => { S.spineDirty = true; drawSpine(); }, sig);
    if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { S.spineDirty = true; setTimeout(drawSpine, 30); }, sig);

    /* ───────────── editing ───────────── */

    function wireEditor(ta) {
      UI.autosize(ta, () => Math.max(180, SC.clientHeight * 0.7));
      UI.linker(ta, () => t.realmId);
      ta.addEventListener('input', () => { S.editDraft = ta.value; });
      ta.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); saveEdit(); }
        else if (ev.key === 'Escape') { ev.preventDefault(); cancelEdit(); }
      });
    }
    function startEdit(id) {
      if (S.editing && S.editing !== id) saveEdit();
      const e = M.byId.get(id);
      if (!e) return;
      S.editing = id;
      S.editDraft = e.body;
      const nn = rerenderEntry(id);
      const ta = nn && nn.querySelector('.en-edit-ta');
      if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    }
    function saveEdit() {
      const id = S.editing;
      if (!id) return;
      const body = S.editDraft;
      S.editing = null;
      const e = M.byId.get(id);
      if (!e) return;
      if (!body.trim()) {
        rerenderEntry(id);
        UI.toast('An entry can’t be empty. Delete it from the ⋯ menu if you no longer need it.');
        return;
      }
      if (body !== e.body) M.updateEntry(id, { body });
      else rerenderEntry(id);
    }
    function cancelEdit() {
      const id = S.editing;
      S.editing = null;
      if (id) rerenderEntry(id);
    }

    /* ───────────── entry actions ───────────── */

    EL.addEventListener('click', (ev) => {
      const wl = ev.target.closest('a.wl');
      if (wl) { ev.preventDefault(); FC.app.openName(t.realmId, wl.dataset.wl); return; }
      const btn = ev.target.closest('[data-act]');
      if (!btn) return;
      const ew = btn.closest('.ew');
      const id = ew && ew.dataset.id;
      const e = id && M.byId.get(id);
      if (!e) return;
      S.touched = true;
      switch (btn.dataset.act) {
        case 'ribbon': M.updateEntry(id, { ribbon: !e.ribbon }); break;
        case 'resolve':
          M.updateEntry(id, { resolved: !e.resolved });
          UI.toast(e.resolved ? 'Riddle marked answered' : 'Riddle reopened');
          break;
        case 'branch': branchFrom(e); break;
        case 'edit': startEdit(id); break;
        case 'edit-save': saveEdit(); break;
        case 'edit-cancel': cancelEdit(); break;
        case 'menu': entryMenu(btn, e); break;
        default: break;
      }
    }, sig);
    END.addEventListener('click', (ev) => {
      if (ev.target.closest('[data-act="filter-clear"]')) clearFilters();
    }, sig);

    async function entryMenu(anchor, e) {
      const items = [];
      if (window.matchMedia && matchMedia('(hover: none)').matches) {
        if (e.type === 'riddle') items.push({ label: e.resolved ? 'Reopen riddle' : 'Mark answered', icon: 'check', value: 'resolve' });
        items.push(
          { label: e.ribbon ? 'Remove ribbon' : 'Ribbon this entry', icon: 'ribbon', value: 'ribbon' },
          { label: 'Branch from here', icon: 'branch', value: 'branch' },
          { label: 'Edit', icon: 'edit', value: 'edit' },
          { sep: true }
        );
      }
      items.push({ heading: 'Change kind' });
      for (const ty of M.TYPE_ORDER) items.push({ label: M.TYPES[ty].label, icon: M.TYPES[ty].icon, value: 'type:' + ty, checked: ty === e.type });
      items.push({ sep: true }, { label: 'Copy text', icon: 'copy', value: 'copy' }, { label: 'Delete entry', icon: 'trash', value: 'delete', danger: true });
      const v = await UI.menu(anchor, items, { label: 'Entry actions' });
      if (!v) return;
      if (v.startsWith('type:')) { M.updateEntry(e.id, { type: v.slice(5) }); return; }
      if (v === 'resolve') M.updateEntry(e.id, { resolved: !e.resolved });
      else if (v === 'ribbon') M.updateEntry(e.id, { ribbon: !e.ribbon });
      else if (v === 'branch') branchFrom(e);
      else if (v === 'edit') startEdit(e.id);
      else if (v === 'copy') UI.copy(e.body);
      else if (v === 'delete') {
        if (S.editing === e.id) S.editing = null;
        const removed = M.deleteEntry(e.id);
        UI.toast('Entry deleted', { action: { label: 'Undo', fn: () => M.restoreEntry(removed) } });
      }
    }

    async function branchFrom(e) {
      const first = U.firstLine(e.body);
      const suggestion = first.length <= 90 ? first : U.snippet(first, 90);
      const body = U.el(
        '<form class="form">' +
          '<label class="field"><span class="field-label">Title of the new thread</span><input type="text" id="br-title" maxlength="200" autofocus></label>' +
          '<label class="check"><input type="checkbox" id="br-quote" checked><span>Quote this entry as the new thread’s first entry</span></label>' +
          '<p class="muted small">The new thread stays linked to this entry. You’ll find a link to it here, under the entry.</p>' +
        '</form>'
      );
      body.querySelector('#br-title').value = suggestion;
      const r = await UI.modal({
        title: 'Branch a new thread',
        body,
        actions: [
          { label: 'Cancel', value: null },
          {
            label: 'Branch',
            tone: 'primary',
            validate: (d) => (d.querySelector('#br-title').value.trim() ? null : 'Give the new thread a title.'),
            value: (d) => ({ title: d.querySelector('#br-title').value, quote: d.querySelector('#br-quote').checked }),
          },
        ],
      });
      if (!r) return;
      const nt = M.createThread(t.realmId, { title: r.title, parentId: tid, parentEntryId: e.id, tags: t.tags });
      if (r.quote) {
        M.addEntry(nt.id, { type: 'musing', body: e.body.split('\n').map((l) => '> ' + l).join('\n') + '\n\nBranched from “' + t.title + '”.' });
      }
      FC.app.go('t-' + nt.id);
    }

    /* ───────────── header actions ───────────── */

    HEAD.addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-act]');
      if (!b) return;
      switch (b.dataset.act) {
        case 'rename': rename(); break;
        case 'status': statusMenu(b); break;
        case 'tags': editTags(); break;
        case 'find': toggleFind(); break;
        case 'find-next': findStep(1); break;
        case 'find-prev': findStep(-1); break;
        case 'find-close': closeFind(); break;
        case 'filter': S.filterOpen = !S.filterOpen; renderFilters(); renderHead(); break;
        case 'filter-type': toggleType(b.dataset.type); break;
        case 'filter-ribbon': S.ribbonsOnly = !S.ribbonsOnly; applyFilter(); break;
        case 'filter-clear': clearFilters(); break;
        case 'skim': toggleSkim(); break;
        case 'margin': FC.app.toggleMargin(); renderHead(); break;
        case 'more': moreMenu(b); break;
        default: break;
      }
    }, sig);

    function rename() {
      const h1 = HM.querySelector('.th-title');
      if (!h1 || h1.querySelector('input')) return;
      h1.innerHTML = '<label class="sr-only" for="th-rename">Thread title</label><input type="text" id="th-rename" class="th-rename" maxlength="200">';
      const inp = h1.querySelector('input');
      inp.value = t.title;
      inp.focus();
      inp.select();
      let done = false;
      const finish = (save) => {
        if (done) return;
        done = true;
        if (save && inp.value.trim() && inp.value.trim() !== t.title) M.updateThread(tid, { title: inp.value });
        else renderHead();
      };
      inp.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
        else if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
      });
      inp.addEventListener('blur', () => finish(true));
    }
    async function statusMenu(anchor) {
      const v = await UI.menu(
        anchor,
        M.STATUS_ORDER.map((s) => ({ label: M.STATUSES[s].label, gloss: M.STATUSES[s].gloss, icon: M.STATUSES[s].icon, value: s, checked: s === t.status, cls: 'st-' + s })),
        { align: 'left', label: 'Status' }
      );
      if (v && v !== t.status) M.updateThread(tid, { status: v });
    }
    async function editTags() {
      const known = new Set();
      for (const th of M.threadsOf(t.realmId)) for (const x of th.tags) known.add(x);
      const body = U.el(
        '<form class="form"><label class="field"><span class="field-label">Tags, separated by commas</span><input type="text" id="tg-input" autocomplete="off"></label>' +
        (known.size ? '<div class="chip-row" id="tg-known"></div>' : '') + '</form>'
      );
      const inp = body.querySelector('#tg-input');
      inp.value = t.tags.join(', ');
      const kr = body.querySelector('#tg-known');
      if (kr) {
        for (const x of [...known].sort()) {
          const c = U.el('<button type="button" class="chip chip-sm"></button>');
          c.textContent = '#' + x;
          c.addEventListener('click', () => {
            const cur = U.splitList(inp.value);
            if (!cur.includes(x)) cur.push(x);
            inp.value = cur.join(', ');
            inp.focus();
          });
          kr.appendChild(c);
        }
      }
      const v = await UI.modal({ title: 'Tags for this thread', body, actions: [{ label: 'Cancel', value: null }, { label: 'Save tags', tone: 'primary', value: (d) => d.querySelector('#tg-input').value }] });
      if (v != null) M.updateThread(tid, { tags: v });
    }
    function toggleSkim() {
      const keep = S.list[S.vis[0]];
      S.skim = !S.skim;
      U.pref.set('skim', S.skim);
      SEC.classList.toggle('is-skim', S.skim);
      renderHead();
      if (keep) jumpToId(keep.id, { flash: false });
    }
    async function moreMenu(anchor) {
      const v = await UI.menu(anchor, [
        { label: 'Go to the first entry', icon: 'up', value: 'first' },
        { label: 'Go to the latest entry', icon: 'down', value: 'last' },
        { sep: true },
        { label: 'Export as Markdown', icon: 'export', value: 'md' },
        { label: 'Copy as Markdown', icon: 'copy', value: 'copy' },
        { sep: true },
        { label: 'Delete thread', icon: 'trash', value: 'delete', danger: true },
      ], { label: 'Thread actions' });
      if (v === 'first') { S.touched = true; jumpTo(0, { flash: false }); }
      else if (v === 'last') { S.touched = true; resetWindow(S.list.length - 1, 'end'); }
      else if (v === 'md') UI.saveFile(U.slug(t.title) + '.md', M.threadMarkdown(tid), 'text/markdown');
      else if (v === 'copy') UI.copy(M.threadMarkdown(tid));
      else if (v === 'delete') {
        const kids = M.children(tid).length;
        const ok = await UI.confirm({
          title: 'Delete this thread?',
          body: '“' + t.title + '” and its ' + U.plural(S.all.length, 'entry', 'entries') + ' will be deleted.' + (kids ? ' Its ' + U.plural(kids, 'branch', 'branches') + ' will stay, moved up a level.' : ''),
          confirm: 'Delete thread',
          danger: true,
        });
        if (!ok) return;
        const snap = M.deleteThread(tid);
        FC.app.go('threads');
        UI.toast('Thread deleted', { action: { label: 'Undo', fn: () => { M.restoreThread(snap); FC.app.go('t-' + snap.thread.id); } } });
      }
    }

    /* ───────────── filters ───────────── */

    function anchorSeq() {
      const e = S.list[S.vis[0]];
      return e ? e.seq : null;
    }
    function applyFilter() {
      const seq = anchorSeq();
      computeList();
      renderFilters();
      renderHead();
      let i = seq == null ? S.list.length - 1 : S.list.findIndex((e) => e.seq >= seq);
      if (i < 0) i = S.list.length - 1;
      resetWindow(i, 'start');
    }
    function toggleType(ty) {
      if (!S.filter) S.filter = new Set();
      if (S.filter.has(ty)) S.filter.delete(ty);
      else S.filter.add(ty);
      if (!S.filter.size) S.filter = null;
      applyFilter();
    }
    function clearFilters() {
      S.filter = null;
      S.ribbonsOnly = false;
      applyFilter();
    }

    /* ───────────── find ───────────── */

    function computeHits() {
      S.find.hits = [];
      const terms = S.find.terms;
      if (!terms.length) return;
      for (let i = 0; i < S.list.length; i++) {
        const l = S.list[i].body.toLowerCase();
        let ok = true;
        for (const term of terms) if (l.indexOf(term) < 0) { ok = false; break; }
        if (ok) S.find.hits.push(i);
      }
    }
    function updateFindCount() {
      const n = S.find.hits.length;
      if (!S.find.terms.length) FINDCT.textContent = '';
      else if (!n) FINDCT.textContent = 'No matches';
      else if (S.find.i < 0) FINDCT.textContent = U.plural(n, 'match', 'matches');
      else FINDCT.textContent = S.find.i + 1 + ' of ' + n;
    }
    const runFind = U.debounce(() => {
      S.find.q = FINDIN.value;
      S.find.terms = U.normName(FINDIN.value).split(' ').filter(Boolean);
      S.find.i = -1;
      computeHits();
      S.spineDirty = true;
      refreshWindow();
      updateFindCount();
    }, 220);
    function findStep(dir) {
      runFind.cancel();
      if (FINDIN.value !== S.find.q) {
        S.find.q = FINDIN.value;
        S.find.terms = U.normName(FINDIN.value).split(' ').filter(Boolean);
        S.find.i = -1;
        computeHits();
        S.spineDirty = true;
      }
      const hits = S.find.hits;
      if (!hits.length) { updateFindCount(); refreshWindow(); return; }
      if (S.find.i < 0) {
        const cur = S.vis[0];
        if (dir > 0) { const k = hits.findIndex((h) => h >= cur); S.find.i = k < 0 ? 0 : k; }
        else { let k = -1; for (let j = hits.length - 1; j >= 0; j--) if (hits[j] <= cur) { k = j; break; } S.find.i = k < 0 ? hits.length - 1 : k; }
      } else S.find.i = (S.find.i + dir + hits.length) % hits.length;
      for (const n of EL.querySelectorAll('.is-current-hit')) n.classList.remove('is-current-hit');
      S.touched = true;
      const i = hits[S.find.i];
      if (i >= S.s && i < S.e) {
        const node = nodeAt(i);
        if (node && !node.querySelector('mark')) post([node]);
        if (node) node.classList.add('is-current-hit');
      }
      jumpTo(i, { align: 'center', flash: false });
      const node = nodeAt(i);
      if (node) node.classList.add('is-current-hit');
      updateFindCount();
    }
    function toggleFind() {
      if (S.findOpen) { FINDIN.focus(); FINDIN.select(); return; }
      S.findOpen = true;
      FIND.hidden = false;
      renderHead();
      FINDIN.focus();
      FINDIN.select();
    }
    function closeFind() {
      S.findOpen = false;
      FIND.hidden = true;
      FINDIN.value = '';
      runFind.cancel();
      const had = S.find.terms.length;
      S.find = { q: '', terms: [], hits: [], i: -1 };
      S.spineDirty = true;
      renderHead();
      if (had) refreshWindow();
      FINDCT.textContent = '';
    }
    FINDIN.addEventListener('input', runFind, sig);
    FINDIN.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { ev.preventDefault(); findStep(ev.shiftKey ? -1 : 1); }
      else if (ev.key === 'Escape') { ev.preventDefault(); closeFind(); }
    }, sig);

    /* ───────────── composer ───────────── */

    function renderComposer() {
      CMP.innerHTML =
        '<div id="cmp-reentry" hidden></div>' +
        '<div id="cmp-oracle" hidden></div>' +
        '<div class="cmp-inner">' +
          '<div class="cmp-types" role="radiogroup" aria-label="Kind of entry">' +
            M.TYPE_ORDER.map((ty) =>
              '<button type="button" role="radio" class="cmp-type t-' + ty + '" data-type="' + ty + '" aria-checked="' + (ty === S.type) + '" tabindex="' + (ty === S.type ? 0 : -1) + '" title="' + esc(M.TYPES[ty].gloss) + '">' +
                icon(M.TYPES[ty].icon) + '<span>' + M.TYPES[ty].label + '</span></button>'
            ).join('') +
          '</div>' +
          '<div class="cmp-field"><label class="sr-only" for="cmp-input">New entry</label><textarea id="cmp-input" rows="2"></textarea></div>' +
          '<div class="cmp-foot">' +
            '<span class="cmp-hint">Ctrl+Enter inscribes · <code>[[Name]]</code> links the codex</span>' +
            '<span class="cmp-count" id="cmp-count" hidden></span>' +
            '<button type="button" class="btn btn-ghost btn-sm cmp-draw" data-act="draw" aria-label="Draw a question from the Oracle" title="Draw a question from the Oracle">' + icon('oracle') + '<span>Draw a question</span></button>' +
            '<button type="submit" class="btn btn-primary cmp-send" aria-label="Inscribe" title="Inscribe (Ctrl+Enter)">' + icon('musing') + '<span>Inscribe</span></button>' +
          '</div>' +
        '</div>';
      TA = CMP.querySelector('#cmp-input');
      fitTA = UI.autosize(TA, () => Math.max(96, window.innerHeight * 0.38));
      UI.linker(TA, () => t.realmId);
      setType(S.type, true);
    }
    function setType(ty, silent) {
      S.type = ty;
      for (const b of CMP.querySelectorAll('.cmp-type')) {
        const on = b.dataset.type === ty;
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      }
      CMP.className = 'composer cmp-is-' + ty;
      if (TA) TA.placeholder = M.TYPES[ty].hint;
      if (!silent) saveDraft();
    }
    const saveDraft = U.debounce(() => {
      if (!TA) return;
      if (TA.value.trim()) U.pref.set('draft:' + tid, { type: S.type, body: TA.value });
      else U.pref.del('draft:' + tid);
    }, 400);
    function updateCharCount() {
      const ct = CMP.querySelector('#cmp-count');
      const n = TA.value.length;
      if (n > M.MAX_TEXT * 0.8) {
        ct.hidden = false;
        ct.textContent = U.num(M.MAX_TEXT - n) + ' characters left';
        ct.classList.toggle('is-over', n > M.MAX_TEXT);
      } else ct.hidden = true;
    }
    function submit() {
      const body = TA.value.replace(/\s+$/, '');
      if (!body.trim()) { TA.focus(); return; }
      if (body.length > M.MAX_TEXT) {
        UI.toast('That entry is longer than ' + U.num(M.MAX_TEXT) + ' characters. Split it into two entries.', { tone: 'warn' });
        return;
      }
      S.touched = true;
      closeReentry();
      const ty = S.type;
      TA.value = '';
      fitTA();
      saveDraft.cancel();
      U.pref.del('draft:' + tid);
      updateCharCount();
      M.addEntry(tid, { type: ty, body });
      if (ty === 'waypoint') setType('musing', true);
      TA.focus();
    }
    CMP.addEventListener('submit', (ev) => { ev.preventDefault(); submit(); }, sig);
    CMP.addEventListener('click', (ev) => {
      const tb = ev.target.closest('.cmp-type');
      if (tb) { setType(tb.dataset.type); TA.focus(); return; }
      const b = ev.target.closest('[data-act]');
      if (!b) return;
      switch (b.dataset.act) {
        case 'draw':
        case 'card-again': drawCard(); break;
        case 'card-take': takeCard(); break;
        case 'card-close': CMP.querySelector('#cmp-oracle').hidden = true; S.card = null; break;
        case 're-last': S.touched = true; resetWindow(S.list.length - 1, 'end'); closeReentry(); break;
        case 're-margin': if (!FC.app.marginOpen()) FC.app.toggleMargin(); renderHead(); closeReentry(); break;
        case 're-close': closeReentry(); break;
        default: break;
      }
    }, sig);
    CMP.addEventListener('keydown', (ev) => {
      const tb = ev.target.closest && ev.target.closest('.cmp-type');
      if (tb && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(ev.key)) {
        ev.preventDefault();
        const i = M.TYPE_ORDER.indexOf(S.type);
        const d = ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? -1 : 1;
        const ty = M.TYPE_ORDER[(i + d + M.TYPE_ORDER.length) % M.TYPE_ORDER.length];
        setType(ty);
        CMP.querySelector('.cmp-type[data-type="' + ty + '"]').focus();
        return;
      }
      if (ev.target === TA) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); submit(); }
        else if (ev.key === 'Escape') TA.blur();
      }
    }, sig);
    CMP.addEventListener('input', (ev) => {
      if (ev.target === TA) { saveDraft(); updateCharCount(); }
    }, sig);

    function drawCard() {
      const card = FC.oracle.draw(null);
      S.card = card;
      const OC = CMP.querySelector('#cmp-oracle');
      OC.innerHTML =
        '<div class="mini-card' + (reduced() ? '' : ' is-drawn') + '">' +
          '<p class="mini-card-head">' + icon('oracle') + '<span>' + esc(card.label) + '</span><span class="mini-card-num">No. ' + U.roman(card.n) + '</span></p>' +
          '<p class="mini-card-q">' + esc(card.q) + '</p>' +
          '<div class="mini-card-actions">' +
            '<button type="button" class="btn btn-primary btn-sm" data-act="card-take">Inscribe this question</button>' +
            '<button type="button" class="btn btn-ghost btn-sm" data-act="card-again">Draw another</button>' +
            '<button type="button" class="icon-btn" data-act="card-close" title="Put it back" aria-label="Put the card back">' + icon('close') + '</button>' +
          '</div>' +
        '</div>';
      OC.hidden = false;
    }
    function takeCard() {
      if (!S.card) return;
      S.touched = true;
      M.addEntry(tid, { type: 'oracle', body: S.card.q, oracle: S.card.cat });
      CMP.querySelector('#cmp-oracle').hidden = true;
      S.card = null;
      setType('musing', true);
      TA.focus();
    }

    function maybeReentry() {
      const last = S.all[S.all.length - 1];
      if (!last || S.all.length < 4 || opts.entry || Date.now() - last.created < 12 * 3600000) return;
      const open = S.all.filter((e) => e.type === 'riddle' && !e.resolved).length;
      const RE = CMP.querySelector('#cmp-reentry');
      RE.innerHTML =
        '<div class="reentry">' +
          '<p><strong>You last wrote here ' + esc(U.ago(last.created)) + '.</strong> ' +
            (open ? '<span>' + U.plural(open, 'riddle') + ' still open.</span> ' : '') +
            '<span class="re-distill">' +
            (t.distillation.trim()
              ? 'Your distillation begins: <em>“' + esc(U.snippet(t.distillation, 150)) + '”</em>'
              : 'There’s no distillation yet. A few lines on what you now believe will make the next return easier.') +
            '</span>' +
          '</p>' +
          '<div class="reentry-actions">' +
            '<button type="button" class="btn btn-ghost btn-sm" data-act="re-last">Read the last entry</button>' +
            '<button type="button" class="btn btn-ghost btn-sm re-margin" data-act="re-margin">Open the margin</button>' +
            '<button type="button" class="icon-btn" data-act="re-close" title="Dismiss" aria-label="Dismiss">' + icon('close') + '</button>' +
          '</div>' +
        '</div>';
      RE.hidden = false;
    }
    function closeReentry() {
      const RE = CMP.querySelector('#cmp-reentry');
      if (RE) RE.hidden = true;
    }

    /* ───────────── margin ───────────── */

    function mgList(key, title, items, text, emptyText, ic) {
      if (!items.length) return '<section class="mg-sec"><h2>' + title + '</h2><p class="mg-empty">' + emptyText + '</p></section>';
      const max = 10;
      const all = S.mgExpand.has(key);
      const shown = all ? items : items.slice(-max);
      return '<section class="mg-sec"><h2>' + title + ' <span class="mg-count">' + items.length + '</span></h2>' +
        (items.length > max ? '<button type="button" class="linkish mg-more" data-mg="expand" data-key="' + key + '">' + (all ? 'Show only the latest ' + max : 'Show all ' + items.length) + '</button>' : '') +
        '<ol class="mg-list">' +
        shown.map((e) => '<li><button type="button" class="mg-item t-' + e.type + '" data-jump="' + e.id + '">' + icon(ic || M.TYPES[e.type].icon, 'ic-sm') + '<span>' + esc(text(e)) + '</span></button></li>').join('') +
        '</ol></section>';
    }
    function renderMargin() {
      const MG = document.getElementById('margin-body');
      if (!MG) return;
      const all = S.all;
      const waypoints = all.filter((e) => e.type === 'waypoint');
      const ribbons = all.filter((e) => e.ribbon);
      const canon = all.filter((e) => e.type === 'canon');
      const riddles = all.filter((e) => e.type === 'riddle' && !e.resolved);
      const ment = M.threadMentions(tid);
      const parent = t.parentId ? M.threads.get(t.parentId) : null;
      const kids = M.children(tid);
      let h = '<section class="mg-sec mg-distill"><header class="mg-head"><h2>Distillation</h2>' +
        (S.distilling ? '' : '<button type="button" class="btn btn-ghost btn-sm" data-mg="distill">' + (t.distillation.trim() ? 'Revise' : 'Write') + '</button>') +
        '</header>';
      if (S.distilling) {
        h += '<div class="mg-edit"><label class="sr-only" for="mg-distill-ta">Distillation</label><textarea id="mg-distill-ta">' + esc(S.distillDraft) + '</textarea>' +
          '<div class="mg-edit-actions"><button type="button" class="btn btn-ghost btn-sm" data-mg="distill-cancel">Cancel</button><button type="button" class="btn btn-primary btn-sm" data-mg="distill-save">Save</button></div></div>';
      } else if (t.distillation.trim()) {
        h += '<div class="prose prose-sm">' + FC.md.render(t.distillation, { resolve: S.resolve }) + '</div><p class="mg-note">Revised ' + esc(U.ago(t.distilled || t.updated)) + '</p>';
      } else {
        h += '<p class="mg-empty">What do you believe about this idea now? Write it in a few lines and revise it as the thread grows. The thread keeps the history; the distillation holds the current truth.</p>';
      }
      h += '</section>';
      h += mgList('wp', 'Waypoints', waypoints, (e) => U.firstLine(e.body), 'Add a <em>Waypoint</em> entry to divide a long thread into stretches.', 'waypoint');
      h += mgList('rb', 'Ribbons', ribbons, (e) => U.snippet(e.body, 90), 'Ribbon an entry to keep your place in it.', 'ribbon');
      h += mgList('cn', 'Canon', canon, (e) => U.snippet(e.body, 110), 'Entries marked <em>Canon</em> gather here.');
      h += mgList('rd', 'Open riddles', riddles, (e) => U.snippet(e.body, 110), 'No open riddles in this thread.');
      h += '<section class="mg-sec"><h2>Named here</h2>';
      if (!ment.known.length && !ment.unknown.length) h += '<p class="mg-empty">Write <code>[[a name]]</code> in an entry to link it to the codex.</p>';
      else {
        h += '<div class="chip-row">' +
          ment.known.map((k) => '<a class="chip chip-sm" href="#x-' + k.x.id + '">' + icon(M.KINDS[k.x.kind].icon, 'ic-sm') + '<span>' + esc(k.x.name) + '</span><span class="chip-n">' + k.n + '</span></a>').join('') +
          ment.unknown.map((u) => '<button type="button" class="chip chip-sm chip-missing" data-name="' + esc(u.name) + '" title="Not in the codex yet. Click to write it.">' + icon('plus', 'ic-sm') + '<span>' + esc(u.name) + '</span></button>').join('') +
          '</div>';
      }
      h += '</section>';
      if (parent || kids.length) {
        h += '<section class="mg-sec"><h2>Branches</h2><ul class="mg-list">' +
          (parent ? '<li><a class="mg-item" href="#t-' + parent.id + '">' + icon('up', 'ic-sm') + '<span>' + esc(parent.title) + '</span></a></li>' : '') +
          kids.map((k) => '<li><a class="mg-item" href="#t-' + k.id + '">' + icon('branch', 'ic-sm') + '<span>' + esc(k.title) + '</span></a></li>').join('') +
          '</ul></section>';
      }
      MG.innerHTML = h;
      const ta = MG.querySelector('#mg-distill-ta');
      if (ta) {
        UI.autosize(ta, () => window.innerHeight * 0.6);
        UI.linker(ta, () => t.realmId);
        ta.addEventListener('input', () => { S.distillDraft = ta.value; });
        ta.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); saveDistill(); }
          else if (ev.key === 'Escape') { ev.preventDefault(); S.distilling = false; renderMargin(); }
        });
      }
    }
    const scheduleMargin = U.debounce(() => { if (!S.distilling) renderMargin(); }, 160);
    function saveDistill() {
      S.distilling = false;
      if (S.distillDraft !== t.distillation) M.updateThread(tid, { distillation: S.distillDraft });
      else renderMargin();
    }
    const MGEL = document.getElementById('margin-body');
    if (MGEL) {
      MGEL.addEventListener('click', (ev) => {
        const wl = ev.target.closest('a.wl');
        if (wl) { ev.preventDefault(); FC.app.openName(t.realmId, wl.dataset.wl); return; }
        const j = ev.target.closest('[data-jump]');
        if (j) {
          S.touched = true;
          jumpToId(j.dataset.jump, { align: 'start' });
          FC.app.closeMarginIfOverlay();
          return;
        }
        const nm = ev.target.closest('[data-name]');
        if (nm) { FC.app.openName(t.realmId, nm.dataset.name); return; }
        const b = ev.target.closest('[data-mg]');
        if (!b) return;
        const act = b.dataset.mg;
        if (act === 'distill') {
          S.distilling = true;
          S.distillDraft = t.distillation;
          renderMargin();
          const ta = MGEL.querySelector('#mg-distill-ta');
          if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
        } else if (act === 'distill-cancel') { S.distilling = false; renderMargin(); }
        else if (act === 'distill-save') saveDistill();
        else if (act === 'expand') {
          const k = b.dataset.key;
          if (S.mgExpand.has(k)) S.mgExpand.delete(k);
          else S.mgExpand.add(k);
          renderMargin();
        }
      }, sig);
    }

    /* ───────────── model events ───────────── */

    function onEntryEvent(ev) {
      const wasAtEnd = S.e >= S.list.length;
      computeList();
      if (ev.op === 'add') {
        const i = S.list.findIndex((x) => x.id === ev.id);
        if (i < 0) UI.toast('Inscribed. The current filter hides it.');
        else if (i === S.list.length - 1 && wasAtEnd) {
          insert('bottom', renderRange(S.e, S.list.length));
          S.e = S.list.length;
          trim('top');
          updateEnd();
          SC.scrollTop = SC.scrollHeight;
          flash(ev.id);
        } else if (i === S.list.length - 1) {
          resetWindow(i, 'end');
          flash(ev.id);
        } else refreshWindow();
      } else if (ev.op === 'update') {
        const node = EL.querySelector('.ew[data-id="' + ev.id + '"]');
        const i = S.list.findIndex((x) => x.id === ev.id);
        if (node && i >= 0) rerenderEntry(ev.id);
        else if (node || i >= 0) refreshWindow();
      } else if (ev.op === 'delete') {
        refreshWindow();
      }
      S.spineDirty = true;
      updateEnd();
      updateCount();
      onScrollWork();
      scheduleMargin();
    }
    const off = M.on((ev) => {
      if (ev.type === 'entry' && ev.threadId === tid) onEntryEvent(ev);
      else if (ev.type === 'thread' && ev.id === tid) {
        if (ev.op === 'delete' || !M.threads.has(tid)) return;
        renderHead();
        renderOrigin();
        scheduleMargin();
      } else if (ev.type === 'thread' && (ev.op === 'create' || ev.op === 'delete')) {
        buildBranchIdx();
        refreshWindow();
        scheduleMargin();
      } else if (ev.type === 'codex') {
        S.resolve = M.resolver(t.realmId);
        refreshWindow();
        scheduleMargin();
      }
    });

    /* ───────────── keyboard ───────────── */

    document.addEventListener('keydown', (ev) => {
      if (UI.isModalOpen()) return;
      if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && ev.key.toLowerCase() === 'f') {
        ev.preventDefault();
        toggleFind();
        return;
      }
      if (U.isTyping(ev) || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (ev.key === '[' || ev.key === ']') {
        const cur = S.vis[0];
        let to = -1;
        if (ev.key === ']') to = S.list.findIndex((e, i) => i > cur && e.type === 'waypoint');
        else for (let i = Math.min(cur, S.list.length) - 1; i >= 0; i--) if (S.list[i].type === 'waypoint') { to = i; break; }
        if (to >= 0) { ev.preventDefault(); S.touched = true; jumpTo(to); }
        else UI.toast(ev.key === ']' ? 'No more waypoints below.' : 'No waypoints above.');
      } else if (ev.key === 'i') {
        ev.preventDefault();
        TA.focus();
      }
    }, sig);

    /* ───────────── open ───────────── */

    computeList();
    buildBranchIdx();
    renderHead();
    renderFilters();
    renderOrigin();
    renderComposer();
    renderMargin();

    let target = -1;
    if (opts.entry) target = S.list.findIndex((e) => e.id === opts.entry);
    if (target < 0) {
      const lr = U.pref.get('lr:' + tid, null);
      if (lr) target = S.list.findIndex((e) => e.id === lr);
    }
    const open = () => {
      if (target >= 0) resetWindow(target, opts.entry ? 'center' : 'start');
      else resetWindow(S.list.length - 1, 'end');
    };
    open();
    if (opts.entry && target >= 0) flash(opts.entry);
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(() => { if (!S.touched && !ac.signal.aborted) open(); });
    }
    maybeReentry();
    const draft = U.pref.get('draft:' + tid, null);
    if (draft && draft.body) {
      TA.value = draft.body;
      setType(M.TYPES[draft.type] ? draft.type : 'musing', true);
      fitTA();
    }

    return {
      unmount() {
        ac.abort();
        off();
        ro.disconnect();
        runFind.cancel();
        scheduleMargin.cancel();
        saveDraft.cancel();
        if (TA && TA.value.trim()) U.pref.set('draft:' + tid, { type: S.type, body: TA.value });
        const mg = document.getElementById('margin-body');
        if (mg) mg.innerHTML = '';
      },
      jumpToId(id) {
        S.touched = true;
        jumpToId(id, { align: 'center' });
      },
      focusComposer() {
        if (TA) TA.focus();
      },
      refreshMargin() {
        renderHead();
      },
    };
  }

  FC.thread = { mount };
})();
