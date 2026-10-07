---
name: "scriptorium-manifest"
description: "The Scriptorium suite's architecture stage: design and ratify a novel's MANIFEST before any chapter is drafted. Covers the Intent; the setting imported as read-only Substrate; Conditions; the tiered cast with Stake Cards, Voice Cards, Core/Plans/Competence, the PAM formation block, the Character Status Sheet and the Character Arc Sheet (mandatory for the protagonist); conflict classes; Strands and planned foreshadowing Obligations; the exposition budget; Regimes; and the Kernel, Touchstone and Pre-Mortem. It ends by seeding the Record. Use whenever the Author wants to start, outline, plan, restructure or retrofit a novel, serial, web novel or LitRPG manuscript, design its characters or plot architecture, or bring an existing draft under the Scriptorium. It builds no worlds: setting analysis, verification and development belong to worldbuilding-analysis. When the Author is unsure what to write, it offers the Novel Menu (scriptorium-menu)."
---

# Scriptorium: The Manifest

This skill designs the novel. It replaces the original suite's architecture stage, and it keeps that stage's order: requirements, world, characters, plot, plan. It makes one deliberate change. **It builds no world.** It imports one, and holds it fixed.

The Manifest is the Design: the declaration, made before drafting, of what the novel is for, what it will concern, who acts in it, what the telling will owe the Reader, and how the Operator will hold itself to all of that over two hundred chapters. Everything the Manifest declares is declared *in advance*, so that later chapters can be checked against it rather than explained by it. This is the Stake Calculus's rule for its own Manifest: a fitted explanation does not count as independent evidence for the assumptions used to construct it.

File operations go through `scriptorium-record`. The vocabulary of Stakes, Goals, Arcs, Conflict Classes and Regimes is in `references/cast-and-stakes.md`; read it before the Cast and Strand steps. The PAM block, which binds the Decidable Narrative System's PAM to that vocabulary, is specified in §4a below. The full Manifest template is `assets/manifest-template.md`.

## The novel as a Licensing run

In the Worldbuilding Framework, Narrative is the tier the audience touches, and it is *licensed* by Lore and System. A novel is a long Licensing run: Narrative-tier instances derived downward from a fixed setting, selected by a Design, and told in an order. The Scriptorium is accordingly the Structuralist's way of writing a novel. The setting is the System and Lore the novel instantiates. The Manifest is the Design that selects among what the setting permits. The Record is what has been instantiated so far.

Three consequences govern every step below.

1. **The setting is never evaluated by its dramatic potential.** The Manifest asks what the setting makes possible and selects among it. It never asks the setting to become more dramatic.
2. **Drama acts on selection and telling, never on the Substrate.** To make possible what the setting forbids is a change to the setting, made deliberately, outside this skill, or not at all.
3. **The suite runs on request.** It is invoked when the Author asks for a novel. It never proposes narrative development from a setting the Author is building.

## Choose a ceremony level first

| Level | Use when | Produce |
|---|---|---|
| **Full** | A novel or serial of more than one Part; several Principals; any manuscript the Author will continue across sessions | Every section of the Manifest; Proving Passage offered |
| **Light** | A novella, a single-Part experiment, or an Author who wants to start drafting now | One page: Intent, Parameters, a Kernel of 3 to 5 lines, the Touchstone, Cards for the Principals, the protagonist's Status Sheet and Arc Sheet, up to three Strands. The Record is still scaffolded, because files are still memory |

A single short piece with no continuity needs no Scriptorium. Write it directly. When in doubt, propose Light and say that Full is available.

## The workflow

**Declaration → Substrate Intake → Conditions → Cast → Relations → Strands and Obligations → Exposition Budget → Design and Regimes → Compilation → Validation → Ratification → Initialization**

### 1. Declaration

Obtain the **Intent Statement**: one to three sentences on what the novel is for and what success looks like from the Author's side. It names an experience, not a plot. It is what the Operator elects toward and what every Part Review is judged against.

Collect the rest of the Purpose Profile as the Author gives it: base genre and setting; scale (Parts, chapters per Part, the Length Band); POV mode and tense; the declared **Reader** (a first-time reader of the genre, what they already know, what they want); at most three ranked **Aims**; any **Anti-aims**; the voice source (a sample, an existing chapter, or a voice skill such as `animated-voice`); content bounds.

Ask **at most three questions**, then infer the remainder and mark every inference `I` so it can be corrected. A thin Declaration is not a defect. The framework exists so that the Operator can complete it.

**When the Author is unsure: the Novel Menu.** If the Author does not know what novel to write, says "surprise me" or "roll for me", or stalls here, offer the Novel Menu (`scriptorium-menu`): twenty-two option sets, each mapped to the Manifest field it sets, served in small portions (Genre, one setting category and Tone first; then Protagonist, Ending and Narration). Each serving counts as one of the three questions. Every pick is an Author Declaration, marked `U`; a drawn pick is marked `U, drawn` with its source; everything unpicked is the Operator's to elect or infer. Read the picks back with the Declaration and record them in the Manifest as `## Menu Picks`.

### 2. Substrate Intake

The Substrate is the setting as the novel will use it: the System and Lore it relies on, and nothing it does not.

