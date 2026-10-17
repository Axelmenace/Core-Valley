# 02 The Two-Phase Pipeline and the Genesis Classes

**Contains:** the pipeline's compact machinery; Phase I (design) and Phase II (emergence) stage by stage; Retention and the three fates; the three genesis classes (Stipulated, Designed, Emergent); the Generation and Interaction Principles; self-similarity of the design pathway; the pipeline as a generative checklist.

**Read when:** tracing how a unit came to exist, checking whether a Conceit's genesis is recorded, working a Domain through Generative Mode, or deciding whether something dissolved diegetically or failed structurally.

---

## 2.1 The compact machinery

The pipeline is ten stages, but its machinery is four parts:

- **One gate:** the Constraint Principle. *Can this candidate exist within its Domain's configuration?* It is applied to two intake streams (designed candidates at Realization, emergent units at Selection) and applied standingly as Retention.
- **Two genesis pathways:** design (Phase I) and emergence (Phase II).
- **One dynamics loop:** Interaction, Persistence, Adaptation.
- **One propagation operator:** Configuration, closing as Reconfiguration.

The ten stages are the canonical order of analysis, not a strict chronology. Real dynamics interleave, and the loop nests recursively within Domains. Phase II is also the standing regime every Realized unit inhabits, whatever its origin: designed units join it at Interaction.

## 2.2 Phase I: Design

**Configuration → Discovery → Composition → Realization**

**Configuration** of a Domain's possibility space by the Realized States of its Channel-adjacent Domains (`01-ontology.md` §1.11).

**Discovery** of possibilities within that space. Discovery expands the *epistemic* possibility space, never the ontological one, which changes only when Configuration changes. It is the theorization of units compliant with the Domain's constraint space. This gives intentional sparsity a formal address: Discovered-but-uncomposed space is sparsity by design; undiscovered space is the author's own frontier.

**Composition** of candidate units from discovered possibilities.

**Realization** of the candidates compatible with the Domain's configuration, under the **Constraint Principle**. Each candidate is compatible or incompatible with its native Domain's constraint space. On Realization a unit gains **causal participation**: it is constrained by its native Domain, contributes constraints to adjacent Domains along every Channel its Domain has, and becomes subject to theirs in return.

## 2.3 Retention: the standing condition

Realization is entry. **Retention** is continuance. The Constraint Principle runs standingly against a configuration that Reconfiguration keeps changing, so a unit Realized under one configuration can lose Retention when adjacent Realized States shift beneath it. Retention is not an eleventh stage; it is the background against which Phase II runs, and Phase II's Selection is its special case for emergent intake. Three fates follow:

- **Stillborn:** fails at Realization. Never a Node; it remains a theorized unit in Discovery's epistemic space, still available as authorial material.
- **Transient:** Realized, later fails Retention. A full Node whose dissolution is diegetic: an annotation event, not an Edge. Its Generation Edges stand after it dissolves: if its Persistent Relations minted emergent units before it went, that genesis is not retracted, because senders need not outlive receivers. Transients are prime committed-Lore material; collapse patterns are what historians of a setting write.
- **Retained:** Realized and continuing.

## 2.4 Phase II: Emergence

**Interaction → Persistence → Adaptation → Emergence → Selection → Reconfiguration**

**Interaction:** the temporary realization of one or more causal relations between Realized units through exchange of matter, energy, information, authority or other Domain-specific quantities. It occurs within a Domain and across Domains, but only across adjacent ones, cross-Domain interaction being the qualifying feature of adjacency.

**Persistence:** continued Interactions among a set of units over time constitute a **Persistent Relation**. The **Persistence gate** is the formal boundary between diegesis and construction (`03-conceit-graph.md`): temporary Interaction stays off the record, Persistent Relations are recordable, and only gated relations feed Emergence.

**Adaptation:** every unit is modified by its Persistent Relations, adjusting its internal relations in response to its external ones. Uncommitted adaptation is annotation-level dynamics; the commit rule is in `03-conceit-graph.md` §3.3.

**Emergence:** the formation of a new higher-order unit from a Persistent Relation, canonically within a Domain but equally across adjacent ones. The emergent unit Realizes into whichever Domain's constraint space admits it, characteristically a higher stratum. Emergence is the sole minting operation for Generation Edges.

**Selection:** emergent units face the Constraint Principle and dissolve or persist. Selection is Retention applied to the emergent intake stream: the same gate, the same operator.

**Reconfiguration:** the surviving units constrain the possibility spaces of every Domain their native Domain is Channel-adjacent to. Reconfiguration is cycle closure, not a repeated stage. It hands adjacent Domains their new constraint spaces, and the pipeline re-runs from there. Upward configuration is ordinary configuration along a Channel and needs no special case.

## 2.5 Self-similarity of the design pathway

Phase I is not the authorial pathway; it is the design pathway in general. An in-world engineer runs it diegetically, and the author runs it at the outermost level: the author is the designer whose Domain is the setting itself. For the graph this means an in-world designer's Phase I run is *content*, not record. Only the outermost, authorial run mints the construction record.

## 2.6 The three genesis classes

Every Realized Conceit has exactly one of three kinds of recorded genesis, and may have several instances of it.

| Class | What it is | How it is recorded |
|---|---|---|
| **Stipulated** | A root: an axiom, a substrate declaration. The author's free postulate. The regress stops here. | `"role": "axiom"` or `"role": "substrate"`, no incoming link required |
| **Designed** | Admitted through the Constraint gate and licensed, at System grain, over its Substrate. Includes Elected Lore. | One or more license records, each `determined` or `elected` |
| **Emergent** | Receiver of a Generation Edge from a Persistent Relation, covered by a governing System. | A Generation Edge with at least two senders and `covered_by` |

Revision 04 named only the second and third, which left its own roots without a lawful genesis. Stipulation closes that hole, and it makes the root set auditable: **the roots of a well-grounded setting are exactly its Stipulations.** A root that is not Stipulated is ungrounded content.

A Conceit with both a license and a Generation Edge has dual genesis. That is legitimate where a designed unit is also the product of emergence, but it is noted so the author can confirm it.

## 2.7 The Generation and Interaction Principles

**The Generation Principle.** Every Realized Conceit has a recorded genesis in one of the three classes. A Conceit with none marks a detectable gap: an **exposure gap** if the genesis exists unstated, a **structural gap** if the setting as recorded cannot yet produce it. A Conceit that no possible configuration could admit is not a gap but a conflict, a **Constraint violation**, and intake for the Verification Protocol (V1).

**The Interaction Principle.** Where units stand in a recorded Persistent Relation, that relation is a higher-order unit in formation. A Persistent Relation annotation with no Generation Edge issuing from its constituents, and no stated reason why none issues, is a detectable gap. A stated reason is a legitimate close: some relations regulate and produce nothing new, and saying so is a finding about the setting's dynamics.

## 2.8 The pipeline as a generative checklist

In Generative Mode (`07-generative-mode.md`), each Domain and its adjacencies are worked through the pipeline's questions in order.

- **Phase I.** *What do the adjacent Realized States permit?* (Configuration) *What can be theorized within that space?* (Discovery) *What candidate units assemble from those possibilities?* (Composition) *Which candidates can exist under the current configuration?* (Realization)
- **Phase II.** *What exchanges occur?* (Interaction) *Which recur?* (Persistence) *How do the parties change?* (Adaptation) *What higher-order units form?* (Emergence) *Which survive the gate?* (Selection) *What do the survivors constrain next door?* (Reconfiguration)

Each answer is recorded as a Conceit, a relation or an Edge, with its genesis note.
