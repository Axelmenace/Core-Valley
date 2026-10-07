#!/usr/bin/env python3
"""Audit a Scriptorium Record for concordance.

The audit is mechanical: it checks that the Record agrees with itself. It does
not judge prose, and a clean audit certifies nothing beyond agreement.

Usage:
    python audit_record.py <novel-root> [--json]

Exit status: 0 clean or warnings only, 1 errors found, 2 not a Record.
"""
import argparse
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

CH_RE = re.compile(r"ch-(\d+)")
FIELD_RE = re.compile(r"^\s*-\s+([A-Za-z][A-Za-z /]*?):\s*(.*?)\s*$")
OBL_KINDS = {"Question", "Plant", "Promise", "Deception"}
KNOW_STATUS = {"Knows", "Believes", "Suspects", "Unaware", "Misbelieves"}


class Report:
    def __init__(self):
        self.errors, self.warnings, self.notes = [], [], []

    def err(self, where, msg):
        self.errors.append(f"{where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"{where}: {msg}")

    def note(self, msg):
        self.notes.append(msg)


def chn(token):
    """'ch-007' -> 7, or None."""
    m = CH_RE.search(token or "")
    return int(m.group(1)) if m else None


def chs(n):
    return f"ch-{n:03d}"


def id_list(value):
    value = (value or "").strip()
    if not value or value.lower() in {"none", "-", "n/a"}:
        return []
    return [v.strip() for v in value.split(",") if v.strip()]


def read(path):
    try:
        return path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return None


def fields_of(lines):
    out = {}
    for ln in lines:
        m = FIELD_RE.match(ln)
        if m and m.group(1) not in out:
            out[m.group(1).strip()] = m.group(2)
    return out


def sections(text, pattern):
    """Split text into sections whose header line matches pattern.
    Returns list of (match, body_lines)."""
    rx = re.compile(pattern)
    out, cur, body = [], None, []
    for ln in text.splitlines():
        m = rx.match(ln)
        if m:
            if cur is not None:
                out.append((cur, body))
            cur, body = m, []
        elif cur is not None:
            # stop a ### section at the next ## heading of higher rank
            if pattern.startswith("^###") and ln.startswith("## "):
                out.append((cur, body))
                cur, body = None, []
                continue
            body.append(ln)
    if cur is not None:
        out.append((cur, body))
    return out


def h2_block(text, title):
    """Lines under '## title' up to the next '## '."""
    lines, on = [], False
    for ln in text.splitlines():
        if ln.startswith("## "):
            on = ln[3:].strip().lower() == title.lower()
            continue
        if on:
            lines.append(ln)
    return lines


def count_length(text, unit):
    body = "\n".join(
        ln for ln in text.splitlines()
        if not ln.startswith("#") and ln.strip() not in {"* * *", "***", "---"}
    )
    if unit == "characters":
        return len(re.sub(r"\s", "", body))
    return len(re.findall(r"[0-9A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’-][0-9A-Za-zÀ-ÖØ-öø-ÿ]+)*", body))


def main():
    ap = argparse.ArgumentParser(description="Audit a Scriptorium Record.")
    ap.add_argument("root")
    ap.add_argument("--json", action="store_true", help="emit the report as JSON")
    args = ap.parse_args()
    root = Path(args.root).expanduser().resolve()
    R = Report()

    manifest = read(root / "MANIFEST.md")
    if manifest is None:
        print(f"{root} is not a Scriptorium Record (no MANIFEST.md)", file=sys.stderr)
        return 2

    # ---------------- Manifest ----------------
    params = fields_of(h2_block(manifest, "Parameters"))
    if not params.get("Manifest Version"):
        R.err("MANIFEST.md", "Parameters lack a Manifest Version")
    band = None
    m = re.match(r"\s*(\d+)\s*-\s*(\d+)", params.get("Length Band", ""))
    if m:
        band = (int(m.group(1)), int(m.group(2)))
    else:
        R.warn("MANIFEST.md", "no parseable Length Band (expected 'Length Band: 3000-5000')")
    unit = "characters" if params.get("Length Unit", "").strip().lower().startswith("char") else "words"
    try:
        offstage_threshold = int(re.match(r"\s*(\d+)", params.get("Offstage Threshold", "2")).group(1))
    except (AttributeError, ValueError):
        offstage_threshold = 2
    parts = []
    for ln in h2_block(manifest, "Parts"):
        pm = re.match(r"^\s*-\s+Part\s+(\d+):\s*ch-(\d+)\s*\.\.\s*ch-(\d+)", ln)
        if pm:
            parts.append((int(pm.group(1)), int(pm.group(2)), int(pm.group(3))))

    def part_of(n):
        for p, a, b in parts:
            if a <= n <= b:
                return p
        return None

    # ---------------- Files ----------------
    chapters = {}
    for p in sorted((root / "chapters").glob("ch-*.md")):
        n = chn(p.name)
        if n is None:
            continue
        if n in chapters:
            R.err("chapters/", f"two files for {chs(n)}: {chapters[n].name}, {p.name}")
        chapters[n] = p

    ledgers = {}
    for p in sorted((root / "ledger").glob("ch-*.md")):
        n = chn(p.name)
        if n is None:
            continue
        text = read(p)
        idx = fields_of(h2_block(text, "Index"))
        ledgers[n] = (p, idx)

    archived = sorted(ledgers)
    latest = archived[-1] if archived else 0

    # ---------------- Cast ----------------
    cast = {}
    cast_text = read(root / "fabula/cast.md") or ""
    for m, body in sections(cast_text, r"^## (AGT-\d+)\s*·\s*(.+?)\s*·\s*(Principal|Supporting|Background)\s*$"):
        aid = m.group(1)
        if aid in cast:
            R.err("fabula/cast.md", f"{aid} declared twice")
        logs = set()
        for ln in body:
            lm = re.match(r"^\s*-\s+ch-(\d+)\s*·", ln)
            if lm:
                logs.add(int(lm.group(1)))
        heads = {ln[4:].strip() for ln in body if ln.startswith("### ")}
        cast[aid] = {"name": m.group(2), "tier": m.group(3), "logs": logs, "heads": heads}
    # Compacted State Log lines (moved verbatim at Part Close) still count
    for arch in sorted((root / "checkpoints/archive").glob("cast-part-*.md")):
        for m, body in sections(read(arch) or "", r"^## (AGT-\d+)\s*·.*$"):
            if m.group(1) in cast:
                for ln in body:
                    lm = re.match(r"^\s*-\s+ch-(\d+)\s*·", ln)
                    if lm:
                        cast[m.group(1)]["logs"].add(int(lm.group(1)))
            else:
                R.err(f"checkpoints/archive/{arch.name}", f"{m.group(1)} is not in the Cast Register")
    for aid, a in cast.items():
        if a["tier"] in ("Principal", "Supporting") and not a["logs"]:
            R.warn("fabula/cast.md", f"{aid} ({a['tier']}) has no State Log lines")
        if a["tier"] == "Principal":
            missing = [h for h in ("Card", "Voice", "Core", "Plans", "Competence", "Choice Rule", "State Log") if h not in a["heads"]]
            if missing:
                R.warn("fabula/cast.md", f"{aid} is Principal but lacks: {', '.join(missing)}")
        if a["tier"] == "Supporting":
            missing = [h for h in ("Card", "Voice") if h not in a["heads"]]
            if missing:
                R.warn("fabula/cast.md", f"{aid} is Supporting but lacks: {', '.join(missing)}")

    # ---------------- Obligations ----------------
    obls = {}
    obl_text = read(root / "discourse/obligations.md") or ""
    for arch in sorted((root / "checkpoints/archive").glob("obligations-part-*.md")):
        obl_text += "\n" + (read(arch) or "")
    for m, body in sections(obl_text, r"^### (OBL-\d+)\s*·\s*(.*)$"):
        oid = m.group(1)
        if oid in obls:
            R.err("discourse/obligations.md", f"{oid} declared twice")
        obls[oid] = fields_of(body)

    def parse_status(st):
        st = (st or "").strip()
        for kind in ("Paid", "Converted", "Released"):
            if st.startswith(kind):
                return kind, chn(st)
        return st.split(" ")[0] if st else "", None

    for oid, f in obls.items():
        where = f"discourse/obligations.md {oid}"
        kind = f.get("Kind", "").strip()
        if kind not in OBL_KINDS:
            R.err(where, f"Kind '{kind}' is not one of {sorted(OBL_KINDS)}")
        status, sch = parse_status(f.get("Status"))
        opened = chn(f.get("Opened", ""))
        if status not in {"Planned", "Open", "Paid", "Converted", "Released"}:
            R.err(where, f"Status '{f.get('Status', '')}' is not a recognized value")
            continue
        if status == "Planned":
            if opened is not None:
                R.err(where, "Status is Planned but an Opened chapter is recorded")
            pa = chn(f.get("Plant At", ""))
            if pa is not None and archived and pa <= latest and pa in ledgers:
                R.warn(where, f"planned to be planted at {chs(pa)}, which is archived, but still Planned")
            continue
        if opened is None:
            R.err(where, f"Status is {status} but no Opened chapter is recorded")
        if status in {"Paid", "Converted", "Released"}:
            if sch is None:
                R.err(where, f"Status {status} names no chapter")
            elif opened is not None and sch < opened:
                R.err(where, f"{status} at {chs(sch)} precedes Opened {chs(opened)}")
        if status == "Converted":
            tgt = re.search(r"->\s*(OBL-\d+)", f.get("Status", ""))
            if not tgt:
                R.err(where, "Converted names no successor (expected '-> OBL-NNN')")
            elif tgt.group(1) not in obls:
                R.err(where, f"converted into {tgt.group(1)}, which does not exist")
        win = f.get("Window", "").strip()
        if status == "Open" and win and win.lower() != "series":
            wm = re.search(r"ch-(\d+)\s*\.\.\s*ch-(\d+)", win)
            if wm and archived and int(wm.group(2)) < latest:
                R.warn(where, f"Open past its window ({win}); latest archived chapter is {chs(latest)}")
        # Reverse concordance: the Ledger of the opening/closing chapter must list it
        if opened is not None and opened in ledgers:
            if oid not in id_list(ledgers[opened][1].get("Obligations Opened")):
                R.err(where, f"Opened {chs(opened)} but that chapter's Ledger does not list it under Obligations Opened")
        if status in {"Paid", "Converted", "Released"} and sch is not None and sch in ledgers:
            key = f"Obligations {status}"
            if oid not in id_list(ledgers[sch][1].get(key)):
                R.err(where, f"{status} {chs(sch)} but that chapter's Ledger does not list it under {key}")

    # ---------------- Exposition ----------------
    dx = {}
    for m, body in sections(read(root / "discourse/exposition.md") or "", r"^### (DX-\d+)\s*·\s*(.*)$"):
        if m.group(1) in dx:
            R.err("discourse/exposition.md", f"{m.group(1)} declared twice")
        dx[m.group(1)] = fields_of(body)
    first_spent = {}

    # ---------------- Setting ----------------
    setting_text = read(root / "substrate/setting.md") or ""
    extract_ids = set(re.findall(r"^### \[(?:SYS|LORE)\]\s*([SL]-\d+)", setting_text, re.M))
    instances = {m.group(1): fields_of(b) for m, b in sections(setting_text, r"^### \[NAR\]\s*(N-\d+)\s*·?.*$")}
    queries = {m.group(1): fields_of(b) for m, b in sections(setting_text, r"^### (SQ-\d+)\s*·?.*$")}
    for nid, f in instances.items():
        lic = re.findall(r"[SL]-\d+", f.get("Licensed by", ""))
        if not lic:
            R.err(f"substrate/setting.md {nid}", "Instance names no licensing extract (Licensed by: S-NN or L-NN)")
        for x in lic:
            if x not in extract_ids:
                R.err(f"substrate/setting.md {nid}", f"licensed by {x}, which is not an extract")
    open_q = [q for q, f in queries.items() if f.get("Status", "").strip().startswith("Open")]
    if open_q:
        R.warn("substrate/setting.md", f"Setting Queries open: {', '.join(open_q)} (resolve at the Part boundary; drafting must not presume an answer)")

    # ---------------- Conditions ----------------
    cond_keys = set()
    cond_sections = sections(read(root / "substrate/conditions.md") or "", r"^### (C-\d+)\s*·\s*v(\d+)\s*·\s*(.*)$")
    for m, body in cond_sections:
        key = (m.group(1), int(m.group(2)))
        if key in cond_keys:
            R.err("substrate/conditions.md", f"{key[0]} v{key[1]} declared twice")
        cond_keys.add(key)
    for m, body in cond_sections:
        par = fields_of(body).get("Parent", "none")
        pm = re.search(r"(C-\d+)\s*v(\d+)", par)
        if pm and (pm.group(1), int(pm.group(2))) not in cond_keys:
            R.err("substrate/conditions.md", f"{m.group(1)} v{m.group(2)} names parent {pm.group(1)} v{pm.group(2)}, which does not exist")
        if int(m.group(2)) > 1 and not pm:
            R.err("substrate/conditions.md", f"{m.group(1)} v{m.group(2)} is a revision but names no Parent (Law of Versioning)")

    # ---------------- Chronology & Clocks ----------------
    chrono_text = read(root / "fabula/chronology.md") or ""
    chrono = {}
    chapter_lines = []
    for arch in sorted((root / "checkpoints/archive").glob("chronology-part-*.md")):
        chapter_lines += h2_block(read(arch) or "", "Chapters")
    chapter_lines += h2_block(chrono_text, "Chapters")
    for ln in chapter_lines:
        cm = re.match(r"^\s*-\s+ch-(\d+)\s*·(.*)$", ln)
        if not cm:
            continue
        n, rest = int(cm.group(1)), cm.group(2)
        fm = re.search(r"Fabula:\s*D(-?\d+)[^.·]*?\.\.\s*D(-?\d+)", rest)
        om = re.search(r"Order:\s*(Linear|Analepsis|Prolepsis)", rest)
        chrono[n] = {
            "start": int(fm.group(1)) if fm else None,
            "end": int(fm.group(2)) if fm else None,
            "order": om.group(1) if om else None,
            "hazard": "Hazard:" in rest,
        }
    clocks = set(re.findall(r"^### (CLK-\d+)", chrono_text, re.M))

    # ---------------- Knowledge ----------------
    know_text = read(root / "fabula/knowledge.md") or ""
    facts = set(re.findall(r"^\s*-\s+(K-\d+)\s*·", "\n".join(h2_block(know_text, "Facts")), re.M))
    for ln in h2_block(know_text, "Matrix"):
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) < 5 or not cells[0].startswith("K-"):
            continue
        if cells[0] not in facts:
            R.err("fabula/knowledge.md", f"Matrix row cites {cells[0]}, which is not a declared Fact")
        if cells[1] not in cast:
            R.err("fabula/knowledge.md", f"Matrix row for {cells[0]} cites {cells[1]}, which is not in the Cast Register")
        if cells[2] not in KNOW_STATUS:
            R.err("fabula/knowledge.md", f"Matrix row {cells[0]}/{cells[1]} has Status '{cells[2]}'")

    # ---------------- Relations ----------------
    for a, b in re.findall(r"^## (AGT-\d+)\s*[×x]\s*(AGT-\d+)", read(root / "fabula/relations.md") or "", re.M):
        for x in (a, b):
            if x not in cast:
                R.err("fabula/relations.md", f"profile {a} × {b} cites {x}, which is not in the Cast Register")

    # ---------------- Chapters vs Ledgers ----------------
    for n in sorted(chapters):
        if n not in ledgers:
            if n == max(chapters):
                R.warn(f"chapters/{chapters[n].name}", "not yet archived (no Ledger). Run Chapter Close before drafting the next chapter")
            else:
                R.err(f"chapters/{chapters[n].name}", "has no Ledger, and a later chapter exists")
    for n in sorted(ledgers):
        if n not in chapters:
            R.err(f"ledger/{ledgers[n][0].name}", "has no chapter file")

    # ---------------- Each Ledger ----------------
    prev_linear_end = None
    for n in archived:
        path, idx = ledgers[n]
        where = f"ledger/{path.name}"
        if chn(idx.get("Chapter", "")) != n:
            R.err(where, f"Index Chapter '{idx.get('Chapter', '')}' does not match the file name")
        for req in ("Length", "Fabula", "Order", "On Stage"):
            if not idx.get(req):
                R.err(where, f"Index lacks '{req}'")
        for fld in ("On Stage", "State Logged"):
            for aid in id_list(idx.get(fld)):
                if aid not in cast:
                    R.err(where, f"{fld} cites {aid}, which is not in the Cast Register")
        foc = idx.get("Focalizer", "").strip()
        if foc and foc.lower() not in {"none", "narrator"} and re.match(r"AGT-\d+", foc) and foc not in cast:
            R.err(where, f"Focalizer {foc} is not in the Cast Register")
        for aid in id_list(idx.get("State Logged")):
            if aid in cast and n not in cast[aid]["logs"]:
                R.err(where, f"{aid}'s state changed here, but the Cast Register has no State Log line for {chs(n)}")
        # Obligations, forward
        for oid in id_list(idx.get("Obligations Opened")):
            f = obls.get(oid)
            if f is None:
                R.err(where, f"opens {oid}, which is not in the Obligation Ledger")
            elif chn(f.get("Opened", "")) != n:
                R.err(where, f"opens {oid}, but the Obligation Ledger records Opened '{f.get('Opened', '')}'")
        for kind in ("Paid", "Converted", "Released"):
            for oid in id_list(idx.get(f"Obligations {kind}")):
                f = obls.get(oid)
                if f is None:
                    R.err(where, f"lists {oid} as {kind}, but it is not in the Obligation Ledger")
                    continue
                st, sch = parse_status(f.get("Status"))
                if st != kind or sch != n:
                    R.err(where, f"lists {oid} as {kind} here, but the Obligation Ledger records Status '{f.get('Status', '')}'")
        # Exposition
        for d in id_list(idx.get("Exposition Spent")):
            if d not in dx:
                R.err(where, f"spends {d}, which is not in the Exposition Ledger")
            else:
                first_spent.setdefault(d, n)
        # Instances and Setting Queries
        for nid in id_list(idx.get("Instances Added")):
            if nid not in instances:
                R.err(where, f"adds Instance {nid}, which is not in substrate/setting.md")
            elif chn(instances[nid].get("First", "")) != n:
                R.err(where, f"adds Instance {nid}, but setting.md records First '{instances[nid].get('First', '')}'")
        for q in id_list(idx.get("Setting Queries")):
            if q not in queries:
                R.err(where, f"raises {q}, which is not in substrate/setting.md")
            elif chn(queries[q].get("Raised", "")) != n:
                R.err(where, f"raises {q}, but setting.md records Raised '{queries[q].get('Raised', '')}'")
        # Clocks
        for c in re.findall(r"CLK-\d+", idx.get("Clocks", "")):
            if c not in clocks:
                R.err(where, f"ticks {c}, which is not declared in fabula/chronology.md")
        # Chronology
        c = chrono.get(n)
        if c is None:
            R.err(where, "has no line in fabula/chronology.md")
        else:
            lm = re.search(r"D(-?\d+)[^.·]*?\.\.\s*D(-?\d+)", idx.get("Fabula", ""))
            if lm and c["start"] is not None and (int(lm.group(1)), int(lm.group(2))) != (c["start"], c["end"]):
                R.err(where, f"Fabula '{idx.get('Fabula')}' disagrees with chronology D{c['start']}..D{c['end']}")
            if c["order"] is None:
                R.err("fabula/chronology.md", f"{chs(n)} has no Order")
            elif idx.get("Order", "").strip() and idx.get("Order", "").strip() != c["order"]:
                R.err(where, f"Order '{idx.get('Order')}' disagrees with chronology '{c['order']}'")
            if c["start"] is None:
                R.err("fabula/chronology.md", f"{chs(n)} has no parseable Fabula interval (expected 'Fabula: D12..D13')")
            elif c["order"] == "Linear":
                if c["end"] < c["start"]:
                    R.err("fabula/chronology.md", f"{chs(n)} ends before it begins")
                if prev_linear_end is not None:
                    if c["start"] < prev_linear_end:
                        R.err("fabula/chronology.md", f"{chs(n)} begins at D{c['start']}, before the previous Linear chapter ended (D{prev_linear_end}); declare Analepsis or correct it")
                    elif c["start"] - prev_linear_end >= offstage_threshold and not c["hazard"]:
                        R.warn("fabula/chronology.md", f"{chs(n)}: offstage interval D{prev_linear_end}..D{c['start']} carries no Hazard note")
                prev_linear_end = c["end"]
        # Length
        if n in chapters:
            text = read(chapters[n])
            length = count_length(text, unit)
            if band and not (band[0] <= length <= band[1]):
                R.warn(f"chapters/{chapters[n].name}", f"{length} {unit}, outside the Length Band {band[0]}-{band[1]} (justify in the Chapter Return)")
            lm = re.match(r"\s*([\d,]+)", idx.get("Length", ""))
            if lm:
                stated = int(lm.group(1).replace(",", ""))
                if length and abs(stated - length) / max(length, 1) > 0.05:
                    R.warn(where, f"Length {stated} differs from the counted {length} {unit}")

    # First disclosure concordance
    for d, f in dx.items():
        fd = f.get("First Disclosed", "")
        n = first_spent.get(d)
        if n is None:
            if chn(fd) is not None and chn(fd) in ledgers:
                R.err(f"discourse/exposition.md {d}", f"First Disclosed {fd}, but no Ledger spends it")
        elif chn(fd) != n:
            R.err(f"discourse/exposition.md {d}", f"first spent in {chs(n)}, but First Disclosed reads '{fd}'")

    # ---------------- Stale Register ----------------
    stale_text = read(root / "discourse/stale.md") or ""
    barred = re.findall(r'^\s*-\s+"([^"]+)"', "\n".join(h2_block(stale_text, "Barred")), re.M)
    limited = re.findall(r'^\s*-\s+"([^"]+)"\s*·\s*(\d+)\s+per\s+Part', "\n".join(h2_block(stale_text, "Limited")), re.M)
    per_part = defaultdict(lambda: defaultdict(int))
    for n, p in chapters.items():
        low = (read(p) or "").lower()
        for ph in barred:
            if ph.lower() in low:
                R.err(f"chapters/{p.name}", f'contains Barred phrase "{ph}"')
        for ph, _ in limited:
            per_part[part_of(n)][ph] += low.count(ph.lower())
    for part, counts in per_part.items():
        for ph, lim in limited:
            if counts[ph] > int(lim):
                label = f"Part {part}" if part else "chapters outside any declared Part"
                R.warn("discourse/stale.md", f'"{ph}" appears {counts[ph]} times in {label} (limit {lim})')

    # ---------------- Parts, Margin ----------------
    if parts:
        for n in chapters:
            if part_of(n) is None:
                R.warn(f"chapters/{chapters[n].name}", "lies outside every Part declared in the Manifest")
    margin = read(root / "ledger/_margin.md") or ""
    margin_items = [ln for ln in margin.splitlines() if ln.strip() and not ln.startswith("#") and not ln.strip().startswith("<!--")]
    if margin_items and chapters and max(chapters) in ledgers:
        R.warn("ledger/_margin.md", f"{len(margin_items)} item(s) remain after the last Chapter Close; consume and clear the Margin")

    R.note(f"{len(chapters)} chapter file(s), {len(ledgers)} Ledger(s), {len(cast)} Agent(s), {len(obls)} Obligation(s), {len(dx)} Delta concept(s)")
    open_obls = sorted(o for o, f in obls.items() if f.get("Status", "").strip() == "Open")
    R.note(f"Open Obligations: {', '.join(open_obls) if open_obls else 'none'}")

    if args.json:
        print(json.dumps({"root": str(root), "errors": R.errors, "warnings": R.warnings, "notes": R.notes}, indent=2))
    else:
        print(f"Record audit: {root}")
        for n in R.notes:
            print(f"  · {n}")
        print(f"\nErrors ({len(R.errors)})")
        for e in R.errors:
            print(f"  ✗ {e}")
        print(f"\nWarnings ({len(R.warnings)})")
        for w in R.warnings:
            print(f"  ! {w}")
        print("\nClean: the Record agrees with itself." if not R.errors else "\nConcordance broken: fix the errors before the next chapter.")
    return 1 if R.errors else 0


if __name__ == "__main__":
    sys.exit(main())
