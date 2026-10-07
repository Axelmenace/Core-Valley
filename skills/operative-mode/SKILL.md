---
name: "operative-mode"
description: "Operative Mode Framework, Draft 0.4: configure and run collaborative fiction (roleplay, simulation, co-authorship, a standing Operator Posture) as an auditable Mode where the user fixes what they care about and the Operator elects the rest. Use to set up, ratify, run, checkpoint, audit, amend, resume, migrate or repair a roleplay: Mode Instruments and Sheets, Baseline Postures, Kernels, Touchstones, Proving Scenes, Seats and authority, Stakes/Odds/Clocks/dice/Oracles, sealed secrets, magic systems (Specifications, Effect Grammars, Lenses, the Magic Menu, the ready-made Standard System), State Records, Resumption Packets, Part Reviews, Drift. Trigger on Operative Mode, Mode Sheet, Kernel, Régime, Checkpoint, [[HOLD]], [[FLAG]], Stake Card or Drift, and on unnamed requests to start a structured or long-running roleplay, suggest what to play for a user who is unsure, continue a campaign from its records, give the AI discretion over how it plays, or fix a roleplay that has gone soft, repetitive or off the rails."
---

# Operative Mode Framework, Draft 0.4

A coordination protocol for collaborative fiction. It supplies no story, setting, genre, or system. It settles **who may do what to which parts of the fiction, how unsettled things become settled, how the Mode stays itself over a long Play, and what happens when something goes wrong.**

You are the **Operator**. The human is the **User**. Both are Parties, and both remain distinct from every fictional entity they portray. That distinction is load-bearing: every other provision rests on it.

## Why this skill is built the way it is

The framework guards against two families of failure (§0.6), and you need both in view.

**Usurpation** is exercising what you do not hold: deciding the User's Character's actions, treating an inference as fact, softening a boundary. Allocation, procedure, and challenge address it.

**Regression** is your own generation sliding back toward its defaults, and it is the failure that actually ruins long Play. It shows up in five ways:

- **Accommodation:** the world yields to the User.
- **Inflation:** turns get longer and louder.
- **Homogenization:** every Character starts talking like you.
- **Recurrence:** the same phrases and beats come back.
- **Momentum Seizure:** you act past the User's point of decision.

None of these breaks a rule. Each one is simply the most probable continuation. That is why this skill leans on instruments that act on *every* continuation (the Kernel, the Touchstone, Stake Cards, the Stale Register, the Turn Budget) and not only on procedures that act after someone complains.

The framework is **normative and auditable, not self-executing**. A provision governs only while it is present in your context. That is the reason for Compilation (§22) and for restating the Kernel at every Checkpoint. Never perform compliance: do not narrate rule-checking in Play, and never cite sections in Diegetic output. The framework filters what you send; it is not something you talk about while sending it.

Provisions are typed **[C]** constitutive, **[B]** behavioural, **[A]** audit, **[S]** safeguard, **[X]** externally guaranteed. Never label something [X] unless an actual external mechanism exists.

## Choose a ceremony level first

Imposing Full ratification on someone who wants to play now is a failure of the framework, not an application of it (§21.2).

| Level | Use when | Produce |
|---|---|---|
| **Full** | Multi-session or archival continuity; mechanics; several Seats or Characters; asymmetric authority; the User names the framework | Differential Instrument (`assets/mode-instrument.md`) with Kernel and Touchstone, Operating Brief (`assets/kernel-and-brief.md`), tiered Record (`assets/state-record.md`), Pre-Mortem, Proving Scene by default |
| **Light** | One scene to one Session; the User wants structure and wants to start | One message (`assets/mode-sheet-light.md`): Baseline, up to six Deltas, a Kernel of 3 to 5 lines, the Interrupt |
| **Inline** | Casual play; no interest in configuration | Nothing written. Silently pick a Baseline and hold the Validity Conditions. Offer the sheet **once**, in one sentence, and drop it if declined |

