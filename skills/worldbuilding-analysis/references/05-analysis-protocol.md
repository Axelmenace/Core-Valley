# 05 The Analysis Protocol

**Contains:** Steps 0 to 8 in full: Scope and Ceremony; Intake; the Axiom Base and Substrate; Tier and Graph Mapping; the Structural Profile; the Coherence Audit; Transmission; Gap Detection; Recommendations. Reconstruction for content-first corpora. What each step hands to the Verification Protocol.

**Read when:** running a Survey or an Audit, analyzing a supplied setting, or writing any section of an analysis report.

---

The protocol turns supplied setting material into a structural diagnosis. Input may be a wiki dump, prose, an outline, a codex, a game's rules, or a named setting Claude can draw on from general knowledge. The analyst's standpoint is Structuralist whatever the author's temperament: the System is reconstructed first and the analysis resides there.

At **Survey** level, run Steps 0 to 4 compactly and report the top findings. At **Audit** level, run every step. The report skeleton is `assets/analysis-report.md`.

## Step 0: Scope and Ceremony

Declare, in two to five lines:

- **Corpus:** which sources count, and their priority when they disagree (primary text over supplement, latest edition over earlier, author's notes over fan wiki). Conflicts between sources of different priority are settled by priority at intake and never reach the Ledger.
- **Default Stance of in-world documents:** Lens, unless the corpus marks them Authorial (`01-ontology.md` §1.5).
- **Purpose:** diagnosis, certification, or development.
- **Level:** Glance, Survey, Audit or Certification.
- **Temperament:** whether the author builds structure-first or content-first, and whether this is Axel's own project (then the Structuralist Position governs every step).

When the request leaves these open, infer them, say what was inferred in one line, and proceed.

## Step 1: Intake and Orientation

- **Base setting:** the historical period, genre template or composite the setting starts from.
- **Delta:** the novel concepts beyond the base, listed.
- **Medium:** codex-borne, narrative-borne, or mixed (`08-transmission.md`). It decides how Step 6 runs.
- **Legibility:** which tiers the material states, which it implies, and which are absent.

## Step 2: The Axiom Base and Substrate

Extract what the setting stipulates, before mapping anything else.

1. **Axioms.** Each System-tier statement the setting treats as primitive, with its **force**: Strict (exceptionless: prohibitions, invariants), Default (holds absent a defeater), or Tendency (distributional, with Norm, Deviation and Movers). Force decides conflict typing later, so it is recorded now.
2. **Substrate.** Base, Initial State and Boundary declarations (`01-ontology.md` §1.4).
3. **Seed.** The declared Seed, or a proposed one, marked as inferred.
4. **Lens register.** In-world beliefs, doctrines and documents, each with its holder, and the Authorial Conceit that records each holding.

**Reconstruction.** For a content-first corpus (most published fiction), the axioms are rarely stated. Abduce them: for each recurring pattern, ask what must be true at System grain for it to be plausible, and state the weakest System that would license it. Mark each reconstructed axiom `(inferred)` and cite the instances it was abduced from. Reconstruction is Inference, and every reconstructed axiom is a hypothesis that Step 5 and the Verification Protocol test.

## Step 3: Tier and Graph Mapping

Organize every element by tier, with its **Field and Domain** coordinates. Then record the three strata (`03-conceit-graph.md`):

- **License links:** what licenses what, Determined or Elected, over which Substrate.
- **Generation Edges:** sender set (load-bearing senders only), receiver, covering System, and the Persistent Relation it issued from.
- **Interaction annotations:** Persistent Relations only, with participants, and either their Generation Edge or the reason none issues.

Assign tiers by the **Modal Test**, decomposing bundles before the **Dominance Rule** assigns the resident grain (`01-ontology.md` §1.2). Flag elements that are:

- **Misassigned:** a Narrative instance asserted as a System rule, or a System rule stated as a Narrative fact; a Lore regularity standing where its licensing System should be.
- **Orphaned or islanded:** degree zero over licenses and Edges, or in a component with no System.
- **Implicit:** Systems inferable from Lore or Narrative but never stated, including those surfaced by the Coverage Rule, the Decomposition Rule, peer-link resolution, or the Recurrent Boundary test.
- **Stance-confused:** Lens content treated as setting fact, or setting fact attributed to a Lens.

Present the map as a table or tiered list, never as prose. Where a filesystem and Python are available, record the map as JSON (`assets/conceit-graph.template.json`) and run `python scripts/conceit_graph.py check graph.json`: the mechanical findings then come from the checker, and the analyst's work goes into the judgments the checker cannot make.

## Step 4: The Structural Profile

Measure the six properties and locate their findings (`04-structural-profile.md`):

- **Wholeness:** number of Systems; declared or not; Couplings; the Seed.
- **Closure:** build the Closure Register by posing the modal questions the content raises, Domain by Domain, high-capacity Channels first. Run the Taxonomy Audit on every classification. List the Sparsity Register.
- **Economy:** independence, generative ratio, critical load, inert axioms.
- **Grounding:** root profile, support, Lore genesis split, Determination Ratio.
- **Self-regulation:** loops and their polarities, limiters, every stability, growth and recurrence claim against its mechanism.
- **Consistency:** the certification level, or "uncertified" if the Verification Protocol has not run.

## Step 5: The Coherence Audit

Local checks, each a defeasible derivation over the recorded Substrate:

- **Licensing check (downward):** does each Lore element follow plausibly from at least one System? Each Narrative instance from Lore?
- **Tier skipping:** Narrative licensed directly by System, bypassing Lore. Usually a sign of underdeveloped Lore, or of a Lore regularity left implicit.
- **Lore–System inversion:** heavy Lore with thin or absent System. Measured in Step 4 (Grounding); diagnosed here.
- **Constraint check:** does each Conceit sit within the constraint space its Domain's Channel neighborhood generates, evaluated to a declared neighborhood depth, high-capacity Channels first? Distinguish **hard Constraint violations** (no recorded configuration could admit the Conceit) from **Retention failures** (it cannot survive the *current* configuration). A Retention failure may be deliberate content: a setting knowingly containing a doomed unit is coherent, and its dissolution is on schedule.
- **Optimizer check:** run the Optimizer Test on every affordance a competent in-world agent could reach (`04-structural-profile.md` §4.7.3).
- **Magnitude check:** run the Magnitude Audit on every stated quantity (§4.7.4).
- **Lens triage:** a contradiction involving Lens content is not a conflict. Move it to the Lens register, and check that the Authorial "they believe X" has a mechanism.
- **Handoff.** Every apparent conflict found here is intake for the Verification Protocol (V1), with its force-based type hint: both branches Strict suggests L; a Default on either branch suggests S or P; quantities suggest Q.

## Step 6: Transmission

Run when the setting is carried by a work with an audience, or when the user asks. Skip at Survey level on a codex unless asked. The step is medium-indexed (`08-transmission.md`):

- **Narrative-borne:** base setting, delta inventory and interaction surface, exposition burden against buy-in, compression opportunities, threshold risk, and the Registration Audit relative to a declared audience-state.
- **Codex-borne:** definitional order (`order`), forward references and circular definitions, primitive count, derivational load, and the Registration Audit of Licensing: can a reader run the derivations the codex expects them to run?

Transmission findings are costs to manage, never defects of the structure. Flag them neutrally.

## Step 7: Gap Detection

Classify every gap by kind and locate it. The table is organized by location, not by tier, because a Structuralist report has nothing to say in a Narrative row of Axel's projects.

| ID | Kind | Location (tier, Field/Domain, Nodes) | Finding | Structural consequence | Leverage |
|---|---|---|---|---|---|

Kinds:

- **Structural.** Subkinds: **Closure** (an undecided modal question or product cell), **Grounding** (ungrounded roots or chains; System-less components), **Regulation** (a dynamics claim with no mechanism; an unbounded loop), **Taxonomy** (a partition not exhaustive or not exclusive; a naming slip), **Coherence** (a Domain or System base that is two).
- **Generation.** A Realized Conceit with no recorded genesis; a Persistent Relation with no Edge and no reason.
- **Verification.** Systems or System pairs never exercised; a finding even under intentional sparsity, because it concerns the System's evidential status, not its population.
- **Exposure.** The content exists but is not surfaced in the material provided.

**Leverage** is critical load times severity: a Closure Failure on a high-load axiom outranks ten on an inert one.

Report the **Sparsity Register** beside the table, under its own heading. It lists decided-but-unpopulated space, and it is evidence that the structure is finished there, not a list of gaps.

## Step 8: Recommendations

Ordered by leverage. Each is phrased as a rule to add, a scope to state, a force to declare, a loop to analyze, or a quantity to check: "add the rule that decides whether an oath can be sworn by proxy", never "add a proxy-oath story". On Axel's projects no recommendation proposes Narrative development, asks that an institution be justified by a story, or judges an element by its dramatic potential. The criterion for every proposed addition is whether it illuminates or exercises the structure.

## What the protocol hands on

- Step 5's conflicts are V1 intake (`06-verification-protocol.md`).
- Step 7's Verification gaps set the coverage targets of the witness sweep (V6), ordered by critical load.
- Step 7's Closure and Generation gaps are the agenda for Generative Mode, if development is requested (`07-generative-mode.md`).
