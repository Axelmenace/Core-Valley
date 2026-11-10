/* ── editor: the manuscript page ───────────────────────────────────────────
   One contenteditable per scene. Selecting a chapter or part stacks its scenes
   into one continuous page; each scene still saves to its own record. */
const Editor = (() => {
  const dirty = new Set(), touched = new Map(); // touched: scene → the day it was last edited in this page
  let renderSeq = 0, fixing = false;
  const saveSoon = debounce(saveDirty, 900);
  let curPara = null;

  function saveDirty() {
    for (const id of dirty) {
      const el = proseEl(id); if (!el || !node(id)) continue;
      putText(id, sanitizeProse(el.innerHTML));
    }
    const any = dirty.size > 0;
    dirty.clear();
    if (any) UI.refreshMentions(); // the codex names in the inspector follow the text as it is saved
  }
  const proseEl = id => $(`.prose[data-id="${CSS.escape(id)}"]`);
  const recount = throttle(el => {
    if (!el.isConnected) return;
    const id = el.dataset.id;
    const delta = setSceneWords(id, countWords(el.innerText));
    if (delta && S.sprint) S.sprint.words += delta;
    UI.updateCounts();
  }, 300);

  /* The text of the current paragraph up to the caret. */
  function textBefore() {
    const s = getSelection(); if (!s.rangeCount) return "";
    const r = s.getRangeAt(0); if (!r.collapsed) return "";
    const el = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
    const scope = el.closest("p") || el.closest(".prose"); if (!scope) return "";
    const pre = document.createRange(); pre.selectNodeContents(scope);
    try { pre.setEnd(r.startContainer, r.startOffset); } catch { return ""; }
    return pre.toString();
  }
  const charBefore = () => textBefore().slice(-1);
  /* Which way a typed quote should face. After a dash it depends on whether speech is already open in
     this paragraph: “Wait—” closes, but: he said—“Stop” opens. */
  function quoteOpens(d, before) {
    const prev = before.slice(-1);
    if (!prev) return true;
    if (!/[—–]/.test(prev)) return /[\s(\[{“‘]/.test(prev);
    const count = re => (before.match(re) || []).length;
    return d === '"' ? count(/“/g) <= count(/”/g) : count(/‘/g) <= count(/’(?!\p{L})/gu); // ’ inside a word is an apostrophe
  }
  function onBeforeInput(e) {
    if (!S.meta.settings.smart || e.inputType !== "insertText" || !e.data) return;
    const d = e.data;
    if (d === "-") {
      if (charBefore() === "-") { e.preventDefault(); document.execCommand("delete"); document.execCommand("insertText", false, "—"); }
      return;
    }
    if (d === ".") {
      const s = getSelection(); const r = s.rangeCount && s.getRangeAt(0);
      if (r && r.collapsed && r.startContainer.nodeType === 3 && r.startContainer.nodeValue.slice(Math.max(0, r.startOffset - 2), r.startOffset) === "..") {
        e.preventDefault(); document.execCommand("delete"); document.execCommand("delete"); document.execCommand("insertText", false, "…");
      }
      return;
    }
    if (d !== '"' && d !== "'") return;
    e.preventDefault();
    const open = quoteOpens(d, textBefore());
    document.execCommand("insertText", false, d === '"' ? (open ? "“" : "”") : (open ? "‘" : "’"));
  }
  function onPaste(e) {
    if (!e.target.closest(".prose")) return;
    e.preventDefault();
    const cd = e.clipboardData; if (!cd) return;
    const html = cd.getData("text/html"), text = cd.getData("text/plain");
    let clean = "";
    if (html) clean = sanitizeProse(html);
    else if (text) clean = text.replace(/\r\n?/g, "\n").split(/\n\s*\n|\n/).map(s => s.trim()).filter(Boolean).map(s => "<p>" + esc(s) + "</p>").join("");
    if (!clean) return;
    const single = clean.match(/^<p>(.*)<\/p>$/s);
    if (single && !single[1].includes("<p>")) {
      if (/<(em|strong)>/.test(single[1])) document.execCommand("insertHTML", false, single[1]);
      else document.execCommand("insertText", false, decodeEntities(single[1].replace(/<br>/g, " ")));
    } else document.execCommand("insertHTML", false, clean);
  }
  function onInput(e) {
    const el = e.target.closest(".prose"); if (!el) return;
    const id = el.dataset.id;
    const today = dayKey();
    if (touched.get(id) !== today) { touched.set(id, today); dailySnapshot(id); } // per day, so a page left open overnight still gets one
    if (!el.firstElementChild) { el.innerHTML = "<p><br></p>"; placeCaret(el, false); }
    el.classList.toggle("blank", !el.textContent.trim() && !el.querySelector("hr"));
    dirty.add(id); saveSoon(); recount(el); keepCaret();
    if (e.inputType === "insertCompositionText" && !e.isComposing) fixTyped();
  }
  /* Keyboards that compose text (most phones, dead keys, input methods) do not let a keystroke be
     replaced before it lands, so their punctuation is corrected just after instead. */
  function fixTyped() {
    if (!S.meta.settings.smart || fixing) return;
    const s = getSelection(), r = s.rangeCount && s.getRangeAt(0);
    if (!r || !r.collapsed || r.startContainer.nodeType !== 3) return;
    const tn = r.startContainer, off = r.startOffset, t = tn.nodeValue.slice(0, off);
    if (!tn.parentElement || !tn.parentElement.closest(".prose")) return;
    let len = 0, rep = "";
    if (/["']$/.test(t)) { const d = t.slice(-1), open = quoteOpens(d, textBefore().slice(0, -1)); len = 1; rep = d === '"' ? (open ? "“" : "”") : (open ? "‘" : "’"); }
    else if (t.endsWith("--")) { len = 2; rep = "—"; }
    else if (t.endsWith("...")) { len = 3; rep = "…"; }
    if (!len) return;
    const rg = document.createRange(); rg.setStart(tn, off - len); rg.setEnd(tn, off);
    s.removeAllRanges(); s.addRange(rg);
    fixing = true; try { document.execCommand("insertText", false, rep); } finally { fixing = false; }
  }
  function placeCaret(el, atEnd = true) {
    el.focus({ preventScroll: true });
    const r = document.createRange();
    const target = atEnd ? (el.lastElementChild || el) : (el.firstElementChild || el);
    r.selectNodeContents(target); r.collapse(!atEnd);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function keepCaret() {
    if (!S.meta.settings.typewriter) return;
    const sc = $("#scroller"); const s = getSelection(); if (!sc || !s.rangeCount) return;
    const r = s.getRangeAt(0); if (!sc.contains(r.startContainer)) return;
    let rect = r.getClientRects()[0];
    if (!rect || (!rect.top && !rect.height)) { const el = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement; rect = el.getBoundingClientRect(); }
    const sr = sc.getBoundingClientRect();
    const dy = rect.top - (sr.top + sr.height * 0.42);
    if (Math.abs(dy) > 6) sc.scrollBy({ top: dy, behavior: Math.abs(dy) > 160 && !reduceMotion() ? "smooth" : "auto" });
  }
  function onSelection() {
    const s = getSelection(); if (!s.rangeCount) return;
    const n = s.anchorNode; const el = n && (n.nodeType === 1 ? n : n.parentElement);
    const p = el && el.closest && el.closest(".prose > p");
    if (p !== curPara) { if (curPara) curPara.classList.remove("cur"); curPara = p || null; if (p) p.classList.add("cur"); }
  }
  function onFocusIn(e) {
    const el = e.target.closest(".prose"); if (!el) return;
    const id = el.dataset.id;
    if (S.active !== id) {
      S.active = id;
      $$(".scene-block.active").forEach(b => b.classList.remove("active"));
      el.closest(".scene-block").classList.add("active");
      UI.renderInspector(); UI.renderStatus(); UI.markBinderActive();
    }
  }

  function toolsHTML() {
    const st = S.meta.settings;
    return `<div class="write-tools" role="toolbar" aria-label="Formatting">
      <button class="iconbtn" type="button" data-cmd="bold" title="Bold (Ctrl+B)" aria-label="Bold"><b>B</b></button>
      <button class="iconbtn" type="button" data-cmd="italic" title="Italic (Ctrl+I)" aria-label="Italic"><i>I</i></button>
      <button class="iconbtn" type="button" data-cmd="break" title="Scene break (Ctrl+Shift+Enter)" aria-label="Insert scene break">✦</button>
      <span class="sep"></span>
      <button class="iconbtn ${st.typewriter ? "on" : ""}" type="button" data-cmd="typewriter" title="Typewriter scrolling" aria-label="Typewriter scrolling" aria-pressed="${st.typewriter}">
        <svg viewBox="0 0 24 24"><path d="M4 12h16M8 8h8M8 16h8"/></svg></button>
      <button class="iconbtn ${S.focus ? "on" : ""}" type="button" data-cmd="focus" title="Focus mode (Ctrl+Shift+F)" aria-label="Focus mode" aria-pressed="${S.focus}">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M3 8V5a2 2 0 012-2h3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3"/></svg></button>
      <button class="iconbtn" type="button" data-cmd="snapshot" title="Take snapshot (Ctrl+Shift+S)" aria-label="Take snapshot">
        <svg viewBox="0 0 24 24"><rect x="3.5" y="6.5" width="17" height="13" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M9 6.5l1.5-2h3L15 6.5"/></svg></button>
    </div>`;
  }

  async function render(stage) {
    saveDirty();
    const p = P(), seq = ++renderSeq;
    if (S.sel && !node(S.sel)) S.sel = null;
    // With the project itself selected the page opens on the first scene; the selection stays on the project.
    const scope = S.sel, ids = scope ? scenesUnder(scope) : IX.order.slice(0, 1);
    if (!ids.length) {
      const n = scope && node(scope);
      stage.innerHTML = `<div class="scroller"><div class="empty"><div class="astro-s" data-astro="small"></div>
        <h3>${n ? esc(n.title || labelOf(n.type)) + " is empty" : "No scenes yet"}</h3>
        <p>Scenes are where the words live. Add one and the page will open for writing.</p>
        <button class="btn gild" type="button" data-cmd="addscene">+ New scene</button></div></div>`;
      paintAstros(stage); return;
    }
    try { await Promise.all(ids.map(getText)); }
    catch (e) { // show the failure; an empty page here would invite typing over text that is still in storage
      console.warn("scene text not loaded", e);
      if (seq !== renderSeq || S.mode !== "write" || P() !== p) return;
      stage.innerHTML = `<div class="scroller"><div class="empty"><div class="astro-s" data-astro="small"></div>
        <h3>This text could not be loaded</h3>
        <p>${esc((e && e.message) || "Storage did not answer.")} Nothing has been changed. Check your connection and try again.</p>
        <button class="btn gild" type="button" data-cmd="retry">Try again</button></div></div>`;
      paintAstros(stage); return;
    }
    // A later selection, or another view, may have taken the stage while the text was loading.
    if (seq !== renderSeq || S.mode !== "write" || P() !== p) return;
    saveDirty(); // anything typed into the outgoing page meanwhile
    const st = S.meta.settings, multi = ids.length > 1 || (!!scope && node(scope).type !== "scene");
    let html = "", lastCh = undefined;
    for (const id of ids) {
      const n = node(id), ch = chapterOf(id);
      if (ch !== lastCh) {
        lastCh = ch;
        if (ch) {
          const c = node(ch);
          html += `<header class="ms-chapter"><div class="hud">${esc(labelOf("chapter"))} ${esc(IX.coord[ch].replace(/^E/, ""))}</div><h2>${esc(c.title)}</h2>${multi ? '<div class="orn">✦ ✧ ✦</div>' : ""}</header>`;
        }
      }
      const t = S.texts.get(id) || "";
      html += `<article class="scene-block" data-id="${id}">
        <div class="scene-head"><span class="coord">${esc(IX.coord[id])}</span>
          <input type="text" id="st-${id}" data-title="${id}" value="${esc(n.title)}" aria-label="Scene title" placeholder="Untitled scene">
          <span class="wc" data-swc="${id}">${fmtFull(n.words)}${n.target ? " / " + fmtFull(n.target) : ""} w</span></div>
        <div class="prose ${t.replace(/<[^>]+>/g, "").trim() ? "" : "blank"}" contenteditable="true" spellcheck="${st.spell}" data-id="${id}" role="textbox" aria-multiline="true" aria-label="Text of ${esc(n.title || "scene")}" data-ph="${esc(n.synopsis ? "Synopsis: " + n.synopsis : "Begin here…")}">${t || "<p><br></p>"}</div>
      </article>`;
    }
    html += `<div class="ms-add"><button class="btn small ghost" type="button" data-cmd="addscene">+ Scene after this</button>${p.form !== "short" ? '<button class="btn small ghost" type="button" data-cmd="addchapter">+ ' + esc(labelOf("chapter")) + "</button>" : ""}</div>`;
    stage.innerHTML = toolsHTML() + `<div class="scroller ${st.typewriter ? "typewriter" : ""}" id="scroller"><div class="manuscript para-${st.para}">${html}</div></div>`;
    const target = S.active && ids.includes(S.active) ? S.active : ids[0];
    S.active = target;
    const blk = $(`.scene-block[data-id="${CSS.escape(target)}"]`); blk && blk.classList.add("active");
    if (multi && target !== ids[0]) blk && blk.scrollIntoView({ block: "start" });
    if (!matchMedia("(max-width: 900px)").matches) { const el = proseEl(target); el && placeCaret(el, true); if (!multi) keepCaret(); }
    UI.refreshMentions(); // the inspector was drawn before this text had loaded
  }

  function bind(stage) {
    stage.addEventListener("beforeinput", onBeforeInput);
    stage.addEventListener("input", e => {
      if (e.target.matches("[data-title]")) {
        const n = node(e.target.dataset.title); if (!n) return;
        n.title = e.target.value; UI.updateLabels(n.id); touch(); return;
      }
      onInput(e);
    });
    stage.addEventListener("compositionend", e => { if (e.target.closest && e.target.closest(".prose")) setTimeout(fixTyped, 0); });
    stage.addEventListener("paste", onPaste);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("keyup", e => { if (e.key.startsWith("Arrow") || e.key === "Enter" || e.key === "PageDown" || e.key === "PageUp") keepCaret(); });
    stage.addEventListener("mouseup", () => setTimeout(keepCaret, 0));
    stage.addEventListener("keydown", e => {
      if (e.target.matches("[data-title]") && e.key === "Enter") { e.preventDefault(); const pr = proseEl(e.target.dataset.title); pr && placeCaret(pr, false); }
    });
    document.addEventListener("selectionchange", () => { if (S.mode === "write") onSelection(); });
  }

  return {
    render, bind, placeCaret,
    flush() { saveSoon.flush(); saveDirty(); },
    isDirty: () => dirty.size > 0,
    discard() { saveSoon.cancel(); dirty.clear(); },
    exec(cmd) {
      const el = document.activeElement && document.activeElement.closest && document.activeElement.closest(".prose");
      if (cmd === "bold" || cmd === "italic") { if (el) document.execCommand(cmd); return; }
      if (cmd === "break") {
        if (!el) { UI.toast("Click into the text where the break should go."); return; }
        document.execCommand("insertHTML", false, "<hr><p><br></p>");
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    keepCaret,
    activeId: () => S.active,
    scrollToScene(id) { const b = $(`.scene-block[data-id="${CSS.escape(id)}"]`); if (b) { b.scrollIntoView({ block: "start", behavior: reduceMotion() ? "auto" : "smooth" }); const pr = proseEl(id); pr && placeCaret(pr, true); return true; } return false; },
  };
})();
