# Cast and Stakes: the Stake Calculus Vocabulary in the Scriptorium

This reference imports the parts of the Stake Calculus (revision SC-3) that the Scriptorium uses to build a cast, state its conflicts and check its arcs. The Calculus is a formal language. In a novel, its quantities are **judged by the Operator** from the Cards, the Competence and the Record. They are not computed. The point is the distinctions, which stop a long manuscript from blurring things that must stay apart.

Section numbers in parentheses refer to SC-3.

---

## 1. Stakes (§1)

A **Stake** is a pair of an Agent and a Condition. Its **Signature** has three independent coordinates:

- **Realization**: whether the Condition obtains. It means nothing more than that. An illness can be realized without awareness.
- **Valuation**: whether the Agent prefers the Condition's presence or absence, judged against a stated alternative. It takes one of four values: `+` (presence preferred), `−` (absence preferred), `0` (Inert: indifferent) or `±` (Ambivalent: opposed considerations on one Stake, called Internal Tension).
- **Engagement**: whether scarce resources (time, money, standing, effort) are committed toward the Condition, and in which direction. A wish with no allocation is unengaged.

Valuation and Engagement can disagree. A ruler who values his office and commits to resigning it from duty is **Counter-Committed** (like in Earth IRL Abraham on Moriah, or Agamemnon at Aulis, or Brutus before the Ides of March).

### Operators and Modes

For a Polar Valuation, the **Operator** names what the Agent's want is doing:

| Valuation | Condition now | Operator | Gauge name |
|---|---|---|---|
| + | absent | Reach(φ) | Acquire |
| + | present | Hold(φ) | Protect |
| − | present | Reach(¬φ) | Escape |
| − | absent | Hold(¬φ) | Prevent |

Reach is pursuit, Hold is defence. "Acquire shelter" and "escape homelessness" are one Stake described twice (the Gauge Principle). On Cards, write the structure (`Reach`, `Hold`), not the phrasing. **Inquire** is the Operator of wanting to know (like in Earth IRL Oedipus seeking the killer of Laius).

The **Mode** records how Engagement stands to Valuation:

| Mode | Meaning |
|---|---|
| Latent | wanted, not pursued |
| Committed | pursued toward the valued outcome |
| Counter-Committed | pursued against the valued outcome |
| Divided | pursued in both directions, by different commitments |

A Card's Want is written as Operator and Mode on a Condition, for example `Hold(C-04) · Committed`.

### Stake Events

Every change of a Signature falls under one or more of these. The Chapter Ledger records them.

- **Disruption**: what the Agent valued stops holding.
- **Resolution**: what the Agent valued comes to hold.
- **Reorientation**: the Valuation changes, with or without any world event (an Agent comes to hate what it holds).
- **Activation / Deactivation**: commitment begins or ends.
- **Redirection**: commitment switches direction.
- **Uptake**: a Disruption followed, within a declared window, by Activation into the Committed Mode on the same Stake. This is the double transition (realization, then operationalization) at which a character takes up a story.

These events classify what happened. None of them is a mandatory beat in any sequence.

---

## 2. Goals (§2)

A **Goal** is a bounded temporal commitment over Conditions, in one of the canonical forms Reach, Hold or Inquire, with a window. A **Goal Version** is a Goal fixed under an ID. A revision creates a new version (`G-03.2`, parent `G-03`), and the old version keeps its own verdict. "Win the promotion by Friday" and "leave the firm by Friday" are two Goal Versions. Leaving successfully does not make the promotion succeed.

**Status:** Proposed, Operative, Suspended or Closed. A Closed Goal carries its reason: Achieved, Failed, Expired, Abandoned, Superseded (naming its successor) or Established Infeasible.

**Timing:** a Reach succeeds as soon as it is achieved, and fails only when its window closes. A Hold fails at the first violation, and succeeds only when its window closes. A Standing Obligation that runs past the end of the novel is *Maintained to Horizon*, never Achieved because the book ended.

**The Five Outcome Registers.** An outcome is recorded in five separate registers, and none of them determines another:
1. **Verdict**: did the Goal Version succeed?
2. **Satisfaction**: does the Agent value the result?
3. **Side-Effect**: what Stake Events did it cause elsewhere?
4. **Residual Risk**: what remains exposed past the Horizon?
5. **Architecture**: did the Agent's Core change?

"Victory" is a label only after an aggregation rule is declared. A Pyrrhic victory is a Verdict of success with a negative Satisfaction and heavy Side-Effects.

---

## 3. Agents (§3)

An Agent's Internal State divides into three groups:

