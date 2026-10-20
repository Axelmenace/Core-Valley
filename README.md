# Core-Valley

Home of two frameworks:

- the **Operative Mode Framework**: a coordination protocol for collaborative fiction (roleplay, simulation, co-authorship) in which the User fixes what they care about, the AI Operator elects the rest, and everything stays auditable over long Play;
- **Axel's Worldbuilding Framework, Revision 05 (Structuralist Edition)**: analysis, verification and development of fictional settings as structures, System first, with a Conceit Graph checker.

## Layout

```
skills/
  operative-mode/            Draft 0.4, the current installable skill
    SKILL.md                 Entry point: ceremony levels, deployment sequence, invariants, Play rules
    references/01–13         The framework text, §0–§25 plus Posture Library and 0.3→0.4 migration
    assets/                  Mode Instrument, Light Mode Sheet, Kernel/Brief, State Record,
                             Activation Instruction, Standing Preferences, Play Menu (.md + .json),
                             Magic Specification sheet, examples/ (Arania: four linked magic systems)
    scripts/                 draw.py (Tool Draw / Oracle), menu_draw.py (Play Menu rolls), seal.py (Hash Seals)
  worldbuilding-analysis/    Worldbuilding Framework Revision 05 (Structuralist Edition), replacing Revision 04
    SKILL.md                 Entry point: the Structuralist standpoint, levels, the framework in brief, protocols, outputs
    references/01–10         Ontology, pipeline, Conceit Graph, Structural Profile, Analysis and Verification Protocols,
                             Generative Mode, transmission, glossary, and the audit of Revision 04 with its migration map
    assets/                  Conceit Graph template (.json), report skeleton, registers, Ledger, Completion Certificate,
                             examples/ (the Salt Marches: a toy graph and the Survey written from it)
    scripts/                 conceit_graph.py (check, strike, order, seal, dot)
archive/
  operative-mode-framework-draft-0.3.md   Deployable Working Draft 0.3, kept for reference and migration
  worldbuilding-framework-revision-04.md  Worldbuilding Framework Revision 04, the skill Revision 05 replaces
worldbuilding/
  arania/                    Revision 05 Audit of Arania (Project 49) and its Conceit Graph
.claude-plugin/              Plugin + marketplace manifests, so the repo installs as a Claude Code plugin
tools/package-skills.sh      Builds dist/<skill>.zip for upload to claude.ai
```

## Installing

**Claude Code, as a plugin**

```
/plugin marketplace add axelmenace/core-valley
/plugin install core-valley@core-valley
```

**Claude Code, as a plain skill.** Copy the folder into your personal or project skills directory:

```
cp -r skills/operative-mode ~/.claude/skills/                 # all projects
cp -r skills/worldbuilding-analysis ~/.claude/skills/
cp -r skills/operative-mode .claude/skills/                   # this project only
```

**claude.ai / Claude desktop.** Run `./tools/package-skills.sh`, then upload `dist/operative-mode.zip` and `dist/worldbuilding-analysis.zip` under Settings → Capabilities → Skills. `worldbuilding-analysis.zip` carries the same skill name as the Revision 04 upload, so it replaces it; if claude.ai refuses the duplicate name, delete the old skill there first.

The scripts need only Python 3 and the standard library. They are optional: without code execution Operative Mode falls back to User Rolls and lower Commitment Levels, and the Worldbuilding Framework runs its graph checks by hand.

## Version history

**Operative Mode Framework**

| Draft | Where | Notes |
|---|---|---|
| 0.3 | `archive/` | Mode Sheet A.1–A.21, eleven proposition statuses, the "Open Encounter" worked example |
| 0.4 | `skills/operative-mode/` | Baseline + Deltas, Kernel and Touchstone, Pre-Mortem, Proving Scenes, Regression family of drift, Stake/Voice Cards, Commitment Ladder, Play Menu, magic system construction (§25). See `references/12-migration-from-0-3.md` |

**Worldbuilding Framework**

| Revision | Where | Notes |
|---|---|---|
| 04 | `archive/` (formerly the claude.ai upload) | Two-phase pipeline, Conceit Graph, Verification Protocol, Structuralist Position; one file |
| 05 | `skills/worldbuilding-analysis/` | Modal Test, Licensure (Determined/Elected), Stance, Closure Test and Sparsity Register, Structural Profile, Type Q, Certification Ladder, medium-indexed transmission, the checker. See `references/10-revision-05-notes.md` |

## Related

The Scriptorium novel-writing suite (`scriptorium-*` skills) borrows from this framework; its Novel Menu is the counterpart of the Play Menu. It lives outside this repo.
