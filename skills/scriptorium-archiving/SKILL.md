---
name: "scriptorium-archiving"
description: "The Scriptorium suite's persistence stage: close a drafted chapter into the Record, and close Parts and sessions. Chapter Close covers the Retention check, consuming the Margin, the Chapter Ledger, append-only Fabula updates (Status Sheet State Logs, Arc Sheet nodes and branches, knowledge, chronology, Clocks), Discourse updates (Obligation Ledger, Exposition Ledger, Stale Register), the record audit, the Resumption Packet and the Chapter Return. Part Close covers compaction, a quote-backed Part Review of the Kernel, Regimes, PAM blocks, Arc Sheets (nodes, branches, Retention), Obligations and Drift, the Amendment Docket, and resolving Setting Queries. Use immediately after a chapter is drafted or accepted, when the Author says a chapter is done, when closing a Part, volume or arc, and before ending any session on a Scriptorium novel."
---

# Scriptorium: Archiving

This skill writes the chapter into memory. It replaces the original suite's archiving stage and keeps its two rules: **archive immediately**, and **skip nothing**. A chapter that is drafted but not archived does not exist yet as far as the next chapter is concerned, because the next chapter reads the Record, not the conversation.

File operations and formats follow `scriptorium-record` (`references/formats.md`). The Chapter Ledger template is `assets/chapter-ledger.md`. The Part Review and Resumption Packet templates are `assets/part-review.md` and `assets/resumption-packet.md`.

## Chapter Close

Run this immediately after the chapter's Self-Audit (`scriptorium-drafting`), in this order.

### 0. Retention check

Confirm that the chapter file in `chapters/` is the **retained** draft. If an earlier draft of this chapter wrote anything to the Record, mark each such line `Void (discarded draft vN)` now. Only the retained draft is canon.

### 1. Consume the Margin

