/* ── find: search the whole manuscript, and replace across it ─────────────── */
const Find = (() => {
  const META = ["title", "synopsis", "notes", "pov", "place", "when"];
  let last = { q: "", to: "", cs: false, word: false, meta: false };

  /* A typed straight quote finds the curly ones too, since that is what the page holds. */
  function pattern(q, o) {
    let src = [...q].map(ch => ch === "'" ? "['’‘]" : ch === '"' ? '["“”]' : ch === " " ? "[ \\u00a0]" : ch.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")).join("");
    if (o.word) src = "(?<![\\p{L}\\p{N}])" + src + "(?![\\p{L}\\p{N}])";
    return new RegExp(src, "gu" + (o.cs ? "" : "i"));
  }
  /* Matches are looked for inside each run of text; one that straddles the edge of bold or italic is not found. */
  function textNodes(html) {
    const t = document.createElement("template"); t.innerHTML = html || "";
    const w = document.createTreeWalker(t.content, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    return { t, nodes };
  }
  function scan(html, re) {
    const hits = [];
    for (const n of textNodes(html).nodes) {
      const s = n.nodeValue; re.lastIndex = 0; let m;
      while ((m = re.exec(s))) {
        if (!m[0]) { re.lastIndex++; continue; }
        hits.push({ pre: s.slice(Math.max(0, m.index - 40), m.index), hit: m[0], post: s.slice(m.index + m[0].length, m.index + m[0].length + 50) });
      }
    }
    return hits;
  }
  function replaceIn(html, re, to) {
    const { t, nodes } = textNodes(html); let n = 0;
    for (const node of nodes) node.nodeValue = node.nodeValue.replace(re, () => { n++; return to; });
    return { n, html: n ? sanitizeProse(t.innerHTML) : html };
  }
  const count = (s, re) => (String(s || "").match(re) || []).length;
  function metaHits(re) {
    let n = 0; const ids = [];
    for (const id of Object.keys(IX.coord)) { const nd = node(id); let k = 0; for (const f of META) k += count(nd[f], re); if (k) { n += k; ids.push(id); } }
    return { n, ids };
  }

  function open() {
    if (!P()) return;
    Editor.flush();
    const m = UI.modal(`<button class="iconbtn x" type="button" data-x aria-label="Close">×</button><h2>Find and replace</h2>
      <div class="row2"><label class="field"><span>Find</span><input id="fr-q" autofocus autocomplete="off" value="${esc(last.q)}"></label>
        <label class="field"><span>Replace with</span><input id="fr-to" autocomplete="off" value="${esc(last.to)}"></label></div>
      <div class="find-opts"><label class="check"><input type="checkbox" id="fr-cs" ${last.cs ? "checked" : ""}> Match case</label>
        <label class="check"><input type="checkbox" id="fr-word" ${last.word ? "checked" : ""}> Whole words</label>
        <label class="check"><input type="checkbox" id="fr-meta" ${last.meta ? "checked" : ""}> Also titles, synopses and notes</label></div>
      <p class="muted" id="fr-sum" style="margin:0" aria-live="polite">Reading the manuscript…</p>
      <div class="find-list" id="fr-list"></div>
      <div class="modal-foot"><button class="btn" type="button" data-x>Close</button><button class="btn gild" type="button" data-all disabled>Replace all</button></div>`, { wide: true });
    const $q = $("#fr-q"), $to = $("#fr-to"), $sum = $("#fr-sum"), $list = $("#fr-list"), $all = $("[data-all]", m.el);
    let ready = false, found = { scenes: [], meta: { n: 0, ids: [] }, total: 0 };
    const opts = () => ({ cs: $("#fr-cs").checked, word: $("#fr-word").checked, meta: $("#fr-meta").checked });
    const run = () => {
      if (!ready) return;
      const q = $q.value, o = opts(); last = { q, to: $to.value, ...o };
      found = { scenes: [], meta: { n: 0, ids: [] }, total: 0 };
      if (!q) { $sum.textContent = "Type what to look for. The search covers every scene in the binder."; $list.innerHTML = ""; $all.disabled = true; return; }
      const re = pattern(q, o);
      for (const id of IX.order) { const hits = scan(S.texts.get(id) || "", re); if (hits.length) { found.scenes.push({ id, hits }); found.total += hits.length; } }
      if (o.meta) { found.meta = metaHits(re); found.total += found.meta.n; }
      const inText = found.total - found.meta.n;
      $sum.textContent = found.total ? `${fmtFull(inText)} in the text of ${found.scenes.length} scene${found.scenes.length === 1 ? "" : "s"}${o.meta ? `, ${fmtFull(found.meta.n)} in titles, synopses and notes` : ""}.` : "Nothing found.";
      $all.disabled = !found.total;
      $list.innerHTML = found.scenes.slice(0, 60).map(s => `<button type="button" class="find-scene" data-id="${s.id}"><span class="head"><span class="coord">${esc(IX.coord[s.id])}</span><b>${esc(node(s.id).title || "Untitled scene")}</b><span class="hud">${s.hits.length}</span></span>
        ${s.hits.slice(0, 3).map(h => `<span class="snip">${h.pre.length === 40 ? "…" : ""}${esc(h.pre)}<mark>${esc(h.hit)}</mark>${esc(h.post)}${h.post.length === 50 ? "…" : ""}</span>`).join("")}</button>`).join("")
        + (found.scenes.length > 60 ? `<p class="muted" style="margin:6px 2px">and ${found.scenes.length - 60} more scenes.</p>` : "");
    };
    const runSoon = debounce(run, 180);
    m.el.addEventListener("input", e => { if (e.target === $to) { last.to = $to.value; return; } runSoon(); });
    m.el.addEventListener("keydown", e => { if (e.key === "Enter" && e.target === $q) { e.preventDefault(); runSoon.flush(); const f = $(".find-scene", m.el); f && f.focus(); } });
    m.el.addEventListener("click", async e => {
      if (e.target.closest("[data-x]")) { m.close(); return; }
      const sc = e.target.closest(".find-scene");
      if (sc) {
        const q = $q.value, cs = opts().cs; m.close(); UI.openScene(sc.dataset.id);
        setTimeout(() => { try { getSelection().removeAllRanges(); window.find && window.find(q, cs, false, true); } catch { /* the scene is open either way */ } }, 350);
        return;
      }
      if (e.target.closest("[data-all]") && found.total) {
        const q = $q.value, to = $to.value, o = opts(), n = found.total;
        const r = await UI.ask(`Replace ${fmtFull(n)} match${n === 1 ? "" : "es"}?`, `Every “${esc(q)}” found becomes “${esc(to)}”${to ? "" : " (that is, it is removed)"}. A snapshot of each changed scene is taken first, so any of them can be put back from its Snapshots list.`, [["Cancel"], ["Replace all", "gild"]]);
        if (r !== 1 || !P()) return;
        const re = pattern(q, o); let done = 0, scenes = 0;
        $sum.textContent = "Replacing…"; $all.disabled = true;
        for (const s of found.scenes) {
          const out = replaceIn(S.texts.get(s.id) || "", re, to); if (!out.n) continue;
          await takeSnapshot(s.id, "Before replace", true);
          putText(s.id, out.html); setSceneWords(s.id, wordsOfHtml(out.html), false);
          done += out.n; scenes++;
        }
        if (o.meta) for (const id of found.meta.ids) { const nd = node(id); for (const f of META) if (nd[f]) nd[f] = String(nd[f]).replace(re, () => { done++; return to; }); }
        touch(); UI.redrawAll();
        UI.toast(`Replaced ${fmtFull(done)} match${done === 1 ? "" : "es"}${scenes ? ` across ${scenes} scene${scenes === 1 ? "" : "s"}` : ""}.`, { ms: 6000 });
        run();
      }
    });
    loadAllTexts().then(() => { ready = true; run(); }, err => { console.warn("manuscript not read", err); $sum.textContent = "The manuscript could not be read: " + ((err && err.message) || "storage did not answer") + "."; });
  }
  return { open, pattern, scan, replaceIn };
})();
