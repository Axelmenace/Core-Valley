#!/usr/bin/env python3
"""Conceit Graph checker for Axel's Worldbuilding Framework, Revision 05.

Reads a Conceit Graph recorded as JSON (schema in references/03-conceit-graph.md,
template in assets/conceit-graph.template.json) and runs every check the
framework calls mechanical. Standard library only.

  python conceit_graph.py check  graph.json            full report
  python conceit_graph.py check  graph.json --json     findings and metrics as JSON
  python conceit_graph.py check  graph.json --strict   exit 1 if any VIOLATION
  python conceit_graph.py strike graph.json S4         what loses its license if S4 is struck
  python conceit_graph.py order  graph.json            definitional order for a codex
  python conceit_graph.py seal   graph.json            SHA-256 seal for a Completion Certificate
  python conceit_graph.py dot    graph.json            Graphviz source on stdout

Finding levels: VIOLATION breaks a framework rule; GAP is a finding for the
analysis; NOTE is information the analyst should look at.
Exit codes: 0 report produced; 1 violations under --strict; 2 unreadable input.
"""

import argparse
import hashlib
import json
import signal
import sys
from collections import defaultdict

TIER_RANK = {"SYS": 0, "LORE": 1, "NAR": 2}
FORCES = ("strict", "default", "tendency")
DEFAULT_FIELDS = ("Metaphysics", "Physics", "Biology", "Ecology", "Mind",
                  "Culture", "Technology", "Economy", "Polity")
CAPACITIES = ("high", "medium", "low")
ROLES = (None, "axiom", "substrate")
STATUSES = ("committed", "witness", "illustration")
LICENSE_MODES = ("determined", "elected")
MODAL_VERDICTS = ("admitted", "distributed", "prohibited")
ACTUAL_VERDICTS = ("determined", "elected", "open")
WITNESS_CLASSES = ("standard", "boundary", "extremal", "optimizer", "long-run", "magnitude")
CONFLICT_TYPES = ("L", "S", "P", "Q")
LEDGER_STATUSES = ("open", "closed", "debt", "accepted")
SEVERITIES = ("P1", "P2", "P3")
POLARITIES = ("balancing", "reinforcing")
CLAIM_POLARITY = {"stability": "balancing", "growth": "reinforcing", "recurrence": None}
LIST_KEYS = ("fields", "domains", "channels", "conceits", "licenses", "generations",
             "relations", "loops", "dynamics", "questions", "taxonomies", "terms",
             "primitives", "codex_order", "seed", "witnesses", "ledger")
ID_KEYS = ("domains", "conceits", "generations", "relations", "loops", "questions",
           "taxonomies", "witnesses", "ledger")
CYCLE_LENGTH_CAP = 6
CYCLE_COUNT_CAP = 40


# ---------------------------------------------------------------- loading

def load(path):
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"conceit_graph: cannot read {path}: {exc}", file=sys.stderr)
        sys.exit(2)
    if not isinstance(data, dict):
        print(f"conceit_graph: {path} must hold one JSON object", file=sys.stderr)
        sys.exit(2)
    for key in LIST_KEYS:
        value = data.get(key)
        if value is None:
            data[key] = []
        elif not isinstance(value, list):
            data[key] = [value]
    data.setdefault("sweep", {})
    for lic in data["licenses"]:
        if isinstance(lic.get("from"), str):
            lic["from"] = [lic["from"]]
        lic.setdefault("from", [])
        lic.setdefault("substrate", [])
        lic.setdefault("mode", "determined")
    for gen in data["generations"]:
        gen.setdefault("senders", [])
    for wit in data["witnesses"]:
        wit.setdefault("exercises", [])
        wit.setdefault("edges", [])
        wit.setdefault("class", "standard")
    for conceit in data["conceits"]:
        conceit.setdefault("status", "committed")
        conceit.setdefault("stance", "authorial")
        conceit.setdefault("role", None)
    return data


def seal(data):
    canonical = json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


class Graph:
    """Indexed view of a loaded graph. Unknown references are tolerated here and
    reported by check_references, so every later check can assume lookups may fail."""

    def __init__(self, data):
        self.data = data
        self.conceits = {c.get("id"): c for c in data["conceits"] if c.get("id")}
        self.domains = {d.get("id"): d for d in data["domains"] if d.get("id")}
        self.generations = {g.get("id"): g for g in data["generations"] if g.get("id")}
        self.relations = {r.get("id"): r for r in data["relations"] if r.get("id")}
        self.loops = {f.get("id"): f for f in data["loops"] if f.get("id")}
        self.ledger = {e.get("id"): e for e in data["ledger"] if e.get("id")}
        self.fields = set(DEFAULT_FIELDS) | set(data["fields"])

    def tier(self, cid):
        return self.conceits.get(cid, {}).get("tier")

    def is_lens(self, cid):
        return str(self.conceits.get(cid, {}).get("stance", "authorial")).startswith("lens")

    def committed_sys(self):
        return [cid for cid, c in self.conceits.items()
                if c.get("tier") == "SYS" and c.get("status") == "committed"
                and not self.is_lens(cid)]

    def domain_of(self, cid):
        return self.conceits.get(cid, {}).get("domain")

    def links(self):
        """Every construction link as (source, target, kind). Annotations are not links."""
        out = []
        for lic in self.data["licenses"]:
            for src in lic["from"]:
                out.append((src, lic.get("to"), "license"))
            for sub in lic["substrate"]:
                out.append((sub, lic.get("to"), "substrate"))
        for gen in self.data["generations"]:
            for snd in gen["senders"]:
                out.append((snd, gen.get("receiver"), "generation"))
            if gen.get("covered_by"):
                out.append((gen["covered_by"], gen.get("receiver"), "coverage"))
        return [(a, b, k) for a, b, k in out if a in self.conceits and b in self.conceits]

    def persistent_channels(self):
        return {(ch.get("from"), ch.get("to")) for ch in self.data["channels"]
                if ch.get("persistent", True)}

    def any_channels(self):
        return {(ch.get("from"), ch.get("to")) for ch in self.data["channels"]}


class Report:
    def __init__(self):
        self.findings = []
        self.metrics = {}

    def add(self, level, check, message, ids=()):
        self.findings.append({"level": level, "check": check, "ids": list(ids), "message": message})

    def count(self, level):
        return sum(1 for f in self.findings if f["level"] == level)


# ---------------------------------------------------------------- support

