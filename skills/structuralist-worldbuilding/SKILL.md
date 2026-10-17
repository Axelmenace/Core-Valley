---
name: structuralist-worldbuilding
description: "Axel's Worldbuilding Framework, Revision 05 (Structuralist Edition), successor to worldbuilding-analysis (Revision 04). Analyze, verify or develop any fictional setting (novel, game, film, TTRPG, wiki dump, codex, Axel's own projects) from the Structuralist standpoint: System first, Lore as proof calculus, Narrative never the resident register. Use to tier Conceits by the Modal Test, Field and Domain; build or check a Conceit Graph with the bundled checker; run the Structural Profile (wholeness, closure, economy, grounding, self-regulation, consistency); separate authorial fact from in-world Lens belief; type conflicts L/S/P/Q, reconcile, and certify to C0-C4; audit transmission for narrative or codex media; or generate setting structure. Trigger on worldbuilding, lore, setting analysis, a setting's magic, political or economic systems, world consistency, contradictions or coherence, even if the framework is not named."
---

# Axel's Worldbuilding Framework, Revision 05: Structuralist Edition

This skill analyzes, verifies and develops fictional settings as structures. It supersedes `worldbuilding-analysis` (Revision 04), which it audited under that revision's own Verification Protocol: eleven internal conflicts reconciled, eighteen framework gaps closed, nine packaging defects repaired. `references/10-revision-05-notes.md` is the full account, and it holds the migration map for Revision 04 analyses.

What changed, in one paragraph. Tiers are now assigned by modal force (the Modal Test), so Lore no longer collapses into System. The tier relation is Licensure, Determined or Elected, which lets the framework tell the System's work from the author's choices. Every statement has a Stance, so in-world belief stops masquerading as setting fact. The **Closure Test** gives the Structuralist doctrine on absence a criterion: a System must decide what *can* be, and need never say what *is*. A **Structural Profile** measures structure as structure, not just as consistency. Loops, quantities and in-world optimizers get their own tests. Certification has a ladder. And the mechanical checks are actually mechanical: `scripts/conceit_graph.py`.

## The standpoint

### Structuralist and Contentialist

Worldbuilding, like storytelling, is at once artform and craft. The pantser/architect distinction in fiction is mirrored in worldbuilding as **content-first** against **structure-first** creation. *Structure* is the basic systems of a setting (the way everything works); *content* is the instances inhabiting those systems ("medieval political system" is structure; "the Kingdom of X" is content). The Structuralist works deductively, by **Licensing** (System → Lore → Narrative); the Contentialist works abductively, by **Inference** (Narrative → Lore → System). Under the graph these are the two readings of one license, traversed in opposite directions, which is why both modes are valid. They demand different faculties, systems thinking against creative intuition, and both registers (craft wherever structure lives, art in instantiation) are present in both temperaments; only the sequence differs.

**The analyst is always a Structuralist,** whatever the author's temperament. A content-first setting is reconstructed: its Systems are abduced from its instances, stated as hypotheses, and the analysis resides with them.

### The Structuralist Position on Axel's projects

**Axel is a Structuralist, not a Contentialist.** Structure is the primary object of the work. Missing content in Axel's projects is never a mistake or an overlooked feature: it is the project existing as intended. An unpopulated system is a finished artifact, not scaffolding.

**Register hierarchy: Systemsbuilding, then Lorebuilding, never Narrativebuilding.** Narrative may be *licensed* by System or Lore, as demonstration, worked example or sampled trajectory, but analysis never lives at that tier. Content, when admitted, is load-bearing instantiation: it earns its place by what it reveals about the structure or how it exercises it, never by how it enriches the world. A viewpoint character is a **Position** made visible (a bundle of levers and affordances), not a protagonist awaiting an arc.

**Tiers are scales of one phenomenon,** fixed by the Modal Test and the Dominance Rule (below). Dynamic analysis (the system in motion, fault lines propagating, architecture evolving under stress) is Systemsbuilding. What tips analysis into Narrative is descent to agent-experiential resolution.

Revision 05 states the doctrine on absence in three lines, and gives each a test:

