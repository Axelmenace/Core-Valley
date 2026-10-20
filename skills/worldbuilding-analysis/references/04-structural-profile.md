# 04 The Structural Profile

**Contains:** what the Profile measures and why it is not a list of strengths; Wholeness (System Coherence, the Seed); Closure (the Closure Test, Closure Scope, Tendency Rules, Discretion Points, the Sparsity Register); the Taxonomy Audit; Economy (independence, generative ratio, critical load); Grounding (root profile, Determination Ratio); Self-regulation (loops, Cycle Licensing, the Optimizer Test, the Magnitude Audit); Consistency; the report format.

**Read when:** running Analysis Step 4, judging whether a setting's structure is finished, deciding whether absence is sparsity or defect, stress-testing a System, or writing the Structural Profile section of a report.

---

## 4.1 What the Profile is

Revision 04 could say whether a setting was consistent and whether it was transmissible. It could not say whether its structure was *good as structure*. Consistency is necessary and nowhere near sufficient: a heap of unrelated rules that never touch is perfectly consistent. The Structural Profile measures the six properties a structure has or lacks as structure.

| Property | Question | Principal test |
|---|---|---|
| **Wholeness** | Is this one System, or several sharing a map? | System Coherence Criterion; the Seed |
| **Closure** | Does the System decide what it governs? | The Closure Test; the Taxonomy Audit |
| **Economy** | How much does each primitive buy? | Independence; generative ratio; critical load |
| **Grounding** | Does everything rest on stipulated structure? | Root profile; support; Determination Ratio |
| **Self-regulation** | Do the setting's dynamics produce what it claims about itself over time? | Loop analysis; Cycle Licensing; Optimizer Test; Magnitude Audit |
| **Consistency** | Has the System been exercised without unresolved conflict, and to what level? | Verification Protocol; certification C0 to C4 |

The properties come from two traditions. Piaget's account of what a structure is names wholeness, transformation and self-regulation; the classical virtues of an axiom set are consistency, independence and completeness. Wholeness and Self-regulation are Piaget's. Closure is completeness relative to scope, and it is what transformation requires: a structure that decides its cases is one that can generate them. Economy carries independence. Consistency is consistency. Grounding is the Conceit Graph's own contribution: the requirement that everything rest on what was stipulated.

The Profile is diagnostic. Every property is reported as a measure and as located findings (Node ids, Domains, Ledger entries). It never becomes a list of strengths and weaknesses: a finding names where the structure is, what it does there, and what follows.

## 4.2 Wholeness

**System Coherence.** The System base is one System iff its co-reference graph is connected (`01-ontology.md` §1.8). The checker builds that graph from shared Domains, shared terms, shared licenses and persistent Channels, and reports the number of Systems.

A setting with more than one System is not thereby defective. Many settings deliberately run two regimes (a mundane physics and a magic, two cosmologies in contact). What Wholeness requires is that the plurality be **declared**, and that the **Couplings** between the Systems be recorded: the places where one System changes another's numbers, and the shared layer (a fuel, a scale, a law) they both draw on. An undeclared plurality is an aggregate: Systems that happen to share a setting. The finding is stated plainly: "the setting is two Systems sharing a map; S7 touches nothing the rest of the base touches."

**The Seed.** The **Seed** is the single core concept the System grows from, stated in one line (Operative Mode §25.4 calls it the seed crystal). It is the interpretive anchor: a disputed reading is read toward the Seed. Where the author has declared one, the checker lists the Systems with no co-reference path to it (`seed-remote`). Where none is declared, the analyst proposes one from the axiom with the highest critical load and the widest co-reference, and marks it as inferred.

## 4.3 Closure

Closure is the Structuralist property par excellence, and Revision 04 had no test for it. It is also what makes the Structuralist doctrine on absence defensible.

> **Unpopulated is finished. Undecided is the defect. Unexercised is the verification deficit.**

### 4.3.1 The Closure Test

Questions about a setting are of two kinds, and only one kind must be answered.

**Modal questions** ask what *can* be: can this unit exist here, can this effect reach that, under these conditions, at what cost? Every well-formed modal question within the Closure Scope must receive one of three verdicts from the System:

- **Admitted:** it can, with its conditions and costs fixed (stated outright or validly derived).
- **Distributed:** it can, with a declared distribution over outcomes (a Tendency Rule, 4.3.3).
- **Prohibited:** it cannot.

"Not yet decided" is not a verdict. An undecided modal question is a **Closure Failure**, a structural gap.