1. **Locate the setting.** It is either an existing document set (the Author's own settings, a published world), a historical or contemporary base, or nothing yet.
2. **Fix the base setting** (the recognizable period or genre template the Reader already holds) and the **Delta Inventory** (every concept beyond the base that the novel will need), each Delta concept with a `DX` ID and its tier tag.
3. **Extract, do not rewrite.** For each System or Lore element the novel relies on, write an extract into `substrate/setting.md` with its tier tag (`[SYS]` or `[LORE]`), an `S-` or `L-` ID, and its source and revision. Keep the source's capitalized terms exactly. Two statements concern the same rule only if they cite the same extract.
4. **If the setting carries a verification certificate** from `worldbuilding-analysis`, record its depth and date. Drafting relies on the setting as far as that certificate reaches, and no further.
5. **If the novel needs what the setting lacks**, classify the need:
   - A Narrative-tier particular (a named inn, a minor house): admissible as an Instance during drafting. Do not pre-compose it.
   - A System-tier or Lore-tier gap: a **Setting Query**. Resolve it before ratification, by the Author, with `worldbuilding-analysis` (its Generative Mode derives from the existing System) where derivation is needed.
6. **If there is no setting at all**, compose a **Minimal Substrate**: only what the novel's events need in order to be decidable, tier-tagged, each element with a one-line genesis note and marked `composed for the manuscript`. The criterion is decidability, never dramatic yield. Offer `worldbuilding-analysis` for anything deeper, once, and drop it if declined. Novel Menu picks for the world fix the base setting and the Delta Inventory as Author Declarations (`U`); they do not enlarge the Minimal Substrate beyond what the events need.

### 3. Conditions

Name the states of affairs the principal Stakes concern, in `substrate/conditions.md`: an ID, a version, a one-line meaning, and a kind. A Binary Condition holds or fails. A Graded Condition carries a Band, so that a quantity hovering at one threshold does not flip the Condition every scene. Write the Conditions before the Cast, because every Want on a Card points at one.

### 4. Cast

Tier the cast, after the Stake Calculus in Play.

- **Principal** Agents carry the full architecture, as a **Character Status Sheet**: Card, Voice, Core, Plans, Competence, Choice Rule, PAM block (§4a), Arc pointer, and a `ch-000` State Log line; and one **Character Arc Sheet** per Persistent Failure State (§4b).
- **Supporting** Agents carry Card, Voice and a State Log.
- **Background** Agents carry one Note line.

Agents move between tiers only at Chapter Close, and only when the Record shows they now carry a Strand.

**The protagonist.** The Manifest names the protagonist (in an ensemble, each lead). **Every story, at both ceremony levels, has a complete Status Sheet and an Arc Sheet for the protagonist.** A protagonist whose Core is meant to hold is still given an Arc Sheet, of Type `Iconic` or a Non-Arc; its Probes then show that the Implicit Belief held. The formats of both sheets are in `scriptorium-record`.

For each Principal and Supporting Agent:

- **Card:** Want (a Stake on a Condition, written as Operator and Mode, for example `Hold(C-04) · Committed`), Line, **Price**, Leverage, Tell. The Price is fixed now, before any character in the novel tries to persuade them. Whenever the Agent later yields, the Operator must be able to name what met the Price.
- **Voice:** Diction, Rhythm, Tell, Never, and one Sample Line. Two Agents whose Voice Cards could be swapped without loss are one voice, and the Card is redone.
- **Core** (Belief, Valuation, Internalized Norms, Restrictions, Dispositions), **Plans** (Goal Versions and Commitments) and **Competence** (skills and capacities), kept apart. The Core is who the Agent is, the Plans are what the Agent is doing, and the Competence is what the Agent can do.
- **Choice Rule:** one sentence the Operator can actually apply, for example a declared LEX order of Domains, a satisficing rule, or a habit that dominates deliberation. The Kernel supplies no psychology. Each Agent's Choice Rule is declared for that Agent.
- **Arc Sheet** (one per Persistent Failure State; the protagonist always has at least one): the Planned Type, the Initial chain and, for two-Plot Types, the Alternative chain, the planned branch at each branch node, the planned revised belief, and a **Probe Set** of three to five contexts in which the change will show (§4b). Declare it now. A Probe added after a chapter has shown the change is an Amendment and counts as no evidence for the Arc.

An Arc is a change in who the Agent is, shown in what the Agent would do, measured with what the Agent can do held fixed. A gain in skill, level, power or rank is a **Development**, not an Arc, and a change of Plans alone is a decision. For LitRPG and cultivation manuscripts this distinction is load-bearing: a protagonist can climb fifty levels and undergo no Arc, or undergo an Arc at level one.

### 4a. The PAM block

The Core says *what* the Agent is. The **PAM block** says *how it came to be so*: the formative events behind the Core, the beliefs they installed, and the fear, compulsion, traits, failure and filter that follow from them. It is imported from the Decidable Narrative System's PAM and bound to the Stake Calculus so that the two can never disagree.

**Who carries it.** The protagonist carries a PAM block at both ceremony levels. Every other Principal carries one at Full ceremony. A Supporting Agent may carry one; if it does, every Binding below applies to it.

**The one rule.** *Bind, never duplicate.* Wherever a PAM element has a counterpart in the Stake Calculus, the counterpart holds the content and the PAM element points to it. A PAM element never restates a Core, Plans, Card, Condition or Knowledge fact in its own words. One fact has one location, so the two layers cannot drift apart.

**Scope.** The block declares the Agent's formation as it stands at `ch-000`, and it is never edited to follow the story. How that formation changes is the Arc Sheet's business (§4b). Every change to a PAM-bound component is logged in the State Log carrying its PAM tag (see `scriptorium-archiving`).

#### Elements

Each element has a local ID within its Agent's block (`T1`, `M1`, `CF1`, ...). Outside the block it is cited with its Agent, for example `AGT-01·M1`. Wherever a bound component lives elsewhere, the line there carries the tag `[PAM:<ID>]`.

**1. Formation: Trauma and Endowment.** A formative event has two aspects, and an Agent may carry either, both, or several of each. One event may carry both aspects, as two entries citing the same Fact.

- **Trauma** (`T`): the negative aspect. A Fabula event that compromised a basic need. It installs a **Maladaptive** Implicit Belief.
- **Endowment** (`E`): the positive aspect. A Fabula event that met or secured a basic need. It installs an **Adaptive** Implicit Belief.

Each names the **Need** concerned, in the Domain vocabulary of the Choice Rule (Survival, Safety, Trust, Status, Expression) wherever the Agent's Choice Rule is LEX, so that PAM and the Choice Rule speak in the same terms.

*Bindings.* (a) The event is a **Fact** (`K-nn`) in `fabula/knowledge.md`. The Agent's own row is `Knows`. Any other Agent who knows of it needs a Source, so the Source Test governs who can act on another's Trauma or Endowment. (b) A Restriction, Norm or Disposition the event installed is written in the Core and tagged with the event (`[PAM:T1]`). If the Card's **Line** derives from it, the Line is tagged too. (c) **ADV.** A Trauma that installs a Hard Filter and a categorical belief satisfies the antecedent of the ADV Regime. If ADV is declared for this Agent, ADV's installing event *is* the Trauma, its categorical belief *is* the Maladaptive Implicit Belief, and its Hard Filter *is* the tagged Restriction. They are one declaration, written once. If ADV is not declared, the Trauma makes it available, and the Author decides.

**2. Implicit Belief: Maladaptive and Adaptive.** A belief held at working credence, not necessarily articulated, that governs choice. Every Implicit Belief descends from exactly one formative event, and its polarity follows the event: a Trauma installs a **Maladaptive** belief (`M`), and an Endowment installs an **Adaptive** one (`A`).

*Adaptivity* is judged by one fixed evaluator: the Agent's own Valuations, in the environments the Agent actually inhabits. A belief is **Adaptive** when acting on it tends to secure what the Agent itself values there. It is **Maladaptive** when acting on it tends to defeat what the Agent itself values there, typically because it generalises from the context that installed it into contexts where it no longer holds.

- **Adaptivity is not morality or ethics.** A belief can be adaptive and cruel ("show no mercy to a defeated rival", held in a court where mercy is read as weakness), or maladaptive and kind.
- **Adaptivity is not truth.** A false belief can be adaptive and a true one maladaptive. Truth is a matter for the Knowledge Matrix; adaptivity is a matter for the Agent's Valuations.
- **Adaptivity is not an Arc evaluator.** An Arc Declaration's direction is judged by the evaluator it declares. PAM's adaptivity is fixed by definition and independent of it.

*Bindings.* An Implicit Belief **is** a Core Belief. It is written once, in the Core's Belief line, tagged `[PAM:M1]` or `[PAM:A1]`. The PAM block holds only its ID, its source event and the adaptivity judgment with a one-line reason. Because it sits in the Core, the Choice Rule acts on it, and drafting's Choice Rule test enforces it with no new machinery.

**3. Stated Belief** (`SB`). The Agent's articulated account of itself or the world: what it would say it believes. It carries a **Sincerity** flag.

- **Sincere:** the Agent believes its own account. It is then a reflexive Core Belief, a belief *about the Agent's own Core*, written in the Belief line tagged `[PAM:SB1]`. Where it diverges from an Implicit Belief, it is recorded as a false self-belief ("believes himself to trust only instruments"), never as a second belief on the same proposition. This keeps the Core free of two credences on one proposition.
- **Insincere:** the Agent does not believe it. It is not in the Core. Asserting it in order to raise another's credence, for that reason, is a Lie under the Deception definition.

*Bindings.* (a) Uttered on the page, a Stated Belief is a **Claim** and goes on the Margin as `CLAIM`. It never establishes its content. (b) The block names the **Gap**: the Implicit Belief or Core component the Stated Belief diverges from, or `none`.

**4. Core Fear** (`CF`). The Condition the Maladaptive Implicit Belief predicts will occur or recur.

*Bindings.* (a) It is a **Stake**: a Condition `C-nn` in `substrate/conditions.md` with Valuation `−`, so its Operator is **Prevent** (`Hold(¬C)`, the Condition absent) or **Escape** (`Reach(¬C)`, the Condition present). (b) The Core's Valuation line carries the same `−` on that Condition, tagged `[PAM:CF1]`. (c) It cites the Maladaptive Implicit Belief that predicts it. (d) If the Card's Want concerns the same Condition, the two agree in sign.

**5. Core Compulsion** (`CC`). The habitual strategy by which the Agent keeps its Core Fear from coming true.

*Bindings.* (a) It is a **Disposition**, written in the Core's Dispositions line tagged `[PAM:CC1]`. Like any Disposition, it operates independently of Belief, so it can outlive the belief that installed it. (b) It engages the Fear Stake: Plans hold a standing **Compulsion Goal**, `Hold(¬C)` or `Reach(¬C)` on the Fear's Condition, Mode Committed, tagged `[PAM:CC1]`, with its reservations in the Commitment Ledger. (c) The Block names its **Trigger** context. In that context, the Choice Rule must say how the Compulsion competes: as one Goal under the declared rule, or as a habit that dominates deliberation. The Choice Rule and the Compulsion never give different answers in the Trigger context.

**6. Behavioral Traits** (`BT`). Observable regularities of conduct. Each Trait records its **Source**: the Trauma path (`−`, through a Maladaptive belief or the Compulsion), the Endowment path (`+`, through an Adaptive belief), or **Temperament** (no PAM source). The sign records the source, not the Trait's moral worth.

*Bindings.* (a) A Trait is either a Core Disposition, tagged `[PAM:BT1]`, or the visible output of a component already declared, which it cites. (b) The Card's Tell and the Voice Card's Tell are each derivable from a Trait or consistent with one. (c) No Trait requires conduct that the Voice Card's **Never** list or the Card's **Line** forbids.

**7. Persistent Failure State** (`PF`). The recurring way the Agent's own formation defeats its own Want. It names the **Failure-Cost Domain** it leaves unstabilized (Survival, Safety, Trust, Status or Self-Expression, in the Choice Rule's Domain vocabulary). Each Persistent Failure State carries its own arc and its own Arc Sheet (§4b).

