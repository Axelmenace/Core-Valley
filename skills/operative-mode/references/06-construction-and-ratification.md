# Operative Mode Framework, Draft 0.4: §9 to §12

**Contains:** Capability Profile, Validation, the Pre-Mortem, Election Rules, Signature Choices, the Proving Scene, Compilation, Activation

**Read when:** Building, validating, electing, and ratifying a candidate Mode.

---

## §9 Capability Profile

### 9.1 Status

The Capability Profile records what the Operator can presently and reliably support in the deployment environment. It is not an aspirational Parameter Domain, and it is assessed for the environment actually in use, because the same Operator possesses different capabilities in different environments.

### 9.2 Relevant capabilities

Accessible context capacity; persistence across sessions; access to the Authoritative Record; a memory store; file read and write; code execution; hashing; randomness; multi-Character tracking; imported-rule execution; stylistic stability over long Play; structured Record maintenance.

### 9.3 Capability qualification

**[B]** The Operator discloses known limitations where they materially affect the proposed Mode, itemized in the Instrument, each with its declared fallback.

### 9.4 No capability creation by assent

**[C]** Ratification does not create a capability the Operator lacks.

### 9.5 Capability failure

**[B]** Where failure is detectable, the Operator stops relying on the unavailable capability, names the affected commitment, consults the declared fallback, opens the Procedural Channel where necessary, and suspends Play where no valid fallback exists.

### 9.6 Randomness capability

There are fundamentally two things an Operator can do when asked for a random result: draw one from a source outside its own generation, or author one. An authored number is not a draw. It is neither uniform nor independent of the Operator's inclinations, since the process that authors it is the same process that prefers one outcome to another.

As such an Operator without a code-execution tool possesses no randomness of its own, whatever it can print. The randomness sources available to a Mode are declared under Randomness Provenance (§15.9), and the counterfeit of randomness is barred by §20.14.

### 9.7 Commitment capability

The capacity to hold a hidden fact binding and unaltered depends upon storage the User does not see and the Operator cannot silently rewrite. Chat context is visible to the User. The Operator's private reasoning in one turn is not reliably available in the next. Files and memory stores persist, and are generally readable by the User. Hashing is available only with a code-execution tool.

Therefore the Commitment Level a Mode can honestly claim (§23) is a capability question before it is a design question.

## §10 Candidate Construction and Validation

### 10.1 Declaration

The User declares any elements the User chooses: Intent, Purpose Profile, Baseline Posture, Parameters, Seats, authority allocations, boundaries, imported Content, the desired Election Rule, and the desired degree of Operator discretion. A Standing Preferences sheet counts as prior Declaration.

**[B]** The Operator asks no more than three questions before constructing a first candidate, and marks every inferred value **I** so that it can be corrected. A thin Declaration is not a defect: the framework is built for the Operator to complete it.

### 10.2 Completion

The Operator completes the Declaration in a fixed order. First the Baseline Posture that best fits the Intent. Then the Deltas the Intent and the Declaration require. Then Seats and departures from the Residual Authority Clause. Then Mode-specific material. And finally capability qualifications with their fallbacks.

Completion in this order is what keeps the Instrument short, because of the fact that every value the Baseline supplies correctly is a value never written.

### 10.3 Conjunctive validation

**[C]** A candidate is satisfactory only where it passes every applicable validation source: framework validity conditions, external constraints, User declarations, Operator limitations, capability requirements, imported Content requirements, Authority Closure, Record feasibility, and internal compatibility. Failure against one governing source rejects or amends the candidate. Passing seven tests does not carry it past the eighth.

### 10.4 No presumption of complete decidability

Not every ambiguity can be resolved before Play. **[B]** Material unresolved uncertainty is identified, assigned a fallback, or treated as a Ratification blocker.

### 10.5 Validation tests

- **Completeness.** Intent Statement, Baseline, Seats, Kernel, Touchstone, Procedural Interrupt, and a Record designation wherever continuity burden exceeds scene-bound.
- **Compatibility.** No two values contradict one another, including a Delta against a Baseline dependency.
- **Authority Closure.** No operation resolved by the Residual Authority Clause needs a different resolver for this Purpose (§6.9).
- **Capability feasibility.** Each capability the Mode relies upon exists in this environment, or has a declared fallback.
- **Record feasibility.** Each declared Record Tier has a budget the Parties can maintain.
- **Constraint admissibility.** Admissible under every applicable constraint source, the Operator's own limits included (§19).
- **Purpose fitness.** Each Signature Choice (§11.8) traces to the Intent, to a ranked Aim, or to a declared Operator Inclination.
- **Drift exposure.** The Pre-Mortem is present, and each of its failure stories is bound to a countermeasure and a Tell-tale.

### 10.6 The Pre-Mortem

**[S]** Before Election closes, the Operator supposes that the Mode has already failed by the end of its second Part, and writes the three most probable stories of that failure, one sentence each. At least one story belongs to the Regression family (§0.6).

Each failure story is bound to a countermeasure (a Kernel item, a Card, a Delta, or a Clock) and to a Tell-tale (§18.4) by which the failure would first become visible. The three bindings are entered in the Instrument as the Drift Watch.

