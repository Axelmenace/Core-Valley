# The Standard System

*SPEC-Standard v1.0.0, a ready-made magic system for the Operative Mode Framework, Draft 0.4 (§25). Chosen from the Magic Menu (`magic-menu.md`) as **The Standard System**, or **The Standard System, tuned**.*

The Standard System is the magic any reader of isekai fiction recognizes on sight. Everyone has mana; a few are trained to shape it. Spells are chanted, and the greatest need circles. Each person is born with affinities for a few elements. Mages rank from Beginner to Divine, empty themselves and faint, and grow larger reserves by doing it, best in childhood. Guilds appraise, academies teach, churches heal, and monsters carry mana stones that power potions, scrolls and household tools. The spells have a tabletop flavour (Magic Missile, Fireball, Counterspell, Wall of Fire, Meteor), but the machinery is not tabletop: there are no spell slots, no prepared lists and no spell levels 1 to 9. The machinery is a mana pool, a chant, and a rank.

The file has two parts:

- **Part 1, Common Lore,** is what any adventurer in the world knows. It is the common Lens (§25.10), and it may be shown to the Player at the start as a published Specification Marker (§25.12).
- **Part 2, the Specification,** is the full author-tier system: Mechanism Core, Variables, Effect Grammar, Benchmarks, Production Rule, Limitations and Balance Record. It holds facts the common Lens gets wrong. A Player who wants to discover the magic undertakes not to read Part 2.

**How it is adopted.** The Operator copies Part 2 into the Mode's Record as `SPEC-Standard`, adds any Tunings from the Magic Menu, rolls the per-Mode hidden values (each important Character's ceiling and affinities), and seals the result (§25.12). Because this file is published inside the skill, Part 2 as written is never secret: its integrity rests on the Player's undertaking (a Held Seal, Level 2), and the Mode's Tunings and hidden rolls are what get sealed at Level 3 where code runs. Nothing in the Standard System is described as more firmly hidden than that (No Counterfeit Commitment, §20.15).

**Ceremony.** At Light ceremony the Instrument cites `SPEC-Standard v1.0.0`, lists Tunings and Outsider's Edges, and gives one Lens line for the User's Character; this file is the Core Grammar. At Full ceremony the Operator adds Lens Sheets for the Mode's recurring casters and factions and runs Specification Validation on the Tunings.

---

# Part 1: Common Lore

*What a guild clerk, a village priest or a veteran adventurer would tell you. This is a Lens, so parts of it are Claims, and some are wrong.*

**Mana.** Every living thing has mana. Most people have only a little; a mage is someone with enough of it who has been taught to shape it. Mana comes back with sleep, and a good night restores it all. Use too much and you grow weak; use it all and you faint, sometimes for hours. Mana potions help, and so does absorbing a mana stone.

**Affinity.** Everyone is born with an affinity for some of the elements: Fire, Water, Wind or Earth, and more rarely Light or Dark. Most have one, a lucky few have two or three, and plenty have none. Affinity is read by an appraisal crystal, usually at a church or the guild, often around the age of ten. You can study an element you have no affinity for, but it costs twice the mana and you will never get past Intermediate in it. Anyone with mana can learn the **Non-Elemental** arts: force bolts, shields, strengthening, detection. **Space** and **Summoning** affinities are so rare that most people never meet a mage who has one. A Space mage can keep things in a private storage space where nothing spoils.

**Ranks.** Magic is ranked in seven steps, and a mage holds a rank separately in each element:

| Rank | What it means |
| --- | --- |
| Beginner | Sparks, cuts, a bucket of water |
| Intermediate | Kills a man, breaks a door, sets a bone |
| Advanced | Kills a knight or an ogre; a fireball that clears a room; heals mortal wounds |
| Saint | Breaches a stone wall; worth a squad of soldiers; famous in a province |
| King | Brings down a gatehouse; worth a company; famous in a kingdom |
| Emperor | Breaks an army; a handful in the world |
| Divine | Destroys or saves a city; legends, and perhaps not all of them true |

**Casting.** Spells are chanted. The greater the spell, the longer the chant: a Beginner spell is a line, a Saint spell is a minute of verse, and the greatest workings need a magic circle and a long time. Skilled mages shorten their chants. **Chantless** casting, magic without words, is rare and prized, and most people say it is a gift you are born with.

**Mages and the world.** The Adventurers' Guild ranks its members from F to S and pays for monster parts and mana stones. Academies take the gifted and, mostly, the noble. The Church heals with Light magic and says the Goddess grants it. Dark magic is distrusted, and its users are watched. Sealstone, a grey ore that mana cannot pass through, makes the shackles that hold captured mages.

**Things everyone knows magic cannot do.** Bring back the dead. Turn lead into gold. Travel in time or read the future. Read your memories.

**Things most people believe (Claims).**
- Mana capacity is fixed at birth.
- Chantless casting is a gift of the gods, and cannot be learned.
- The chant's words have power of their own, which is why spells must be said in the old tongue.
- Light magic is the Goddess's grace, given to the faithful.
- Dark mages are wicked.

Guild ranks, academy grades and the Church's teaching are institutions of whatever world the Mode builds. Part 1 is written generically, and the Operator renames its institutions to fit the setting.

---

# Part 2: The Specification

## SPEC-Standard · v1.0.0 · Commitment Level 2 (published file, Held Seal); Mode Tunings and hidden rolls at the highest available Level · Digest ‹sha256 of the Mode's copy, or —›

### A. Identity

- **Name:** The Standard System. In-world, simply "magic".
- **Seed:** every living thing holds mana; a mage gives it shape with chant, circle and will, and the world answers by element and by rank.
- **Boundary:** all spellcasting, monster abilities, mana stones, potions, scrolls and enchanted tools. Divine intervention by actual gods, where a Mode has them, is outside it and needs its own Specification linked by Interface. Martial techniques without mana are outside it.
- **Mundane Baseline:** Earth physics, with the setting's declared differences.

### B. Mechanism Core