| Group | Components | What it is |
|---|---|---|
| **Core** | Belief, Valuation, Internalized Norms, Restrictions, Dispositions | who the Agent is |
| **Plans** | Goal Versions, Commitment Ledger | what the Agent is doing |
| **Competence** | skills and capacities | what the Agent can do |

- **Internalized Norms** are distinct from the law. A law can bind an Agent who does not obey it, and an Agent can obey a law that does not exist (like in Earth IRL Antigone burying Polyneices, or Thomas More refusing the Oath).
- **Restrictions** come in two types: **Hard Filters** remove an action from consideration, and **Soft Costs** leave it available but charge it. If every option is filtered out, the Card must say what the Agent does then (its Paralysis default). The Operator never assumes that a viable choice exists.
- **Dispositions** are habits. They operate independently of Belief, so a habit can outlive the belief that installed it.
- **The Commitment Ledger** binds scarce resources. One act can serve several Goals and is paid for once. Not every act is a crisis: only an **overcommitted** Ledger, where the reservations exceed what the Agent has, forces a choice.
- **The Choice Rule** must be declared for each Agent. Admissible forms include **LEX**, which eliminates by Domain in a declared order, such as Expression ≻ Trust ≻ Safety ≻ Status ≻ Survival; satisficing; and habit-dominant deliberation. No universal order is a default. Survival-first is routinely falsified (like in Earth IRL Socrates declining escape, or Leonidas at Thermopylae).

**The Three Feasibilities** (§4) are distinct facts. Physical admissibility is what the world permits, Perceived feasibility is what the Agent believes workable, and Permission is what its Hard Filters allow. An Agent can attempt the impossible, refuse the possible, and believe in the forbidden.

**Blockade** (§5). A Goal the Agent could achieve with all its actions, but cannot achieve with the actions its own Hard Filters leave, is Blockaded. A **Believed Blockade** is the same judgment made under the Agent's own Belief. A Goal that keeps failing has four distinguishable causes: Blockade, Incapacity, Opposition and Misfortune. Name which one applies.

---

## 4. Conflict (§5)

Conflict is a property of a **pair of Goal Versions**, not of hostility. Test the classes in this order; the first that applies is the class.

| Class | Judgment | Earth IRL |
|---|---|---|
| **Infeasible** | one Goal cannot be achieved at any useful likelihood | Tantalus and the fruit |
| **Incompatible** | both achievable, never together | Eteocles and Polynices each ruling Thebes alone |
| **Contended** | together possible but unlikely, because the Goals compete for a resource, a moment or an action | Odysseus between Scylla and Charybdis |
| **Reliability Shortfall** | together possible but unlikely, only because two risks compound; no competition | the Greeks needing both Philoctetes' bow and Achilles' son |
| **Strategic** | achievable together, but the Agents' own choices keep it out of reach | The Gift of the Magi; the Prisoner's Dilemma |
| **Selection-Dependent** | achievable together if they happen to coordinate | two allies picking the same ford without speaking |
| **Harmonious** | their choices reach both | Theseus and Ariadne at the Labyrinth |

The pair can be one Agent's own two Goals (an **Intrapersonal Dilemma**).

**Collective Shortfall:** the cast's choices leave everyone worse off than some other joint course would. A conflict can be pairwise, and a defeat can be collective.

**Directed Effect:** whether Agent j's pursuit of a Goal helps or harms Agent i's Goal, judged against j *without* that Goal, choosing again. A character can call another an enemy while that other's current course is helping it.

**The Relationship Profile** of two Agents records the Class of each Goal pair, both Directed Effects and both Endorsements. Ally, Rival and Enemy are derived labels.

---

## 5. Other minds (§6)

- **Belief Depth.** Depth 1 is belief about another's beliefs, and depth 2 is belief about another's beliefs about one's own. Deception requires depth 1, and a double bluff requires depth 2.
- **Deception** requires three things together: the deceiver believes the claim false, expects the act to raise the target's credence, and chooses the act *for that reason*. Its forms are the **Lie** (an assertion), **Misdirection** (staged evidence, implicature, a planted object) and **Concealment** (preventing the truth from arriving). Deception is defined by purpose, never by outcome.
- **Trust** is a Belief: the credence that another's assertions are true and commitments honoured. One can trust a person and wish them ill.
- **A Promise** binds through a social norm regardless of sincerity. Sincerity is a separate fact, so a sincere promise can be broken and an insincere one kept.

---

## 6. Change (§7)

Four transitions are kept apart, and none entails the next:

