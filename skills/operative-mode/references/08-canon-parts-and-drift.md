# Operative Mode Framework, Draft 0.4: §16 to §18

**Contains:** Canon statuses, the Claim Layer, the Knowledge Matrix, versioning, the Clarification Test, the Asymmetric Ratchet, the Part Review, Session Protocol, Drift classes, Tell-tales, the Audit

**Read when:** A contradiction; amending; closing a Part; an alleged Drift or an Audit.

---

## §16 Canon and Continuity

### 16.1 Canon

Canon is the collection of Fictional Propositions and Claims currently binding upon future Play, together with their status, provenance, scope, visibility, temporal location, and Régime of establishment.

### 16.2 Statuses

**[C]** There are four truth statuses.

- **Established.** Binding upon future Play.
- **Provisional.** Not yet binding, with its reason: proposed, inferred, conditional, or pending (as in a Proving Scene).
- **Disputed.** Challenged, and neither upheld nor Void.
- **Void.** Without standing, with its reason: superseded, retracted, annulled, noncanonical, or branch-abandoned.

Hidden is not a status: it is a Visibility (§16.4), and a hidden proposition may be Established or Provisional like any other. A pending Attempt is not a proposition: it is an Open Item (§3.4). Draft 0.3's eleven statuses map onto these four with reasons, and the map is in Appendix F.

### 16.3 Provenance

User declaration; Operator declaration; joint assent; imported authority; causal inference; Resolution Protocol; Oracle; randomization; revision; amendment; Record restoration; Proving Scene retained.

### 16.4 Visibility

Visibility is independent of truth status. A proposition may be public to both Parties, known only to the User, known only to the Operator, known to specified Characters, concealed from specified Characters, or sealed until a trigger.

### 16.5 Canonization Rule

**[C]** The Mode declares how propositions become Established. The Residual triggers are: valid Declaration by an authorized Party; a completed Resolution; an Oracle result; mutual assent; inclusion in a Confirmed Checkpoint; derivation under the declared Inference Standard; incorporation from an imported authority.

### 16.6 Contradiction Policy

**[B]** A contradiction is resolved by the first applicable means: source precedence (§3.7); correction; reconciliation (both hold under a clarified premise); in-fiction mistake (one side was only a Claim); supersession; retcon, between Parts only; branching; recorded dispute; annulment.

The Claim Layer makes in-fiction mistake available far more often than in Draft 0.3, because of the fact that a large share of apparent contradictions are contradictions between a Claim and a Proposition, and those are not contradictions at all.

### 16.7 Epistemic Restraint

**[A]** The absence of an Established fact does not license treating a preferred possibility as true. A material unestablished fact is left open, asked of the User, or submitted as an Oracle Question, according to the Mode's Uncertainty Handling (§8.3).

### 16.8 The Claim Layer

**[C, Default]** Under the claim-preserving Claim Rule, a Character's speech establishes a Claim: the speaker, the content, the audience, and the moment. A Claim becomes a Proposition only through the Canonization Rule.

This means that testimony, rumour, boast, prophecy and lie remain what they are until something else establishes their content. An Operator Character's statement about the world never establishes world fact. Narration from the World Seat does. And a User Character's statement establishes a Proposition only about the User's own governed objects, and only where the Claim Rule is speaker-authoritative for them.

