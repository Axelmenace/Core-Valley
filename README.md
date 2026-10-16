# Core-Valley

Home of the **Operative Mode Framework**: a coordination protocol for collaborative fiction (roleplay, simulation, co-authorship) in which the User fixes what they care about, the AI Operator elects the rest, and everything stays auditable over long Play.

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
archive/
  operative-mode-framework-draft-0.3.md   Deployable Working Draft 0.3, kept for reference and migration
ficcraft/                    Ficcraft: a local-first web notebook for developing worldbuilding ideas over long threads
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
```

**claude.ai / Claude desktop.** Run `./tools/package-skills.sh`, then upload `dist/operative-mode.zip` under Settings → Capabilities → Skills.

The scripts need only Python 3 and the standard library. They are optional: without code execution the skill falls back to User Rolls and lower Commitment Levels.

## Version history

| Draft | Where | Notes |
|---|---|---|
| 0.3 | `archive/` | Mode Sheet A.1–A.21, eleven proposition statuses, the "Open Encounter" worked example |
| 0.4 | `skills/operative-mode/` | Baseline + Deltas, Kernel and Touchstone, Pre-Mortem, Proving Scenes, Regression family of drift, Stake/Voice Cards, Commitment Ladder, Play Menu, magic system construction (§25). See `references/12-migration-from-0-3.md` |

## Ficcraft

`ficcraft/` is a static web app for aspiring fantasy novelists. It logs ideas and develops them over very long threads, with waypoints, ribbons, branches, a distillation per thread, a codex with `[[links]]` and backlinks, a riddles list and an oracle deck. Serve the folder from any static host, or run `python3 ficcraft/tools/bundle.py` to get a single HTML file. See [`ficcraft/README.md`](ficcraft/README.md).

## Related

The Scriptorium novel-writing suite (`scriptorium-*` skills) borrows from this framework; its Novel Menu is the counterpart of the Play Menu. It lives outside this repo.