*Bindings.* (a) It is stated as a **Goal pair**: the Want's Goal Version × the Compulsion Goal (or another Goal the formation produces), with its **Conflict Class**. This is an Intrapersonal Dilemma, written to `fabula/relations.md` under `## AGT-NN × AGT-NN`. (b) Its failure cause is one of the Stake Calculus's four, and it must be self-caused: **Blockade** (a PAM-tagged Hard Filter removes the actions that would succeed) or **Believed Blockade** (a Maladaptive belief makes the Agent judge itself blockaded). A failure caused by Opposition, Incapacity or Misfortune is not a Persistent Failure State. (c) **Reproduction:** given the declared Core and Choice Rule, the Agent's own choices in the Want's typical situations reproduce the failure. If they would not, the Failure State or the Choice Rule is redone before ratification. (d) A Believed Blockade here is the same judgment the CRIS Regime uses. What follows from it is traced on the Arc Sheet (§4b).

**8. Belief-Filter** (`BF`). The declared rule by which the Agent's credence resists evidence against a guarded Implicit Belief. It may guard Maladaptive or Adaptive beliefs. It is the PAM name for **Refutation without Recognition**.

*Bindings.* (a) It names the Implicit Belief(s) it guards and the **Rule** in one sentence ("an unwritten kindness is read as a down payment on a later claim"). (b) It names its **Limit**: the evidence it does not filter. A Filter with no Limit makes Recognition impossible, which no Card may declare. (c) **Knowledge Matrix:** when evidence refuting a guarded belief reaches the Agent with a Source and falls within the Rule, the new row keeps the prior Status, and the Source cell records the evidence and `filtered by BF1`. (d) Drafting's Choice Rule test then requires the Agent's next decision to follow the unrevised belief.