def support(g, struck=frozenset()):
    """Fixed point of licensure. A Conceit is supported when it is a Stipulated root
    (role axiom or substrate), or when some license has every source and substrate
    supported, or when some Generation Edge has every sender and its covering
    System supported. License records are conjunctive; several records for one
    target are alternatives."""
    sup = {cid for cid, c in g.conceits.items()
           if cid not in struck and c.get("role") in ("axiom", "substrate")}
    changed = True
    while changed:
        changed = False
        for lic in g.data["licenses"]:
            tgt = lic.get("to")
            if tgt in sup or tgt in struck or tgt not in g.conceits:
                continue
            needs = lic["from"] + lic["substrate"]
            if needs and all(n in sup for n in needs):
                sup.add(tgt)
                changed = True
        for gen in g.data["generations"]:
            tgt = gen.get("receiver")
            if tgt in sup or tgt in struck or tgt not in g.conceits:
                continue
            needs = list(gen["senders"]) + ([gen["covered_by"]] if gen.get("covered_by") else [])
            if needs and all(n in sup for n in needs):
                sup.add(tgt)
                changed = True
    return sup


def downstream(g, start):
    adj = defaultdict(set)
    for a, b, _ in g.links():
        adj[a].add(b)
    seen, stack = set(), [start]
    while stack:
        node = stack.pop()
        for nxt in adj[node]:
            if nxt not in seen and nxt != start:
                seen.add(nxt)
                stack.append(nxt)
    return seen


def components(nodes, edges):
    parent = {n: n for n in nodes}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b in edges:
        if a in parent and b in parent:
            ra, rb = find(a), find(b)
            if ra != rb:
                parent[ra] = rb
    groups = defaultdict(list)
    for n in nodes:
        groups[find(n)].append(n)
    return sorted((sorted(v) for v in groups.values()), key=lambda c: (-len(c), c))


def directed_cycles(adj, cap_len=CYCLE_LENGTH_CAP, cap_count=CYCLE_COUNT_CAP):
    """Simple cycles, each reported once from its smallest node."""
    nodes = sorted(adj)
    found = []
    for start in nodes:
        stack = [(start, [start])]
        while stack and len(found) < cap_count:
            node, path = stack.pop()
            for nxt in sorted(adj.get(node, ())):
                if nxt == start and len(path) >= 2:
                    found.append(path[:])
                elif nxt > start and nxt not in path and len(path) < cap_len:
                    stack.append((nxt, path + [nxt]))
    return found


def has_cycle(adj):
    state = {}
    for root in adj:
        if state.get(root):
            continue
        stack = [(root, iter(adj.get(root, ())))]
        state[root] = 1
        while stack:
            node, it = stack[-1]
            nxt = next(it, None)
            if nxt is None:
                state[node] = 2
                stack.pop()
            elif state.get(nxt) == 1:
                return True
            elif not state.get(nxt):
                state[nxt] = 1
                stack.append((nxt, iter(adj.get(nxt, ()))))
    return False


# ---------------------------------------------------------------- checks

def check_identity(g, r):
    seen = defaultdict(list)
    for key in ID_KEYS:
        for item in g.data[key]:
            if not item.get("id"):
                r.add("VIOLATION", "identity", f"an entry in '{key}' has no id")
                continue
            seen[item["id"]].append(key)
    for ident, keys in seen.items():
        if len(keys) > 1:
            r.add("VIOLATION", "identity", f"id used {len(keys)} times ({', '.join(keys)})", [ident])


def check_references(g, r):
    def need(ident, pool, where):
        if ident is not None and ident not in pool:
            r.add("VIOLATION", "reference", f"{where} names unknown '{ident}'", [ident])

    for c in g.data["conceits"]:
        need(c.get("domain"), g.domains, f"Conceit {c.get('id')} domain")
    for d in g.data["domains"]:
        need(d.get("parent"), g.domains, f"Domain {d.get('id')} parent")
    for ch in g.data["channels"]:
        need(ch.get("from"), g.domains, "channel from")
        need(ch.get("to"), g.domains, "channel to")
    for i, lic in enumerate(g.data["licenses"]):
        tag = f"license #{i + 1} (to {lic.get('to')})"
        need(lic.get("to"), g.conceits, tag)
        for s in lic["from"] + lic["substrate"]:
            need(s, g.conceits, tag)
    for gen in g.data["generations"]:
        tag = f"Generation Edge {gen.get('id')}"
        need(gen.get("receiver"), g.conceits, tag)
        need(gen.get("covered_by"), g.conceits, tag)
        need(gen.get("relation"), g.relations, tag)
        for s in gen["senders"]:
            need(s, g.conceits, tag)
    for rel in g.data["relations"]:
        need(rel.get("emergence"), g.generations, f"Relation {rel.get('id')}")
        for p in rel.get("participants", []):
            need(p, g.conceits, f"Relation {rel.get('id')}")
    for loop in g.data["loops"]:
        need(loop.get("limiter"), g.conceits, f"Loop {loop.get('id')}")
        for d in loop.get("domains", []):
            need(d, g.domains, f"Loop {loop.get('id')}")
    for claim in g.data["dynamics"]:
        need(claim.get("conceit"), g.conceits, "dynamics claim")
        need(claim.get("supported_by"), g.loops, f"dynamics claim on {claim.get('conceit')}")
        need(claim.get("forced_by"), g.conceits, f"dynamics claim on {claim.get('conceit')}")
    for q in g.data["questions"]:
        for b in q.get("by", []):
            need(b, g.conceits, f"Question {q.get('id')}")
    for t in g.data["terms"]:
        need(t.get("defined_in"), g.conceits, f"term '{t.get('term')}'")
    for w in g.data["witnesses"]:
        for e in w["exercises"]:
            need(e, g.conceits, f"Witness {w.get('id')}")
        for e in w["edges"]:
            need(e, g.generations, f"Witness {w.get('id')}")
        need(w.get("ledger"), g.ledger, f"Witness {w.get('id')}")
    for s in g.data["seed"]:
        need(s, g.conceits, "seed")
    for s in g.data["codex_order"]:
        need(s, g.conceits, "codex_order")


