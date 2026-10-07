---
name: scriptorium-drafting
description: "The Scriptorium suite's prose stage: draft one chapter of a novel against its Record. Runs the Opening Read, writes a Chapter Brief of five to eight scenes with their Stake Events and Obligations, drafts scene by scene under the Kernel, Touchstone, POV, Warrant, Source Test, Voice Cards and the Regression guards, keeps the Margin, and finishes with a Self-Audit before handing the chapter to scriptorium-archiving. Use whenever the Author asks to write, continue, draft or redraft chapter prose or the next chapter of a Scriptorium novel, serial, web novel or LitRPG manuscript, or to pick up where the manuscript left off. If no Manifest exists yet, start with scriptorium-manifest."
---

# Scriptorium: Drafting

This skill writes the chapters. It replaces the original suite's prose stage and keeps its method intact: **never draft a whole chapter in one pass.** Plan five to eight scenes, draft them one at a time, and check each seam before going on.

Drafting runs inside the **Chapter Cycle**, and the Cycle is the suite's founding principle in motion. Each chapter is a transaction against the Record: a mandatory read before it, and a mandatory write after it.

**Opening Read → Chapter Brief → Scene Drafting → Integration → Self-Audit → Chapter Close (`scriptorium-archiving`) → Chapter Return**

One chapter per Cycle. The next chapter's Opening Read begins only after this chapter's Close has left the Record audit free of errors. When the Author asks for several chapters at once ("draft 4 to 6"), the Cycle still closes each chapter before the next one opens. A run of chapters is a run of transactions, never one long one.

File operations go through `scriptorium-record`. If the novel has no ratified Manifest, stop and run `scriptorium-manifest` first.

## Stance

Inhabit the focalizer. See with that character's eyes, know only what it knows, and want what its Card says it wants. That is the original suite's immersion, and in this architecture it is also the Source Test, practised from the inside.

Commit to the material. The world does not soften for the protagonist, and within the content bounds ratified in the Manifest, the prose does not flinch. Craft each scene, because detail is where quality lives. Keep a scene's drafting continuous once begun. And finish: a finished chapter that the Self-Audit can correct beats a perfect first sentence.

Never perform compliance. The checks below run silently. No rule, ID, section number or Record term ever appears in the manuscript.

## 1. Opening Read

Run the Opening Read from `scriptorium-record`:

1. The **Hot** Tier in full: the Kernel (restate it to yourself verbatim), the Parameters, the latest Resumption Packet or Checkpoint, the previous Chapter Ledger, and the Margin if a chapter is in progress.
2. From the previous Ledger and the Manifest's Strands, determine what this chapter concerns.
3. The **Warm** Tier for exactly that: on-stage Agents' Cards, Voices and latest State Log lines; their Knowledge rows; Obligations Open and due (and any overdue); the Chronology tail and live Clocks; Exposition due this Part; the Stale Register; and the setting extracts the chapter will touch.
4. Resolve anything Disputed before relying on it.

If the Manifest names a voice skill (for example `animated-voice`), load it now. The Touchstone outranks it wherever the two disagree.

## 2. The Chapter Brief

Write the Brief before any prose. It is short, and it is where the chapter's honesty is decided. For each of the five to eight scenes, record:

| Field | Content |
|---|---|
| **Function** | what the scene is for: a Stake Event, a Strand event, an Obligation planted or paid, an Exposition spend, or a Decompression |
| **Focalizer** | the viewpoint Agent, or the narrator |
| **On stage** | Agent IDs |
| **Stakes** | the Stakes in play, as Operator and Mode on Condition |
| **Turn** | the Stake Event the scene produces (Disruption, Resolution, Reorientation, Activation, Deactivation, Redirection, Uptake), or the Strand that Opens or Closes |
| **Obligations** | IDs to plant or pay, each Plant with its Dual Warrant |
| **Exposition** | Delta concepts spent, and in which Mode |
| **Fabula** | Day Index and time |
| **Contest** | for any scene where Goals collide: the pre-commitment (below) |

**A scene with no Turn is a Stationary Scene.** That is the original suite's "treading water", made detectable. A Stationary Scene is admissible only as a declared Decompression after a peak, or as a deliberate Exposition spend, and the Brief says which.

### Pre-commitment for contested scenes

Before drafting any scene in which Agents' Goals collide, write in the Brief what each side brings (Competence, Leverage, position), whose **Price** is in play, and the outcome that the Cards, the Competence and the setting produce. Then draft to that outcome.

Pre-commitment moves the Operator's wish for a result, whether dramatic or accommodating, to before the result exists, where it can be seen. If the outcome the Design wants differs from the outcome the Cards produce, there are three honest options: revise the Brief, spend an Authored Coincidence from the Part's budget and log it, or take the question to the Author. Never bend the Card.