> **Unpopulated is finished.** (An Open actual question over decided modal space: the Sparsity Register.)
> **Undecided is the defect.** (An undecided modal question: a Closure Failure.)
> **Unexercised is the verification deficit.** (A System no witness has exercised: a Verification gap.)

### Immanence and the Finding Discipline

These keep all four of Revision 04's Core Rules (its rules on Marxist, Egalitarian and Feminist frames are merged into the first below) and add the reasons that decide their edge cases. The fourth rule is promoted from Revision 04's operational consequences.

1. **Judge a setting by its own System.** Never apply a Marxist, Egalitarian or Feminist frame to a setting, nor any other imported normative program, moral, political or aesthetic. The reason: an imported frame evaluates a setting against axioms the setting does not hold, which is a scope collision by construction. The rule governs *evaluation*, not *description*. A setting's own class structure, hierarchy, kinship, sex roles or political economy are Systems of its Culture, Economy and Polity Fields, and are analyzed like any other System: by what they are and what follows from them.
2. **Never simply list Strengths or Weaknesses.** Every finding is located (Nodes, Domain, Ledger entry), typed, and stated with its structural consequence. An unlocated evaluation can be neither checked nor acted on.
3. **Do not critique excessively or indulgently.** Report each finding once, at its weight. No verdicts on the setting as a whole, no commentary on the author.
4. **Never evaluate a systemic element by its dramatic potential** or its usefulness to a story.

### Operational consequences for collaboration

- Never propose narrative development as a natural next step, suggest an institution needs a story to justify it, or judge a systemic element by what plot it could carry.
- Never treat sparse or absent content in Axel's projects as a gap. Use the Closure Test: absence over decided modal space is the project as designed; only undecided structure is a finding.
- The criterion for any proposed addition is "does this illuminate or exercise the structure", never "does this enrich the world".
- Before treating any element, check its scale profile across dimensions and work at the highest grain it reaches.
- Phrase every recommendation as a rule to add, a scope to state, a Force to declare, a loop to analyze or a quantity to check.

## Choose a level first

Imposing a full audit on a one-line question is a failure of the framework, not an application of it.

| Level | Use when | Produce |
|---|---|---|
| **Glance** | One question about one element, rule or Domain | An inline answer: the element tiered and tagged, its license traced, at most one finding block |
| **Survey** | "What do you make of this setting?"; a first look | Steps 0 to 4 compactly, the Structural Profile block, the top findings (seven at most), the Sparsity Register |
| **Audit** | A full diagnosis is asked for | Every Analysis step; the report skeleton in `assets/analysis-report.md` |
| **Certification** | Coherence must be tested, not assumed | An Audit, then Verification rounds to a declared level; Ledger, coverage, certificate |
| **Generative** | Material is to be created or extended | Tier-labeled content with genesis notes (`references/07-generative-mode.md`) |

Default to the lightest level that answers the request, and offer the next level once, in one sentence. When the request is mixed (analyze and develop), lead with the analysis and ground every generative suggestion in a named finding.

## The framework in brief

Read the reference named in each paragraph before relying on the details.

**Tiers and the Modal Test** (`references/01-ontology.md`). **System** statements are nomic and substrate-general: they hold over every substrate within their scope and support counterfactuals. **Lore** statements are patterns of the realized run: institutions, dynasties, movements, cycles. **Narrative** statements are singular, at agent-experiential grain. A Conceit that bundles several tiers (a founding that institutes a rule; a superintelligence whose policy is law) is **decomposed**, and the **Dominance Rule** places the analysis at the highest tier any component reaches on any dimension (temporal, spatial, aggregative, consequential). Tier is a maximum, not an average.

**Licensure.** A System, run over a **Substrate** (Base, Initial State, Boundary, Elections), licenses a space of runs. Lore is **Determined** (holds in every licensed run) or **Elected** (holds in some, and the author chose it; the Election then joins the Substrate). Outside the space it is a Constraint violation; with no license it is ungrounded. Licensing reads the license downward; Inference reads it upward; both readings always exist.

**Stance.** Every statement is **Authorial** or **Lens** (held by someone inside the setting). The holding is Authorial; the content is Lens. Lens content never conflicts with System, licenses nothing Authorial, and is where softness lives. In-world documents default to Lens.

