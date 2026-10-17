# 07 Generative Mode

**Contains:** when the mode runs and where it stops; four methods (Axiomatic Extension, Closure-Driven Generation, Transformational Variation, Reconstruction); the labeling notation; genesis notes; the generative output format.

**Read when:** creating or extending setting material, deciding which method fits a request, or labeling generated content.

---

## 7.1 When it runs, and where it stops

Generative Mode runs when setting material is to be created or extended. It keeps generation aligned with the framework: derive downward from System where possible, infer upward from Narrative only where the input forces it, and label every output by tier, strength, status and Stance.

**The termination rule.** On Axel's projects, Generative Mode terminates at Lore. System is the resident register and Lore the secondary one. Narrative is produced only when asked for, and then only as licensed illustration, tagged `[NAR·illustration]`: a demonstration of structure, never a step toward story. On other settings, Narrative suggestions may close the output when the request calls for them, and they are still licensed by named Lore.

Generated content never contradicts the author's stated System. It derives from it. A generated System that collides with a stated one is a conflict, not an improvement, and goes through V1 to V3 like any other.

## 7.2 Method one: Axiomatic Extension (System first)

For building a setting from scratch, or extending one at System grain.

1. **State the core Systems,** each with its Force, its Domain and its Boundary (what it governs and where it ends). Name the Seed.
2. **Identify the base setting,** and state what differs at System grain: the delta.
3. **Record the Domains and Channels,** with capacities, including any non-standard gradient as its own System.
4. **Work each Domain through the pipeline's questions** (`02-pipeline.md` §2.8), Phase I then Phase II, recording each answer as a Conceit, relation or Edge.
5. **Derive Lore:** the patterns, institutions, cycles and movements the Systems license over the Substrate, each marked Determined or Elected.
6. **Narrative,** only under the termination rule.

## 7.3 Method two: Closure-Driven Generation

The Structuralist's native engine: generation by deciding, not by inventing.

1. Build or take the **Closure Register**: the modal questions the setting's content raises, Domain by Domain, high-capacity Channels first (`04-structural-profile.md` §4.3).
2. For each undecided question, write the **weakest System that decides it**, with its Force. Prefer a scope or priority condition on an existing System to a new primitive (the patch cost order applies to generation as it does to reconciliation).
3. Derive what the new System licenses. New content raises new modal questions; add them to the register.
4. Repeat until the Closure Scope is closed, or the author stops.
5. Report the **Closure delta**: questions decided, new Systems, new Lore licensed, and the Sparsity Register as it now stands.

This method produces a setting that is finished in the Structuralist sense at every step: whatever has been decided is decided completely, and whatever is unpopulated is unpopulated by design.

## 7.4 Method three: Transformational Variation

Generate sibling structures by systematic transformation of an existing one. Each transformation is one change applied to the System, with everything downstream re-derived:

- **Inversion:** reverse a gradient (Culture configures Metaphysics instead of the reverse).
- **Parameter shift:** change a quantity (the tide comes monthly, not fortnightly).
- **Force shift:** change a System's Force (a Strict prohibition becomes a Tendency).
- **Negation:** strike or negate one axiom (`strike` shows what falls).
- **Substrate swap:** run the same Systems over a different Initial State.

The output is a comparison: what the original licenses, what the variant licenses, and where they diverge. Divergence locates the System's causal work; identity shows where a component is decorative. This is Cross-Substrate Yield (`06-verification-protocol.md`) run deliberately, and it is the best instrument for deciding between two candidate Systems before committing either.

## 7.5 Method four: Reconstruction (Narrative first)

For content-first input: a draft, a campaign log, a published story.

1. **Extract the implicit Systems:** what must be true at System grain for these events to be plausible? State the weakest such System, marked `(inferred)`, citing the instances it was abduced from.
2. **Construct the Lore** that would license those Narratives, and record which Lore is Determined by the inferred Systems and which is Elected.
3. **Make the System explicit,** and cite its status by certification level, never by flat assertion. Reconstructed Systems are hypotheses until exercised.

## 7.6 The labeling notation

Every generated element carries a tag and an id.

| Tag | Meaning |
|---|---|
| `[SYS·strict]`, `[SYS·default]`, `[SYS·tendency]` | System of that Force; add `·policy`, `·restriction` or `·gradient` where the kind matters |
| `[LORE·determined]`, `[LORE·elected]`, `[LORE·emergent]` | Lore by genesis |
| `[LORE·sub]` | A substrate declaration |
| `[LORE·witness]` | Witness Lore: scaffolding for the sweep |
| `[NAR·illustration]` | A licensed zoom-in, for demonstration |
| `[NAR]` | Committed Narrative (other settings only, or on request) |
| `@Lens(holder)` | Appended to any tag whose content carries Lens stance |

Ids follow the graph convention (`S`, `L`, `N`, `B`, with numbers), so that generated material drops straight into a Conceit Graph.

## 7.7 Genesis notes

Every generated element carries a one-line genesis note in one of four forms:

```
stip: axiom                                   Stipulated primitive
stip: substrate (Initial State)               Stipulated substrate
lic: S3 + S4 over B1 | determined             Designed, licensed (or | elected)
gen: {L2, L4} -> L3 | cov: S6 | via: R1       Emergent: senders, covering System, relation
```

Every `gen:` note names at least two senders and a covering System. A note that cannot be written in one of these forms marks a genesis that is not yet understood, which is itself a finding.

## 7.8 Generative output format

1. **Tier-labeled content,** using the notation above, with ids.
2. **Genesis notes,** one per element.
3. **Closure delta** (Method two) or **comparison** (Method three), where applicable.
4. **Open authorial decisions:** what the framework cannot decide. Each is labeled as either an **axiom choice** (a free postulate) or an **Election** (a choice among licensed runs), so the author knows which kind of decision is being asked of them.