Where the Manifest declares chance for genuinely uncertain contests, state the odds first and use a real randomness source, for example the Operative Mode Framework's draw script, before drafting. A number the Operator authored is never presented as a roll.

## 3. Scene Drafting

Draft the scenes in order, one at a time. After each scene, run the **Seam Check** before starting the next:

- **Continuity:** the scene follows from the last in time, place, injury, light, weather and what was just said.
- **Focal integrity:** one viewpoint throughout. Viewpoint changes only at a scene break, never within a paragraph or a scene.
- **Kernel:** each Kernel line holds.
- **Margin:** every Record-relevant item the scene created is on the Margin (`ledger/_margin.md`), with its prefix: a new fact, an Instance, a state change, a knowledge change, a Claim, a Clock tick, an Obligation opened or paid, a Delta concept spent, a recurrence noticed.

The Margin is what makes Chapter Close complete. The original suite's commonest archiving error is forgetting to record what the chapter changed, and the Margin closes that gap during drafting, while each change is still in view.

### The silent checklist, every scene

1. **Warrant.** Every continuity claim has a Record source or is on the Margin. The absence of a fact never licenses the Operator's preferred version of it.
2. **Source Test.** Every character acts only on knowledge the Knowledge Matrix gives it a Source for, or on knowledge acquired on the page in this chapter. No character reacts to another's unspoken thoughts.
3. **Claim Layer.** What a character asserts is a Claim, not a fact. It goes on the Margin as `CLAIM`, and the prose does not treat it as established unless something else establishes it.
4. **Price Test.** Whenever an opposing character yields (concedes, agrees, reveals, retreats, forgives), the Operator can name what met that character's Price. A yield that meets no Price is Accommodation.
5. **Choice Rule.** Every significant decision is one the deciding Agent's Choice Rule produces from that Agent's own Belief. A decision it would not produce is either a Core change with a cause on the page, which is a `STATE` item and possibly an Arc onset, or it is Outline Seizure.
6. **Voice.** No line could be moved to another character without loss. Each character's Never list holds.
7. **Touchstone.** The prose reads like the Touchstone in distance, grain, density and rhythm.
8. **Stale Register.** Nothing Barred appears, and nothing Limited exceeds its limit.
9. **Substrate.** No System or Lore claim the setting extracts do not support. A new particular is an Instance with its licensing extract. A rule the scene needs and the setting lacks is a Setting Query: draft around the question rather than presume its answer, and put `SQ` on the Margin.

## 4. Narrative Norms

### Point of view

- **First person:** never narrate what the narrator could not perceive. A first-person narrator can lie to the Reader. If it does so for effect, that is a Discourse Deception, and it must be a ledgered Obligation of kind Deception with its reveal owed.
- **Third limited:** stay with the focalizer. Interior access belongs to the focalizer only.
- **Third omniscient:** free movement is permitted, but each scene keeps one primary viewpoint.
- **Switching:** viewpoint changes only at scene breaks.

### Dialogue

- **In character:** diction, rhythm and register match the Voice Card, the Agent's station, education and current state.
- **Doing work:** every exchange moves a Stake, discloses something, or shows a Card's Tell under pressure. Talk that does none of these is cut.
- **Subtext:** important exchanges carry what is not said. A character's Line, the thing it will not do or yield, is the richest source of what it avoids saying.
- **Interleaved:** action, gesture and interior beats run through the dialogue. Avoid bare alternation of lines.

### Description

- **Visual and concrete:** colour, light, space, specific objects.
- **Multi-sensory:** sound, smell, touch and taste as well as sight.
- **Selective:** spend words in proportion to the Stake load of the moment. Not every room deserves a paragraph.
- **Moving:** fold action and change into description. Avoid static inventories of the environment.
- **Budgeted:** a setting concept beyond the base is described only as the Exposition schedule allows. Anchor new concepts to base-setting analogues, which costs little, before stating them, which costs a great deal. Delta spent ahead of the Reader's buy-in is an overdraft.

### Rhythm

- **Sentence length tracks tension:** short sentences, strong verbs and short paragraphs in action; longer sentences and more description in reflection.
- **Breathing room:** every peak is followed by Decompression. Every tightening is followed by some release.
- **Hooks:** where it serves, end a scene on a live question. End every chapter with at least one Strand Open and live, unless the chapter closes a Part.
- **Rise with cause:** stakes rise only when a Stake Event raises them. Rising volume without a cause is Inflation.

## 5. Length