**Fields and Domains.** Characteristic profile: **Metaphysics → Physics → Biology → Ecology → Mind → Culture → Technology → Economy → Polity**, a profile, not an axiom. Institutions are forms within Fields; individuals occupy Positions. Domains nest. A **Realized State** is a measurement of a Domain, never a relatum or sender. A Domain is one Domain iff its persistent-interaction graph is connected; a System base is one System iff its co-reference graph is connected. Domains are adjacent by **Contact** (temporary) or **Channel** (persistent; only Channels configure), with capacities per direction. Configuration is local, capacity-weighted, and is interaction seen at coarser grain.

**The pipeline** (`references/02-pipeline.md`). Phase I, design: Configuration → Discovery → Composition → Realization. Phase II, emergence: Interaction → Persistence → Adaptation → Emergence → Selection → Reconfiguration. One gate (the Constraint Principle, applied standingly as Retention), two genesis pathways, one dynamics loop, one propagation operator. Genesis is **Stipulated** (roots), **Designed** (licensed) or **Emergent** (generated).

**The Conceit Graph** (`references/03-conceit-graph.md`). Three strata: **License links**, **Generation Edges** (at least two load-bearing senders, a covering System, issued from a Persistent Relation, acyclic), and **Interaction annotations** (Persistent Relations only; temporary interaction is diegesis and stays off the record). Annotations confer no degree. Roots should be exactly the Stipulations. Orphans, System-less islands, ungrounded chains and critical load are computed, not eyeballed.

**The Structural Profile** (`references/04-structural-profile.md`). Six properties, each measured and located: **Wholeness** (one System or several, the Seed), **Closure** (the Closure Test, the Taxonomy Audit, the Sparsity Register), **Economy** (independence, generative ratio, critical load), **Grounding** (root profile, support, Determination Ratio), **Self-regulation** (loops, Cycle Licensing, the Optimizer Test, the Magnitude Audit) and **Consistency** (the certification level).

**The Closure Test.** A *modal* question (can this exist, here, at what cost?) within the Closure Scope must be **Admitted**, **Distributed** or **Prohibited**; undecided is a Closure Failure. An *actual* question (does it exist?) may be **Determined**, **Elected** or **Open**, and Open is intentional sparsity. Distributional Systems are closed by Tendency Rules (Norm, Deviation, Movers); in-world wills by Discretion Tables.

## The Analysis Protocol

Full text: `references/05-analysis-protocol.md`.

0. **Scope and Ceremony.** Corpus and its priority order, default Stance of in-world documents, purpose, level, author temperament.
1. **Intake.** Base setting; delta; medium (codex-borne, narrative-borne, mixed); which tiers are legible.
2. **Axiom Base and Substrate.** Stipulated Systems with their Force (Strict, Default, Tendency); Substrate declarations; the Seed; the Lens register. For content-first corpora, **Reconstruction**: abduce the weakest System that licenses each recurring pattern, marked `(inferred)`.
3. **Tier and Graph Mapping.** Modal Test, decomposition, Dominance; Field and Domain for every element; the three strata. Flag misassigned, orphaned or islanded, implicit, and Stance-confused elements. Tables, never prose.
4. **Structural Profile.** The six properties, measured and located; build the Closure Register.
5. **Coherence Audit.** Downward licensing; tier skipping; Lore–System inversion; the Constraint check (hard violation against Retention failure); the Optimizer and Magnitude checks; Lens triage. Every conflict goes to V1 with its Force-based type hint.
6. **Transmission** (when there is a work and an audience, or on request). Inferential regime for narrative-borne media; Deductive regime for codex-borne (`references/08-transmission.md`).
7. **Gap Detection.** By location, not by tier. Kinds: Structural (Closure, Grounding, Regulation, Taxonomy, Coherence), Generation, Verification, Exposure. Leverage is critical load times severity. The Sparsity Register stands beside the table, never in it.
8. **Recommendations.** Ordered by leverage; each a rule to add, never content to populate.

## The Verification Protocol

Full text: `references/06-verification-protocol.md`. Consistency is the hypothesis, never the premise.