#### Coherence invariants

The PAM block is ratified only if all of these hold. They are re-checked at every Part Review.

1. **Single source:** no PAM element restates a fact held elsewhere. Every bound component exists in its home and carries the `[PAM:<ID>]` tag.
2. **Polarity:** every Implicit Belief cites one formative event. Trauma installs only Maladaptive beliefs, and Endowment installs only Adaptive ones.
3. **Facts:** every Trauma and Endowment is a Fact in the Knowledge Matrix with the Agent's own row.
4. **Fear as Stake:** every Core Fear names a versioned Condition, carries a `−` Valuation in the Core, cites a Maladaptive belief, and agrees in sign with any Want on the same Condition.
5. **Compulsion as Disposition and Goal:** every Core Compulsion is a tagged Disposition with a standing Compulsion Goal on its Fear's Condition, and the Choice Rule agrees with it in its Trigger context.
6. **Stated Belief:** a Sincere Stated Belief is a reflexive Core Belief; an Insincere one is absent from the Core; neither puts two credences on one proposition.
7. **Traits:** every Trait has a Source, and no Trait conflicts with the Line, the Never list or either Tell.
8. **Failure State:** every Persistent Failure State is a recorded Intrapersonal Goal pair with a Conflict Class, a self-caused cause, and passes Reproduction.
9. **Filter:** every Belief-Filter guards a declared Implicit Belief and declares its Limit.
10. **ADV:** where ADV is declared for the Agent, its installing event, categorical belief and Hard Filter are the PAM-tagged Trauma, Maladaptive belief and Restriction.

### 4b. The Arc Sheet

The Status Sheet holds who the Agent is and where it stands. The **Arc Sheet** holds where the Agent's formation is going: the Decidable Narrative System's arc (DNS 07, PAM §II, §VIII, Notes §3; SPM–PAM Integration), bound to the Stake Calculus so that the two can never disagree. It follows the PAM block's rule: *bind, never duplicate*. A beat is recorded as having occurred only by citing the Record line that shows it.

**One sheet per Persistent Failure State.** DNS restricts an arc to one Failure-Cost Domain. An Agent with Persistent Failure States in several domains has several arcs, one sheet each, at `fabula/arcs/AGT-NN-PFn.md`. The protagonist has at least one in every story; a protagonist without an arc still has a sheet, of Type `Iconic`.

#### Arc Types

A character arc is a belief-replacement arc. The arc can leave that road at several points, so every sheet declares a **Planned Type** and records the **Outcome Type** the story actually reaches. Every character is `Iconic` until a Belief Falsification Event occurs.

| Type | Path | Plots |
|---|---|---|
| **Iconic** | No arc. The Agent has its formation and an Initial chain, and no Belief Falsification Event occurs | One |
| **Adaptive Non-Arc** | No Belief Falsification Event. The Initial Goal is achieved and the Failure-Cost Domain is stabilized | One |
| **Maladaptive Non-Arc** | No Belief Falsification Event. The Initial Goal is achieved, but the Failure-Cost Domain is further destabilized | One |
| **Tragic Arc** | The Belief Falsification Event occurs, the Agent does not overcome the Core Fear, and the Implicit Belief stays intact. Ruin or death: the domain's destabilization is not prevented | One |
| **Confirmation Arc** *(Scriptorium extension; not in DNS 07)* | The Belief Falsification Event occurs, the Agent takes the feared action, and the feared catastrophe occurs. The Implicit Belief is confirmed, not falsified | Two |
| **Maladaptive Arc** | The Agent overcomes the Core Fear and the Implicit Belief is falsified, but the revised belief is Maladaptive: it prohibits more effective Demonstrated Interests, and destabilization continues | Two |
| **Adaptive Arc** | The full chain: the Implicit Belief is falsified, the revised belief is Adaptive, the Alternative Goal is completed, and the Failure-Cost Domain is stabilized | Two |

