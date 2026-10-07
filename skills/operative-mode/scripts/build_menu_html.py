#!/usr/bin/env python3
"""Build the selectable HTML pickers for the Play Menu and the Magic Menu.

Reads assets/play-menu.md + play-menu.json and assets/magic-menu.md + magic-menu.json,
and writes assets/play-menu.html and assets/magic-menu.html: self-contained pages
(no network) where the Player picks options, marks sets as Operator's Choice,
rolls with the browser's cryptographic random source, and copies the picks back
into the conversation.

Usage:
    python build_menu_html.py            # builds both
    python build_menu_html.py --out DIR  # write the two files to DIR instead
"""
import argparse
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "..", "assets")


def clean(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)  # links -> text
    text = text.replace("**", "").replace("`", "")
    text = re.sub(r"(?<!\w)\*([^*]+)\*(?!\w)", r"\1", text)
    return text.strip()


def norm(name):
    return clean(name).replace("★", "").strip().lower()


def rows(block):
    """Yield (header_cells, row_cells) for every table row in a block of markdown."""
    header = None
    for line in block.splitlines():
        if not line.startswith("|"):
            header = None
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if re.match(r"^-+$", cells[0].replace(" ", "")):
            continue
        if header is None:
            header = [c.lower() for c in cells]
            continue
        yield header, cells


def sections(md):
    """Split on '## ' headings; return list of (title, body)."""
    out = []
    parts = re.split(r"^## ", md, flags=re.M)
    for p in parts[1:]:
        title, _, body = p.partition("\n")
        out.append((title.strip(), body))
    return out


def intro(body):
    for para in re.split(r"\n\s*\n", body.strip()):
        para = para.strip()
        if para and not para.startswith(("|", "#", "-", ">")):
            return clean(para)
    return ""


DESC_COLS = ("in one line", "definition", "what it offers", "what happens")


def describe(header, cells):
    """Pick a description from a table row, combining helpful columns."""
    parts = []
    for i, h in enumerate(header[1:], start=1):
        if i >= len(cells):
            break
        if h in ("status",):
            continue
        if h in ("period", "fusion"):
            parts.append(cells[i])
        elif h in DESC_COLS:
            parts.append(cells[i])
        elif h == "what it sets":
            parts.append("Sets: " + cells[i])
    return clean(" · ".join(p for p in parts if p))


# ---------------------------------------------------------------- Play Menu
def build_play():
    md = open(os.path.join(ASSETS, "play-menu.md"), encoding="utf-8").read()
    menu = json.load(open(os.path.join(ASSETS, "play-menu.json"), encoding="utf-8"))
    version = re.search(r"Play Menu v([\d.]+)", md).group(1)

    secs = sections(md)
    sets_map = {}
    for title, body in secs:
        if title.startswith("How to use"):
            for header, cells in rows(body):
                if header[0] == "category":
                    sets_map[clean(cells[0])] = clean(cells[1])

    def sets_for(cat):
        for k, v in sets_map.items():
            names = [x.strip() for x in k.split(",")]
            short = cat.replace(" Settings", "")
            if k == cat or short in names or cat in names or k.startswith(short):
                return v
        return ""

    numbered = {}
    for title, body in secs:
        m = re.match(r"(\d+)\. (.+)", title)
        if m:
            numbered[m.group(2).strip()] = (int(m.group(1)), body)

    cats = []
    for cat, subs in menu.items():
        num, body = numbered.get(cat, (0, ""))
        desc, groups = {}, {}
        for header, cells in rows(body):
            first = header[0]
            if first in ("group", "sphere", "kind"):
                for col in cells[1:]:
                    for opt in col.split(";"):
                        if opt.strip():
                            groups[norm(opt)] = clean(cells[0])
            elif first in ("option", "hook"):
                desc[norm(cells[0])] = describe(header, cells)
        sub_list = []
        for sub, options in subs.items():
            sub_list.append({
                "name": "" if sub == "Options" else sub,
                "mode": "several",
                "options": [{"name": o, "desc": desc.get(norm(o), ""), "group": groups.get(norm(o), "")}
                            for o in options],
            })
        if cat == "Romantic Interest":  # refinements live only in the markdown
            for header, cells in rows(body):
                if header[0] == "refinement":
                    sub_list.append({
                        "name": clean(cells[0]) + " (if a romance is included)",
                        "mode": "one",
                        "options": [{"name": o.strip().capitalize() if o.strip()[0].islower() else o.strip(),
                                     "desc": "", "group": ""} for o in cells[1].split(";")],
                    })
        cats.append({"id": "c%d" % num, "num": num, "name": cat, "intro": intro(body),
                     "sets": sets_for(cat), "subs": sub_list})
    cats.sort(key=lambda c: c["num"])

    settings = ["Historical Settings", "Sci-Fi Settings", "Post-Apocalyptic Settings", "Dark World Settings",
                "Trope Fusion Settings", "Fantasy and Magic Settings", "Environment and Location Settings"]
    config = {
        "kind": "play",
        "title": "Play Menu",
        "version": "Play Menu v" + version,
        "lede": "Pick anything that appeals, in as many categories as you like. Mark a category Operator's Choice to hand it over; anything you leave untouched is the Operator's to elect.",
        "core": {"label": "Roll the core three", "cats": ["Story Types", "<setting>", "Tone and Atmosphere"],
                 "settings": settings},
        "groups": None,
        "approach": None,
    }
    return config, cats


