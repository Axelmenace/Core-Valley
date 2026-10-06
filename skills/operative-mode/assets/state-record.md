# Authoritative State Record

The declared persistence substrate of the Play (§3). It is what a continuity claim is checked against, and the thing that makes Challenge possible at all. Update it in the Record Channel, never inside a Diegetic continuation. Every ledger line carries status and provenance; a line without them cannot be defended.

The Record is kept in three Tiers (§3.2). The Hot Tier is what you hold, the Warm Tier is what you can find, the Cold Tier is what you can prove. Continuity burden (§4.8) decides which Tiers a Mode keeps.

## Hot Tier: Checkpoint

Produce at Part boundaries, Session open and close, after major consequences, before context migration, after prolonged Play, on request (`[[CP]]`), and whenever Drift is suspected. Always restate the Kernel verbatim at the top: this is re-anchoring (§3.8), and it is the main defence against salience decay in long contexts. Ask for confirmation; an unconfirmed Checkpoint ranks with the ledger, not above it.

```
CHECKPOINT <CP-n>: Part <n>, <in-fiction moment>        Confirmed: [ ]
Mode <name> v<x.y.z>

KERNEL
<verbatim>

NOW         <where, who is present, what just happened>
PENDING     <unresolved Attempts; the Hand-back point>
CLOCKS      <name: filled/segments; next tick condition; visibility>
HIDDEN      <references only: SEAL-n, Level, revelation condition>
CAPABILITY  <anything degraded since the last Checkpoint>
DRIFT WATCH <Tell-tales observed, or none>
```

Keep the Hot Tier near 400 words.

## Warm Tier

```
CANON LEDGER
| # | Proposition or Claim | Status (reason) | Provenance | Visibility | Régime |
Statuses (§16.2): Established · Provisional (proposed / inferred / conditional / pending)
                  · Disputed · Void (superseded / retracted / annulled / noncanonical / branch-abandoned)
Claims are recorded as Claims: "<speaker> asserts P, to <audience>, at <moment>".

OPEN ITEMS
| Item | Kind | Closing condition |

KNOWLEDGE MATRIX
| Restricted proposition | Known by | Source |

CARD REGISTER
STAKE  <Character>: Want … | Line … | Price … | Leverage … | Tell …
VOICE  <Character>: Diction … | Rhythm … | Tell … | Never … | Sample: "…"

RULINGS REGISTER
| Date | Question | Ruling | Provision applied |

STALE REGISTER
<entry>: barred | once per <Part/Session>

HIDDEN STATE
SEAL-n: Level <0-3>; properties (Level 1) | store (Level 2) | digest (Level 3);
revelation condition; Knowledge Matrix entries

SEED TAPE (only if the Mode uses one)
<digits supplied by the User>   pointer: <next unused position>
```

## Cold Tier

Void entries with their reasons, the compacted Snapshot of each closed Part, inactive Cards. Appended at Compaction (§3.9) and never rewritten. Compaction moves entries; it never changes an Established entry's status, content, or provenance.

## Retention hygiene (§14.6)

Files and memory stores persist across regenerations and edits; the transcript does not. At each Checkpoint, Void any Record entry (including sealed files) written during a continuation that was later regenerated, Redone, Flagged-and-repaired, or edited away.

## Resumption Packet (§3.11)

```
RESUMPTION PACKET: <Mode> v<x.y.z>, after Part <n>, <date>

1. Operating Brief (opens with the Kernel, carries the Touchstone)
2. Hot Tier: the latest Confirmed Checkpoint
3. Open Items and running Clocks
4. Active Stake Cards and Voice Cards
5. Stale Register
6. Rulings bearing on the next Part
7. Hidden state, by Commitment Level
8. Resumption instruction: read 1 to 7; restate the Hot Tier in brief;
   resume at the Hand-back point upon the User's Move.
```

Before issuing it, apply the Self-Sufficiency Test: would a fresh Operator, given only this Packet and the User's next Move, produce a continuation that passes the Continuation Checklist and sits within the Touchstone's register? If not, the Packet is incomplete.

## Part Close (§17.5, §17.8)

Closure Record (final State, Open Items, Mode version, disputes, capability failures, next-Régime requirements) → Compaction → Part Review → Resumption Packet.

```
PART REVIEW: Part <n>
1. Promised:  <Intent, Kernel>
2. Happened:  K1 Held/Strained/Breached … K7 ·  Tell-tales: … ·
              Interventions: Nudge <n>, Flag <n>, Redo <n>, Hold <n>, Stop <n>
3. Why:       …
4. Keep / Tune / Drop:  … (each tuning -> Amendment Docket)
Stale Register updated: …
```
