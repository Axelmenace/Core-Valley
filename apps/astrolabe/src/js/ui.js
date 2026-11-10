/* ── ui: binder, inspector, status bar, overlays, library, dialogs ──────── */
const UI = (() => {
  /* ═════ Toasts, modals, confirm, context menu ═════ */
  function toast(msg, opts = {}) {
    const t = document.createElement("div");
    t.className = "toast" + (opts.err ? " err" : "");
    t.innerHTML = `<span>${msg}</span>${opts.action ? `<button type="button">${esc(opts.action)}</button>` : ""}`;
    if (opts.action) t.querySelector("button").onclick = () => { opts.onAction(); t.remove(); };
    $("#toasts").appendChild(t);
    setTimeout(() => t.remove(), opts.ms || (opts.action ? 7000 : 3200));
  }
  let modalStack = [];
  function modal(html, { wide = false, cls = "", onClose } = {}) {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `<div class="modal ${wide ? "wide" : ""} ${cls}" role="dialog" aria-modal="true">${html}</div>`;
    const prevFocus = document.activeElement;
    const close = (v) => { if (!back.isConnected) return; back.remove(); modalStack = modalStack.filter(m => m !== api); onClose && onClose(v); if (prevFocus && prevFocus.focus) try { prevFocus.focus({ preventScroll: true }); } catch { /* gone */ } };
    back.addEventListener("mousedown", e => { if (e.target === back) close(); });
    const api = { el: back.firstElementChild, close };
    modalStack.push(api);
    $("#modalRoot").appendChild(back);
    const f = back.querySelector("[autofocus]") || back.querySelector("input,select,textarea,button:not(.x)");
    f && setTimeout(() => f.focus(), 20);
    return api;
  }
  const closeTopModal = () => { const m = modalStack[modalStack.length - 1]; if (m) { m.close(); return true; } return false; };
  function ask(title, body, buttons) {
    return new Promise(res => {
      const m = modal(`<h2>${esc(title)}</h2><p class="lede" style="margin:0">${body}</p>
        <div class="modal-foot">${buttons.map(([l, k], i) => `<button class="btn ${k === "danger" ? "danger" : k === "gild" ? "gild" : i === buttons.length - 1 ? "gild" : ""}" type="button" data-i="${i}">${esc(l)}</button>`).join("")}</div>`, { onClose: v => res(v ?? -1) });
      m.el.addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) m.close(+b.dataset.i); });
    });
  }
  function ctxMenu(x, y, items) {
    const c = $("#ctx");
    c.innerHTML = items.map((it, i) => it === "-" ? "<hr>" : `<button type="button" role="menuitem" class="${it.danger ? "danger" : ""}" data-i="${i}" ${it.disabled ? "disabled" : ""}><span>${esc(it.label)}</span>${it.kbd ? `<kbd>${esc(it.kbd)}</kbd>` : ""}</button>`).join("");
    c.hidden = false;
    const r = c.getBoundingClientRect();
    c.style.left = clamp(x, 8, innerWidth - r.width - 8) + "px";
    c.style.top = clamp(y, 8, innerHeight - r.height - 8) + "px";
    c.onclick = e => { const b = e.target.closest("[data-i]"); if (!b) return; c.hidden = true; items[+b.dataset.i].run(); };
    const f = c.querySelector("button"); f && f.focus();
  }
  const closeCtx = () => { const c = $("#ctx"); if (!c.hidden) { c.hidden = true; return true; } return false; };

  /* ═════ Files out ═════ */
  async function saveFile(name, data, mime) {
    if (window.claude && typeof window.claude.use === "function") {
      let dl = null; try { dl = await window.claude.use("downloads"); } catch { dl = null; }
      if (dl) {
        try { await dl.save({ filename: name, data }); toast("Saved " + esc(name)); return true; }
        catch (e) {
          const code = e && e.code;
          if (code === "declined") { toast("Download cancelled."); return false; }
          if (code === "rate_limited") { toast("A download is already waiting for your answer.", { err: true }); return false; }
        }
      }
      return copyFallback(name, data);
    }
    try {
      const url = URL.createObjectURL(new Blob([data], { type: mime || "text/plain" }));
      const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      toast("Saved " + esc(name)); return true;
    } catch { return copyFallback(name, data); }
  }
  function copyFallback(name, data) {
    if (typeof data !== "string") { toast("This view cannot save “" + esc(name) + "”. Open Astrolabe in a browser tab to export it.", { err: true, ms: 8000 }); return false; }
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>Copy ${esc(name)}</h2>
      <p class="lede">This view can't save files, so here is the content to copy into a file of your own.</p>
      <textarea class="inp" id="copyArea" rows="12" readonly style="font-family:var(--f-hud);font-size:12px">${esc(data)}</textarea>
      <div class="modal-foot"><button class="btn gild" type="button" data-copy>Copy to clipboard</button></div>`, { wide: true });
    m.el.addEventListener("click", e => {
      if (e.target.closest("[data-x]")) m.close();
      if (e.target.closest("[data-copy]")) {
        const ta = $("#copyArea");
        navigator.clipboard.writeText(data).then(() => toast("Copied."), () => { ta.focus(); ta.select(); toast("Press Ctrl+C to copy the selected text."); });
      }
    });
    return false;
  }

  /* ═════ Shell ═════ */
  function showLibrary() {
    if (S.sprint) endSprint(true); // log it here rather than let it run on into another project
    flushAll(); S.focus = false;
    $("#desk").hidden = true; $("#library").hidden = false; $("#desk").classList.remove("focus-mode");
    renderLibrary(); document.title = "Astrolabe";
    refreshMeta().then(ok => { if (ok && !$("#library").hidden) renderLibrary(); }); // pick up projects made in other tabs
  }

  /* ═════ The same archive open elsewhere ═════ */
  let remoteBusy = false;
  async function reloadProject(msg) {
    const pid = P().id, sel = S.sel, mode = S.mode, active = S.active;
    try { await openProject(pid); }
    catch (e) {
      console.warn("project not reloaded", e);
      S.project = null; showLibrary();
      toast("This project could not be reloaded. It may have been deleted in another tab or on another device.", { err: true, ms: 8000 });
      return;
    }
    S.mode = mode; if (sel && node(sel)) S.sel = sel; if (active && node(active)) S.active = active;
    showDesk(); if (msg) toast(msg, { ms: 6000 });
  }
  /* Another writer saved this project after this page loaded it. With nothing unsaved here, take the
     newer copy; otherwise the writer chooses, because one of the two versions has to give way. */
  async function changedElsewhere(theirs, unsaved) {
    if (remoteBusy || S.conflict || !P()) return;
    remoteBusy = true;
    try {
      if (!unsaved) { await reloadProject("Brought up to date: this project was changed in another tab or on another device."); return; }
      S.conflict = true; // holds back project saves until there is an answer
      const title = P().title;
      const r = await ask("This project was changed somewhere else", `Another tab or device saved “${esc(title)}” after this page opened it, and this page has changes of its own. <b>Load the latest</b> drops what was changed here since it last saved. <b>Keep this version</b> replaces the other one, including any scenes added or moved there.`, [["Load the latest"], ["Keep this version", "danger"]]);
      S.conflict = false;
      if (!P()) return;
      if (r === 0) { dropLocalChanges(); await reloadProject("Loaded the latest version."); }
      else if (r === 1) { S.rev = theirs; saveProject(); toast("Kept this version."); }
      else toast("Nothing was saved over. You will be asked again at the next change.", { ms: 6000 });
    } finally { remoteBusy = false; }
  }
  /* Called when this page comes back into view. */
  async function checkRemote() {
    if (remoteBusy || S.conflict || !P()) return;
    if (!$("#library").hidden) { if (await refreshMeta()) renderLibrary(); return; }
    if ($("#desk").hidden) return;
    const p = P(); let theirs;
    try { theirs = await storedRev(p.id); } catch { return; }
    if (P() === p && theirs !== S.rev) changedElsewhere(theirs, localChanges());
  }
  function showDesk() {
    const d = $("#desk");
    d.classList.toggle("no-binder", !!lsGet("hideBinder", false));
    d.classList.toggle("no-insp", !!lsGet("hideInsp", false));
    d.classList.remove("peek-binder");
    $("#library").hidden = true; d.hidden = false;
    syncPanelButtons();
    renderBinder(); setMode(S.mode, true); renderInspector(); renderStatus();
    document.title = P().title + " · Astrolabe";
  }
  function setMode(m, force) {
    if (S.mode === "write" && m !== "write") Editor.flush();
    if (!force && m === S.mode) return;
    S.mode = m; saveView();
    $$("#modes [data-mode]").forEach(b => { b.setAttribute("aria-selected", b.dataset.mode === m ? "true" : "false"); b.tabIndex = b.dataset.mode === m ? 0 : -1; });
    renderStage(); renderStatus();
  }
  function renderStage() {
    const st = $("#stage"); st.dataset.mode = S.mode;
    const scr = $(".scroller", st); const keep = scr && st.dataset.lastMode === S.mode && S.mode !== "write" ? scr.scrollTop : 0;
    st.dataset.lastMode = S.mode;
    const done = () => { const s2 = $(".scroller", st); if (s2 && keep) s2.scrollTop = keep; };
    const r = ({ write: () => Editor.render(st), board: () => Views.board(st), outline: () => Views.outline(st), threads: () => Views.threads(st), codex: () => Views.codex(st), progress: () => Views.progress(st) })[S.mode];
    const res = r && r(); if (res && res.then) res.then(done); else done();
  }
  function select(id, opts = {}) {
    if (S.mode === "write") Editor.flush();
    S.sel = id;
    const n = id && node(id);
    S.active = n && n.type === "scene" ? id : null;
    if (n) ancestors(id).forEach(a => { if (node(a).collapsed) { node(a).collapsed = false; saveProjectSoon(); } });
    saveView();
    renderBinder();
    if (opts.mode && opts.mode !== S.mode) setMode(opts.mode); else if (S.mode === "write" || S.mode === "board") renderStage();
    renderInspector(); renderStatus();
    if ($("#desk").classList.contains("show-binder")) { $("#desk").classList.remove("show-binder"); syncPanelButtons(); }
  }
  const openScene = id => select(id, { mode: "write" });

  /* ═════ Binder ═════ */
  const TWIST = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>';
  function nodeHTML(id) {
    const n = node(id); if (!n) return "";
    const kids = n.children || [];
    const leaf = n.type === "scene";
    return `<li class="node t-${n.type} ${S.sel === id ? "sel" : ""} ${n.collapsed ? "collapsed" : ""} ${n.include === false ? "excluded" : ""}" data-id="${id}" role="treeitem" ${leaf ? "" : `aria-expanded="${!n.collapsed}"`} aria-selected="${S.sel === id}">
      <div class="row" draggable="true" tabindex="${S.sel === id ? 0 : -1}">
        <button class="twist ${leaf || !kids.length ? "noexp" : ""}" type="button" data-act="twist" tabindex="-1" aria-label="Expand or collapse">${TWIST}</button>
        <span class="coord">${esc(IX.coord[id] || "")}</span><span class="label" data-label="${id}">${esc(n.title || "Untitled")}</span>
        <span class="wc" data-wc="${id}">${fmtN(IX.total[id] || 0)}</span><span class="pip s-${leaf ? n.status : rollupStatus(id)}" title="${statusName(leaf ? n.status : rollupStatus(id))}"></span>
        <button class="more" type="button" data-act="more" tabindex="-1" aria-label="Actions for ${esc(n.title)}">⋯</button>
      </div>${leaf ? "" : `<ul role="group">${kids.map(nodeHTML).join("")}</ul>`}</li>`;
  }
  function renderBinder() {
    const p = P();
    $("#projTitle").textContent = p.title; $("#projForm").textContent = FORMS[p.form].name;
    $("#addChapterBtn").textContent = "+ " + labelOf("chapter"); $("#addPartBtn").textContent = "+ " + labelOf("part");
    const pr = $("#projRow");
    pr.className = "proj-row" + (S.sel ? "" : " sel");
    pr.innerHTML = `<span data-astro="mini" style="width:16px;height:16px;display:block;flex:none"></span><span class="t">${esc(p.title)}</span><span class="wc" data-wc="root">${fmtN(projectWords())}</span>`;
    paintAstros(pr);
    const tree = $("#tree");
    tree.innerHTML = p.root.length ? p.root.map(nodeHTML).join("") : `<li class="tree-empty">An empty binder. Add a ${p.form === "short" ? "scene" : esc(labelOf("chapter").toLowerCase())} to begin, or import a manuscript from the library.</li>`;
    const tr = $("#trash");
    tr.innerHTML = p.trash.length ? `<details><summary class="hud"><span>Trash · ${p.trash.length}</span><span>▾</span></summary>
      ${p.trash.map((t, i) => `<div class="trash-item"><span title="${esc(t.title)}">${esc(t.title || "Untitled")}</span><button class="chip" type="button" data-act="restore" data-i="${i}">Restore</button></div>`).join("")}
      <div style="margin-top:6px"><button class="chip" type="button" data-act="purge">Empty trash</button></div></details>` : "";
    markBinderActive();
  }
  function markBinderActive() {
    $$("#tree .node.active-scene").forEach(n => n.classList.remove("active-scene"));
    if (S.mode !== "write" || !S.active || S.active === S.sel) return;
    const li = $(`#tree .node[data-id="${CSS.escape(S.active)}"]`); li && li.classList.add("active-scene");
  }
  function updateLabels(id) {
    const n = node(id); if (!n) return;
    $$(`[data-label="${CSS.escape(id)}"]`).forEach(el => el.textContent = n.title || "Untitled");
    const ins = $("#insp-title"); if (ins && ins.dataset.nid === id && document.activeElement !== ins) ins.value = n.title;
    const st = $(`#st-${CSS.escape(id)}`); if (st && document.activeElement !== st) st.value = n.title;
  }
  function updateCounts() {
    $$("[data-wc]").forEach(el => { const k = el.dataset.wc; el.textContent = fmtN(k === "root" ? projectWords() : IX.total[k] || 0); });
    $$("[data-swc]").forEach(el => { const n = node(el.dataset.swc); if (n) el.textContent = fmtFull(n.words) + (n.target ? " / " + fmtFull(n.target) : "") + " w"; });
    renderStatus();
    const iw = $("#insp-words"); if (iw && S.active) { const n = node(S.active); if (n) iw.textContent = fmtFull(n.words); }
  }
  function renameInline(id) {
    const lab = $(`#tree [data-label="${CSS.escape(id)}"]`); if (!lab) return;
    const n = node(id);
    const inp = document.createElement("input"); inp.className = "rename"; inp.value = n.title; inp.setAttribute("aria-label", "Rename");
    lab.replaceWith(inp); inp.focus(); inp.select();
    let done = false;
    const finish = save => { if (done) return; done = true; if (save) { n.title = inp.value.trim() || n.title; touch(); } renderBinder(); updateLabels(id); if (S.sel === id) renderInspector(); if (S.mode !== "write") renderStage(); };
    inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") finish(true); if (e.key === "Escape") finish(false); });
    inp.addEventListener("blur", () => finish(true));
  }
  function redrawAll() { renderBinder(); renderStage(); renderInspector(); renderStatus(); }
  function trashWithUndo(id) {
    const n = node(id); if (!n) return;
    trashNode(id); redrawAll();
    toast(`Moved “${esc(n.title)}” to the trash.`, { action: "Undo", onAction: () => { if (P() && restoreTrashed(id)) redrawAll(); } });
  }
  /* Split the scene in two where the caret is; the second half becomes a new scene after it. */
  async function splitScene() {
    Editor.flush();
    const sp = Editor.splitPoint(), n = sp && node(sp.id);
    if (!n) { toast("Click into the text where the new scene should begin, then split."); return; }
    if (!sp.before || !sp.after) { toast("Put the cursor between the two parts: there is nothing " + (sp.before ? "after" : "before") + " it to split off."); return; }
    await takeSnapshot(sp.id, "Before split", true);
    putText(sp.id, sp.before); setSceneWords(sp.id, wordsOfHtml(sp.before), false);
    const m = addNode("scene", sp.id, (n.title || "Untitled scene") + ", continued");
    Object.assign(m, { status: n.status, pov: n.pov, place: n.place, when: n.when, threads: n.threads.slice() });
    putText(m.id, sp.after); setSceneWords(m.id, wordsOfHtml(sp.after), false);
    touch();
    if (S.sel === sp.id) openScene(m.id); else { S.active = m.id; redrawAll(); }
    toast("Split in two. The scene as it was is kept in its Snapshots.", { ms: 6000 });
  }
  const nextScene = id => { const arr = childrenOf(IX.parent[id] ?? null), nx = arr[arr.indexOf(id) + 1]; return nx && node(nx) && node(nx).type === "scene" ? nx : null; };
  /* Join a scene with the one after it. The second goes to the trash with its text, so this can be undone by hand. */
  async function mergeNext(id) {
    const nx = nextScene(id), a = node(id), b = nx && node(nx); if (!a || !b || a.type !== "scene") return;
    Editor.flush();
    let ta, tb; try { [ta, tb] = await Promise.all([getText(id), getText(nx)]); } catch (e) { toast("The text could not be read: " + esc((e && e.message) || "storage did not answer") + ".", { err: true }); return; }
    await takeSnapshot(id, "Before merge", true);
    const empty = h => !h.replace(/<[^>]+>/g, "").trim() && !h.includes("<hr>");
    putText(id, empty(ta) ? tb : empty(tb) ? ta : ta + tb);
    setSceneWords(id, (a.words || 0) + (b.words || 0), false);
    a.synopsis = [a.synopsis, b.synopsis].filter(Boolean).join("\n"); a.notes = [a.notes, b.notes].filter(Boolean).join("\n");
    a.threads = [...new Set([...a.threads, ...b.threads])]; if (a.target && b.target) a.target += b.target;
    if (S.active === nx) S.active = id; if (S.sel === nx) S.sel = id;
    trashNode(nx); saveView(); redrawAll();
    toast(`Merged “${esc(b.title)}” into “${esc(a.title)}”. The second scene is in the trash, and the first as it was is in its Snapshots.`, { ms: 8000 });
  }
  /* Choose a new home for a scene, chapter or part from a list: the way to move things without dragging. */
  function moveDialog(id) {
    const n = node(id); if (!n) return;
    const cur = IX.parent[id] ?? null, opts = [[null, "Top level of the project", ""]];
    const walk = ids => ids.forEach(c => { const m = node(c); if (!m || m.type === "scene" || c === id) return; if (canNest(n.type, c)) opts.push([c, m.title || "Untitled", IX.coord[c] + " · " + labelOf(m.type)]); walk(m.children); });
    walk(P().root);
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>Move “${esc(n.title || "Untitled")}” to…</h2>
      <div class="move-list">${opts.map(([k, t, h], i) => `<button type="button" class="pal-item" data-i="${i}" ${k === cur ? "disabled" : ""}><span class="g">${k ? "❡" : "⌂"}</span><span class="t">${esc(t)}</span><span class="h">${k === cur ? "it is here now" : esc(h)}</span></button>`).join("")}</div>
      <div class="modal-foot"><button class="btn" type="button" data-x>Cancel</button></div>`);
    m.el.addEventListener("click", e => {
      if (e.target.closest("[data-x]")) { m.close(); return; }
      const b = e.target.closest("[data-i]"); if (!b) return;
      const [k, t] = opts[+b.dataset.i]; m.close();
      if (moveIntoEnd(id, k)) { redrawAll(); toast(`Moved to ${k ? "“" + esc(t) + "”" : "the top level"}, at the end.`); }
    });
  }
  function nodeMenu(id, x, y) {
    const n = node(id); const L = labelOf;
    const items = [
      { label: "Open in Write", run: () => openScene(id) },
      { label: "Show on Board", run: () => select(id, { mode: "board" }) },
      "-",
      { label: "Rename", kbd: "F2", run: () => renameInline(id) },
      { label: "New scene " + (n.type === "scene" ? "after" : "inside"), run: () => { const s = addNode("scene", id); renderBinder(); openScene(s.id); } },
    ];
    if (n.type !== "part" && P().form !== "short") items.push({ label: "New " + L("chapter").toLowerCase() + " after", run: () => { const c = addNode("chapter", id); renderBinder(); select(c.id); renameInline(c.id); } });
    items.push(
      { label: "Move to…", run: () => moveDialog(id) },
      ...(n.type === "scene" && nextScene(id) ? [{ label: "Merge with next scene", run: () => mergeNext(id) }] : []),
      { label: "Duplicate", run: () => { const d = duplicateNode(id); renderBinder(); select(d); toast("Duplicated."); } },
      { label: "Move up", kbd: "Alt+↑", run: () => { nudge(id, -1) && (renderBinder(), renderStage()); } },
      { label: "Move down", kbd: "Alt+↓", run: () => { nudge(id, 1) && (renderBinder(), renderStage()); } },
      { label: n.include === false ? "Include in export" : "Leave out of export", run: () => { n.include = n.include === false; touch(); renderBinder(); renderInspector(); } },
      "-",
      { label: "Move to trash", danger: true, kbd: "Del", run: () => trashWithUndo(id) },
    );
    ctxMenu(x, y, items);
  }
  function bindBinder() {
    const b = $("#binder");
    let drag = null;
    b.addEventListener("click", e => {
      const add = e.target.closest("[data-add]");
      if (add) { const n = addNode(add.dataset.add); renderBinder(); if (n.type === "scene") openScene(n.id); else { select(n.id); renameInline(n.id); } return; }
      if (e.target.closest("#projRow")) { select(null); return; }
      const a = e.target.closest("[data-act]");
      const li = e.target.closest(".node");
      if (a && a.dataset.act === "restore") { restoreTrash(+a.dataset.i); redrawAll(); return; }
      if (a && a.dataset.act === "purge") { ask("Empty the trash?", "Everything in the trash, with its text and snapshots, will be deleted for good.", [["Cancel"], ["Delete for good", "danger"]]).then(r => { if (r === 1) { purgeTrash(); redrawAll(); } }); return; }
      if (!li) return;
      const id = li.dataset.id;
      if (a && a.dataset.act === "twist") { const n = node(id); n.collapsed = !n.collapsed; li.classList.toggle("collapsed", n.collapsed); li.setAttribute("aria-expanded", String(!n.collapsed)); saveProjectSoon(); return; }
      if (a && a.dataset.act === "more") { const r = a.getBoundingClientRect(); nodeMenu(id, r.right - 8, r.bottom + 4); return; }
      if (e.target.closest(".row") && !e.target.closest("input")) select(id);
    });
    b.addEventListener("dblclick", e => { const lab = e.target.closest("[data-label]"); if (lab) renameInline(lab.dataset.label); });
    b.addEventListener("contextmenu", e => { const li = e.target.closest(".node"); if (!li) return; e.preventDefault(); nodeMenu(li.dataset.id, e.clientX, e.clientY); });
    b.addEventListener("keydown", e => {
      const row = e.target.closest(".row"); if (!row) return;
      const id = row.parentElement.dataset.id;
      const rows = $$("#tree .row").filter(r => r.offsetParent !== null);
      const i = rows.indexOf(row);
      if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); if (nudge(id, e.key === "ArrowUp" ? -1 : 1)) { renderBinder(); renderStage(); const r = $(`#tree .node[data-id="${CSS.escape(id)}"] > .row`); r && r.focus(); } return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); const r = rows[clamp(i + (e.key === "ArrowDown" ? 1 : -1), 0, rows.length - 1)]; if (r) { r.tabIndex = 0; r.focus(); } return; }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(id); const r = $(`#tree .node[data-id="${CSS.escape(id)}"] > .row`); r && r.focus(); return; }
      if (e.key === "F2") { e.preventDefault(); renameInline(id); return; }
      if (e.key === "Delete") { e.preventDefault(); trashWithUndo(id); }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") { const n = node(id); if (n.type !== "scene") { n.collapsed = e.key === "ArrowLeft"; renderBinder(); const r = $(`#tree .node[data-id="${CSS.escape(id)}"] > .row`); r && r.focus(); } }
    });
    b.addEventListener("dragstart", e => {
      const row = e.target.closest && e.target.closest(".row"); if (!row) return;
      drag = row.parentElement.dataset.id; e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", drag); } catch { /* ok */ }
    });
    const clear = () => $$(".drop-before,.drop-after,.drop-inside", b).forEach(x => x.classList.remove("drop-before", "drop-after", "drop-inside"));
    b.addEventListener("dragend", () => { drag = null; clear(); });
    b.addEventListener("dragover", e => {
      if (!drag) return;
      const row = e.target.closest(".row"); clear(); if (!row) return;
      const tid = row.parentElement.dataset.id; if (tid === drag || ancestors(tid).includes(drag)) return;
      const r = row.getBoundingClientRect(), y = (e.clientY - r.top) / r.height;
      const dn = node(drag), tn = node(tid);
      let where = y < .3 ? "before" : y > .7 ? "after" : "inside";
      if (where === "inside" && !canNest(dn.type, tid)) where = y < .5 ? "before" : "after";
      if (where !== "inside" && !canNest(dn.type, IX.parent[tid] ?? null)) { if (canNest(dn.type, tid)) where = "inside"; else return; }
      void tn;
      e.preventDefault(); row.classList.add("drop-" + where); row.dataset.where = where;
    });
    b.addEventListener("drop", e => {
      if (!drag) return;
      const row = e.target.closest(".row"); if (!row || !row.dataset.where) { clear(); return; }
      e.preventDefault();
      const ok = moveNode(drag, row.parentElement.dataset.id, row.dataset.where);
      drag = null; clear();
      if (ok) { renderBinder(); renderStage(); renderInspector(); }
    });
  }

  /* ═════ Inspector ═════ */
  const renderInspectorSoon = debounce(() => renderInspector(), 400);
  function inspTarget() { return (S.mode === "write" && S.active && node(S.active)) ? S.active : S.sel && node(S.sel) ? S.sel : null; }
  function renderInspector() {
    const el = $("#inspector"); if (!P()) return;
    if (el.contains(document.activeElement) && document.activeElement.matches("input,textarea,select")) return; // don't yank a field from under the writer
    const id = inspTarget(), p = P();
    if (!id) {
      el.innerHTML = `<div class="insp-head"><span class="hud" style="color:var(--gild)">Project</span></div>
        <input class="insp-title" id="insp-ptitle" data-pf="title" value="${esc(p.title)}" aria-label="Project title">
        <div class="insp-sec"><label class="field"><span>Subtitle or series</span><input id="pf-sub" data-pf="subtitle" value="${esc(p.subtitle)}"></label>
          <label class="field"><span>Author / pen name</span><input id="pf-auth" data-pf="author" value="${esc(p.author)}"></label>
          <label class="field"><span>Form</span><select id="pf-form" data-pf="form">${Object.entries(FORMS).map(([k, f]) => `<option value="${k}" ${p.form === k ? "selected" : ""}>${f.name}</option>`).join("")}</select></label>
          <label class="field"><span>Logline</span><textarea id="pf-log" data-pf="logline" rows="3" placeholder="When ___ happens, ___ must ___ or else ___.">${esc(p.logline || "")}</textarea></label>
          <label class="field"><span>Project notes</span><textarea id="pf-notes" data-pf="notes" rows="6" placeholder="Themes, research, things to remember…">${esc(p.notes || "")}</textarea></label></div>
        <div class="insp-sec"><h4>At a glance</h4>
          <div class="stat-line"><span>Words</span><b>${fmtFull(projectWords())}</b></div>
          <div class="stat-line"><span>Goal</span><b>${fmtFull(p.goal.words)}</b></div>
          <div class="stat-line"><span>${esc(labelOf("chapter"))}s</span><b>${IX.chapters.length}</b></div>
          <div class="stat-line"><span>Scenes</span><b>${IX.order.length}</b></div>
          <div class="stat-line"><span>Codex entries</span><b>${(S.codex.entries || []).length}</b></div></div>`;
      return;
    }
    const n = node(id), leaf = n.type === "scene";
    const statusBtns = STATUSES.map(([k, l]) => `<button type="button" class="${n.status === k ? "on" : ""}" data-status="${k}"><span class="pip s-${k}"></span>${l}</button>`).join("");
    const chars = (S.codex.entries || []).filter(e => e.cat === "character").map(e => e.name);
    const places = (S.codex.entries || []).filter(e => e.cat === "place").map(e => e.name);
    let html = `<div class="insp-head"><span class="coord">${esc(IX.coord[id])}</span><span class="hud">${esc(labelOf(n.type))}</span><span style="flex:1"></span>
      ${n.include === false ? '<span class="hud" style="color:var(--warn)">Left out of export</span>' : ""}</div>
      <input class="insp-title" id="insp-title" data-nid="${id}" data-nf="title" value="${esc(n.title)}" aria-label="Title">`;
    if (leaf) {
      html += `<div class="insp-sec"><h4>Status</h4><div class="status-pick">${statusBtns}</div></div>
        <div class="insp-sec"><h4>Scene</h4>
          <label class="field"><span>Synopsis</span><textarea id="nf-syn" data-nf="synopsis" rows="4" placeholder="What happens, and what changes?">${esc(n.synopsis)}</textarea></label>
          <div class="row2"><label class="field"><span>Point of view</span><input id="nf-pov" data-nf="pov" list="ins-pov" value="${esc(n.pov)}"></label>
          <label class="field"><span>Location</span><input id="nf-place" data-nf="place" list="ins-place" value="${esc(n.place)}"></label></div>
          <div class="row2"><label class="field"><span>Story time</span><input id="nf-when" data-nf="when" value="${esc(n.when)}" placeholder="Day 3, dusk"></label>
          <label class="field"><span>Target words</span><input id="nf-target" data-nf="target" type="number" min="0" step="250" value="${n.target || ""}"></label></div>
          <div class="stat-line"><span>Written</span><b><span id="insp-words">${fmtFull(n.words)}</span>${n.target ? " / " + fmtFull(n.target) : ""}</b></div>
          <datalist id="ins-pov">${chars.map(v => `<option value="${esc(v)}">`).join("")}</datalist><datalist id="ins-place">${places.map(v => `<option value="${esc(v)}">`).join("")}</datalist></div>
        <div class="insp-sec"><h4>Threads</h4><div class="tchips">${p.threads.map(t => `<button type="button" style="--tc:${esc(t.color)}" class="${n.threads.includes(t.id) ? "on" : ""}" data-thread="${t.id}" aria-pressed="${n.threads.includes(t.id)}"><i></i>${esc(t.name)}</button>`).join("") || '<span class="muted">No threads yet.</span>'}<button type="button" data-goto="threads" style="border-style:dashed">+ Manage</button></div></div>
        <div class="insp-sec"><h4>Codex in this scene</h4><div class="mentions" id="mentions"></div></div>
        <div class="insp-sec"><h4>Notes</h4><textarea class="inp" id="nf-notes" data-nf="notes" rows="5" placeholder="Revision notes, questions, research…">${esc(n.notes)}</textarea></div>
        <div class="insp-sec"><h4>Snapshots</h4><div class="snaps" id="snaps"><span class="muted">Loading…</span></div>
          <button class="btn small" type="button" data-act="snap">Take snapshot now</button></div>`;
    } else {
      const tgt = targetOf(id), w = IX.total[id] || 0;
      html += `<div class="insp-sec"><h4>${esc(labelOf(n.type))}</h4>
        <label class="field"><span>Synopsis</span><textarea id="nf-syn" data-nf="synopsis" rows="4">${esc(n.synopsis)}</textarea></label>
        <label class="field"><span>Target words${n.target ? "" : tgt ? " (sum of scenes: " + fmtFull(tgt) + ")" : ""}</span><input id="nf-target" data-nf="target" type="number" min="0" step="500" value="${n.target || ""}"></label>
        ${p.form === "serial" && n.type === "chapter" ? `<div class="row2"><label class="field"><span>Release date</span><input id="nf-rel" data-nf="release" type="date" value="${esc(n.release || "")}"></label>
          <label class="check" style="align-self:end;padding-bottom:8px"><input type="checkbox" id="nf-pub" data-nf="published" ${n.published ? "checked" : ""}> Published</label></div>` : ""}
        <div class="stat-line"><span>Written</span><b>${fmtFull(w)}${tgt ? " / " + fmtFull(tgt) : ""}</b></div>
        ${tgt ? `<div class="meter"><i style="width:${Math.min(100, 100 * w / tgt).toFixed(1)}%"></i></div>` : ""}
        <div class="stat-line"><span>Scenes</span><b>${scenesUnder(id).length}</b></div>
        <div class="stat-line"><span>Least finished scene</span><b>${statusName(rollupStatus(id))}</b></div></div>
        <div class="insp-sec"><h4>Notes</h4><textarea class="inp" id="nf-notes" data-nf="notes" rows="6">${esc(n.notes)}</textarea></div>
        <div class="insp-sec"><button class="btn small" type="button" data-act="write-all">Write all ${scenesUnder(id).length} scenes as one page</button></div>`;
    }
    el.innerHTML = html;
    if (leaf) { refreshMentions(); loadSnaps(id); }
  }
  function refreshMentions() {
    const box = $("#mentions"); const id = inspTarget(); if (!box || !id || node(id).type !== "scene") return;
    const n = node(id);
    const text = htmlToText(S.texts.get(id) || "") + "\n" + n.pov + "\n" + n.place + "\n" + n.synopsis;
    const ms = Views.mentionsIn(text);
    box.innerHTML = ms.length ? ms.map(e => `<button type="button" data-codex="${e.id}" title="${esc(e.summary || "")}"><span class="g">${catGlyph(e.cat)}</span>${esc(e.name)}</button>`).join("")
      : '<span class="muted">Names from your codex will appear here as you write them.</span>';
  }
  async function loadSnaps(id) {
    const list = await getSnaps(id); const box = $("#snaps"); if (!box || inspTarget() !== id) return;
    box.innerHTML = list.length ? list.slice(0, 12).map((s, i) => `<button type="button" class="snap" data-snap="${i}"><span class="when">${esc(s.label || "Snapshot")} · ${stamp(s.t)}</span><span class="wc">${fmtN(s.words)} w</span></button>`).join("")
      : '<span class="muted">None yet. One is taken automatically the first time you edit a scene each day.</span>';
  }
  function refreshSnaps() { const id = inspTarget(); if (id && node(id).type === "scene" && $("#snaps")) loadSnaps(id); }
  async function snapView(id, i) {
    const list = await getSnaps(id); const s = list[i]; if (!s) return;
    const cur = node(id).words;
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>${esc(s.label || "Snapshot")} · ${stamp(s.t)}</h2>
      <p class="lede">${fmtFull(s.words)} words then · ${fmtFull(cur)} now (${cur - s.words >= 0 ? "+" : ""}${fmtFull(cur - s.words)})</p>
      <div class="snap-preview"><div class="prose para-indent">${s.html || "<p><em>Empty</em></p>"}</div></div>
      <div class="modal-foot"><button class="btn danger" type="button" data-del>Delete snapshot</button><span style="flex:1"></span><button class="btn" type="button" data-x>Close</button><button class="btn gild" type="button" data-restore>Restore this version</button></div>`, { wide: true });
    m.el.addEventListener("click", async e => {
      if (e.target.closest("[data-x]")) m.close();
      if (e.target.closest("[data-del]")) { list.splice(i, 1); Store.put(keyS(P().id, id), list); m.close(); loadSnaps(id); toast("Snapshot deleted."); }
      if (e.target.closest("[data-restore]")) {
        Editor.flush();
        await takeSnapshot(id, "Before restore", true);
        putText(id, s.html); setSceneWords(id, s.words, false);
        m.close(); renderBinder(); if (S.mode === "write") renderStage(); renderInspector(); renderStatus();
        toast("Restored. The version you replaced is saved as a snapshot.");
      }
    });
  }
  function bindInspector() {
    const el = $("#inspector");
    el.addEventListener("input", e => {
      const t = e.target;
      if (t.dataset.pf) {
        const p = P(); if (t.dataset.pf === "form") return;
        p[t.dataset.pf] = t.value; touch();
        if (t.dataset.pf === "title") { $("#projTitle").textContent = p.title; const pr = $("#projRow .t"); pr && (pr.textContent = p.title); document.title = p.title + " · Astrolabe"; }
        return;
      }
      if (!t.dataset.nf) return;
      const id = inspTarget(); const n = node(id); if (!n) return;
      const f = t.dataset.nf;
      if (f === "target") n.target = Math.max(0, parseInt(t.value, 10) || 0);
      else if (f === "published") n.published = t.checked;
      else n[f] = t.value;
      touch();
      if (f === "title") updateLabels(id);
      if (f === "target") updateCounts();
      if (f === "pov" || f === "place" || f === "synopsis") refreshMentionsSoon();
      if (S.mode === "board" || S.mode === "outline") rerenderStageSoon();
    });
    el.addEventListener("change", e => {
      const t = e.target;
      if (t.dataset.pf === "form") { P().form = t.value; reindex(); touch(); renderBinder(); renderStage(); renderStatus(); el.innerHTML = ""; renderInspector(); }
      if (t.dataset.nf === "published") { node(inspTarget()).published = t.checked; touch(); }
    });
    el.addEventListener("click", e => {
      const st = e.target.closest("[data-status]");
      if (st) { const n = node(inspTarget()); n.status = st.dataset.status; touch(); $$("[data-status]", el).forEach(b => b.classList.toggle("on", b === st)); renderBinder(); if (S.mode !== "write") renderStage(); return; }
      const th = e.target.closest("[data-thread]");
      if (th) { const n = node(inspTarget()); const i = n.threads.indexOf(th.dataset.thread); if (i >= 0) n.threads.splice(i, 1); else n.threads.push(th.dataset.thread); touch(); th.classList.toggle("on", i < 0); th.setAttribute("aria-pressed", String(i < 0)); if (S.mode === "board" || S.mode === "threads") renderStage(); return; }
      const g = e.target.closest("[data-goto]"); if (g) { setMode(g.dataset.goto); return; }
      const cx = e.target.closest("[data-codex]"); if (cx) { S.codexSel = cx.dataset.codex; setMode("codex"); if (S.mode === "codex") renderStage(); return; }
      const sn = e.target.closest("[data-snap]"); if (sn) { snapView(inspTarget(), +sn.dataset.snap); return; }
      const a = e.target.closest("[data-act]");
      if (a && a.dataset.act === "snap") { Editor.flush(); takeSnapshot(inspTarget(), "Manual", true).then(() => { loadSnaps(inspTarget()); toast("Snapshot taken."); }); }
      if (a && a.dataset.act === "write-all") { setMode("write"); }
    });
  }
  const refreshMentionsSoon = debounce(refreshMentions, 500);
  const rerenderStageSoon = debounce(() => { const ae = document.activeElement; if (!$("#stage").contains(ae)) renderStage(); }, 600);

  /* ═════ Status bar & sprints ═════ */
  function renderStatus() {
    const bar = $("#statusbar"); if (!P()) return;
    const p = P(), st = S.meta.settings;
    const a = S.active && node(S.active), ch = a ? chapterOf(a.id) : null;
    const today = p.history[dayKey()] || 0, sess = projectWords() - S.sessionStart;
    const sp = S.sprint;
    let sprint = `<button class="sprint" type="button" data-sb="sprint" title="Timed writing sprint">◷ Sprint</button>`;
    if (sp) { const left = Math.max(0, sp.end - Date.now()); sprint = `<button class="sprint run" type="button" data-sb="sprint" title="Sprint running">◷ ${Math.floor(left / 60000)}:${pad2(Math.floor(left / 1000) % 60)} · ${sp.words >= 0 ? "+" : ""}${fmtFull(sp.words)}</button>`; }
    bar.innerHTML = `${a ? `<span>Scene <b>${fmtFull(a.words)}</b>${a.target ? " / " + fmtFull(a.target) : ""}</span>` : ""}
      ${ch ? `<span>${esc(labelOf("chapter"))} <b>${fmtFull(IX.total[ch])}</b></span>` : ""}
      <span>Project <b>${fmtFull(projectWords())}</b> / ${fmtN(p.goal.words)}</span>
      <span>Session <b class="${sess > 0 ? "plus" : sess < 0 ? "minus" : ""}">${sess >= 0 ? "+" : ""}${fmtFull(sess)}</b></span>
      <span>Today <b>${fmtFull(today)}</b> / ${fmtFull(p.goal.daily)}<span class="mini"><i style="width:${p.goal.daily ? clamp(100 * today / p.goal.daily, 0, 100).toFixed(1) : 0}%"></i></span></span>
      <span class="spacer"></span>
      ${sprint}
      ${S.mode === "write" ? `<button type="button" data-sb="typewriter" class="${st.typewriter ? "on" : ""}" aria-pressed="${st.typewriter}">Typewriter</button>
      <button type="button" data-sb="focus" class="${S.focus ? "on" : ""}" aria-pressed="${S.focus}">Focus</button>` : ""}`;
  }
  function sprintMenu(x, y) {
    if (S.sprint) {
      ctxMenu(x, y, [{ label: "End sprint now", run: () => endSprint(true) }, { label: "Cancel sprint", danger: true, run: () => endSprint(false) }]);
      return;
    }
    ctxMenu(x, y, [10, 15, 25, 45, 60].map(m => ({ label: m + " minutes", run: () => startSprint(m) })));
  }
  let sprintTimer = 0;
  function startSprint(min) {
    S.sprint = { start: Date.now(), end: Date.now() + min * 60000, min, words: 0 };
    clearInterval(sprintTimer);
    sprintTimer = setInterval(() => { if (!S.sprint) return; if (Date.now() >= S.sprint.end) endSprint(true); else { const b = $('[data-sb="sprint"]'); if (b) renderStatus(); } }, 1000);
    renderStatus(); toast(`Sprint started: ${min} minutes. Write without looking back.`);
  }
  function endSprint(record) {
    const sp = S.sprint; S.sprint = null; clearInterval(sprintTimer);
    if (sp && record && P()) {
      const mins = Math.max(1, Math.round((Math.min(Date.now(), sp.end) - sp.start) / 60000));
      P().sprints.push({ t: sp.start, min: mins, words: sp.words }); if (P().sprints.length > 200) P().sprints.shift(); touch();
      toast(`Sprint complete: ${fmtFull(sp.words)} words in ${mins} minute${mins === 1 ? "" : "s"}${sp.words > 0 ? " · " + fmtFull(Math.round(sp.words / mins * 60)) + " an hour" : ""}.`, { ms: 8000 });
    }
    renderStatus();
  }
  function toggleFocus(v = !S.focus) {
    S.focus = v; $("#desk").classList.toggle("focus-mode", v);
    if (v) { if (S.mode !== "write") setMode("write"); toast("Focus mode. Press Esc to leave."); try { navigator.wakeLock && navigator.wakeLock.request("screen").then(l => S.wake = l, () => {}); } catch { /* fine */ } }
    else if (S.wake) { try { S.wake.release(); } catch { /* fine */ } S.wake = null; }
    $$('[data-cmd="focus"]').forEach(b => { b.classList.toggle("on", v); b.setAttribute("aria-pressed", String(v)); });
    renderStatus(); setTimeout(() => Editor.keepCaret(), 50);
  }
  function toggleTypewriter() {
    const st = S.meta.settings; st.typewriter = !st.typewriter; saveMetaSoon(); cacheSettings();
    const sc = $("#scroller"); sc && sc.classList.toggle("typewriter", st.typewriter);
    $$('[data-cmd="typewriter"]').forEach(b => { b.classList.toggle("on", st.typewriter); b.setAttribute("aria-pressed", String(st.typewriter)); });
    renderStatus(); Editor.keepCaret();
    toast(st.typewriter ? "Typewriter scrolling on: the line you write stays put." : "Typewriter scrolling off.");
  }

  /* ═════ Library ═════ */
  function ringSVG(frac) {
    const r = 18, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="bg" cx="22" cy="22" r="${r}"/><circle class="fg" cx="22" cy="22" r="${r}" stroke-dasharray="${(c * clamp(frac, 0, 1)).toFixed(1)} ${c.toFixed(1)}"/></svg>`;
  }
  function storageNote() {
    const k = Store.kind(), lb = S.meta.settings.lastBackup;
    if (k === "cloud") return { warn: false, html: `<span class="dot"></span><span><b>Private archive.</b> Your projects are stored with this page on claude.ai, readable only by you, on any device where you open it.</span>` };
    if (k === "local") return { warn: !lb || Date.now() - lb > 7 * 864e5, html: `<span class="dot"></span><span><b>Saved in this browser.</b> Clearing this site's data would erase it, so keep a backup. Last backup: ${lb ? ago(lb) : "never"}.</span>` };
    return { warn: true, html: `<span class="dot"></span><span><b>This browser refused storage.</b> Nothing will be kept after you close the page. Download a backup before you leave.</span>` };
  }
  /* Work kept only in this browser is one cleared cache from gone. The library says so, but a writer
     who resumes straight into a project never passes through it, so say it at the desk too. */
  function backupNudge() {
    if (Store.kind() !== "local") return;
    const lb = S.meta.settings.lastBackup || 0, words = S.meta.projects.filter(p => !p.sample).reduce((a, p) => a + (p.words || 0), 0);
    if (words < 1000 || Date.now() - lb < 7 * 864e5 || Date.now() - lsGet("nudged", 0) < 864e5) return;
    lsSet("nudged", Date.now());
    toast(lb ? `Your last backup was ${esc(ago(lb))}. This work is kept only in this browser.` : "This work is kept only in this browser, and there is no backup of it yet.", { action: "Download backup", onAction: () => backupAll(), ms: 15000 });
  }
  function renderLibrary() {
    const note = storageNote(), ls = $("#libStorage");
    ls.className = "lib-storage" + (note.warn ? " warn" : "");
    ls.innerHTML = note.html + `<span style="flex:1"></span><button class="btn small" type="button" data-lib="backup">Download backup</button>`;
    const list = S.meta.projects.slice().sort((a, b) => (b.updated || 0) - (a.updated || 0));
    $("#libCount").textContent = list.length ? list.length + (list.length === 1 ? " project" : " projects") : "";
    let html = `<button class="tome new" type="button" data-lib="new"><span class="plus">+</span><span><b>New project</b><br><span class="muted">Short story, novella, novel or serial</span></span></button>`;
    for (const t of list) {
      const frac = t.target ? t.words / t.target : 0;
      html += `<article class="tome ${t.sample ? "sample" : ""}"><button class="tome-open" type="button" data-open="${t.id}" aria-label="Open ${esc(t.title)}"></button>
        <div class="tome-top"><span class="form-badge hud">${esc(FORMS[t.form] ? FORMS[t.form].name : t.form)}${t.sample ? " · sample" : ""}</span>
          <button class="iconbtn tome-menu" type="button" data-tmenu="${t.id}" aria-label="Actions for ${esc(t.title)}">⋯</button></div>
        <div><h3>${esc(t.title)}</h3>${t.subtitle || t.author ? `<p class="sub">${esc(t.subtitle || "")}${t.subtitle && t.author ? " · " : ""}${t.author ? "by " + esc(t.author) : ""}</p>` : ""}</div>
        <div class="tome-foot">${ringSVG(frac)}<div class="meta"><b>${fmtFull(t.words)} words</b><span>${t.target ? Math.round(frac * 100) + "% of " + fmtN(t.target) : "No target"} · edited ${ago(t.updated)}</span></div></div></article>`;
    }
    if (!list.length) {
      html += `<article class="tome sample"><button class="tome-open" type="button" data-lib="sample" aria-label="Open the sample tome"></button>
        <div class="tome-top"><span class="form-badge hud">Novel · sample</span></div>
        <div><h3>The Tidewright's Lantern</h3><p class="sub">A sample with chapters, scene cards, threads and a codex, to see how the instrument works.</p></div>
        <div class="tome-foot">${ringSVG(0.02)}<div class="meta"><b>Open the sample</b><span>Delete it whenever you like</span></div></div></article>`;
    }
    $("#tomes").innerHTML = html;
  }
  async function createAndOpen(p, codex, texts) {
    for (const [nid, html] of Object.entries(texts || {})) Store.put(keyT(p.id, nid), html);
    Store.put(keyC(p.id), codex || { entries: [] });
    S.project = p; reindex();
    Store.put(keyP(p.id), p);
    metaUpsert(summaryOf(p)); saveMeta();
    await openProject(p.id);
    showDesk();
  }
  async function openSample() {
    const { p, codex } = sampleProject(); const texts = p._texts; delete p._texts;
    p.sel = Object.keys(texts)[0]; p.mode = "write";
    await createAndOpen(p, codex, texts);
    toast("This is a sample. Explore freely; delete it from the library when you're done.");
  }
  async function tomeAction(id, act) {
    const sum = S.meta.projects.find(x => x.id === id); if (!sum) return;
    if (act === "open") { try { await openProject(id); showDesk(); } catch (e) { toast(esc(e.message), { err: true }); } }
    if (act === "dup") {
      const b = await backupOf(id, false); const copy = b.project; const oldId = copy.id; copy.id = uid(); copy.title += " (copy)"; copy.created = now(); copy.sample = false;
      for (const [nid, html] of Object.entries(b.texts)) Store.put(keyT(copy.id, nid), html);
      Store.put(keyC(copy.id), b.codex); Store.put(keyP(copy.id), copy);
      metaUpsert({ ...sum, id: copy.id, title: copy.title, updated: now(), sample: false }); saveMeta(); renderLibrary();
      toast("Duplicated “" + esc(sum.title) + "”."); void oldId;
    }
    if (act === "backup") { const b = await backupOf(id, true); saveFile(fileSafe(sum.title) + ".astrolabe.json", JSON.stringify({ kind: "astrolabe-backup", v: 1, exported: now(), projects: [b] }), "application/json"); }
    if (act === "delete") {
      const r = await ask("Delete “" + sum.title + "”?", `All ${fmtFull(sum.words)} words, its codex and its snapshots will be deleted from this archive. Download a backup first if you might want it back.`, [["Cancel"], ["Download backup first", "gild"], ["Delete for good", "danger"]]);
      if (r === 1) { await tomeAction(id, "backup"); return; }
      if (r !== 2) return;
      const p = await Store.get(keyP(id));
      if (p) Object.values(p.nodes || {}).forEach(n => { if (n.type === "scene") { Store.del(keyT(id, n.id)); Store.del(keyS(id, n.id)); } });
      Store.del(keyP(id)); Store.del(keyC(id)); Store.del(keyR(id));
      metaRemove(id); saveMeta();
      if (S.project && S.project.id === id) S.project = null;
      if (lsGet("last") === id) lsSet("last", null);
      lsSet("view." + id, null);
      renderLibrary(); toast("Deleted “" + esc(sum.title) + "”.");
    }
  }
  function bindLibrary() {
    $("#library").addEventListener("click", e => {
      const o = e.target.closest("[data-open]"); if (o) { tomeAction(o.dataset.open, "open"); return; }
      const tm = e.target.closest("[data-tmenu]");
      if (tm) { const r = tm.getBoundingClientRect(), id = tm.dataset.tmenu; ctxMenu(r.right - 190, r.bottom + 4, [{ label: "Open", run: () => tomeAction(id, "open") }, { label: "Duplicate", run: () => tomeAction(id, "dup") }, { label: "Download backup", run: () => tomeAction(id, "backup") }, "-", { label: "Delete…", danger: true, run: () => tomeAction(id, "delete") }]); return; }
      const l = e.target.closest("[data-lib]"); if (!l) return;
      if (l.dataset.lib === "new") newProjectDialog();
      if (l.dataset.lib === "sample") openSample();
      if (l.dataset.lib === "backup") backupAll();
    });
    $("#libNew").onclick = () => newProjectDialog();
    $("#libSettings").onclick = () => settingsDialog();
    $("#libImport").onclick = () => $("#importFile").click();
    $("#importFile").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) importFile(f); });
  }

  /* ═════ New project ═════ */
  function newProjectDialog() {
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button>
      <div><p class="hud" style="margin:0 0 4px;color:var(--ion)">New project</p><h2>Chart a new story</h2></div>
      <label class="field"><span>Working title</span><input id="np-title" autofocus placeholder="The name on the spine" autocomplete="off"></label>
      <label class="field"><span>Author / pen name</span><input id="np-author" value="${esc(lsGet("author", ""))}" autocomplete="off"></label>
      <div class="field"><span>Form</span><div class="form-pick" role="radiogroup">${Object.entries(FORMS).map(([k, f], i) => `<label><input type="radio" name="np-form" value="${k}" ${i === 2 ? "checked" : ""}><b>${f.name}</b><span class="hud">${f.range}</span><small>${f.blurb}</small></label>`).join("")}</div></div>
      <div class="row2"><label class="field"><span>Structure</span><select id="np-tpl"></select></label>
        <label class="field"><span>Target words</span><input id="np-target" type="number" min="0" step="500"></label></div>
      <p class="muted" id="np-note" style="margin:-8px 0 0"></p>
      <div class="modal-foot"><button class="btn" type="button" data-x>Cancel</button><button class="btn gild" type="button" data-go>Create project</button></div>`);
    const tpl = $("#np-tpl"), tg = $("#np-target"); let tgEdited = false, tplEdited = false;
    const sync = () => {
      const form = $('input[name="np-form"]:checked').value;
      const cur = tpl.value;
      const opts = Object.entries(TEMPLATES).filter(([, t]) => t.forms.includes(form));
      tpl.innerHTML = opts.map(([k, t]) => `<option value="${k}">${t.name}</option>`).join("");
      const def = { serial: "season", short: "five", novella: "three", novel: "three" }[form];
      tpl.value = tplEdited && opts.some(([k]) => k === cur) ? cur : def;
      if (!tgEdited) tg.value = FORMS[form].target;
      $("#np-note").textContent = TEMPLATES[tpl.value].note;
    };
    sync();
    m.el.addEventListener("change", e => { if (e.target.name === "np-form") sync(); if (e.target === tpl) { tplEdited = true; $("#np-note").textContent = TEMPLATES[tpl.value].note; } });
    tg.addEventListener("input", () => tgEdited = true);
    const go = async () => {
      const title = $("#np-title").value.trim() || "Untitled";
      const author = $("#np-author").value.trim(); lsSet("author", author);
      const p = newProject({ title, author, form: $('input[name="np-form"]:checked').value, template: tpl.value, target: parseInt(tg.value, 10) || 0 });
      p.history[dayKey()] = 0;
      m.close();
      S.project = p; reindex();
      p.sel = IX.order[0] || null; p.mode = tpl.value === "blank" ? "write" : "board";
      if (p.mode === "board") p.sel = null;
      await createAndOpen(p, { entries: [] }, {});
      toast(`“${esc(title)}” is ready. ${p.mode === "board" ? "The board holds your structure: rename the cards, then double-click one to write." : "Start typing."}`, { ms: 6000 });
    };
    m.el.addEventListener("click", e => { if (e.target.closest("[data-x]")) m.close(); if (e.target.closest("[data-go]")) go(); });
    m.el.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "radio") { e.preventDefault(); go(); } });
  }

  /* ═════ Settings ═════ */
  function settingsDialog() {
    const st = S.meta.settings;
    const note = storageNote();
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>Settings</h2>
      <div class="set-grid">
        <div class="set-row"><span>Skin</span><div class="skins">${SKINS.map(([k, l, c]) => `<button class="skin ${st.skin === k ? "on" : ""}" type="button" data-skin="${k}"><span class="sw" style="background:${c[0]}">${c.slice(1).map(x => `<i style="background:${x}"></i>`).join("")}</span><span>${l}</span></button>`).join("")}</div></div>
        <div class="set-row"><span>Prose face</span><div class="seg">${PROSE_FONTS.map(([k, l, f]) => `<button type="button" class="${st.font === k ? "on" : ""}" data-font="${k}" style="font-family:${f.replace(/"/g, "&quot;")}">${l}</button>`).join("")}</div></div>
        <div class="set-row"><span>Text size</span><div class="range-val"><input type="range" id="set-size" min="15" max="26" step="1" value="${st.size}"><output id="o-size">${st.size}px</output></div></div>
        <div class="set-row"><span>Line spacing</span><div class="range-val"><input type="range" id="set-lh" min="1.4" max="2.2" step="0.05" value="${st.lh}"><output id="o-lh">${st.lh}</output></div></div>
        <div class="set-row"><span>Page width</span><div class="range-val"><input type="range" id="set-measure" min="46" max="90" step="2" value="${st.measure}"><output id="o-measure">${st.measure}ch</output></div></div>
        <div class="set-row"><span>Paragraphs</span><div class="seg"><button type="button" data-para="indent" class="${st.para === "indent" ? "on" : ""}">Indented, like a book</button><button type="button" data-para="space" class="${st.para === "space" ? "on" : ""}">Spaced, like the web</button></div></div>
        <div class="set-row"><span>Writing aids</span><div style="display:grid;gap:8px">
          <label class="check"><input type="checkbox" id="set-smart" ${st.smart ? "checked" : ""}> Smart punctuation: curly quotes, -- to em dash, ... to ellipsis</label>
          <label class="check"><input type="checkbox" id="set-tw" ${st.typewriter ? "checked" : ""}> Typewriter scrolling</label>
          <label class="check"><input type="checkbox" id="set-spell" ${st.spell ? "checked" : ""}> Spellcheck</label>
          <label class="check"><input type="checkbox" id="set-amb" ${st.ambience ? "checked" : ""}> Starfield in the background</label></div></div>
        <div class="set-row"><span>Storage</span><div style="display:grid;gap:8px"><div class="lib-storage ${note.warn ? "warn" : ""}">${note.html}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" type="button" data-backup>Download full backup</button><button class="btn small" type="button" data-restore>Restore from backup…</button></div></div></div>
        <div class="set-row"><span>Keys</span><div class="kbd-list">
          <kbd>Ctrl K</kbd><span>Command palette: jump to any scene, entry or action</span>
          <kbd>Ctrl S</kbd><span>Save now (saving is also automatic)</span>
          <kbd>Ctrl Shift S</kbd><span>Snapshot the current scene</span>
          <kbd>Ctrl \\</kbd><span>Retract or bring back the binder (rest the pointer on the left edge to peek)</span>
          <kbd>Ctrl Shift \\</kbd><span>Retract or bring back the inspector</span>
          <kbd>Ctrl Shift H</kbd><span>Find and replace across the manuscript</span>
          <kbd>Ctrl Shift F</kbd><span>Focus mode</span>
          <kbd>Ctrl Alt N</kbd><span>New scene after this one</span>
          <kbd>Ctrl Shift Enter</kbd><span>Scene break</span>
          <kbd>Ctrl Alt ↑ ↓</kbd><span>Previous / next scene</span>
          <kbd>Alt 1–6</kbd><span>Write, Board, Outline, Threads, Codex, Progress</span></div></div>
      </div>
      <div class="modal-foot"><button class="btn gild" type="button" data-x>Done</button></div>`, { wide: true });
    const set = (k, v) => { st[k] = v; applySettings(); saveMetaSoon(); };
    m.el.addEventListener("click", e => {
      if (e.target.closest("[data-x]")) { m.close(); return; }
      const sk = e.target.closest("[data-skin]"); if (sk) { set("skin", sk.dataset.skin); $$("[data-skin]", m.el).forEach(b => b.classList.toggle("on", b === sk)); }
      const f = e.target.closest("[data-font]"); if (f) { set("font", f.dataset.font); $$("[data-font]", m.el).forEach(b => b.classList.toggle("on", b === f)); }
      const pa = e.target.closest("[data-para]"); if (pa) { set("para", pa.dataset.para); $$("[data-para]", m.el).forEach(b => b.classList.toggle("on", b === pa)); const ms = $(".manuscript"); ms && (ms.className = "manuscript para-" + st.para); }
      if (e.target.closest("[data-backup]")) backupAll();
      if (e.target.closest("[data-restore]")) { m.close(); $("#importFile").click(); }
    });
    m.el.addEventListener("input", e => {
      const t = e.target;
      if (t.id === "set-size") { set("size", +t.value); $("#o-size").textContent = t.value + "px"; }
      if (t.id === "set-lh") { set("lh", +t.value); $("#o-lh").textContent = t.value; }
      if (t.id === "set-measure") { set("measure", +t.value); $("#o-measure").textContent = t.value + "ch"; }
    });
    m.el.addEventListener("change", e => {
      const t = e.target;
      if (t.id === "set-smart") set("smart", t.checked);
      if (t.id === "set-tw") { if (t.checked !== st.typewriter) toggleTypewriter(); }
      if (t.id === "set-spell") { set("spell", t.checked); $$(".prose").forEach(p => p.spellcheck = t.checked); }
      if (t.id === "set-amb") set("ambience", t.checked);
    });
  }

  /* ═════ Backups & import ═════ */
  const fileSafe = s => (String(s || "untitled").replace(/[\\/:*?"<>|]+/g, "").replace(/\s+/g, " ").trim().slice(0, 80) || "untitled");
  async function backupOf(pid, withSnaps) {
    const isOpen = S.project && S.project.id === pid;
    if (isOpen) flushAll();
    const project = isOpen ? structuredClone(S.project) : await Store.get(keyP(pid));
    const codex = isOpen ? structuredClone(S.codex) : (await Store.get(keyC(pid))) || { entries: [] };
    const texts = {}, snaps = {};
    const ids = Object.values(project.nodes).filter(n => n.type === "scene").map(n => n.id);
    for (let i = 0; i < ids.length; i += 24) {
      await Promise.all(ids.slice(i, i + 24).map(async nid => {
        texts[nid] = isOpen && S.texts.has(nid) ? S.texts.get(nid) : (await Store.get(keyT(pid, nid))) || "";
        if (withSnaps) { const s = await Store.get(keyS(pid, nid)); if (s && s.length) snaps[nid] = s; }
      }));
    }
    return { project, codex, texts, snaps };
  }
  async function backupAll() {
    const projects = [];
    const skipped = [];
    for (const s of S.meta.projects) { try { projects.push(await backupOf(s.id, true)); } catch (e) { console.warn("backup skipped", s.id, e); skipped.push(s.title); } }
    if (skipped.length) toast("Not in this backup, because it could not be read: " + skipped.map(esc).join(", ") + ".", { err: true, ms: 10000 });
    const ok = await saveFile("astrolabe-backup-" + dayKey() + ".json", JSON.stringify({ kind: "astrolabe-backup", v: 1, exported: now(), projects }), "application/json");
    if (ok !== false) { S.meta.settings.lastBackup = now(); saveMeta(); if (!$("#library").hidden) renderLibrary(); }
  }
  async function importFile(f) {
    let text;
    try { text = await f.text(); } catch { toast("That file could not be read.", { err: true }); return; }
    if (/\.json$/i.test(f.name) || /^\s*\{/.test(text)) {
      let data; try { data = JSON.parse(text); } catch { toast("That JSON file is not valid.", { err: true }); return; }
      const items = data && data.kind === "astrolabe-backup" ? data.projects : data && data.project ? [data] : null;
      if (!items || !items.length) { toast("That file is not an Astrolabe backup.", { err: true }); return; }
      let n = 0;
      for (const raw of items) {
        let it = null; try { it = cleanBackupItem(raw); } catch (e) { console.warn("backup item rejected", e); }
        if (!it) continue;
        const p = it.project;
        normalizeProject(p);
        if (S.meta.projects.some(x => x.id === p.id)) {
          const r = await ask("“" + p.title + "” is already in your library", "Replace the copy here with the one in the backup, or keep both?", [["Skip"], ["Replace", "danger"], ["Keep both", "gild"]]);
          if (r <= 0) continue;
          if (r === 2) { p.id = uid(); p.title += " (restored)"; }
        }
        for (const [nid, html] of Object.entries(it.texts)) Store.put(keyT(p.id, nid), html);
        for (const [nid, s] of Object.entries(it.snaps)) Store.put(keyS(p.id, nid), s);
        Store.put(keyC(p.id), it.codex);
        p.rev = uid(); // a tab that has the replaced copy open will notice and reload
        Store.put(keyP(p.id), p); Store.put(keyR(p.id), { rev: p.rev, t: now() });
        lsSet("view." + p.id, null);
        const prev = S.project; S.project = p; reindex(); const sum = summaryOf(p); S.project = prev; if (prev) reindex();
        metaUpsert(sum); n++;
      }
      saveMeta(); showLibrary(); toast(n ? `Restored ${n} project${n === 1 ? "" : "s"}.` : "Nothing was restored.");
      return;
    }
    const p = projectFromText(text, f.name); const texts = p._texts; delete p._texts;
    p.sel = null; p.mode = "board";
    await createAndOpen(p, { entries: [] }, texts);
    toast(`Imported “${esc(p.title)}”: ${IX.chapters.length} ${esc(labelOf("chapter").toLowerCase())}s, ${IX.order.length} scenes, ${fmtFull(projectWords())} words.`, { ms: 7000 });
  }

  /* ═════ Export ═════ */
  const cssStr = s => String(s).replace(/["\\<>&\n\r\f]/g, c => "\\" + c.codePointAt(0).toString(16) + " ");
  function included(id) { return node(id).include !== false && ancestors(id).every(a => node(a).include !== false); }
  function headingFor(ch, style) {
    const n = node(ch), num = IX.chapters.indexOf(ch) + 1, lab = labelOf("chapter");
    if (style === "title") return n.title;
    if (style === "number") return lab + " " + numberWords(num);
    return lab + " " + numberWords(num) + (n.title ? ": " + n.title : "");
  }
  async function buildExport(fmt, scope, o) {
    await loadAllTexts();
    const p = P(), ids = scenesUnder(scope).filter(included);
    const partOf = id => ancestors(id).find(a => node(a).type === "part") || null;
    const items = []; let lastCh, lastPart;
    for (const id of ids) {
      const pt = partOf(id), ch = chapterOf(id);
      if (pt !== lastPart) { lastPart = pt; if (pt) items.push({ part: pt }); }
      if (ch !== lastCh) { lastCh = ch; if (ch) items.push({ chapter: ch }); }
      else if (items.length && items[items.length - 1].scene) items.push({ sep: true });
      items.push({ scene: id, blocks: proseBlocks(S.texts.get(id) || "") });
    }
    const title = scope ? node(scope).title : p.title;
    const author = p.author || "";
    const words = ids.reduce((a, id) => a + (node(id).words || 0), 0);
    const sep = o.sep;
    const partHead = pt => labelOf("part") + " " + numberWords(p.root.filter(r => node(r).type === "part").indexOf(pt) + 1) + (node(pt).title ? ": " + node(pt).title : "");
    if (fmt === "md") {
      let s = `# ${title}\n\n${author ? "*by " + author + "*\n\n" : ""}`;
      for (const it of items) {
        if (it.part) s += `\n# ${partHead(it.part)}\n\n`;
        else if (it.chapter) s += `\n## ${headingFor(it.chapter, o.heads)}\n\n`;
        else if (it.sep) s += o.titles ? "" : `${sep}\n\n`;
        else { if (o.titles) s += `### ${node(it.scene).title || "Untitled scene"}\n\n`; for (const b of it.blocks) s += b.hr ? `${sep}\n\n` : b.md.trim() + "\n\n"; }
      }
      return { name: fileSafe(title) + ".md", data: s.replace(/\n{3,}/g, "\n\n").trim() + "\n", mime: "text/markdown" };
    }
    if (fmt === "txt") {
      let s = `${title.toUpperCase()}\n${author ? "by " + author + "\n" : ""}\n\n`;
      for (const it of items) {
        if (it.part) s += `\n\n${partHead(it.part).toUpperCase()}\n\n`;
        else if (it.chapter) s += `\n\n${headingFor(it.chapter, o.heads)}\n\n`;
        else if (it.sep) s += `${sep}\n\n`;
        else for (const b of it.blocks) s += b.hr ? `${sep}\n\n` : b.text.trim() + "\n\n";
      }
      return { name: fileSafe(title) + ".txt", data: s.replace(/\n{4,}/g, "\n\n\n").trim() + "\n", mime: "text/plain" };
    }
    if (fmt === "html") {
      const round = words < 20000 ? Math.max(100, Math.round(words / 100) * 100) : Math.round(words / 1000) * 1000;
      const surname = (author.split(" ").pop() || "Author");
      let body = "", first = true;
      for (const it of items) {
        if (it.part) { body += `<h1 class="part">${esc(partHead(it.part))}</h1>`; first = true; }
        else if (it.chapter) { body += `<h2 class="chapter">${esc(headingFor(it.chapter, o.heads))}</h2>`; first = true; }
        else if (it.sep) { body += `<p class="brk">${esc(sep)}</p>`; first = true; }
        else for (const b of it.blocks) { if (b.hr) { body += `<p class="brk">${esc(sep)}</p>`; first = true; } else { body += `<p${first ? ' class="first"' : ""}>${b.html}</p>`; first = false; } }
      }
      const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
@page { size: letter; margin: 1in; @top-right { content: "${cssStr(surname)} / ${cssStr(title.slice(0, 40).toUpperCase())} / " counter(page); font: 12pt "Times New Roman", serif; } }
body { font: 12pt/2 ${o.font === "courier" ? '"Courier New", Courier, monospace' : '"Times New Roman", Times, serif'}; color: #000; background: #fff; max-width: 6.5in; margin: 1in auto; }
.cover { height: 9in; position: relative; page-break-after: always; }
.cover .who { position: absolute; top: 0; left: 0; line-height: 1.2; }
.cover .wc { position: absolute; top: 0; right: 0; }
.cover .t { position: absolute; top: 3.5in; width: 100%; text-align: center; line-height: 1.6; }
.cover .t b { text-transform: uppercase; font-weight: normal; }
h1.part, h2.chapter { page-break-before: always; text-align: center; font: inherit; margin: 2.5in 0 1em; }
h1.part { text-transform: uppercase; }
p { margin: 0; text-indent: .5in; }
p.first { text-indent: 0; }
p.brk { text-align: center; text-indent: 0; }
p.end { text-align: center; text-indent: 0; margin-top: 1em; }
</style></head><body>
<div class="cover"><div class="who">${esc(author || "Author name")}<br>${o.contact ? esc(o.contact).replace(/\n/g, "<br>") : "Address · email · phone"}</div><div class="wc">About ${fmtFull(round)} words</div>
<div class="t"><b>${esc(title)}</b><br>by ${esc(author || "Author name")}</div></div>
${body}<p class="end">END</p></body></html>`;
      return { name: fileSafe(title) + " (manuscript).html", data: doc, mime: "text/html" };
    }
    if (fmt === "outline") {
      let s = `# ${title} · outline\n\n`;
      if (p.logline) s += `> ${p.logline}\n\n`;
      const walk = (ids2, depth) => ids2.forEach(id => {
        const n = node(id); if (!n || !included(id)) return;
        if (n.type !== "scene") { s += `${"#".repeat(Math.min(4, depth + 2))} ${IX.coord[id]} ${n.title}\n\n${n.synopsis ? n.synopsis + "\n\n" : ""}`; walk(n.children, depth + 1); return; }
        const meta = [n.pov && "POV " + n.pov, n.place, n.when, statusName(n.status), fmtFull(n.words) + " words"].filter(Boolean).join(" · ");
        s += `- **${IX.coord[id]} ${n.title}** (${meta})${n.synopsis ? "\n  " + n.synopsis : ""}\n`;
      });
      walk(scope ? [scope] : p.root, 0);
      return { name: fileSafe(title) + " outline.md", data: s.replace(/\n(#)/g, "\n\n$1").replace(/\n{3,}/g, "\n\n"), mime: "text/markdown" };
    }
    if (fmt === "docx" || fmt === "epub") {
      const doc = [];
      for (const it of items) {
        if (it.part) doc.push({ kind: "part", text: partHead(it.part) });
        else if (it.chapter) doc.push({ kind: "chapter", text: headingFor(it.chapter, o.heads) });
        else if (it.sep) doc.push({ kind: "break" });
        else for (const b of it.blocks) doc.push(b.hr ? { kind: "break" } : { kind: "para", runs: Formats.inlineRuns(b.html) });
      }
      const meta = { id: p.id + (scope ? "." + scope : ""), title, author, words, contact: o.contact, font: o.font, sep };
      return fmt === "docx"
        ? { name: fileSafe(title) + ".docx", data: Formats.docx(meta, doc), mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
        : { name: fileSafe(title) + ".epub", data: Formats.epub(meta, doc), mime: "application/epub+zip" };
    }
    if (fmt === "json") {
      const b = await backupOf(p.id, true);
      return { name: fileSafe(p.title) + ".astrolabe.json", data: JSON.stringify({ kind: "astrolabe-backup", v: 1, exported: now(), projects: [b] }), mime: "application/json" };
    }
  }
  function exportDialog(preset) {
    Editor.flush();
    const p = P(), sel = S.sel && node(S.sel);
    const scopes = [["", "Whole project · " + fmtFull(projectWords()) + " words"]];
    if (sel) { const c = sel.type === "scene" ? chapterOf(sel.id) : sel.id; if (c) scopes.push([c, labelOf(node(c).type) + " " + IX.coord[c] + " · " + node(c).title]); if (sel.type === "scene") scopes.push([sel.id, "Scene " + IX.coord[sel.id] + " · " + sel.title]); }
    if (p.form === "serial") IX.chapters.forEach(c => { if (!scopes.some(s => s[0] === c)) scopes.push([c, "Episode " + IX.coord[c] + " · " + node(c).title]); });
    const fmts = [["md", "Markdown", ".md · for editors, Obsidian, Ulysses, the web"], ["docx", "Word", ".docx · standard manuscript format, for agents, editors and submissions"], ["epub", "E-book", ".epub · for e-readers and beta readers"], ["html", "Manuscript page", ".html · standard manuscript format, ready to print"], ["txt", "Plain text", ".txt · paste anywhere"], ["outline", "Outline", ".md · synopses, POV, status"], ["json", "Project backup", ".json · everything, to restore later"]];
    const m = modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>Export</h2>
      <div class="field"><span>Format</span><div class="form-pick">${fmts.map(([k, l, d]) => `<label><input type="radio" name="ex-fmt" value="${k}" ${k === (preset || "md") ? "checked" : ""}><b>${l}</b><small>${d}</small></label>`).join("")}</div></div>
      <label class="field"><span>What to export</span><select id="ex-scope">${scopes.map(([k, l]) => `<option value="${esc(k)}">${esc(l)}</option>`).join("")}</select></label>
      <div class="row2" id="ex-opts"><label class="field"><span>${esc(labelOf("chapter"))} headings</span><select id="ex-heads"><option value="both">${esc(labelOf("chapter"))} One: Title</option><option value="title">Title only</option><option value="number">${esc(labelOf("chapter"))} One</option></select></label>
        <label class="field"><span>Scene break</span><select id="ex-sep"><option value="* * *">* * *</option><option value="#">#</option><option value="✦">✦</option></select></label></div>
      <div class="row2" id="ex-ms"><label class="field"><span>Manuscript font</span><select id="ex-font"><option value="times">Times New Roman</option><option value="courier">Courier</option></select></label>
        <label class="field"><span>Contact block</span><textarea id="ex-contact" rows="2" placeholder="Address, email, phone">${esc(lsGet("contact", ""))}</textarea></label></div>
      <label class="check" id="ex-titles-row"><input type="checkbox" id="ex-titles"> Keep scene titles as headings, so the file can be imported again with its scenes intact</label>
      <p class="muted" style="margin:0">Scenes and ${esc(labelOf("chapter").toLowerCase())}s marked “Leave out of export” in the binder are skipped.</p>
      <div class="modal-foot"><button class="btn" type="button" data-x>Cancel</button><button class="btn gild" type="button" data-go>Export</button></div>`);
    const sync = () => { const f = $('input[name="ex-fmt"]:checked').value; $("#ex-opts").hidden = !["md", "txt", "html", "docx", "epub"].includes(f); $("#ex-ms").hidden = f !== "html" && f !== "docx"; $("#ex-titles-row").hidden = f !== "md"; $("#ex-scope").disabled = f === "json"; };
    sync(); m.el.addEventListener("change", sync);
    m.el.addEventListener("click", async e => {
      if (e.target.closest("[data-x]")) m.close();
      if (e.target.closest("[data-go]")) {
        const fmt = $('input[name="ex-fmt"]:checked').value;
        const o = { heads: $("#ex-heads").value, sep: $("#ex-sep").value, font: $("#ex-font").value, contact: $("#ex-contact").value, titles: $("#ex-titles").checked };
        lsSet("contact", o.contact);
        let out; try { out = await buildExport(fmt, $("#ex-scope").value || null, o); }
        catch (err) { console.warn("export failed", err); toast("The export could not be built: " + esc((err && err.message) || "storage did not answer") + ".", { err: true, ms: 8000 }); return; }
        m.close();
        const ok = await saveFile(out.name, out.data, out.mime);
        if (ok !== false && fmt === "json") { S.meta.settings.lastBackup = now(); saveMetaSoon(); }
      }
    });
  }

  /* ═════ Command palette ═════ */
  function palette() {
    if (!P()) return;
    const cmds = [
      ["Write", "✎", () => setMode("write"), "Alt+1"], ["Board", "▦", () => setMode("board"), "Alt+2"], ["Outline", "☰", () => setMode("outline"), "Alt+3"],
      ["Threads", "≋", () => setMode("threads"), "Alt+4"], ["Codex", "✶", () => setMode("codex"), "Alt+5"], ["Progress", "◔", () => setMode("progress"), "Alt+6"],
      ["Find and replace…", "⌕", () => Find.open(), "Ctrl+Shift+H"],
      ["Split the scene at the cursor", "✂", () => splitScene()],
      ...(S.active && nextScene(S.active) ? [["Merge this scene with the next", "⧉", () => mergeNext(S.active)]] : []),
      ...(S.active || S.sel ? [["Move this to…", "↹", () => moveDialog(S.active || S.sel)]] : []),
      ["New scene", "+", () => { const n = addNode("scene"); renderBinder(); openScene(n.id); }, "Ctrl+Alt+N"],
      ["New " + labelOf("chapter").toLowerCase(), "+", () => { const n = addNode("chapter"); renderBinder(); select(n.id); renameInline(n.id); }],
      ["New " + labelOf("part").toLowerCase(), "+", () => { const n = addNode("part"); renderBinder(); select(n.id); renameInline(n.id); }],
      ["New codex entry", "✶", () => Views.act("codex-new")],
      ["Show or hide the binder", "◧", () => toggleBinder(), "Ctrl+\\"], ["Show or hide the inspector", "◨", () => toggleInspector(), "Ctrl+Shift+\\"],
      ["Focus mode", "◎", () => toggleFocus(), "Ctrl+Shift+F"], ["Typewriter scrolling", "≡", () => toggleTypewriter()],
      ["Take snapshot", "◫", () => snapshotActive(), "Ctrl+Shift+S"], ["Start a 25-minute sprint", "◷", () => startSprint(25)],
      ["Export…", "↧", () => exportDialog()], ["Download backup", "↧", () => backupAll()], ["Settings", "⚙", () => settingsDialog()], ["Back to the library", "⌂", () => showLibrary()],
      ...SKINS.map(([k, l]) => ["Skin: " + l, "◐", () => { S.meta.settings.skin = k; applySettings(); saveMetaSoon(); }]),
    ].map(([t, g, run, k]) => ({ t, g, run, h: k || "", kind: "cmd" }));
    const nodes = Object.values(P().nodes).filter(n => IX.coord[n.id]).map(n => ({ t: n.title || "Untitled", g: n.type === "scene" ? "§" : n.type === "part" ? "Ⅰ" : "❡", h: IX.coord[n.id] + " · " + labelOf(n.type), run: () => n.type === "scene" ? openScene(n.id) : select(n.id), kind: "node", sub: n.synopsis || "" }));
    const ents = (S.codex.entries || []).map(e => ({ t: e.name || "Unnamed", g: catGlyph(e.cat), h: catName(e.cat), run: () => { S.codexSel = e.id; setMode("codex"); renderStage(); }, kind: "entry", sub: e.aliases + " " + e.summary }));
    const all = [...nodes, ...ents, ...cmds];
    const m = modal(`<input id="palQ" placeholder="Jump to a scene, codex entry or command…" autocomplete="off" aria-label="Search"><div class="pal-list" id="palList" role="listbox"></div>`, { cls: "palette" });
    let sel = 0, shown = [];
    const score = (q, it) => {
      if (!q) return it.kind === "cmd" ? 1 : it.kind === "node" ? 2 : 0;
      const t = it.t.toLowerCase(), h = (it.h + " " + (it.sub || "")).toLowerCase();
      if (t.startsWith(q)) return 100 - t.length / 100;
      if (t.includes(q)) return 80 - t.indexOf(q);
      if (h.includes(q)) return 50;
      let i = 0; for (const c of t) if (c === q[i]) i++;
      return i === q.length ? 20 : -1;
    };
    const draw = () => {
      const q = $("#palQ").value.trim().toLowerCase();
      shown = all.map(it => [score(q, it), it]).filter(([s]) => s >= 0).sort((a, b) => b[0] - a[0]).slice(0, 40).map(x => x[1]);
      if (!q) shown = [...nodes.filter(n => n.kind === "node").slice(0, 0), ...cmds.slice(0, 18), ...nodes.slice(0, 12)];
      sel = clamp(sel, 0, Math.max(0, shown.length - 1));
      $("#palList").innerHTML = shown.map((it, i) => `<button type="button" class="pal-item ${i === sel ? "on" : ""}" data-i="${i}" role="option" aria-selected="${i === sel}"><span class="g">${esc(it.g)}</span><span class="t">${esc(it.t)}</span><span class="h">${esc(it.h)}</span></button>`).join("") || '<p class="muted" style="padding:10px 12px">Nothing matches.</p>';
      const on = $("#palList .on"); on && on.scrollIntoView({ block: "nearest" });
    };
    const run = i => { const it = shown[i]; if (!it) return; m.close(); setTimeout(() => it.run(), 10); };
    draw();
    $("#palQ").addEventListener("input", () => { sel = 0; draw(); });
    $("#palQ").addEventListener("keydown", e => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel++; draw(); }
      if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); draw(); }
      if (e.key === "Enter") { e.preventDefault(); run(sel); }
    });
    $("#palList").addEventListener("click", e => { const b = e.target.closest("[data-i]"); if (b) run(+b.dataset.i); });
  }
  function snapshotActive() {
    const id = S.active || (S.sel && node(S.sel) && node(S.sel).type === "scene" ? S.sel : null);
    if (!id) { toast("Open a scene to snapshot it."); return; }
    Editor.flush(); takeSnapshot(id, "Manual", true).then(() => { toast(`Snapshot of “${esc(node(id).title)}” taken.`); if (inspTarget() === id) loadSnaps(id); });
  }
  function stepScene(dir) {
    const order = IX.order; if (!order.length) return;
    const cur = S.active || S.sel; let i = order.indexOf(cur);
    if (i < 0) { const sc = cur ? scenesUnder(cur) : []; i = sc.length ? order.indexOf(dir > 0 ? sc[sc.length - 1] : sc[0]) : -1; }
    const j = clamp(i + dir, 0, order.length - 1);
    if (j !== i || i < 0) openScene(order[j < 0 ? 0 : j]);
  }

  /* ═════ Retractable side panels ═════ */
  const narrow = () => matchMedia("(max-width: 900px)").matches;
  function syncPanelButtons() {
    const d = $("#desk"), wide = !narrow();
    const b = wide ? !d.classList.contains("no-binder") : d.classList.contains("show-binder");
    const i = wide ? !d.classList.contains("no-insp") : d.classList.contains("show-insp");
    $("#btnBinder").classList.toggle("on", b); $("#btnBinder").setAttribute("aria-pressed", String(b));
    $("#btnInspector").classList.toggle("on", i); $("#btnInspector").setAttribute("aria-pressed", String(i));
  }
  function returnFocus(panel) {
    if (!panel.contains(document.activeElement)) return;
    const pr = S.active && $(`.prose[data-id="${CSS.escape(S.active)}"]`);
    if (pr) Editor.placeCaret(pr, true); else document.activeElement.blur();
  }
  function toggleBinder(hide) {
    const d = $("#desk");
    if (narrow()) { d.classList.toggle("show-binder", hide === undefined ? undefined : !hide); d.classList.remove("show-insp"); syncPanelButtons(); return; }
    if (S.focus && hide === undefined) { toggleFocus(false); d.classList.remove("no-binder"); lsSet("hideBinder", false); syncPanelButtons(); return; }
    const h = hide === undefined ? !d.classList.contains("no-binder") : hide;
    d.classList.toggle("no-binder", h); d.classList.remove("peek-binder"); lsSet("hideBinder", h);
    if (h) returnFocus($("#binder"));
    syncPanelButtons();
  }
  function toggleInspector(hide) {
    const d = $("#desk");
    if (narrow()) { d.classList.toggle("show-insp", hide === undefined ? undefined : !hide); d.classList.remove("show-binder"); renderInspector(); syncPanelButtons(); return; }
    if (S.focus && hide === undefined) { toggleFocus(false); d.classList.remove("no-insp"); lsSet("hideInsp", false); syncPanelButtons(); return; }
    const h = hide === undefined ? !d.classList.contains("no-insp") : hide;
    d.classList.toggle("no-insp", h); lsSet("hideInsp", h);
    if (h) returnFocus($("#inspector")); else renderInspector();
    syncPanelButtons();
  }
  /* While the binder is retracted, resting the pointer on the left edge slides it out over the page. */
  function bindPeek() {
    const d = $("#desk"), edge = $("#binderEdge"), b = $("#binder");
    let enterT = 0, leaveT = 0;
    const retracted = () => d.classList.contains("no-binder") || d.classList.contains("focus-mode");
    const close = () => { clearTimeout(leaveT); clearTimeout(enterT); d.classList.remove("peek-binder"); };
    edge.addEventListener("mouseenter", () => { clearTimeout(enterT); enterT = setTimeout(() => { if (retracted()) d.classList.add("peek-binder"); }, 220); });
    edge.addEventListener("mouseleave", () => clearTimeout(enterT));
    edge.addEventListener("click", () => { if (retracted()) d.classList.add("peek-binder"); });
    b.addEventListener("mouseenter", () => clearTimeout(leaveT));
    b.addEventListener("mouseleave", () => {
      if (!d.classList.contains("peek-binder")) return;
      leaveT = setTimeout(() => {
        if (!$("#ctx").hidden || (b.contains(document.activeElement) && document.activeElement.matches("input"))) return;
        close();
      }, 350);
    });
    document.addEventListener("mousedown", e => { if (d.classList.contains("peek-binder") && !b.contains(e.target) && !e.target.closest("#ctx")) close(); });
    S.closePeek = () => { if (!d.classList.contains("peek-binder")) return false; close(); return true; };
  }

  /* ═════ Topbar & status bar wiring ═════ */
  function bindChrome() {
    $("#btnLibrary").onclick = () => showLibrary();
    $("#btnPalette").onclick = () => palette();
    $("#btnExport").onclick = () => exportDialog();
    $("#btnSettings").onclick = () => settingsDialog();
    $("#btnInspector").onclick = () => toggleInspector();
    $("#btnBinder").onclick = () => toggleBinder();
    $("#binderClose").onclick = () => toggleBinder(true);
    bindPeek();
    matchMedia("(max-width: 900px)").addEventListener("change", () => { $("#desk").classList.remove("show-binder", "show-insp", "peek-binder"); syncPanelButtons(); });
    $("#scrim").onclick = () => { $("#desk").classList.remove("show-binder", "show-insp"); syncPanelButtons(); };
    $("#modes").addEventListener("click", e => { const b = e.target.closest("[data-mode]"); if (b) setMode(b.dataset.mode); });
    $("#modes").addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const tabs = $$("#modes [data-mode]"); const i = tabs.findIndex(t => t.dataset.mode === S.mode);
      const t = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length]; setMode(t.dataset.mode); t.focus();
    });
    $("#statusbar").addEventListener("click", e => {
      const b = e.target.closest("[data-sb]"); if (!b) return;
      if (b.dataset.sb === "sprint") { const r = b.getBoundingClientRect(); sprintMenu(r.left, r.top - 230); }
      if (b.dataset.sb === "typewriter") toggleTypewriter();
      if (b.dataset.sb === "focus") toggleFocus();
    });
    const stage = $("#stage");
    stage.addEventListener("click", e => {
      const c = e.target.closest("[data-cmd]");
      if (c) {
        const k = c.dataset.cmd;
        if (k === "bold" || k === "italic" || k === "break") { e.preventDefault(); Editor.exec(k); return; }
        if (k === "split") { e.preventDefault(); return splitScene(); }
        if (k === "typewriter") return toggleTypewriter();
        if (k === "focus") return toggleFocus();
        if (k === "snapshot") return snapshotActive();
        if (k === "retry") return renderStage();
        if (k === "addscene") { const n = addNode("scene", S.active || S.sel); renderBinder(); openScene(n.id); return; }
        if (k === "addchapter") { const n = addNode("chapter", S.active || S.sel); renderBinder(); select(n.id, { mode: "write" }); return; }
      }
      const a = e.target.closest("[data-act]"); if (a) { Views.act(a.dataset.act, a); return; }
      const card = e.target.closest(".card[data-id]");
      if (card && S.mode === "board" && S.sel !== card.dataset.id) {
        S.sel = card.dataset.id; S.active = S.sel; saveView();
        $$(".card.sel", stage).forEach(x => x.classList.remove("sel")); card.classList.add("sel");
        renderBinder(); renderInspector(); renderStatus();
      }
    });
    // keep the B / I / ✦ buttons from stealing the caret
    stage.addEventListener("mousedown", e => { const c = e.target.closest("[data-cmd]"); if (c && ["bold", "italic", "break", "split"].includes(c.dataset.cmd)) e.preventDefault(); });
  }

  return {
    toast, modal, ask, ctxMenu, closeCtx, closeTopModal, saveFile,
    showLibrary, showDesk, setMode, renderStage, select, openScene,
    renderBinder, markBinderActive, updateLabels, updateCounts, renderInspector, renderInspectorSoon, refreshMentions,
    renderStatus, toggleFocus, toggleBinder, toggleInspector, syncPanelButtons, toggleTypewriter, palette, settingsDialog, exportDialog, snapshotActive, stepScene, renameInline, backupAll,
    renderLibrary, newProjectDialog, changedElsewhere, checkRemote, backupNudge, redrawAll, splitScene, refreshSnaps,
    bind() { bindBinder(); bindInspector(); bindLibrary(); bindChrome(); },
  };
})();