def check_conceits(g, r):
    for cid, c in g.conceits.items():
        tier = c.get("tier")
        if tier not in TIER_RANK:
            r.add("VIOLATION", "tier", f"tier '{tier}' is not SYS, LORE or NAR", [cid])
            continue
        if not c.get("domain"):
            r.add("GAP", "coordinates", "no Domain recorded: every Conceit resides in some Domain of some Field", [cid])
        if c.get("status") not in STATUSES:
            r.add("VIOLATION", "status", f"status '{c.get('status')}' unknown", [cid])
        if c.get("role") not in ROLES:
            r.add("VIOLATION", "role", f"role '{c.get('role')}' unknown (axiom, substrate or null)", [cid])
        stance = str(c.get("stance"))
        if stance != "authorial" and not stance.startswith("lens:"):
            r.add("VIOLATION", "stance", f"stance '{stance}' must be 'authorial' or 'lens:<holder>'", [cid])
        if tier == "SYS" and not g.is_lens(cid):
            force = c.get("force")
            if force not in FORCES:
                r.add("GAP", "axiom-force", "System without a force (strict, default or tendency): conflicts on it cannot be typed", [cid])
            if force == "tendency":
                missing = [k for k in ("norm", "deviation", "movers") if not c.get(k)]
                if missing:
                    r.add("GAP", "tendency-rule", f"Tendency Rule lacks {', '.join(missing)}", [cid])
            if c.get("kind") == "policy" and not c.get("table"):
                r.add("GAP", "discretion-point", "policy (decision function) without a Discretion Table: the will decides at the moment of need", [cid])
        if c.get("role") == "axiom" and tier != "SYS":
            r.add("NOTE", "root-role", f"{tier} Conceit marked axiom: a nomic statement belongs at SYS; a stipulated fact is role 'substrate'", [cid])


def check_domains(g, r):
    for did, d in g.domains.items():
        if d.get("field") not in g.fields:
            r.add("NOTE", "field", f"Field '{d.get('field')}' is outside the profile; declare it under 'fields'", [did])
        seen, cur = set(), did
        while cur and cur in g.domains:
            if cur in seen:
                r.add("VIOLATION", "domain-nesting", "Domain parent chain is circular", [did])
                break
            seen.add(cur)
            cur = g.domains[cur].get("parent")
    pairs = defaultdict(int)
    for ch in g.data["channels"]:
        a, b = ch.get("from"), ch.get("to")
        pairs[(a, b)] += 1
        if a == b:
            r.add("VIOLATION", "channel", "a Channel joins a Domain to itself; intra-Domain exchange is not adjacency", [a])
        if ch.get("capacity", "medium") not in CAPACITIES:
            r.add("VIOLATION", "channel", f"capacity '{ch.get('capacity')}' must be high, medium or low", [a, b])
    for (a, b), n in pairs.items():
        if n > 1:
            r.add("NOTE", "channel", f"{n} Channels recorded {a} -> {b}; one Channel per direction", [a, b])


def check_licenses(g, r):
    for lic in g.data["licenses"]:
        tgt = lic.get("to")
        if tgt not in g.conceits:
            continue
        srcs = [s for s in lic["from"] if s in g.conceits]
        if not lic["from"]:
            r.add("VIOLATION", "license", "license with no source", [tgt])
            continue
        if lic.get("mode") not in LICENSE_MODES:
            r.add("VIOLATION", "license", f"mode '{lic.get('mode')}' must be determined or elected", [tgt])
        t_rank = TIER_RANK.get(g.tier(tgt))
        ranks = [TIER_RANK.get(g.tier(s)) for s in srcs]
        if t_rank is None or None in ranks:
            continue
        upward = [s for s, k in zip(srcs, ranks) if k > t_rank]
        if upward:
            r.add("VIOLATION", "direction", "license runs upward; licenses run downward, and an Inference is recorded as the downward license it abduces", upward + [tgt])
        tt = g.tier(tgt)
        src_tiers = {g.tier(s) for s in srcs}
        if tt == "NAR" and "SYS" in src_tiers and "LORE" not in src_tiers:
            r.add("GAP", "tier-skip", "System licenses Narrative directly, bypassing Lore", srcs + [tgt])
        if tt == "LORE" and src_tiers == {"LORE"} and not g.is_lens(tgt):
            r.add("GAP", "peer-license", "Lore licensed by Lore alone: move the Lore inputs to substrate and name the governing System", srcs + [tgt])
        if tt == "NAR" and src_tiers == {"NAR"}:
            r.add("GAP", "peer-license", "Narrative licensed by Narrative alone: resolve as substrate change, emergence, or diegesis", srcs + [tgt])
        if tt == "SYS" and g.conceits[tgt].get("role") == "axiom" and src_tiers == {"SYS"}:
            r.add("NOTE", "independence", "axiom is licensed by other Systems: a theorem filed as an axiom; set role null or drop the license", srcs + [tgt])
        lens_srcs = [s for s in srcs + [x for x in lic["substrate"] if x in g.conceits] if g.is_lens(s)]
        if lens_srcs and not g.is_lens(tgt):
            r.add("GAP", "stance-leak", "Lens content licenses an Authorial Conceit; license from the Authorial Conceit that records the belief", lens_srcs + [tgt])


def check_generations(g, r):
    rel_sets = [set(rel.get("participants", [])) for rel in g.data["relations"]
                if rel.get("standing", "persistent") == "persistent"]
    adj = defaultdict(set)
    receivers = defaultdict(list)
    for gen in g.data["generations"]:
        gid, rec, snd = gen.get("id"), gen.get("receiver"), gen["senders"]
        receivers[rec].append(gid)
        if len(set(snd)) < 2:
            r.add("VIOLATION", "arity", "Generation Edge with fewer than two senders: decompose it through an intermediate Conceit", [gid])
        cov = gen.get("covered_by")
        if not cov:
            r.add("VIOLATION", "coverage", "Generation Edge with no covering System: evidence of a missing axiom", [gid])
        elif cov in g.conceits and (g.tier(cov) != "SYS" or g.is_lens(cov)):
            r.add("VIOLATION", "coverage", f"covering Conceit {cov} is not an Authorial System", [gid, cov])
        if rec in snd:
            r.add("VIOLATION", "self-generation", "receiver among its own senders; commit the prior state as a distinct Node", [gid, rec])
        aggregates = [s for s in snd if g.conceits.get(s, {}).get("kind") == "realized_state"]
        if aggregates:
            r.add("VIOLATION", "grain", "a Realized State is a sender; Realized States are measurements, never relata", [gid] + aggregates)
        rel = g.relations.get(gen.get("relation"))
        if rel is not None:
            if not set(snd) <= set(rel.get("participants", [])):
                r.add("VIOLATION", "persistence-gate", f"senders are not all participants of {rel.get('id')}", [gid])
        elif not any(set(snd) <= s for s in rel_sets):
            r.add("GAP", "persistence-gate", "no recorded Persistent Relation contains these senders: the gate the Edge passed is unrecorded", [gid])
        for s in snd:
            adj[s].add(rec)
    if has_cycle(adj):
        cyc = directed_cycles(adj)
        r.add("VIOLATION", "genesis-cycle", "Generation Edges form a cycle: a system is among its own ancestors", cyc[0] if cyc else [])
    for rec, gids in receivers.items():
        if len(gids) > 1:
            r.add("NOTE", "convergent-genesis", f"{rec} receives {len(gids)} Generation Edges; legitimate, but each must be covered", [rec] + gids)
    licensed = {lic.get("to") for lic in g.data["licenses"]}
    for rec in receivers:
        if rec in licensed:
            r.add("NOTE", "dual-genesis", "Conceit is both licensed (designed) and generated (emergent); confirm both are meant", [rec])