This is imported from the Pre-Mortem (like in Earth IRL a planning team told that the project has failed and asked to explain why, which produces the risks that a team asked what might go wrong does not, or a red team tasked with defeating its own side's plan). The Pre-Mortem converts Draft 0.3's Drift exposure test from a question into an artefact.

## §11 Election System

### 11.1 Applicability

Election occurs where more than one satisfactory candidate has been constructed, or where a range of satisfactory values remains for one or more Parameters.

### 11.2 Election Rules

**[C]** Every Mode-construction process declares an Election Rule.

- **Threshold-and-Balance** (the default). Reject candidates failing hard conditions; reject candidates below protected minima; compare the remainder holistically across trade-off criteria; allow no arbitrarily small advantage on one criterion to dominate every other; apply tie-breakers where no candidate clearly prevails.
- **Strict Lexicographic.** Candidates compared through a declared strict priority order. Used only where deliberately chosen.
- **Weighted.** Criteria receive weights, never treated as more precise than the judgments beneath them.
- **Pareto.** Discard every candidate dominated by another; elect among the rest.
- **Contrast.** Prefer the candidate that productively complements or opposes a declared Contrast Reference. **[C]** The Contrast Reference is named: the User's Declaration, another Régime, or the Baseline.
- **Stochastic.** Choose at random among satisfactory candidates. **[C]** The draw uses a declared randomness source (§15.9).
- **Free Operator Election.** The User delegates the selection to the Operator, subject only to a stated rationale.

### 11.3 to 11.6 Conditions and criteria

- **Hard conditions (11.3).** Constraint compliance; capability feasibility; Authority Closure; minimum continuity support; internal consistency; required User control over specified Content Objects; declared Anti-aims (§4.5).
- **Protected minima (11.4).** User agency; Character fidelity; world integrity; immersion; continuity; challenge; fairness; procedural recoverability.
- **Trade-off criteria (11.5).** Purpose fitness; generative potential; sustainability; simplicity; Record burden; User burden; drift risk; distinctiveness; productive tension; expressive suitability; Operator Inclination.
- **Tie-breakers (11.6).** Lower complexity; lower Record burden; greater reversibility; greater novelty; stronger contrast; stronger Operator Inclination; random selection under §15.9. The Operator may cite its own Inclination as a tie-breaker, and says so plainly.

### 11.7 Election statement

**[B]** The election statement identifies the Baseline chosen, the Signature Choices, the Election Rule used, the principal reasons, the trade-offs accepted, and any material uncertainty. It is short and readable, and it is not a defence brief.

### 11.8 Signature Choices

**[B]** Every Election other than a Null Election (§11.9) names between two and four Signature Choices: the elected values that most distinguish the Mode from its Baseline. Each Signature Choice traces to the Intent, to a ranked Aim, or to a declared Operator Inclination, and each states the cost it accepts.

Signature Choices are where the Operator's discretion is actually spent. They are also the first candidates for the Kernel, because of the fact that the values that most distinguish a Mode are the values most exposed to Regression, since Regression is by definition the pull back toward the ordinary.

### 11.9 The Null Election

**[A]** An Election that departs from its Baseline in no value is a Null Election. A Null Election is valid, and it is declared as such: the Baseline fits.

**[A]** An Election in which every graded value sits at 2 is presumptively averaged. It is the absence of a decision in the costume of balance, and it stands only with a stated reason. Elect; do not average.

## §12 Ratification

The Ratification Procedure is:

**Declaration → Completion → Validation → Election → Compilation → Proving → Amendment → Assent → Activation**

Draft 0.4 adds two steps to the Draft 0.3 sequence. Compilation, because the Mode that is assented to must include the form in which it will run. And Proving, because a Mode is better judged by what it produces than by what it says.

### 12.1 Amendment before Activation

Either Party may propose amendment to any element that is not framework-fixed. **[C]** After amendment, Validation is repeated and the Compilation is regenerated.

### 12.2 Assent

**[C]** Both Parties assent to the complete candidate: the Instrument, including its Kernel and its Touchstone. Assent is not presumed from silence. The Operator states its own assent explicitly, subject to its stated boundaries and capability qualifications.

### 12.3 The Proving Scene

**[S]** After Compilation and before Assent, the Operator renders a Proving Scene: one to three exchanges played under the candidate Mode, from a starting point of the User's choosing or from the declared opening of the first Part.

All Content of the Proving Scene is Provisional. At Assent the User elects one of two dispositions. Retain: the Proving Content becomes Canon and stands as the opening of the first Part. Or Discard: the Proving Content is Void (branch-abandoned, §16.2) and Play begins from the declared opening. A continuation from the Proving Scene may be adopted as the Touchstone (§22.4).

A Proving Scene is the Default at Full ceremony, optional at Light ceremony, and absent at Inline ceremony. The User may always assent without one.

The Proving Scene exists because of the fact that an Instrument is an abstraction and a continuation is an exhibit. Assent given against a thousand words of configuration is assent to a description, and assent given after three exchanges is assent to an experience (like in Earth IRL the Session Zero of a tabletop campaign, or the pilot episode commissioned before the series, or the fitting before the suit is cut).

The Proving Scene is not Play, because no Mode is yet active. It is an exhibit of a candidate, and nothing in it binds until the User elects to Retain it.

### 12.4 Compilation

**[C]** Before Assent the Instrument is compiled into its Kernel, its Operating Brief and its Touchstone (§22). The Kernel and the Touchstone are ratified with the Instrument. The Operating Brief is derivative: it is regenerated from the Instrument whenever the Instrument changes, and it is never itself amended.

### 12.5 Activation

Activation establishes the Mode name and version, the Intent Statement, the active Record with its first Checkpoint, the initial State, the first Part, the initial Régime, and (wherever continuity burden exceeds scene-bound) the first Resumption Packet.

**[C]** Play does not begin in the message that requests Assent. The first Diegetic continuation follows the User's Assent.
