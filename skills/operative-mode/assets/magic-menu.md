# Magic Menu

*Magic Menu v1.0, for the Operative Mode Framework, Draft 0.4 (§25). Machine-readable copy: `magic-menu.json`; random picks: `python scripts/menu_draw.py --magic`. The ready-made default is `standard-magic-system.md`. Selectable picker: `magic-menu.html`.*

The Magic Menu lets a Player build a magic system by picking from option sets, the way the Play Menu builds a Mode. Every set maps onto a field of the Magic Specification (`magic-specification.md`), so a finished set of picks is a Specification the Operator can complete, validate and seal.

## How to use the Menu

**Start with the Approach.** The first question is whether the Player wants to build at all:

| Option | What happens |
| --- | --- |
| **The Standard System** | The Operator adopts `standard-magic-system.md` as written: the mana-and-affinity magic any isekai reader recognizes. Nothing else on this Menu is asked |
| **The Standard System, tuned** | The Standard System is adopted, and the Player changes only the sets they care about. Each changed set is recorded as a tuning (see below) |
| **Build from the Menu** | The Player picks from the sets below, and the Operator elects whatever is left |
| **Leave it to the Operator** | The Operator elects the whole system toward the Mode's Intent and declares the election, as at §11 |

**Every set has an Operator's Choice.** Each set below ends with **Operator's Choice**: the Player leaves that set to the Operator, who elects it toward the Intent and the picks already made. Operator's Choice is a real option, not a skip, and it is recorded as an election (§11.8), so the Player can see afterwards what was chosen and why. A set the Player never reaches is treated the same way.

**Picks are User Declarations.** Every pick is marked **U**. The Operator may not elect against a pick; where two picks conflict, the Operator says so before building, and the Player chooses (Compatibility, §10.5).

**Offer it in small servings.** Twenty-four sets at once is a wall. The Operator offers the four core sets first:

1. **What Magic Is** (the Substrate and Seed)
2. **The Reserve** (what casting spends)
3. **How It Is Cast** (the Operation)
4. **How It Is Divided** (the Domains)

Then the Operator names the remaining sets as available, grouped as **Power** (5 to 9), **Limits** (10 to 14), **The World** (15 to 18), **Shape** (19 to 21), and **Extras** (22 to 24), and offers a group only if the Player wants it. From each set the Operator shows the options suited to what is already picked, and names the rest.

**Picks combine.** Sets marked *several* accept more than one pick (Elemental Domains with a Space rarity; Chanting with Magic Circles). Sets marked *one* take a single pick. Where a Player takes two picks from a *one* set, the Operator asks which leads, and the other becomes a variant enumerated under Consistency (§25.9).

**"Roll for me" is allowed.** Where code runs, `python scripts/menu_draw.py --magic` draws the four core sets; add `--offer 5` for a shortlist, `--categories "…"` for particular sets, or `--all` for every set. The draw never lands on Operator's Choice: if the Player wants a set left to the Operator, they say so. Without code, the draw is a User Roll or Operator Judgment named as judgment (§15.9).