def check_relations(g, r):
    pchan = g.persistent_channels()
    anychan = g.any_channels()
    crossing = set()
    for rel in g.data["relations"]:
        rid = rel.get("id")
        parts = [p for p in rel.get("participants", []) if p in g.conceits]
        standing = rel.get("standing", "persistent")
        if len(set(rel.get("participants", []))) < 2:
            r.add("VIOLATION", "relation", "a relation needs at least two participants", [rid])
        if standing == "temporary":
            r.add("NOTE", "persistence-gate", "temporary Interaction is diegesis and stays off the record; delete or promote to persistent", [rid])
            continue
        if standing != "persistent":
            r.add("VIOLATION", "relation", f"standing '{standing}' must be persistent or temporary", [rid])
        if not rel.get("emergence") and not rel.get("justification"):
            r.add("GAP", "interaction-principle", "Persistent Relation with no Generation Edge and no stated reason why none issues", [rid])
        aggregates = [p for p in parts if g.conceits[p].get("kind") == "realized_state"]
        if aggregates:
            r.add("VIOLATION", "grain", "a Realized State is a relatum; Realized States are measurements, never relata", [rid] + aggregates)
        for i, a in enumerate(parts):
            for b in parts[i + 1:]:
                da, db = g.domain_of(a), g.domain_of(b)
                if not da or not db or da == db:
                    continue
                if (da, db) not in anychan and (db, da) not in anychan:
                    r.add("VIOLATION", "adjacency", f"{a} and {b} interact across non-adjacent Domains {da} and {db}", [rid, da, db])
                    continue
                crossing.add(frozenset((da, db)))
                if (da, db) not in pchan and (db, da) not in pchan:
                    r.add("NOTE", "biconditional", f"persistent relation crosses {da}/{db}, but the Channel is recorded as temporary", [rid, da, db])
    for a, b in pchan:
        if a != b and frozenset((a, b)) not in crossing:
            r.add("NOTE", "biconditional", f"persistent Channel {a} -> {b} has no recorded constituent-level Persistent Relation across it", [a, b])


def check_domain_coherence(g, r):
    members = defaultdict(set)
    edges = defaultdict(list)
    for rel in g.data["relations"]:
        if rel.get("standing", "persistent") != "persistent":
            continue
        parts = [p for p in rel.get("participants", []) if p in g.conceits]
        for p in parts:
            members[g.domain_of(p)].add(p)
        for i, a in enumerate(parts):
            for b in parts[i + 1:]:
                if g.domain_of(a) == g.domain_of(b):
                    edges[g.domain_of(a)].append((a, b))
    for did, nodes in members.items():
        if did is None or len(nodes) < 2:
            continue
        comps = components(nodes, edges[did])
        if len(comps) > 1:
            r.add("GAP", "domain-coherence", f"Domain {did} splits into {len(comps)} components of persistent interaction: it is {len(comps)} Domains, or a relation is unrecorded", [did] + [c[0] for c in comps])


def check_grounding(g, r):
    incoming = defaultdict(int)
    degree = defaultdict(int)
    for a, b, _ in g.links():
        incoming[b] += 1
        degree[a] += 1
        degree[b] += 1
    roots = [cid for cid in g.conceits if incoming[cid] == 0]
    axioms = [c for c in roots if g.conceits[c].get("role") == "axiom"]
    subs = [c for c in roots if g.conceits[c].get("role") == "substrate"]
    ungrounded_roots = [c for c in roots if g.conceits[c].get("role") is None]
    for cid in ungrounded_roots:
        r.add("GAP", "ungrounded-root", f"{g.tier(cid)} Conceit with no genesis that is not Stipulated: surface its System, or stipulate it as axiom or substrate", [cid])
    sup = support(g)
    chained = [c for c in g.conceits if c not in sup and incoming[c] > 0]
    if chained:
        r.add("GAP", "ungrounded-chain", "Conceits whose every genesis rests on an ungrounded root or a support cycle", sorted(chained))
    orphans = [c for c in g.conceits if degree[c] == 0]
    for cid in orphans:
        r.add("GAP", "orphan", "degree zero over licenses and Generation Edges (annotations confer no degree)", [cid])
    comps = components(list(g.conceits), [(a, b) for a, b, _ in g.links()])
    systemless = [c for c in comps if len(c) > 1 and not any(g.tier(x) == "SYS" for x in c)]
    for comp in systemless:
        r.add("GAP", "lore-system-inversion", "a connected component with no System in it: Lore and Narrative without structure", comp)
    committed_nonroot = [c for c in g.conceits if incoming[c] > 0 and g.conceits[c].get("status") == "committed"]
    grounded = [c for c in committed_nonroot if c in sup]
    r.metrics["roots"] = {"axioms": len(axioms), "substrate": len(subs), "ungrounded": len(ungrounded_roots)}
    r.metrics["grounding"] = round(len(grounded) / len(committed_nonroot), 3) if committed_nonroot else None
    r.metrics["components"] = len(comps)
    r.metrics["orphans"] = orphans
    return sup