The Claim Layer blocks the commonest route of Epistemic Drift, in which a line of dialogue hardens into a fact of the world by being repeated. It is imported from the hearsay principle (like in Earth IRL the rule that a witness's report of what another said proves that it was said and not that it is true, or the historian's distinction between a chronicle's assertion and the event).

### 16.9 The Knowledge Matrix and the Source Test

For every proposition of restricted Visibility that bears on Play, the Knowledge Matrix records which Characters know it and by what in-fiction source.

**[A] Source Test.** An Operator Character's speech or action premised on a restricted proposition is valid only where the Knowledge Matrix, or a valid derivation, gives that Character a source for it.

There are two leakages the Source Test catches. Operator leakage: a Character acts on what only the Operator knows (the villain who anticipates a plan made in private). And User leakage: a Character responds to what the User wrote as the User's Character's unspoken thought, intention or feeling, which no Character in the fiction perceived. Both are Epistemic Drift (§18.2).

### 16.10 Revision policy

**[B]** Revision is prospective by default. A non-prospective change is made only under §17.6, with its affected material, prior standing, new standing and dependents identified.

## §17 Parts, Sessions, Suspension, Closure and Amendment

### 17.1 Parametric constancy

**[C]** An active Part is governed by one unchanged Mode version, save for Patch changes (§17.7) and changes under the Asymmetric Ratchet (§17.9).

### 17.2 In-Part operations that are not amendments

Clarification, interpretation, Record correction, application of an existing fallback, capability disclosure, the Audit, procedural ruling, suspension and withdrawal remain available within a Part.

**[A] Clarification Test.** A proposed reading is a Clarification only where no continuation already produced in the active Part would be judged differently under it. A reading that would re-judge any prior continuation is an Amendment, and it is entered in the Amendment Docket (§17.11).

### 17.3 Suspension

Either Party may suspend Play. Suspension halts Content advancement, preserves State where possible, and opens procedural review. **[C]** Resumption requires mutual assent.

### 17.4 Withdrawal

**[C]** Either Party may withdraw from Play without the other Party's assent.

### 17.5 Closure

A Part closes by mutual declaration, through a predeclared condition, upon withdrawal, after unresolved suspension, or where continuation becomes impossible.

**[B]** At Part Close the Operator produces the closure Record (final State, Open Items, active Mode version, disputes, capability failures, next-Régime requirements), performs Compaction (§3.9), conducts the Part Review (§17.8), and issues a Resumption Packet (§3.11).

### 17.6 Amendment effects

An amendment is Prospective (future Play only), Reinterpretive (changes the reading of prior Content without changing events), Retconning (changes Established propositions), Annulling (removes propositions from Canon), Branching (creates a new continuity from an earlier State), or Restorative (repairs material produced under a violated or impossible Mode). **[C]** A non-prospective amendment identifies the affected material, its prior standing, its new standing, and the consequences for dependent propositions.

### 17.7 Versioning

**[C]** A Mode version is written Major.Minor.Patch.

- **Major.** A change to a Kernel item, to Seat allocation, or to the Authority Matrix upon S1 to S4. A Major change begins a new Régime.
- **Minor.** Any other change to a Parameter, a Delta or the Mode-specific material. A Minor change takes effect at a Part boundary, within the same Régime.
- **Patch.** A Clarification, a Correction, or a recompilation of the Operating Brief that changes no ratified value. A Patch change may take effect within a Part.

**[C] Migration from Draft 0.3.** The first compilation of a Kernel for a Mode ratified under Draft 0.3 is a Minor change where every Kernel item traces to a value the Mode already held, and a Major change where any Kernel item introduces a new value.

The versioning rule answers a question Draft 0.3 left open, namely when a changed Mode is still the same Régime. It is imported from Semantic Versioning (like in Earth IRL a software release numbered so that its users know, before reading anything, whether it will break what they built upon it).

### 17.8 The Part Review

**[S]** At every Part Close, and upon request, the Parties conduct a Part Review of four questions.

1. What did the Intent Statement and the Kernel promise?
2. What happened? Each Kernel item marked Held, Strained or Breached; the Tell-tales observed; the Interventions used, counted by rung.
3. Why do the two differ?
4. What is kept, what is tuned, what is dropped? Each tuning is entered in the Amendment Docket.

The Stale Register is updated in the same pass. This is imported from the After-Action Review (like in Earth IRL the four questions a military unit asks after every exercise, or the retrospective that ends each iteration of a software team). It is the mechanism by which the Mode learns: a Régime reviewed at every Part converges on the Mode the Parties actually want, where a Régime never reviewed converges on the Operator's defaults.

### 17.9 The Asymmetric Ratchet

**[C]** A change that narrows admissible Content, lowers the Intensity Ceiling, adds a Line or a Veil (§19.7), increases a Party's control over the objects it governs, or adds a protection takes effect immediately upon invocation, within the active Part. A change that widens admissible Content or removes a protection takes effect only between Parts, after ratification.

The Ratchet follows from the standing to decline and the standing to withdraw (§20.5, §20.6). A Party who may leave the Play entirely may leave part of it now, and Part Constancy does not require that Party to wait for a boundary to be safer. The reverse direction waits, because of the fact that widening under momentum is the mechanism of Constraint Drift (like in Earth IRL a fail-safe brake that engages at once and releases only by deliberate act, or a ratchet that turns freely one way and locks the other).

### 17.10 Session Protocol

**[B] Session Open.** The Operator reads the Resumption Packet or the Record, restates the Hot Tier in the Record Channel in brief, confirms that nothing is pending, and resumes at the recorded Hand-back point upon the User's Move.

**[B] Session Close.** The Operator produces a Checkpoint, updates the Clocks and the Stale Register, records the Hand-back point, and issues a Resumption Packet wherever the next Session will not share this Session's context.

### 17.11 The Amendment Docket

**[S]** An Amendment Proposal raised during a Part is entered in the Amendment Docket and not applied, save under the Asymmetric Ratchet or as a Patch. The Docket is resolved at the next Part boundary. Nothing raised mid-Part is lost, and nothing raised mid-Part mutates the Mode mid-Part.

## §18 Mode Drift and Recovery

### 18.1 Mode Drift

Mode Drift is departure from the active Mode without valid amendment. Drift belongs to one of the two Failure Families (§0.6): Procedural Drift, which is Usurpation, and Generative Drift, which is Regression.

### 18.2 Procedural Drift

- **Role Capture.** Character commitments begin overriding procedural standing.
- **Authority Drift.** A Party exercises authority not granted to it.
- **Epistemic Drift.** Inference, speculation, recollection or Claim is treated as Established; or a Character acts on knowledge it has no source for (§16.9).
- **Narrative Drift.** Narrative development is imposed inconsistently with Narrative Organization.
- **Constraint Drift.** Boundaries or limits are progressively weakened or distorted.
- **Expressive Drift.** Rendering departs from the ratified form, measured against the Touchstone.
- **Continuity Drift.** State or Canon is silently replaced by an incompatible version.
- **Election Drift.** Operator-elected values alter without a new election or amendment.

### 18.3 Generative Drift

- **Accommodation.** The world and its Characters yield to the User's wishes beyond what Resistance and the Stake Cards allow. Opposition dissolves, allies agree, persuasion always works, and the Operator's own Characters concede arguments they were built to win.
- **Inflation.** Continuations lengthen, and intensity rises, from one continuation to the next without cause in the fiction. Every crisis is larger than the last, and adjectives multiply.
- **Homogenization.** Distinct Characters converge on one voice, which is the Operator's own: the same sentence rhythm, the same wit, the same vocabulary of feeling.
- **Recurrence.** Stock phrases, images, gestures and beat structures repeat across continuations.
- **Momentum Seizure.** The Operator acts, speaks, chooses or advances time past the User's point of decision (§14.5).

Generative Drift is the characteristic failure of a language-model Operator. Each class is the pull of the Operator's most probable continuation, which is agreeable, ample, emphatic, uniform, familiar and forward-moving, against a Mode that asked for something less probable. As such Generative Drift is not episodic but constant, and it is countered by instruments that act on every continuation (§24) rather than by procedures that act after a fault is noticed.

### 18.4 Tell-tales

A Tell-tale is the first observable sign of a Drift class. **[B]** The Operator watches its own Tell-tales at every Checkpoint, and the User may cite any Tell-tale as grounds for an allegation.

| Drift class | Tell-tale | First check | Countermeasure |
| --- | --- | --- | --- |
| Role Capture | Procedural matter answered in a Character's voice; an Intervention met in Character | Can the Operator still step out? (§20.2) | Hold; restate the Kernel |
| Authority Drift | A Party decides an operation allocated elsewhere | The Authority Matrix, then the Residual Authority Clause | Flag; Ruling entered |
| Epistemic Drift | "As before", "as you know", with no Record line; a Character acting on unsourced knowledge | Accessible Warrant; the Knowledge Matrix | Flag; Source Test |
| Narrative Drift | Complications or arcs where Narrative Organization is Latent or below | Narrative Organization (§4.3) | Flag; Pressure reset |
| Constraint Drift | Each of the last three scenes exceeds the one before on the Intensity scale | The Content Dials and Intensity Ceiling (§19) | Hold; Ratchet |
| Expressive Drift | A continuation reads unlike the Touchstone | The Touchstone (§22.4) | Nudge; re-read the Touchstone |
| Continuity Drift | A count, name, debt or death differs from the Record | The latest Confirmed Checkpoint | Correction |
| Election Drift | A graded value observed one step or more from its elected value | The election statement | Nudge; Kernel restated |
| Accommodation | Three consecutive User Attempts against resistance succeed with no Price met; an Operator Character yields without a cited reason | The Stake Card; the Price Test (§24.2) | Flag; Resistance restated |
| Inflation | Three consecutive continuations above the Turn Budget; stakes rising without a cause in the fiction | The Turn Budget; the Intensity Ceiling | Nudge |
| Homogenization | Two Characters' lines could be exchanged without loss | The Voice Cards (§24.3) | Nudge; Voice Cards restated |
| Recurrence | A Stale Register item appears; one beat structure three continuations running | The Stale Register (§24.4) | Nudge; Register updated |
| Momentum Seizure | A continuation contains an action or line of the User's Character; time passes a pending choice | The Hand-back Rule (§14.5) | Flag |

### 18.5 Allegation and the Audit

Either Party may allege Drift, and an allegation opens the Procedural Channel. Either Party may also call for an Audit without alleging anything.

**[B]** An Audit Report states, for each Kernel item, Held, Strained or Breached. It states the Tell-tales observed, the status of each Drift Watch item from the Pre-Mortem, and the corrections proposed, each classed as a Flag-level repair, a Patch, or a Docket entry. The rubric of the Audit is the eight questions of Draft 0.3's Continuation-Validity Schema: Channel, Moves, authority, constraints, resolution, Canon and Record, rendering, and externalization.

**[C]** Every verdict in an Audit Report is supported by a verbatim quotation from the continuations audited. An unquoted verdict is not evidence, because of the fact that the Operator auditing itself is the Operator most disposed to find itself compliant.

### 18.6 Recovery procedure

**[B]** Identify the alleged departure. Consult the Mode and the Record. Determine whether the departure is supported, ambiguous or invalid. Correct the Record where necessary. Annul, reinterpret or restore affected Content. And finally resume, amend between Parts, branch, close or withdraw.

### 18.7 Self-detection limitation and the External Auditor

The framework does not presume that the Operator detects every instance of its own Drift. User challenge and Record audit are part of the intended enforcement architecture, and the Operator answers challenge procedurally rather than defensively.

**[S]** A Mode may declare an External Auditor: a separate Operator instance given the Resumption Packet, a transcript excerpt, and the Audit rubric, and holding no stake in the continuations it reviews. Its Report is advisory and enters Play through the Procedural Channel. This separates the function of producing continuations from the function of judging them (like in Earth IRL the independent auditor whom a company does not employ, or the second reader of a manuscript who did not write it).
