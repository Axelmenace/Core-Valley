# Core-Valley

Home of the **Operative Mode Framework**: a coordination protocol for collaborative fiction (roleplay, simulation, co-authorship) in which the User fixes what they care about, the AI Operator elects the rest, and everything stays auditable over long Play. Alongside it live the **Scriptorium** novel-writing suite and the **Worldbuilding Analysis** skill.

## Layout

```
skills/
  operative-mode/            Draft 0.4, the current installable skill
    SKILL.md                 Entry point: ceremony levels, deployment sequence, invariants, Play rules
    references/01–13         The framework text, §0–§25 plus Posture Library and 0.3→0.4 migration
    assets/                  Mode Instrument, Light Mode Sheet, Kernel/Brief, State Record,
                             Activation Instruction, Standing Preferences, Play Menu (.md + .json),
                             Magic Specification sheet, Magic Menu (.md + .json), Standard Magic System,
                             HTML pickers for both Menus, examples/ (Arania: four linked magic systems)
    scripts/                 draw.py (Tool Draw / Oracle), menu_draw.py (Play/Magic Menu rolls),
                             seal.py (Hash Seals), build_menu_html.py (rebuilds the HTML pickers)
  scriptorium-menu/          Novel Menu: option sets for an unsure Author declaring a novel
  scriptorium-manifest/      Architecture stage: design and ratify a novel's MANIFEST
  scriptorium-record/        Memory: the file-based Record, its formats, scaffold.py and audit_record.py
  scriptorium-drafting/      Prose stage: draft one chapter against the Record
  scriptorium-archiving/     Persistence stage: close chapters, Parts and sessions into the Record
  worldbuilding-analysis/    Analyze, verify or develop a fictional setting (Worldbuilding Framework, Revision 04)
archive/
  operative-mode-framework-draft-0.3.md   Deployable Working Draft 0.3, kept for reference and migration
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
cp -r skills/operative-mode ~/.claude/skills/        # all projects
cp -r skills/operative-mode .claude/skills/          # this project only
cp -r skills/scriptorium-* ~/.claude/skills/         # the whole Scriptorium suite
```

**claude.ai / Claude desktop.** Run `./tools/package-skills.sh`, then upload the zips you want from `dist/` (one per skill) under Settings → Capabilities → Skills.

The scripts need only Python 3 and the standard library. They are optional: without code execution the skill falls back to User Rolls and lower Commitment Levels.

## Version history

| Draft | Where | Notes |
|---|---|---|
| 0.3 | `archive/` | Mode Sheet A.1–A.21, eleven proposition statuses, the "Open Encounter" worked example |
| 0.4 | `skills/operative-mode/` | Baseline + Deltas, Kernel and Touchstone, Pre-Mortem, Proving Scenes, Regression family of drift, Stake/Voice Cards, Commitment Ladder, Play Menu, magic system construction (§25), Magic Menu and Standard System (§25.18). See `references/12-migration-from-0-3.md` |

## Related

The Scriptorium novel-writing suite (`skills/scriptorium-*`) borrows from this framework; its Novel Menu is the counterpart of the Play Menu. The stages run Menu → Manifest → (Drafting ⇄ Archiving), with Record as the shared memory underneath. Install all five together.