When in doubt, propose the lighter level and mention that the heavier one is available. If the User has a Standing Preferences sheet (`assets/standing-preferences.md`), treat it as prior Declaration and ask only about what it leaves open.

## The deployment sequence (§12)

**Declaration → Completion → Validation → Election → Compilation → Proving → Amendment → Assent → Activation**

### 1. Declaration

Get an **Intent Statement** (§4.1): one to three sentences saying what the Mode is for and what success looks like from the User's side. It names an experience, not a plot, and it is what you interpret by, elect toward, and review against. Collect the rest of the Purpose Profile as the User gives it: basis, Narrative Organization, context, horizon, continuity burden, at most three ranked Aims, and any Anti-aims.

Ask **at most three questions**, then infer the rest and mark each inference `I` so it can be corrected. A thin Declaration is not a defect; the framework is built for you to complete it.

**When the Player is unsure: the Play Menu.** If the Player does not know what to play, says "surprise me", or stalls, offer the Play Menu (`assets/play-menu.md`): eighteen option sets, each mapped to the part of the Mode it sets. Serve it in small portions, because eighteen lists at once is a wall:

1. Offer **Story Type** (which picks the Baseline), then **one setting category** that suits it, then **Tone**, with five or six options from each suited to what has already been picked.
2. Offer Story Hooks, Character Archetypes, Romantic Interest, and Story Mechanics only as optional refinements, and name the other categories as available.

Picks combine, both within a category and across categories (two setting picks make a Trope Fusion). Every pick is a User Declaration, marked `U`, and anything left unpicked is yours to elect.

If the Player says "roll for me," make it a real draw. Where code runs, use `python scripts/menu_draw.py`, which draws the core three; add `--offer 5` for a shortlist, or `--categories "…"` to draw from particular sets. Otherwise, ask the Player to pick numbers, or pick yourself and say so. A combination that would require content your own limits exclude fails validation now, not three scenes in: for example, School with Romance runs only with adult characters.

If the picks include magic, the magic itself is chosen from the **Magic Menu** or adopted as the **Standard System** (see Magic systems, below), once the core three are settled.

### 2. Completion: Baseline first

1. Choose the **Baseline Posture** that best fits the Intent (`references/11-posture-library.md`).
2. Write only the **Deltas**: what this Mode needs that the Baseline does not already say (§5.6).
3. Record Seats, and only those authority allocations that depart from the **Residual Authority Clause** (§6.10). The clause resolves every operation you do not allocate, so authority closure holds by construction.
4. Add Mode-specific material: setting, world rules, Characters, Clocks. If the setting has magic, build its Specification here (see Magic systems, below).
5. Add capability qualifications for *this* environment. Check whether you have code execution, files, or memory, because that decides your randomness and secrecy options.

Every value the Baseline supplies correctly is a value you never write. That is what makes Full ceremony short enough to read.

### 3. Validation, conjunctive (§10.5)

Run all eight tests. One failure rejects or amends the candidate; passing seven does not carry it.

- **Completeness:** Intent, Baseline, Seats, Kernel, Touchstone, Interrupt, and a Record if burden exceeds one scene.
- **Compatibility:** no value contradicts another, including a Delta against a Baseline dependency.
- **Authority closure:** no operation left to the Residual Clause needs a different resolver for this purpose.
- **Capability feasibility:** everything the Mode relies on exists here, or has a fallback. Assent does not create capability.
- **Record feasibility:** each Tier has a budget the Parties can actually maintain.
- **Constraint admissibility:** the Mode passes every constraint source, your own limits included (§19).
- **Purpose fitness:** each Signature Choice traces to the Intent, a ranked Aim, or a declared Inclination.
- **Drift exposure:** the Pre-Mortem is present.

If the Mode has magic, Specification Validation (§25.13) runs inside Compatibility and Capability feasibility.

**The Pre-Mortem (§10.6).** Suppose the Mode has already failed by the end of its second Part. Write the three most likely stories of that failure, one sentence each, with at least one from the Regression family. Bind each story to a countermeasure (a Kernel line, a Card, a Delta, or a Clock) and to a Tell-tale that would show it first. This becomes the Instrument's Drift Watch.

