# Record Formats

Every Record file is Markdown. Fields are written as `- Key: Value` lines, IDs as shown, and chapter references as `ch-NNN`. The audit script parses exactly these shapes, so keep them. Prose may be added anywhere a field is not expected.

**ID scheme.** `AGT-01` Agents · `C-01` Conditions · `G-01` Goal Versions (a revision is `G-01.2`, parent `G-01`) · `STR-01` Strands · `OBL-001` Obligations · `DX-01` Delta concepts · `S-01` / `L-01` / `N-01` Setting extracts at System, Lore and Narrative tier · `SQ-01` Setting Queries · `K-01` Facts · `CLK-01` Clocks. IDs are never reused, even after a Void.

**Lists in a field** are comma-separated. An empty list is written `none`.

---

## MANIFEST.md

```markdown
# MANIFEST: The Black Seal

## Parameters
- Title: The Black Seal
- Manifest Version: 1.0.0
- Ceremony: Full
- Current Part: 1
- POV Mode: Third Limited
- Tense: Past
- Length Band: 3000-5000
- Offstage Threshold: 2
- Coincidence Budget: 1 per Part
- Voice Skill: none
- Storage: <where the Record persists>

## Parts
- Part 1: ch-001..ch-012 · The Debt
- Part 2: ch-013..ch-024 · The Assize
```

`Length Band` is in words. `Offstage Threshold` is in Fabula days: a gap of at least this many days between consecutive Linear chapters is an offstage interval and needs a Change Hazard note. The remaining sections (Intent, Kernel, Touchstone, Signature Choices, Strands, Regimes, Exposition Budget, Pre-Mortem, Amendment Docket, Version History) are specified in `scriptorium-manifest`.

---

## substrate/setting.md

```markdown
## Base Setting
- Base: late-medieval Low Countries mercantile barony; inheritance law and debt bondage as on Earth
- Source: <document, revision>

## Delta Inventory
- DX-01 · Sye (mental and emotional focus) · [SYS]
- DX-02 · The Assize of Ash · [LORE]

## Extracts
### [SYS] S-01 · Debt binds the heir, not the estate
- Source: <document §, revision>
- Text: <the extract, verbatim or closely summarized, with the source's terms>

### [LORE] L-04 · Wayside inns are licensed by the barony
- Source: <document §>
- Text: ...

## Instances
### [NAR] N-01 · The Grey Gull, a licensed inn on the Tearpyre road
- First: ch-003
- Licensed by: L-04

## Setting Queries
### SQ-01 · Can a squire testify at the Assize?
- Raised: ch-007
- Need: the Lore governing testimony by minors
- Status: Open
```

Instances are Narrative-tier particulars added during drafting. Each names the System or Lore extract that licenses it. A Setting Query's Status is `Open`, `Resolved` (with the Part boundary and how), or `Withdrawn`.

---

## substrate/conditions.md

```markdown
### C-04 · v1 · The Tearpyre charter stands
- Kind: Binary
- Parent: none
- Meaning: the barony's royal charter is unrevoked and recognized by the Crown's assessor
- Status: Established

### C-07 · v1 · Tearpyre's debt to House Eldredge
- Kind: Graded · Band: 4000..6000 crowns
- Parent: none
- Meaning: principal outstanding; realized (crippling) above 6000, released below 4000

### C-04 · v2 · The Tearpyre charter stands
- Kind: Binary
- Parent: C-04 v1 · Reason: Author redefined "recognized" to include the Church's registry (Part 2 boundary)
- Meaning: ...
```

A Graded Condition carries a Band: realized above the upper bound, unrealized below the lower, unchanged inside it. The Band suppresses chatter: a quantity hovering at one threshold does not flip the Condition every scene.

---

## fabula/cast.md

Principal Agents carry every block. Supporting Agents carry Card, Voice and State Log. Background Agents carry one Note line.

