---
name: "scriptorium-record"
description: "The Scriptorium suite's memory: a novel's file-based Record (Manifest, Substrate, Fabula, Discourse, Manuscript, Ledgers, Checkpoints), its Laws, its Hot/Warm/Cold read protocol, its file formats, and scaffold and audit scripts. Use whenever a Scriptorium novel's files must be created, read or queried: initializing a new novel's Record, checking an established fact before writing, looking up what a character knows or wants, where a thread or foreshadowing obligation stands, what happened in an earlier chapter, or auditing the Record's consistency. Loaded by scriptorium-manifest, scriptorium-drafting and scriptorium-archiving for every file operation. Not for analyzing or verifying a setting (worldbuilding-analysis owns that)."
---

# Scriptorium: The Record

The Scriptorium is a suite of five skills for producing a novel. This skill is its memory. Three others work on the Record: `scriptorium-manifest` (designs and ratifies the novel before drafting), `scriptorium-drafting` (writes chapters against the Record) and `scriptorium-archiving` (closes chapters and Parts into the Record). Each of them loads this skill for every file operation. The fifth, `scriptorium-menu`, is the Novel Menu, from which an unsure Author declares a novel; it touches no files, and its picks reach the Record through the Manifest.

**Files are memory. Folders are classification.** That is the suite's founding principle, and everything below elaborates it. A novel of two hundred chapters cannot be held in a context window, and a context window is not a memory in any case: it is a reading. The Record is the only memory the novel has. At Chapter 100, the files recall Chapter 1.

## The Three Hands

The Record is partitioned by what each part answers, after the Stake Calculus (SC-3, §8):

- The **Substrate** says what *can* happen: the setting, its rules, and the Conditions the story concerns. It is the Fabula Machine's law, and it is read-only to drafting.
- The **Fabula Record** says what *is* the case in the story-world: who wants what, who knows what, where everyone stands, and when.
- The **Discourse Record** says what *has been told*, in what order, and what the telling still owes the Reader.

The **Manifest** is the Design: what the Author wants the novel to be, declared before drafting. It selects among what the Substrate permits. It never enlarges what the Substrate permits.

Fabula and Discourse are never merged. A character learning a secret is a Fabula event. The Reader learning it is a Discourse event. They can happen in different chapters, in either order, and the Record must be able to say both.

## Parties

- **The Author** is the human. The Author holds the Manifest, ratifies it, and decides every amendment.
- **The Operator** is Claude. The Operator drafts, keeps the Record, and elects whatever the Author leaves open, marking each election `I` (inferred) so it can be corrected.
- **A Lector** is an optional subagent for Cold-tier retrieval or for an independent Part Review. Use a Lector only where the harness offers subagents and the Author has agreed to them. An auditor that did not draft the Part is not grading itself.

## Layout

```
<novel-root>/
├── MANIFEST.md            Design: Intent, Menu Picks, Kernel, Touchstone, Parameters, Parts, Strands, Regimes
├── substrate/
│   ├── setting.md         Setting Extract: base setting, Delta Inventory, tier-tagged extracts, Instances
│   └── conditions.md      Conditions Registry: the versioned states of affairs the Stakes concern
├── fabula/
│   ├── cast.md            Cast Register: one Character Status Sheet per Principal; Supporting and Background entries
│   ├── arcs/              Character Arc Sheets: AGT-NN-PFn.md, one per Persistent Failure State (always the protagonist's)
│   ├── relations.md       Relationship Profiles: Conflict Classes per Goal pair, derived labels
│   ├── knowledge.md       Knowledge Matrix: who knows what, from which Source, since when
│   └── chronology.md      Chronology: Fabula interval per chapter, offstage intervals, Clocks
├── discourse/
│   ├── obligations.md     Obligation Ledger: Questions, Plants, Promises, Deceptions, by ID
│   ├── exposition.md      Exposition Ledger: Delta concepts disclosed, mode, registration
│   └── stale.md           Stale Register: barred and rate-limited phrases, images, beats
├── chapters/              Manuscript: ch-001_<slug>.md, ch-002_<slug>.md, ...
├── ledger/                Chapter Ledgers: ch-001.md, ...; _margin.md (working Margin)
└── checkpoints/           Checkpoints, Part Reviews, Resumption Packets
```