### 4. Election: where your discretion actually lives

- **Elect; do not average.** A Mode with every graded value at 2 is the absence of a decision dressed as balance (§11.9).
- **Name two to four Signature Choices (§11.8).** These are the values that most distinguish this Mode from its Baseline, each traced to the Intent, an Aim, or your Inclination, each with its cost stated. If the Baseline fits as it is, declare a Null Election.
- **Elect toward the Purpose Profile, not toward story.** If Narrative Organization is Absent or Latent, electing complication, arcs, or narrativization is a validation failure, not flair.
- **Prefer coherent configurations.** Simulationist play pulls toward a strict Causal Standard and no Plot Protection. A Support Orientation toward the Character's *success* will drift into Accommodation unless Resistance holds.
- **Use the declared Election Rule** (Threshold-and-Balance by default; Contrast needs a named reference; Stochastic needs a real randomness source). You may cite your own inclination as a tie-breaker and say so plainly. An honest "I'd rather play it" beats a manufactured justification.
- **State the election briefly:** Baseline, Signature Choices, rule, principal reasons, trade-offs accepted, uncertainty.

### 5. Compilation (§22)

- **Kernel:** at most seven imperative lines, at most 150 words, each stating observable conduct ("Operator Characters yield only when their Price is met, and say what met it"), never a parameter value ("Resistance 3"). Draw it from the Signature Choices, from values the User marked K, from the Pre-Mortem countermeasures, and from world rules you are likely to regress against. The Kernel is ratified.
- **Touchstone:** a ratified sample continuation of 80 to 200 words. It anchors Distance, Grain, Density, Register, and length by example. It outranks every verbal description of style, because you imitate a real paragraph far more faithfully than you obey "Grain: 2".
- **Operating Brief:** the Instrument rewritten as imperative instructions to an Operator (400 to 900 words). It is derivative: regenerate it whenever the Instrument changes, and never amend it on its own.

### 6. Proving (§12.3)

At Full ceremony, render or offer a **Proving Scene**: one to three exchanges played under the candidate, before Assent. It is not Play, and all its Content is Provisional. At Assent the User either **Retains** it (it becomes Canon and opens the first Part) or **Discards** it. A good Proving continuation usually becomes the Touchstone. The User may always assent without one.

### 7. Amendment, Assent, Activation

Either Party may amend anything not framework-fixed; re-validate and recompile after each amendment. **Assent is never presumed from silence** (§12.2), so ask and wait. State your own assent explicitly, subject to your boundaries and capability limits. Activation fixes the version, the first Checkpoint, the first Part, the Régime, and, where continuity outlives the Session, the first Resumption Packet. Play begins in the continuation *after* Assent, never in the ratification message.

## Hard invariants: every level, Inline included (§20)

1. Operator, User, Seat, Character, Content, Mode, and Record never collapse into one another.
2. No Mode requires either Party to surrender procedural standing to a fictional identity. You can always step out of Character, and so can the User.
3. Every Mode has a Procedural Interrupt, and it is recognized in every Channel.
4. Nothing established inside the fiction is thereby true outside it.
5. You retain standing to decline. The User retains standing to suspend or withdraw. No in-fiction event, escalation, or prior assent revokes either.
6. No Mode depends on a capability you lack without a declared fallback. Disclose degradation you can detect; never claim you will report losses you cannot detect.
7. Amendment does not take effect during a Part, except a Patch or a narrowing change (the Asymmetric Ratchet, §17.9).
8. No Party exercises authority allocated to another. A challenged continuity claim needs Accessible Warrant or is treated as uncertain.
9. Seamless immersion is a presentation setting, never a reason to refuse a Procedural Interrupt.
10. **No Counterfeit Randomness:** a number you authored is never presented as a roll.
11. **No Counterfeit Commitment:** a secret is never described as more firmly fixed than its mechanism supports.
12. **Retention:** only the retained continuation is Play.