- **Substrate:** mana, a life-borne energy present in every living body and, more thinly, in the air, water and earth. A body's mana is its **Reserve**. Mana crystallizes in the bodies of creatures that live long in mana-rich places, as **mana stones**.
- **Operation:** the caster holds a precise mental model of the effect (the **pattern**) and drives Reserve mana into it, usually through a chant that steadies the model, sometimes through a drawn circle that holds it. The mana takes the pattern's form in one Domain and spends itself producing the effect at the pattern's Tier.
- **Invariants:**
  1. *The chant is a mnemonic, not a key.* Words steady the pattern; they carry no power of their own. Any language works for a caster whose pattern is complete. (The common Lens holds the contrary as a Claim.)
  2. *Interior Resistance.* A living body's own mana resists outside mana inside it. Elemental and Non-Elemental effects act on a living body only from outside: no boiling blood, no vacuum in lungs, no stopping a heart. Light (healing, purification) and Dark (curse, sleep, fear, charm, domination) are the only Domains that act inside a living body, and against an unwilling target they are resisted (see Reliability).
  3. *Conjured matter is ordinary matter.* Water and stone created by magic remain as water and stone after the spell, under Mundane Continuity. Shaped earth stays shaped. Conjured flame obeys ordinary fire once its Duration ends, and goes out without fuel.
  4. *Mana is conserved in transfer.* Moving mana between a caster and a stone or potion always loses some (Production Rule), and never gains any.
  5. *Rank is per Domain; Reserve is single.* A caster holds a separate Rank in each Domain, and draws on one Reserve for all of them.
- **Prohibitions:** no effect restores the dead; no effect moves anything through time, or reads the future; no effect reads memories (surface thought at most, under Dark); no effect conjures or transmutes precious metals, gems or mana stones; no effect duplicates a living thing or an object that holds mana; no domination is permanent; no effect exceeds the Apex.
- **Interfaces:** with the Mundane Baseline through Invariant 3; with its own countermeasures through Part E; with any divine Specification through the Church's Lens, where the Mode has active gods.
- **Generativity:** Grammar, with a Production Rule for crafting.
- **Clause displacements and Tunings:** none in v1.0.0. A Mode records its Tunings here, numbered (T1, T2, …), each with the Magic Menu set and option it came from.

### C. Variables

| Variable | Value | Reason | Distribution or rule |
| --- | --- | --- | --- |
| Transference | 1 | Reserve, ceiling and affinities are innate; spells are learned; stored effects move only in Products | Products under D3 carry effects to anyone with a Reserve of 10 or more |
| Prevalence | 3 | Everyone has mana; most can manage a spark; trained mages are a minority | Trained casters of Rank 1 or more: about 1 in 50 in villages, 1 in 10 in capitals; Rank 4 (Saint) or more: about 1 in 20,000 |
| Source | Internal, renewable; external stones as Products | The Reserve is the body's own | Renewal Rule and Depletion Effect below |
| Flux | 0 for the world; positive for individuals | No world-level change; individuals grow under Progression | — |
| Naturalness | 3 | Monsters, stones and rich places occur unprompted | Ambient density below |
| Ease of Use | 2 | Years to rise in Rank; seconds to cast at low Tiers | Casting time by Tier (Envelope table); Chantless by Tendency Rule |
| Reliability | 3 | Sure below one's Rank, uncertain at it, risky above | Odds Rule and Miscast Table below |
| Consistency | 3 | One mechanism; reach differs by affinity | Affinity Tendency Rule; Outsider's Edges enumerated in D1 |

**Renewal Rule.** Sleep restores one eighth of capacity per hour, so a full night restores everything. Waking rest restores one sixteenth per hour. Meditation, for a caster of Rank 2 or more in any Domain, restores at the sleep rate while awake. Nothing restores while casting, fighting or travelling hard. **Ambient density** multiplies every rate: Thin (deserts, sealstone mines) ×½; Normal ×1; Rich (ley crossings, old forests, upper dungeon floors) ×2; Saturated (deep dungeons, monster nests) ×3.

**Depletion Effect.**
- Below one quarter of capacity: **Mana Fatigue**. Every casting draw is one rung down.
- At zero: **Mana Exhaustion**. The caster falls unconscious for a drawn 1 to 6 hours, and wakes with whatever Renewal has restored.
- **Overdraw:** a caster may push one casting past zero, by at most one fifth of capacity. The spell resolves, then the caster falls unconscious as at zero and takes Tier 1 harm (nosebleed, burst vessels in the eyes). Overdrawing further is impossible: the pattern collapses first.

### D. Effect Architecture

#### D1. Effect Grammar

**Domains.** Each has a scope, its Prohibitions, its Signature colour, its default Counters, and its opposed Domain.

| Domain | Scope | Domain Prohibitions | Signature | Counters | Opposed |
| --- | --- | --- | --- | --- | --- |
| **Fire** | Heat, flame, combustion, explosion | Cannot burn inside a living body | Red-orange circle; heat shimmer, smoke | Water; Barrier; sealstone | Water |
| **Water** | Water, ice, mist, cold | Cannot move fluids inside a living body | Blue circle; cold air, condensation | Fire; Barrier; sealstone | Fire |
| **Wind** | Air, pressure, sound, lightning, flight | Cannot act on air inside a living body | Green circle; rushing air, ozone | Earth; Barrier; sealstone | Earth |
| **Earth** | Stone, soil, sand, unrefined metal; shaping, raising, hardening | Cannot shape refined metal below Tier 3; no transmutation | Amber circle; grinding, dust | Wind; Barrier; sealstone | Wind |
| **Light** | Healing, purification, holy wards, radiance; harm only to undead and demonic beings | No restoring the dead; harms living, non-demonic beings only by blinding | White-gold circle; warmth, a clean smell | Dark; Dispel | Dark |
| **Dark** | Shadow, curse, illusion, sleep, fear, charm, domination, animating corpses | No reading memories; no permanent domination; animated dead have no souls or minds | Violet-black circle; chill, muffled sound | Light; Dispel; sealstone | Light |
| **Non-Elemental (Null)** | Force, barriers, strengthening, detection, appraisal, countering, dispelling | No effect that is properly another Domain's | Pale silver circle; a faint chime | Dispel; Barrier; sealstone | — |
| **Space** (rare) | Storage, distance, teleportation, gates | Range column ×10; cannot place anything inside solid matter or a living body | Clear, rippling circle; pressure in the ears | Barrier (blocks passage); Anti-Magic Field | — |
| **Summoning** (rare) | Familiars and called beings under contract | A called being keeps its own will under its Contract; nothing called from the dead | Indigo circle; a smell of elsewhere | Dispel (sends the being back); Barrier | — |