Exact formats are in `references/formats.md`, except the Character Status Sheet and the Character Arc Sheet, whose formats are given below and supersede the cast example there. Read it before writing any Record file for the first time in a session; the audit script parses these formats.

### Where the Record lives

The Law of the Record is only as good as the storage under it. Before scaffolding, establish where the Record persists:

1. A folder on the Author's computer reached through the device bridge, or a repository, or the Author's own synced folder. Preferred.
2. A session workspace that does not outlive the session. Admissible only with the Self-Sufficiency fallback: at every session close, deliver the Resumption Packet (and, at Part close, the whole Record as an archive) for the Author to keep.

Never treat conversational memory, a memory store, or the transcript as the Record. Say plainly which storage is in use when the Record is created.

### The Character Status Sheet

Every Principal's entry in `fabula/cast.md` is a **Character Status Sheet**, in exactly this form; the protagonist's is mandatory in every story. It holds who the Agent is (Card, Voice, Core, Competence, Choice Rule, PAM), what it is doing (Plans), and where it stands now (the State Log, whose last line is its current status). Its blocks and the PAM Bindings are defined in `scriptorium-manifest` §4 and §4a. Supporting Agents use the same sheet with only Card, Voice and State Log; Background Agents keep their one Note line.

Three rules keep the sheet clean. *One fact, one home:* the PAM block points with IDs, and every bound line carries its `[PAM:<ID>]` tag where it lives. *Append, never edit:* the blocks above the State Log are the `ch-000` declaration, and every later change is a State Log line. *Audit-safe:* keep the header exactly `## AGT-NN · Name · Tier` (the audit parses it; the protagonist is marked in the Arc block, never in the header), and begin no line outside the State Log with `- ch-`.

```markdown
## AGT-NN · <Name> · Principal

### Card
- Want: <Operator>(C-nn) · <Mode>
- Line: <what it will not do or yield>
- Price: <what would make it yield; fixed before Chapter 1>
- Leverage: <what it holds over others>
- Tell: <observable sign of its state> [PAM:BTn]

### Voice
- Diction: <...>
- Rhythm: <...>
- Tell: <...>
- Never: <...>
- Sample Line: "<...>"

### Core
- Belief: <...> [PAM:Mn]; <...> [PAM:An]; <self-belief> [PAM:SBn]; <other beliefs>
- Valuation: <...>; − on C-nn [PAM:CFn]
- Norms: <...> [PAM:En]
- Restrictions: Hard Filter on <...> [PAM:Tn]; Soft Cost on <...>
- Dispositions: <compulsion> [PAM:CCn]; <trait> [PAM:BTn]; <...>

### Plans
- G-nn · <Operator>(C-nn) by ch-NNN · <Status>
- G-nn · Hold(¬C-nn) · Committed · standing [PAM:CCn]

### Competence
- <skills and capacities>

### Choice Rule
- <one applicable sentence, saying how CCn competes in its Trigger context>

### PAM
- Tn · Trauma · K-nn <event, when> · Need: <Domain> · installs Mn
- En · Endowment · K-nn <event, when> · Need: <Domain> · installs An
- Mn · Maladaptive · from Tn · Core.Belief · reason: <...>
- An · Adaptive · from En · Core.Belief · reason: <...>
- SBn · Stated · Sincere|Insincere · "<...>" · Gap: <ID or none>
- CFn · Core Fear · Prevent|Escape(C-nn) · predicted by Mn
- CCn · Core Compulsion · Core.Dispositions + G-nn · Trigger: <context> · Choice Rule: competes|dominates
- BTn · (−|+|Temperament) <trait> · from <ID>
- PFn · Domain: <Failure-Cost Domain> · G-nn × G-nn · <Conflict Class> · cause: Blockade|Believed Blockade via <ID> · Reproduction: passes
- BFn · guards <IDs> · Rule: <...> · Limit: <...>

### Arc
- Role: Protagonist | Principal
- Sheets: fabula/arcs/AGT-NN-PFn.md (one per PFn)

### State Log
- ch-000 · Standing: <location>; <condition>; <emotional state>; <key relations> · Plans: <Goal IDs and statuses> · Core: as declared
```

A Core change in the State Log names its tags, for example `- ch-031 · Standing: ... · Plans: G-06 Closed (Abandoned) · Core: M1 non-viable → R1 Adaptive [PAM:M1] [ARC:R1]`.

