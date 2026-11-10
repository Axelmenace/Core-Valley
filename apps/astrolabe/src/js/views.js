/* ── views: board, outline, threads, codex, progress ───────────────────── */
const Views = (() => {
  const threadById = id => P().threads.find(t => t.id === id);
  const dots = n => `<span class="thread-dots">${(n.threads || []).map(threadById).filter(Boolean).map(t => `<i style="background:${esc(t.color)}" title="${esc(t.name)}"></i>`).join("")}</span>`;

  /* ═════ Board ═════ */
  function boardScope() {
    const s = S.sel && node(S.sel);
    if (!s) return null;
    if (s.type === "scene") return IX.parent[s.id] || null;
    return s.id;
  }
  function boardGroups(scope) {
    // A group is a chapter (or the scope itself) with its direct scenes.
    const groups = [];
    const visit = (id, partTitle) => {
      const n = id ? node(id) : null;
      const kids = childrenOf(id);
      const scenes = kids.filter(k => node(k) && node(k).type === "scene");
      if (!id || n.type !== "part" || scenes.length) groups.push({ id, title: n ? n.title : P().title, type: n ? n.type : "root", part: partTitle, scenes });
      kids.filter(k => node(k) && node(k).type !== "scene").forEach(k => visit(k, node(k).type === "part" ? node(k).title : partTitle));
    };
    visit(scope, scope && node(scope).type === "part" ? node(scope).title : null);
    return groups.filter(g => g.scenes.length || g.type !== "part");
  }
  function board(stage) {
    const scope = boardScope();
    const groups = boardGroups(scope);
    const sc = scope ? node(scope) : null;
    const title = sc ? sc.title : P().title;
    let html = `<div class="scroller"><div class="view-pad">
      <div class="view-head"><div><div class="hud">${sc ? esc(labelOf(sc.type)) + " " + esc(IX.coord[sc.id]) + " · board" : "Whole project · board"}</div><h2>${esc(title)}</h2></div>
      <div class="tools">${scope ? '<button class="btn small" type="button" data-act="board-up">Whole project</button>' : ""}
        <span class="muted">Drag cards to reorder or move between ${esc(labelOf("chapter").toLowerCase())}s. Double-click to write.</span></div></div>`;
    for (const g of groups) {
      const gid = g.id || "root";
      html += `<section class="board-group"><div class="board-group-head">
        ${g.id ? `<span class="coord">${esc(IX.coord[g.id])}</span>` : ""}<h3>${esc(g.title)}</h3>
        ${g.part && g.type !== "part" ? `<span class="hud part-tag">${esc(g.part)}</span>` : ""}
        <span class="hud">${fmtN(IX.total[g.id || "root"] || 0)} w</span></div>
        <div class="cards" data-group="${gid}">`;
      for (const id of g.scenes) {
        const n = node(id);
        html += `<article class="card ${S.sel === id ? "sel" : ""}" draggable="true" data-id="${id}">
          <div class="card-top"><span class="coord">${esc(IX.coord[id])}</span>${dots(n)}<span class="status-l"><span class="pip s-${n.status}"></span>${statusName(n.status)}</span></div>
          <input class="ct" id="ct-${id}" data-f="title" value="${esc(n.title)}" aria-label="Scene title" placeholder="Untitled scene">
          <textarea class="cs" id="cs-${id}" data-f="synopsis" rows="4" placeholder="What happens? Whose scene is it? What changes?" aria-label="Synopsis">${esc(n.synopsis)}</textarea>
          <div class="card-foot"><span class="pov">${n.pov ? "◈ " + esc(n.pov) : ""}${n.place ? (n.pov ? " · " : "") + "⬡ " + esc(n.place) : ""}</span><span class="wc">${fmtN(n.words)}${n.target ? "/" + fmtN(n.target) : ""}</span></div>
        </article>`;
      }
      html += `<button class="card add" type="button" data-act="card-add" data-group="${gid}">+ Scene card</button></div></section>`;
    }
    if (!groups.length) html += `<div class="empty"><h3>Nothing on the board</h3><p>Add a scene to start pinning cards.</p></div>`;
    stage.innerHTML = html + "</div></div>";
  }
  function bindBoard(stage) {
    let drag = null;
    stage.addEventListener("dragstart", e => {
      const c = e.target.closest && e.target.closest(".card[data-id]"); if (!c || S.mode !== "board") return;
      drag = c.dataset.id; c.classList.add("dragging"); e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", drag); } catch { /* some browsers */ }
    });
    stage.addEventListener("dragend", () => { drag = null; $$(".dragging,.drop-before,.drop-after,.drop-into", stage).forEach(x => x.classList.remove("dragging", "drop-before", "drop-after", "drop-into")); });
    stage.addEventListener("dragover", e => {
      if (!drag || S.mode !== "board") return;
      const c = e.target.closest(".card[data-id]"), g = e.target.closest(".cards");
      $$(".drop-before,.drop-after,.drop-into", stage).forEach(x => x.classList.remove("drop-before", "drop-after", "drop-into"));
      if (c && c.dataset.id !== drag) { e.preventDefault(); const r = c.getBoundingClientRect(); c.classList.add(e.clientX < r.left + r.width / 2 ? "drop-before" : "drop-after"); }
      else if (g) { e.preventDefault(); g.classList.add("drop-into"); }
    });
    stage.addEventListener("drop", e => {
      if (!drag || S.mode !== "board") return;
      e.preventDefault();
      const c = e.target.closest(".card[data-id]"), g = e.target.closest(".cards");
      let ok = false;
      if (c && c.dataset.id !== drag) ok = moveNode(drag, c.dataset.id, c.classList.contains("drop-before") ? "before" : "after");
      else if (g) ok = moveIntoEnd(drag, g.dataset.group === "root" ? null : g.dataset.group);
      drag = null;
      if (ok) { UI.renderBinder(); UI.renderStage(); }
    });
    stage.addEventListener("input", e => {
      if (S.mode !== "board") return;
      const c = e.target.closest(".card[data-id]"); if (!c || !e.target.dataset.f) return;
      const n = node(c.dataset.id); n[e.target.dataset.f] = e.target.value; touch();
      if (e.target.dataset.f === "title") UI.updateLabels(n.id);
      if (S.sel === n.id || S.active === n.id) UI.renderInspectorSoon();
    });
    stage.addEventListener("dblclick", e => {
      if (S.mode !== "board") return;
      const c = e.target.closest(".card[data-id]"); if (!c || e.target.matches("input,textarea")) return;
      UI.openScene(c.dataset.id);
    });
  }

  /* ═════ Outline ═════ */
  function outline(stage) {
    const p = P();
    const povs = (S.codex.entries || []).filter(e => e.cat === "character").map(e => e.name);
    const places = (S.codex.entries || []).filter(e => e.cat === "place").map(e => e.name);
    let rows = "";
    const walk = (ids) => ids.forEach(id => {
      const n = node(id); if (!n) return;
      if (n.type !== "scene") {
        rows += `<tr class="grp ${n.type}"><td colspan="7"><span class="coord">${esc(IX.coord[id])}</span> ${esc(n.title)} <span class="hud" style="margin-left:8px">${fmtN(IX.total[id])} w</span></td></tr>`;
        walk(n.children); return;
      }
      const pct = n.target ? Math.min(100, Math.round(100 * n.words / n.target)) : 0;
      rows += `<tr data-id="${id}">
        <td><button class="goto" type="button" data-act="open" data-id="${id}" title="Open in Write">${esc(IX.coord[id])}</button></td>
        <td><input id="ot-${id}" data-f="title" value="${esc(n.title)}" aria-label="Title"></td>
        <td><input id="op-${id}" data-f="pov" value="${esc(n.pov)}" list="dl-pov" aria-label="Point of view"></td>
        <td><input id="ol-${id}" data-f="place" value="${esc(n.place)}" list="dl-place" aria-label="Location"></td>
        <td><select id="os-${id}" data-f="status" aria-label="Status">${STATUSES.map(([k, l]) => `<option value="${k}" ${n.status === k ? "selected" : ""}>${l}</option>`).join("")}</select></td>
        <td class="wcell">${fmtFull(n.words)} / <input id="og-${id}" data-f="target" type="number" min="0" step="250" value="${n.target || ""}" style="width:70px" aria-label="Target words">${n.target ? `<div class="meter"><i style="width:${pct}%"></i></div>` : ""}</td>
        <td><textarea id="oy-${id}" data-f="synopsis" rows="1" aria-label="Synopsis">${esc(n.synopsis)}</textarea></td></tr>`;
    });
    walk(p.root);
    stage.innerHTML = `<div class="scroller"><div class="view-pad">
      <div class="view-head"><div><div class="hud">${IX.order.length} scenes · ${fmtFull(projectWords())} words</div><h2>Outline</h2></div>
      <div class="tools"><button class="btn small" type="button" data-act="export-outline">Export outline</button></div></div>
      <datalist id="dl-pov">${povs.map(v => `<option value="${esc(v)}">`).join("")}</datalist>
      <datalist id="dl-place">${places.map(v => `<option value="${esc(v)}">`).join("")}</datalist>
      <div class="table-wrap"><table class="outline"><thead><tr><th style="width:64px">Coord</th><th style="width:20%">Scene</th><th style="width:13%">POV</th><th style="width:13%">Location</th><th style="width:110px">Status</th><th style="width:150px">Words / target</th><th>Synopsis</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="7" class="muted" style="padding:20px">No scenes yet.</td></tr>'}</tbody></table></div></div></div>`;
  }
  function bindOutline(stage) {
    const apply = e => {
      if (S.mode !== "outline") return;
      const tr = e.target.closest("tr[data-id]"); if (!tr || !e.target.dataset.f) return;
      const n = node(tr.dataset.id), f = e.target.dataset.f;
      n[f] = f === "target" ? Math.max(0, parseInt(e.target.value, 10) || 0) : e.target.value;
      touch();
      if (f === "title") UI.updateLabels(n.id);
      if (f === "status") UI.renderBinder();
      if (S.sel === n.id) UI.renderInspectorSoon();
    };
    stage.addEventListener("input", e => { if (e.target.tagName !== "SELECT") apply(e); });
    stage.addEventListener("change", e => { if (e.target.tagName === "SELECT" || e.target.type === "number") { apply(e); if (e.target.type === "number") UI.renderStage(); } });
  }

  /* ═════ Threads ═════ */
  function threadStats(t) {
    const order = IX.order; const hits = order.map(id => (node(id).threads || []).includes(t.id));
    const count = hits.filter(Boolean).length;
    let gap = 0, gs = -1, ge = -1, first = hits.indexOf(true), last = hits.lastIndexOf(true);
    if (first >= 0) { let run = 0, start = 0; for (let i = first; i <= last; i++) { if (!hits[i]) { if (!run) start = i; run++; if (run > gap) { gap = run; gs = start; ge = i; } } else run = 0; } }
    return { count, first, last, gap, gs, ge };
  }
  function threads(stage) {
    const p = P();
    const list = p.threads.map(t => {
      const s = threadStats(t);
      const span = s.count ? `${s.count} scene${s.count === 1 ? "" : "s"}, from ${IX.coord[IX.order[s.first]]} to ${IX.coord[IX.order[s.last]]}` : "Not in any scene yet";
      const gap = s.gap >= 4 ? ` · <span class="gap">absent for ${s.gap} scenes (${IX.coord[IX.order[s.gs]]}–${IX.coord[IX.order[s.ge]]})</span>` : "";
      return `<div class="thread-row" data-tid="${t.id}"><input type="color" id="tc-${t.id}" value="${esc(t.color)}" data-tf="color" aria-label="Thread colour">
        <input class="inp" id="tn-${t.id}" value="${esc(t.name)}" data-tf="name" aria-label="Thread name">
        <span class="stat">${span}${gap}</span>
        <button class="btn small ghost danger" type="button" data-act="thread-del" data-tid="${t.id}">Remove</button></div>`;
    }).join("");
    let head1 = "", head2 = "", body = "";
    const cols = IX.order;
    const chStart = new Set(); let lastCh = null;
    const chSpans = [];
    cols.forEach(id => { const ch = chapterOf(id); if (ch !== lastCh) { chStart.add(id); chSpans.push([ch, 1]); lastCh = ch; } else chSpans[chSpans.length - 1][1]++; });
    head1 = `<th class="tname"></th>` + chSpans.map(([ch, n]) => `<th class="ch" colspan="${n}" title="${ch ? esc(node(ch).title) : ""}">${ch ? esc(IX.coord[ch]) + " " + esc(node(ch).title) : "—"}</th>`).join("");
    head2 = `<th class="tname">Thread</th>` + cols.map(id => `<th class="sc" data-act="open" data-id="${id}" title="${esc(node(id).title)}">${esc(IX.coord[id])}</th>`).join("");
    for (const t of p.threads) {
      const st = threadStats(t);
      body += `<tr style="--tc:${esc(t.color)}"><th class="tname">${esc(t.name)}</th>` + cols.map((id, i) => {
        const on = (node(id).threads || []).includes(t.id);
        const lane = !on && st.count && i > st.first && i < st.last;
        return `<td class="cell ${chStart.has(id) ? "chstart" : ""} ${lane ? "lane" : ""}"><button type="button" class="${on ? "on" : ""}" data-act="cell" data-id="${id}" data-tid="${t.id}" aria-pressed="${on}" aria-label="${esc(t.name)} in ${esc(IX.coord[id])}"></button></td>`;
      }).join("") + "</tr>";
    }
    stage.innerHTML = `<div class="scroller"><div class="view-pad">
      <div class="view-head"><div><div class="hud">Plotlines, subplots, character arcs, mysteries</div><h2>Threads</h2></div>
      <div class="tools"><input class="inp" id="newThread" placeholder="New thread name" style="width:220px" aria-label="New thread name"><button class="btn small gild" type="button" data-act="thread-add">Add thread</button></div></div>
      <div class="threads-list">${list || '<p class="muted">Threads track what runs through your story: a subplot, a romance, a mystery clue, a character arc. Add one, then mark the scenes it touches.</p>'}</div>
      ${p.threads.length && cols.length ? `<div class="matrix-wrap"><table class="matrix"><thead><tr>${head1}</tr><tr>${head2}</tr></thead><tbody>${body}</tbody></table></div>
      <p class="muted" style="margin-top:10px">A faint line marks scenes between a thread's first and last appearance where it goes quiet. Long silences are flagged above.</p>` : ""}
    </div></div>`;
  }
  function bindThreads(stage) {
    stage.addEventListener("input", e => {
      if (S.mode !== "threads") return;
      const row = e.target.closest("[data-tid]"); if (!row || !e.target.dataset.tf) return;
      const t = threadById(row.dataset.tid); t[e.target.dataset.tf] = e.target.value; touch();
    });
    stage.addEventListener("change", e => { if (S.mode === "threads" && e.target.dataset.tf) UI.renderStage(); });
    stage.addEventListener("keydown", e => { if (S.mode === "threads" && e.target.id === "newThread" && e.key === "Enter") { e.preventDefault(); act("thread-add"); } });
  }

  /* ═════ Codex ═════ */
  function entries() { return S.codex.entries || (S.codex.entries = []); }
  const entryById = id => entries().find(e => e.id === id);
  function namesOf(e) { return [e.name, ...String(e.aliases || "").split(",")].map(s => s.trim()).filter(s => s.length > 1); }
  function mentionRe(e) {
    const names = namesOf(e); if (!names.length) return null;
    const re = (list, flags) => list.length ? new RegExp("(^|[^\\p{L}\\p{N}])(" + list.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")(?=$|[^\\p{L}\\p{N}])", flags) : null;
    const proper = s => /^\p{Lu}/u.test(s);
    const exact = re(names.filter(proper), "u"), loose = re(names.filter(s => !proper(s)), "iu");
    return { test: t => !!((exact && exact.test(t)) || (loose && loose.test(t))) };
  }
  function mentionsIn(text) {
    return entries().filter(e => { const re = mentionRe(e); return re && re.test(text); });
  }
  function appearances(e) {
    const re = mentionRe(e); if (!re) return [];
    return IX.order.filter(id => { const n = node(id); return re.test(htmlToText(S.texts.get(id) || "")) || re.test(n.pov || "") || re.test(n.place || "") || re.test(n.synopsis || ""); });
  }
  async function codex(stage) {
    const list = entries().filter(e => (S.codexCat === "all" || e.cat === S.codexCat) &&
      (!S.codexQ || (e.name + " " + e.aliases + " " + e.summary).toLowerCase().includes(S.codexQ.toLowerCase())))
      .sort((a, b) => a.name.localeCompare(b.name));
    if (S.codexSel && !entryById(S.codexSel)) S.codexSel = null;
    const e = S.codexSel ? entryById(S.codexSel) : null;
    const cats = [["all", "All", "✦"], ...CODEX_CATS];
    const side = `<div class="codex-side">
      <div style="display:flex;gap:8px"><input class="inp" id="codexQ" placeholder="Search the codex" value="${esc(S.codexQ)}" aria-label="Search the codex"><button class="btn gild small" type="button" data-act="codex-new">+ Entry</button></div>
      <div class="codex-cats">${cats.map(([k, l]) => { const c = k === "all" ? entries().length : entries().filter(x => x.cat === k).length; return `<button class="chip ${S.codexCat === k ? "on" : ""}" type="button" data-act="codex-cat" data-cat="${k}">${esc(l)} ${c ? "· " + c : ""}</button>`; }).join("")}</div>
      <div class="codex-list">${list.map(x => `<button class="codex-item ${x.id === S.codexSel ? "sel" : ""}" type="button" data-act="codex-open" data-eid="${x.id}"><span class="g">${catGlyph(x.cat)}</span><span><b>${esc(x.name || "Unnamed")}</b><small>${esc(x.summary || catName(x.cat))}</small></span></button>`).join("") || '<p class="muted">No entries here yet.</p>'}</div></div>`;
    let main;
    if (!e) {
      main = `<div class="codex-entry"><div class="empty" style="margin:30px auto"><div class="astro-s" data-astro="small"></div><h3>The story bible</h3>
        <p>Characters, places, factions, magic and machines, creatures, events and loose notes. Names and aliases you record here are spotted automatically in your scenes and shown in the inspector.</p>
        <button class="btn gild" type="button" data-act="codex-new">+ New entry</button></div></div>`;
    } else {
      const p = P();
      try { await loadAllTexts(); } catch (err) { console.warn("some scene text not loaded", err); }
      if (S.mode !== "codex" || P() !== p) return; // another view took the stage meanwhile
      const app = appearances(e);
      main = `<div class="codex-entry" data-eid="${e.id}">
        <div style="display:flex;gap:10px;align-items:center"><span class="hud" style="color:var(--gild)">${catGlyph(e.cat)} ${esc(catName(e.cat))}</span><span style="flex:1"></span>
          <button class="btn small ghost danger" type="button" data-act="codex-del" data-eid="${e.id}">Delete entry</button></div>
        <input class="name" id="cx-name" data-cf="name" value="${esc(e.name)}" placeholder="Name" aria-label="Name">
        <div class="row2"><label class="field"><span>Category</span><select id="cx-cat" data-cf="cat">${CODEX_CATS.map(([k, l]) => `<option value="${k}" ${e.cat === k ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          <label class="field"><span>Aliases, comma separated</span><input id="cx-al" data-cf="aliases" value="${esc(e.aliases)}" placeholder="nicknames, titles, short forms"></label></div>
        <label class="field"><span>Summary</span><input id="cx-sum" data-cf="summary" value="${esc(e.summary)}" placeholder="One line you'd want on an index card"></label>
        <div class="field"><span>Details</span><div class="kv" id="kv">${(e.fields || []).map(([k, v], i) => `<div class="kv-row"><input class="inp" id="kk-${i}" data-kv="${i}" data-kp="0" value="${esc(k)}" placeholder="Field"><input class="inp" id="kvv-${i}" data-kv="${i}" data-kp="1" value="${esc(v)}" placeholder="Value"><button class="iconbtn" type="button" data-act="kv-del" data-i="${i}" aria-label="Remove field">×</button></div>`).join("")}
          <div><button class="btn small ghost" type="button" data-act="kv-add">+ Field</button></div></div></div>
        <label class="field"><span>Notes</span><textarea id="cx-body" data-cf="body" rows="9" placeholder="History, appearance, rules, contradictions to resolve…">${esc(e.body)}</textarea></label>
        <div class="field"><span>Appears in ${app.length} scene${app.length === 1 ? "" : "s"}</span><div class="appears">${app.map(id => `<button type="button" data-act="open" data-id="${id}"><span class="coord">${esc(IX.coord[id])}</span>${esc(node(id).title)}</button>`).join("") || '<span class="muted">No mentions found in the manuscript yet.</span>'}</div></div>
      </div>`;
    }
    stage.innerHTML = `<div class="scroller"><div class="view-pad"><div class="view-head"><div><div class="hud">${entries().length} entries</div><h2>Codex</h2></div></div><div class="codex">${side}${main}</div></div></div>`;
    paintAstros(stage);
  }
  function bindCodex(stage) {
    stage.addEventListener("input", e => {
      if (S.mode !== "codex") return;
      if (e.target.id === "codexQ") { S.codexQ = e.target.value; const pos = e.target.selectionStart; codex(stage).then(() => { const q = $("#codexQ"); if (q) { q.focus(); q.setSelectionRange(pos, pos); } }); return; }
      const ent = S.codexSel && entryById(S.codexSel); if (!ent) return;
      if (e.target.dataset.cf) { ent[e.target.dataset.cf] = e.target.value; saveCodexSoon(); if (e.target.dataset.cf === "name") { const b = $(`.codex-item[data-eid="${ent.id}"] b`); if (b) b.textContent = ent.name || "Unnamed"; } }
      if (e.target.dataset.kv !== undefined) { ent.fields[+e.target.dataset.kv][+e.target.dataset.kp] = e.target.value; saveCodexSoon(); }
    });
    stage.addEventListener("change", e => { if (S.mode === "codex" && e.target.dataset.cf === "cat") codex(stage); });
  }

  /* ═════ Progress ═════ */
  function streak(h) {
    let d = new Date(), n = 0;
    if (!workedOn(dayKey(d))) d.setDate(d.getDate() - 1);
    while (workedOn(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function progress(stage) {
    const p = P(), total = projectWords(), goal = p.goal.words || 0, h = p.history, today = h[dayKey()] || 0;
    const pct = goal ? Math.min(1, total / goal) : 0, R = 46, C = 2 * Math.PI * R;
    const days = []; for (let i = 29; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(dayKey(d)); }
    const vals = days.map(d => h[d] || 0);
    const max = Math.max(p.goal.daily || 0, ...vals, 100), min = Math.min(0, ...vals);
    const W = 600, H = 170, padL = 34, padB = 22, padT = 8, cw = (W - padL - 6) / days.length;
    const y = v => padT + (H - padT - padB) * (1 - (v - min) / (max - min));
    const niceStep = (() => { const raw = (max - min) / 3; const m = Math.pow(10, Math.floor(Math.log10(raw))); return [1, 2, 2.5, 5, 10].map(f => f * m).find(s => s >= raw) || raw; })();
    let grid = ""; for (let v = Math.ceil(min / niceStep) * niceStep; v <= max; v += niceStep) grid += `<line class="grid" x1="${padL}" x2="${W - 4}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}"/><text x="${padL - 6}" y="${(y(v) + 3).toFixed(1)}" text-anchor="end">${fmtN(v)}</text>`;
    const bars = vals.map((v, i) => { const x = padL + i * cw + 2, top = y(Math.max(v, 0)), bot = y(Math.min(v, 0)); return `<rect class="bar ${i === 29 ? "today" : ""} ${v < 0 ? "neg" : ""}" x="${x.toFixed(1)}" width="${Math.max(1, cw - 4).toFixed(1)}" y="${top.toFixed(1)}" height="${Math.max(v ? 1 : 0, bot - top).toFixed(1)}" rx="1.5"><title>${days[i]}: ${fmtFull(v)} words</title></rect>`; }).join("");
    const labels = [0, 7, 14, 21, 29].map(i => `<text x="${(padL + i * cw + cw / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle">${i === 29 ? "today" : parseDay(days[i]).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</text>`).join("");
    const goalLine = p.goal.daily ? `<line class="goal-line" x1="${padL}" x2="${W - 4}" y1="${y(p.goal.daily).toFixed(1)}" y2="${y(p.goal.daily).toFixed(1)}"/>` : "";
    const last30 = vals.reduce((a, b) => a + b, 0), activeDays = days.filter(workedOn).length;
    let pace = "";
    if (p.goal.deadline && goal) {
      const left = daysBetween(dayKey(), p.goal.deadline), remain = Math.max(0, goal - total);
      pace = left > 0 ? `<b>${fmtFull(Math.ceil(remain / left))}</b><span>words a day to reach ${fmtN(goal)} by ${parseDay(p.goal.deadline).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} (${left} days)</span>`
        : left === 0 ? `<b>Today</b><span>is the deadline. ${remain ? fmtFull(remain) + " words to go." : "Goal reached."}</span>` : `<b>${-left} days</b><span>past the deadline.</span>`;
    }
    // per chapter
    const chs = IX.chapters.length ? IX.chapters : [];
    const cmax = Math.max(1, ...chs.map(c => Math.max(IX.total[c] || 0, targetOf(c))));
    const chBars = chs.map(c => { const t = targetOf(c), w = IX.total[c] || 0; return `<div class="hbar"><span class="n"><span class="coord">${esc(IX.coord[c])}</span>${esc(node(c).title)}</span><span class="track">${t ? `<i style="width:${(100 * t / cmax).toFixed(1)}%;background:var(--line)"></i>` : ""}<i style="width:${(100 * w / cmax).toFixed(1)}%"></i></span><span class="v">${fmtN(w)}${t ? " / " + fmtN(t) : ""}</span></div>`; }).join("");
    // statuses
    const counts = Object.fromEntries(STATUSES.map(([k]) => [k, 0])); IX.order.forEach(id => counts[node(id).status || "seed"]++);
    const nsc = IX.order.length || 1;
    const stack = STATUSES.map(([k]) => `<i style="width:${(100 * counts[k] / nsc).toFixed(2)}%;background:var(--s-${k})" title="${statusName(k)}: ${counts[k]}"></i>`).join("");
    const legend = STATUSES.map(([k, l]) => `<span><span class="pip s-${k}"></span>${l} ${counts[k]}</span>`).join("");
    // serial schedule
    let sched = "";
    if (p.form === "serial" && chs.length) {
      const next = chs.map(node).filter(e => e.release && !e.published).sort((a, b) => a.release.localeCompare(b.release))[0];
      sched = `<div class="panel w12"><h3>Release schedule</h3>
        ${next ? `<p style="margin:0">Next release: <b>${esc(IX.coord[next.id])} ${esc(next.title)}</b> on ${parseDay(next.release).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })} · ${daysBetween(dayKey(), next.release)} days · ${fmtFull(IX.total[next.id])} of ${fmtFull(targetOf(next.id))} words written</p>` : '<p class="muted" style="margin:0">Set release dates to see what is due next.</p>'}
        <div>${chs.map(c => { const e = node(c); return `<div class="ep-row" data-id="${c}"><span class="coord">${esc(IX.coord[c])}</span><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.title)}</span><input class="inp hide-s" type="date" id="rel-${c}" data-ef="release" value="${esc(e.release || "")}" aria-label="Release date"><span class="hud hide-s">${fmtN(IX.total[c])} / ${fmtN(targetOf(c))}</span><label class="check"><input type="checkbox" id="pub-${c}" data-ef="published" ${e.published ? "checked" : ""}> Out</label></div>`; }).join("")}</div></div>`;
    }
    const sprints = (p.sprints || []).slice(-5).reverse();
    stage.innerHTML = `<div class="scroller"><div class="view-pad">
      <div class="view-head"><div><div class="hud">${esc(FORMS[p.form].name)} · started ${new Date(p.created).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</div><h2>Progress</h2></div></div>
      <div class="prog-grid">
        <div class="panel w6"><h3>Manuscript</h3><div class="goal-flex">
          <svg class="goal-ring" viewBox="0 0 110 110" role="img" aria-label="${Math.round(pct * 100)} percent of goal"><circle class="bg" cx="55" cy="55" r="${R}"/>${pct > 0 ? `<circle class="fg" cx="55" cy="55" r="${R}" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}"/>` : ""}<text x="55" y="60">${Math.round(pct * 100)}%</text></svg>
          <div style="display:grid;gap:6px;min-width:0"><div class="bignum">${fmtFull(total)}<small>of ${fmtFull(goal)} words</small></div>
          <div class="muted">${IX.order.length} scenes · ${IX.chapters.length} ${esc(labelOf("chapter").toLowerCase())}s${goal > total ? " · " + fmtFull(goal - total) + " to go" : goal ? " · goal reached" : ""}</div></div></div>
          <div class="row2"><label class="field"><span>Target words</span><input type="number" id="g-words" min="0" step="1000" data-gf="words" value="${goal || ""}"></label>
          <label class="field"><span>Deadline</span><input type="date" id="g-dead" data-gf="deadline" value="${esc(p.goal.deadline || "")}"></label></div></div>
        <div class="panel w6"><h3>Today</h3><div class="bignum">${fmtFull(today)}<small>of ${fmtFull(p.goal.daily)} daily</small></div>
          <div class="meter" style="height:6px"><i style="width:${p.goal.daily ? Math.min(100, Math.max(0, 100 * today / p.goal.daily)).toFixed(1) : 0}%;background:var(--ion)"></i></div>
          <div class="kpis"><div class="kpi"><b>${streak(h)}</b><span>day streak</span></div><div class="kpi"><b>${fmtFull(last30)}</b><span>words in 30 days</span></div><div class="kpi"><b>${activeDays ? fmtFull(Math.round(last30 / activeDays)) : "0"}</b><span>per writing day</span></div></div>
          ${pace ? `<div class="kpi">${pace}</div>` : ""}
          <label class="field"><span>Daily goal</span><input type="number" id="g-daily" min="0" step="100" data-gf="daily" value="${p.goal.daily || ""}"></label></div>
        <div class="panel w8"><h3>Last 30 days</h3><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Words written per day for 30 days">${grid}${goalLine}${bars}${labels}</svg>
          <div class="legend"><span><i style="width:10px;height:10px;background:var(--gild);display:inline-block;border-radius:2px"></i>Words written</span>${p.goal.daily ? '<span><i style="width:14px;border-top:1px dashed var(--ion);display:inline-block"></i>Daily goal</span>' : ""}</div></div>
        <div class="panel"><h3>Scene status</h3><div class="stack">${stack}</div><div class="legend">${legend}</div>
          <h3 style="margin-top:6px">Recent sprints</h3>${sprints.length ? sprints.map(s => `<div class="stat-line"><span>${stamp(s.t)} · ${s.min} min</span><b>${fmtFull(s.words)} w</b></div>`).join("") : '<p class="muted" style="margin:0">Start a sprint from the status bar to log a timed burst of writing.</p>'}</div>
        ${chBars ? `<div class="panel w12"><h3>By ${esc(labelOf("chapter").toLowerCase())}</h3><div style="display:grid;gap:8px">${chBars}</div></div>` : ""}
        ${sched}
      </div></div></div>`;
  }
  function bindProgress(stage) {
    stage.addEventListener("change", e => {
      if (S.mode !== "progress") return;
      const p = P();
      if (e.target.dataset.gf) { const f = e.target.dataset.gf; p.goal[f] = f === "deadline" ? e.target.value : Math.max(0, parseInt(e.target.value, 10) || 0); touch(); UI.renderStage(); UI.renderStatus(); }
      if (e.target.dataset.ef) { const row = e.target.closest("[data-id]"); const n = node(row.dataset.id); n[e.target.dataset.ef] = e.target.type === "checkbox" ? e.target.checked : e.target.value; touch(); UI.renderStage(); }
    });
  }

  /* ═════ Shared actions inside views ═════ */
  function act(a, el) {
    const p = P();
    switch (a) {
      case "board-up": S.sel = null; UI.renderBinder(); UI.renderStage(); UI.renderInspector(); break;
      case "card-add": {
        const g = el.dataset.group === "root" ? null : el.dataset.group;
        const n = mkNode(p, "scene", "Untitled scene"); insertAt(n.id, g, -1); touch(); UI.renderBinder(); UI.renderStage();
        const inp = $(`#ct-${n.id}`); inp && (inp.focus(), inp.select()); break;
      }
      case "open": UI.openScene(el.dataset.id); break;
      case "thread-add": {
        const inp = $("#newThread"); const name = (inp && inp.value.trim()) || "New thread";
        p.threads.push({ id: uid(), name, color: THREAD_COLORS[p.threads.length % THREAD_COLORS.length] }); touch(); UI.renderStage();
        const ni = $("#newThread"); ni && ni.focus(); break;
      }
      case "thread-del": {
        const t = threadById(el.dataset.tid);
        UI.ask("Remove thread?", `“${esc(t.name)}” will be removed from every scene. The scenes themselves stay as they are.`, [["Cancel"], ["Remove", "danger"]]).then(r => {
          if (r !== 1) return; p.threads = p.threads.filter(x => x.id !== t.id); Object.values(p.nodes).forEach(n => n.threads = (n.threads || []).filter(x => x !== t.id)); touch(); UI.renderStage();
        }); break;
      }
      case "cell": {
        const n = node(el.dataset.id), tid = el.dataset.tid; const i = n.threads.indexOf(tid);
        if (i >= 0) n.threads.splice(i, 1); else n.threads.push(tid);
        touch(); UI.renderStage(); break;
      }
      case "codex-new": {
        const e = { id: uid(), cat: S.codexCat !== "all" ? S.codexCat : "character", name: "", aliases: "", summary: "", fields: [], body: "" };
        entries().push(e); S.codexSel = e.id; saveCodexSoon();
        if (S.mode !== "codex") UI.setMode("codex"); else codex($("#stage")).then(() => $("#cx-name") && $("#cx-name").focus()); break;
      }
      case "codex-cat": S.codexCat = el.dataset.cat; codex($("#stage")); break;
      case "codex-open": S.codexSel = el.dataset.eid; codex($("#stage")); break;
      case "codex-del": {
        const e = entryById(el.dataset.eid);
        UI.ask("Delete codex entry?", `“${esc(e.name || "Unnamed")}” and its notes will be deleted. This cannot be undone.`, [["Cancel"], ["Delete", "danger"]]).then(r => {
          if (r !== 1) return; S.codex.entries = entries().filter(x => x.id !== e.id); S.codexSel = null; saveCodexSoon(); codex($("#stage"));
        }); break;
      }
      case "kv-add": { const e = entryById(S.codexSel); e.fields = e.fields || []; e.fields.push(["", ""]); saveCodexSoon(); codex($("#stage")).then(() => { const k = $(`#kk-${e.fields.length - 1}`); k && k.focus(); }); break; }
      case "kv-del": { const e = entryById(S.codexSel); e.fields.splice(+el.dataset.i, 1); saveCodexSoon(); codex($("#stage")); break; }
      case "export-outline": UI.exportDialog("outline"); break;
      default: return false;
    }
    return true;
  }

  return { board, outline, threads, codex, progress, act, mentionsIn, entryById, bind(stage) { bindBoard(stage); bindOutline(stage); bindThreads(stage); bindCodex(stage); bindProgress(stage); } };
})();