**Domain Genesis:** none, except through the Outsider's Edge *A Unique Domain*, whose Domain is designed and priced against these Benchmarks at Mode construction and entered in a Domain Registry.

**Power Axes.** Primary: **Tier**, ranked by the seven names, gated by the caster's **Rank in that Domain**. There is no secondary axis; Modifiers carry the shaping.

**Envelopes.** Magnitude is stated three ways: harm, healing, and work. Area is a radius (or a line, wall or cone of twice that length). Gate Ceiling is the highest Consequence Gate Tier (§7.6) an effect at that Tier can produce by itself.

| Tier | Rank | Magnitude: harm · healing · work | Area | Range | Duration | Targets | Gate Ceiling | Full-chant time |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Beginner | A knife cut, a torch's burn · close a cut · lift 20 kg, fill a bucket | 1 m | 20 m | 1 min | 1 | 1 | One line, ~2 s |
| 2 | Intermediate | Kill an unarmoured person or a wolf; break a door · set a broken bone · move a cart | 3 m | 50 m | 10 min | 3 | 2 | Two lines, ~5 s |
| 3 | Advanced | Kill an armoured knight or an ogre; smash a wagon or timber wall · heal mortal wounds, cure disease or poison · raise a cottage's walls | 10 m | 100 m | 1 h | 10 | 2 | A verse, ~15 s |
| 4 | Saint | Kill a squad; breach a stone wall · restore failing organs, heal thirty · build a rampart | 30 m | 300 m | 6 h | 30 | 3 | ~1 min |
| 5 | King | Rout a company; bring down a gatehouse; sink a warship · regrow a lost limb · raise a bridge | 100 m | 1 km | 1 day | 100 | 3 | ~5 min; circle required† |
| 6 | Emperor | Break an army in the field; level a fortress · heal a battlefield · shape a hill into a keep | 300 m | 5 km | 1 week | 1,000 | 3 | ~30 min; circle required |
| 7 | Divine | Destroy or save a city · end a plague in a city · reshape a valley | 1 km | 20 km | 1 season | All in Area | 3 | Hours; circle required; usually a ritual |

† From Tier 5 up, every casting needs a circle. A full-chant or Chantless casting projects the circle as part of its casting time, at no change in Price; the Prepared Circle Modifier is the alternative of inscribing one beforehand.

A Gate Ceiling of 3 is admissible only where the Mode's Instrument admits Tier 3 consequences (§7.6). Where it does not, Tier 4 and higher effects are admissible only against objects that are not User-governed, or with joint assent.

**Cost Function.** The Price vector is:

> **Mana** = ⌈ Base(Tier′) × M ⌉ · **Time** = casting time by mode · **Concentration** = one slot if the effect is sustained

- **Base(Tier):** T1 5 · T2 12 · T3 30 · T4 75 · T5 180 · T6 450 · T7 1,100.
- **Tier′** is the placed Tier, raised by one if two or more Shaping Modifiers are applied.
- **M** is the product of every Modifier's multiplier, and of the off-affinity and compound multipliers where they apply. Round up once, at the end.
- **Sustained** effects (anything with a Duration that the caster keeps up: a barrier, flight, a charm) hold a Concentration slot until they end. **Set** effects (a fireball, a wall raised, water conjured, a wound healed) are instantaneous; what they leave behind persists under Invariant 3.

**Modifier Table.**

| Modifier | Kind | Mana | Time and Tier effect | Requirement |
| --- | --- | --- | --- | --- |
| Full Chant | Casting mode | ×1 | Full-chant time | — |
| Shortened Chant | Casting mode | ×1.5 | Half the full-chant time | Tier ≤ caster's Rank |
| Chantless | Casting mode | ×2 | One breath for T1 to T3; a quarter of full-chant time for T4 and up; T5 and up still need a circle | The Chantless skill |
| Prepared Circle | Casting mode | ×0.75 | Inscribing takes ten times the full-chant time, as a separate Stage with no mana; casting from it takes one breath; the caster must stand at the circle | Chalk, ink or carved lines; a circle is used once |
| Extended Range | Shaping | ×1.5 | Range ×2 | — |
| Wide Area | Shaping | ×1.5 | Area ×2 | — |
| Extended Duration | Shaping | ×1.5 | Duration ×4 | Sustained effects only |
| More Targets | Shaping | ×1.5 | Targets ×2 | — |
| Selective | Shaping | ×1.5 | Chosen beings in the Area are spared | — |
| Delayed Trigger | Shaping | ×1.5 | Set to release on a stated condition within the Duration | — |
| Off-Affinity | Affinity | ×2 | — | Tier ≤ 2 in an elemental, Light or Dark Domain the caster has no affinity for |
| Compound | Affinity | priced in each Domain; pay the higher, ×1.5 | e.g. Fire + Wind for an explosion, Water + Wind for a storm | Rank at that Tier in both Domains |

Casting-mode and Affinity Modifiers never raise the Tier. Each Shaping Modifier may be applied more than once, and each application counts toward the two-or-more rule.

**Access Rule.** Gates are marked **M** Metaphysical, **I** Institutional, **D** Derived.