### The Character Arc Sheet

One file per Persistent Failure State, at `fabula/arcs/AGT-NN-PFn.md`; the protagonist has at least one in every story. The scaffold does not create the folder: create it at Initialization. The Arc Types, chains, branch nodes and invariants are defined in `scriptorium-manifest` §4b. The audit does not read these files, so their concordance is checked at the Part Review. The sheet owns only the planned Alternative chain (until its Transition Event occurs) and the planned revised belief; everything else is an ID or a citation of the Record line that shows it.

```markdown
# Arc Sheet: AGT-NN · <Name> · PFn

## Declaration
- Role: Protagonist | Principal
- Persistent Failure State: PFn · Domain: <Survival | Safety | Trust | Status | Self-Expression>
- Planned Type: Iconic | Adaptive Non-Arc | Maladaptive Non-Arc | Tragic Arc | Confirmation Arc | Maladaptive Arc | Adaptive Arc
- Outcome Type: Iconic (until the Belief Falsification Event) | <the Type the branch path produced>
- Plots: one | two
- Shape (optional, Novel Menu): <...> · Evaluator: <...>
- Regime: DUAL · External Strand STR-nn · Window <n> chapters | none
- Declared: Manifest v<x.y.z> · binds from ch-NNN

## Formation at stake
- <IDs from the Status Sheet, e.g. M1, CF1, CC1, BF1, PF1>

## Initial chain (Initial Plot · STR-nn)
- Transition Event: <planned window> · Activation on C-nn · occurred: pending
- Actuality and Assertion: Card Want <Operator>(C-nn)
- Goal: G-nn
- Strategy: <Commitment IDs>

## Alternative chain (Alternative Plot · STR-nn)   (two-Plot Types only)
- Transition Event: <planned window> · External Imposition by <AGT-nn | exogenous event> · occurred: pending
- Actuality: <Condition, planned> · Constrained by BFn
- Assertion: <Operator>(C-nn, planned)
- Goal: <planned; G-nn once entered>
- Strategy: <planned>

## Planned revised belief   (arcs reaching node 7)
- R1 · replaces Mn · "<content>" · Adaptive | Maladaptive · reason: <...> · adopted: pending

## Nodes
| # | Node | Kind | Planned | Taken | Chapter | Evidence |
|---|---|---|---|---|---|---|
| 1 | Forced Exclusivity Event | fixed | ch-NNN..ch-NNN | pending | | |
| 2 | Initial Choice | fixed | Initial Assertion | pending | | |
| 3 | Outcome of the Initial Strategy | branch | 3a stabilized · 3b destabilized · 3c catastrophic failure | pending | | |
| 4 | Belief Falsification Event | fixed | variant: abandoned · unattainable | pending | | |
| 5 | Overcoming the Core Fear | branch | 5a deprivation · 5b-i feared action, no catastrophe · 5b-ii feared action, catastrophe | pending | | |
| 6 | Belief Falsification | fixed | | pending | | |
| 7 | Revised Belief | branch | 7a Adaptive · 7b Maladaptive | pending | | |
| 8 | Failure-Cost Domain Stabilization | fixed | Alternative Goal completed | pending | | |

## Probe Set
| Probe | Context | Implicit Belief chooses | Revised belief chooses |
|---|---|---|---|
| P1 | <...> | <...> | <...> |
| P2 | <...> | <...> | <...> |
| P3 | <...> | <...> | <...> |

## Filtered Evidence
- <chapter> · K-nn · filtered by BFn

## Retention
- Check: Part NN Review · Result: pending | Retained | Further Arc | Lapsed · Breadth: <n> of <N> Probes

## Log
- <chapter> · <node, branch or probe> · <what happened> · <Record line that shows it>
```

Mark the branch the Planned Type requires in the Planned column (for example `3c`, `5b-i`, `7a`). Nodes a Type never reaches are marked `n/a`.

**Filtered evidence in the Knowledge Matrix.** When a Belief-Filter absorbs a refutation, the row keeps the prior Status and records the filtering in its Source cell, so the Status vocabulary does not change:

```markdown
| K-15 | AGT-01 | Misbelieves | Callon's unwritten loan, ch-014 · filtered by BF1 | ch-014 |
```