1. **Refutation**: the Trace contradicts a belief.
2. **Recognition**: the Agent's credence falls.
3. **Revision**: a Core component changes.
4. **Behavioural Change**: what the Agent chooses changes.

Refutation can occur without Recognition, and Recognition without Behavioural Change (like in Earth IRL the physicians who dismissed Semmelweis, or Augustine praying for chastity "but not yet").

**Arc.** An Arc is a Core change that shows in behaviour on the declared **Probe Set**, with Competence held fixed. It is **Provisional** until **Retention** is checked: at a later declared point, the Agent must still be far from the old self and close to the changed self. A Core that keeps moving has undergone a **Further Arc**, not a retained one. An Arc is reported with its **Breadth**: on how many Probes it shows, weighted by how central each context is to the Agent.

| Change | What changed | Example |
|---|---|---|
| Arc | Core (Belief, Valuation, Norms, Restrictions, Dispositions) | Saul on the road to Damascus (Axiological) |
| Development | Competence | Achilles trained by Chiron; a level-up; a new technique |
| Decision | Plans only | taking a new job |
| Latent Arc | Core changed, not yet shown on any Probe | |

Arcs are typed by component: Epistemic, Axiological, Deontic, Restrictive, Dispositional, or Compound. Their direction (improvement or deterioration) exists only relative to a declared evaluator.

**Change Hazard** (§4). A character can change offstage. For every undisclosed interval, the Chronology states how likely each Principal's Core changed by a route the Record does not show. A high Hazard loosens what later chapters may assume.

---

## 7. Disclosure and Design (§8)

**Fabula** is what happens. **Discourse** is the telling: a sequence of disclosures from **Sources** (the narrator, a focalizing character, a document in the world). An unreliable Source's statement is a Discourse event, not a world fact.

**The Reader** is declared like an Agent: what it expects from genre, how far it trusts each Source. The **Dual Reader** distinguishes the Immersed belief, which is held from the text alone, from the External belief, which includes whatever the reader brings (the known myth, the remembered ending).

| Measure | Question it answers |
|---|---|
| **Surprise** | how far did this disclosure move the Reader? |
| **Suspense** | how far does the Reader expect the next disclosure to move it, on a question not yet settled in the Fabula? |
| **Curiosity** | how uncertain is the Reader about a fact already settled but withheld? |
| **Irony** | how far does the Reader know better than a character? |

**Reader Stakes** separate information from care. A coin toss over a trivial convenience and a coin toss over a beloved character's life have the same suspense. What differs is the Reader's stake in the outcome. Report the two separately.

**Strands.** A Focal Question **Opens** when the Reader's uncertainty about it rises past a threshold, and **Closes** when it falls below a lower one. Opening and Closing are Discourse events. Disruption and Resolution are Fabula events. The two pairs need not coincide.

**Design.** The Author Objective reweights what can happen, and it can make nothing possible that the world excludes.
- **Authored Coincidence**: an event improbable on the world's terms whose removal would cost the Design. It is testable, and the Scriptorium budgets it.
- **Discourse Deception**: the telling deceives the Reader for effect, by a false Statement (a Discourse Lie) or a purposeful omission (Discourse Concealment, like in Earth IRL the narration of *The Murder of Roger Ackroyd*).

---

## 8. Regimes (§9)

A Regime is a named claim with a scope and a falsifier. In an analysed text it is a hypothesis. In a novel the Operator writes, it is a **contract**, and its falsifier is a **Drift test** run at every Part Review.

| Regime | Contract | Breached when |
|---|---|---|
| **LEX** | the Agent chooses by its declared Domain order | it breaches a higher Domain's aspiration while a compliant option existed |
| **ADV** | an adverse event installs a Hard Filter and a categorical belief | the Filter disappears without Recognition, Extinction (repeated safe exposure) or a one-episode crisis override |
| **CRIS** | a non-Belief Core component bearing on a highest-Domain Goal changes only under a Believed Blockade | such a change happens with no Believed Blockade in the interval |
| **BOOK** | the novel opens and closes with its focal Stakes unengaged | a focal Stake is engaged at the first or last disclosed moment |
| **DUAL** | an Arc co-occurs with a declared External Strand, and its onset follows a Failure or Believed Blockade there within a window | an Arc with no coupled External Strand, or an onset with no Failure or Blockade in the window |

**Genre Regimes** declare an Author Objective as a convention. A **Hard** Genre Regime is a constraint: one failure breaches it. A **Soft** Genre Regime is a tendency across a corpus, and a single novel does not breach it. A Manifest declares which kind it means.

Regimes are declared **per novel or per Agent**, never as defaults. BOOK, for example, is falsified by every opening in medias res.