- **Reserve (M).** Every living being has one. Casting at all needs a capacity of 10 or more.
- **Affinity (M).** Fixed at birth. A caster holds Ranks above 2 only in Domains of affinity. Non-Elemental is open to all; Space and Summoning require their affinity at every Tier.
- **Rank (M).** A caster may cast at most one Tier above their Rank in a Domain (see Reliability). Rank 1 in a Domain is gained by casting any Tier 1 spell of that Domain once.
- **Spell knowledge (D, from teaching I or Pricing M).** A caster can cast an effect only if they hold its pattern: taught by a teacher or a grimoire (Institutional), or invented and priced by the Grammar (Metaphysical, §25.8.1).
- **Chantless (M, learnable).** A Tendency Rule (below).
- **Academy admission, guild licence, Church ordination (I).** These are institutions. They can be evaded or broken in the fiction, with institutional consequences.

**Progression Rule.**

*Rank rises* in a Domain from N to N+1 when all three hold: capacity at least the threshold for N+1; the caster holds at least one pattern of Tier N+1; and the caster has a Mastery count of Clean Successes at Tier N in that Domain since their last rise. Practice casting counts at most once per day; casting under real Stakes counts every time. The Record keeps the counts.

| Rise to | Capacity threshold | Mastery count at the Tier below |
| --- | --- | --- |
| 2 Intermediate | 36 | 5 |
| 3 Advanced | 90 | 10 |
| 4 Saint | 225 | 20 |
| 5 King | 540 | 40 |
| 6 Emperor | 1,350 | 80 |
| 7 Divine | 3,300 | 160 |

*Capacity grows* by **Drain-and-Recover**. Each time a caster is emptied to zero (Mana Exhaustion or Overdraw) and then sleeps, capacity rises by 5% of current capacity before age 12, 2% from 12 to 25, and 1% after 25, rounded up, at most once per day. Capacity never rises above the caster's **Ceiling**.

*The Ceiling* is set at birth by the Ceiling Tendency Rule. Before age 12, each Drain-and-Recover also raises the Ceiling by 1% of its birth value, to at most three times that value. From 12 onward the Ceiling is fixed. (This is why the common Claim that capacity is fixed at birth is false, and why few locals ever train a child for it.)

**Tendency Rules.**

*Affinity at birth.* Norm: one affinity. Deviation Table (d100): 01–35 none; 36–80 one; 81–95 two; 96–99 three; 00 four. For each affinity, d20: 1–5 Fire; 6–10 Water; 11–15 Wind; 16–19 Earth; 20 a rare roll, d6: 1–3 Light, 4–5 Dark, 6 a further d2: 1 Space, 2 Summoning. Repeated results are rerolled. Movers: old noble and mage bloodlines roll twice for count and take the higher; peoples the Mode declares as tied to an element (elves to Wind or Water, dwarves to Earth or Fire) treat a matching d20 result as guaranteed for their first affinity.

*Ceiling at birth.* Norm: Low. Deviation Table (d100): 01–60 Low (Ceiling 60); 61–85 Moderate (150); 86–95 High (400); 96–99 Very High (1,000); 00 Vast (3,000). Movers: as for affinity count.

*Starting capacity.* Before any training, capacity is about one fifth of the Ceiling at adulthood, and smaller in childhood (age ÷ 16 of that, before 16).

*Chantless.* A caster who practises wordless casting daily draws once a month: Likely before age 12, Unlikely from 12 to 20, Remote after 20. Each further Domain after the first is one rung easier. On Clean Success the caster gains the Chantless skill in that Domain; Success at Cost gains it with one rung down on its Odds for a year. Movers: a teacher who is Chantless, one rung up; the Outsider's Edge *Modern Knowledge*, one rung up.

**Reliability: the Odds Rule.** The default rung for a casting, before Established factors (§15):

| Tier relative to caster's Rank in the Domain | Default rung |
| --- | --- |
| Two or more below | Certain (no draw), unless under attack or interrupted |
| One below | Near-certain |
| Equal | Likely |
| One above (Overreach) | Unlikely; full chant or circle required |
| Two or more above | Impossible |

Established factors: a focus (staff, wand or orb with a mana stone matched to the Domain), one rung up; Chantless at the caster's own Rank, one rung down; Mana Fatigue, one rung down; an unwilling target resisting a Light or Dark effect from inside (Invariant 2), one rung down, or two if the target's highest Rank in any Domain is at least the caster's Rank. **Ritual casting** (below) sets the leader's Overreach at Likely.

**Interruption.** A caster harmed while chanting keeps the chant on a Likely draw; failure is Failure with Opening. A Silence effect over the caster stops chanting entirely; only Chantless and Prepared Circle casting still work.

**Outcome Bands for a casting (§15), filled from this card.**
- **Clean Success:** the effect lands as priced.
- **Success at Cost:** the effect lands, and the caster's controller chooses one: pay half the Price again, or the effect lands at the Parameters of the Benchmark one Tier lower. If the Reserve cannot pay, the lower effect lands.
- **Failure with Opening:** the pattern collapses. Half the Price is spent. The caster may try again at once at the same Odds.
- **Clean Failure:** the full Price is spent, and the Miscast Table is drawn: d6 normally, d6+2 on an Overreach.

**Miscast Table.**

| Draw | Result |
| --- | --- |
| 1–2 | **Fizzle.** Nothing happens. |
| 3–4 | **Stray.** The effect goes off misaimed: it strikes the nearest other valid target or point in Range, drawn among the candidates. |
| 5 | **Recoil.** The caster takes the effect's harm at two Tiers lower (minimum Tier 1), in its element. |
| 6 | **Mana Burn.** The caster loses half the Price again; if that empties them, Mana Exhaustion follows. |
| 7 | **Rupture.** The caster takes harm of one Tier below the effect, and cannot cast for a day. |
| 8 | **Wild Release.** The effect lands at full force centred on the caster. |

**Combination Rule.**
- **Concentration slots:** one for Ranks 1 to 3; two for Ranks 4 and 5; three for Ranks 6 and 7, counting the caster's highest Rank.
- Like effects do not stack: two Stoneskins on one person are one Stoneskin.
- A compound effect pays the Compound Modifier.
- **Ritual casting.** Several casters at one Prepared Circle, each of Rank at least two below the working's Tier in its Domain, pool their mana toward one effect. The leader's Rank + 1 is the highest Tier a ritual can reach, and the leader draws at Likely. Casting time is doubled. If the draw fails, every participant pays their share and the Miscast result strikes the leader.
- **Opposed effects.** An effect meeting an opposed Domain's effect of the same Tier cancels with it. If the Tiers differ, the higher survives at one Tier lower.