## The Laws of the Record

**The Law of the Record** asserts that what is not in the Record is not established. A fact the Operator remembers from the conversation, but which no Record file states, has the standing of a guess. This means that before a chapter relies on a fact, the fact is read from the Record, and after a chapter creates a fact, the fact is written to the Record.

**The Law of Warrant** asserts that every continuity claim in the prose has a Record source. A needed fact that the Record lacks is either established now (entered on the Margin, Provisional until Chapter Close) or left open. The absence of a fact never licenses the Operator's preferred possibility. Leave it open, ask the Author, or establish it on the page and record it.

**The Source Test** follows from Warrant. A character acts on a restricted fact only if the Knowledge Matrix gives that character a Source for it: witnessed, told, inferred from something on record, or read. This catches the two commonest leaks: antagonists who know what only the Operator knows, and characters who react to a viewpoint character's unspoken thoughts.

**The Claim Layer** asserts that a character's speech establishes only that it was said. Testimony, rumour, boast, prophecy and lie enter the Record as Claims, attributed to their speaker, until something else establishes their content. This blocks the commonest route by which a line of dialogue hardens into world fact.

**The Law of Append** asserts that state is appended, never overwritten. Every State Log line, Chronology line and Obligation status change carries the chapter that produced it. This means that the Record answers both "where does Callon stand now" and "where did Callon stand in Chapter 12". Compaction at a Part boundary moves old entries to the Cold archive; it never revises them.

**The Law of Versioning** asserts that the meaning of a Condition, a setting rule or a Goal is immutable. A change of meaning creates a new version that names its parent and the reason. A redefinition is never recorded as a world event: if "the Barony is solvent" is redefined, the Barony has not changed, the Registry has.

**The Law of the Substrate** asserts that drafting reads the setting and never amends it. Chapters may add **Instances**, the Narrative-tier particulars the setting licenses (a named inn, a minor house, a customs officer), each recorded with the extract that licenses it. A chapter that needs a System-tier or Lore-tier change raises a **Setting Query** instead. Setting Queries are resolved by the Author, using `worldbuilding-analysis` where analysis is needed, and take effect only at a Part boundary. Drama never amends the world. To make possible what the setting forbids is a change to the setting itself, and it is made deliberately, outside drafting, or not at all.

**The Law of Obligation** asserts that every debt the telling incurs to the Reader receives an ID at the moment it is incurred, and stays in the Obligation Ledger until it is Paid, Converted or Released. This covers a question raised, a detail planted for later significance, a promise of a confrontation, and a deception the Reader will be owed a reveal of. The Chapter Ledger and the Obligation Ledger must agree.

**The Retention Rule** asserts that only the retained draft is canon. A chapter redrafted, discarded or replaced has no standing, and neither has anything it wrote to the Record. Files persist across a redraft even though the draft does not, so at the next Chapter Close or Checkpoint, Void every Record line sourced to a discarded draft, with the reason.

Canon statuses are four: **Established**, **Provisional** (written, awaiting Chapter Close or Author confirmation), **Disputed** (two Record lines disagree; resolve before drafting relies on either) and **Void** (with a reason). *Hidden* is a visibility, not a status: a fact the Reader has not been told can still be Established.

## Tiers and the Read Protocol

The Record is read in three Tiers, after the Operative Mode Framework (§3).

| Tier | Contains | Read |
|---|---|---|
| **Hot** | MANIFEST Kernel and Parameters; the latest Resumption Packet or Checkpoint; the previous Chapter Ledger; the Margin, if a chapter is in progress | At the start of every chapter and every session, in full |
| **Warm** | Status Sheets for Agents on stage; the Arc Sheets of any on-stage Agent with a node or Probe due; Knowledge rows for those Agents; Open and due Obligations; the Chronology tail and live Clocks; Exposition rows due; the Stale Register; Setting extracts the chapter touches | At the start of every chapter, selected by the Chapter Brief |
| **Cold** | Full prior chapters; older Ledgers; compacted State Logs; past Part Reviews | Only on query, by search |

### Opening Read, every chapter