def check_economy(g, r, sup):
    axioms = [c for c, v in g.conceits.items() if v.get("role") == "axiom" and v.get("tier") == "SYS"]
    loads = {}
    for ax in axioms:
        down = downstream(g, ax)
        lost = sup - support(g, struck=frozenset([ax])) - {ax}
        loads[ax] = {"downstream": len(down), "critical": len(lost)}
        if not down and ax not in r.metrics.get("orphans", []):
            r.add("NOTE", "inert-axiom", "axiom licenses and covers nothing", [ax])
    licensed = [c for c in sup if g.conceits[c].get("role") is None
                and g.conceits[c].get("status") == "committed" and not g.is_lens(c)]
    r.metrics["generative_ratio"] = round(len(licensed) / len(axioms), 2) if axioms else None
    r.metrics["axiom_load"] = dict(sorted(loads.items(), key=lambda kv: (-kv[1]["critical"], -kv[1]["downstream"], kv[0])))
    det = elected = emergent = 0
    modes = defaultdict(set)
    for lic in g.data["licenses"]:
        modes[lic.get("to")].add(lic.get("mode"))
    generated = {gen.get("receiver") for gen in g.data["generations"]}
    for cid, c in g.conceits.items():
        if c.get("tier") != "LORE" or c.get("status") != "committed" or c.get("role") or g.is_lens(cid):
            continue
        if "determined" in modes[cid]:
            det += 1
        elif "elected" in modes[cid]:
            elected += 1
        elif cid in generated:
            emergent += 1
    r.metrics["lore_genesis"] = {"determined": det, "elected": elected, "emergent": emergent}
    r.metrics["determination_ratio"] = round(det / (det + elected), 3) if det + elected else None


def check_wholeness(g, r):
    sys_ids = g.committed_sys()
    edges = []
    by_domain = defaultdict(list)
    for s in sys_ids:
        by_domain[g.domain_of(s)].append(s)
    for group in by_domain.values():
        edges += [(group[0], x) for x in group[1:]]
    for lic in g.data["licenses"]:
        group = [s for s in lic["from"] if s in sys_ids]
        if lic.get("to") in sys_ids:
            group.append(lic["to"])
        edges += [(group[0], x) for x in group[1:]] if group else []
    term_users = defaultdict(set)
    for s in sys_ids:
        for t in g.conceits[s].get("terms", []):
            term_users[t].add(s)
    for t in g.data["terms"]:
        if t.get("defined_in") in sys_ids:
            term_users[t.get("term")].add(t["defined_in"])
    for users in term_users.values():
        users = sorted(users)
        edges += [(users[0], x) for x in users[1:]]
    pchan = g.persistent_channels()
    for a in sys_ids:
        for b in sys_ids:
            if (g.domain_of(a), g.domain_of(b)) in pchan:
                edges.append((a, b))
    comps = components(sys_ids, edges)
    r.metrics["systems"] = len(comps)
    if len(comps) > 1:
        r.add("NOTE", "wholeness", f"the System base forms {len(comps)} unconnected Systems: declare them and their Couplings, or record what joins them", [c[0] for c in comps])
    seeds = [s for s in g.data["seed"] if s in g.conceits]
    if seeds:
        seed_comp = set().union(*[set(c) for c in comps if set(c) & set(seeds)])
        remote = [s for s in sys_ids if s not in seed_comp]
        if remote:
            r.add("NOTE", "seed-remote", "Systems with no co-reference path to the Seed", remote)


def check_dynamics(g, r):
    pchan = g.persistent_channels()
    declared = []
    for loop in g.data["loops"]:
        lid, path = loop.get("id"), loop.get("domains", [])
        if len(path) < 2:
            r.add("VIOLATION", "loop", "a loop needs at least two Domains", [lid])
            continue
        for a, b in zip(path, path[1:] + path[:1]):
            if (a, b) not in pchan:
                r.add("VIOLATION", "loop", f"loop step {a} -> {b} has no persistent Channel", [lid])
        pol = loop.get("polarity")
        if pol not in POLARITIES:
            r.add("GAP", "loop-polarity", "loop polarity unrecorded (balancing or reinforcing)", [lid])
        if pol == "reinforcing":
            lim = loop.get("limiter")
            if not lim:
                r.add("GAP", "unbounded-loop", "reinforcing loop with no recorded limiter: the System predicts runaway", [lid])
            elif lim in g.conceits and g.tier(lim) != "SYS":
                r.add("GAP", "unbounded-loop", f"limiter {lim} is not a System", [lid, lim])
        declared.append(frozenset(path))
    adj = defaultdict(set)
    for a, b in pchan:
        adj[a].add(b)
    for cyc in directed_cycles(adj):
        if frozenset(cyc) not in declared:
            r.add("NOTE", "unanalyzed-cycle", "feedback cycle over persistent Channels with no declared loop: polarity unanalyzed", cyc)
    for claim in g.data["dynamics"]:
        cid, kind, by = claim.get("conceit"), claim.get("type"), claim.get("supported_by")
        if kind not in CLAIM_POLARITY:
            r.add("VIOLATION", "dynamics", f"claim type '{kind}' must be stability, recurrence or growth", [cid])
            continue
        forcer = claim.get("forced_by")
        if kind == "recurrence" and forcer:
            if forcer in g.conceits and g.tier(forcer) != "SYS":
                r.add("GAP", "regulation-gap", f"recurrence forced by {forcer}, which is not a System", [cid, forcer])
            continue
        if not by:
            r.add("GAP", "regulation-gap", f"{kind} claim with no loop (or, for recurrence, no forcing System) that produces it", [cid])
            continue
        loop = g.loops.get(by)
        if loop is None:
            continue
        want = CLAIM_POLARITY[kind]
        if want and loop.get("polarity") != want:
            r.add("GAP", "regulation-gap", f"{kind} needs a {want} loop; {by} is {loop.get('polarity')}", [cid, by])
        if kind == "recurrence" and not loop.get("delay"):
            r.add("GAP", "regulation-gap", f"recurrence needs a loop with a recorded delay; {by} has none", [cid, by])
    r.metrics["loops"] = len(g.data["loops"])


