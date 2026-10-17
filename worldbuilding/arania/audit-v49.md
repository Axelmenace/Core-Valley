# Audit: Arania (Worldbuilding Project 49)

An Audit under Axel's Worldbuilding Framework, Revision 05 (`skills/structuralist-worldbuilding`), with a first Verification round. The Structuralist Position governs throughout: Narrative is never the resident register, absence over decided space is the project as designed, and every recommendation is a rule, never content.

**Record.** `graph-v49.json` in this folder, seal `sha256:e43e74c8a0e24f9e06ba7a56a60aab464c07e4cdd7d7d76e9fa40567365d6b28`. Re-run with `python skills/structuralist-worldbuilding/scripts/conceit_graph.py check worldbuilding/arania/graph-v49.json`.

---

## 1. Scope and Orientation

| | |
|---|---|
| **Corpus** | *Arania Worldbuilding Project 49* (Drive, 31 Aug 2026), read in full: all 1,395 lines of its extracted text. Secondary: the corpus-attributed lines of `skills/operative-mode/assets/examples/arania-magic-specification.md`, which was built from **Project 50**. Its `I` completions are not corpus and are not used. |
| **Version caveat** | Project 50 is not in Drive. v49 references Prana Realms, Breathwork, Spiritual Roots, Arcana tiers, the Intented and the One Power without defining them; v50 defines them (per the Specification's citations: [PRANA], [BREATHWORK], [INTENTWORK], [ARCANA], [SPIRIT STONES], [CULTS] and others). Findings that v50 may close are marked **(v50?)**. |
| **Not used** | The v49 Character Dossier (Sir Huwe Merewode): Narrative tier, not a resident register. |
| **In-world documents** | Lens by default. The codex itself is Authorial. Three Lenses are explicit: the One Faith's Doctrine of the Supremacy of the Elevated Soul, the Eastern Heresy, and the "believed, without evidence" Arcane cause of the Aldean fall. |
| **Level** | Audit, plus Verification round 1 (19 witnesses). |
| **Temperament** | Axel's project: Structuralist. |
| **Base setting** | High-medieval European feudalism ("entirely reminiscent of Medieval Europe"), xianxia cultivation (Foundation Establishment, Golden Core, Nascent Soul), an emanationist cosmology (the One Maxim's descending emanations; Eternal Days of 8.64 billion years), and a Jungian soul anatomy (Collective Unconscious, Ego, Persona, Superego). |
| **Delta** | Soul bifurcation; Lychionia; Wyra and the Fae; Teria; Sye, Strings and Real Domains; Dominators; the Planar Palimpsest; the Law of Wyric Oaths; caste by Soul Depth; mediums; the Luminary Faith; and, by reference, Prana cultivation. |
| **Medium** | Codex-borne: the Deductive regime (§6). |

A note on vocabulary. Arania has its own *Domains* (Personal, Real, Phenomenal). This report writes framework Domains with a `D-` id (`D-sye`, `D-feudal`) and Arania's always with their qualifier (Real Domain, Personal Domain).

## 2. Axiom Base, Substrate and Lens Register

Forty Systems were recorded; ids are those of `graph-v49.json`.

| Id | System (condensed) | Force | Domain |
|---|---|---|---|
| S01 | The Allhigh knows itself through play, casting off Illuminative Fragments (Souls), constantly | strict | D-allhigh |
| S02 | One Maxim → Supreme → Great Maxims → Maxims → Intents; met only in fragments | strict | D-allhigh |
| S03 | The Soul bifurcates: Elevated (Soul Core, Soul Ego, Third Eye, Sacral) leaves; Residual (Inner, Outer, Sea, Solar, Root) stays as a Shade | strict | D-soul |
| S04 | Soul Depth fixed by the Fragment's proximity to the Allhigh: Upper, Lower, none | strict | D-soul |
| S05 | Soul Sex is biological sex, constant across lives; a Female Soul cannot activate a Spiritual Root | strict | D-soul |
| S06 | Lina and Sul; the dominant one is the Soul Nature | strict | D-soul |
| S07 | Reincarnation only within one ethnicity, and one subcaste if Highborn | strict | D-soul |
| S08 | Souls enter only fit fetuses, competing by Soul Depth; the unensouled are Unborn | tendency | D-demography |
| S09 | The Unborn: no Soul, Sapience, Agency, Intellect, Prana, Fae or Shade | strict | D-demography |
| S10 | Three Planes; five one-way exits sorted by Teric sign; no return | strict | D-planes |
| S11 | Lychions: valuable experience, Pro or Anti, carried in the Third Eye; Grandsoul → Renascension | default | D-lychia |
| S12 | Soul Phase schedules, about ten times faster for Highborn | tendency | D-lychia |
| S13 | Oaths attract Wyra; the Wyric Superbase sets the Fae's odds; Wyra follows the Shade | tendency | D-wyra |
| S14 | The Law of Wyric Oaths | strict | D-wyra |
| S15 | Acts attract Teria under Reciprocity, credited to influencers in proportion | strict | D-teria |
| S16 | Teric thresholds: Paragon, Saint, Fiend, Nadir exits; Benefactor and Malefactor stations | strict | D-teria |
| S17 | One-way Sye Strings; brightness and solidity; Radiant Strings | strict | D-sye |
| S18 | Sye Control passes through bloodlines as the parents' average | tendency | D-sye |
| S19 | Past a Sye threshold a Domain becomes Real; its Sye falls to its Dominators | strict | D-realdom |
| S20 | Apparitions are indestructible while fed and die only of Sye deprivation | strict | D-shades |
| S21 | Every ensouled death leaves a bound, fed Shade that can possess the weaker | default | D-shades |
| S22 | Shades keep the Prana Core and techniques, and cannot cultivate | strict | D-shades |
| S23 | Paroxysm: a Fallacious Phenomenal Domain made Real re-derives history both ways | strict | D-palimpsest |
| S24 | Real Domains persist through all later Planar States | strict | D-palimpsest |
| S25 | Phenomenal Collapse by Superior Causality erases the loser | strict | D-palimpsest |
| S26 | Fate and Destiny are fixed and invariant across Planar States | strict | D-palimpsest |
| S27 | Extraterrestrial memory, Lychions and Fate survive Collapse; Divinity outranks Sye | strict | D-palimpsest |
| S28 | Narrative convergence toward one Song and one apex Dominator | tendency | D-realdom |
| S29 | Belief Follows Power: the state as Sye catchment | default | D-feudal |
| S30 | Conversion runs on generational time; cultural barriers resist | default | D-realdom |
| S31 | The Gift: inherited, infallible, perceives Wyra, Fae, Teria, Lychionic Type, Soul Phase | strict | D-mediums |
| S32 | Highborn mediums are infertile; Lowborn bear the Gift without penalty | strict | D-mediums |
| S33 | Cultivation needs Upper Soul Depth and an active Root; Empyrean forces transmigration **(v50)** | strict | D-cultivation |
| S34 | Enclaves serve Luminaries; priests crown feudatories; clergy are celibate Highborn male cultivators | default | D-faith |
| S35 | Imperial legitimacy: Ascendant Realm, all Regalia, Verne, coronation by its Archbishop | strict | D-feudal |
| S36 | Tenurial and Patrimonial oath hierarchies | default | D-feudal |
| S37 | Relics: Material Real Domains, held by possession and Soul Imprint | strict | D-realdom |
| S38 | "Impossible for women to enter either the Upper Plane or the Lower Plane through Teria alone" (derived) | strict | D-teria |
| S39 | Base Sye Capacity alike but for the Intented; seven Seas of Consciousness | strict | D-sye |
| S40 | Every star system stands on a continuum of moral authority | strict | D-planes |

**Seed.** The declared ground is the Allhigh, but the Allhigh licenses origins, not mechanisms. The Seed that the Cycle of Man actually runs on is stated outright in [HISTORY]: *"the Cycle of Man is marked solely by Sye."* Proposed, and recorded in the graph as S17 with S19:

> **What enough souls attend to becomes real, and can be held.**

The Allhigh is the Ground beneath it: why souls exist, why they differ in Depth, why they must remember. The Seed is the engine: Real Domains, Dominators, Apparitions, Relics, Paroxysm, Canons, Belief Follows Power and the hardening of the land all grow from the Sye threshold.

**Substrate.** B01 (the Blue Star; one supercontinent of about 90 million km² and 1.92 billion people; 490 states; 1712 AC); B02 (42nd Epoch, Cycle of Man, Modern Age, Sixth Era); B03 and B04, the two History drafts (§5, C10).

**Lens register.** L16 (the Residual Soul as "earthly mirage", held by the One Faith; holding recorded at L17), L18 (the Allhigh as evil, held by the Eastern Heresy; holding at L19), L20 (Arcana caused the Aldean fall, held as learned opinion; holding at L21, "believed, without evidence").

## 3. The structural core

Four structures carry Arania. None is stated as such in the codex, and each is the kind of thing a Structuralist codex should state.

### 3.1 The two inheritance channels

S03's bifurcation is also a sorting of everything a person carries into two channels of inheritance.

| Channel | Carried by | What travels in it |
|---|---|---|
| **Spiritual** | The Elevated Soul, by reincarnation | Soul Depth (caste), Soul Sex, Soul Nature, Teria (Sacral), Lychions (Third Eye) |
| **Lineal** | The Residual Soul, built anew with each body, then left as a Shade | Sye Control (bloodline average), memory, Honor and Persona, Wyra and the Fae (reset each life), the Prana Core and Root Aperture |

The **body market** couples the channels. Souls compete for fit fetuses by Soul Depth (S08), and Highborn Souls are confined to their subcaste (S07). So deep Souls take fit bodies, caste tracks bloodline in aggregate, and whenever a subcaste bears more children than it has Highborn Souls to fill them, the surplus goes to Lowborn Souls. The codex's bare statement *"Highborn often give birth to Lowborn"* [TERIA] is therefore **Determined**: S07 and S08 force it. That is one of the setting's best derivations, and the codex never makes it.

It also creates the setting's most productive boundary case. A **Peer-born Commoner** (a Lowborn Soul in a Highborn body) carries a Lowborn Soul Depth and the bloodline's high Sye Control. Every rule keyed on caste and every rule keyed on Sye Force part company there. Conflict C03 and questions Q06 and Q07 all live on this boundary (§5, §7).

### 3.2 The Accounts Grammar

Lychia, Wyra, Teria and Sye are written to one schema: a polar pair, a unit that accrues, a store in an Aperture, two Bases netting to a Superbase, and a seven-grade ladder of three positive grades, a neutral and three negative.

| Ledger | Poles | Unit | Store | Ladder | Persists by | Seen by | Exit |
|---|---|---|---|---|---|---|---|
| Lychia | Prolychion / Antilychion | Lychions | Third Eye (Elevated) | Supreme Psychon … Supreme Hylon; five Soul Phases | Reincarnation | self, mediums | Renascension (Aurions) |
| Wyra | Beneficence / Maleficence | Wyra Crystallites | Solar (Residual) | Great Profae … Great Antifae | The Shade; resets each life | self, mediums | **none** |
| Teria | Proteria / Antiteria | Teric Crystallites | Sacral (Elevated) | Paragon … Nadir | Reincarnation | self, mediums | Reincarnation to a Plane (Caeliors) |
| Sye | Prosye / Antisye | Strings | Sea of Consciousness (Residual) | Seas (capacity), four grades of Control; polarity only as Light/Dark Shades | Bloodline (Control); the Shade (Strings) | self only | Transublimation, via Apotheosis (Beatrions) |
| Prana **(v50)** | Prana / Miasma | Prana | Root (Residual) | seven rungs, Empyrean above | Shade Core, frozen | everyone (Aura) | Transmigration (Halcyrs) |

The Maxims supply the fifth exit (Transincorporation, Veridals). Two cells of the grammar are worth stating:

- **Wyra alone has no exit.** That is decided, not missing: the five paths are closed by [EXTRATERRESTRIALS] ("These are the only paths"). It makes Wyra the one purely this-worldly force. Product test T2 records it as two prohibited cells.
- **Sye has polarity but no net ladder for the living.** Prosychic and Antisychic Strings classify Shades as Light or Dark, but no living person has a Sye Superbase grade. The grammar predicts one and the codex is silent. Low leverage; state it, or state why Sye alone is not netted.

### 3.3 The disclosure gradient

| Who perceives | What |
|---|---|
| Everyone | Prana Force, through Aura (v50) |
| Mediums, and the self | Wyra, Fae, Teria, Lychionic Type, Soul Phase |
| The self only | Sye Force |
| The Allhigh and Jeten only | Fate and Destiny |
| **Nobody** | **Soul Depth** |

The caste system rests on the one quantity nobody perceives. Spiritual Roots reveal Upper Soul Depth in men who can activate them, but a Female Soul's Root is never active, and the codex names no test for a non-cultivating man. Mediums serve in "genealogical verification" and "marriage and inheritance disputes" [MEDIUMS], yet the Gift does not see Depth. This is Q06, the highest-leverage closure question in the Polity Field **(v50?: root tests at twelve)**.

### 3.4 The triad

[TERIA] and [Belief Follows Power] together state a three-way correspondence the codex never draws in one place:

| Cultivator class | Mode of influence (Teria) | Institution | Dominator class championed |
|---|---|---|---|
| Knights | Command | Great Clans | Ancestors |
| Templars | Persuasion | Templar Orders | Revenants (Luminaries) |
| Adventurers | Trade | Adventurer Halls | Relics |

It is a strong structure: each way of moving other people's Acts is paired with a way of harvesting the dead. It is also where the Dominator partition fails (C14): "Ancestor" is never defined.

### 3.5 Implicit Systems surfaced

| # | Implicit System | Surfaced from | Status |
|---|---|---|---|
| I1 | Highborn bodies left over by the subcaste lock go to Lowborn Souls | S07 + S08 → L01 | Determined; state it |
| I2 | The three Cycles are the three Aeons of the Epoch's Eternal Day: Perfected = Dawn (2.16 Gy), Elves = Noon (4.32 Gy), Man = Dusk (2.16 Gy). The Cycle of Man is the Epoch's Dissolution, and its end is the end of the Myriad Worlds | [THE COSMIC CYCLES], [HISTORY] (the numbers match exactly) | Implicit; state it |
| I3 | Fate is the invariant of the Palimpsest: every Planar State must hold every Soul's fated Chances. Jeten's knowledge of "the entirety of the Planar Palimpsest" needs exactly this | S26 + [FAE] (Jeten) | Derivable; closes most of Q02 |
| I4 | Radiant Strings are outflow. That is why Apparitions must hunt Sye while Phantoms, with the same Personal Real Domain, need not | S17 ("the sender sends Sye") | Explication; closes C09 |
| I5 | Teria prices the abuse of Wyra: a coerced oath binds (1.4), but the coercion is an Antiact | S14 + S15 (W01) | Holds; state it as the oath system's limiter |
| I6 | Witnessing is underwriting: witnesses share both Beneficent and Maleficent Wyra by Prana Base, so the strong underwrite only the reliable, and mediums' "moral-credit ascertainment" is the credit check | S14 12.4–12.5 + S31 | Holds |
| I7 | The Doctrine of the Supremacy of the Elevated Soul is a Sye-competition weapon: it devalues household and clan Shades, the Luminaries' rivals for Sye | S29 + L15, L17 (W14) | Grounds the Lens (C15) |

## 4. Structural Profile

Measures come from the checker over the recorded graph: 77 Conceits, 40 Systems, 37 Lore. They describe the reconstruction, which records Arania's Systems far more completely than its Lore, so the yield ratios understate the codex.

```
Wholeness        1 System. The co-reference graph is connected; S03's Aperture map and S17/S19 are its hubs.
Closure          22 modal questions; 14 failures (Q01-Q13; T1 cell postmortem|postmortem); Sparsity Register Q30, Q31, Q32
Economy          generative ratio 0.72 over recorded Lore; sole-support loads S20 6, S29 6, S33 5, S17 4, S16 4;
                 S06 (Lina/Sul) inert; S22 and S40 used by nothing in v49
Grounding        roots: 39 axioms / 4 substrate / 1 ungrounded (L13); support 1.00;
                 Lore 15 Determined, 11 Elected, 1 Emergent (determination 0.58)
Self-regulation  5 loops declared; L12 (Era alternation), L13 (Age collapse), L09 (Charter stability) have no mechanism;
                 6 cycles unanalyzed, among them Faith -> Feudal -> Real Domains
Consistency      C0 Mapped. C1 blocked by 12 open conflicts, S06 and S40 unexercised, and no fixed point
```

**Wholeness.** One System, which is not usual for a setting this wide. The Aperture map (one Aperture per force, every force housed in the Soul) is a Coupling layer, and it is what keeps Metaphysics, Mind and Polity in one structure.

**Closure.** Everything Arania decides, it decides hard. Its numbers are explicit (oath valuations, Fae odds, Sea multipliers, Eternal Day lengths). Its failures are all of one kind: **priority where two forces meet.** Fate against Paroxysm (Q02), accounts against re-derivation (Q03), Apotheosis against Teric exit (C05), the ethnicity lock against ethnogenesis (Q01) and against Higher Worlds (C04), the Charter against the Law of Oaths (C07). Each force is closed internally; the joints are not.

**Economy.** S06 (Lina and Sul) licenses nothing anywhere in v49: inert, so either a Seed awaiting development or decoration, and the author says which. S22 (Shades keep their techniques) is a capability nothing in v49 uses. S40 (the star systems' moral continuum) is an orphan whose natural use is as the referent of "Higher Worlds" (C04).

**Grounding.** Every recorded Lore element rests on a stipulation except L13 ("Ages end with civilizational collapse. Invading barbarians deal the death blow"), a regularity with no System behind it. The Determined/Elected split falls along the Metaphysics/Polity line: what the Soul forces (castes, Highborn bearing Lowborn, the demography of the Extraterrestrials, hard and soft land, the medium caste) is Determined; the institutions (enclave network, Charter, Unborn property law, the Faith's doctrine, the empires) are Elected.

**Self-regulation.** Belief Follows Power is a reinforcing loop with a stated limiter (conversion runs on generational time), and the narrative-convergence loop has a stated terminus. Both are bounded. What is missing is the **balancing** loop of the Polity: [Belief Follows Power] says "most polities live shorter" than conversion takes, and the Eras alternate between warring states and empire, but no System says why polities die young or why empires break. In this Field the history outruns the structure.

## 5. Coherence Issues: the Ledger

Typed by the Force of their branches. Cost classes follow V2: 0 explication, 1 scope or priority, 2 substrate or parameter, 3 new System.

| Id | Type | Where | Conflict | Cheapest patch (cost) | Gates |
|---|---|---|---|---|---|
| **C07** | P3 | [MAGNIFICENT CHARTER] vs [WYRIC OATHS] 2.1, 9, 12.1 | The Charter's witnesses "at the time of its inception" bind "all present title holders", and "no sovereign dares go against it". The Law binds only consenting witnesses and the oathswearer, all of 1366, and only the oathswearer can trigger consequences. A lord crowned in 1700 who breaches the Charter incurs no Wyra (W02) | (a) **Coronation consent**: at coronation by the seignory priest, a feudatory consents as witness to the standing Sacred Oaths (3). (b) **Representative succession**: for every collective subject, the current representative is the oathswearer, as for Institutional Oaths (1); then Q13 decides who represents civilization with no Emperor | (a) passes both: the Charter's rights survive, and it licenses why legitimacy needs a priest's coronation, why priests are among the Charter's witnesses, and why the Faith is constitutionally indispensable. (b) passes Gate 1; Gate 2 hangs on Q13 |
| **C05** | S | [EXTRATERRESTRIALS], [TERIA], [THE SOUL] | Exit triggers coincide with no priority. An Apotheist who is also a Paragon dies: Caelior (Teric reincarnation) or Beatrion (transublimation)? An Apotheist Saint: Higher World or Upper Plane? An Empyrean breakthrough at the moment of a Great Maxim? Highborn are both the usual Apotheists and the usual Teric extremes, so this is common | A priority order over the five exits (1) | Gate 1 passes; Gate 2 yields a ranking of the exits, and with it a ranking of the five kinds of Extraterrestrial |
| **C01** | L → S | [PHENOMENAL DOMAINS] "remains throughout all Planar States", "possesses all of the Phenomenal Real Domains of the previous stream" vs [Phenomenal Collapse] | Both Strict. Collapse erases a prior Real Domain that the permanence rule says must remain | Scope: permanence holds against re-derivation, not against contradiction (1) | Gate 1: the Paroxysm still cannot override prior Real Domains; streams still lengthen. Gate 2: the count of Real Domains becomes non-monotonic while causal density stays monotonic, which is exactly the arithmetic Punctuated Convergence needs |
| **C03** | S | [MEDIUMS] | Infertility is stated of "Highborn mediums" but caused by "the incongruity between the High Sye Force and the Gift". Sye Force follows bloodline (S18), caste follows the Soul (S04); a Peer-born Commoner with the Gift has high Sye Force and a Lowborn Soul (W03) | Key the rule on Sye Force (1) | Gate 1 passes. Gate 2: it licenses the medium caste's strict endogamy as more than custom. Marrying into high-Sye bloodlines would sterilize the Gift line |
| **C04** | S | [TERIA] vs [THE SOUL], [EXTRATERRESTRIALS] | Saints "ascend into Higher Worlds" and Fiends "descend into Lower Worlds" at death. "Higher Worlds" is undefined. If they are Middle Plane star systems, they break the ethnicity lock; if they are anything else, they break the five-path closure | Define Higher and Lower Worlds as the most Proteric and Antiteric star systems (S40), and give Saint and Fiend rebirth priority over the ethnicity lock (1) | Gate 1 passes. Gate 2: S40, now an orphan, gains its use, and the Middle Plane gains a moral geography |
| **C14** | S | [THE DOMAINS], [DOMINATORS], [Belief Follows Power] | Dominators are named "Ancestors, Revenants, and Relics". The mechanism given (a Personal or Material Real Domain, [SHADES]) also admits Guardians, Wraiths, Specters and living Apotheists. "Ancestor" is defined nowhere | Define Ancestor (likely Guardians and clan Phantoms), and state which Personal-Real-Domain holders can dominate other Real Domains (1) | Gate 2: completes the triad (§3.4) |
| **C02** | S | [SHADES] | "A Shade also carries the Prana Core" (every Shade) vs "Upon the death of a cultivator in possession of one or more Radiant Strings their Prana Core does not get destroyed" (conditional) | Choose the scope (1) | Decides whether a cultivator Ghast keeps its techniques: the military weight of the clan dead |
| **C08** | S | [THE SOUL] vs [SHADES] | Revenant = postmortem Apotheosis with Sye Deviation, but "All Revenants originate as Spirits" (antemortem Deviation). The cell postmortem Apotheosis × postmortem Deviation (a Wight or Specter that gains the other) is undecided (T1) | Prohibit the cell with a reason, or admit Wight-born Revenants (1) | Closes the Shade product space |
| **C06** | S | [TERIA] | "Impossible for women ... through Teria alone" is Strict, but its premise is a Tendency ("exceptionally rare, approaching zero"), and Teria is credited to influencers, persuasion included. A Lady who persuades her lord to war is credited a share of it (W11) | Declare the rule a Tendency, or add the Strict premise that would make it a law (1) | Either passes Gate 1. Only the second keeps "impossible" |
| **C13** | Q | [TERIA] vs [LYCHIONIA] | Highborn "reincarnate about a dozen times before either ascending or descending", yet reach Grandsoul, and immediate Renascension, near 350 soul-years. Consistent only if a Highborn life averages about 30 years; with cultivators' longer lives (v50), Grandsoul comes in one to three lives | Parameter: state the Highborn mean lifespan, or how soul-age counts (2) | Gate 1 passes if "a dozen" survives |
| **C12** | S | [EXTRATERRESTRIALS], [THE DOMAINS] | "Honor" names Sye in the Personal Domain (metaphysics) and membership of the Honor Group (institution). "Only Highborn men" are in the Honor Group in one place, "only the Highborn are capable of Honor" in another, and the Lowborn are "not metaphysically forbidden" in a third. The Honor Group is never defined | Split the term: one name for the Sye quantity, one for the institution (1) | Naming Test |
| **C10** | L | [HISTORY] | Two drafts interleaved. Draft A: the Deluge "left only the Seven Realms standing"; the First Era lay "completely located on Eastern Arania"; Arians from "Almans, Tharions, and Aldeans"; Eras of "200 to 500 years". Draft B: the Deluge left "only Asteria and Sylycia standing"; the First Era "completely located on Asteria"; Arians from "Almans and Aldeans"; Eras "around 200 to 300 years" | Elect one draft per fact (2) | Substrate only; no System touched |
| C09 | P1 | [APPARITIONS] vs [SHADES] | Phantoms self-sustain on a Personal Real Domain; Apparitions with one must hunt Sye | **Closed** by explication I4 (0) | — |
| C11 | S | [SYE] | "Base Sye Capacity alike" vs seven Seas | **Closed** by the v50 Intented ladder: the Seas grade only the Intented (0) | conditional on v50 |
| C15 | P1 | [THE ONE FAITH] vs [APPARITIONS] | A Luminary-serving Faith teaches that the Residual Soul, the Luminaries' own kind, is a mirage | **Accepted**: grounded by I7 | pending the author |

Round accounting: 15 conflicts at intake; 2 closed, 1 accepted, 12 open. No patch has yet been applied, so none has been charged. That is why there is no fixed point.

## 6. Transmission: the Deductive regime

Arania is a codex, so the cost is derivational load and definitional order, not exposition burden.

**The codex has no definitional order.** `order` places only four of the 22 recorded terms; the rest sit on or above a cycle.

- **Genuine circles, to break:** Lychion ↔ Soul Ego ("A Soul Ego is the collective embodiment ... of all of the Lychions"; Lychions are "encoded in the Third Eye Aperture", the Soul Ego). Paroxysm ↔ Planar State ("A Paroxysm is therefore the act of creating a new Planar State"; a Planar State is the state the Middle Plane enters on a Paroxysm). Sye ↔ Real Domain (Sye's section defines by Real Domains, "Any Real Domain which possesses the attention of the mind", before [THE DOMAINS] defines Real Domains by Sye).
- **Benign mutual references:** Soul ↔ Sye, Wyra ↔ Fae, Wyra ↔ Wyric Oath. [THE SOUL] lists every organ and force before any is defined (five forward references); marked as an overview, it stops being a defect.
- **Forward references (9):** listed by the checker. The largest: the Soul section uses Sye, Wyra, Teria and Lychions; Wyra uses Wyric Oaths 600 lines early; Dominators use Apparitions and Relics.
- **Undefined in v49:** Prana, cultivator **(v50?)**, Intented **(v50?)**, Ancestor, Higher Worlds, Honor Group, subcaste, Second Estate, abbots, holyknight and darknight.
- **Displaced axiom:** the Strict rule that only those capable of Breathwork may swear a Wyric Oath appears only in [THE ONE FAITH] ("being able to swear Wyric Oaths requires Breathwork"), not in the Law, which restricts only witnesses (2.4). v50 apparently moves it to 10.5. Its consequence, derived as L26, is large and should be stated: **no non-cultivator ever holds Wyra, so every Lowborn's and every woman's Fae is Primefae for life.**
- **Naming collisions:** *Reincarnation* names both ordinary rebirth and the Paragon/Nadir crossing. *Bondsmen* names both a Soul Phase and a social status. Seignories are named twice over (metropolis, castlery, canton in [APPARITIONS]; charter city, castleton, manor in [ENCLAVES]). [THE SOUL]'s list of what Residual Souls cannot access omits Transmigration; the next sentence includes it.
- **Partition:** "Thus there are seven Minor Tongues", one per realm, but Nacenish is "a Minor Tongue" too (T3).

## 7. Gap Table

Leverage is critical load times severity. **Closure** gaps are undecided modal questions; their verdicts are the author's.

| Id | Kind | Location | Finding | Structural consequence | Leverage |
|---|---|---|---|---|---|
| Q01 | Closure | S07 × [HISTORY] | When an ethnicity merges (Almans and Aldeans into Arians; Sylycians and Sthellars into Valyreans) or ends (Elves, the Perfected), where can its Souls go? | The whole recorded history is ethnogenesis; under S07 as written, each merger strands or re-routes a soul pool | **Highest** |
| Q02 | Closure | S23 × S26 | Can a Fallacious Real Domain contradict a Soul's Fate? | I3 derives "Fate yields to nothing"; state it, and say whether the contradicting song fails at Realization or is re-derived around the fated Chance | High |
| Q03 | Closure | S23 × S13, S15, S21 | Do Teric and Wyric balances, Shade memories and Honor survive when a Paroxysm re-derives away the Acts behind them? | Candidate, by analogy with S27: Elevated accounts (Teria, Lychions) survive, Residual ones (Wyra, memory, Honor) are re-derived with the Shade. Fecund: mediums would read Teric balances the visible history no longer explains, making moral residue the evidence of erased history | High |
| Q04 | Closure | S15 | When an influencer is credited for another's Act, is the Teria split with the actor or credited to both in full? | Decides whether a chain of command conserves or multiplies Teria, and so how fast the Highborn swing | High |
| Q06 | Closure | S04, S31 | By what test is a woman's, or a non-cultivating man's, Soul Depth known? (§3.3) | Caste, marriage, inheritance and genealogical verification all rest on it **(v50?)** | High |
| Q07 | Closure | S04 × S36 | Can a Lowborn-souled child of a Peer inherit a title? | I1 makes such children common | High |
| Q13 | Closure | S14 × [POLITICS] | Who represents civilization, and so can trigger the Charter's Wyra, while there is no Emperor? | Joined to C07 | High |
| Q05 | Closure | S10 | Can Extraterrestrials or Primordials act on, or communicate with, the Middle Plane after its creation? "An erased truth reintroduced ... from any of these repositories" implies a channel; entry is impossible | Decides whether the Lower Plane is a power in Middle Plane history | High |
| L12 | Regulation | [HISTORY] | The Eras alternate between warring states and empire with no loop that produces the alternation | The polity's balancing loop is missing (§4) | High |
| L13 | Regulation / Grounding | [HISTORY] | "Ages end with civilizational collapse" is a recurring Boundary input; by the Recurrent Boundary test it is a missing System | Name the law the barbarians obey | Medium |
| Q09 | Closure | S14 × S23 | Is a widely witnessed Descriptive Oath about the future a Phenomenal Domain that can be Realized? | The Coupling between oath and Palimpsest | Medium |
| Q08 | Closure | S13 | From what baseline do the Fae's "+25%", "+50%" and "+75% chance of Fortune" run? Added to 50%, +75% exceeds certainty | One line closes the Fae table | Medium |
| Q10 | Closure | S09 | The Unborn's legal status is fully specified; their capacity (labor, training, response to command) is not | Their place in the economy is undecided | Medium |
| Q12 | Closure | S14 §6 | Is "combined Prana Base" summed in Prana or read by rank? | Sets how many witnesses a High or Sacred Oath needs **(v50?)** | Medium |
| Q11 | Closure | [HYBRIDS & AVATARS] | How is a Hybrid formed, and can the human refuse it? | | Low |
| T1 | Taxonomy | Shades | Postmortem Apotheosis × postmortem Deviation undecided (C08) | | Medium |
| — | Generation | R4 | The enclave network and the Charter stand in persistent relation (every priest witnessed it; priests crown every feudatory), and nothing issues | Patch C07(a) would make this relation mint the Charter's living enforcement | Medium |
| — | Verification | S06, S40 | Never exercised | S06 is inert; S40 waits on C04 | Low |

**Sparsity Register** (decided and unpopulated: finished)

| Open question | Covering verdict |
|---|---|
| Q30: Which Great Songs make up the Arian oligopoly today? | Q26: an oligopoly of Great Songs, admitted (S28) |
| Q31: Which star systems are the most Proteric? | Q27: a continuum of moral authority, admitted (S40) |
| Q32: Which Lowborn Apotheists exist in 1712 AC? | Q28: Lowborn Apotheosis through fame, admitted (S19, S17) |

The register could be much longer. The 21 Anyra and 21 Daivona, the seven sets of Real Armaments, the 490 states and every Luminary but Wul and Asza are all decided-but-unpopulated in the same way. None of them is a gap.

## 8. Recommendations

Ordered by leverage. Each is a rule to write; none is content to populate.

1. **Write the Charter's living mechanism** (C07, Q13, R4). Either coronation consent (every feudatory, at coronation, consents as witness to the standing Sacred Oaths) or representative succession for collective subjects with a named representative of civilization in an interregnum. The first is the more fecund.
2. **State how the ethnicity lock behaves under ethnogenesis and extinction** (Q01). For instance: a Soul may enter any body descended from its ethnicity; merged ethnicities pool their Souls; the Souls of a lineage that ends do something specific.
3. **Rank the five exits** where their triggers coincide (C05), and define Higher and Lower Worlds, with their priority over the ethnicity lock (C04).
4. **State what the Palimpsest conserves** (Q02, Q03, C01): Fate (I3); the Elevated accounts; and Real Domains against re-derivation but not against Collapse.
5. **Decide whether Teric attribution is conserved or multiplied** (Q04).
6. **Key the medium penalty on Sye Force**, and decide the Peer-born Commoner's caste test and right of succession (C03, Q06, Q07).
7. **Write the Polity's balancing loop**: what kills polities young and breaks empires (L12), and the law behind Age-ending invasions (L13).
8. **Fix the Dominator partition and define Ancestor** (C14); decide the Shade Core's scope (C02) and the last Shade cell (C08); split Honor (C12).
9. **Give the women's Teria rule its Force** (C06), and the Highborn lifespan parameter (C13).
10. **Codex hygiene:** break the three definitional circles; mark [THE SOUL] as an overview; move the swearing restriction into the Law of Wyric Oaths; merge the History drafts (C10); unify the seignory vocabulary; fix the Minor Tongue count; give the ordinary and the plane-crossing senses of Reincarnation different names.
11. **Close the small tables:** the Fortune baseline (Q08), Descriptive Oaths as Phenomena (Q09), how combined Prana Base aggregates (Q12), Upper and Lower Plane channels (Q05), Unborn capacity (Q10), Hybrid formation (Q11).

## Appendix A: Witness log (round 1)

| Id | Class | Exercises | Outcome |
|---|---|---|---|
| W01 | optimizer | S14, S15 | Clean: coerced oaths bind, and coercion is an Antiact (I5) |
| W02 | optimizer | S14, S36 | Conflict C07 |
| W03 | boundary | S32, S18, S07, S08 | Conflict C03 |
| W04 | magnitude | S12, S11, S16 | Conflict C13 |
| W05 | magnitude | S08 | Clean: 1.92 billion over 90 million km² is about 21 per km², between medieval Europe overall (under 10) and its densest kingdoms (30 to 40) |
| W06 | long-run | S29, S30 | Clean, but exposes L12: nothing records why polities die young |
| W07 | boundary | S23, S24, S25 | Conflict C01 |
| W08 | boundary | S22, S21 | Conflict C02 |
| W09 | extremal | S16, S20, S10 | Conflict C05 |
| W10 | boundary | S16, S07 | Conflict C04 |
| W11 | boundary | S38, S15 | Conflict C06 |
| W12 | standard | S20, S17 | Conflict C09, closed by explication |
| W13 | standard | S31, S04 | Clean; exposes Q06 |
| W14 | optimizer | S34, S03 | Conflict C15, accepted (I7) |
| W15 | standard | S13, S14, S33, S05 | Clean: every non-cultivator's Fae is Primefae for life |
| W16 | standard | S15, S09 | Clean: the Unborn have no Demonstrated Interests, so harm to one is Irreciprocity only against its owner; Teria and the property rule cohere |
| W17 | standard | S01, S02, S26, S27 | Clean: Jeten's foreknowledge requires Fate's invariance (I3); "Realization is stochastic" is epistemic for in-world agents |
| W18 | standard | S19, S28, S29, S30, S35, S37 | Clean: imperial unification of the subrace Canons and the drift of borders to Sye divides both follow (G1, G2) |
| W19 | standard | S39, S33 | Conflict C11, closed via v50 |

Oath arithmetic was also checked by hand. All five valuation examples in [WYRIC OATHS] sum correctly, and the Magnificent Charter (Civilizational 5 + Legal 4 + Sacred 5 = 14) is Level V as stated.

## Appendix B: Certification

**C0 Mapped** for the graph sealed above, 17 Oct 2026. C1 needs: the twelve open conflicts closed, or P-types accepted with rationale; S06 and S40 exercised; and a sweep that mints no new conflict. Once the author rules on the recommendations, round 2 applies the patches, co-applies them (V4), and sweeps again.