# ---------------------------------------------------------------- Magic Menu
def build_magic():
    md = open(os.path.join(ASSETS, "magic-menu.md"), encoding="utf-8").read()
    version = re.search(r"Magic Menu v([\d.]+)", md).group(1)
    secs = sections(md)

    sets_map, approach = {}, []
    for title, body in secs:
        if title.startswith("How to use"):
            for header, cells in rows(body):
                if header[0] == "set":
                    sets_map[re.sub(r"^\d+\.\s*", "", clean(cells[0]))] = clean(cells[1])
                elif header[0] == "option" and header[1].startswith("what happens"):
                    approach.append({"name": clean(cells[0]), "desc": clean(cells[1])})

    group_of = {}
    for n in range(1, 5): group_of[n] = "Core"
    for n in range(5, 10): group_of[n] = "Power"
    for n in range(10, 15): group_of[n] = "Limits"
    for n in range(15, 19): group_of[n] = "The World"
    for n in range(19, 22): group_of[n] = "Shape"
    for n in range(22, 25): group_of[n] = "Extras"

    cats = []
    for title, body in secs:
        m = re.match(r"(\d+)\. (.+?) · \*(one|several)\*", title)
        if not m:
            continue
        num, name, mode = int(m.group(1)), m.group(2), m.group(3)
        options = []
        for header, cells in rows(body):
            if header[0] != "option":
                continue
            raw = cells[0]
            opt = clean(raw).replace("★", "").strip()
            if opt == "Operator's Choice":
                continue
            options.append({"name": opt, "desc": clean(cells[1]), "group": "", "star": "★" in raw})
        cats.append({"id": "m%d" % num, "num": num, "name": name, "intro": intro(body),
                     "sets": sets_map.get(name, ""), "group": group_of[num],
                     "subs": [{"name": "", "mode": mode, "options": options}]})

    config = {
        "kind": "magic",
        "title": "Magic Menu",
        "version": "Magic Menu v" + version,
        "lede": "Start with the Approach. Every set has Operator's Choice. A star marks the Standard System's own value, so a tuned system shows exactly what you changed.",
        "core": {"label": "Roll the core four", "cats": ["What Magic Is", "The Reserve", "How It Is Cast", "How It Is Divided"]},
        "groups": ["Core", "Power", "Limits", "The World", "Shape", "Extras"],
        "approach": approach,
    }
    return config, cats