**Actual questions** ask what *is*: does a guild hall stand in the western estate? Their verdicts are:

- **Determined:** System over Substrate fixes it.
- **Elected:** the author has chosen it, and the Election is recorded.
- **Open:** nobody has chosen. This is not a failure.

An Open verdict on an actual question over a decided modal space is **intentional sparsity**, made checkable. The System says a guild hall *could* stand there, at what cost and under what conditions, and nobody has said whether one does. That is the project existing as intended. Revision 04 asserted that sparsity and structural gaps differ; the Closure Test is the difference.

The test corresponds to Operative Mode §25.3 (Determinate, Distributed, Prohibited), with one distinction §25 does not need: Play must answer actual questions at the moment of need, a codex need not.

### 4.3.2 Closure Scope

Closure is relative to scope, so the scope is declared. The **Closure Scope** of a setting is the union of:

1. each System's declared Boundary (what it governs and where it ends); and
2. every modal question that the setting's own committed content raises.

A question outside both is unscoped, and not a failure, unless the author enlarges the scope. A question the content raises and no System governs is a Closure Failure at setting level: sea trade with no rule for whether ships can cross the Deep, an empire with no rule for how its throne passes.

The checker reads the **Closure Register** (`questions` in the graph). Analysis builds the register by posing the modal questions the content raises, Domain by Domain, high-capacity Channels first.

### 4.3.3 Tendency Rules

Some Systems govern populations, not instances. A Tendency Rule (Operative Mode §25.3.1) is written in three lines, and the checker requires all three:

- **Norm:** the ordinary outcome.
- **Deviation:** the share of cases that exceed or fall short of it, and by how much.
- **Movers:** the named factors that shift those shares, each with its shift.

A Tendency Rule answers modal questions as Distributed. Where a setting says a rule "never perfectly fits", that sentence is the warrant for the Deviation line, not an exemption from it.

### 4.3.4 Discretion Points

A System may defer to an in-world will: a god chooses, a council rules, a superintelligence decides. A will that decides "at its discretion" leaves the question undecided unless its decision function is recorded. Every such point is closed by a **Discretion Table** (`"kind": "policy"`, `"table": ...`): the inputs the System names, mapped to an outcome or a distribution. The will stays in the world; the answer exists before the question. This is the Position doctrine applied to agency: the decision function is structure, the occupant is content.

### 4.3.5 The Sparsity Register

Every Open actual question is listed in the **Sparsity Register**, with the modal question that covers it (`"modal"` in the graph). An Open question with no decided covering verdict is not sparsity: it is a Closure Failure one level up, and the checker says so. The register is reported in every Survey and Audit, because it is the positive evidence for the Structuralist claim: here is the space the System decides and nobody has populated, by design. It is never a to-do list.

## 4.4 The Taxonomy Audit

Codex-style Systems are built from classifications ("there are fundamentally two types of X"; "these three axes are orthogonal, so every Claim occupies one of eight states"). Classifications have their own hygiene, and the checker tests what is mechanical.

- **Partition Test.** A split of a class into types must be **exhaustive** (no member falls in neither) and **exclusive** (no member falls in both). Declare both, or name the residue. The analyst tests the declaration against the setting's content: one counter-member defeats it.
- **Product Test.** A cross-classification over orthogonal axes produces a product space. Every cell must carry a modal verdict: admitted, distributed or prohibited. An undecided cell is a Closure Failure. Prohibited cells are findings in their own right: they are where the System's structure shows.
- **Nesting Test.** Subdomain chains are transitive and well founded: what holds of a Domain holds of its subdomains unless a scope condition says otherwise, and no chain loops back on itself.
- **Naming Test.** A compound term built by stacking qualifiers keeps one qualifier order everywhere it appears. A reordered compound is either a different class (define it) or a slip (fix it).

## 4.5 Economy

- **Independence.** An axiom derivable from other axioms is a theorem filed as an axiom. It costs verification coverage and buys nothing. Reclassify it as derived, keeping its license. The checker flags axioms that carry incoming licenses from other Systems.
- **Generative ratio.** Committed, supported, non-stipulated Conceits per axiom: what each primitive buys. Report it, and read it against the setting's purpose; a codex of pure law will have a low ratio and be none the worse for it.
- **Critical load.** For each axiom, the Conceits that lose every license when it is struck (`strike`). High load concentrates verification priority. Zero downstream reach is an **inert axiom**: it may be a placeholder, a Seed awaiting development, or decoration, and the author says which.
- **Primitive count.** Terms deliberately left undefined are declared under `primitives`. A codex should have few, and should know which they are.