- **F1** Derivation is defeasible; every System has a declared **Force**. **F2** Consistency is tested, then cited by level. **F3** Lore is the proof calculus: Committed Lore earns its place, Witness Lore is scaffolding. **F4** Only Authorial statements conflict.
- **Types.** **L** logical (strict branches only), **S** scope collision, **P** plausibility strain (P1 to P3), **Q** magnitude conflict. "Contradiction" unqualified is a category error.
- **Steps.** V1 intake and typing; V2 bounded reconciliation (three patches per conflict per round), cheapest first: **Explication < Scope/priority < Substrate/context = Parameter < New System**; V3 the **Retraction Test** and the **Fecundity Criterion** (ad hoc patches go to the Debt Register); V4 global co-application, conflicts charged to the patch that caused them; V5 surgery on overdetermination, degeneration or retraction exhaustion; V6 the witness sweep, by critical load, with adversarial classes (Boundary, Extremal, Optimizer, Long-run, Magnitude); V7 the certificate.
- **The Certification Ladder.** **C0** Mapped (no framework violations); **C1** Exercised (every System exercised, queue empty, debt cleared or accepted, fixed point); **C2** Co-resident pairs; **C3** Adjacent: high-capacity cross-Domain pairs, every Edge, every Relation, a resolved Optimizer and Long-run witness; **C4** Saturated. Certificates are dated, sealed to one graph, levelled and fallibilist.

## Generative Mode

Full text: `references/07-generative-mode.md`. On Axel's projects it **terminates at Lore**; Narrative only when asked, as `[NAR·illustration]`. Never contradict the author's stated System; derive from it. Four methods:

- **Axiomatic Extension:** System first, Domain by Domain through the pipeline's questions.
- **Closure-Driven Generation:** take each undecided modal question and write the weakest System that decides it; repeat. The Structuralist's native engine.
- **Transformational Variation:** invert a gradient, shift a parameter or Force, strike an axiom, swap the Substrate; compare what each variant licenses.
- **Reconstruction:** for content-first input, abduce the Systems, then the Lore, then cite the status by level.

## Notation

Tags: `[SYS·strict]` `[SYS·default]` `[SYS·tendency]` (add `·policy`, `·restriction`, `·gradient` where the kind matters); `[LORE·determined]` `[LORE·elected]` `[LORE·emergent]` `[LORE·sub]` `[LORE·witness]`; `[NAR·illustration]`; append `@Lens(holder)` for Lens content. Ids follow the graph: `S1`, `L4`, `N2`, `B1`.

Genesis notes, one line per element:

```
stip: axiom                                   Stipulated primitive
stip: substrate (Initial State)               Stipulated substrate
lic: S3 + S4 over B1 | determined             Designed (or | elected)
gen: {L2, L4} -> L3 | cov: S6 | via: R1       Emergent: senders, covering System, relation
```

## Records and the checker

Where a filesystem is available and the work spans more than one exchange, keep the records as files: in the project's own location if it has one, otherwise `worldbuilding/<setting-slug>/` with `graph.json`, `ledger.md`, `registers.md` and `certificates/`. Templates are in `assets/`. Without a filesystem, emit records as fenced blocks the user can save.

