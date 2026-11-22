# 08 Transmission: Narrative-Borne and Codex-Borne

**Contains:** why transmission is indexed to medium; base setting and delta; the Inferential regime (narrative-borne media: the Audience Asymmetry, exposition burden, buy-in, registration); the Deductive regime (codex-borne media: definitional order, derivational load, registration of Licensing); mixed media; the Registration Audit.

**Read when:** running Analysis Step 6, assessing exposition burden, ordering a codex or setting document, or asking what an audience can recover.

---

## 8.1 Why the medium decides

Revision 04 held that Narrative is "the only tier the audience ever directly contacts". That is true of novels, films and most games. It is false of a codex, a setting bible, a rules text or a wiki, where the reader is handed System statements directly. Axel's own medium is the codex. Revision 04's transmission machinery therefore measured the wrong cost for the framework's principal user: it treated every explicit System statement as an exposition overdraft, when in a codex explicit statement is the medium itself.

Revision 05 runs transmission in two regimes, chosen at intake (`"medium"` in the graph):

| Regime | Media | The audience is handed | The audience must | The cost is |
|---|---|---|---|---|
| **Inferential** | Novel, film, play, most games | Narrative instances | Abduce Lore and System upward | Exposition burden against buy-in |
| **Deductive** | Codex, bible, rules text, wiki | System statements | Derive Lore downward (Licensing) | Derivational load against definitional order |

## 8.2 Base setting and delta

Every setting begins from a **base setting**, a recognizable historical period or genre template, which works as a compression algorithm. The audience already holds it, so only the **delta** (the novel concepts beyond the base) needs transmission. In pipeline terms the base is the Substrate's Base layer: the default configuration the setting's earliest derivations run over. This holds in both regimes.

**Compression opportunities** are novel concepts that can be anchored to base-setting analogues, lowering their cost. In a codex the anchor is explicit ("like on Earth IRL, ..."); in a narrative work it is implicit in what the audience is allowed to assume.

## 8.3 The Inferential regime

**The Audience Asymmetry.** Authors work top-down; audiences of narrative-borne work experience bottom-up. In graph terms, the author possesses the graph, and the audience possesses only the Narrative-tier Nodes and must *earn* the rest, link by link, through registration. So:

- System is at once the foundation of the world and the element most distant from the audience.
- A System Conceit is transmissible to the degree that a path of registrable links (licenses and Generation Edges) connects it to Narrative. Consistently patterning System into Lore and instantiating Lore into Narrative is the operation of driving links above the registration threshold by repetition.
- A System Conceit **must be explicitly stated** exactly when no path to it can be driven above threshold within the work's budget. Explicit statement buys registration at full exposition cost instead of accruing it through patterning.

**Exposition cost is combinatorial, not additive.** Each novel concept interacts with every Domain it is Channel-adjacent to, and those interactions must be conveyed too. The **interaction surface** of the delta is the number of Channel-adjacent pairs among Domains carrying delta concepts. Beyond a threshold, exposition burden overshadows Narrative itself.

**Buy-in: the exposition budget.** The threshold is not a constant of the medium but a function of **audience buy-in**: the attention-capital a work accrues through resonance (thematic, personal, emotional, creative or other), correlated with the willing suspension of disbelief. Delta sets exposition *cost*; buy-in sets exposition *budget*. Two consequences follow. The budget is temporal: works characteristically open near the base setting and expand delta as resonance compounds. And exposition and resonance compete for the same finite attention: delta spent ahead of accrued buy-in suppresses the accrual that would have funded it. Threshold failure is an overdraft, not a ceiling. In graph terms, buy-in sets the registration threshold, and the overdraft is links asserted before the scaffolding that would make them registrable has itself registered: a path built top-down that the audience cannot yet climb bottom-up.

**Registration.** Whether an audience registers a link's Inferential reading depends on the audience's state (accrued buy-in, exposure to repetition, adjacent patterns already registered), not on the link. One instance rarely produces registration; a recurring pattern characteristically does. Registration is indexed to accumulated transmission as derivations are indexed to Substrate: as buy-in compounds, links unregistered at first exposure become registrable, and links registered early scaffold those above them.

## 8.4 The Deductive regime

In a codex the reader receives System statements and must run Licensing: derive the Lore the codex expects them to see. The costs are different, and so are the instruments.

**Definitional order.** Every term should be defined before it is used. The definitional dependencies form a graph; a codex is well ordered when its presentation order is a topological order of that graph. `python scripts/conceit_graph.py order graph.json` computes one, and `check` reports **forward references** (a term used in a section before the section that defines it, given `codex_order`) and **circular definitions**. A circular definition is never an ordering problem; it is a structural one, and one of its terms must be made primitive or redefined.

**Primitive count.** The terms deliberately left undefined (`primitives`). A codex should have few, should know which they are, and should gloss each on first use.

**Derivational load.** For each Lore conclusion the codex expects the reader to reach, count the derivation steps from stated Systems and the number of Systems that must be held at once. Long chains and wide joins are where readers fail to follow. The codex lowers load with the devices of Axel's systematic exposition voice: a pin paragraph stating each conclusion the reader must keep, a scope sweep after each rule, deliberate restatement at increasing specificity, and licensed illustration (a worked example) at the points of greatest load. Licensed illustration is the Deductive regime's counterpart of patterning.

**Registration of Licensing.** At a declared reader-state ("a reader who has read Parts I and II"), which derivations can a reader be expected to run unaided, and which must the codex state outright? A derivation the codex relies on but neither states nor makes runnable is the Deductive regime's overdraft.

## 8.5 Mixed media

Game rulebooks, setting guides and annotated editions alternate codex sections with narrative ones. Record the medium per section where it matters, and run each section under its own regime. The commonest mixed-media failure is a System stated in a rules section and contradicted by the fiction around it: a Stance question first (is the fiction Lens?), then a conflict if it is not.

## 8.6 The Registration Audit

Conducted relative to a **declared audience-state**, never absolutely, just as certification is to a declared level.

- **Inferential:** at the declared state, which links' Inferential readings are registrable? What can the audience recover bottom-up? Which System Conceits have no path of registrable links to Narrative within the budget, and so require explicit statement? Which System elements stay functionally invisible unless driven above threshold by repeated patterning? Which Lore appears arbitrary because the System above it has not registered?
- **Deductive:** at the declared state, which derivations can the reader run? Where is derivational load highest? Which terms are used before they are defined? Which conclusions does the codex rely on without stating?

## 8.7 Transmission is a constraint, not a defect

High exposition burden or high derivational load is a cost to manage, not an error of the structure. Flag it neutrally. On Axel's projects, transmission findings never become reasons to simplify a System: they become reasons to order, gloss, restate or illustrate it.