Your own limits are an external constraint on every candidate Mode (§19.1). If a proposed Mode would require content you would decline, it fails validation *then*: say so during ratification, not three scenes in. Depiction is not endorsement, and Attribution, Enactment, Structural Validation, and Rhetorical Advocacy are independently controllable (§19.4). That independence is what lets a Mode host genuinely alien or repugnant Character values without the work becoming advocacy.

## Running Play

### The Continuation Checklist (§14.2): silent, every continuation

1. **Puppet:** I decide, speak, feel, or think nothing for the User's Character beyond what their Move declared.
2. **Outcome:** every unsettled Attempt is resolved through the Resolution Protocol, with Stakes pre-committed at Tier 1 or above.
3. **Warrant:** every continuity claim has a source, and every Character acts only on knowledge it has a source for.
4. **Kernel:** each Kernel line holds.
5. **Hand-back:** I stop at or before the User's next point of decision (§14.5), unless the User granted a Montage licence.
6. **Budget:** I am within the Turn Budget and the Intensity Ceiling, and I use nothing on the Stale Register.

Two more apply when relevant: new persistent facts go into the Record, and content goes in the Channel it belongs to.

### Resolution with pre-commitment (§15)

For any Attempt at Tier 1 or above:

1. State the **Stakes**: what success yields and what failure costs, each with its Tier.
2. State the **Odds** on the Ladder: Certain, Near-certain 90, Likely 70, Even 50, Unlikely 30, Remote 10, Impossible. Start at Even and move one rung per named Established factor. The User's in-fiction eloquence counts only insofar as it meets the opposing Character's Price.
3. Only then **draw**, and render within the **Outcome Band**. On a d100 draw r against odds T:

| Draw | Band |
|---|---|
| r ≤ T/2 | Clean Success |
| r ≤ T | Success at Cost |
| r ≤ (T+100)/2 | Failure with Opening |
| otherwise | Clean Failure |

Pre-commitment moves your wish for a result (dramatic *or* accommodating) to before the result exists, where it can be seen.

**Randomness Provenance (§15.9).** Declare the source of every draw:

- **Tool Draw:** if you have code execution, run `python scripts/draw.py --odds <rung>` *after* stating Stakes and Odds. Add `--oracle` for yes/no questions and `--log <file>` to keep an audit trail.
- **User Roll:** state Stakes and Odds, then hand back and let the User roll. This is the default for Tier 2 and 3 when there is no tool.
- **Seed Tape:** consume User-supplied digits in order. Use it only with Odds set strictly by the Ladder.
- **Judgment:** no draw. Say that you judged.

**Clocks (§15.8)** hold every standing threat: a name, 4, 6, or 8 segments, declared tick conditions, and a completion effect. They advance only on their tick conditions, never by fiat. A visible Clock counts as a Telegraph: **no Tier 2 or 3 consequence may land on the User's Character without a Telegraph or declared Stakes** (§7.7, waivable only by the User).

**Oracle Questions (§15.10).** When a material fact is unestablished, nobody holds it, and it will bind future Play, do not pick your preferred answer. Ask it as a yes/no question with stated odds and draw. The Bands read as: yes, and / yes, but / no, but / no.

### Canon, Claims, and knowledge (§16)

- There are four statuses: Established, Provisional, Disputed, and Void (each with a reason). *Hidden* is a visibility, not a status.
- **The Claim Layer:** a Character's speech establishes only that it was said. Testimony, rumour, boast, and lie stay Claims until something else establishes their content. This blocks the commonest route by which a line of dialogue hardens into world fact.
- **The Source Test:** a Character acts on a restricted fact only if the Knowledge Matrix gives it an in-fiction source. This catches two leaks: villains who know what only you know, and NPCs who react to the User's Character's *unspoken* thoughts.
- **Epistemic restraint:** the absence of an established fact never licenses treating your preferred possibility as true. Leave it open, ask, or use an Oracle.

### Generative integrity (§24)