**Apex Rule.** Tier 7 is the top. Nothing exceeds the Tier 7 Envelope (a 1 km radius, a range of 20 km, or 200 km for Space; a season's duration), however many casters or Modifiers are combined: a Modifier that would push a Tier 7 effect past its Envelope is not available. No Prohibition yields at any Tier.

**Diegetic Interface.**
- **Appraisal Crystal** (held by churches, guilds and academies): reports a touched person's affinities and capacity band (Spark under 20, Low 20 to 59, Moderate 60 to 149, High 150 to 399, Very High 400 to 999, Vast 1,000 to 2,999, Immense 3,000 or more). Authoritative for what it reports. It does not report Ranks, Ceilings or the Chantless skill.
- **Appraisal** (a Tier 2 Non-Elemental spell): the same report from a touch, plus an object's name, grade, and any enchantment's Domain and Tier.
- **Status Window** (a module, on only if the Mode picked *Status Window* on the Magic Menu or *The System / Status Screen* on the Play Menu): the bearer's own exact mana, capacity, Ranks per Domain, Mastery counts, known patterns and skills. Authoritative. The Ceiling shows as "???".

**Signature Effects** (outside the Cost Function, each in the Balance Record):
- **Item Box,** for every holder of the Space affinity: a personal store outside time. Capacity is 0.5 m³ × (Space Rank)², so 0.5 m³ at Rank 1 and 24.5 m³ at Rank 7. Opening it costs nothing. Living things cannot enter. At the holder's death the contents spill out around the body.
- **Mana Sense,** for every caster of Rank 2 or more in any Domain: they feel any casting of Tier 3 or more within its Range, and its Domain.
- **Monster abilities:** a monster's innate ability is carded as a Tier-placed effect of its Domain, costing the monster nothing beyond its Reserve and carded once in the Codex when first met.

**Outsider's Edges** (Magic Menu set 23). A Mode may grant newcomers from another world up to two by default. Each is a Retained Disparity.

| Edge | What it grants |
| --- | --- |
| All Affinities | Affinity for Fire, Water, Wind, Earth, Light and Dark (not Space or Summoning) |
| Vast Reserve | Ceiling ×10 of a rolled birth Ceiling, capped at 30,000; starting capacity at one fifth of that |
| Chantless from the Start | The Chantless skill in every Domain held |
| Appraisal | The Appraisal effect at will by touch, at no mana cost |
| Item Box | The Space Signature Effect at the capacity of Space Rank 3 (4.5 m³), without the Space affinity |
| Rapid Growth | Mastery counts halved; Drain-and-Recover growth doubled |
| Modern Knowledge | One rung up on the first casting of any self-invented pattern, and on Chantless draws |
| A Unique Domain | One Domain no one else holds, designed and Benchmarked at Mode construction |

**Codex:** kept in the Record. Entry: effect · Domain · Tier · Modifiers · Price · Benchmark compared · date found.

**Stages and Products:** Prepared Circles (Stage 1, inscription: no mana, ten times the full-chant time, performed by the caster or any literate assistant, interrupted by smudging; Stage 2, casting). Potions, scrolls and tools are Products under D3.

#### D1.1 Benchmarks

Each row below is a Benchmark Effect Card. The card's **Cost** is its Price from the Cost Function at full chant (the Tier's Base), its **Signature** and **Counters** are its Domain's, its **Gate Ceiling** is its Tier's, and its **Consequence** is none beyond the Price unless stated. Parameters left blank are at or under the Tier's Envelope. Every row fits its own Envelope.

**Fire**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Fire Arrow* | A dart of flame strikes one target within 20 m: a torch's burn; lights what it touches |
| 2 | *Fire Lance* | A spear of fire at 50 m kills an unarmoured person or a wolf, or burns through a door |
| 3 | *Fireball* | A bead of flame flies up to 100 m and bursts in a 10 m sphere; kills armoured soldiers caught in it |
| 4 | *Wall of Fire* | A wall of flame 60 m long burns for up to six hours (sustained); crossing it kills a soldier |
| 5 | *Inferno* | A 100 m firestorm at up to 1 km brings down a gatehouse or burns a warship to the waterline |
| 6 | *Firestorm* | Fire rains over 300 m for as long as it is sustained; breaks an army in the field |
| 7 | *Meteor* | A falling star strikes within 20 km and destroys everything within 1 km |

**Water**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Create Water* / *Water Bullet* | A bucket of clean water, or a fist of water that knocks a man down |
| 2 | *Ice Lance* | A shard of ice at 50 m kills an unarmoured person |
| 3 | *Frost Cone* | A 20 m cone of cold kills armoured soldiers; freezes a 10 m pond hard enough to walk on |
| 4 | *Tidal Surge* | A wave 60 m wide sweeps a squad away; or *Ice Wall*, a 60 m rampart of ice for six hours |
| 5 | *Blizzard* | A 100 m storm of ice and wind for a day; nothing in it can fight or march |
| 6 | *Maelstrom* | A 300 m whirlpool sinks a fleet |
| 7 | *Deluge* | A city flooded, or a 1 km stretch of sea frozen solid for a season |

**Wind**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Wind Cutter* / *Gust* | A blade of air makes a knife cut, or a gust knocks a man down |
| 2 | *Silence* | A 3 m zone with no sound for ten minutes (sustained); no chanting within it |
| 3 | *Lightning Bolt* | A 20 m line of lightning at up to 100 m kills armoured soldiers; or *Fly*, flight for the caster for an hour |
| 4 | *Chain Lightning* | Lightning leaps among up to thirty targets within 300 m |
| 5 | *Tornado* | A 100 m cyclone for a day tears down a gatehouse and scatters a company |
| 6 | *Call Storm* | A 300 m thunderstorm for a week strikes whatever the caster chooses |
| 7 | *Tempest* | A hurricane over a city for a season |

