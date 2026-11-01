/* ── main: settings, keys, boot ────────────────────────────────────────── */
function cacheSettings() { lsSet("settings", S.meta.settings); }
function applySettings(arg) {
  const st = { ...DEFAULT_SETTINGS, ...(arg || S.meta.settings || {}) };
  const r = document.documentElement;
  if (st.skin && st.skin !== "auto") r.dataset.skin = st.skin; else delete r.dataset.skin;
  const f = PROSE_FONTS.find(x => x[0] === st.font) || PROSE_FONTS[0];
  r.style.setProperty("--f-prose", f[2]);
  r.style.setProperty("--prose-size", st.size + "px");
  r.style.setProperty("--prose-lh", String(st.lh));
  r.style.setProperty("--measure", st.measure + "ch");
  Sky.set(!!st.ambience); Sky.retint();
  if (!arg) cacheSettings();
}

function bindKeys() {
  document.addEventListener("keydown", e => {
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (e.key === "Escape") {
      if (UI.closeCtx()) return;
      if (UI.closeTopModal()) return;
      if (S.focus) { UI.toggleFocus(false); return; }
      const d = $("#desk"); if (d.classList.contains("show-binder") || d.classList.contains("show-insp")) { d.classList.remove("show-binder", "show-insp"); return; }
      return;
    }
    if ($("#desk").hidden || !P()) { if (mod && k === "s") e.preventDefault(); return; }
    if ($("#modalRoot").childElementCount) return;
    if (mod && k === "k") { e.preventDefault(); UI.palette(); return; }
    if (mod && !e.shiftKey && k === "s") { e.preventDefault(); flushAll(); Store.drain(4000).then(ok => UI.toast(ok ? "Saved." : "Still saving. Your work is queued and will retry.", { err: !ok })); return; }
    if (mod && e.shiftKey && k === "s") { e.preventDefault(); UI.snapshotActive(); return; }
    if (mod && e.shiftKey && k === "f") { e.preventDefault(); UI.toggleFocus(); return; }
    if (mod && e.shiftKey && e.key === "Enter") { e.preventDefault(); Editor.exec("break"); return; }
    if (mod && e.altKey && k === "n") { e.preventDefault(); const n = addNode("scene", S.active || S.sel); UI.renderBinder(); UI.openScene(n.id); return; }
    if (mod && e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) { e.preventDefault(); UI.stepScene(e.key === "ArrowUp" ? -1 : 1); return; }
    if (e.altKey && !mod && /^Digit[1-6]$/.test(e.code)) { e.preventDefault(); UI.setMode(["write", "board", "outline", "threads", "codex", "progress"][+e.code.slice(5) - 1]); return; }
  });
  document.addEventListener("mousedown", e => { if (!e.target.closest("#ctx")) UI.closeCtx(); });
  window.addEventListener("blur", () => UI.closeCtx());
}

async function boot() {
  paintAstros();
  applySettings(lsGet("settings", DEFAULT_SETTINGS));
  Sky.init();
  Store.onStatus(s => {
    const el = $("#saveState"); if (!el) return;
    el.className = "save-state hud " + (s.state === "ok" ? "" : s.state);
    el.textContent = s.text; el.title = s.detail || (Store.kind() === "cloud" ? "Saved to your private archive" : Store.kind() === "local" ? "Saved in this browser" : "Not kept after this page closes");
  });
  const kind = await Store.init(msg => { $("#bootMsg").textContent = msg; });
  try { await loadMeta(); } catch (e) { console.warn("meta load failed", e); }
  applySettings();
  UI.bind(); Editor.bind($("#stage")); Views.bind($("#stage")); bindKeys();
  $("#boot").hidden = true; $("#app").hidden = false;
  if (kind === "memory") UI.toast("This browser is refusing storage. Download a backup before closing the page.", { err: true, ms: 10000 });
  const last = lsGet("last", null);
  if (last && S.meta.projects.some(p => p.id === last)) {
    try { await openProject(last); UI.showDesk(); return; } catch (e) { console.warn(e); }
  }
  UI.showLibrary();
}

window.addEventListener("beforeunload", e => {
  if (P()) flushAll();
  if (Store.busy() || (Store.kind() === "memory" && S.meta.projects.length)) { e.preventDefault(); e.returnValue = ""; }
});
document.addEventListener("visibilitychange", () => { if (document.hidden && P()) flushAll(); });
setInterval(() => { if (P() && !document.hidden) UI.renderStatus(); }, 60000);

boot().catch(e => {
  console.error(e);
  $("#bootMsg").textContent = "Astrolabe could not start: " + (e && e.message ? e.message : e);
});