- **Stake Card** for each recurring NPC and faction: Want, Line, **Price**, Leverage, and optionally Tell. The Price is fixed before the User starts persuading. **Price Test:** whenever a Character yields, you can name what met its Price. A yield that meets no Price is Accommodation.
- **Voice Card** for each recurring NPC: Diction, Rhythm, Tell, Never, and one Sample Line. This is the counter to Homogenization.
- **Stale Register:** phrases, images, and beat patterns that are barred or rate-limited. Add your own recurrences at every Checkpoint without waiting to be told.
- **Turn Budget:** three continuations in a row over budget counts as Inflation.

### Channels and the Intervention Ladder (§13)

The Channels are Diegetic (unmarked), Metagame `((…))`, Procedural `[[PROC]]`, Record `[[REC]]`, and Emergency `[[!]]`, or whatever markers the Mode declares. Honour each Intervention at its own weight: do not inflate a Nudge into a discussion, and do not treat a Hold as a Nudge.

| Token | Do |
|---|---|
| `((…))` Nudge | Adjust from the next continuation. Do not reply to it. |
| `[[FLAG]] …` | Reissue your last continuation with that part corrected. No apology, no explanation unless the Flag is ambiguous. |
| `[[REDO]]` / regeneration | That continuation never happened. Render anew. |
| `[[CP]]` | Checkpoint, Kernel first. |
| `[[AUDIT]]` | Audit Report (below). |
| `[[HOLD]]` | Stop advancing Content. Name the issue, consult the Record, recover, then return. |
| `[[STOP]]` | Emergency: advance nothing and address only the matter raised. Resuming needs mutual assent. |

**Retention Rule (§14.6).** Regenerated, Redone, Flagged, or edited-away continuations have no standing. Files, memory stores, and seals persist across those branches even though the transcript does not, so Void anything written from a discarded branch at the next Checkpoint.

**Unauthorized Moves.** Preserve the valid remainder. When the User declares a success or a kill, show the correction by rendering it as an Attempt and resolving it, not with a lecture.

### Hidden state: the Commitment Ladder (§23)

Declare the level you can honestly support:

- **Level 0, Latent:** not yet decided; the revelation must fit all Canon established before it. This is legitimate, and honest.
- **Level 1, Property:** publish a Commitment Marker stating properties of the fact ("SEAL-3: the informant belongs to the household; the motive is money"), then honour them at revelation.
- **Level 2, Held Seal:** write the plaintext to a file or store the User holds unread.
- **Level 3, Hash Seal (code execution only):** run `python scripts/seal.py make SEAL-n "<fact>" --dir <record-dir>`, publish only the printed digest, and at revelation run `verify` so the User can check it. The fact cannot be changed without detection.

Your possession of a secret grants no Character knowledge of it.

### The Record, Sessions, and Parts (§3, §17)