def check_closure(g, r):
    modal = actual = failures = 0
    sparsity = []
    qmap = {q.get("id"): q for q in g.data["questions"]}
    for q in g.data["questions"]:
        qid, kind, verdict, by = q.get("id"), q.get("kind", "modal"), q.get("verdict"), q.get("by", [])
        if kind == "modal":
            modal += 1
            if verdict not in MODAL_VERDICTS:
                failures += 1
                r.add("GAP", "closure-failure", f"modal question undecided: {q.get('text', '')}", [qid])
                continue
            if not by:
                r.add("GAP", "closure-warrant", "verdict with no System cited", [qid])
            forces = {g.conceits.get(b, {}).get("force") for b in by}
            if verdict == "distributed" and "tendency" not in forces:
                r.add("NOTE", "closure-warrant", "distributed verdict cites no Tendency Rule", [qid])
            if verdict == "prohibited" and by and "strict" not in forces:
                r.add("NOTE", "closure-warrant", "prohibition rests only on defeasible Systems; a defeater would reopen it", [qid])
        elif kind == "actual":
            actual += 1
            if verdict not in ACTUAL_VERDICTS:
                r.add("VIOLATION", "closure", f"actual question verdict '{verdict}' must be determined, elected or open", [qid])
            elif verdict == "open":
                sparsity.append(qid)
                cover = qmap.get(q.get("modal"))
                if not q.get("modal"):
                    r.add("NOTE", "sparsity-uncovered", "open actual question with no covering modal question: sparsity asserted, not shown", [qid])
                elif cover is None or cover.get("kind", "modal") != "modal":
                    r.add("VIOLATION", "closure", f"covering question '{q.get('modal')}' is not a recorded modal question", [qid])
                elif cover.get("verdict") not in MODAL_VERDICTS:
                    r.add("GAP", "sparsity-uncovered", f"covering modal question {q.get('modal')} is itself undecided: this is a gap, not sparsity", [qid, q.get("modal")])
            elif not by:
                r.add("GAP", "closure-warrant", "realization verdict with no genesis cited", [qid])
        else:
            r.add("VIOLATION", "closure", f"question kind '{kind}' must be modal or actual", [qid])
    for t in g.data["taxonomies"]:
        tid, axes, cells = t.get("id"), t.get("axes", []), t.get("cells", {})
        if not axes or any(len(a) < 2 for a in axes):
            r.add("VIOLATION", "taxonomy", "each axis needs at least two values", [tid])
            continue
        for flag in ("exhaustive", "exclusive"):
            if t.get(flag) is not True:
                r.add("GAP", "partition", f"partition not declared {flag}: state it, or name the residue", [tid])
        combos = [[]]
        for axis in axes:
            combos = [c + [v] for c in combos for v in axis]
        undecided = ["|".join(c) for c in combos if cells.get("|".join(c)) not in MODAL_VERDICTS]
        if undecided:
            failures += len(undecided)
            r.add("GAP", "product-test", f"{len(undecided)} of {len(combos)} cells undecided: {', '.join(undecided)}", [tid])
    r.metrics["closure"] = {"modal": modal, "actual": actual, "failures": failures, "sparsity_register": sparsity}


def term_graph(g):
    defined = {t.get("term"): t for t in g.data["terms"] if t.get("term")}
    deps = {name: set(t.get("uses", [])) for name, t in defined.items()}
    return defined, deps


def check_terms(g, r):
    defined, deps = term_graph(g)
    primitives = set(g.data["primitives"])
    for name, uses in deps.items():
        missing = sorted(u for u in uses if u not in defined and u not in primitives)
        if missing:
            r.add("GAP", "undefined-term", f"'{name}' uses undefined terms: {', '.join(missing)} (define them or declare them primitives)", [defined[name].get("defined_in")])
    adj = {n: {u for u in us if u in defined and u != n} for n, us in deps.items()}
    for cyc in directed_cycles(adj):
        r.add("GAP", "circular-definition", "definitions form a cycle: " + " -> ".join(cyc + cyc[:1]))
    order = [c for c in g.data["codex_order"] if c in g.conceits]
    if order:
        pos = {c: i for i, c in enumerate(order)}
        for name, uses in deps.items():
            here = defined[name].get("defined_in")
            for u in uses:
                there = defined.get(u, {}).get("defined_in")
                if here in pos and there in pos and pos[there] > pos[here]:
                    r.add("GAP", "forward-reference", f"'{name}' ({here}) uses '{u}', which the codex defines later ({there})", [here, there])


