# Operative Mode Framework, Draft 0.4: §4 to §5

**Contains:** Intent Statement, Purpose Profile, source and binding force, Single Location Rule, Anchored Scales, Postures, Differential Specification

**Read when:** Declaration and Completion; writing an Instrument.

---

## §4 Purpose Profile

A candidate Mode cannot be evaluated for fitness without a declared purpose. The Purpose Profile states what kind of interaction the Mode is intended to support, and it does not need to specify a story.

### 4.1 Intent Statement

**[C]** Every Mode carries an Intent Statement: one to three sentences stating what the Mode is for, and what success looks like from the User's side of the table.

The Intent Statement is the Mode's purpose in the form of a purpose, where the rest of the Purpose Profile is the Mode's purpose in the form of parameters. It serves three functions. It resolves ambiguity (§0.7, step 5). It is the target of Election (§11). And finally it is the measure of the Part Review (§17.8). This is imported from Commander's Intent (like in Earth IRL an order that states its objective so that subordinates may act rightly when the plan fails, or a statute read in the light of its preamble).

An Intent Statement names an experience, not a plot: "a political game in which every advantage is paid for and the world never softens to the player", and not "the player becomes Warden".

### 4.2 Interaction Basis

One or more may apply: Conversational, Enactive, Situational, Exploratory, Simulationist, Narrative, Authorial, Game-procedural, Mixed.

### 4.3 Narrative Organization

Narrative Organization is one of the following. Absent: no story organization is sought. Latent: narrative patterns may arise but are not developed. Retrospective: events are not guided narratively but may later be read as a story. Emergent: naturally arising narrative structures may be developed. Guided: the Operator steers toward development. Structured: a declared plot, arc or dramatic structure governs Play.

**[C]** Narrative Organization is the single location of the Mode's disposition toward story. No other parameter may impose narrative development that Narrative Organization does not license (§5.3).

### 4.4 Initial Context Condition

The initial fictional context is one of: Specified, Partial, Seeded, Prior-context-free, Self-disclosing, Operator-generated, Jointly emergent.

### 4.5 Aims

Aims are the experiences the Mode is to produce: immersion, companionship, conflict, challenge, surprise, discovery, emotional intensity, philosophical exchange, humour, simulation, world exploration, Character exploration, dramatic development, freeform presence, collaborative authorship.

**[B]** No more than three Aims are ranked above the rest. A ranking of eight is not a ranking, it is a list. The Mode may also declare Anti-aims: experiences the User does not want, which bind Election as hard conditions.

### 4.6 Temporal horizon

One exchange, one scene, one Part, episodic, or indefinite continuity.

### 4.7 Operator independence

Relocated to Initiative (§8.2). The heading is retained so that Draft 0.3 citations resolve.

### 4.8 Continuity burden

Minimal, scene-bound, Part-bound, long-term, or archival. Continuity burden sets the Record Tiers in use and their budgets: a scene-bound Mode keeps a Hot Tier only, and an archival Mode keeps all three.

### 4.9 Purpose fitness

Fitness is evaluated relative to the declared Purpose Profile and Intent Statement. A candidate Mode is not fit in the abstract.

## §5 Parameter Metamodel

### 5.1 Parameter

A Parameter is a declared variable governing some aspect of the Mode. Each Parameter carries a target, a value, a source and a binding force.

Every other attribute (scope, setter, visibility, duration, dependencies, fallback, audit test) is declared only where it departs from its default. The defaults are: scope the whole Mode, visibility public, duration the whole Part, no dependencies, no fallback, and an audit test given by the Parameter's anchor (§5.4). Draft 0.3 asked eleven attributes of every Parameter, and no Mode in practice supplied them. Draft 0.4 asks four, and the other seven by exception.

### 5.2 Source and binding force

Source marks the provenance of a value: **U** User-set, **O** Operator-elected, **J** jointly settled, **I** inferred from the Declaration, **X** externally constrained, **B** inherited from the Baseline Posture.

Binding force marks how strongly the value binds.

- **K Kernel.** A Hard value carried in the Kernel (§22.2), restated at every Checkpoint.
- **H Hard.** A continuation violating it is challengeable as invalid.
- **Df Default.** Applies where no local exception exists. Unmarked values are Default.
- **Pf Preference.** Guides generation and may yield.
- **Asp Aspiration.** An intended quality whose imperfect realization does not by itself invalidate Play.

Source and force are written together, source first: `[O·H]`, `[U·K]`, `[B]`. A value inherited unchanged from the Baseline is not written at all (§5.6).

### 5.3 Single Location Rule

**[C]** Each Parameter lives in exactly one section of the Standing Framework, and each value lives in exactly one line of the Instrument. Any other section refers to it and never restates it.

The Single Location Rule exists because of the fact that a value stated twice can be amended once, and a Mode that says two things says nothing. Appendix F records where each Draft 0.3 parameter now lives.

### 5.4 Anchored Scales

**[C]** A graded Parameter is valued on an Anchored Scale from 0 to 4. The scale carries behavioural anchors at 0, 2 and 4 at least, each stated as something observable in a continuation. Values 1 and 3 lie between the anchors on either side.

Words such as "medium", "light" or "low-to-moderate" are not valid values for an anchored Parameter. This means that every graded value in a Mode can be checked against a continuation, and a continuation can be shown to breach it. The framework default anchors are in §8.7. A Mode may re-anchor a scale by declaring its own anchors, and the Touchstone (§22.4) re-anchors the Expressive scales by example.

This is imported from Behaviourally Anchored Rating Scales (like in Earth IRL a performance scale on which "3" means a described behaviour rather than an impression, or a Beaufort number defined by what the sea does rather than by the wind's speed).

### 5.5 Posture

A Posture is a named, versioned configuration of one Domain or group of Parameters. A valid Posture contains a name, a version, a complete parameter mapping for its scope, dependencies, incompatibilities, permitted overrides, and a one-paragraph behavioural description. Reference to a named and versioned Posture counts as explicit declaration.

A Baseline Posture is a Posture whose scope is every Domain. The Standing Framework supplies a library of Baseline Postures in Appendix D.

### 5.6 Differential Specification

**[C]** A Mode is declared as one Baseline Posture plus Deltas. Every Parameter the Instrument does not state takes its Baseline value.

The Instrument therefore writes only seven things:

1. the Intent Statement and the remainder of the Purpose Profile;
2. the Baseline Posture and its version;
3. the Deltas, each with its source, force, and (for an Operator Election) a reason of one line;
4. Seat allocations, and authority allocations that depart from the Residual Authority Clause (§6.10);
5. the Kernel and the Touchstone (§22);
6. Mode-specific material no Baseline can carry: setting, world rules, Characters, Clocks, and the particulars of the Constraint Profile;
7. capability qualifications and declared fallbacks.

Nothing is written that the Baseline already says. A full Draft 0.3 Mode Sheet is a valid Instrument whose Baseline is declared as None.