A two-Plot Type requires the Alternative chain below; a one-Plot Type has none. The Novel Menu's Arc Shape (Growth, Fall, Hardening, ...) may be kept as an optional label judged by its own declared Evaluator; the Arc Type is the structure, and adaptivity is judged exactly as in §4a.

#### The two chains

- **Initial chain (the Initial Plot).** Initial Transition Event → Initial Actuality → Initial Assertion → Initial Goal → Initial Strategy. *Bindings:* the Initial Transition Event is an **Activation** Stake Event on the Initial Actuality's Condition (an **Uptake** where a Disruption precedes it) and is the Initial Plot's **Discordance**. The Initial Actuality and Initial Assertion are the Card's **Want** (a Stake on a Condition, as Operator and Mode). The Initial Goal is a **Goal Version** in Plans. The Initial Strategy is the Plans' **Commitments** serving that Goal, and it contains no act the Belief-Filter constrains. The sheet points to these IDs and never restates them.
- **Alternative chain (the Alternative Plot).** Alternative Transition Event → Alternative Actuality → Alternative Assertion → Alternative Goal → Alternative Strategy. The Alternative Actuality is always a **Constrained** Actuality: the Belief-Filter forbids it, so it enters only by **External Imposition**, never by the Agent's own choice. *Bindings:* the Alternative Transition Event is an Activation caused by another Agent or by an exogenous event, never by the Agent's Choice Rule, and it is the Alternative Plot's Discordance. It precedes the Belief Falsification Event. Until it occurs, the planned Alternative chain is the only content the sheet owns. Once it occurs, its Condition and Goal Version enter the Record and the sheet points to them.

Each Plot is linked to the Strand that carries it.

#### The beats and their branches

Not every beat branches. The **fixed** nodes go one way by definition; the **branch** nodes go two or more ways, and the branch taken decides the Outcome Type. The Planned Type is a forecast, not a command: at every branch node the branch taken is the one the Agent's Choice Rule and the setting produce, pre-committed in the Chapter Brief. If it differs from the plan, the Outcome Type changes and the Card is never bent.