## 4.6 Grounding

- **Root profile.** Axioms, substrate declarations, and ungrounded roots. In a well-grounded setting the third number is zero.
- **Support.** The share of committed non-root Conceits supported by fixed point from Stipulations.
- **Lore–System inversion,** measured: components with no System, ungrounded Lore roots, and ungrounded chains. A setting that is encyclopedic but structurally incoherent shows here first.
- **Determination Ratio** and the Lore genesis split (Determined, Elected, Emergent), from `01-ontology.md` §1.3.1.

## 4.7 Self-regulation

"Systems over time" is Systembuilding's own motto, and Revision 04 offered no tool for time. These tests supply it.

### 4.7.1 Loops

A **loop** is a cycle of persistent Channels. Each is recorded with its **polarity**:

- **Balancing:** a change propagates around the loop and returns opposed. Balancing loops produce stability, homeostasis and, with delay, oscillation.
- **Reinforcing:** a change returns amplified. Reinforcing loops produce growth, collapse and runaway.

A reinforcing loop with no recorded **limiter** (a System that caps it: a cost, a ceiling, a balancing loop that eventually dominates) predicts runaway. If the setting shows no runaway, a limiter is missing: a Type P strain or a Type Q conflict. The checker also lists cycles in the Channel graph that no declared loop analyzes.

### 4.7.2 Cycle Licensing

Claims a setting makes about itself over time need mechanisms.

- **Stability** ("the levy has held two centuries") needs a balancing loop.
- **Growth** ("the Guild's power has risen for a generation") needs a reinforcing loop.
- **Recurrence** ("every few generations the river-lords rebel") needs either a loop with a recorded delay (endogenous oscillation) or a periodic System that forces it (an exogenous rhythm: tides, seasons, a comet).

A claim with no mechanism is a **regulation gap**. These claims are where Lore most often outruns System: settings declare thousand-year stabilities that nothing stabilizes.

### 4.7.3 The Optimizer Test

Give the System to a competent, interested agent inside the setting, with exactly the knowledge its Lenses grant, and ask what that agent does. Stated Lore must be an equilibrium of such behavior, or a limiter must be recorded: a cost, a prohibition, enforcement, ignorance (a Lens that hides the affordance), or coordination failure.

The test catches the commonest structural failure in fiction: an affordance the setting grants and its inhabitants inexplicably ignore. Teleportation coexists with caravans; binding oaths coexist with free labour; resurrection coexists with succession wars. Each is a Type P strain until the limiter is found or written, and the limiter is usually fecund (in the worked example, "a coerced oath does not bind" licenses a whole office of Witnesses). Optimizer witnesses are their own class in the sweep (V6).

### 4.7.4 The Magnitude Audit

Settings fail on quantities more often than on logic. The audit runs order-of-magnitude checks against the budgets the System implies:

- **Carrying capacity:** population against food, water and land.
- **Demography:** armies, clergies and crafts against the population that must supply them.
- **Throughput:** trade volumes, logistics and travel times against routes, carriers and distances.
- **Energy:** what magic or technology does against what its Source supplies, where an invariant declares conservation.
- **Time:** event sequences against travel and communication times.

A failure is a **Type Q** conflict (`06-verification-protocol.md`). Its cheapest cure is usually a parameter, and a parameter change is still checked by the Retraction Test.

## 4.8 Consistency

Consistency is the Verification Protocol's object, reported as a certification level (C0 to C4) with its parameters, never as a flat claim. The Profile cites the level and the next level's blockers.

## 4.9 Reporting the Profile

One block, six lines, each a measure followed by its located findings:

```
Wholeness        2 Systems (S1..S6, S8, S9 | S7); Seed S4 declared; S7 Seed-remote, undeclared
Closure          5 modal questions, 2 failures (Q1, T1 other-hour|collective); Sparsity Register: Q4
Economy          generative ratio 1.11; load S3 8, S2 5, S4 5; S9 a theorem filed as axiom
Grounding        roots 8 axioms / 3 substrate / 2 ungrounded (L6, L12); support 0.92; determination 0.75
Self-regulation  F2 unbounded; L5 stability unsupported; guild-lords-pans cycle unanalyzed
Consistency      C0; C1 blocked by C2 (open Q), C4 (debt), S7 and S8 unexercised, no fixed point
```

Each line is followed, where findings exist, by what follows from them structurally. Recommendations come later (Analysis Step 8) and are phrased as rules to add, never as content to populate.
