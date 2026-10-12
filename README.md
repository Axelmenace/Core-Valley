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
site/
  index.html                 The Operative Mode website: one self-contained file (built; do not edit by hand)
  src/                       Its source: page.html, style.css, data.js, app/*.js
.claude-plugin/              Plugin + marketplace manifests, so the repo installs as a Claude Code plugin
tools/package-skills.sh      Builds dist/<skill>.zip for upload to claude.ai
tools/build-site.py          Builds site/index.html from site/src and the skill's Play Menu
```

## The website

`site/index.html` deploys a Mode end to end in the browser. Open it straight from disk, or serve the `site/` folder from any static host (GitHub Pages included).

| Chamber | What it does |
|---|---|
| **Play Menu** | All eighteen option sets with their one-line descriptions, served in small portions: Story Type, one setting, Tone, then the refinements. Every pick is a Declaration marked U. "Roll for me" is a real draw (the procedure of `menu_draw.py`), and the Menu's validation rules (school with romance, Trope Fusion, three or more mechanics) are applied. |
| **Magic Menu** | §25 as a menu: how magic works and how common it is, Identity, Mechanism Core, Source and Flux, the six anchored Variables, the Price vector, Domains, and a working Effect Grammar that prices any effect by the Pricing Procedure and keeps a Codex (the SPEC-Lattice example prices Ford-Ice at Tier 5, 48 mana). Also the Disclosure Profile, Lens, Balance Record, Specification Validation, and a Level 3 hash seal. |
| **Deployment** | The nine steps of §12, from Declaration to Activation: ceremony level, Purpose Profile, Baseline Posture and Deltas on the Anchored Scales, Seats, Stake and Voice Cards, Clocks, Content Dials, the eight conjunctive Validation tests, the Pre-Mortem, Election, the Kernel, Touchstone and Operating Brief, Proving, Assent and Activation. It exports the Light Sheet or Full Instrument, Brief, Activation Instruction, Resumption Packet and the Record as JSON. |
| **The Table** | Play: Stakes, then Odds from the Ladder with named factors, then a d100 Tool Draw and its Band; Oracle Questions; Clocks that tick only on a named condition; Hash Seals; the draw log; Checkpoints with the Kernel first; the Canon Ledger, Stale Register and Part Close. |
| **Codex** | Invariants, the Checklist, the Intervention Ladder, Odds and Bands, the Consequence Gate, the Commitment Ladder, both Drift tables and the Posture Library. |

**Randomness and seals are real.** Draws come from `crypto.getRandomValues`, and seals use the same scheme as `scripts/seal.py` (`sha256(nonce + "|" + plaintext)` with a 32-byte nonce), so a seal file saved from the site verifies with `python scripts/seal.py verify SEAL-1.json`.

**The Operator.** Opened as a claude.ai artifact, the page reaches Claude directly: Claude elects the open values, writes and seals a Specification unread, renders the Proving Scene, states its own assent, and plays at the Table, drawing with the page's dice through page tools. Redo and Flag void the discarded continuation and everything it recorded (§14.6). Anywhere else, every one of those requests can be copied into a Claude conversation and the reply pasted back, and the Table hands off with one packet.

The Mode is kept in the browser's local storage. Export the Record to keep it anywhere, and import it to carry on. To rebuild after editing `site/src` or the Play Menu:

```
python tools/build-site.py
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

## Related

The Scriptorium novel-writing suite (`scriptorium-*` skills) borrows from this framework; its Novel Menu is the counterpart of the Play Menu. It lives outside this repo.
