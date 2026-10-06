# Mode Instrument: Full (Differential)

The ratified configuration of a Mode (§1.4, §5.6). Hand it back **filled**, never blank.

Rules for filling it:

- Write only what departs from the Baseline Posture (`references/11-posture-library.md`). A line the Baseline already says is not written. Omit whole sections that carry no departure.
- Mark every written value `[source·force]` (§5.2). Sources: `U` User-set, `O` Operator-elected, `J` jointly settled, `I` inferred, `X` external, `B` Baseline. Forces: `K` Kernel, `H` Hard, `Df` Default (unmarked), `Pf` Preference, `Asp` Aspiration.
- Give every Operator Election a reason of one line. Mark every inference `I` so the User can correct it.
- Graded values are numbers 0 to 4 on the Anchored Scales (§8.7), never "medium" or "light".
- A full Draft 0.3 Mode Sheet is a valid Instrument with `Baseline: None`.

```
MODE: <name>   v<Major.Minor.Patch>   Régime <n>, Part <n>
Standing Framework: Deployable Working Draft 0.4
Baseline: <Posture name> v<n>   (or None)

INTENT
<one to three sentences: what the Mode is for, what success looks like from the User's side>

PURPOSE
Basis: …   Narrative Organization: …   Context: …   Horizon: …   Continuity burden: …
Aims (at most three ranked): 1. …  2. …  3. …
Anti-aims: …

KERNEL   (at most 7 items, at most 150 words; imperative, observable conduct; restated at every Checkpoint)
K1. …
K2. …

SIGNATURE CHOICES   (2 to 4, or "Null Election: the Baseline fits")
1. <value>: traces to <Intent / Aim / Inclination>; cost accepted: …

DELTAS FROM BASELINE
<Parameter> <value> [O·H]: <reason, one line>
<Parameter> <value> [U]

SEATS
User: <Seats, governed objects>
Operator: <Seats, governed objects>

AUTHORITY MATRIX   (departures from the Residual Authority Clause, §6.10, only)
| Operation | Holder (U/O/J/R/N) | Exercise | Note |

CONSEQUENCE GATE   (departures only)
Telegraph Rule: on | waived by User Delta
Tier 3 admissible: none | <listed>

RESOLUTION   (departures only)
Randomness source: Tool Draw | User Roll | Seed Tape | Judgment   (by Tier where it differs)
Outcome Bands: on | binary

CANON
Claim Rule: …   Commitment Level (default): 0 | 1 | 2 | 3   Uncertainty Handling: leave open | ask | Oracle

CONSTRAINTS
Content Dials: <subject>: Open | Veiled | Lined
Intensity Ceiling: <0 to 4, overall or per subject>
Value depiction: Attribution … / Enactment … / Structural Validation … / Rhetorical Advocacy …
Operator boundaries: …
Persistent across Parts: …

MODE-SPECIFIC MATERIAL
Setting and world rules: …
Characters: <names; Stake Cards and Voice Cards live in the Record>
Clocks at Activation: <name, segments, tick conditions, completion effect, visibility>

CAPABILITY   (this environment, not in general)
Environment: <tools present: code execution? files? memory?>
Qualifications and fallbacks: …

RECORD
Location: …   Tiers in use: …   Hot Tier budget: …   Checkpoint triggers: default | …

RENDERING
Turn Budget: <n to m> words   Hand-back Granularity: beat | exchange | scene
Touchstone:
> <80 to 200 words, ratified; ordinarily taken from the Proving Scene>

CHANNELS
Procedural Interrupt: [[HOLD]]   Stop: [[STOP]]   Other markers: default | …

DRIFT WATCH   (the Pre-Mortem: at least one story from the Regression family)
1. <failure story> -> <countermeasure> -> <Tell-tale>
2. …
3. …

ELECTION
Rule: …   Principal reasons: …   Trade-offs accepted: …   Material uncertainty: …

RATIFICATION
Proving Scene: retained | discarded | none
User assent: [ ]   Operator assent: [ ]
Activation: version, initial State, first Part, Régime, Resumption Packet
```