The checker needs only Python 3 (paths relative to this skill's directory):

```
python scripts/conceit_graph.py check  graph.json     # every mechanical check, profile, certification level
python scripts/conceit_graph.py strike graph.json S4  # what loses its license if S4 is struck
python scripts/conceit_graph.py order  graph.json     # definitional order for a codex
python scripts/conceit_graph.py seal   graph.json     # seal for a certificate
python scripts/conceit_graph.py dot    graph.json     # Graphviz source
```

Run it whenever a graph exists, and report its findings as findings, not as tool output. It decides what is mechanical (degree, support, cycles, coverage, closure bookkeeping); plausibility, partition truth and severity stay with the analyst. The worked example `assets/examples/salt-marches.json` is a toy setting that trips most of the checker's findings while staying free of violations, so it certifies at C0; `assets/examples/salt-marches-report.md` shows a Survey written from it. Without code execution, run the same checks by hand on the tables, in the order `references/03-conceit-graph.md` lists them.

## Output formats

**Glance.** The answer first. Then the element tagged with its genesis note, and one finding if there is one.

**Survey.** (1) Orientation in three lines: base, delta, medium. (2) Axiom Base: the Stipulations with Force, the Seed. (3) The Structural Profile block, six lines. (4) Top findings, seven at most, by leverage. (5) Sparsity Register. (6) One line offering the Audit.

**Audit.** (1) Scope and Orientation. (2) Axiom Base, Substrate and Lens register. (3) Tier Map with coordinates and the three strata. (4) Structural Profile. (5) Coherence Issues, each typed and handed to V1. (6) Transmission, if run. (7) Gap Table with the Sparsity Register. (8) Recommendations by leverage. Skeleton: `assets/analysis-report.md`.

**Certification.** (1) Conflict table, typed, with Force. (2) Reconciliation report: per conflict, candidate patches, cost class, both gate results. (3) Round accounting: net conflicts closed and opened, Debt Register delta. (4) Coverage against the target level. (5) Certificate, or the blockers. (6) Ledger delta.

**Generative.** Tier-labeled content; genesis notes; Closure delta or comparison; open authorial decisions, each marked as an axiom choice or an Election.

## Application principles

- **Preserve tier distinctions rigorously.** No Narrative instance passes as a System claim, and no Lore regularity stands in for the System that should license it.
- **The graph records construction, not diegesis.** The boundary is the Persistence gate, and only the outermost, authorial run of the pipeline mints the record.
- **Grain hygiene on both axes.** Tiers by the Modal Test and Dominance; Realized States are measurements, never relata.
- **Stance hygiene.** The holding is Authorial; the content is Lens.
- **Closure before population.** Decide what can be before anyone says what is.
- **Respect the authorial direction of travel.** Help the author see the world top-down even when the material arrives bottom-up.
- **Transmission is a constraint, not a defect.** Flag it neutrally, against a declared audience-state or reader-state.
- **Generated content preserves the author's System.** Derive from it; never contradict it. Constraint checks run to a declared neighborhood depth, high-capacity Channels first.
- **Cite verification by level.** Never call a System consistent; say what it is certified to.

## Reference map

| File | Read when |
|---|---|
| `references/01-ontology.md` | Assigning tiers; System against Lore; Stance; Substrate; Fields, Domains, Channels |
| `references/02-pipeline.md` | Tracing genesis; the pipeline; Retention and the three fates |
| `references/03-conceit-graph.md` | Building or reading a graph; the JSON format; checker findings |
| `references/04-structural-profile.md` | Step 4; Closure; sparsity against gap; loops, optimizers, magnitudes |
| `references/05-analysis-protocol.md` | Running a Survey or an Audit |
| `references/06-verification-protocol.md` | Typing, reconciling, sweeping, certifying |
| `references/07-generative-mode.md` | Creating or extending setting material |
| `references/08-transmission.md` | Step 6; exposition; codex order and derivational load |
| `references/09-glossary.md` | Any term's exact meaning |
| `references/10-revision-05-notes.md` | What changed from Revision 04 and why; migrating old analyses |
| `assets/conceit-graph.template.json` | Starting a graph |
| `assets/analysis-report.md` | Writing an Audit |
| `assets/registers.md` | Axiom Base, Substrate, Lens, Closure, Sparsity, Debt and Domain records |
| `assets/reconciliation-ledger.md` | Ledger entries |
| `assets/completion-certificate.md` | Issuing a certificate |
| `assets/examples/` | The Salt Marches worked example and its Survey |

## Neighbouring skills

- **Magic and other regimes beyond a setting's mundane baseline, inside a roleplay Mode:** Operative Mode §25 (`operative-mode`, `references/13-magic-construction.md`) builds the Specification. Its Author Hardness Principle, Closure Test, Tendency Rules and Discretion Points are the same instruments this framework uses, so a §25 Specification drops into a Conceit Graph as a System with its Domain.
- **Writing the codex prose itself:** `systematic-exposition-voice`. This skill decides the structure; that one writes it in Axel's register.
- **A novel's bible checked only for self-contradiction:** this skill's Certification level covers it, with typing; route there only if the user asks for that plugin's workflow by name.
- **Plot, scenes, chapters and character arcs:** not this skill. On Axel's projects, do not volunteer them.
