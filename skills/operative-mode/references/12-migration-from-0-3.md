# Operative Mode Framework, Draft 0.4: Migrating from Draft 0.3

**Contains:** the migration procedure for live Régimes and existing Mode Sheets, the crosswalk from every moved Draft 0.3 item to its Draft 0.4 location, and a worked Kernel from a real migration.

**Read when:** a Mode Sheet, State Record, or citation from Draft 0.3 is in play (anything with sections A.1 to A.21, eleven proposition statuses, or "Open Encounter"); or the User asks to bring an existing Régime under Draft 0.4.

---

## Compatibility

Sections §0 to §21 keep their Draft 0.3 subjects, so every citation in an existing sheet (§3.7, §15.4, §16.7 and the like) still resolves. §22 to §24 are new. A live Régime continues under Draft 0.3 until it is migrated; never migrate one silently.

## Migration procedure

Migration is an amendment between Parts (§17), so it needs the User's assent and never happens mid-Part.

1. **Keep the existing sheet as the Instrument.** A full Draft 0.3 Mode Sheet is a valid Draft 0.4 Instrument with `Baseline: None`. Optionally re-express it over the nearest Baseline (`11-posture-library.md`) so only Deltas remain; this usually shrinks it several-fold.
2. **Compile.** Write the Kernel, the Operating Brief, and the Touchstone (§22). Take the Touchstone from a short Proving Scene (§12.3) if Play has not produced a suitable passage.
3. **Tier the Record.** Give the existing State Record a Hot Tier (Checkpoint with the Kernel at its head), the Registers (Rulings, Cards, Stale, Knowledge Matrix), and a first Resumption Packet (§3).
4. **Translate statuses.** Map the eleven Draft 0.3 statuses to the four of §16.2 with reasons (table below). Re-record NPC testimony as Claims where it was logged as fact without other support.
5. **Declare honestly what changed.** Randomness that was "rolled" by the Operator without a tool becomes Judgment, User Roll, or Tool Draw (§15.9). Secrets described as sealed without a mechanism are re-declared at their true Commitment Level (§23).
6. **Version it (§17.7).** Minor where every Kernel item traces to a value the Mode already held; Major (a new Régime) where any Kernel item introduces a new value. A candidate that was never activated simply becomes a revised candidate.

## Crosswalk

