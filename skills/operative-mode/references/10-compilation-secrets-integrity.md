# Operative Mode Framework, Draft 0.4: §22 to §24

**Contains:** the Kernel, the Operating Brief, the Touchstone, the Commitment Ladder, Stake Cards, Voice Cards, the Stale Register, the Turn Budget

**Read when:** Compiling a Mode; any hidden fact; building Characters; fighting Regression.

---

## §22 Compilation: the Kernel, the Operating Brief, the Touchstone

### 22.1 Function

The Instrument is written to be interpreted. The Compilation on the other hand is written to be executed. That is, the Instrument answers the question of what the Mode means, and the Compilation answers the question of what the Operator does next.

The distinction exists because of the fact that generation is governed by three things: imperative instruction, exemplar, and recency. A declarative field ("Grain: 2") possesses none of the three. The Compilation supplies all three: the Kernel and the Operating Brief are imperative, the Touchstone is an exemplar, and re-anchoring (§22.6) supplies recency.

Compilation is therefore the bridge between the Mode that is ratified and the Mode that is run.

### 22.2 The Kernel

**[C]** The Kernel is at most seven items. Each item is one imperative sentence stating observable conduct, each item is Hard, and the whole is no more than 150 words.

Kernel items are drawn from four sources: the Signature Choices (§11.8); any User-set value the User marks K; the countermeasures bound in the Pre-Mortem (§10.6); and Mode-specific rules the Operator is likely to regress against. A Kernel item states conduct and not a parameter value: "Operator Characters yield only when their Price is met, and say what met it", and not "Resistance 3".

**[C]** The Kernel is ratified with the Instrument. It is restated verbatim at every Checkpoint, and it heads the Operating Brief and the Resumption Packet.

The Kernel is short because of the fact that a Kernel that holds everything holds nothing: salience is a fixed quantity, and seven items restated keep more of it than seventy stated once (like in Earth IRL the few general orders posted at a sentry box, or the handful of articles an oath swears to, where the full regulations are kept elsewhere).

### 22.3 The Operating Brief

**[B]** The Operating Brief is the Instrument rewritten in the imperative mood and addressed to the Operator. Its contents, in order: the Kernel; the Intent Statement; the Seats, and what the Operator must never decide; how outcomes are resolved; how continuations are rendered, with reference to the Touchstone; the active Stake Cards and Voice Cards; the Stale Register; and finally the Intervention Ladder tokens. Its length is 400 to 900 words.

**[C]** The Operating Brief contains nothing the Instrument does not. Where the two conflict, the Instrument governs and the Brief is recompiled as a Patch (§17.7).

The Operating Brief, together with the Resumption Packet, is the document given to a fresh Operator. It is the means by which a Mode is inhabited by any AI, in any conversation, without the Standing Framework present.

### 22.4 The Touchstone

**[C, at Full ceremony]** The Touchstone is a sample continuation of 80 to 200 words, rendered under the candidate Mode (ordinarily taken from the Proving Scene) and ratified as the exemplar of the Expressive Domain.

The Touchstone anchors Distance, Grain, Descriptive Density, Register, Dialogue Ratio and Turn Budget by example, and where the Touchstone and the verbal anchors of §8.7 diverge, the Touchstone governs. **[B]** At each Checkpoint and upon any Nudge concerning rendering, the Operator compares recent continuations with the Touchstone. A Mode with several recurring Operator Characters anchors their voices through Voice Cards (§24.3), and not through further Touchstones.

An exemplar binds rendering more precisely than any description of rendering can (like in Earth IRL the tuning fork against which an orchestra tunes, or the standard metre bar against which rulers were once cut, or the sample page a series editor gives to every new writer). Expressive Drift becomes demonstrable by the same act: a continuation is set beside the Touchstone, and the difference is visible.

### 22.5 Compilation fidelity

**[A] Compilation Test.** Every Kernel item traces to a value of the Instrument, and every Hard value of the Instrument appears either in the Kernel or in the Operating Brief. A Compilation that fails the test is regenerated before Assent.

### 22.6 Re-anchoring

**[B]** The Kernel is restated at every Checkpoint. The Touchstone and the Operating Brief are read at every Session open. In a long Accessible Context, restatement governs generation more strongly than first statement, and the Operator restates accordingly.

## §23 Hidden State and the Commitment Ladder

### 23.1 Persistent hidden state

**[C]** A hidden proposition intended to bind future Play after it may leave Accessible Context is entered into the Record, at a declared Commitment Level.

### 23.2 The four Commitment Levels

There are fundamentally two questions about a secret: whether it is fixed, and whether its fixity can be shown. The Commitment Ladder answers both at four heights.

| Level | What is fixed | Fixity enforced by | Requires |
| --- | --- | --- | --- |
| 0 Latent | Nothing yet; the fact is determined at revelation | Consistency with all Canon Established before revelation | Nothing |
| 1 Property | The published properties of the fact | The published Commitment Marker | Nothing |
| 2 Held Seal | The fact itself | A plaintext store the User holds unread | A file or memory store that persists |
| 3 Hash Seal | The fact itself | A published cryptographic digest | Code execution and a persistent file |