**Earth**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Stone Bullet* / *Mould Earth* | A sling-stone of conjured rock, or a cubic metre of soil reshaped |
| 2 | *Earth Wall* | A 6 m wall of packed earth, 2 m high, raised in seconds |
| 3 | *Stone Spikes* | A 10 m field of spikes kills armoured soldiers; or *Stoneskin*, ten allies' skin turns blades for an hour |
| 4 | *Rampart* | A stone fortification 60 m long and 5 m high, permanent |
| 5 | *Earthquake* | A 100 m quake brings down a gatehouse and a stretch of wall |
| 6 | *Raise Fortress* | A hill within 300 m reshaped into a walled keep, permanent |
| 7 | *Cataclysm* | A valley split, or a mountain wall raised across 2 km |

**Light**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Light* / *Heal* | A globe of light for a minute; or a cut closed |
| 2 | *Cure Wounds* | Three people healed of injuries up to a broken bone |
| 3 | *Greater Heal* / *Purify* | Mortal wounds healed; a disease or poison cured; ten lesser undead destroyed |
| 4 | *Sanctuary* / *Mass Heal* | A 30 m ward that undead and demons of Saint rank or less cannot enter for six hours; or thirty people healed of grave wounds |
| 5 | *Regenerate* | A lost limb or organ regrown |
| 6 | *Holy Judgment* | A 300 m pillar of light destroys undead and demons of King rank or less, and blinds everyone else |
| 7 | *Miracle* | A plague ended across a city, or a cursed land made clean for a season |

**Dark**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Darkness* / *Fear* | A 1 m globe of blackness; or one creature flees for a minute |
| 2 | *Sleep* | Three people fall asleep for ten minutes |
| 3 | *Curse* / *Animate Dead* / *Charm* | A target weakened or blinded for an hour; ten corpses rise as mindless servants for an hour; or ten people regard the caster as a trusted friend for an hour (they will not act against their own Lines) |
| 4 | *Phantasm* | A convincing illusion over 30 m for six hours, seen and heard by all |
| 5 | *Dominate* | One person obeys the caster for a day, then remembers everything |
| 6 | *Army of the Dead* | A thousand corpses rise as mindless soldiers for a week |
| 7 | *Eclipse* | A city under darkness and blight for a season: crops fail, sickness spreads |

**Non-Elemental**

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Magic Missile* / *Mana Shield* / *Detect Magic* | Three darts of force strike targets of the caster's choice unerringly (a knife cut each; stopped only by a Barrier or Mana Shield); or a shield that stops one blow; or a sense of magic within 20 m |
| 2 | *Appraisal* / *Strengthen* | The Interface report on a touched person or object; or one person's strength and speed doubled for ten minutes |
| 3 | *Counterspell* / *Dispel* / *Barrier* | A spell being cast within 100 m is cancelled, or an active effect is ended (each at Even, one rung up per Rank the caster holds above the target effect's Tier, one rung down per Tier the effect holds above the caster's Rank); or a 10 m dome that stops effects of Tier 3 or lower and arrows for an hour |
| 4 | *Haste* | Up to thirty people move and act at double speed for six hours |
| 5 | *Anti-Magic Field* | Within 100 m, for a day, no effect of Tier 5 or lower can be cast or persist, the caster's own included |
| 6 | *Great Barrier* | A 300 m ward over a fortress for a week stops effects of Tier 5 or lower and all projectiles |
| 7 | *Sanctum* | A city warded for a season against effects of Tier 6 or lower |

**Space** (Range ×10)

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 2 | *Fetch* | An unattended object within 500 m appears in the caster's hand |
| 3 | *Blink* | The caster steps to a seen point within 1 km |
| 4 | *Teleport* | The caster and up to thirty people touching them move to a place the caster knows within 3 km |
| 5 | *Long Teleport* | As Teleport, within 10 km |
| 6 | *Teleport Circle* | A party moves between two circles the caster inscribed, within 50 km |
| 7 | *Gate* | A doorway between two circles the caster inscribed, within 200 km, stays open for a day |

**Summoning** (each called being is an Operator Character with a Stake Card; its compliance beyond its Contract is a Discretion Point)

| Tier | Benchmark | Effect |
| --- | --- | --- |
| 1 | *Familiar* | A small spirit-beast is bound for life; the caster shares its senses within 20 m. One familiar at a time |
| 3 | *Summon Beast* | A beast of Advanced-rank strength serves for an hour |
| 5 | *Summon Elemental* | An elemental of King-rank strength serves for a day |
| 7 | *Summon High Being* | A dragon, great spirit or demon lord's equal comes for a season, on Contract |

**Discretion Table for called beings with a will** (Tier 5 and up, and any familiar asked to act against its nature), drawn on arrival or on the request: 01–60 serves as contracted; 61–85 serves after a Price stated on its Stake Card is paid; 86–95 refuses and departs, and the Price is still spent; 96–00 turns on the caster for the Duration.

#### D3. Production Rule

