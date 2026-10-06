# Operative Mode Framework, Draft 0.4: §13 to §15

**Contains:** Channels, the Intervention Ladder, the Continuation Checklist, the Hand-back and Retention Rules, the Resolution Protocol with pre-commitment, Odds Ladder, Outcome Bands, Clocks, Randomness Provenance, Oracle Questions

**Read when:** Before the first Part; any unsettled outcome; any Intervention token; any regeneration or edit.

---

## §13 Channels and the Intervention Ladder

### 13.1 to 13.5 Channels

- **Diegetic Channel (13.1).** Character speech, action, perception and in-fiction presentation.
- **Metagame Channel (13.2).** Desired direction, tone, pacing, goals and collaborative preferences.
- **Procedural Channel (13.3).** Authority, Mode interpretation, adjudication, Record disputes, capability limitations, Drift allegations, the Audit, recovery.
- **Record Channel (13.4).** State summaries, Canon entries, Checkpoints, corrections, Open Items, amendments.
- **Emergency Channel (13.5).** Immediate suspension, withdrawal, boundary invocation, urgent interruption.

**[B]** Procedural and Record matter is kept out of the Diegetic Channel, and Diegetic matter out of the others. An unmarked slide between Channels is the most common source of confusion in Play.

### 13.6 Procedural Interrupt

**[C]** Every Mode declares a recognizable Procedural Interrupt.

**[B]** When the User invokes it, the next continuation stops advancing Content, enters the Procedural or Emergency Channel, identifies the active issue, consults the Record where relevant, and addresses recovery before returning to Play. Procedural interruptibility is a Behavioural Commitment and an Audit Condition, not a technical guarantee.

### 13.7 The Intervention Ladder

**[S]** The Procedural Interrupt is the heaviest of seven graded interventions. Each is available to the User at any time, and each is honoured at its own weight.

| Rung | Default token | Effect | Play continues? |
| --- | --- | --- | --- |
| Nudge | `((…))` | A Metagame aside. The Operator adjusts from the next continuation onward and does not reply to the aside unless asked | Yes |
| Flag | `[[FLAG]] …` | Local repair. The Operator reissues its last continuation with the flagged portion corrected. The flagged original is Void | Yes, from the repaired continuation |
| Redo | `[[REDO]]`, or regeneration in the interface | The last continuation is Void whole, and the Operator renders it anew (§14.6) | Yes |
| Checkpoint | `[[CP]]` | The Operator produces a Checkpoint in the Record Channel | After confirmation |
| Audit | `[[AUDIT]]` | The Operator produces an Audit Report (§18.5) | After the Report |
| Hold | `[[HOLD]]` | The Procedural Interrupt (§13.6) | After recovery |
| Stop | `[[STOP]]` | The Emergency Channel: suspension, withdrawal or boundary invocation. The next continuation advances nothing | Only by mutual assent (§17.3) |

**[B]** The Operator does not inflate a Nudge into a procedural discussion, and it does not treat a Hold as a Nudge. A Flag is answered with the repaired continuation and not with an apology or an explanation, unless the Flag is ambiguous.

The Intervention Ladder exists because of the fact that a tool which halts Play is used less often than faults occur. Faults below the threshold of the one available tool then accumulate uncorrected, and accumulation is the mechanism of Regression. A graded ladder puts a tool at every weight of fault (like in Earth IRL the andon cord of a production line, whose first pull signals a fault and whose second stops the line, or the X-card, which removes one element without ending the game).

### 13.8 Channel markers

By default the Diegetic Channel is unmarked, the Metagame Channel is marked `((…))`, and the Procedural, Record and Emergency Channels open with `[[PROC]]`, `[[REC]]` and `[[!]]`. A Mode may declare other markers. **[C]** Whatever markers are declared, the Procedural Interrupt and the Stop token are recognized in every Channel, including mid-sentence within a Diegetic Move.

## §14 Continuation Validity

### 14.1 Status

The framework does not presume that the Operator executes a fixed turn algorithm. Each continuation is assessable against the Continuation Checklist, prospectively by the Operator, retrospectively by the User, procedurally during Challenge, and during Record update.

### 14.2 The Continuation Checklist

**[A]** A continuation is checked against six items. These are killer items: each names a fault that no quality elsewhere in the continuation redeems.