1. Read the Hot Tier in full. Restate the Kernel to yourself verbatim; this re-anchoring is the main defence against drift over a long manuscript.
2. From the previous Ledger and the Manifest's Strand plan, list what this chapter concerns: Agents on stage, Strands in play, Obligations due or overdue, Exposition due, arc nodes and Probes due.
3. Read the Warm entries for exactly those. For each on-stage Agent, read its Status Sheet (Card, Voice, PAM block where it carries one) and the **latest** State Log line, and, where a node or Probe is due, the Arc Sheet concerned. The latest State Log line is the line at the end of that Agent's log, never an earlier one.
4. Read the Stale Register.
5. If any two Record lines disagree, mark them Disputed and resolve with the Author, or by the Record's own provenance, before drafting relies on either.

### Session open

Read the Resumption Packet first. A Packet that passes the Self-Sufficiency Test is sufficient to continue; read further only as the Opening Read directs. If no Packet exists, read the latest Checkpoint and the last three Chapter Ledgers.

## Query Protocol

| Need | Procedure |
|---|---|
| Verify a setting fact | `substrate/setting.md`, by search on the term; then its source citation if the extract is thin |
| Verify a Condition's meaning | `substrate/conditions.md`, by ID and **version**; two claims concern the same Condition only if they cite the same ID and version |
| What an Agent wants, fears, would refuse | `fabula/cast.md`, that Agent's Card and latest State Log line |
| Why an Agent is as it is; what it fears at root, does compulsively, says it believes, filters out | `fabula/cast.md`, that Agent's PAM block; then grep `[PAM:` in its entry for the bound components |
| Where an Agent's arc stands | `fabula/arcs/AGT-NN-PFn.md`: Outcome Type, Nodes and Log |
| What an Agent knows, and how | `fabula/knowledge.md`, rows for that Agent |
| Where a thread stands | `discourse/obligations.md`, by ID or by Strand |
| What happened earlier | Chapter Ledgers in `ledger/`, newest first; the chapter text only if the Ledger is insufficient |
| When something happened | `fabula/chronology.md` |
| Global consistency | Run the audit script, then read whatever it flags |

Search before reading whole files: grep for the ID, the term or the Agent's name across the Record, then open the hits. Every answer drawn from the Record cites the file and the ID it came from.

## Initialization

Initialization runs once, after the Manifest is ratified (`scriptorium-manifest` calls it).

1. Establish storage, per "Where the Record lives".
2. Run the scaffold:
   ```
   python scripts/scaffold.py --root <parent-folder> --title "<Novel Title>"
   ```
   It creates `<parent-folder>/<slug>/` with every file in the layout, each carrying its format header. It refuses to overwrite an existing Record.
3. Create `fabula/arcs/`. Write the ratified content into `MANIFEST.md`, `substrate/`, `fabula/` (Status Sheets in `cast.md`, Arc Sheets in `arcs/`) and `discourse/` (planned Obligations enter as `Planned`).
4. Run the audit once, so the Record begins clean.

## The Audit

```
python scripts/audit_record.py <novel-root>
```

The audit is mechanical concordance, not judgment. It checks that every chapter has a Ledger and every Ledger a chapter; that every Obligation the Ledgers open, pay, convert or release agrees with the Obligation Ledger, in both directions; that every Agent and Exposition ID cited exists; that every Agent whose state changed has a State Log line stamped with that chapter; that every archived chapter has a Chronology line, and Fabula order runs forward unless a chapter is declared Analepsis or Prolepsis; that offstage intervals carry a Change Hazard note; that Obligations past their window are flagged; that chapter length sits in the Length Band; and that no Barred phrase from the Stale Register appears in the Manuscript, and no limited one exceeds its limit within a Part.

Errors break concordance and must be fixed before the next chapter. Warnings are reported in the Chapter Return and decided by the Author or at the Part Review. A clean audit does not certify the novel; it certifies only that the Record agrees with itself.

## Boundaries

- **Not a setting tool.** This suite consumes a setting; it does not analyze, verify or develop one. Setting analysis, the Conceit Graph, conflict typing and Reconciliation, and verification certificates belong to `worldbuilding-analysis`. The Record cites setting material by its tier tags (`[SYS]`, `[LORE]`, `[NAR]`) and never re-runs those protocols.
- **Not a memory store.** Facts about the Author belong in the Author's memory; facts about the novel belong in the Record. Never copy one into the other.
- **Activated only on request.** The suite runs when the Author asks for a novel or a chapter. It never proposes turning a setting into a story.