Read `ledger/_margin.md`. Assign every item to its destination by prefix (the routing table is in `scriptorium-record`'s formats reference). An item that fits no destination goes to the Ledger's Open Issues. Read the chapter once more for anything the Margin missed: new named characters, new places, a changed injury, a promise made aloud.

### 2. Write the Chapter Ledger

Create `ledger/ch-NNN.md` from `assets/chapter-ledger.md`. The **Index** block is parsed by the audit, so fill every field and write `none` for an empty list. The other sections are for the Operator and the Author:

- **Progressions:** three to five numbered events. Extract them; do not retell the chapter.
- **Stake Events:** for each, Agent, Condition, Event and Cause.
- **State Deltas:** for each, Agent, Component (Standing, or a Core, Plans or Competence component), Before, After and Cause. Standing always carries the latest location, physical condition, emotional state and key relations, because these are what the next chapter reads first.
- **Goal Versions:** proposed, revised (new version, parent named) or closed (with reason).
- **Knowledge:** who learned what, from which Source.
- **Claims:** unverified assertions, attributed.
- **Key Decisions and Dialogue:** the choices and lines later chapters will need, in brief.
- **Coincidence:** any Authored Coincidence spent, with what it bought.
- **Open Issues:** logic problems, Setting Queries raised, anything left for the Author.

### 3. Update the Fabula Record (append only)

1. **`fabula/cast.md`:** for every Agent in State Logged, append one State Log line stamped `ch-NNN`. Never edit an earlier line. Update Plans with new or closed Goal Versions. Record a Competence gain as a Development. Record a Core change as such, and if it bears on a declared Arc, mark the Arc onset **Provisional**: Retention is checked at the Part Review, not now. If the change touches a PAM-bound component (a line tagged `[PAM:<ID>]`, or a Compulsion Goal), the State Log line names the tag, and an adopted revised belief adds its own (`Core: M1 non-viable → R1 Adaptive [PAM:M1] [ARC:R1]`). Never edit the Status Sheet's blocks above the State Log at Chapter Close: they are the `ch-000` declaration, and they change only by Manifest amendment.
2. **`fabula/knowledge.md`:** append a row for every change in who knows what. Add new Facts first, then the rows. When another Agent learns of a Trauma or Endowment Fact, its row names the Source. When a Belief-Filter absorbed a refutation this chapter, the row keeps the prior Status and its Source cell ends `filtered by BF<n>`.
3. **`fabula/chronology.md`:** append this chapter's line (Fabula interval and Order). If it follows an offstage interval at or above the Offstage Threshold, add `Offstage:` and a `Hazard:` note for each Principal. For each Clock that ticked, append the tick to its Log with the cause. A Clock advances only on its declared tick conditions.
4. **`fabula/relations.md`:** append to a profile's Log only when a Goal pair's Conflict Class changed, or an Endorsement turned.
5. **`fabula/arcs/AGT-NN-PFn.md`:** for every arc node this chapter reached, set its Taken branch, Chapter and Evidence (the Record line that shows it: a Relations Log line, a Goal Version closure, a Stake Event, a Knowledge row, a State Log line), and append a Log line. When the Alternative Transition Event occurs, enter its Condition and Goal Version in the Record and replace the sheet's planned lines with pointers. When a branch ends the arc (3a, 3b, 5a, 5b-ii, 7b, or node 8), set the Outcome Type; when the branch taken differs from the plan, the Outcome Type follows the branch, never the plan. Mark an adopted revised belief `adopted ch-NNN`. Append every refutation the Belief-Filter absorbed to Filtered Evidence, and a Log line for every Probe context the chapter enacted, with which belief's choice the Agent made. A node with no Record line to cite has not been reached.

### 4. Update the Discourse Record

1. **`discourse/obligations.md`:** set Opened (`ch-NNN`) and Status `Open` for each Obligation planted. Use `Paid ch-NNN` for each paid, and `Converted ch-NNN -> OBL-NNN` for each converted. A conversion creates the successor Obligation, opened in this chapter, and lists it under Obligations Opened in the Ledger. `Released ch-NNN (reason)` requires the Author's assent; without it, the Obligation stays Open and goes to the Return. An Obligation planted unplanned gets a new ID now, never a reused one. The Chapter Ledger and the Obligation Ledger must say the same thing.
2. **`discourse/exposition.md`:** for each Delta concept spent, set First Disclosed on its first spend and append to its Log. Move Registration forward only on evidence of patterning (a second or third instance, a rule implied by contrast), never on a single mention.
3. **`discourse/stale.md`:** add every recurrence the Operator noticed in its own prose, without waiting to be told: a phrase, an image, a beat pattern.

### 5. Conditional updates

| Trigger | Update |
|---|---|
| A new character appears | Background entry in `cast.md`. Supporting, with Card, Voice and State Log, if it will recur or carries a Stake |
| A character now carries a Strand | Promote its tier, and complete the blocks the new tier requires. A promotion to Principal completes its Status Sheet with a PAM block (`scriptorium-manifest` §4a), and an Arc Sheet for each Persistent Failure State (§4b): a Minor amendment, at the Part boundary |
| A new place, house, inn or minor institution of a kind the setting already has | An **Instance** in `substrate/setting.md`, with `First:` and `Licensed by:` |
| A new rule, institution kind, metaphysic or historical pattern | **Not written to the setting.** A **Setting Query** in `substrate/setting.md`, raised in this chapter, for the Author (and `worldbuilding-analysis`) at the Part boundary |
| A new state of affairs that Stakes now concern | A new Condition in `substrate/conditions.md`. A change of an existing Condition's meaning is a new **version** with its Parent |
| A new capability, skill, level or rank | Competence and a State Log line (a Development) |
| A relationship shifts | A `relations.md` Log line naming the Goal pair and the new class |

### 6. Clear the Margin

Once every item is placed, empty `ledger/_margin.md` back to its header.

### 7. Audit

```
python <scriptorium-record skill folder>/scripts/audit_record.py <novel-root>
```

The script ships with `scriptorium-record`. Locate it in that skill's folder. Fix every **error** now. Concordance must hold before the next chapter's Opening Read. Carry **warnings** to the Chapter Return.

### 8. Update the Resumption Packet

Rewrite `checkpoints/resume.md` from `assets/resumption-packet.md`, keeping it under 400 words: where the manuscript stands, the next chapter's starting point, Obligations due, live Clocks, open Setting Queries, and anything the Author has decided but the Manifest does not yet record. Move the previous Packet to `checkpoints/archive/resume-ch-NNN.md`, named for the chapter it followed. Keeping the Packet current at every Close means a session can end after any chapter without loss.

### 9. Chapter Return

Report to the Author, and deliver the chapter file:

```markdown
**Status:** Complete | Needs correction
**Length:** <n> words (<within | outside> the Band<; reason if short by design>)

**Progressions:**
- ...

**Obligations opened:** OBL-NNN <statement> · ...
**Obligations paid:** OBL-NNN <statement> (opened ch-NNN) · ...

**Record updated:** <files changed>; Ledger written; audit <clean | n warnings>

**Problems:**
- <logic gaps, Setting Queries raised, Obligations overdue, Coincidence spent, audit warnings; or "none">

**Drift:** <Tell-tales seen this chapter, or "none">
```

The Return is a report on the Record, not a summary of the prose. The Author has the chapter.

## Archiving principles

1. **Immediately.** Close a chapter as soon as it is drafted, before anything else happens.
2. **Extract, do not retell.** A Ledger records what changed. It does not narrate.
3. **Every debt by ID.** Obligation IDs and statuses are kept exactly, so that nothing planted is ever lost.
4. **State complete.** Every on-stage Principal's latest Standing (location, condition, emotional state, key relations) is in the Record after every chapter.
5. **No step skipped.** A Ledger without the Fabula and Discourse updates is half an archive.

## Common errors

- **Writing the Ledger and stopping.** The Ledger is not the archive. The State Logs, Knowledge Matrix, Chronology and Obligation Ledger must be updated too, and the audit catches the omission.
- **The Obligation Ledger out of sync with the Chapter Ledger.** Both must say the same thing. The audit checks this in both directions.
- **A new character never registered.** Every named character is at least a Background entry.
- **A broken chronology.** Every archived chapter has a Fabula interval, and an offstage gap carries a Hazard note.
- **Editing history.** A State Log line is appended, never rewritten. A correction is a new line that names the line it corrects.
- **Writing a setting change as a fact.** A new rule is a Setting Query, never an extract.
- **Archiving from a discarded draft.** Run the Retention check first.
- **Marking an arc node without evidence.** A node is reached only when the Record line that shows it can be cited on the Arc Sheet.
- **Steering a branch to the plan.** The Planned Type is a forecast. The branch taken is the one the Choice Rule and the setting produce, and the Outcome Type follows it.
- **Counting an incompetent failure as the Belief Falsification Event.** The Event requires the Initial Strategy pursued correctly; a failure caused by Incapacity leaves the Agent Iconic.
- **Calling a Development an overcoming.** A Core Fear made safe by new Competence has not been overcome.
- **Editing the PAM block to match the prose.** The block is the `ch-000` declaration. Conduct that contradicts it is either a recorded Core change, tagged, or a Breach for the Part Review.
- **Restating a PAM fact in the PAM block.** The block points; the Core, Plans, Conditions, Knowledge and Relations hold.
- **Promoting an Arc to Retained at once.** An onset is Provisional until the Part Review checks Retention on the Probe Set.

## Part Close

At the last chapter of each Part, after its Chapter Close, close the Part. This is the original suite's archive raised to the Operative Mode Framework's Part boundary: the only point at which the Manifest and the setting may change.

1. **Closure record.** Mark the Part closed in the Manifest's Version History.
2. **Compaction.** Move State Log lines older than each Agent's latest three to `checkpoints/archive/cast-part-NN.md`, verbatim, under the same `## AGT-NN · Name · Tier` headers, and leave a pointer line in the Agent's log, for example `- (ch-001..ch-009 compacted to checkpoints/archive/cast-part-01.md)`. If the files have grown heavy, move this Part's Chronology lines to `chronology-part-NN.md` (under a `## Chapters` header) and its Paid, Converted and Released Obligations to `obligations-part-NN.md` (their `###` entries, whole). The audit reads these archive files, so concordance survives compaction. Compaction moves entries; it never revises them.
3. **Part Review.** Write `checkpoints/part-NN-review.md` from `assets/part-review.md`:
   - **Kernel:** each line marked **Held**, **Strained** or **Breached**, every verdict supported by a verbatim quote from this Part's chapters. An unquoted verdict is not evidence, because the Operator is the auditor most disposed to find itself compliant. Where the harness offers subagents and the Author agrees, a **Lector** that did not draft the Part writes this section.
   - **Drift Watch:** the status of each Pre-Mortem Tell-tale.
   - **Regimes:** each declared Regime's Drift test, run against the Part.
   - **PAM:** for each Principal (and each Supporting Agent that carries a block), three checks.
     1. *Binding concordance.* Re-run the ten Coherence invariants of `scriptorium-manifest` §4a against the Record as it now stands: every `[PAM:<ID>]` tag is still in its home, the Fear Condition and Compulsion Goal still exist, the Intrapersonal pair is still in Relations, and every Trauma and Endowment is still a Fact. A bound component that a State Log line changed this Part is listed as **Touched** (chapter, tag, cause), and cross-referenced to the Arc Sheet node it belongs to, or flagged if it belongs to none.
     2. *Conduct.* Mark each of the Compulsion (in its Trigger context), the Traits, the Belief-Filter (on every filtered row) and the Persistent Failure State (on every occasion the Want's Goal was attempted) **Held**, **Strained** or **Breached**, each verdict supported by a verbatim quote, exactly as for the Kernel. A **Breach** is conduct contrary to the PAM block with no recorded Core change, which is the PAM form of Outline Seizure.
     3. *Source discipline.* No Agent acted on another's Trauma or Endowment without a Source row in the Knowledge Matrix.
   - **Arcs:** for each Arc Sheet (the protagonist's always):
     1. *Nodes.* Each node due or past due in this Part is Reached (with its branch and cited Record line), Pending within its window, or Overdue (re-windowed by Amendment, with reason). Re-check the ten Coherence invariants of `scriptorium-manifest` §4b, with a verbatim quote for the Initial Choice and for every branch taken at nodes 3, 5 and 7.
     2. *Divergence.* Where a branch taken differs from the plan, report it with the Choice Rule reasoning that produced it, and the Outcome Type it now yields. The Planned Type may be re-declared for later nodes only by Amendment, at this boundary.
     3. *Probes.* For each Probe enacted this Part, which belief's choice the Agent made, quoted.
     4. *Retention.* Where node 6 has been reached, check Retention: on the Probes enacted since, the Agent must be far from the Implicit Belief's choices and close to the revised belief's. Report Breadth (Probes showing the change, weighted by centrality) and set Retention to Retained, Further Arc (the Core moved again), or leave it Provisional with a reason. At the last Part, an arc still Iconic stays `Iconic`, and an arc stopped between nodes records the last node reached.
   - **Obligations:** each Open Obligation past or near its Window is Paid on schedule, re-windowed (an Amendment, with reason) or proposed for Release.
   - **Exposition:** Registration against the schedule; any overdraft.
   - **Coincidence:** budget spent against declared.
   - **Interventions:** how often the Author corrected the prose, and for what.
   - **Docket:** each proposed change classed Keep, Tune or Drop, and as Major, Minor or Patch.
4. **Setting Queries.** Present each open query to the Author. Resolution happens outside drafting, with `worldbuilding-analysis` wherever derivation or verification is needed. A resolved query becomes a new extract, or a new version of an extract with its Parent, effective from the next Part.
5. **Amendment and ratification.** Apply the accepted Docket items, version the Manifest, and obtain the Author's assent to Major and Minor changes. Assent is never presumed from silence.
6. **Resumption Packet.** Write it so that it passes the **Self-Sufficiency Test**: a fresh Operator given only the Packet, the Manifest and this skill set could continue the manuscript correctly. If the Record lives in storage that will not outlive the session, deliver the whole Record to the Author as an archive now.

## Session close

Before any session ends with the manuscript mid-Part: the Margin is either consumed or explicitly carried in the Packet, the Resumption Packet is current, and, if the storage is ephemeral, the Record is delivered to the Author.