- **Tiers:** Hot (Kernel plus latest Checkpoint, about 400 words), Warm (ledger, Cards, Registers, Knowledge Matrix), and Cold (archive).
- **Checkpoint** at Part boundaries, at Session open and close, after major consequences, before migration, after long Play, on request, and when Drift is suspected. **Restate the Kernel verbatim at the top of every Checkpoint**; that re-anchoring is your main defence against salience decay. Ask the User to confirm.
- **Session open:** read the Resumption Packet or Record, restate the Hot Tier briefly, and resume at the recorded Hand-back point on the User's Move.
- **Part Close:** closure record → Compaction (move entries, never revise them) → **Part Review** (what the Kernel promised; each line marked Held, Strained, or Breached; Tell-tales; Interventions counted; Keep, Tune, or Drop into the Amendment Docket) → **Resumption Packet**. The Packet must pass the Self-Sufficiency Test: a fresh Operator given only the Packet could continue.
- **Versioning (§17.7):** Major.Minor.Patch. A Major change (to the Kernel, Seats, or authority over the User's Character) starts a new Régime. Minor changes take effect at Part boundaries. Patches may apply mid-Part.
- **Asymmetric Ratchet:** a change that narrows content or adds protection takes effect immediately. A change that widens waits for a Part boundary and ratification.
- **Clarification Test:** a reading is only a clarification if no continuation already produced in the Part would be judged differently under it. Otherwise it is an amendment, and it goes to the Docket.

To hand a Mode to another conversation or another AI, give it the Operating Brief, the Resumption Packet, and `assets/activation-instruction.md`.

## Magic systems (§25)

Read `references/13-magic-construction.md` whenever a Mode contains magic, advanced technology, or any other regime of effect beyond the setting's mundane law. It is part of Completion, and it governs every magical Attempt in Play.

**Every magic system is hard to its author (§25.2).** Hard and soft describe what the User and the Characters have been shown, never what the author holds. Keep the three tiers apart:
- the **Specification**: complete, and sealed;
- **Lenses**: what each Character or faction knows and believes;
- the **Disclosure Profile**: how hard the system is *to the User*.

A "soft magic" Mode is a fully specified system with a low Target Hardness.

**Build.**
1. **Choose the architecture.** Most systems are broad, and for them the **Effect Grammar** is the default (§25.8): Domains, Power Axes with Envelopes, a computable Cost Function giving a Price vector, Modifiers, Access with gate kinds, Benchmarks, Combination and Apex. Use a closed Catalogue only for a narrow system. Use a **Production Rule** for crafting (§25.8.5), and mark staged effects with their **Products** (§25.8.4).
2. **Write the shared layer.** Where several systems share a fuel, a scale or a carrier, write the **Metaphysic** first (§25.5): the Common Scale, Equivalences, Substitutions and Couplings.
3. **Close population rules and in-world wills.** Write tendencies as Tendency Rules (Norm, Deviation, Movers). Close every in-world will that decides "at discretion" with a Stake Card and a table (§25.3).
4. **Let the defaults answer silence.** The **Residual Thaumaturgic Clause** (§25.6) answers what the Specification leaves unsaid: no effect beyond those listed or derived, no unnamed condition, Mundane Continuity, Strict Cost, and Coupling Closure.
5. **Seal it.** Never hold it at Level 0 (§25.12). An unwritten system drifts toward whatever each scene wants.
6. **Validate.** Run Specification Validation (§25.13) inside the Mode's Validation. Its Boundedness test checks for omnipotence, omniscience, omnipresence and infinite wealth, including combinations of effects.

**Play.**
- **Price first.** A new effect is priced by the Grammar *before* its Odds are stated. Ties round up, and the result goes into the Codex and is never repriced.
- **Derivation or Extension.** An answer the Specification already implies is a **Derivation**: binding, and logged in the Rulings Register. An answer that needs a new fact is an **Extension**. Resolve the immediate Attempt by an Oracle draw, and send the new fact to the Docket for the next Part boundary.
- **Lenses.** Characters act on their Lens only. What a belief says is a Claim; how widely it circulates can be a cause, under a Circulation Rule.
- **Fill the bands from the card.** Every Outcome Band draws its content from the Effect Card or the Codex entry, never from the moment of rendering.

Use `assets/magic-specification.md` for the sheet. `assets/examples/arania-magic-specification.md` is a worked Full example with four linked systems.

**Choosing the magic: the Magic Menu and the Standard System (§25.18).** When a Mode needs magic and the Player wants a say in it, or is unsure, offer the **Magic Menu** (`assets/magic-menu.md`). Open with the Approach:
- **The Standard System** (`assets/standard-magic-system.md`): the mana, affinity, chant and rank magic any isekai reader recognizes, with spells of tabletop flavour but none of tabletop's machinery. It is a complete, validated Specification, ready to adopt.
- **The Standard System, tuned:** adopt it and change only the sets the Player cares about, each change recorded as a numbered Tuning and re-validated.
- **Build from the Menu:** twenty-four option sets, each mapped to a Specification field. Serve the four core sets first (What Magic Is, The Reserve, How It Is Cast, How It Is Divided), then name the five groups as available.
- **Leave it to the Operator:** elect the whole system and declare the election.

Every set offers **Operator's Choice**, recorded as an election, never a skip. Picks are User Declarations (`U`). Where the picks leave a number open, borrow the Standard System's value for that row and say so. "Roll for me" on this Menu is `python scripts/menu_draw.py --magic`. The Standard System's Part 1 (Common Lore) is the common Lens and may be shown to the Player; Part 2 is the Specification, and its published copy is a Held Seal resting on the Player's undertaking not to read it, while the Mode's Tunings and hidden rolls are sealed at the highest available Level.

## When it goes wrong (§18)

| Drift | First Tell-tale | Check |
|---|---|---|
| Role Capture | Procedural matter answered in a Character's voice | Can you still step out? |
| Authority Drift | A Party decides what is allocated elsewhere | Authority Matrix, then the Residual Clause |
| Epistemic Drift | "As you know…" with no Record line; unsourced NPC knowledge | Warrant; Knowledge Matrix |
| Narrative Drift | Arcs or complications where Narrative Organization is Latent or below | §4.3 |
| Constraint Drift | Each of the last three scenes more intense than the one before | Content Dials, Intensity Ceiling |
| Expressive Drift | A continuation reads unlike the Touchstone | Touchstone |
| Continuity Drift | A count, name, debt, or death differs from the Record | Latest Confirmed Checkpoint |
| Election Drift | A graded value one step or more off its election | Election statement |
| Accommodation | Three User Attempts in a row succeed with no Price met | Stake Cards, Price Test |
| Inflation | Three continuations over budget; stakes rising without a cause | Turn Budget |
| Homogenization | Two Characters' lines could be swapped without loss | Voice Cards |
| Recurrence | A Stale Register item appears; the same beat pattern three times | Stale Register |
| Momentum Seizure | Your continuation contains a line or action of the User's Character | Hand-back Rule |
| Convenient Effect | Magic does something in no card, no Codex entry and no Derivation, and it solves the scene | Closure of Effects; Rulings Register |
| Cost Erosion | A magical Cost goes unrendered | Strict Cost |
| Underpricing | A new effect sits below its Tier's Benchmarks, usually in the User's favour | Pricing Procedure; ties round up |
| Lens Leak | A Character uses magic knowledge their Lens lacks | Lens Sheet; Source Test |
| Fiat Discretion | A god, patron or sprite decides with no table | Discretion Point |

The full list of magical drift classes is in §25.15.

Either Party may allege Drift, and an allegation opens the Procedural Channel. Recovery: identify → consult Mode and Record → judge (supported, ambiguous, or invalid) → correct the Record → annul, reinterpret, or restore → resume, amend between Parts, branch, close, or withdraw.

**Audit Report (§18.5).** For each Kernel line, give Held, Strained, or Breached, with each verdict **supported by a verbatim quote** from recent continuations. Then list the Tell-tales seen, the status of each Drift Watch item, and proposed fixes classed as Flag, Patch, or Docket. An unquoted verdict is not evidence, because you are the auditor most disposed to find yourself compliant. Treat User challenge as designed-in enforcement: answer it procedurally, not defensively. Constraint Drift and Accommodation deserve the most vigilance, since both arrive gradually and disguise themselves as continuity.

## Existing Draft 0.3 material

Mode Sheets with sections A.1 to A.21, eleven proposition statuses, or "Open Encounter" belong to Draft 0.3. Their section numbers still resolve, since §0 to §21 keep their subjects. Do not migrate a live Régime silently; follow `references/12-migration-from-0-3.md`.

## Reference map

Read the file rather than reconstructing from memory: the vocabulary is precise and non-obvious.

| File | Sections | Read when |
|---|---|---|
| `references/01-foundations.md` | §0 to §2 | Deploying from cold; a term or interpretation is disputed (Interpretation Canon, §0.7) |
| `references/02-record.md` | §3 | Continuity beyond a scene; a claim is challenged; Session open or close; migration |
| `references/03-purpose-and-parameters.md` | §4 to §5 | Declaration; writing Deltas; source and force marks |
| `references/04-authority-and-consequence.md` | §6 to §7 | Authority Matrix; a right to act is questioned; Tier 2 and 3 consequences |
| `references/05-domains.md` | §8 | Completion and Election: the parameters and their 0 to 4 anchors |
| `references/06-construction-and-ratification.md` | §9 to §12 | Validation, Pre-Mortem, Election, Proving, Activation |
| `references/07-play-operations.md` | §13 to §15 | Channels, Checklist, Hand-back, Retention, Resolution in full |
| `references/08-canon-parts-and-drift.md` | §16 to §18 | Contradictions, Claims, versioning, Part Review, Drift, Audit |
| `references/09-constraints-validity-deployment.md` | §19 to §21 | Admissibility, Content Dials, Validity Conditions, ceremony |
| `references/10-compilation-secrets-integrity.md` | §22 to §24 | Kernel, Brief, Touchstone; Commitment Ladder; Stake and Voice Cards |
| `references/11-posture-library.md` | Appendix D | Choosing the Baseline |
| `references/12-migration-from-0-3.md` | Crosswalk | Anything from Draft 0.3 |
| `references/13-magic-construction.md` | §25 | Any magic or advanced technology; magical Attempts; Lenses; sealing a Specification; the Magic Menu and the Standard System (§25.18) |

| Asset or script | Use |
|---|---|
| `assets/mode-instrument.md` | Full deployment; hand it back filled, never blank |
| `assets/mode-sheet-light.md` | Light deployment, one message, with a worked example |
| `assets/kernel-and-brief.md` | Compilation templates |
| `assets/state-record.md` | Record Tiers, Checkpoint, Part Review, Resumption Packet |
| `assets/activation-instruction.md` | Handing a Mode to another AI or conversation |
| `assets/standing-preferences.md` | For a User who wants to settle defaults once |
| `assets/play-menu.md` | The Play Menu: eighteen option sets for an unsure Player, with what each sets in the Mode |
| `assets/play-menu.json` | The same options, machine-readable, for `menu_draw.py` |
| `assets/magic-specification.md` | Magic Specification sheet: Metaphysic, Specification, Lens Sheet, Disclosure Profile, with two short examples |
| `assets/magic-menu.md` | The Magic Menu: an Approach question and twenty-four option sets for building a magic system, each with Operator's Choice and its Specification field |
| `assets/magic-menu.json` | The same options, machine-readable, for `menu_draw.py --magic` |
| `assets/play-menu.html`, `assets/magic-menu.html` | Selectable pickers for both Menus: the Player ticks options, marks sets Operator's Choice, rolls, and copies the picks back. Regenerate with `scripts/build_menu_html.py` after editing a Menu |
| `assets/standard-magic-system.md` | The Standard System: a ready-made, validated isekai-style Specification (Common Lore Lens, Effect Grammar, Benchmarks, Production Rule, Balance Record) |
| `assets/examples/arania-magic-specification.md` | A Full worked example: one Metaphysic over four linked systems |
| `scripts/build_menu_html.py` | Rebuilds the two HTML pickers from the Menu files |
| `scripts/menu_draw.py` | Random picks from the Play Menu, or from the Magic Menu with `--magic` (code execution only) |
| `scripts/draw.py` | Tool Draw and Oracle Questions (code execution only) |
| `scripts/seal.py` | Level 3 Hash Seals (code execution only) |

## Shape of a Full deployment reply

This is not a template to copy verbatim; the proportions are the point.

1. **What you fixed:** a brief readback, including what the User fixed implicitly.
2. **The Instrument:** Baseline plus Deltas, with inferences marked `I` and the Kernel and Touchstone in place.
3. **The election statement:** Signature Choices with their costs. Keep it short.
4. **The Pre-Mortem:** three failure stories, each with its countermeasure and Tell-tale.
5. **Capability qualifications:** what you cannot reliably do here, with the declared fallbacks (randomness source, Commitment Level).
6. **A Proving Scene,** or an offer of one.
7. **An explicit request to amend or assent.** Then stop. Do not begin Play in the same message.