**Level 0, Latent.** The fact is not yet determined, and it is bound only by Consistency: its eventual revelation is compatible with every proposition Established before the revelation, every clue rendered included. Latent is the honest name for what an Operator without storage actually holds, and it is a legitimate way to run a mystery (like in Earth IRL the novelist who settles the murderer in the last chapter and is bound by fair play to every clue already printed). **[C]** A Latent entry is declared as Latent, and never described as fixed.

**Level 1, Property.** The Operator publishes a Commitment Marker stating properties of the fact ("SEAL-3: the informant belongs to the household; the motive is money"). The revelation satisfies every published property, and within those properties the fact remains Latent. Level 1 is available in every environment.

**Level 2, Held Seal.** The plaintext is written to a store outside the transcript (a file, a memory store, a sealed dossier) which the User undertakes not to read, and at revelation the User may compare. The Held Seal places the honour on the User's side, where the User can keep it, instead of on the Operator's side, where continuity cannot. The store persists across branches, and so it is subject to the Retention Rule (§14.6).

**Level 3, Hash Seal.** With a code-execution tool, the Operator writes the plaintext together with a random nonce to a file, and publishes in the Record the SHA-256 digest of the nonce and plaintext together. At revelation the plaintext and nonce are disclosed and the digest is recomputed. The binding is cryptographic: the Operator cannot alter the fact without the digest failing to match. The nonce prevents a short secret from being found by hashing candidates. This is a commitment scheme (like in Earth IRL the sealed bid opened only after all bids are in, or the prediction posted as a hash before the event and unveiled after it).

### 23.3 Choosing the Level

**[B]** The Mode declares a default Commitment Level and may raise individual entries above it. The Level claimed is the highest that the Capability Profile honestly supports (§9.7). Most chat deployments without tools support Levels 0 to 2, and a deployment claiming more is committing Counterfeit Commitment (§20.15).

### 23.4 Revelation

**[C]** A hidden entry is revealed only upon its declared revelation condition, or under the allocation of S10. Revelation is recorded with its Level check: Consistency at Level 0, the published properties at Level 1, the comparison at Level 2, the recomputed digest at Level 3.

### 23.5 Possession is not licence

**[C]** The Operator's possession of a hidden fact grants no Character the knowledge of it. A Character acts on a hidden fact only where the Knowledge Matrix gives that Character a source (§16.9).

## §24 Generative Integrity Instruments

Generative Drift is constant, and so its countermeasures act on every continuation. There are four Generative Integrity Instruments: Stake Cards against Accommodation, Voice Cards against Homogenization, the Stale Register against Recurrence, and the Turn Budget against Inflation. Momentum Seizure is countered by the Hand-back Rule (§14.5), which is a rule and not an instrument.

### 24.1 Stake Cards

**[S]** Every Operator Character in recurring use, and every faction, carries a Stake Card of no more than five lines.

- **Want.** What the Character pursues.
- **Line.** What the Character will not do, whatever is offered.
- **Price.** What moves the Character to yield: a specific benefit, a specific leverage, or a specific cost.
- **Leverage.** What the Character holds over others.
- **Tell** (optional). How the Character's pursuit shows before it is spoken.

The Price is imported from the reservation price of negotiation (like in Earth IRL the lowest offer a seller will accept, fixed before the buyer arrives, or the walk-away point of a diplomat's instructions). Its effect is that a Character's willingness to yield is settled before the User's persuasion is heard, where it cannot be moved by the Operator's disposition to please.

### 24.2 The Price Test

**[A]** Where an Operator Character yields, concedes, agrees, or changes position against its Want, the continuation, or the Record upon Audit, can name what met its Price. A yield that meets no Price is Accommodation.

The Price Test does not forbid yielding. It requires that yielding be paid for. At Resistance 0 the Price is low and generally met; at Resistance 4 it is high and met in full or not at all (§8.7).

### 24.3 Voice Cards

**[S]** Every Operator Character in recurring use carries a Voice Card of five lines: Diction (three words characterizing its vocabulary); Rhythm (the shape of its sentences); Tell (one verbal habit); Never (what it never says, or never says plainly); and one Sample Line.

Voice Cards are imported from the character voice sheets of a series style bible (like in Earth IRL the notes a television writers' room keeps so that a character speaks the same in the fortieth episode as in the first, written by a different hand). They answer Homogenization, which is the Operator's own voice leaking into every mouth.

### 24.4 The Stale Register

**[S]** The Stale Register lists phrases, images, gestures and constructions that are barred, or limited to a stated rate (once per Part, once per Session). Structural entries are permitted: a beat pattern (action, reaction, a closing question) may be registered as stale when it has run three continuations in succession.

Either Party may add an entry at any time, and a Nudge suffices. **[B]** The Operator adds its own detected recurrences at each Checkpoint without waiting to be told. Entries persist across Parts until retired at a Part Review.

The entries a Stale Register most often acquires are the stock reactions of generated prose: the breath released that was not known to be held, the beat of silence, the thing that shifted, the air grown thick. They recur because each is individually probable, and the Stale Register exists because of the fact that probability, repeated, becomes a tic.

### 24.5 The Turn Budget

**[S]** The Mode declares a Turn Budget: the word range of an ordinary Diegetic continuation (for example 120 to 260 words). The Touchstone's length anchors it. A Montage continuation (§14.5) may exceed it.

**[A]** Three consecutive continuations above the Turn Budget constitute Inflation. The Turn Budget is short to state, cheap to check, and the first of the Generative classes to show, because length is the most visible form of the Operator's pull toward the ample.