**Tuning the Standard System.** Each set marks the Standard System's own value with ★. A Player who tunes picks a different option in a set; the Operator writes the change into the Standard System's Specification as a numbered **Tuning** (in the Specification's Clause displacements line, Part B), then re-runs Specification Validation (§25.13) for the parts the Tuning touches. A Tuning can unbalance a part of the Standard System it does not mention (a cheaper Reserve makes every Benchmark cheaper), so the re-check covers the Balance Record, not only the line changed.

**Some picks fail Validation.** A combination that the Specification cannot bound (a Reserve with no limit and no Apex, say) is caught at Boundedness (§25.13) and amended before Assent, not three scenes in. The Operator's own limits apply here as everywhere (§19.1).

### What each set sets in the Specification

| Set | What it sets |
| --- | --- |
| 1. What Magic Is | Part A Seed; Part B Substrate |
| 2. The Reserve | Part C Source (Reserve); Part D Cost Function |
| 3. How It Is Cast | Part B Operation; Part C Ease of Use; Part D Modifiers |
| 4. How It Is Divided | Part D Domains |
| 5. Where Power Comes From | Part C Source (Locus); Discretion Points for any patron |
| 6. The Power Ladder | Part D Power Axes and Envelopes |
| 7. Who Can Use It | Part D Access Rule; Part C Transference |
| 8. Affinity | Part D Access Rule; Part C Consistency |
| 9. How Mages Grow | Part D Progression Rule |
| 10. Renewal | Part C Renewal Rule |
| 11. Running Dry | Part C Depletion Effect |
| 12. The Price Beyond Fuel | Part E Costs and Consequences |
| 13. Reliability | Part C Reliability; failure and variance tables |
| 14. Countermeasures | Part E Countermeasures |
| 15. How Common It Is | Part C Prevalence |
| 16. Standing of Mages | Lens Perception (§25.10) |
| 17. Institutions | Institutional gates; faction Lenses |
| 18. The Interface | Part D Diegetic Interface |
| 19. How High It Reaches | Part D Apex Rule |
| 20. What Magic Can Never Do | Part B Prohibitions |
| 21. How It Looks | Signature line of each Effect Card |
| 22. Crafting | Part D3 Production Rule; Products |
| 23. The Outsider's Edge | Signature Effects; Balance Record (Retained Disparities) |
| 24. How Much the Player Is Shown | Disclosure Profile (§25.11) |

---

## Core sets

## 1. What Magic Is · *one*

The Substrate: what magic is in the world's own terms. The pick becomes the Seed's first clause.

| Option | In one line |
| --- | --- |
| ★ Mana | An energy every living thing holds and the world is steeped in; spells give it shape |
| Elemental Spirits | Small wills in fire, water, wind and stone, who act when asked well |
| Divine Grace | Power that belongs to the gods, lent to those they favour |
| Words of Creation | The language the world was made in; to speak it is to command |
| Soul Force | The self's own substance, spent outward |
| Ley Lines | Rivers of power under the land; strong where they cross, absent elsewhere |
| Bloodline Inheritance | A power in certain blood, passed parent to child |
| Contracts | Power owed under agreements with beings that can lend it |
| Residue of the Dead Gods | What remains of fallen divinities, mined, refined or inhaled |
| The System | A rule-engine laid over the world that grants skills and counts levels |
| Dream | The waking world bends to what is dreamed hard enough |
| Lost Technology | What looks like magic is the machinery of a vanished civilization |
| Operator's Choice | The Operator elects it toward the Intent |

## 2. The Reserve · *one*

What casting spends, and how the spending is counted. This is the heart of the Cost Function.

| Option | In one line |
| --- | --- |
| ★ Mana Pool | A personal reserve in points; each spell costs a number of them |
| Stamina / Vitality | Casting tires the body the way labour does; no separate pool |
| Spell Slots (Vancian) | A fixed number of castings per rank per day, prepared in advance |
| Cooldowns | Each spell, once cast, cannot be cast again for a stated time |
| Charges in Objects | Power stored in stones, wands or relics, spent and recharged |
| Components | Each spell consumes a material: herbs, powders, gems, blood |
| Life Span | Every casting spends days, months or years of the caster's life |
| Corruption Track | No fuel; each casting adds to a mark that eventually changes the caster |
| Favour | A patron's goodwill, spent with each request and earned back by service |
| No Reserve, Backlash Only | Casting is free; failure is what costs |
| Operator's Choice | The Operator elects it toward the Intent |

## 3. How It Is Cast · *several*

The Operation: what a caster actually does. Picks combine, and the first pick is the ordinary method; others become Modifiers (§25.8).

| Option | In one line |
| --- | --- |
| ★ Chanted Incantations | Spoken verses; longer verses for greater spells |
| ★ Chantless Casting (advanced) | The same spells without words; rare, prized, costly |
| ★ Magic Circles | Geometric circles drawn or projected; required for the greatest workings |
| Gestures and Signs | Hand shapes and movements carry the pattern |
| Runes and Inscription | Symbols written or carved hold the spell until triggered |
| Focus Required | A staff, wand, grimoire or orb is needed to cast at all |
| Will Alone | Thought and intent; nothing outward |
| True Names | Command a thing by speaking its real name |
| Song and Dance | Melody, rhythm and movement |
| Ritual | Long ceremonies with many participants and materials |
| Equations | Magic as calculation; precision raises power |
| Operator's Choice | The Operator elects it toward the Intent |

## 4. How It Is Divided · *several*

The Domains: how the territory of magic is cut up. Several picks combine (Elemental with a rare Space affinity, say).

| Option | In one line |
| --- | --- |
| ★ Elemental: Fire, Water, Wind, Earth | The classic four, with opposing pairs |
| ★ Light and Dark | Healing, holy and purifying; shadow, curse and illusion |
| ★ Non-Elemental (Null) | Force, barriers, strengthening and detection, open to anyone with mana |
| ★ Rare Affinities: Space, Summoning | Storage, teleportation, gates; familiars and called beings |
| Eight Schools | Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation |
| Five Phases (Wu Xing) | Wood, Fire, Earth, Metal, Water, each generating and overcoming another |
| Aspects / Concepts | Domains are ideas: Time, Death, Fortune, Iron, Hunger |
| Colours | Each colour of power has its own temperament and effects |
| Spirits by Kind | One Domain per kind of spirit, reached by its contract |
| Sigil Families | Each family of runes covers one class of effect |
| Single Domain | One narrow power, done deeply |
| Freeform | No partition; anything in reach, priced by Tier alone |
| Operator's Choice | The Operator elects it toward the Intent |

---

## Power

## 5. Where Power Comes From · *one*

The Locus of the Source. An agentive Locus makes the patron an Operator Character with a Stake Card and Terms (§25.9).

| Option | In one line |
| --- | --- |
| ★ Within the Caster | Each person's own reserve, drawn from inside |
| The Surroundings | Drawn from the air, the land or the ley lines nearby |
| Within and Around | An inner reserve, topped up from the world |
| A Patron | Lent by a god, demon, fae or spirit, under Terms |
| A Bonded Partner | Shared with a familiar, spirit or person |
| Objects | Stored in stones, relics or devices |
| Sacrifice | Taken from what is given up: blood, life, possessions, memories |
| Operator's Choice | The Operator elects it toward the Intent |

## 6. The Power Ladder · *one*

The primary Power Axis and the names of its Tiers.

| Option | In one line |
| --- | --- |
| ★ Seven Named Ranks | Beginner, Intermediate, Advanced, Saint, King, Emperor, Divine |
| Circles 1 to 9 | Numbered tiers of spells, as in tabletop play |
| Letter Ranks F to S | F, E, D, C, B, A, S, and legends beyond |
| Stars | One star to seven or nine |
| Realms | Cultivation-style realms with named stages inside each |
| Two Axes | Power (how much) and Complexity (how intricate) ranked separately |
| Unranked | No public ladder; strength is shown, never measured |
| Operator's Choice | The Operator elects it toward the Intent |

## 7. Who Can Use It · *one*

The Access Rule's first gate.

| Option | In one line |
| --- | --- |
| ★ Most People, Few Trained | Nearly everyone has some mana; real mages are those who trained |
| Everyone Equally | Any person can learn it to any height |
| The Born Gifted | A minority born with it; the rest never |
| Noble Blood | Strong in old families, weak or absent in commoners |
| The Chosen | A handful picked by fate, a god or an artifact |
| Contract-Holders | Only those who made a pact |
| Only Outsiders | Locals cannot; summoned or reincarnated people can |
| Operator's Choice | The Operator elects it toward the Intent |

## 8. Affinity · *one*

How each caster's reach across Domains is limited. This is enumerated under Consistency.

| Option | In one line |
| --- | --- |
| ★ Born Affinities | Zero to four Domains at birth; off-affinity casting is weak and expensive |
| One Affinity Each | Every caster has exactly one Domain |
| Learned, Not Born | Any Domain can be studied; aptitude only speeds it |
| Personality-Linked | A caster's temperament decides their Domains |
| Single Shared Art | No affinities; everyone works the same magic |
| Operator's Choice | The Operator elects it toward the Intent |

## 9. How Mages Grow · *several*

The Progression Rule: what raises a caster's Rank and Reserve.

| Option | In one line |
| --- | --- |
| ★ Drain-and-Recover | Emptying the reserve and recovering enlarges it, most in childhood |
| ★ Mastery by Use | Successful castings at one's own Rank unlock the next |
| Study | Learning spells from teachers, grimoires and academies |
| Levels and Experience | Defeating foes and finishing tasks raises a level |
| Breakthroughs | Long plateaus broken by a risky trial |
| Deepening Pact | The patron grants more as the bond strengthens |
| Fixed at Birth | No growth; what one is born with is what one has |
| Consuming Power | Absorbing monster cores, relics or rivals |
| Operator's Choice | The Operator elects it toward the Intent |

---

## Limits

## 10. Renewal · *several*

The Renewal Rule: what refills the Reserve.

| Option | In one line |
| --- | --- |
| ★ Rest and Sleep | A full night restores it; rest restores it by the hour |
| ★ Potions and Mana Stones | Drunk or absorbed, at a loss |
| Meditation | Focused stillness restores faster than sleep |
| Ley Lines and Places | Some places refill quickly, others barely at all |
| Time of Day, Moon or Season | Renewal waxes and wanes on a cycle |
| Prayer or Worship | Devotion refills it |
| Eating and Drinking | Food is fuel |
| Never | What is spent is gone for good |
| Operator's Choice | The Operator elects it toward the Intent |

## 11. Running Dry · *one*

The Depletion Effect: what happens at zero.

| Option | In one line |
| --- | --- |
| ★ Mana Exhaustion | Weakness as it runs low; the caster faints at zero |
| Cannot Cast, Nothing Else | The well is dry until it refills |
| Burns Life Instead | Casting continues, paid for in health |
| Madness | The mind frays as the reserve empties |
| Permanent Loss | Draining fully shrinks the reserve for good |
| Death | Zero is fatal |
| Operator's Choice | The Operator elects it toward the Intent |

## 12. The Price Beyond Fuel · *several*

Costs and Consequences that are not the Reserve itself.

| Option | In one line |
| --- | --- |
| ★ None Beyond Fuel | Fuel is the whole price for ordinary casting |
| ★ Overreach Backlash | Casting above one's Rank, or failing badly, rebounds on the caster |
| Physical Strain | Nosebleeds, headaches, shaking hands |
| Ageing | Great workings take years |
| Corruption | Repeated use changes body or mind |
| Attention | Casting is noticed by something that should not notice |
| Environmental Drain | The land around is weakened by each working |
| A Debt | Each casting adds to what is owed a patron |
| Operator's Choice | The Operator elects it toward the Intent |

## 13. Reliability · *one*

How sure a casting is. Below Certain, the failure chance and its table are declared, and outcomes are drawn (§20.14).

| Option | In one line |
| --- | --- |
| Certain | A known spell within one's Rank never fails |
| ★ Mostly Dependable | Sure below one's Rank; a real chance of failure at it and above |
| Risky | Every casting can fail or misfire |
| Wild | Every casting is a gamble on what happens at all |
| Operator's Choice | The Operator elects it toward the Intent |

## 14. Countermeasures · *several*

What stops or cancels magic.

| Option | In one line |
| --- | --- |
| ★ Anti-Magic Material | An ore that blocks mana; shackles, walls and blades of it |
| ★ Dispelling and Countering | Spells that unmake or answer spells |
| ★ Barriers | Wards that stop effects at a boundary |
| ★ Interrupting the Caster | Break the chant, the gesture or the focus |
| ★ Opposed Elements | Water against fire, earth against wind, light against dark |
| Iron or Salt | Mundane materials that magic cannot cross |
| Faith | Belief itself resists |
| Distance | Magic weakens sharply with range |
| Operator's Choice | The Operator elects it toward the Intent |

---

## The World

## 15. How Common It Is · *one*

Prevalence. The same scale as the Play Menu's *How common magic is* (§10); a pick there answers this set.

| Option | In one line |
| --- | --- |
| None | No magic; only rumour and belief |
| Rare | A handful of practitioners, feared or hunted |
| Guarded | Common but controlled by an order, a church or a crown |
| ★ Widespread | Everyday magic in trades and homes |
| Saturated | Magic in the air, the water and the laws of nature |
| Operator's Choice | The Operator elects it toward the Intent |

## 16. Standing of Mages · *one*

How the population regards casters. This sets Perception in the common Lens, not a fact of the Specification.

| Option | In one line |
| --- | --- |
| ★ Respected Professionals | Valued for skill; strong mages are courted by crowns and guilds |
| Ruling Class | Mages are the aristocracy |
| Feared and Hunted | Magic is suspected, outlawed or burned |
| Holy Servants | Casters are priests, and magic is worship |
| State Assets | Registered, conscripted, owned |
| Ordinary Tradesfolk | A mage is like a smith or a baker |
| Operator's Choice | The Operator elects it toward the Intent |

## 17. Institutions · *several*

Who teaches, licenses and controls magic. These are Institutional gates: breakable in the fiction, with institutional consequences.

| Option | In one line |
| --- | --- |
| ★ Magic Academy | A school for the gifted, often the noble |
| ★ Adventurers' Guild | Ranks, quests and monster bounties; mages hired as party members |
| ★ Church | Healing and holy magic under a faith |
| Mages' Guild or Tower | A professional body that licenses practice |
| Royal Court Mages | The crown's own casters |
| Secret Orders | Hidden societies that hoard knowledge |
| Sects | Rival schools with lineages and grudges |
| None | Magic is learned master to apprentice, or alone |
| Operator's Choice | The Operator elects it toward the Intent |

## 18. The Interface · *one*

A Diegetic Interface: anything in the world that reports magical facts. Its Authority is declared (§25.8.2).

| Option | In one line |
| --- | --- |
| ★ Appraisal Crystal and Appraisal Spell | Measures affinity and rough capacity; exact numbers are not shown |
| Status Window | A personal screen of stats, skills and levels |
| Guild Card | A card that records rank and deeds |
| Familiar's Sense | A bonded creature tells the caster what it feels |
| None | Nothing in the world reports on magic |
| Operator's Choice | The Operator elects it toward the Intent |

---

## Shape

## 19. How High It Reaches · *one*

The Apex Rule: what the top Tier can do.

| Option | In one line |
| --- | --- |
| A Room | Even the greatest magic is personal in scale |
| A Battlefield | The strongest can decide a battle |
| ★ A City | The strongest can destroy or save a city |
| A Nation | The strongest can reshape a country |
| A World | The strongest rival gods |
| Operator's Choice | The Operator elects it toward the Intent |

## 20. What Magic Can Never Do · *several*

Prohibitions. Several are expected; each is absolute under Amendment.

| Option | In one line |
| --- | --- |
| ★ Raise the Truly Dead | Nothing returns a person once dead |
| ★ Travel in Time | No going back, no seeing ahead |
| ★ Read Memories | Surface thought at most; never the mind's store |
| ★ Make Gold | No transmuting or conjuring precious metals or gems |
| ★ Copy Magic or Life | Nothing duplicates a living thing or an enchanted object |
| ★ Bind a Will Forever | Domination always ends |
| ★ Reach Inside the Living | Outside mana cannot act inside another living body, except to heal or curse |
| Create Life | No new living things |
| Prophecy | The future cannot be read |
| Grant Wishes | No effect that simply makes a desire true |
| Operator's Choice | The Operator elects it toward the Intent |

## 21. How It Looks · *one*

The Signature: how magic shows itself to the senses.

| Option | In one line |
| --- | --- |
| ★ Glowing Circles and Coloured Light | Circles flare under the caster, each element in its own colour |
| Invisible | Effects appear with no visible working |
| Runes in the Air | Script blazes and fades around the caster |
| The Caster Changes | Eyes glow, veins light, hair lifts |
| Sound and Scent | A hum, a chime, ozone, smoke, flowers |
| Distortion | Air ripples, shadows bend wrong |
| Operator's Choice | The Operator elects it toward the Intent |

---

## Extras

## 22. Crafting · *several*

The Production Rule (§25.8.5). A Mode with no pick here has no magical crafting.

| Option | In one line |
| --- | --- |
| ★ Potions (Alchemy) | Healing and mana potions, poisons and remedies |
| ★ Spell Scrolls | A spell written down, cast once by anyone with a little mana |
| ★ Magic Tools | Lamps, stoves and locks powered by mana stones |
| ★ Enchanted Arms and Armour | Blades that burn, armour that turns spells |
| Golems and Constructs | Made servants that obey |
| Wards and Talismans | Protective charms worn or posted |
| None | No magical crafting |
| Operator's Choice | The Operator elects it toward the Intent |

## 23. The Outsider's Edge · *several*

For isekai and reincarnation Modes: the advantages a newcomer from another world holds. Each pick is a Signature Effect, entered in the Balance Record as a Retained Disparity. The Standard System allows up to two by default.

| Option | In one line |
| --- | --- |
| All Affinities | Access to every elemental Domain |
| Vast Reserve | A Reserve many times the local norm |
| Chantless from the Start | Wordless casting without the years of training |
| Appraisal | Reads the name, affinities and capacity band of what one touches |
| Item Box | A personal storage space, out of time |
| Rapid Growth | Progression at twice the usual rate |
| Modern Knowledge | Science and mathematics count as comprehension for spells |
| A Unique Domain | A Domain no one else in the world holds |
| None | The newcomer is as ordinary as anyone |
| Operator's Choice | The Operator elects it toward the Intent |

## 24. How Much the Player Is Shown · *one*

The Disclosure Profile (§25.11). The Specification is complete in every case; this sets only what the Player sees.

| Option | In one line |
| --- | --- |
| Hard: Shown Early | The rules, costs and numbers are disclosed at the start |
| ★ Hard: Learned in Play | Common knowledge at the start; the rest learned by the Character |
| Soft: Mysterious | Little is ever explained; effects are shown, not their workings |
| Visible Numbers | Odds and Costs are shown before every casting |
| Hidden Numbers | Odds and Costs are drawn and recorded, not shown |
| Operator's Choice | The Operator elects it toward the Intent |

---

## From picks to a Specification

When the Player has finished picking, the Operator:

1. Writes the Specification from `magic-specification.md`, filling each field the picks set and electing the rest. Each elected value is marked **I** with a one-line reason, so the Player can correct it.
2. Converts the picks into numbers: the Envelopes, the Cost Function and the Benchmarks. Where the picks leave a number open, the Operator borrows the Standard System's value for that row and says so, so that no number is improvised later.
3. Runs Specification Validation (§25.13), and returns any Unbounded State it finds with a proposed fix, before Assent.
4. Seals the Specification at the highest available Commitment Level (§25.12).
5. Reports back in one short block: the picks (U), the elections (I), the Signature Choices among them, and anything Validation changed.