```markdown
## AGT-01 · Aston of Tearpyre · Principal

### Card
- Want: Hold(C-04) · Committed
- Line: will not sell his sister's dowry rights
- Price: a sworn release of the debt, witnessed
- Leverage: knows the assessor's bribe
- Tell: goes formal, uses full titles, when cornered

### Voice
- Diction: clipped, legal, borrowed from his tutor
- Rhythm: short declaratives, then one long qualifying sentence
- Tell: answers questions with questions when lying
- Never: swears by the gods; uses diminutives
- Sample Line: "Then let the assessor say it to my face, and in writing."

### Core
- Belief: the Crown's law protects charters; trusts Callon
- Valuation: family standing above personal safety
- Norms: an oath binds even when the oath-taker is cheated
- Restrictions: Hard Filter on striking a guest; Soft Cost on lying to kin
- Dispositions: rises before dawn; counts coins when anxious

### Plans
- G-03 · Reach(¬C-07) by ch-024 · Operative
- G-05 · Hold(C-04) · Operative

### Competence
- swordwork (squire-trained), letters, accounts

### Choice Rule
- LEX: Expression ≻ Trust ≻ Safety; within survivors, the option most likely to keep the charter

### Arc Declaration
- Hypothesis: Epistemic · loses his trust in Callon
- Probe Set: P1 Callon asks him for the strongbox key; P2 a stranger offers proof against kin; P3 an oath is demanded under duress
- Regime: DUAL · External Strand STR-01 · Window 3 chapters

### State Log
- ch-000 · Standing: Tearpyre keep; unhurt; anxious · Plans: G-03, G-05 Operative · Core: as declared
- ch-003 · Standing: Tearpyre keep; burned left hand; wary of Eldredge · Plans: unchanged · Core: no change

## AGT-09 · Edda the laundress · Background
- Note: gossips with the guard; source of the rumour in ch-005
```

The latest State Log line is the line at the end of an Agent's log. Every line names its chapter. `ch-000` is the opening state.

**Card fields** (after the Operative Mode Framework, §24): Want (the Stake, as Operator and Mode, see `scriptorium-manifest` references), Line (what the Agent will not do or yield), Price (what would make it yield, fixed before anyone persuades it), Leverage (what it holds over others), Tell (an observable sign of its state).

**Core / Plans / Competence** (after the Stake Calculus, §3): the Core is who the Agent is, the Plans are what it is doing, and the Competence is what it can do. A change of Core shown in behaviour is an Arc. A change of Competence is a Development. A change of Plans alone is a decision.

---

## fabula/relations.md

```markdown
## AGT-01 × AGT-04
- Label: Allies (derived: G-03 × G-12 Harmonious; Endorsement + / +)
- Pairs: G-03 × G-12 · Harmonious · since ch-000
- Log:
  - ch-009 · G-03 × G-12 · Harmonious → Strategic · cause: Callon's secret sale of the mill
```

Labels such as Ally and Rival are derived from the Pairs. A character's own label for another (what it believes) belongs in the Knowledge Matrix, not here.

---

## fabula/knowledge.md

```markdown
## Facts
- K-01 · Callon forged the black-sealed letter · Established · Reader: hidden until OBL-001
- K-02 · The assessor took Eldredge silver · Established · Reader: told ch-002

## Matrix
| Fact | Agent | Status | Source | Since |
|---|---|---|---|---|
| K-01 | AGT-04 | Knows | author of the act | ch-000 |
| K-01 | AGT-01 | Unaware | none | ch-000 |
| K-02 | AGT-01 | Knows | saw the purse, ch-002 | ch-002 |
```

Status is one of `Knows`, `Believes`, `Suspects`, `Unaware`, `Misbelieves`. Rows are appended; a changed status is a new row with the new `Since`. The latest row for a Fact and Agent is current.

---

## fabula/chronology.md