# ---------------------------------------------------------------- page
PAGE = r"""<!doctype html>
<html lang="en" data-kind="__KIND__">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
:root{
  --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,"URW Palladio L",Georgia,serif;
  --sans:"Avenir Next","Segoe UI",Candara,"Trebuchet MS",sans-serif;
  --r-sm:3px; --r-lg:10px;
}
/* Play Menu: a library catalogue, grey-green paper and oxblood ink */
html[data-kind=play]{--bg:#EDF0EA;--panel:#F7F8F4;--ink:#1E2A30;--muted:#5D6A65;--rule:#C8CFC4;--accent:#8A2B35;--accent-ink:#FFF;--tint:#F1E1DF;--star:#8A6A1E;--focus:#2F6F86}
/* Magic Menu: an indigo night, gold for the seal, violet for the Standard star */
html[data-kind=magic]{--bg:#171C2B;--panel:#1F2639;--ink:#E6E2D5;--muted:#9AA0B2;--rule:#33405C;--accent:#C9A44C;--accent-ink:#1A1A1A;--tint:#2E2A22;--star:#A796E0;--focus:#7FC4D8}
@media (prefers-color-scheme:dark){
  html[data-kind=play]{--bg:#1A2125;--panel:#212A2F;--ink:#E3E6DF;--muted:#9BA6A1;--rule:#36434A;--accent:#D9767F;--accent-ink:#1A1A1A;--tint:#3A2A2D;--star:#D4B160;--focus:#7FC4D8}
}
@media (prefers-color-scheme:light){
  html[data-kind=magic]{--bg:#ECEAF2;--panel:#F7F6FA;--ink:#221F33;--muted:#5F5B74;--rule:#CFCADF;--accent:#7A5C14;--accent-ink:#FFF;--tint:#EFE6CF;--star:#5B4A9E;--focus:#2F6F86}
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 var(--serif)}
button,input{font:inherit;color:inherit}
:focus-visible{outline:3px solid var(--focus);outline-offset:2px}
.wrap{max-width:1320px;margin:0 auto;padding:0 16px}
header.top{padding:40px 0 20px;border-bottom:1px solid var(--rule)}
header.top h1{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1;margin:0 0 6px;font-weight:600;letter-spacing:-.01em}
header.top .ver{color:var(--muted);font-family:var(--sans);font-size:.85rem;margin:0 0 14px}
header.top p.lede{max-width:68ch;margin:0;color:var(--ink)}
.tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:18px}
.tools input[type=search]{flex:1 1 240px;max-width:420px;padding:9px 12px;border:1px solid var(--rule);border-radius:var(--r-sm);background:var(--panel)}
.btn{border:1px solid var(--rule);background:var(--panel);padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;font-family:var(--sans);font-size:.9rem}
.btn:hover{border-color:var(--ink)}
.btn.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
.layout{display:grid;grid-template-columns:220px minmax(0,1fr) 340px;gap:28px;padding:24px 0 120px}
nav.rail{position:sticky;top:16px;align-self:start;max-height:calc(100vh - 32px);overflow:auto;font-family:var(--sans);font-size:.88rem}
nav.rail h2{font:600 .95rem var(--serif);margin:14px 0 4px;color:var(--muted)}
nav.rail a{display:flex;justify-content:space-between;gap:8px;padding:4px 6px;color:var(--ink);text-decoration:none;border-radius:var(--r-sm)}
nav.rail a:hover{background:var(--panel)}
nav.rail a .n{color:var(--muted)}
nav.rail a.has .n{color:var(--accent);font-weight:700}
nav.rail a.oc .n{color:var(--star)}
main{min-width:0}
section.cat{padding:22px 0 26px;border-bottom:1px solid var(--rule)}
section.cat[hidden]{display:none}
.cat-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px}
.cat-head h2{margin:0;font-size:1.55rem;font-weight:600}
.cat-head h2 .num{color:var(--muted);font-weight:400;margin-right:8px}
.badge{font-family:var(--sans);font-size:.78rem;color:var(--muted);border:1px solid var(--rule);padding:1px 8px;border-radius:99px}
.cat-sets{font-family:var(--sans);font-size:.82rem;color:var(--muted);margin:4px 0 0}
details.about{margin:8px 0 0;max-width:72ch}
details.about summary{cursor:pointer;color:var(--muted);font-family:var(--sans);font-size:.85rem}
details.about p{margin:6px 0 0;font-size:.95rem}
.cat-tools{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 4px}
.oc-btn[aria-pressed=true]{background:var(--star);color:var(--bg);border-color:var(--star)}
.cat.is-oc .opts{opacity:.45}
.sub h3{font-size:1.05rem;margin:18px 0 6px;font-weight:600}
.grp{font-family:var(--sans);font-size:.8rem;color:var(--muted);margin:14px 0 4px}
.opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:4px 18px}
.opt{display:grid;grid-template-columns:22px 1fr;gap:10px;align-items:start;text-align:left;width:100%;background:none;border:0;border-top:1px dotted var(--rule);padding:9px 6px 9px 2px;cursor:pointer;border-radius:0}
.opt:hover{background:var(--panel)}
.opt .seal{width:18px;height:18px;margin-top:3px;border:1.5px solid var(--muted);border-radius:50%;position:relative}
.sub[data-mode=one] .opt .seal{border-radius:50%}
.sub[data-mode=several] .opt .seal{border-radius:4px}
.opt[aria-pressed=true]{background:var(--tint)}
.opt[aria-pressed=true] .seal{background:var(--accent);border-color:var(--accent)}
.opt[aria-pressed=true] .seal::after{content:"";position:absolute;left:5px;top:1px;width:5px;height:10px;border:solid var(--accent-ink);border-width:0 2px 2px 0;transform:rotate(45deg)}
.opt .nm{font-weight:600}
.opt .star{color:var(--star);margin-left:4px}
.opt .ds{display:block;font-size:.88rem;color:var(--muted);line-height:1.4;margin-top:1px}
.opt .rolled{font-family:var(--sans);font-size:.72rem;color:var(--accent);margin-left:6px}
.opt[hidden]{display:none}
aside.slip{position:sticky;top:16px;align-self:start;max-height:calc(100vh - 32px);overflow:auto;background:var(--panel);border:1px solid var(--rule);border-radius:var(--r-lg);padding:18px}
aside.slip h2{margin:0 0 4px;font-size:1.3rem}
aside.slip .sub2{color:var(--muted);font-family:var(--sans);font-size:.82rem;margin:0 0 12px}
.slip ul{list-style:none;padding:0;margin:0}
.slip li{padding:7px 0;border-top:1px dotted var(--rule);font-size:.93rem}
.slip li b{display:block;font-size:.78rem;font-family:var(--sans);color:var(--muted);font-weight:600}
.slip li.oc span{color:var(--star)}
.slip li.tune b::after{content:" · tuning";color:var(--accent)}
.slip .empty{color:var(--muted);font-size:.93rem}
.slip .left{margin-top:12px;font-size:.85rem;color:var(--muted)}
.slip .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.slip textarea{width:100%;min-height:140px;margin-top:10px;font:12px/1.4 ui-monospace,Menlo,Consolas,monospace;background:var(--bg);color:var(--ink);border:1px solid var(--rule);border-radius:var(--r-sm);padding:8px}
.toast{font-family:var(--sans);font-size:.82rem;color:var(--accent);min-height:1.2em;margin-top:6px}
.approach{margin:22px 0 0;padding:18px;border:1px solid var(--accent);border-radius:var(--r-lg);background:var(--panel)}
.approach h2{margin:0 0 8px;font-size:1.35rem}
.approach .opts{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.std-note{margin:16px 0 0;padding:14px 16px;border-left:3px solid var(--star);background:var(--panel);max-width:72ch}
.groups-hide section.cat{display:none}
.mob-slip{display:none}
@media (max-width:1100px){.layout{grid-template-columns:minmax(0,1fr) 320px}nav.rail{display:none}}
@media (max-width:760px){
  .layout{grid-template-columns:1fr}
  aside.slip{position:fixed;left:0;right:0;bottom:0;top:auto;max-height:70vh;padding-bottom:72px;border-radius:var(--r-lg) var(--r-lg) 0 0;transform:translateY(calc(100% - 0px));transition:transform .2s;z-index:5}
  aside.slip.open{transform:none}
  .mob-slip{display:block;position:fixed;right:16px;bottom:16px;z-index:6}
  body{font-size:16px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <h1 id="title"></h1>
  <p class="ver" id="ver"></p>
  <p class="lede" id="lede"></p>
  <div class="tools">
    <input type="search" id="q" placeholder="Search options" aria-label="Search options">
    <button class="btn" id="rollCore"></button>
    <button class="btn" id="reset">Clear all</button>
  </div>
  <div id="approachBox"></div>
</header>
<div class="layout">
  <nav class="rail" id="rail" aria-label="Categories"></nav>
  <main id="main"></main>
  <aside class="slip" id="slip" aria-label="Your picks">
    <h2>Your picks</h2>
    <p class="sub2">Copy this into the conversation when you are done.</p>
    <div id="slipBody"></div>
    <div class="acts">
      <button class="btn primary" id="copy">Copy picks</button>
      <button class="btn" id="show">Show as text</button>
    </div>
    <div class="toast" id="toast" role="status"></div>
    <textarea id="out" hidden readonly aria-label="Picks as text"></textarea>
  </aside>
</div>
</div>
<button class="btn primary mob-slip" id="mobSlip">Your picks</button>
<script>
const CONFIG = __CONFIG__;
const CATS = __DATA__;
const KEY = "operative-mode:" + CONFIG.kind + "-menu";
let state = {picks:{}, oc:{}, rolled:{}, approach:null};
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.picks) state = Object.assign(state, s); } catch(e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e) {} }

function el(tag, attrs, ...kids){ const n = document.createElement(tag);
  for (const k in (attrs||{})) { if (k === "class") n.className = attrs[k]; else if (k === "text") n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); }
  for (const k of kids) if (k != null) n.append(k); return n; }
function rnd(n){ const a = new Uint32Array(1); const lim = Math.floor(0xFFFFFFFF / n) * n; let x; do { crypto.getRandomValues(a); x = a[0]; } while (x >= lim); return x % n; }
function key(cat, sub){ return cat.id + "|" + sub; }
function picksOf(cat, si){ return state.picks[key(cat, si)] || []; }
function catHas(cat){ return cat.subs.some((s, i) => picksOf(cat, i).length); }

document.getElementById("title").textContent = CONFIG.title;
document.getElementById("ver").textContent = CONFIG.version + " · Operative Mode Framework, Draft 0.4";
document.getElementById("lede").textContent = CONFIG.lede;
document.title = CONFIG.title;
document.getElementById("rollCore").textContent = CONFIG.core.label;

/* ---------- approach (Magic Menu) ---------- */
function renderApproach(){
  const box = document.getElementById("approachBox"); box.innerHTML = "";
  if (!CONFIG.approach) return;
  const wrap = el("div", {class:"approach"}, el("h2", {text:"Approach"}));
  const sub = el("div", {class:"sub", "data-mode":"one"});
  const grid = el("div", {class:"opts"});
  CONFIG.approach.forEach(a => {
    const b = el("button", {class:"opt", type:"button", "aria-pressed": String(state.approach === a.name)},
      el("span", {class:"seal"}), el("span", {}, el("span", {class:"nm", text:a.name}), el("span", {class:"ds", text:a.desc})));
    b.onclick = () => { setApproach(state.approach === a.name ? null : a.name); };
    grid.append(b);
  });
  sub.append(grid); wrap.append(sub); box.append(wrap);
  if (state.approach === "The Standard System")
    box.append(el("p", {class:"std-note", text:"The Standard System is adopted as written, so nothing else on this Menu is asked. Pick “The Standard System, tuned” instead if you want to change parts of it."}));
  if (state.approach === "Leave it to the Operator")
    box.append(el("p", {class:"std-note", text:"The Operator elects the whole system toward the Mode's Intent and declares the election. You can still pin any set below, and your pin wins."}));
}
function setApproach(name){
  state.approach = name;
  if (name === "The Standard System, tuned") {
    // preload the Standard values wherever the Player has not picked
    CATS.forEach(c => c.subs.forEach((s, i) => { const k = key(c, i);
      if (!(state.picks[k] || []).length && !state.oc[c.id]) state.picks[k] = s.options.filter(o => o.star).map(o => o.name); }));
  }
  save(); renderAll();
}

/* ---------- categories ---------- */
function optionButton(cat, si, sub, o){
  const on = picksOf(cat, si).includes(o.name);
  const nm = el("span", {class:"nm", text:o.name});
  const body = el("span", {}, nm);
  if (o.star) body.append(el("span", {class:"star", title:"The Standard System's value", text:"★"}));
  if (state.rolled[key(cat, si) + "|" + o.name] && on) body.append(el("span", {class:"rolled", text:"rolled"}));
  if (o.desc) body.append(el("span", {class:"ds", text:o.desc}));
  const b = el("button", {class:"opt", type:"button", "aria-pressed": String(on), "data-q": (o.name + " " + o.desc + " " + (o.group||"")).toLowerCase()}, el("span", {class:"seal"}), body);
  b.onclick = () => toggle(cat, si, sub, o.name, false);
  return b;
}
function toggle(cat, si, sub, name, rolled){
  const k = key(cat, si); let list = (state.picks[k] || []).slice();
  if (list.includes(name) && !rolled) list = list.filter(x => x !== name);
  else if (sub.mode === "one") list = [name];
  else if (!list.includes(name)) list.push(name);
  state.picks[k] = list;
  if (rolled) state.rolled[k + "|" + name] = true; else delete state.rolled[k + "|" + name];
  if (list.length) delete state.oc[cat.id];
  save(); renderCat(cat); renderSlip(); renderRail();
}
function roll(cat){
  // one draw per sub-list, among options not already picked
  cat.subs.forEach((s, i) => {
    const pool = s.mode === "one" ? s.options : s.options.filter(o => !picksOf(cat, i).includes(o.name));
    if (!pool.length) return;
    toggle(cat, i, s, pool[rnd(pool.length)].name, true);
  });
}
function renderCat(cat){
  const old = document.getElementById(cat.id);
  const sec = el("section", {class:"cat" + (state.oc[cat.id] ? " is-oc" : ""), id:cat.id});
  const modes = [...new Set(cat.subs.map(s => s.mode))];
  const h = el("div", {class:"cat-head"},
    el("h2", {}, el("span", {class:"num", text: cat.num + "."}), cat.name),
    el("span", {class:"badge", text: modes.length === 1 && modes[0] === "one" ? "Pick one" : "Pick any"}));
  sec.append(h);
  if (cat.sets) sec.append(el("p", {class:"cat-sets", text:"Sets: " + cat.sets}));
  if (cat.intro) { const d = el("details", {class:"about"}, el("summary", {text:"About this category"}), el("p", {text:cat.intro})); sec.append(d); }
  const oc = el("button", {class:"btn oc-btn", type:"button", "aria-pressed": String(!!state.oc[cat.id]), text:"Operator's Choice"});
  oc.onclick = () => { if (state.oc[cat.id]) delete state.oc[cat.id]; else { state.oc[cat.id] = true; cat.subs.forEach((s, i) => delete state.picks[key(cat, i)]); } save(); renderCat(cat); renderSlip(); renderRail(); };
  const rb = el("button", {class:"btn", type:"button", text:"Roll"}); rb.onclick = () => roll(cat);
  const cb = el("button", {class:"btn", type:"button", text:"Clear"});
  cb.onclick = () => { cat.subs.forEach((s, i) => delete state.picks[key(cat, i)]); delete state.oc[cat.id]; save(); renderCat(cat); renderSlip(); renderRail(); };
  sec.append(el("div", {class:"cat-tools"}, oc, rb, cb));
  cat.subs.forEach((s, i) => {
    const sub = el("div", {class:"sub", "data-mode":s.mode});
    if (s.name) sub.append(el("h3", {text: s.name + (s.mode === "one" && modes.length > 1 ? " (pick one)" : "")}));
    let grid = el("div", {class:"opts"}); let lastGroup = null;
    s.options.forEach(o => {
      if (o.group && o.group !== lastGroup) { if (grid.childNodes.length) sub.append(grid); sub.append(el("p", {class:"grp", text:o.group})); grid = el("div", {class:"opts"}); lastGroup = o.group; }
      grid.append(optionButton(cat, i, s, o));
    });
    sub.append(grid); sec.append(sub);
  });
  if (old) old.replaceWith(sec); else document.getElementById("main").append(sec);
  applySearch();
}
function renderRail(){
  const rail = document.getElementById("rail"); rail.innerHTML = "";
  let g = null;
  CATS.forEach(c => {
    if (c.group && c.group !== g) { rail.append(el("h2", {text:c.group})); g = c.group; }
    const n = c.subs.reduce((t, s, i) => t + picksOf(c, i).length, 0);
    const a = el("a", {href:"#" + c.id, class: state.oc[c.id] ? "oc" : (n ? "has" : "")}, el("span", {text:c.name}), el("span", {class:"n", text: state.oc[c.id] ? "OC" : (n || "")}));
    rail.append(a);
  });
}

/* ---------- slip ---------- */
function slipLines(){
  const lines = [], untouched = [], tunings = [];
  const tuned = state.approach === "The Standard System, tuned";
  CATS.forEach(c => {
    if (state.oc[c.id]) { lines.push({b:c.name, t:"Operator's Choice", oc:true}); if (tuned) tunings.push(c.name + ": Operator's Choice"); return; }
    let any = false;
    c.subs.forEach((s, i) => {
      const p = picksOf(c, i); if (!p.length) return; any = true;
      const shown = p.map(n => state.rolled[key(c, i) + "|" + n] ? n + " (rolled)" : n).join("; ");
      const std = s.options.filter(o => o.star).map(o => o.name).sort().join("; ");
      const isTune = tuned && p.slice().sort().join("; ") !== std;
      if (tuned && !isTune) return;  // unchanged from the Standard System: not worth listing
      lines.push({b: c.name + (s.name ? " / " + s.name : ""), t: shown, tune: isTune});
      if (isTune) tunings.push(c.name + ": " + p.join("; ") + (std ? "  (Standard: " + std + ")" : ""));
    });
    if (!any && !tuned) untouched.push(c.name);
  });
  return {lines, untouched, tunings};
}
function renderSlip(){
  const body = document.getElementById("slipBody"); body.innerHTML = "";
  const {lines, untouched} = slipLines();
  if (state.approach) body.append(el("ul", {}, el("li", {}, el("b", {text:"Approach"}), el("span", {text:state.approach}))));
  if (state.approach === "The Standard System") { body.append(el("p", {class:"left", text:"Nothing else is needed."})); updateOut(); return; }
  if (!lines.length && !state.approach) body.append(el("p", {class:"empty", text:"Nothing picked yet. Choose options, mark a category Operator's Choice, or roll."}));
  const ul = el("ul");
  lines.forEach(l => ul.append(el("li", {class: (l.oc ? "oc" : "") + (l.tune ? " tune" : "")}, el("b", {text:l.b}), el("span", {text:l.t}))));
  body.append(ul);
  if (untouched.length) body.append(el("p", {class:"left", text: untouched.length + " left untouched, so the Operator elects them: " + untouched.join(", ") + "."}));
  if (state.approach === "The Standard System, tuned") body.append(el("p", {class:"left", text: lines.length ? "Every other set stays as the Standard System has it (★)." : "No changes yet: every set is at its Standard value (★). Pick a different option anywhere to tune it."}));
  updateOut();
}
function asText(){
  const {lines, untouched, tunings} = slipLines();
  const out = [CONFIG.title.toUpperCase() + " PICKS (" + CONFIG.version + ")"];
  if (state.approach) out.push("Approach: " + state.approach);
  if (state.approach === "The Standard System") return out.join("\n");
  if (state.approach !== "The Standard System, tuned") lines.filter(l => !l.oc).forEach(l => out.push(l.b + ": " + l.t));
  else if (!tunings.length) out.push("No Tunings: every set at its Standard value.");
  const oc = lines.filter(l => l.oc).map(l => l.b);
  if (oc.length) out.push("Operator's Choice: " + oc.join(", "));
  if (tunings.length) { out.push("Tunings against the Standard System:"); tunings.forEach(t => out.push("- " + t)); }
  if (untouched.length) out.push("Untouched (Operator elects): " + untouched.join(", "));
  if (Object.keys(state.rolled).length) out.push("(rolled = Tool Draw from the browser's cryptographic random source)");
  return out.join("\n");
}
function updateOut(){ document.getElementById("out").value = asText(); }
function toast(t){ const n = document.getElementById("toast"); n.textContent = t; setTimeout(() => { if (n.textContent === t) n.textContent = ""; }, 2500); }
document.getElementById("copy").onclick = async () => {
  const text = asText();
  try { await navigator.clipboard.writeText(text); toast("Copied. Paste it into the conversation."); return; } catch(e) {}
  const ta = document.getElementById("out"); ta.hidden = false; ta.value = text; ta.select();
  try { document.execCommand("copy"); toast("Copied. Paste it into the conversation."); } catch(e) { toast("Select the text below and copy it."); }
};
document.getElementById("show").onclick = () => { const ta = document.getElementById("out"); ta.hidden = !ta.hidden; updateOut(); };
document.getElementById("mobSlip").onclick = () => document.getElementById("slip").classList.toggle("open");

/* ---------- search, core roll, reset ---------- */
function applySearch(){
  const q = document.getElementById("q").value.trim().toLowerCase();
  document.querySelectorAll("section.cat").forEach(sec => {
    let shown = 0;
    sec.querySelectorAll(".opt").forEach(b => { const hit = !q || b.dataset.q.includes(q) || sec.querySelector("h2").textContent.toLowerCase().includes(q); b.hidden = !hit; if (hit) shown++; });
    sec.querySelectorAll(".grp").forEach(g => { const grid = g.nextElementSibling; g.hidden = grid && ![...grid.children].some(b => !b.hidden); });
    sec.hidden = q && !shown;
  });
}
document.getElementById("q").oninput = applySearch;
document.getElementById("rollCore").onclick = () => {
  CONFIG.core.cats.forEach(name => {
    if (name === "<setting>") name = CONFIG.core.settings[rnd(CONFIG.core.settings.length)];
    const c = CATS.find(x => x.name === name);
    if (c) { c.subs.forEach((s, i) => { if (s.mode === "several") delete state.picks[key(c, i)]; }); roll(c); }
  });
  toast("Rolled. Each draw is marked in the picks.");
};
document.getElementById("reset").onclick = () => { if (!confirm("Clear every pick on this Menu?")) return; state = {picks:{}, oc:{}, rolled:{}, approach:null}; save(); renderAll(); };

function renderAll(){
  document.getElementById("main").innerHTML = "";
  renderApproach();
  const hideCats = state.approach === "The Standard System";
  CATS.forEach(renderCat);
  document.querySelectorAll("section.cat").forEach(s => s.style.display = hideCats ? "none" : "");
  renderRail(); renderSlip();
}
renderAll();
</script>
</body>
</html>
"""


def write(config, cats, path):
    html = (PAGE.replace("__KIND__", config["kind"]).replace("__TITLE__", config["title"])
            .replace("__CONFIG__", json.dumps(config, ensure_ascii=False))
            .replace("__DATA__", json.dumps(cats, ensure_ascii=False)))
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    n = sum(len(s["options"]) for c in cats for s in c["subs"])
    print(f"wrote {path}: {len(cats)} categories, {n} options")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--out", default=ASSETS)
    a = p.parse_args()
    write(*build_play(), os.path.join(a.out, "play-menu.html"))
    write(*build_magic(), os.path.join(a.out, "magic-menu.html"))


if __name__ == "__main__":
    main()