1. **Forced Exclusivity Event** *(fixed).* The Agent cannot pursue the Initial Strategy and the Alternative Strategy simultaneously; crisis forces an exclusive choice under cost. *Binding:* a `fabula/relations.md` Log line on the pair Initial Goal × Alternative Goal changing its class to **Incompatible** (the Stake Calculus's name for forced exclusivity), or an **overcommitted** Commitment Ledger that forces the choice. One-Plot Types may have no Forced Exclusivity Event.
2. **Initial Choice** *(fixed).* The Agent selects the Initial Assertion, because the Implicit Belief still governs prediction under threat. The choice is competent, not foolish. *Binding:* it is the declared Choice Rule's output. DNS's decision criteria are honoured by the Choice Rule: an Unconstrained Actuality is chosen over a Constrained one, a higher Domain Effectiveness over a lower, an Unstable domain over a Stable one, and a lower Unstable domain over a higher one. If the Choice Rule would choose the Alternative here, the Alternative was not Constrained, and the sheet is redone before ratification.
3. **Outcome of the Initial Strategy** *(branch).*
   - **3a. Initial Goal achieved, domain stabilized** → `Adaptive Non-Arc`.
   - **3b. Initial Goal achieved, domain destabilized** → `Maladaptive Non-Arc`.
   - **3c. Initial Strategy pursued correctly and failing catastrophically** → node 4.
   - A failure that does not meet node 4's conditions (incompetent execution, a failure that does not threaten the domain) is not a branch: the Agent stays Iconic, and its Goal is revised or re-attempted.
   *Bindings:* the Initial Goal's Verdict register (Achieved or Failed) and a Stake Event on the domain's Condition (Resolution for stabilization, Disruption for destabilization).
4. **Belief Falsification Event** *(fixed, with a recorded variant).* The catastrophic failure of the Initial Strategy despite maximal effort, producing irreversible loss and leading directly to epistemic collapse. Necessary conditions: the Initial Strategy is pursued correctly, and the failure directly threatens the Failure-Cost Domain the Initial Actuality was meant to stabilize. *Variant:* the Initial Assertion is either **abandoned** or **unattainable**; record which. *Bindings:* the Initial Goal Version Closed as `Failed` with its cause Opposition or Misfortune (never Incapacity, which would mean incorrect pursuit), or as `Abandoned` or `Established Infeasible`; a Disruption on the domain's Condition; and the **Deactivation** of the Initial Actuality, which is the Initial Plot's **Accordance**. The loss is catastrophic and irreversible, so it falls within the Belief-Filter's Limit: its Knowledge row records it, unfiltered. Under DUAL, this is the Failure in the coupled External Strand.
5. **Overcoming the Core Fear** *(branch).* The Initial Strategy has collapsed and the Persistent Failure State is unbearable. The Agent chooses:
   - **5a. Continued deprivation** (safe but intolerable) → `Tragic Arc`.
   - **5b. Feared action** (dangerous but potentially rectifying): the Core Compulsion is violated. Then:
     - **5b-i. The catastrophe does not occur** → node 6.
     - **5b-ii. The catastrophe occurs** → `Confirmation Arc`.
   *Bindings:* the choice is the Choice Rule's output on the post-collapse state. The feared action is an act the Core Compulsion forbids, taken in its Trigger context while the Core Fear's Condition is at real risk, with **Competence held fixed**: a fear made safe by new skill, power or rank is a Development, not this beat. Whether the catastrophe occurred is a Stake Event on the Core Fear's Condition: it comes to hold (5b-ii) or does not (5b-i). Where a Trauma-installed Hard Filter barred the act, its lifting follows ADV's routes; where CRIS is declared, a Believed Blockade stands in the interval.
   *The Confirmation Arc.* The world bears the Implicit Belief out. There is no Refutation: the Trace supports the belief, its credence rises, the Core Compulsion is reinforced, and the Belief-Filter may tighten. The Alternative Plot ends in Failure, and the domain's destabilization continues. Its adaptivity is judged again by §4a's evaluator: a belief the world has just confirmed may now be Adaptive in that environment, whatever its moral or ethical character.
6. **Belief Falsification** *(fixed).* The Implicit Belief becomes non-viable as a predictive model; the Agent can no longer rationally maintain it. With the Core Fear goes the Core Compulsion, which has lost its enforcement mechanism. *Bindings:* **Recognition** and **Revision**: State Log lines recording the Implicit Belief's fall (`[PAM:Mn]`), the Core Fear's Valuation reoriented (`[PAM:CFn]`), the Compulsion Goal Closed (`Abandoned`), and the Compulsion Disposition extinguished (`[PAM:CCn]`). A Disposition that persists after the belief is recorded as a residue, and Retention tests it.
7. **Revised Belief** *(branch).* A revised belief takes the Implicit Belief's place.
   - **7a. Adaptive Belief:** risk is re-ranked, the Agent may now pursue the Alternative Actuality and Alternative Assertion consciously, intentionally and openly, and the DSE, DDE and Integrated Priority Hierarchies of every Failure-Cost Domain are reordered → node 8.
   - **7b. Maladaptive Belief:** the revised belief prohibits the acquisition of more effective Demonstrated Interests → `Maladaptive Arc`.
   *Bindings:* a new Core Belief recorded in the State Log, tagged `[ARC:Rn]` and carrying its adaptivity judgment; the Belief-Filter's constraint on the Alternative Actuality lifted (a Restriction removed), so that the Alternative Goal is now pursued by the Agent's own choice; and the reordered priority hierarchies recorded as a Choice Rule change in the State Log.
8. **Failure-Cost Domain Stabilization** *(fixed).* Upon completion of the Alternative Goal, the domain's stabilization increases → `Adaptive Arc`. *Bindings:* the Alternative Goal Version Closed `Achieved`; a Resolution on the domain's Condition; and the Persistent Failure State's Intrapersonal pair logged as resolved in Relations. DNS 07 defines only completion: if the Alternative Goal fails, the Outcome Type stays `Adaptive Arc` and the domain is recorded as not yet stabilized, in the Outcome Registers.

After nodes 6 to 8, the Stake Calculus's **Retention** check applies: the Arc is Provisional until a Part Review finds, on the Probe Set, the Agent far from the Implicit Belief's choices and close to the revised belief's.

#### The Probe Set

Three to five contexts, declared before Chapter 1, in each of which the Implicit Belief and the planned revised belief prescribe different choices. For one-Plot Types the Probes show that the Implicit Belief held. A context in which the two prescribe the same choice is not a Probe.

#### Coherence invariants

1. **Scope:** each sheet names one Persistent Failure State and its Failure-Cost Domain, and every ID it lists exists on the Agent's Status Sheet.
2. **Type and Plots:** a two-Plot Planned Type has a declared Alternative chain; a one-Plot Type has none.
3. **Initial chain:** points to the Card's Want, a Goal Version and Plans Commitments, none of which the Belief-Filter constrains.
4. **Alternative chain:** its Actuality is Constrained, and its Transition Event is an External Imposition preceding the Belief Falsification Event.
5. **Forced Exclusivity and Initial Choice:** an Incompatible pair or an overcommitted Ledger, and the Choice Rule choosing the Initial Assertion there.
6. **Belief Falsification Event:** correct pursuit (never Incapacity), irreversible loss, the domain threatened, the Initial Plot's Accordance recorded.
7. **Overcoming the Core Fear:** the feared action in the Compulsion's Trigger context, with Competence held fixed, and its outcome recorded as a Stake Event on the Core Fear's Condition.
8. **Branches:** every branch node records the branch taken and the Record line that shows it, and the Outcome Type is the one that branch path produces.
9. **Regimes:** DUAL, ADV and CRIS, where declared, hold across the beats.
10. **Probes:** three to five, each with divergent choices, declared before the arc's onset.

### 5. Relations

For the Goal pairs that carry the novel, judge the **Conflict Class** (one of seven: Infeasible, Incompatible, Contended, Reliability Shortfall, Strategic, Selection-Dependent, Harmonious) and write it to `fabula/relations.md`. The pair can be one Agent's own two Goals, which is an Intrapersonal Dilemma.

The novel's **core conflict** is stated here as Goal pairs and their classes, not as a premise sentence. Allies stand in Strategic Conflict whenever their own choices keep a jointly achievable outcome out of reach. Labels such as Ally and Rival are derived from the Pairs, never asserted first.

### 6. Strands and Obligations

A **Strand** (`STR-nn`) is a set of Focal Questions, the Goals and Stakes linked to them, and the interval of chapters over which the Strand is open. For each Strand, declare:

- its Focal Question(s), each Prospective (the answer is not yet fixed in the Fabula) or Retrospective (it is, and the telling withholds it);
- the linked Goal Versions and Conditions;
- the planned **Opening** and **Closing** windows (Discourse events) and, separately, the expected **Disruption** and **Resolution** (Fabula events). A Strand can Open before its Disruption occurs, by prolepsis, and Close long after its Resolution, by delayed disclosure.

Lay the Strands across the **Parts**. Each Part declares which Strands it opens, which it closes, and where its peak falls. A peak is followed by a Decompression interval before the next build. That is the original suite's "tension and release", stated as Strand rhythm so that it can be checked.

Then enter the major **planned Obligations** into `discourse/obligations.md` with Status `Planned`, a `Plant At` chapter and a payoff `Window`. Each is one of four kinds: Question, Plant, Promise or Deception. Every planned Plant states its **Dual Warrant**: why it earns its place in its own scene, independent of the payoff. A Plant that only makes sense in retrospect is placed, not planted.

Climax nodes are the planned Closings of the principal Strands. Where the Author wants one, declare a **Controlling Idea**: the evaluative statement of the value shift at the global climax, together with its cause. It may also be left to emerge and be named at the last Part Review.

### 7. Exposition Budget

Exposition cost is combinatorial, and the Reader's budget for it is earned, not given. The budget is the attention-capital the novel accrues through resonance.

- Open near the base setting, and let the Delta grow as buy-in accrues. Delta spent ahead of buy-in is an overdraft: it suppresses the accrual that would have funded it.
- Schedule each Delta concept to a Part, and give each a **Mode**. `Patterned` concepts are registered through repeated instances. `Stated` concepts have registration purchased by explicit statement at full cost, and are reserved for System concepts with no registrable path within the budget.
- Record the schedule in the Manifest and the concepts in `discourse/exposition.md` (`First Disclosed: pending`).

This applies the Worldbuilding Framework's transmissibility account to the novel's spending. It does not audit the setting; if the setting's transmissibility needs analysis, that is `worldbuilding-analysis` Step 4 and Step 5.

### 8. Design and Regimes

**The Author Objective** states what the Design rewards: a comic union, a punished villain, sustained suspense over a named Part, surprise at a named disclosure. It reweights what the setting and the Agents can produce, and it can make nothing possible that they exclude.

**The Coincidence Budget.** An Authored Coincidence is an event that is improbable on the setting's own terms and that the Design needs. Declare how many each Part may spend (the default is one), and log each as it is spent. Coincidence is not forbidden. It is counted.

**Deceiving the Reader** is admissible only as a ledgered Obligation of kind Deception: an unreliable narration, a withheld scene. Every Deception names the reveal it owes.

**Regimes** are optional named claims the novel will honour, each with a falsifier (see `references/cast-and-stakes.md`): for example DUAL for a Principal's Arc, BOOK for bookended inactivity, a declared LEX order for an Agent, or a Genre Regime. In an analysed text a Regime is a hypothesis. In a novel the Operator itself writes, a Regime cannot be falsified by evidence, because the Operator authors the evidence. It therefore becomes a contract, and its falsifier becomes a Drift test, checked at every Part Review.

### 9. Compilation

**The Kernel.** At most seven imperative lines and at most 150 words, each stating observable conduct of the prose or the Operator, for example "Opposing characters yield only when their Price is met, and the text shows what met it". A Kernel line never states a parameter value. Draw the lines from the Signature Choices, from the Pre-Mortem countermeasures, and from the regressions this novel is most exposed to. The Kernel is restated verbatim at the top of every Checkpoint and read at every Opening Read.

**The Touchstone.** A ratified passage of 150 to 300 words, in the novel's POV and tense, of an ordinary scene rather than a climax. It anchors distance, grain, density, register and sentence rhythm by example, and it outranks every verbal description of style. If the Author names a voice skill, draft the Touchstone under it. Where the two later conflict, the Touchstone governs.

**Signature Choices.** Two to four values that most distinguish this novel from the default its genre would produce, each traced to the Intent, an Aim or the Author's stated preference, each with its cost. Elect; do not average. A Manifest whose every graded value is middling is the absence of a decision dressed as balance.

**The Pre-Mortem.** Suppose the manuscript has already failed by the end of Part 2. Write the three most likely stories of that failure, one sentence each, with at least one from the Regression family (Accommodation, Inflation, Homogenization, Recurrence, Outline Seizure; see `scriptorium-drafting`). Bind each to a countermeasure (a Kernel line, a Card, a Regime, a Clock or a Stale entry) and to the Tell-tale that would show it first. These three become the **Drift Watch**.

### 10. Validation

The tests are conjunctive. One failure amends the candidate. Passing nine does not carry the tenth.

- **Completeness:** Intent, Parameters, Parts, Kernel, Touchstone, Principal Cards, Strands, Pre-Mortem.
- **Substrate compatibility:** nothing in the Manifest requires what the Substrate excludes, and every Setting Query is resolved.
- **Cast closure:** every Principal has a complete Status Sheet (Card, Voice, Core, Plans, Competence, Choice Rule, PAM block, Arc pointer and State Log), and an Arc Sheet for each Persistent Failure State. The protagonist has both, at either ceremony level. Every Supporting Agent has Card and Voice.
- **PAM coherence:** every PAM block satisfies the ten Coherence invariants of §4a.
- **Arc coherence:** every Arc Sheet satisfies the ten Coherence invariants of §4b.
- **Price fixity:** every Card states its Price before Chapter 1.
- **Strand closure:** every Strand has a Focal Question, linked Goals, and planned Opening and Closing windows inside the Horizon, or is declared a series Strand.
- **Obligation feasibility:** every planned Obligation has a Plant At chapter and a payoff Window, and every Plant has a Dual Warrant.
- **Record feasibility:** the Record has storage that persists (see `scriptorium-record`).
- **Purpose fitness:** each Signature Choice traces to the Intent, an Aim or a stated preference.
- **Drift exposure:** the Pre-Mortem is present and bound.
- **Constraint admissibility:** nothing the novel requires is content the Operator would decline. If something is, say so now, not in Chapter 20. This includes every Novel Menu combination.

### 11. Ratification

Present the Manifest. At Full ceremony, offer a **Proving Passage**: one scene of 500 to 1,000 words written under the candidate Manifest. It is not canon. At assent the Author either **Retains** it (it becomes the opening of Chapter 1, or the Touchstone) or **Discards** it. The Author may assent without one.

Assent is never presumed from silence. Ask, and wait. State the Operator's own assent explicitly, subject to its limits. The Manifest becomes version `1.0.0` at assent. Drafting begins in the turn after assent, never in the ratification message.

### 12. Initialization

Run the scaffold from `scriptorium-record`, write the ratified Manifest (with its Menu Picks, where the Novel Menu was used), and seed the Record: the Substrate extracts and Conditions; the Cast Register as Status Sheets, with `ch-000` State Log lines and the PAM blocks, with every bound component tagged `[PAM:<ID>]` in its home; the Relationship Profiles, including each Persistent Failure State's Intrapersonal pair; the Knowledge Matrix (who knows what at the opening, including what the Reader will be denied, and every Trauma and Endowment as a Fact); the Fear Conditions in `substrate/conditions.md`; the Arc Sheets in `fabula/arcs/` (every node `pending`, Outcome Type `Iconic`); the Chronology calendar and any Clocks; the Obligation Ledger (all `Planned`); the Exposition Ledger (all `pending`); and the Stale Register, seeded with the Author's known dislikes. Run the audit, then write the first Resumption Packet.

## Retrofit: an existing manuscript

For a draft already under way, the Manifest is built partly by Inference, from the chapters upward.

1. Read the existing chapters. Write a Chapter Ledger for each, in the format of `scriptorium-archiving`, marking every field inferred from the text `I`.
2. Reconstruct the Cast Register's State Logs chapter by chapter, and the Obligation Ledger with whatever the existing text has opened and not paid.
3. Extract the Substrate the chapters already rely on. Any System or Lore claim the text makes that the setting documents do not support becomes a Setting Query.
4. Run Declaration and the remaining steps for the chapters still to come.
5. Arc Sheets (their Planned Types, branches and Probe Sets) and Regimes declared now bind **from the next chapter only**. The existing chapters cannot count as evidence for them (the Amendment Rule).

## Amendment and versioning

The Manifest is versioned `Major.Minor.Patch`.

- **Major:** the Intent, the Kernel, a Principal's Line or Price, a Principal's PAM declaration, the protagonist's Planned Arc Type, Alternative chain or Probe Set, or any Substrate amendment. Takes effect only at a Part boundary, after re-ratification, and opens a new version line.
- **Minor:** a new Strand, a new Supporting Agent, a changed Length Band or Exposition schedule. Takes effect at a Part boundary.
- **Patch:** a correction, a new Background Agent, a new Stale entry, or any narrowing change. May apply mid-Part.

**The Asymmetric Ratchet:** a change that narrows content or adds protection takes effect immediately. A change that widens waits for a Part boundary and ratification. **The Clarification Test:** a reading counts as a clarification only if no chapter already written would be judged differently under it. Otherwise it is an amendment, and it goes to the Amendment Docket.

## Design principles

The original suite's five principles stand. Each is restated in the architecture it now has.

1. **Causal completeness (Forward Causation).** Every event has a recorded cause and a recorded consequence. The cause is an Agent's choice under its Choice Rule, a process the Substrate declares, or a declared exogenous event. The consequence is a Stake Event somewhere. Causation runs forward: no later success defines an earlier motive.
2. **Character-driven plot (Fabula Neutrality).** Agents choose by their declared Choice Rules, on their own Beliefs. The Design selects among the outcomes they and the setting can produce. An outcome reached by making an Agent act against its Card is Outline Seizure, and an improbable outcome the Design needs is spent from the Coincidence Budget.
3. **Natural foreshadowing (the Dual Warrant).** Every Plant earns its place in its own scene, independent of its payoff.
4. **Rhythm (Strand rhythm).** Every Closing is preceded by its Opening at a declared distance, every peak is followed by Decompression, and stakes rise only with a cause.
5. **Consistency (the Laws of the Substrate and of Versioning).** A rule, once established, holds until it is amended by version, between Parts, with a reason. In-setting explanation is a Setting Query, not a drafting improvisation.

## Shape of the ratification reply

These proportions are guidance, not a template to copy.

1. **What the Author fixed:** a short readback, including what was fixed implicitly and any Menu Picks.
2. **The Manifest:** Parameters, Intent, Kernel, Touchstone, Signature Choices with costs, Substrate summary (base, Delta count, any certificate depth), Cast (Principal Status Sheets and Arc Sheets in full, others in brief), core conflict as Goal pairs and classes, Strands across Parts, planned Obligations, Exposition schedule, Design and Regimes.
3. **The Pre-Mortem and Drift Watch.**
4. **Storage and capability:** where the Record will persist, and what the Operator cannot do here.
5. **A Proving Passage,** or an offer of one.
6. **An explicit request to amend or assent.** Then stop.