| Draft 0.3 item | Draft 0.4 location | Change |
| --- | --- | --- |
| §3.4 Persistent hidden State | §23 | Moved; the Commitment Ladder |
| §3.8 Checkpoints | §3.8 | Kernel restated; confirmation defined |
| §4.5 Desired experience | §4.5 Aims | At most three ranked; Anti-aims added |
| §4.7 Operator independence | §8.2 Initiative | Merged |
| §5.1 Eleven Parameter attributes | §5.1 | Four required; the rest by exception |
| §5.4 Binding force | §5.2 | Kernel force added; notation fixed |
| §6.9 Authority closure | §6.9, §6.10 | Satisfied through the Residual Authority Clause |
| §8.1 Plurality | §8.1 Cardinality | Merged |
| §8.1 Self-transformation | §8.1 Mutability | Merged |
| §8.1 Role continuity | §4.6 Temporal horizon | Merged |
| §8.1 Seat visibility | §8.1 Separation Presentation; §13.8 | Merged |
| §8.2 Operational scope, Autonomy, Intervention threshold | §8.2 Initiative | Merged |
| §8.2 Complication propensity, Escalation tendency | §8.2 Pressure | Merged |
| §8.2 Consequence appetite | §7.6 Consequence Gate | Moved |
| §8.2 Commitment strength | §8.2 Resistance; §24.1 | Merged |
| §8.2 Opportunity use | §8.2 Disposition | Merged |
| §8.2 Narrativization tendency | §4.3 Narrative Organization | Merged |
| §8.3 Character, World and Narrative knowledge; Metagame awareness | §8.3 Knowledge Licence | Merged |
| §8.3 User-intention model | §8.4 Support Orientation | Absorbed |
| §8.3 Hidden-state access and use | §23; §16.9 | Moved |
| §8.3 Uncertainty tolerance | §8.3 Uncertainty Handling | Renamed; Oracle option added |
| §8.3 Canonization rule, Source precedence, Contradiction policy, Revision policy | §16.5; §3.7; §16.6; §16.10 | Single location |
| §8.3 Record reliance, Epistemic disclosure, Continuity confidence | §3.3; §3.6 | Absorbed |
| §8.4 Responsiveness | §8.2 Initiative | Absorbed |
| §8.4 Negotiation style, Disagreement posture | §8.4 Correction Posture; Challenge Licence | Merged |
| §8.4 Surprise relation | §4.5 Aims | Moved |
| §8.4 User-burden and Operator-burden tolerance | §4.8; §21.2 | Absorbed |
| §8.5 Generation, Orientation | §4.3; §15.11 | Absorbed |
| §8.5 Continuity form | §4.6 | Absorbed |
| §8.5 Thematic coherence, Tonal inclination | §8.5 Tonal Range | Merged |
| §8.5 Scene-framing tendency | §6.10, S9 | Moved |
| §8.5 Failure treatment | §15.7 Outcome Bands | Moved |
| §8.5 Causal strictness | §15.11 Causal Standard | Moved; anchored |
| §8.6 Monologue access | §8.6 Distance | Merged |
| §8.6 Scene length | §24.5 Turn Budget; §8.5 Pacing | Split |
| §8.6 Mechanics explicitness | §8.4 Transparency | Merged |
| §8.6 Channel presentation | §13.8 | Moved |
| §8.6 Sensory emphasis | §8.6 Descriptive Density | Merged |
| §14.2 Continuation-Validity Schema | §14.2 Checklist; §18.5 Audit rubric | Split |
| §16.2 Proposed, Inferred, Conditional | §16.2 Provisional, with reason | Collapsed |
| §16.2 Attempted | §3.4 Open Items | Moved |
| §16.2 Hidden | §16.4 Visibility | Moved |
| §16.2 Superseded, Retracted, Annulled, Noncanonical | §16.2 Void, with reason | Collapsed |
| Appendix A (PDF) and the Draft 0.3 skill's Mode Sheet | `assets/mode-instrument.md` | Unified |
| Appendix B State Record | `assets/state-record.md` | Tiered |
| Appendix C Activation Instruction | `assets/activation-instruction.md` | Revised |
| Appendix D Open Encounter 1.0 | Tête-à-tête 1.0 (`11-posture-library.md`) | Generalized into a Baseline |

Draft 0.3 sheet sections A.13 to A.21 map as: A.13 Resolution Protocol → §15; A.14 Canon → §16; A.15 Consequence → §7.6; A.16 Constraints → §19; A.17 Election → §11; A.18 Record → §3; A.19 Channels → §13; A.20 Safeguards → §14, §17, §18; A.21 Ratification → §12.

## Worked Kernel: The Drowned Throne v1.1, migrated

The v1.1 sheet (several thousand words) re-expressed over Neutral World 1.0 keeps under a thousand words of binding content. Its compiled Kernel shows what a Kernel should look like: conduct, not parameter values, each line traceable.

```
K1. Never decide, voice, or narrate the thoughts or feelings of the lord of House
    Vane; render only what he perceives, and stop where he would choose. [framework, S1 and S2]
K2. Rival houses play to win; persuasion without leverage fails, and every yield
    names what met its Price. [O]
K3. No magic, prophecy or coincidence resolves anything; every event has a cause
    the realm could trace. [I]
K4. No death, capture or ruin reaches House Vane without a visible Telegraph or
    declared Stakes. [O, the v1.1 Fairness Floor]
K5. Every holder of a combat, political, commercial or administrative role is an
    able-bodied, heterosexual adult man (combat from age 12); Elsyn Vael, holding
    through an adult-male regent, is the sole exception. [U, persistent]
K6. No Character resents, seeks to destroy, or seeks to subvert the hierarchy;
    all conflict is for position within the order. [U, persistent]
K7. Testimony is a Claim until established, and secrets reach Characters only by
    traceable sources. [O, new at migration]
```

K7 introduces a value v1.1 did not hold, so that migration is Major; v1.1 was never activated, so it revises a candidate and no Canon is touched.