```markdown
## Calendar
- Day Index: D1 is the first day of ch-001
- Calendar Notes: harvest month; the Assize sits on D40

## Chapters
- ch-001 · Fabula: D1..D1 · Order: Linear
- ch-002 · Fabula: D1 18:00..D2 09:00 · Order: Linear
- ch-003 · Fabula: D12..D12 · Order: Linear · Offstage: D2..D12 · Hazard: AGT-01 low (disclosed by letter); AGT-04 moderate (undisclosed journey)
- ch-004 · Fabula: D-3..D-3 · Order: Analepsis

## Clocks
### CLK-01 · Eldredge calls the debt · 6 segments
- Ticks when: a payment is missed; Eldredge learns of a new creditor
- Completes: writ of seizure served on Tearpyre
- Log: ch-003 +1 (1/6) · missed Michaelmas payment
```

Fabula time is a Day Index (`D<n>`, optionally with a clock time). Analepsis and Prolepsis chapters are exempt from forward ordering. An **offstage interval** is a gap of at least the Offstage Threshold between consecutive Linear chapters; it carries a **Hazard** note: for each Principal, how likely its Core changed by a route the Record does not show (after the Stake Calculus Change Hazard, §4). A high Hazard loosens what later chapters may assume about that Agent. Clocks advance only on their declared tick conditions, never by fiat.

---

## discourse/obligations.md

```markdown
### OBL-001 · Who sent the black-sealed letter?
- Kind: Question
- Strand: STR-01
- Opened: ch-003
- Window: ch-009..ch-014
- Status: Open
- Plant: the seal's wax is grey, not Eldredge red
- Payoff: Callon's confession at the Assize
- Dual Warrant: the letter forces the debt crisis on its own terms
- Links: AGT-01, AGT-04, C-07

### OBL-006 · The burned hand will matter at the trial by ordeal
- Kind: Plant
- Strand: STR-02
- Opened: none
- Plant At: ch-008
- Window: ch-020..ch-024
- Status: Planned
```

**Kinds.**
- `Question`: a Focal Question the Reader holds (who, whether, why). Prospective when its answer is not yet fixed in the Fabula, Retrospective when it is.
- `Plant`: a disclosed detail whose significance is deferred.
- `Promise`: a commitment the telling makes about what the Reader will see (a duel announced, a journey begun).
- `Deception`: a Discourse Deception, meaning a false or withheld statement made to the Reader for its effect, whose reveal the telling owes.