def check_verification(g, r):
    sys_ids = set(g.committed_sys())
    exercised = set()
    pairs_done = set()
    edges_done = set()
    for w in g.data["witnesses"]:
        wid = w.get("id")
        if w.get("class") not in WITNESS_CLASSES:
            r.add("VIOLATION", "witness", f"witness class '{w.get('class')}' unknown", [wid])
        if w.get("outcome") not in ("clean", "conflict"):
            r.add("VIOLATION", "witness", "witness outcome must be clean or conflict", [wid])
        if w.get("outcome") == "conflict" and not w.get("ledger"):
            r.add("VIOLATION", "witness", "a conflict outcome must open a Ledger entry", [wid])
        ex = [e for e in w["exercises"] if e in sys_ids]
        exercised |= set(ex)
        pairs_done |= {frozenset((a, b)) for a in ex for b in ex if a < b}
        edges_done |= set(w["edges"])
    open_items, debts, unreasoned = [], [], []
    for e in g.data["ledger"]:
        eid, typ, status = e.get("id"), e.get("type"), e.get("status")
        if typ not in CONFLICT_TYPES:
            r.add("VIOLATION", "ledger", f"type '{typ}' must be L, S, P or Q", [eid])
        if typ == "P" and e.get("severity") not in SEVERITIES:
            r.add("GAP", "ledger", "Type P entry without severity P1, P2 or P3", [eid])
        if status not in LEDGER_STATUSES:
            r.add("VIOLATION", "ledger", f"status '{status}' must be open, closed, debt or accepted", [eid])
        if status == "accepted" and typ != "P":
            r.add("VIOLATION", "ledger", "only Type P may be accepted as-is", [eid])
        if status == "accepted" and typ == "P" and e.get("severity") == "P3":
            r.add("VIOLATION", "ledger", "a P3 strain cannot be accepted as it stands; it needs context or surgery", [eid])
        if status == "accepted" and not e.get("rationale"):
            r.add("GAP", "ledger", "accepted without a written rationale", [eid])
            unreasoned.append(eid)
        if status == "open":
            open_items.append(eid)
        if status == "debt" and not (e.get("debt_accepted") and e.get("rationale")):
            debts.append(eid)

    def resolved(w):
        if w.get("outcome") == "clean":
            return True
        return g.ledger.get(w.get("ledger"), {}).get("status") in ("closed", "accepted")

    by_domain = defaultdict(list)
    for s in sys_ids:
        by_domain[g.domain_of(s)].append(s)
    co_resident = {frozenset((a, b)) for grp in by_domain.values() for a in grp for b in grp if a < b}
    high, every = set(), set()
    for ch in g.data["channels"]:
        if not ch.get("persistent", True):
            continue
        cross = {frozenset((a, b)) for a in by_domain.get(ch.get("from"), []) for b in by_domain.get(ch.get("to"), [])}
        every |= cross
        if ch.get("capacity", "medium") == "high":
            high |= cross
    unexamined = [rel.get("id") for rel in g.data["relations"]
                  if rel.get("standing", "persistent") == "persistent"
                  and not rel.get("emergence") and not rel.get("justification")]
    classes = defaultdict(list)
    for w in g.data["witnesses"]:
        classes[w.get("class")].append(w)
    sweep = g.data["sweep"]
    hard = r.count("VIOLATION")
    fixed = sweep.get("last_new_conflicts") == 0
    fixed_sweeps = sweep.get("fixed_point_sweeps", 1 if fixed else 0)

    blockers = {
        "C0": [f"{hard} framework violations"] if hard else [],
        "C1": ([f"open conflicts: {', '.join(open_items)}"] if open_items else [])
        + ([f"unaccepted debt: {', '.join(debts)}"] if debts else [])
        + ([f"accepted without rationale: {', '.join(unreasoned)}"] if unreasoned else [])
        + ([f"Systems never exercised: {', '.join(sorted(sys_ids - exercised))}"] if sys_ids - exercised else [])
        + ([] if fixed else ["latest sweep not a fixed point (sweep.last_new_conflicts must be 0)"]),
        "C2": [f"co-resident pairs unexercised: {len(co_resident - pairs_done)} of {len(co_resident)}"] if co_resident - pairs_done else [],
        "C3": ([f"high-capacity cross-Domain pairs unexercised: {len(high - pairs_done)} of {len(high)}"] if high - pairs_done else [])
        + ([f"Generation Edges unexercised: {', '.join(sorted(set(g.generations) - edges_done))}"] if set(g.generations) - edges_done else [])
        + ([f"Persistent Relations unexamined: {', '.join(unexamined)}"] if unexamined else [])
        + ([] if any(resolved(w) for w in classes["optimizer"]) else ["no resolved optimizer witness"])
        + ([] if any(resolved(w) for w in classes["long-run"]) else ["no resolved long-run witness"]),
        "C4": ([f"cross-Domain pairs unexercised: {len(every - pairs_done)} of {len(every)}"] if every - pairs_done else [])
        + ([] if any(resolved(w) for w in classes["magnitude"]) else ["no resolved magnitude witness"])
        + ([] if fixed_sweeps >= 2 else ["fewer than two consecutive fixed-point sweeps"]),
    }
    level = None
    for name in ("C0", "C1", "C2", "C3", "C4"):
        if blockers[name]:
            break
        level = name
    nxt = {None: "C0", "C0": "C1", "C1": "C2", "C2": "C3", "C3": "C4", "C4": None}[level]
    r.metrics["coverage"] = {
        "systems_exercised": f"{len(exercised)}/{len(sys_ids)}",
        "co_resident_pairs": f"{len(co_resident & pairs_done)}/{len(co_resident)}",
        "high_capacity_pairs": f"{len(high & pairs_done)}/{len(high)}",
        "generation_edges": f"{len(edges_done & set(g.generations))}/{len(g.generations)}",
    }
    r.metrics["certification"] = {"level": level or "none", "next": nxt,
                                  "blocked_by": blockers.get(nxt, []) if nxt else []}


def run_checks(data):
    g = Graph(data)
    r = Report()
    check_identity(g, r)
    check_references(g, r)
    check_conceits(g, r)
    check_domains(g, r)
    check_licenses(g, r)
    check_generations(g, r)
    check_relations(g, r)
    check_domain_coherence(g, r)
    sup = check_grounding(g, r)
    check_economy(g, r, sup)
    check_wholeness(g, r)
    check_dynamics(g, r)
    check_closure(g, r)
    check_terms(g, r)
    check_verification(g, r)
    tiers = defaultdict(int)
    for c in g.conceits.values():
        tiers[c.get("tier")] += 1
    r.metrics["inventory"] = {
        "conceits": len(g.conceits), "by_tier": dict(tiers),
        "witness": sum(1 for c in g.conceits.values() if c.get("status") == "witness"),
        "illustration": sum(1 for c in g.conceits.values() if c.get("status") == "illustration"),
        "lens": sum(1 for cid in g.conceits if g.is_lens(cid)),
        "domains": len(g.domains), "channels": len(data["channels"]),
        "licenses": len(data["licenses"]), "generation_edges": len(g.generations),
        "relations": len(data["relations"]),
    }
    return g, r


# ---------------------------------------------------------------- output

def print_report(data, r):
    m = r.metrics
    inv = m["inventory"]
    print(f"Conceit Graph check: {data.get('setting', '(unnamed setting)')}")
    print(f"Seal sha256:{seal(data)}")
    print()
    tiers = ", ".join(f"{k} {v}" for k, v in sorted(inv["by_tier"].items(), key=lambda kv: TIER_RANK.get(kv[0], 9)))
    print("Inventory")
    print(f"  Conceits {inv['conceits']} ({tiers}); witness {inv['witness']}, illustration {inv['illustration']}, Lens {inv['lens']}")
    print(f"  Domains {inv['domains']}, Channels {inv['channels']}, Licenses {inv['licenses']}, "
          f"Generation Edges {inv['generation_edges']}, Persistent Relations {inv['relations']}")
    ro = m["roots"]
    print(f"  Roots: axioms {ro['axioms']}, substrate {ro['substrate']}, ungrounded {ro['ungrounded']}")
    print()
    print("Structural Profile")
    print(f"  Wholeness       Systems in the axiom base: {m['systems']}; graph components: {m['components']}")
    cl = m["closure"]
    sp = ", ".join(cl["sparsity_register"]) or "none"
    print(f"  Closure         modal questions {cl['modal']}, closure failures {cl['failures']}; sparsity register: {sp}")
    load = list(m["axiom_load"].items())[:3]
    top = "; ".join(f"{k} critical {v['critical']} / downstream {v['downstream']}" for k, v in load) or "none"
    print(f"  Economy         generative ratio {m['generative_ratio']}; highest load: {top}")
    lg = m["lore_genesis"]
    print(f"  Grounding       supported share of committed non-roots {m['grounding']}; "
          f"Lore determined {lg['determined']}, elected {lg['elected']}, emergent {lg['emergent']} "
          f"(determination ratio {m['determination_ratio']})")
    regs = sum(1 for f in r.findings if f["check"] in ("unbounded-loop", "regulation-gap"))
    print(f"  Self-regulation loops declared {m['loops']}; regulation findings {regs}")
    ce = m["certification"]
    print(f"  Consistency     certification {ce['level']}; coverage " + ", ".join(f"{k} {v}" for k, v in m["coverage"].items()))
    if ce["next"]:
        print(f"                  {ce['next']} blocked by: " + ("; ".join(ce["blocked_by"]) or "nothing"))
    print()
    print(f"Findings: {r.count('VIOLATION')} violations, {r.count('GAP')} gaps, {r.count('NOTE')} notes")
    order = {"VIOLATION": 0, "GAP": 1, "NOTE": 2}
    for f in sorted(r.findings, key=lambda f: (order[f["level"]], f["check"])):
        ids = f" [{', '.join(str(i) for i in f['ids'])}]" if f["ids"] else ""
        print(f"  {f['level']:<9} {f['check']:<22}{ids} {f['message']}")