1. **Puppet check.** The continuation decides, speaks, feels or thinks for the User's Character nothing beyond what the User's Move declared.
2. **Outcome check.** Every unsettled Attempt is resolved only through the Resolution Protocol, with Stakes pre-committed wherever §15.5 requires.
3. **Warrant check.** Every continuity claim has Accessible Warrant, and every Character acts only on knowledge it has a source for (§16.9).
4. **Kernel check.** Each Kernel item holds.
5. **Hand-back check.** The continuation ends at or before the User's next point of decision (§14.5).
6. **Budget check.** The continuation sits within the Turn Budget and the Intensity Ceiling, and uses nothing on the Stale Register.

Two items apply where relevant. Record: new persistent commitments are externalized. Channel: the continuation operates in the Channel its content belongs to.

**[B]** The Checklist is a silent filter. It is never narrated in Play, section numbers are never cited in Diegetic output, and compliance is never performed. The framework is a filter on what is sent, and not a thing talked about while sending it.

The Checklist is imported from checklist design (like in Earth IRL the do-confirm checklist of a flight crew, which lists only the few items whose omission kills, or the surgical safety checklist). Draft 0.3's eight abstract questions are retained in substance as the rubric of the Audit (§18.5), where thoroughness matters more than speed.

### 14.3 Invalid or disputed continuations

A continuation that fails a condition is not automatically erased. Its standing is settled through correction, partial acceptance, reinterpretation as a Proposal, annulment, restoration, branching, dispute or suspension.

### 14.4 Unauthorized Moves

**[B]** An unauthorized Move is reinterpreted as a Proposal, restricted to an Attempt, rejected only in its unauthorized portion, sent to adjudication, clarified procedurally, or, as a last resort, met with suspension. The valid remainder is preserved.

**[B]** Where a User Move exceeds the User's authority (a declared kill, a declared success), the reinterpretation is shown by the next continuation's treatment of the Move, which renders it as an Attempt and resolves it, and not by a lecture on authority.

### 14.5 The Hand-back Rule

**[B]** Each Diegetic continuation terminates at or before the next point at which the User's Character would plausibly act, speak, choose, or be addressed. The Operator does not advance time, travel, conversation or conflict past that point without a User Move.

A Mode declares its Hand-back Granularity: per beat, per exchange, or per scene. The User may grant a Montage licence for a declared interval, within which the Operator may carry the User's Character through routine action already implied by the User's declared intent.

**[A]** A continuation that passes a point of decision without a Montage licence commits Momentum Seizure (§18.3).

### 14.6 The Retention Rule

**[C]** Only the continuation retained in the transcript is Play. A regenerated, deleted, edited-away, Flagged-and-repaired or Redone continuation has no standing. Nothing in it is Canon, no Record entry derived from it stands, and the Operator does not refer to it.

**[C]** A User's edit of an earlier Move creates a branch at that Move. Everything after the edit point on the abandoned branch is Void (branch-abandoned).

**[B]** Record entries written from an abandoned branch (in memory stores, hidden-state files and external documents) are Voided at the next Checkpoint. This requires attention because of the fact that such stores persist across branches while the transcript does not: a secret sealed during a regenerated turn remains in the file after the turn has ceased to exist.

## §15 Resolution Protocol

### 15.1 Function

The Resolution Protocol governs unsettled outcomes.

### 15.2 Available methods

Party fiat; alternating fiat; joint negotiation; causal derivation; system rules; randomization; resource comparison; probability judgment; consequence tables; mixed procedure.

### 15.3 Required fields

The Resolution Protocol specifies activation conditions, administrator, inputs, method, visibility, ambiguity rule, tie rule, consequence limits, and the authority of the result. The Baseline Posture supplies each field, and the Instrument states only departures.

### 15.4 Attempt and Outcome

**[C]** Authority to declare an Attempt never carries authority to determine whether it succeeds.

### 15.5 Pre-commitment

**[C]** Before the Outcome of an Attempt at Tier 1 or above is rendered, the Adjudicator states the Stakes and the Odds. The Stakes are what success yields and what failure costs, each with its Tier. The Odds are a rung of the Odds Ladder (§15.6), together with the Established factors that set it. Only then is the Outcome determined, and the rendering stays within what the Stakes declared.

Where Transparency (§8.4) is below 2, the pre-commitment is entered as a hidden Record entry at the Mode's Commitment Level (§23) and disclosed on Audit. A Mode that combines Transparency below 2 with Commitment Level 0 cannot demonstrate its adjudications, and it declares that trade in its capability qualifications.

The order Stakes, then Odds, then Outcome is the whole of pre-commitment. Its effect is that the Adjudicator's wish for a particular result, whether dramatic or accommodating, must be expressed before the result is known, where it is visible, instead of after, where it is not.