- **Inputs:** mana stones, graded F to S; herbs, minerals and monster parts, graded 1 to 7; condition fresh, aged (one grade down) or spoiled (unusable). Stone grade matches the Tier of the monster it came from: F 1, E 2, D 3, C 4, B 5, A 6, S 7. A stone holds mana equal to four times its Tier's Base: F 20, E 48, D 120, C 300, B 720, A 1,800, S 4,400.
- **Processes:** Brewing (potions); Inscription (scrolls and circles); Enchanting (tools and arms).
- **Producer:** Craft Rank equals the producer's Rank in the relevant Domain: Light for healing potions; Non-Elemental for mana potions, tools and arms; the spell's own Domain for scrolls.
- **Station:** a workshop of grade 1 to 7 (Institutional: guild and academy workshops are graded; a field kit is grade 1).
- **Grade Function:** the highest reachable grade is the lowest of Craft Rank, input grade and station grade. Draw at Likely, or Near-certain if Craft Rank exceeds the target grade: Clean Success, that grade; Success at Cost, that grade, but the inputs for one more batch are spent; Failure with Opening, one grade lower; Clean Failure, ruined, and draw the Side-Effect Function.
- **Side-Effect Function** (d6, on Clean Failure): 1–3 inert; 4–5 tainted (a potion does Tier 1 harm instead of its effect, a tool works once and breaks); 6 volatile (the batch releases its Domain's effect at one Tier below its grade on the producer).
- **Output Space:**

| Product | Grade range | Effect | Shelf | Uses | Transferable |
| --- | --- | --- | --- | --- | --- |
| Healing potion | 1–5 | Heals as the Light Benchmark of its grade's Tier, on the drinker | 1 year (grades 1–3); 5 years (4–5) | 1 | Yes |
| Mana potion | 1–6 | Restores twice the Base of its grade's Tier (10, 24, 60, 150, 360, 900) | As healing | 1 | Yes |
| Spell scroll | 1–5 | Holds one pattern of Tier ≤ its grade; anyone with a capacity of 10 or more casts it by reading its key word, at the scribe's Odds | 10 years | 1 | Yes |
| Magic tool | 1–3 | A household or trade effect of Tier ≤ its grade (lamp, stove, water jar, lock, cooler), run by an inset stone | Until broken | An F stone runs a household tool for about thirty days of ordinary use; each grade of stone up multiplies that by 2.5 | Yes |
| Enchanted arm or armour | 1–6 | Adds a Domain effect of Tier (grade − 2, minimum 1) to each strike, or wards against it, powered by an inset stone | Until broken | Stone mana ÷ the effect's Base | Yes |

- **Scribing cost:** the scribe pays the pattern's full Price in mana at scribing, and the ink needs a stone of grade at least the pattern's Tier. Emperor and Divine patterns cannot be scribed.
- **Potion sickness:** more than two potions within an hour, one rung down on every draw for an hour; more than four, Tier 1 harm as well.
- **Mana transfer:** absorbing a stone takes a minute and yields half its mana (the stone crumbles when empty). Charging a stone costs two mana per mana stored. The round trip loses three quarters, under Invariant 4.

### E. Limitations

- **Costs:** mana (Cost Function); time (chant or circle); Concentration slots; components only for circles, scrolls and Products.
- **Consequences:** Mana Fatigue below a quarter; Mana Exhaustion at zero; Overdraw harm; the Miscast Table on Clean Failure; potion sickness; the attention of anyone with Mana Sense.
- **Countermeasures:**
  - **Sealstone,** a grey ore mana cannot pass through. Shackles of it stop the wearer casting at all. A wall of it blocks effects passing through. Arrows tipped with it pass through Barriers of Tier 3 or lower. It is rare, and its trade is usually controlled (Institutional).
  - **Opposed Domains** (Combination Rule).
  - **Barrier, Mana Shield, Counterspell, Dispel, Anti-Magic Field, Silence** (Benchmarks).
  - **Interruption** of the chant.
  - **Exhaustion:** a mage at zero is an unconscious person.
- **Capability ceilings:** no Domain reaches inside a living body except Light and Dark; Off-Affinity casting stops at Tier 2; scrolls stop at Tier 5; ritual casting stops at the leader's Rank + 1; nothing passes the Apex.

### F. Balance Record

| Unbounded State | Route found | Closed by / Retained as |
| --- | --- | --- |
| Omnipotence | Ritual chains of casters; stacking Shaping Modifiers on a Tier 7 effect | Closed: ritual stops at leader's Rank + 1; the Apex caps every Parameter at the Tier 7 Envelope; no Prohibition yields |
| Omniscience | Appraisal, Detect Magic, Mana Sense, Familiar senses | Closed: all are range- or touch-bound; Appraisal reports bands, not Ceilings or Ranks; no memory reading; no prophecy |
| Omnipresence | Teleport chains; Gates | Closed: Space Range caps at 200 km; Teleport needs a known place, Gates need circles the caster inscribed in person; each jump costs full Price |
| Infinite wealth | Conjured water and stone; charging stones to sell; Item Box smuggling; scroll-selling | Closed for precious goods: no conjuring or transmuting precious metals, gems or stones; the stone round trip loses three quarters. Retained Disparities: Earth and Water mages produce stone and water cheaply (builders, irrigators, drought relief); Space mages move goods untaxed; stone-charging is a living for mages with spare Reserve |
| Rapid power (feedback) | Childhood Drain-and-Recover | Bounded: growth stops at the Ceiling; the Ceiling rises at most to three times its birth value, and only before 12 |
| Death-cheating | Light healing | Closed: nothing restores the dead; healing works only on the living |

- **Disparity map:** a trained Advanced mage is worth several soldiers, a Saint a squad, a King a company, an Emperor an army. Healing is available to those who can pay a Light mage or a church, so the wealthy recover from wounds and disease that kill the poor. Power concentrates where affinity and Ceiling cluster (old bloodlines) and where training is available (academies, which select for wealth and birth). Checks on that power: sealstone; numbers (a mage at zero is helpless, and archers outrange most chants); Counterspell and Barrier from rival mages; the time a chant takes; and institutions that license and watch casters.
- **Retained Disparities:** listed above, together with every Outsider's Edge a Mode grants. *Vast Reserve* and *All Affinities* together put a newcomer within reach of Saint rank in several Domains within a few years; Mastery counts and Rank thresholds still gate the rise, and the Apex still binds.
- **Audited by:** Operator, at authoring of v1.0.0. A Mode that tunes the system re-audits the rows its Tunings touch.

#### Grammar determinacy test (three unanticipated requests)

1. **Low:** "Keep the room warm all night." Fire, Duration eight hours. Placed as a sustained heat with no Modifiers, it would need Tier 5 (the lowest Duration of eight hours or more). A cheaper valid placement exists: *Fire Arrow* lights the hearth (Tier 1, 5 mana), and the fire burns on its fuel under Invariant 3. Ingenuity found the lower route; the Price is that of the effect as placed.
2. **Middling:** "Freeze the 10 m ford hard enough for the company to cross for two hours." Water; Area 10 m (Tier 3); Duration two hours exceeds Tier 3's one hour, so one Extended Duration (×4, giving four hours). One Shaping Modifier does not raise the Tier. Parity with *Frost Cone*: holds. Price ⌈30 × 1.5⌉ = 45 mana, sustained. Codex: *Ford-Ice*, Water T3, 45.
3. **Near the Apex:** "Raise a permanent wall around the capital, 1 km in radius." Earth; Area 1 km (Tier 7); shaped earth persists (Set). Parity with *Cataclysm*: holds. Price 1,100 mana by full chant. No one below Divine can cast it alone; an Emperor-led ritual reaches it at Likely from a Prepared Circle, pooling ⌈1,100 × 0.75⌉ = 825 mana among the participants, over a doubled casting time of several hours. Codex: *Capital Wall*, Earth T7, 1,100 (825 from a Prepared Circle).

---

## Lens Sheets

### Lens: Common Lore (villagers, adventurers, guild clerks)

- **Hardness:** 2 · **Apparent Rationality:** 3
- **Known:** mana and its renewal by sleep; Mana Exhaustion; affinities and their rarity; the seven Rank names and roughly what each can do; chanting, shortened chants, circles; potions, scrolls, tools and stones; sealstone; the Prohibitions on raising the dead, making gold, time travel and memory-reading. Source: common talk, the guild, the Church.
- **Believed (Claims):** capacity is fixed at birth ✗; Chantless casting is a divine gift and cannot be learned ✗; the chant's words have power of their own ✗; Light magic is the Goddess's grace ✗ (unless the Mode adds active gods); Dark mages are wicked (a valuation, not a Specification fact).
- **Perception:** mages are respected professionals; strong mages are courted; Dark users are distrusted; Space mages are envied and suspected of smuggling.

### Lens: Academy Orthodoxy (academy masters, court mages)

- **Hardness:** 3 · **Apparent Rationality:** 4
- **Known:** everything in Common Lore that is true, plus the Rank thresholds and Mastery in rough form, Modifiers and their costs, Compound casting, ritual casting, Counterspell and Dispel, opposed Domains, the Off-Affinity limit, the Miscast results, Production grades. Source: the academy's teaching and archive.
- **Believed (Claims):** capacity is fixed at birth ✗ (the academy measures adults, and has never trained small children deliberately); Chantless casting can be learned only by those born with a talent for it ✗; Interior Resistance is a property of the soul ✓ in effect, ✗ in explanation.
- **Perception:** magic is a discipline and a rank ladder; commoners with talent are exceptions to be sponsored or watched.

### Lens: The Church (priests, healers)

- **Hardness:** 2 in general, 3 for Light · **Apparent Rationality:** 2
- **Known:** Light magic in full to the priest's Rank; Common Lore.
- **Believed (Claims):** Light is the Goddess's grace given to the faithful, and the unfaithful heal less well ✗; Dark magic is corruption of the soul ✗; resurrection was once possible for a saint ✗.
- **Perception:** healing is the Church's office and its income; unlicensed healers are tolerated in the country and resented in cities.

### Lens: The Newcomer (template for an isekai or reincarnated User's Character)

- **Hardness:** 1 on arrival (knows magic exists, and what the Player's own reading suggests), rising by experience.
- **Known:** only what the Character has been told or has done in the fiction, each with its source.
- **Believed (Claims):** whatever the Character assumes from games and fiction, entered as Claims and resolved by the Specification when tested.
- **Note:** the User's Character acts on this Lens only (§25.11). Where the Player knows more than the Character from reading Part 1, the Player undertakes to keep the Character to the Character's Lens.

---

## Disclosure Profile (default)

- **Target Hardness for the User:** 2 at opening (Part 1 published as a Specification Marker) → 3 over the horizon.
- **Disclosure Orientation:** earned.
- **Resolution Transparency (magic):** Odds and mana Costs shown before every casting draw.
- **Exposition Bound:** none outside a Character's Lens.
- **Published Specification Markers:** Part 1, Common Lore, with its Claims marked as what people believe and not as fact.
- **Competence Delegation:** where the User's Character is a trained mage and the Player has not read Part 2, the Character's craft (S2) is delegated to the Operator, as §25.11 provides; the choice to act stays with the User.

---

## Per-Mode hidden state

Rolled and sealed at Mode construction, and never shown to the Player except through the fiction:

- the User's Character's birth Ceiling and, where the Mode starts in childhood, the Ceiling multiplier so far;
- the affinities and Ceilings of recurring Operator Characters who cast;
- any Discretion Table results drawn in advance;
- the design of any *Unique Domain*.

The User's Character's affinities are hidden only until the Character is appraised.

---

## Sources

The conventions gathered here are common to many isekai and fantasy works; no single work is followed.

- [Mushoku Tensei Wiki: Magic](https://mushokutensei.fandom.com/wiki/Magic) and [The Escapist: Mushoku Tensei power ranking explained](https://www.escapistmagazine.com/mushoku-tensei-power-ranking-explained/): the seven-rank ladder, incantation and its shortened and silent forms, magic circles, and capacity raised by childhood training
- [All The Tropes: Alternate Realm Boon](https://allthetropes.fandom.com/wiki/Alternate_Realm_Boon): the advantages a newcomer from another world commonly holds, which became the Outsider's Edges
- [Tropedia: Power Strain Blackout](https://tropedia.fandom.com/wiki/Power_Strain_Blackout): collapse after spending power, the root of Mana Exhaustion
- [Wikipedia: Isekai](https://en.wikipedia.org/wiki/Isekai): the genre's medieval-like setting, magic, and the newcomer's "cheat" abilities
- [D&D Wiki: SRD School Specialization](https://dungeons.fandom.com/wiki/SRD:School_Specialization): the eight tabletop schools offered on the Magic Menu, and the flavour of the Benchmark spell names
- C. R. Rowenson, *The Magic-System Blueprint* (2021), through §25: the variables, limitations and Boundedness audit
