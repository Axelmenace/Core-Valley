# Operative Mode Framework, Draft 0.4: §3

**Contains:** Record Tiers, warrant, Open Items, precedence, Checkpoints and re-anchoring, Compaction, Registers, the Resumption Packet

**Read when:** Continuity beyond one scene; a claim is challenged; Session open or close; before migrating to a new conversation or another AI.

---

## §3 The Authoritative Record

### 3.1 Central status

**[C]** Every Mode requiring continuity beyond the reliably accessible context designates an Authoritative Record. The Record may be a summary held in Accessible Context, an external document, a memory store, tool-backed state, or a combination of these.

**[C]** The declared Record burden is feasible (§10.5). A Record the Parties cannot in fact maintain is not a Record: it is a promise.

### 3.2 Record Tiers

**[S]** The Record is kept in three Tiers, distinguished by how often each must be present in Accessible Context.

- **Hot Tier.** The Kernel (§22.2) and the latest Checkpoint: present scene, present Characters, pending Attempts, running Clocks, and the current Hand-back point. The Hot Tier is short (by default no more than 400 words) and it is restated in Accessible Context at every Checkpoint and at every Session open.
- **Warm Tier.** The active Canon ledger (Established and Provisional propositions and Claims, each with provenance), the Card Register, the Knowledge Matrix, the Rulings Register, the Stale Register, and references to hidden state. The Warm Tier is consulted on demand.
- **Cold Tier.** The Archive: Void entries, compacted Snapshots of closed Parts, and inactive Cards. The Cold Tier is consulted only on Challenge, or where a Warm entry cites it.

The Hot Tier is what the Operator holds. The Warm Tier is what the Operator can find. And finally the Cold Tier is what the Operator can prove.

### 3.3 Accessible Warrant

**[A]** A continuity claim is warranted only where it is supported by Accessible Context, the Authoritative Record, an imported authority recognized by the Mode, or a valid derivation from these. The mere assertion that something happened earlier does not establish warrant.

### 3.4 Open Items

Open Items are the unsettled contents of the State: unresolved Attempts, running Clocks (§15.8), pending revelations, Disputed propositions, uncertain inferences, queued Oracle Questions, and procedural questions.

**[B]** Every Open Item is recorded with the condition that closes it. An Open Item without a closing condition is a loose end, and a loose end is resolved by whichever Party finds it convenient, which is a form of Usurpation.

### 3.5 Unsupported continuity claims

**[A]** Where a continuity claim is challenged and no Accessible Warrant can be produced, the claim is treated as uncertain, proposed, inferred but unverified, withdrawn, or subject to restoration through an agreed recovery procedure.

### 3.6 Detectable and undetectable degradation

Detectable degradation is a loss of which the Operator possesses evidence: a Record unavailable, prior context incomplete, a capability or procedure unavailable, a necessary state not preserved. **[B]** Detectable degradation is disclosed through the Procedural Channel.

Undetectable degradation on the other hand is a loss of which the Operator possesses no evidence. The framework does not presume that the Operator can disclose an absence it cannot detect. **[S]** Undetectable degradation is addressed through the Record Tiers, re-anchoring, User challenge, the Audit (§18.5), provenance requirements and recovery procedures.

### 3.7 Record precedence

**[C]** The Mode specifies the precedence of its records. The default order:

1. Framework Validity Conditions;
2. the Kernel;
3. the remainder of the Instrument, with ratified amendments;
4. the Rulings Register;
5. named imported authorities;
6. the latest Confirmed Checkpoint;
7. the Warm Tier ledger;
8. earlier Play in Accessible Context;
9. unsupported recollection or inference.

### 3.8 Checkpoints and re-anchoring

A Checkpoint is a Record entry confirming the operative State without amending the Mode. It contains the Mode version, the Kernel, public State, hidden-state references, Open Items, running Clocks, active consequences, capability notes, and a Drift watch line.

Checkpoints occur at Part boundaries, at Session open and close, after major consequences, before context migration, after prolonged Play, upon request, and whenever Drift is suspected.

**[B] Re-anchoring.** Every Checkpoint restates the Kernel verbatim above the State. This is the mechanism by which the Mode's Hard core is returned to the region of Accessible Context that governs generation most strongly, which is the recent region.

**[C]** A Checkpoint is Confirmed by explicit User uptake. An unconfirmed Checkpoint ranks with the Warm Tier ledger, and not above it.

### 3.9 Compaction

**[S]** At Part Close, and whenever the Warm Tier exceeds its declared budget, the Record is compacted. The Warm ledger is rewritten as a Snapshot of the current Established State. Void entries, superseded detail and closed Open Items move to the Cold Tier. And finally entries with no dependents and no foreseeable use are archived.

**[C]** Compaction moves entries and never revises them. The status, content and provenance of an Established proposition are identical before and after Compaction (like in Earth IRL a ledger closed and carried forward at the year's end, or a database log folded into a snapshot).

### 3.10 Registers

The Warm Tier carries four Registers.

- **Rulings Register.** Every settlement of a Procedural question: the question, the ruling, the provision applied, the date. **[B]** A Ruling binds like questions until amendment (§0.7).
- **Card Register.** The Stake Cards and Voice Cards of Characters in recurring use (§24).
- **Stale Register.** Phrases, images and constructions barred or rate-limited in rendering (§24.4).
- **Knowledge Matrix.** Which Characters know which restricted propositions, and by what in-fiction source (§16.9).

### 3.11 Resumption Packet

**[S]** The Resumption Packet is the portable form of a Mode in Play. It contains the Kernel, the Operating Brief, the Touchstone, the Hot Tier, the active portion of the Warm Tier (Open Items, active Cards, the Stale Register, relevant Rulings), hidden state held according to its Commitment Level (§23), and the Mode version.

The Resumption Packet is produced at Part Close, and before any foreseen migration to a new conversation, a new Session without shared context, or another AI.

**[A] Self-Sufficiency Test.** A fresh Operator, given only the Resumption Packet and the User's next Move, produces a continuation that passes the Continuation Checklist (§14.2) and sits within the register of the Touchstone. A Packet that fails the Self-Sufficiency Test is incomplete, whatever it contains.

The Resumption Packet is therefore the test of whether the Mode exists outside the conversation that made it.