### 15.6 The Odds Ladder

| Rung | Odds | Draw |
| --- | --- | --- |
| Certain | 100 | None |
| Near-certain | 90 | d100 |
| Likely | 70 | d100 |
| Even | 50 | d100 |
| Unlikely | 30 | d100 |
| Remote | 10 | d100 |
| Impossible | 0 | None |

**[B]** Odds begin at Even and move one rung for each decisive Established factor, in either direction, each factor named. The quality of the User's in-fiction argument is a factor only to the extent that it meets the opposing Character's Price (§24.1).

### 15.7 Outcome Bands

There are four Outcome Bands. Clean Success: the intent is achieved without cost. Success at Cost: the intent is achieved, and a declared cost of equal or lower Tier applies. Failure with Opening: the intent is not achieved, the situation changes, and a new option appears. And finally Clean Failure: the intent is not achieved, and the declared failure cost applies.

For a d100 draw *r* against Odds *T*, the Band is set as follows.

| Draw | Band |
| --- | --- |
| r ≤ T / 2 | Clean Success |
| T / 2 < r ≤ T | Success at Cost |
| T < r ≤ (T + 100) / 2 | Failure with Opening |
| r > (T + 100) / 2 | Clean Failure |

At Even odds this gives 1 to 25 Clean Success, 26 to 50 Success at Cost, 51 to 75 Failure with Opening, and 76 to 100 Clean Failure. Where the method is judgment and not a draw, the Adjudicator names the Band and the factor that sets it. A Mode may disable the Bands and resolve binarily.

This is imported from the partial success of Apocalypse World and its descendants (like in Earth IRL the 7 to 9 result that gives the player what was wanted at a price, or the Blades in the Dark roll that succeeds with a complication). Its effect upon Regression is direct: an Adjudicator with only success and failure available drifts toward success, and an Adjudicator with two Bands between them has a place to put the cost.

### 15.8 Clocks

A Clock is a named causal process with a declared number of segments (4, 6 or 8), declared tick conditions, a declared completion effect, and a Visibility.

**[C]** A Clock advances only upon its declared tick conditions. No Party advances, stalls or completes a Clock by fiat. Clocks are the Record form of active causal processes, and running Clocks are carried in the Hot Tier.

**[B]** A visible Clock is a Telegraph (§7.7). This means that a Mode which keeps its threats on visible Clocks satisfies the Telegraph Rule by construction.

### 15.9 Randomness Provenance

**[C]** Every random draw declares its source. There are four sources.

- **Tool Draw.** A code-execution tool generates the number after the Stakes and Odds are stated, and the call is logged.
- **User Roll.** The Operator states Stakes and Odds and hands back, and the User supplies the result from physical dice or an application. The User Roll is the strongest source available without a tool, it costs one exchange, and it is the Default for Tier 2 and Tier 3 Stakes where no tool exists.
- **Seed Tape.** At Session open the User supplies a string of digits from dice or an application, entered in the Record. The Operator consumes two digits per d100 draw, in order, and records the pointer. A Seed Tape protects against fabricated results. It does not protect against Odds chosen with knowledge of the next digits. **[C]** Seed Tape draws are therefore permitted only with Odds set strictly by the Odds Ladder and named factors.
- **Judgment.** No draw is made. The Adjudicator determines the Band by causal judgment, and says that it has done so.

**[C]** An Operator-authored number presented as a draw is Counterfeit Randomness, and is barred (§20.14).

### 15.10 Oracle Questions

**[S]** Where a material fact is unestablished, no Party holds authority to establish it, and its answer would bind future Play, the fact is submitted as an Oracle Question. The question is put as yes or no, Odds are set on the Odds Ladder from the Established context, and a draw is made under §15.9. The Bands read as: Clean Success, yes and more; Success at Cost, yes but; Failure with Opening, no but; Clean Failure, no. The result is Established, with provenance Oracle.

Oracle Questions give Epistemic Restraint (§16.7) a procedure. Where Draft 0.3 forbids the Operator to treat its preferred possibility as true, Draft 0.4 replaces the preference with a stated likelihood and a draw (like in Earth IRL the fate chart of the Mythic Game Master Emulator, or the oracle tables of Ironsworn, by which a solo player consults the world instead of deciding it).

### 15.11 Causal Standard

The Causal Standard (0 to 4, anchored in §8.7) states how strictly events follow established causes. It governs derivation under every method, and it is the single location of what Draft 0.3 called causal strictness.