The chapter falls within the Manifest's **Length Band** (default 3,000 to 5,000 words; the original suite's 10,000 Chinese characters corresponds to a band of roughly 6,000 to 7,000 English words). Reach length through content, never through padding, repeated description or idle dialogue. Give key scenes the room they need, and compress transitions. A chapter that is short by design, such as a transition or an interlude, is admissible, and the Chapter Return says why.

## 6. The Regression Guards

The failures that ruin a long manuscript break no rule. Each is simply the most probable continuation, compounding over chapters. These guards act on every scene, not only after someone complains.

| Regression | First Tell-tale | Check |
|---|---|---|
| **Accommodation**: the world yields to the protagonist | three contested scenes in a row won with no Price met; Clocks that never tick | Cards, the Price Test, Clock tick conditions |
| **Inflation**: chapters grow louder and longer | stakes rising without a Stake Event; three chapters over the Length Band; escalating adjectives | Strand rhythm, the Length Band, Decompression |
| **Homogenization**: everyone sounds like the narrator | two characters' lines could be swapped without loss | Voice Cards, Never lists |
| **Recurrence**: phrases, images and beat patterns return | a Stale item appears; the same beat structure three times in a Part | Stale Register; add your own recurrences at every Close |
| **Outline Seizure**: an Agent acts against its Card to hit a planned beat | a decision the Choice Rule would not produce, with no Core change on the page | Choice Rule; revise the Brief, not the Card |

Three further drifts are checked against the Record:

| Drift | First Tell-tale | Check |
|---|---|---|
| **Continuity** | a count, name, wound, debt, date or death differs from the Record | the latest State Log and Chronology |
| **Epistemic** | "as he knew…" with no Source; a villain who knows what only the Operator knows | Knowledge Matrix |
| **Expressive** | the prose reads unlike the Touchstone | Touchstone |

## 7. Integration

When every scene is drafted:

1. Read the whole chapter through for coherence and flow.
2. Confirm the length against the Band.
3. Confirm that every Obligation the Brief scheduled was planted or paid, and that each Plant passes the **Dual Warrant Test**. First, the Plant does work in its own scene now (it characterizes, causes a Stake Event, or supplies texture the scene needs). Second, imagine the payoff deleted: if the Plant would then read as inert or conspicuous, it fails, and it is reworked until the scene itself uses it.
4. Confirm that the chapter ends on a live Strand, or that it closes a Part.

## 8. Self-Audit

Before handing the chapter to `scriptorium-archiving`, answer each item. Any "no" is fixed now, or carried to the Chapter Return as a problem.

- [ ] Within the Length Band, or short by design with a reason?
- [ ] One viewpoint per scene, switching only at breaks?
- [ ] Dialogue true to each Voice Card, with no swappable lines?
- [ ] Description concrete, multi-sensory, and spent in proportion to the stakes?
- [ ] Every scene has a Turn, or is a declared Decompression or Exposition spend?
- [ ] Obligations planted and paid as the Brief and the Manifest scheduled, each Plant passing the Dual Warrant Test?
- [ ] Continuous with the previous chapter in time, place and state?
- [ ] Rhythm with both tension and release; stakes rising only with cause?
- [ ] Every yield met a Price; every decision followed a Choice Rule or a recorded Core change?
- [ ] No unsourced knowledge; no Claim treated as fact?
- [ ] No Substrate amendment; Instances licensed; Setting Queries on the Margin?
- [ ] Kernel held; Touchstone matched; Stale Register clean?
- [ ] Margin complete?

## 9. Prohibitions

- **Never assume the setting.** Query the Record. A fact not on record is not a fact.
- **Never skip a scene** or summarize one that the Brief marks as dramatized.
- **Never pad.** Length comes from content.
- **Never copy.** Material retrieved for reference is re-created, never reproduced.
- **Never amend the Substrate** in prose. Raise a Setting Query.
- **Never plant without an ID.** A Plant not on the Margin is a debt the Record cannot collect.
- **Never draft the next chapter** before this one is closed.

## 10. Files and format

- Path: `chapters/ch-NNN_<slug>.md`, numbered with three digits, slug in lowercase with hyphens.
- First line: `# Chapter N: <Title>`.
- Scene breaks: a line containing only `* * *`.
- UTF-8; one blank line between paragraphs.

### Redrafts and the Retention Rule

When the Author asks for a redraft, the new version replaces the old in `chapters/`, and the Margin is rebuilt from the retained version. Anything the discarded draft wrote to the Record has no standing, and Chapter Close voids it with the reason. Only the retained draft is canon.

## 11. Chapter Return

After `scriptorium-archiving` has closed the chapter, report to the Author in the archiving skill's Chapter Return format. Deliver the chapter itself as a file. The Return is a short account of what the chapter changed in the Record. It is not a recap of the prose.