def cmd_check(args):
    data = load(args.graph)
    _, r = run_checks(data)
    if args.json:
        json.dump({"setting": data.get("setting"), "seal": seal(data), "metrics": r.metrics,
                   "findings": r.findings}, sys.stdout, indent=2, ensure_ascii=False)
        print()
    else:
        print_report(data, r)
    return 1 if args.strict and r.count("VIOLATION") else 0


def cmd_strike(args):
    data = load(args.graph)
    g = Graph(data)
    if args.conceit not in g.conceits:
        print(f"conceit_graph: no Conceit '{args.conceit}'", file=sys.stderr)
        return 2
    before = support(g)
    after = support(g, struck=frozenset([args.conceit]))
    lost = sorted(before - after - {args.conceit})
    print(f"Striking {args.conceit} ({g.tier(args.conceit)}): {len(lost)} Conceits lose every license")
    for cid in lost:
        print(f"  {cid:<8} {g.tier(cid):<5} {g.conceits[cid].get('text', '')}")
    reach = sorted(downstream(g, args.conceit) - set(lost))
    if reach:
        print(f"Downstream but still supported by another path: {', '.join(reach)}")
    return 0


def cmd_order(args):
    data = load(args.graph)
    g = Graph(data)
    defined, deps = term_graph(g)
    indeg = {n: len({u for u in deps[n] if u in defined and u != n}) for n in defined}
    users = defaultdict(set)
    for n, us in deps.items():
        for u in us:
            if u in defined and u != n:
                users[u].add(n)
    ready = sorted(n for n, k in indeg.items() if k == 0)
    order = []
    while ready:
        n = ready.pop(0)
        order.append(n)
        for m in sorted(users[n]):
            indeg[m] -= 1
            if indeg[m] == 0:
                ready.append(m)
        ready.sort()
    print("Definitional order (each term after every term it uses):")
    for i, n in enumerate(order, 1):
        print(f"  {i:>2}. {n}  ({defined[n].get('defined_in')})")
    stuck = sorted(set(defined) - set(order))
    if stuck:
        print("Circular, cannot be ordered: " + ", ".join(stuck))
    return 0


def cmd_seal(args):
    data = load(args.graph)
    print(f"sha256:{seal(data)}")
    return 0


def cmd_dot(args):
    data = load(args.graph)
    g = Graph(data)
    shape = {"SYS": "box", "LORE": "ellipse", "NAR": "plaintext"}
    print("digraph conceits {")
    print("  rankdir=TB; node [fontname=Helvetica, fontsize=10];")
    for tier in ("SYS", "LORE", "NAR"):
        members = [cid for cid, c in g.conceits.items() if c.get("tier") == tier]
        if members:
            print("  { rank=same; " + " ".join(json.dumps(m) for m in members) + " }")
    for cid, c in g.conceits.items():
        style = "dashed" if c.get("status") != "committed" or g.is_lens(cid) else "solid"
        label = f"{cid}\\n{c.get('domain', '')}"
        print(f"  {json.dumps(cid)} [shape={shape.get(c.get('tier'), 'ellipse')}, style={style}, label=\"{label}\"];")
    for lic in data["licenses"]:
        style = "solid" if lic.get("mode") == "determined" else "dotted"
        for s in lic["from"]:
            print(f"  {json.dumps(s)} -> {json.dumps(lic.get('to'))} [style={style}];")
        for s in lic["substrate"]:
            print(f"  {json.dumps(s)} -> {json.dumps(lic.get('to'))} [style=dashed, arrowhead=empty];")
    for gen in data["generations"]:
        for s in gen["senders"]:
            print(f"  {json.dumps(s)} -> {json.dumps(gen.get('receiver'))} [penwidth=2, label={json.dumps(gen.get('id'))}];")
        if gen.get("covered_by"):
            print(f"  {json.dumps(gen['covered_by'])} -> {json.dumps(gen.get('receiver'))} [style=dashed, arrowhead=odot];")
    print("}")
    return 0


def main(argv=None):
    if hasattr(signal, "SIGPIPE"):
        signal.signal(signal.SIGPIPE, signal.SIG_DFL)
    ap = argparse.ArgumentParser(description="Conceit Graph checker (Worldbuilding Framework, Revision 05)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("check", help="run every mechanical check")
    p.add_argument("graph")
    p.add_argument("--json", action="store_true", help="emit findings and metrics as JSON")
    p.add_argument("--strict", action="store_true", help="exit 1 when any VIOLATION is found")
    p.set_defaults(fn=cmd_check)
    p = sub.add_parser("strike", help="perturbation: what loses its license if a Conceit is struck")
    p.add_argument("graph")
    p.add_argument("conceit")
    p.set_defaults(fn=cmd_strike)
    for name, fn, text in (("order", cmd_order, "definitional order for a codex"),
                           ("seal", cmd_seal, "SHA-256 seal of the canonical graph"),
                           ("dot", cmd_dot, "Graphviz source on stdout")):
        p = sub.add_parser(name, help=text)
        p.add_argument("graph")
        p.set_defaults(fn=fn)
    args = ap.parse_args(argv)
    return args.fn(args)


if __name__ == "__main__":
    sys.exit(main())