**Status values.** `Planned` (declared in the Manifest, not yet planted) · `Open` · `Paid ch-NNN` · `Converted ch-NNN -> OBL-NNN` (the debt becomes a different debt) · `Released ch-NNN (reason)` (deliberately left unpaid, with the Author's assent). `Window: series` marks an Obligation whose payoff lies beyond this novel.

**Dual Warrant** states why the planted material earns its place in its own scene, independent of its payoff. See `scriptorium-drafting`.

---

## discourse/exposition.md

```markdown
### DX-01 · Sye (mental and emotional focus) · [SYS]
- Source: S-02
- First Disclosed: ch-003
- Mode: Patterned
- Registration: Patterning
- Log:
  - ch-003 · first exposure, in action only
  - ch-006 · second instance; rule implied by contrast

### DX-02 · The Assize of Ash · [LORE]
- Source: L-07
- First Disclosed: pending · scheduled Part 2
- Mode: Stated
- Registration: Unregistered
```

`Mode` is `Patterned` (registration accrued through repeated instances) or `Stated` (registration purchased by explicit statement, at full exposition cost). `Registration` is `Unregistered`, `Patterning` or `Registered`, judged against the Reader the Manifest declares. These terms come from the Worldbuilding Framework's transmissibility account; here they schedule the novel's spending, and they do not audit the setting.

---

## discourse/stale.md

```markdown
## Barred
- "a breath he didn't know he was holding"
- "something shifted"

## Limited
- "the weight of" · 2 per Part
- beat: a reveal punctuated by a smirk · 1 per Part
```

Quoted phrases are machine-checked against the Manuscript, case-insensitively. Unquoted beats and images are checked by the Operator at Self-Audit and at the Part Review.

---

## chapters/ch-NNN_slug.md

```markdown
# Chapter 3: The Black Seal

<prose; scene breaks marked with a line containing only * * *>
```

---

## ledger/ch-NNN.md (Chapter Ledger)

The Index block is parsed. The other sections are read by the Operator.

```markdown
# Ledger: ch-003 · The Black Seal

## Index
- Chapter: ch-003
- Title: The Black Seal
- Draft: retained v2 (v1 Void)
- Length: 3912
- Fabula: D12..D12
- Order: Linear
- Focalizer: AGT-01
- On Stage: AGT-01, AGT-04, AGT-09
- State Logged: AGT-01
- Obligations Opened: OBL-001
- Obligations Paid: none
- Obligations Converted: none
- Obligations Released: none
- Exposition Spent: DX-01
- Instances Added: N-01
- Setting Queries: none
- Clocks: CLK-01 +1

## Progressions
1. The black-sealed letter arrives; Aston reads the debt has been sold to Eldredge.
2. ...

## Stake Events
| Agent | Condition | Event | Cause |
|---|---|---|---|
| AGT-01 | C-07 | Disruption | debt sold to Eldredge (letter) |

## State Deltas
| Agent | Component | Before | After | Cause |
|---|---|---|---|---|
| AGT-01 | Standing | unhurt | burned left hand | caught the falling brazier |

## Goal Versions
- none

## Knowledge
| Fact | Agent | Change | Source |
|---|---|---|---|

## Claims
- AGT-09 claims the rider wore Eldredge colours (unverified)

## Key Decisions and Dialogue
- Aston refuses to answer the letter until Callon returns.

## Coincidence
- none

## Open Issues
- none
```

## ledger/_margin.md (the Margin)

A working file, kept during drafting and consumed at Chapter Close. One line per Record-relevant item, prefixed by kind:

| Prefix | Item | Goes to at Chapter Close |
|---|---|---|
| `FACT` | a new persistent fact (Provisional) | the file its subject belongs to |
| `N` | a new Instance and its licensing extract | `substrate/setting.md` Instances |
| `SQ` | a Setting Query | `substrate/setting.md` Setting Queries |
| `STATE` | a change of Standing, Core, Plans or Competence | `fabula/cast.md` State Log |
| `GOAL` | a Goal Version proposed, revised or closed | `fabula/cast.md` Plans |
| `K` | a change in who knows what, with Source | `fabula/knowledge.md` |
| `CLAIM` | an unverified assertion by a character | Chapter Ledger Claims |
| `CLK` | a Clock tick and its cause | `fabula/chronology.md` Clocks |
| `OBL+` | an Obligation opened | `discourse/obligations.md` |
| `OBL✓` | an Obligation paid | `discourse/obligations.md` |
| `OBL→` | an Obligation converted | `discourse/obligations.md` |
| `OBL×` | an Obligation released (Author assent required) | `discourse/obligations.md` |
| `DX` | a Delta concept spent | `discourse/exposition.md` |
| `STALE` | a recurrence the Operator noticed in its own prose | `discourse/stale.md` |

```
FACT  the Grey Gull's keeper is one-eyed
N     N-01 The Grey Gull · licensed by L-04
OBL+  OBL-001 who sent the letter? (Question, STR-01)
DX    DX-01 first exposure, in action only
K     K-02 AGT-01 Knows · saw the purse
CLAIM AGT-09: the rider wore Eldredge colours
CLK   CLK-01 +1 · missed payment
STATE AGT-01 burned left hand
STALE "grey" used for four different things
```

---

## checkpoints/

- `resume.md`: the latest Resumption Packet. Older Packets move to `checkpoints/archive/`.
- `part-NN-review.md`: the Part Review for Part NN.
- `checkpoint-ch-NNN.md`: a mid-Part Checkpoint, when one is taken.
- `archive/`: Cold material moved verbatim at Part Close. The audit reads three kinds of archive file:
  - `cast-part-NN.md`: compacted State Log lines under the same `## AGT-NN · Name · Tier` headers;
  - `chronology-part-NN.md`: compacted Chronology lines under a `## Chapters` header;
  - `obligations-part-NN.md`: closed Obligations, their `###` entries whole.
  Previous Resumption Packets are kept here as `resume-ch-NNN.md`.

Formats for Part Reviews and Resumption Packets are in `scriptorium-archiving`.
