---
name: "scriptorium-menu"
description: "The Scriptorium's Novel Menu, its counterpart of the Operative Mode Play Menu: option sets an unsure Author picks from to declare a novel, each mapped to the Manifest field it sets. Use on 'surprise me', 'give me options', 'roll for me', a request for the menu, or a stalled Declaration."
---

# Scriptorium: The Novel Menu

The Novel Menu gives an Author who is unsure what novel to write twenty-two sets of options to pick from, and every pick maps onto a field of the Manifest that `scriptorium-manifest` then builds. It is the Scriptorium's counterpart of the Play Menu (v1.1, Operative Mode Framework, Draft 0.4). The logic of the Play Menu is kept: small servings, picks that combine, every pick a Declaration, everything unpicked left to the Operator, real draws when the Author says "roll", and Validation at construction rather than twenty chapters in.

What changes is the target. The Play Menu configures a Mode for a Player who acts inside the story. The Novel Menu declares a book for an Author who stands outside it. So the categories that matter most for a novel are new: the ending the Design commits to, the Reader's stance toward the protagonist, the narration, the declared Arc, the shape of the antagonism, and how the telling spends exposition and secrets. The Play Menu's setting and cast lists are carried over, recast where a novel needs it.

The Menu is a Declaration aid inside step 1 of `scriptorium-manifest`. It drafts no prose, starts no later step of the Manifest by itself, and builds no world.

## When to offer it

- The Author wants a novel and does not know what kind, says "surprise me", "give me options" or "roll for me", or stalls at Declaration.
- The Author asks for the Menu by name, or for options in one category ("give me some ending options").
- Not when a Declaration already exists or a manuscript is being retrofitted, except for a category the Author asks about.
- Never unprompted while the Author is developing a setting. The suite runs on request.

## How to serve it

**Small servings.** Twenty-two lists at once is a wall.

1. **Serving 1, the core three.** Offer **Genre** first, with five or six options spread across the list and the rest named as available. Once a genre is picked, offer **one Base Setting category** suited to it (or "I have my own setting"), then **Tone** (a dominant tone and an undertone).
2. **Serving 2, the book's spine.** Offer **Protagonist** (station and premise engine), **Ending**, and **Narration**.
3. **Refinements,** only if the Author wants them: any other category, named as available.

From each list show five or six options suited to what is already picked, and name the rest as available. "Suited" means compatible with the picks and native to the genre. It never means "more dramatic": options are described as what they are and are never ranked by dramatic yield (the Manifest's first consequence).

Each serving counts as one of the three questions Declaration allows. After the second serving, elect the rest unless the Author asks for more. Present a serving as a short numbered list; the Author may answer with numbers, names, several picks, or "roll".

**Picks combine.** Several options may be taken from one category (Mystery and Political Thriller; Transmigration and Entity of Power). Two picks from different setting categories make a Trope Fusion, whose collision point the Operator names. Premise engines stack. Tone is best picked as a dominant tone plus an undertone.

**Marks.** Every pick is an Author Declaration, marked `U`. Every category left unpicked stays the Operator's: elected (`E`) where the Design needs a value, inferred (`I`) where the picks imply one. These are the Manifest's own marks.

**"Roll for me" is a real draw.** Where code runs, pass the full list exactly as this Menu gives it to the draw below, and report it as a Tool Draw. Otherwise ask the Author for numbers (a User Roll), or pick and say plainly that it is the Operator's judgment. A drawn pick the Author accepts is recorded `U, drawn` with its source. A number the Operator chose is never presented as a roll.

```bash
python3 - 1 "Option A" "Option B" "Option C" <<'PY'
import secrets, sys
n, pool = int(sys.argv[1]), list(dict.fromkeys(sys.argv[2:]))
picks = [pool.pop(secrets.randbelow(len(pool))) for _ in range(min(n, len(pool)))]
print("; ".join(picks), "(source: Tool Draw from the Novel Menu)")
PY
```

The first argument is how many to draw; `1` picks, `5` gives a shortlist to offer. To draw a setting category first, pass the seven category names as the options.

**Some combinations fail Validation.** The Operator's own limits are a constraint on every Manifest (Constraint admissibility), so a combination that needs excluded content is declined at construction. School with Romance runs only with adult characters (a university, an academy of adults, a military college). Minors are never sexualized, whatever the picks.

**The World course declares; it does not build.** If the Author has a setting, it is imported as the Substrate and the World course fills only what it leaves open. A World pick never overrides an existing setting; a conflict between them is a Setting Query. Without a setting, World picks fix the **base setting** and the **Delta Inventory** as Author Declarations (`U`), each Delta concept with a `DX` ID and tier tag. The Manifest then composes a Minimal Substrate holding only what the novel's events need in order to be decidable. Derivation, coherence and development of the world belong to `worldbuilding-analysis`, offered once.

**After the Menu,** hand the picks to Declaration in `scriptorium-manifest`, record them (see "Recording the picks"), and continue the Manifest's workflow from there.

## What each category sets in the Manifest

| # | Category | What it sets |
|---|---|---|
| 1 | Genre | Base genre; the Reader; a candidate Genre Regime (Soft unless the Author makes it Hard); exposition opening position |
| 2 | Form and Scale | Horizon; Parts; Length Band and Length Unit; ceremony level (Light or Full) |
| 3 | Ending | Author Objective; an ending Regime (for example a Hard TRIUMPH); Controlling Idea, or its emergence; a Pre-Mortem line |
| 4 | The Reader's Stance | The Reader declaration; Anti-aims; Kernel lines on sympathy and judgment |
| 5 | Narration | POV Mode; Tense; narrative distance; a Deception Obligation where the narrator is unreliable |
| 6 | Prose Register | The specification the Touchstone is drafted to; Voice Skill parameter; Stale Register seeds |
| 7 | Tone and Atmosphere | The Touchstone; Kernel lines; Pre-Mortem tell-tales |
| 8 | Structure and Pacing | Order defaults (Linear, Analepsis, Prolepsis); the Strand plan; Part peaks and Decompression; the BOOK Regime's availability |
| 9 | Exposition and Secrets | Exposition Budget (opening position; Patterned or Stated); Deception policy; what the Knowledge Matrix denies the Reader |
| 10 | Protagonist | The Principal's Card and `ch-000` Standing; a Signature Choice; Substrate System extracts for the premise engine |
| 11 | Arc Shape | Arc Declaration: component, direction under a declared evaluator, Probe Set; the DUAL Regime option |
| 12 | Character Archetypes | Cards and Voice Cards of Principal and Supporting Agents |
| 13 | Antagonism | Core conflict as Goal pairs and Conflict Classes; antagonist Cards; Clocks for forces without a will |
| 14 | Romance | An Aim; a Strand; one Agent's Want involving the protagonist; Content bounds |
| 15 | Cast Breadth | Number of Principals; POV plan; tiering |
| 16 | Base Setting | Base setting; Delta Inventory; Minimal Substrate; Causal Standard |
| 17 | Peoples and Creatures | Delta concepts (who lives in the world besides humans) |
| 18 | Social Order, Faith and Politics | Lore extracts; faction Cards; prophecy and scripture as Claims |
| 19 | Progression Mechanics | Substrate System extracts; on-page conventions; Exposition Mode; Clocks |
| 20 | Thematic Questions | Ranked Aims; Probe Set contexts; Controlling Idea candidates |
| 21 | Content Bounds | Content bounds; Constraint admissibility |
| 22 | Shelf and Comparables | The Reader; Aims. Never the Touchstone |

## Course I · The Book

### 1. Genre

The genre fixes the base the Reader already holds and proposes a Genre Regime. A Regime is Soft (a tendency) unless the Author declares it Hard (a constraint, for example Romance's committed ending or Mystery's fair solution).

| Option | In one line |
|---|---|
| Isekai | Carried into another world, by death, summons or portal |
| Romance | The relationship is the plot |
| Comedy | Built for laughs: misunderstanding, escalation, timing |
| Horror | Dread and threat; survival is not assured |
| Adventure | Journeys, danger and discovery |
| Mystery | A question solved from fair clues |
| Drama | Character conflict and consequence, played straight |
| High Fantasy | A secondary world with its own magic and history |
| Low Fantasy | Rare, costly or dubious magic in a grounded world |
| Soft Sci-Fi | Future and society first, science loosely |
| Hard Sci-Fi | Science held to its real limits |
| Slice of Life | Ordinary days, small stakes, texture |
| Surreal / Absurd | Dream logic and the impossible, taken calmly |
| Survival | Scarce resources and a hostile world |
| School | An academy, its rivalries and hierarchy |
| Villain Protagonist | The antagonist's story, told from inside, won on its own terms |
| Historical | A real period, rendered faithfully |
| Political Thriller | Power, conspiracy and betrayal at the top |
| Court Intrigue | A court's factions, favour and poison |
| Action | Momentum, fights and chases |
| Crime / Noir | Crime, compromised people, a city that swallows them |
| Heist | Planning and executing an impossible theft |
| War / Military | Soldiers, command and campaigns |
| Espionage | Spies, cover identities, divided loyalties |
| Western | The frontier, its law and its lawlessness |
| Cultivation (Xianxia / Wuxia) | Martial or immortal ascent through realms of power |
| LitRPG / Progression | Levels, stats and visible growth under a System |
| Superhero | Powers, identities and public consequence |
| Mecha | Giant piloted machines and the people inside them |
| Kingdom Building | Found, run and expand a domain |
| Revenge | A wrong, and the long road to answering it |
| Tragedy | Heading somewhere terrible, knowingly |
| Psychological | The mind as the battlefield: paranoia, manipulation |
| Coming of Age | Growing into who one becomes |
| Cozy / Slow Life | Low stakes, craft and comfort; a quiet life after a hard one |
| Literary | Interior life and language foremost; plot serves character |
| Family Saga / Chronicle | Generations, houses and dynasties across long spans |
| Picaresque | A rogue's episodic progress through a society |
| Gothic Romance | Love, secrets, and a house that keeps them |
| Romantasy | Fantasy in which the romance carries equal weight |

### 2. Form and Scale

**Form**

| Option | In one line |
|---|---|
| Novella | Roughly 20,000 to 40,000 words; one Part; Light ceremony |
| Standalone novel | One book, complete; commonly 80,000 to 120,000 words in genre fiction |
| Duology | Two books, one arc |
| Trilogy | Three books, each with its own peak, one overall arc |
| Open series | Books with their own arcs and a series-long Strand |
| Web serial | Open-ended, released chapter by chapter |
| Light novel volumes | Short volumes in sequence, each a complete movement |
| Long serial | Hundreds of chapters at web-novel scale |
| Novel in stories | Linked, self-contained episodes on one through-line |

**Chapter Length Band**

| Option | Band |
|---|---|
| Short | 1,500 to 2,500 words (frequent serial release) |
| Standard | 3,000 to 5,000 words (the Scriptorium default) |
| Long | 5,000 to 7,000 words |
| Very long | 6,000 to 7,000 words, or about 10,000 characters with `Length Unit: characters` (Chinese web-novel scale) |

**Part size:** 8 to 12 chapters (the default), one Part per book, or as the Author sets.

### 3. Ending

An ending pick fixes the last state the Fabula reaches, not the route to it.

| Option | In one line |
|---|---|
| Triumph | The protagonist wins what they set out to win (a Hard TRIUMPH Regime when fixed) |
| Pyrrhic Victory | The win, at a cost that unmakes part of it |
| Bittersweet | Gain and loss held in balance |
| Tragic Fall | The protagonist is destroyed, by their own nature or choices |
| Comic Resolution | Order restored, unions made, misrule ended |
| Defeat with Meaning | The protagonist loses, and the loss counts for something |
| Open / Ambiguous | The last question is left to the Reader |
| Cyclical | Back where it began, changed |
| Reversal | The ending recasts what came before (needs a Retrospective Strand or a ledgered Deception) |
| Left to Emerge | No ending fixed; the Controlling Idea is named at the last Part Review |

### 4. The Reader's Stance

**Toward the protagonist**

| Option | In one line |
|---|---|
| Sympathetic | The Reader likes them and wants them to win |
| Admired, not liked | Competence and nerve hold the Reader; warmth is not offered |
| Rooting without approval | The Reader wants them to win and disapproves of how |
| Free to root against | The book asks nothing of the Reader's sympathy; the Reader may want them to fail |
| Divided | Several viewpoints with opposed claims; the Reader chooses |
| Observed | The protagonist held at a distance and judged by events |

**The Reader's genre knowledge:** Newcomer (conventions introduced through use); Veteran (conventions assumed, and turned at will); Mixed.

**What the Reader comes for** (one or two): to be thrilled; to be moved; to puzzle; to fear; to laugh; to dwell in a world; to watch a rise; to watch a fall.

## Course II · The Telling

### 5. Narration

**Point of view**

| Option | In one line |
|---|---|
| First person, retrospective | The narrator looks back on what happened |
| First person, immediate | The narrator lives it as it is told |
| Third limited, single | One focalizer throughout |
| Third limited, rotating | The focalizer changes at scene or chapter breaks |
| Third limited, unmarked thought | Close third with the focalizer's first-person thought set in the narration unmarked |
| Omniscient | A narrator above the cast, with a voice of its own |
| Objective | The camera only; no interiors |
| Second person | "You" as the protagonist |
| Epistolary | Letters, diaries, records and reports |
| Frame narrative | A teller within the tale |
| Dual first person | Two narrators in alternation |
| Unreliable narrator | The telling misleads; a Deception Obligation owes its reveal |

**Tense:** Past; Present; Past with a present-tense frame; Present with past-tense interludes.

**Distance:** Close (thought and sensation at the skin); Middle; Distant (the chronicle's long view).

### 6. Prose Register

A register pick is the specification the Touchstone is written to. The ratified Touchstone then outranks it. No living author's text is imitated or reproduced.

| Option | In one line |
|---|---|
| Plain / Transparent | The prose disappears behind events |
| Lyrical | Rhythm, image and the music of the sentence |
| Ornate / Archaic | Period diction, long periods, ceremony |
| Chronicle | A historian's measured distance, scene and summary together |
| Hardboiled | Short, cynical, physical |
| Clinical | Precise, reported, unemotional |
| Wry / Conversational | A narrating voice with opinions and timing |
| Mythic | The cadence of saga and scripture |
| Web-serial / Anime | Energetic beats, banter, sound effects and honorifics; genre register, not policed as cliché |
| Systematic exposition | Dense, structured, mechanism-forward (with `systematic-exposition-voice` where installed) |
| Animated | Vivid, kinetic, staged like the screen (with `animated-voice` where installed) |

### 7. Tone and Atmosphere

Tone sets the range the Touchstone anchors. The best pick is two options: a dominant tone and an undertone (grim with dry wit; cozy with melancholy). Tone does not set how graphic the book is; that is Content Bounds.

| Option | In one line |
|---|---|
| Grim | Hard world, hard choices, costs that stay paid |
| Bleak | Hope is scarce and usually misplaced |
| Gritty | Realistic, dirty, physical and unglamorous |
| Heroic | Courage matters and can win |
| Epic | Vast stakes, grand scale, the weight of history |
| Hopeful | Things can get better, and are worth the effort |
| Cozy | Warm, safe, small and comforting |
| Whimsical | Light, odd and charming |
| Playful | Banter and mischief; nothing too heavy for long |
| Farcical | Escalating absurdity and slapstick |
| Satirical | Mockery with a target |
| Dry / Wry | Understated wit in the telling |
| Romantic | Longing, tension and tenderness |
| Melancholic | Quiet sadness, loss and memory |
| Bittersweet | Gains that cost something dear |
| Nostalgic | A time or place remembered fondly |
| Tense | Suspense in every scene; something may break |
| Ominous | Something is coming, and it is not good |
| Dread | Fear that builds without release |
| Eerie / Uncanny | Almost normal, and wrong |
| Noir | Cynical, shadowed, morally tangled |
| Dreamlike | Soft edges, strange logic, lyrical |
| Frantic | Fast, chaotic, overwhelmed |
| Serene | Calm, contemplative, unhurried |
| Intimate | Close on a few people, and what passes between them |
| Clinical | Detached, precise, reported rather than felt |

### 8. Structure and Pacing

**Shape**

| Option | In one line |
|---|---|
| Linear | Events told in the order they happen |
| In medias res | Open mid-action; the past supplied later (the BOOK Regime is then unavailable) |
| Bookended | Open and close in stillness (the BOOK Regime is available) |
| Prologue from the end | A glimpse of the outcome first, then the road to it |
| Dual timeline | Two periods in alternation, converging |
| Braided | Several Strands in alternation, converging at the climax |
| Frame tale | A story told within a story |
| Reverse chronology | Told backward |
| Episodic | Self-contained episodes on a through-line |
| Mosaic | Many viewpoints and documents assembling one picture |
| Countdown | A fixed deadline from the first page, kept as a visible Clock |

**Pacing**

| Option | In one line |
|---|---|
| Slow burn | A long build and rare peaks |
| Steady build | One peak per Part, each higher than the last |
| Escalating | Rising pressure with little release |
| Serial hooks | Every chapter ends on a live question |
| Wave | Peak, Decompression, peak, as a declared rhythm |
| Breathless | Compressed time and short chapters |

### 9. Exposition and Secrets

**How the world is explained**

| Option | In one line |
|---|---|
| Immersive | Nothing explained; the world registers by pattern |
| Gradual | Concepts introduced through use, as far as scenes need them (the Scriptorium default) |
| Guided | A newcomer focalizer learns alongside the Reader |
| Front-loaded | A prologue or opening chapter sets out the world |
| Epigraphs and documents | In-world excerpts head the chapters |
| System messages | Status screens and notifications carry the rules |
| Appendix and glossary | The reference lives outside the text |

**What the Reader is told**

| Option | In one line |
|---|---|
| Fair play | No Deception; the Reader holds what the focalizer holds |
| Dramatic irony | The Reader knows what the characters do not |
| Mystery | The Reader knows less, and is owed the answer |
| Withheld twist | A Retrospective Strand, disclosed late |
| Unreliable narration | A Deception Obligation with its reveal owed |
| Hidden identity | Someone is not who the Reader thinks |
| Red herrings | False leads, each fair in retrospect |

## Course III · The Cast

### 10. Protagonist: Station and Premise Engine

**Station** is what the protagonist does in the world, and so it sets their starting Standing, resources and obligations, and which scenes are native to the book.

| Sphere | Options |
|---|---|
| Rule and nobility | Heir to a throne; Regent; Minor lord; Noble scion; Exiled prince or princess; Court advisor; Governor |
| War | Knight; Common soldier; Officer; Mercenary captain; General; Military cadet; Deserter |
| Law and order | Detective; Judge; Inquisitor; Bounty hunter; Guard captain; Lawyer; Tax assessor |
| Underworld | Thief; Assassin; Smuggler; Crime boss; Fence; Con artist; Spy |
| Magic and learning | Apprentice mage; Court wizard; Scholar; Alchemist; Archivist; Researcher |
| Healing | Doctor; Field medic; Herbalist; Plague doctor; Apothecary |
| Faith | Priest; Monk; Exorcist; Temple guard; Heretic preacher; Missionary |
| Trade and craft | Merchant; Blacksmith; Innkeeper; Chef; Farmer; Shopkeeper; Guild artisan |
| Travel | Adventurer; Explorer; Ship's captain; Pilot; Caravan master; Courier |
| Arts and society | Bard or performer; Idol; Courtesan; Painter; Writer; Journalist |
| Service | Butler or maid; Bodyguard; Secretary; Tutor; Squire; Steward |
| Modern life | Student; Office worker; Police officer; Streamer; Scientist; Politician; Soldier |
| Frontier and survival | Hunter; Ranger; Prospector; Scavenger; Settler; Beast tamer |
| Outsider | Hermit; Servant or bondsman; Prisoner; Amnesiac; Wanderer; Nobody in particular |

**Premise engine** is how the protagonist arrived in the story and what sets them apart once there. Engines stack, two or three at once. A premise engine usually becomes a Signature Choice. Where it needs a System rule (a transmigration, a System, a time loop), the rule enters the Substrate as an Author-declared extract, and its mechanics are composed only as far as the novel's events need, or go to `worldbuilding-analysis`.

| Engine | Definition | Example |
|---|---|---|
| Reincarnation | Reborn in the same world | |
| Transreincarnation | Reborn in another world | Youjo Senki |
| Transmigration | Transported to another world | Shrouding the Heavens |
| Transanimation | One's consciousness carried into another body, in another world | Battle Through the Heavens |
| Rebirth | One's consciousness carried back in time | A Tale of Demons and Gods |
| Power Ability | An exceptional ability granting a specific power | Divine Throne of Primordial Blood |
| Position of Power | A position of authority, with real power | |
| Power Object | An object or property that grants power | |
| Entity of Power | A powerful entity accompanies the protagonist | Jujutsu Kaisen; Chainsaw Man |
| Virtual Reality | Taking part in a simulated world | Sword Art Online |
| Artificial Intelligence | An advanced AI as an assistant | Nano Machine |
| Summoning | Called into another world by its inhabitants, for their purpose | The Rising of the Shield Hero |
| Reverse Isekai | A being from another world arrives in ours | The Devil Is a Part-Timer! |
| Returnee | Comes back after years in another world, changed | Uncle from Another World |
| The System | A game-like interface grants levels, quests and growth | Solo Leveling |
| Foreknowledge | Knows the plot the world is about to follow | Omniscient Reader's Viewpoint |
| Villainess Role | Wakes as the doomed antagonist of a known story | My Next Life as a Villainess |
| Non-human Rebirth | Reborn as a monster, object or creature | That Time I Got Reincarnated as a Slime |
| Time Loop | Death or a trigger resets time to a fixed point | Re:Zero |
| Body Swap | Exchanges bodies with someone in the same world | Your Name |
| Hidden Heritage | Secretly of a powerful bloodline or house | |
| Inheritance | Receives the legacy of a vanished master, order or civilization | |
| Pact | Bound by contract to a being, with terms both ways | |
| Amnesia | Wakes with no memory, and the past is dangerous | |
| World Transformation | The world changes around the protagonist (gates, a System, the apocalypse) | |
| Exile | Cast out of rank, family or homeland, with something to prove | |

Stacked examples from the Play Menu: Reverend Insanity (Transreincarnation + Rebirth + Power Ability); Against the Gods (Transanimation + Power Ability + Entity of Power).

### 11. Arc Shape

An Arc is a change in who the protagonist is, shown on a declared Probe Set with Competence held fixed. A gain in power, level or rank is a Development, not an Arc. Each pick names the Core component it changes; its direction exists only relative to a declared evaluator (moral improvement, efficacy, freedom, faith).

| Option | In one line | Component |
|---|---|---|
| Growth | Becomes better by the declared evaluator | Axiological or Dispositional |
| Fall / Corruption | Becomes worse by that evaluator | Axiological |
| Disillusionment | Learns the world is not what they believed | Epistemic |
| Awakening | Learns the truth about themselves | Epistemic |
| Hardening | Becomes colder, more effective, less restrained | Restrictive and Dispositional |
| Redemption | From a fallen state toward a recovered one | Axiological and Deontic |
| Synthesis | Two selves or two loyalties become one | Compound |
| Conversion | Values replaced wholesale, and suddenly | Axiological |
| Steadfast | The Core holds under pressure; the world changes instead | No Arc; Probes show the old self retained |
| Development only | Power, rank or skill climb with the Core fixed | No Arc (the LitRPG and cultivation default unless an Arc is also declared) |
| Ensemble arcs | Several Principals, each with a declared Arc | Per Agent |

An Arc pick offers the **DUAL** Regime: the Arc coupled to an External Strand, its onset following a Failure or Believed Blockade there within a declared window.

### 12. Character Archetypes

Each pick seeds an Agent. An archetype is not a Card: every pick still gets a Want on a Condition, a Line, a Price fixed before Chapter 1, and a Voice that could not be swapped with another's.

| Option | In one line |
|---|---|
| Tsundere | Prickly outside, fond underneath, and denies it |
| Kuudere | Cool, flat and controlled; warmth in actions, rarely words |
| Dandere | Shy and quiet, opening slowly to the right person |
| Yandere | Devoted to the point of danger |
| Deredere | Openly warm, affectionate and cheerful |
| Genki | Boundless energy and enthusiasm |
| Ojou-sama | Refined, wealthy, proud |
| Himedere | Expects to be treated as a princess |
| Kamidere | Arrogant to the point of a god complex |
| Mayadere | An enemy who turns, often for one person |
| Onee-san / Big Sister | Teasing, protective, a step ahead |
| Childhood Friend | Shared history, and assumptions about it |
| Nerd | Deep in a subject, awkward outside it |
| Grizzled Veteran | Seen too much, says too little, still competent |
| Obsessive | Fixed on one goal, person or idea past reason |
| Mentor | Teaches, tests, and sometimes withholds |
| Hero | Brave, principled, drawn toward the right thing |
| Trickster | Chaos, jokes and schemes; rules are suggestions |
| Guardian | Protects someone or something above all |
| Rival | Matches the protagonist, and pushes |
| Antihero | Gets results without the virtues |
| Femme or Homme Fatale | Alluring, and dangerous for it |
| Chessmaster | Plans within plans |
| Mad Scientist | Brilliant, unethical, delighted |
| Loyal Knight / Retainer | Sworn service, and the strain of it |
| Fallen Noble | Lost rank, kept pride |
| Gentle Giant | Huge, strong, kind |
| Stoic Mercenary | Paid and unsentimental, until they are not |
| Cynic | Expects the worst; is often right |
| Innocent | Earnest and trusting in a world that is neither |
| Byronic Hero | Brooding, gifted, self-destructive |
| Schemer / Social Climber | Wants up, and measures everyone by use |

### 13. Antagonism

The core conflict is declared as Goal pairs and their Conflict Classes (Infeasible, Incompatible, Contended, Reliability Shortfall, Strategic, Selection-Dependent, Harmonious), never as a premise sentence. Each pick names the class it usually produces.

| Option | In one line | Usual class |
|---|---|---|
| Rival | Wants what the protagonist wants | Contended |
| Nemesis | Their goal and the protagonist's cannot both hold | Incompatible |
| Institution | A church, court, law or company in the way | Incompatible, through the institution's Card |
| Society | Custom, rank and the crowd | Incompatible or Contended |
| Mirror | The protagonist's shadow: the same nature, chosen differently | Incompatible |
| Monster or Nature | A force without a will | A Clock, not a Card |
| Fate or the Gods | A power that cannot be bargained with | Infeasible; prophecy as a Claim |
| Self | The protagonist's own two Goals | Intrapersonal Dilemma |
| Hidden Enemy | An antagonist not yet identified | A Question Obligation; the Knowledge Matrix |
| Friend Turned Enemy | A Harmonious pair that turns | Logged in Relations when it turns |
| Allies at Cross-Purposes | No villain; allies whose choices keep the shared aim out of reach | Strategic |
| Circumstance | War, famine or plague: pressure without a will | Clocks |

### 14. Romance

A pick here adds romance to the Aims and gives one Agent a Want that involves the protagonist.

| Option | In one line |
|---|---|
| Male | A male romantic interest |
| Female | A female romantic interest |
| None | No romance in the Aims |
| Open, let it emerge | No interest planned; one may arise in drafting |
| Several suitors | More than one interest, and the tension between them |

| Refinement | Options |
|---|---|
| Pace | Slow burn; steady; fast; already established at the start |
| Obstacle | Rank or class; rivalry; duty; secret; enemies to lovers; none |
| On the page | Closed door; fade to black; sensual but non-explicit |

### 15. Cast Breadth

| Option | In one line |
|---|---|
| Solo | One Principal carries the book |
| Duo | Two leads, often two viewpoints |
| Small circle | Three to five Principals |
| Ensemble | A party, crew or company, each with a Card |
| Large political cast | Many houses and factions; a Background roster from the start |
| Generational | The cast turns over across time |

## Course IV · The World (declared, not built)

Ask first whether the Author has a setting. If so, import it, and use this course only for what it leaves open. Each pick below becomes the base setting or a Delta concept, declared by the Author.

### 16. Base Setting

Pick one category, or two for a Trope Fusion.

**Historical**, in rough chronological order: Ancient Egypt; Mesopotamia / Babylon; Achaemenid Persia; Classical Greece; Warring States China; Roman Empire; Three Kingdoms China; Byzantine Empire; Tang Dynasty China; Abbasid Caliphate; Viking Age; Heian Japan; The Crusades; Mongol Empire; Mali Empire; Medieval Europe; Hundred Years' War; Ottoman Empire; Joseon Korea; Inca Empire; Aztec Empire; Renaissance; Sengoku Period Japan; Mughal India; Elizabethan England; Edo Japan; American Colonies; Golden Age of Piracy; French Revolution; Napoleonic Wars; Regency Era; London Season; Zulu Kingdom; Victorian Era; Western / Old West; Meiji Restoration; Industrial Revolution; Belle Époque; Edwardian Era; World War I; Roaring Twenties; Great Depression; World War II; Cold War; Contemporary.

**Sci-Fi:** Space Opera; Space (the frontier itself); Far Future; Galactic Empire; Galactic Federation; Galactic Federation Government; Grimdark Religious Imperium; Militarized Earth vs the Other; Military Sci-Fi; Cyberpunk; Biopunk; Nanopunk; Solarpunk; Steampunk; Dieselpunk; Atompunk; Near Future; Virtual Reality / MMORPG; Mecha / Robots; Mech War; Mecha Academy; First Contact; Humanoid Aliens; Non-Humanoid Aliens; Alien Invasion; Body Snatchers; Collective Assimilation; Clone Species; Human Speciation; Religions Inspired by Ancient Aliens; Colony World; Generation Ship; Terraforming; Space Station / Habitat; Asteroid Belt Frontier; Megastructure / Dyson Sphere; Underwater City; Time Travel; Parallel Worlds; Alternate History; AI Society; Mind Uploading / Digital Afterlife; Post-Singularity; Transhumanist / Posthuman; Uplifted Animals; Mutants; Dying Earth; Dystopian State; Utopia; Fully Automated Luxury Space Communism (post-scarcity under machine administration); Climate Fiction; Science Fantasy; Magic Is Science (the "magic" is a fallen civilization's technology); Gorean (John Norman's Counter-Earth: a barbarian warrior culture under a rigid caste order). The Federation and the Empire family: Federation vs Empire; Federation / Empire Ambassador; Federation / Empire (Bioethics); Dark Federation; Terran Empire (Uplifted); Terran Empire (Human). A Hard Sci-Fi genre raises the Causal Standard in whichever is picked.

**Post-Apocalyptic**, three picks:
- *What ended it:* Nuclear War; Pandemic; Local Plague (Black Death); Zombie Outbreak; Fungal Infection; Climate Collapse; Impact Event; Supervolcano; Endless Winter; Machine Uprising; Alien Occupation; Grid Collapse / Solar Flare / EMP; Resource Exhaustion; Demographic Collapse; Dysgenic Collapse; Bioweapon; Nanotech Plague; Rapture / Divine Judgment; Magical Cataclysm; Cosmic Event; System Apocalypse; Monster Emergence; Mysteriously Empty World; Unknown Cause.
- *How long after:* The Fall; Early Aftermath; Settled Wasteland; New Feudalism; Forgotten Past; Rebuilding.
- *What the aftermath looks like:* Nuclear Wasteland; Retro-Nuclear; Bunker / Vault Society; Road-Warrior Wasteland; Drowned World; Frozen Waste; Overgrown Ruins; Quarantine Zones; Occupied Earth.

**Dark World:** Grimdark; Gothic; Cosmic Horror; Folk Horror; Totalitarian Dystopia; Corporate Dystopia; Surveillance State; Eternal War; Plague City; Vampire-Ruled World; Monster-Ruled World; Occupied Homeland; Slaver Empire; Witch-Hunt Era; Cursed Land; Hell / Underworld; Purgatory; Nightmare Realm; Dead Gods; Sunless World; Prison World; Fallen Empire; Body Horror; Death Game; Monster Hunter's World.

**Trope Fusion:**
- *Established:* Weird West (Western + supernatural); Space Western; Steampunk Western; Gaslamp Fantasy (Victorian + fantasy); Gothic Punk; Science Fantasy; Sword and Planet; Flintlock Fantasy (musket era + magic); Magitech / Arcanepunk; Urban Fantasy Noir; Historical Horror.
- *Composed:* Cyber-Cultivation (cyberpunk + xianxia); Regency Eldritch; Samurai Space Opera; Mecha Shogunate; Wuxia Western; Fae Mafia; Dungeon Bureaucracy; Cozy Apocalypse; Victorian Monster Hunters; Gods in the Boardroom; Pirate Necromancers; Dinosaur Rome; Isekai Kingdom Builder; Death Game Romance.
- Any two picks from different setting categories make a fusion of their own; the Operator names the collision point.

**Fantasy and Magic**, three picks:
- *The kind of world:* Classic Fantasy; Unconventional Fantasy; Epic Fantasy; Sword and Sorcery; Medieval Fantasy; Noble Houses; Magic School; Magical Girl / Boy; Urban Fantasy; Paranormal; Gods Among Men; Angels and Demons; Portal Fantasy; Magical Realism; Political Fantasy; Military Fantasy; Assassin Fantasy; Wuxia / Xianxia World; Fantasy of Manners; Gaslamp Fantasy; Gunpowder Fantasy; Ancient Technology; Dying World; New Weird; Fairytale; Arthurian; Norse Mythology; Greek Mythology; Egyptian Mythology; Celtic Mythology; Appalachian Folklore (Jack Tales); Southern Gothic Folklore; Cajun Folklore.
- *How magic works:* Hard Magic; Soft Magic; Elemental; Mana Pool; Spell Slots (Vancian); Runes and Glyphs; True Names / Words of Power; Ritual Magic; Pact / Contract; Divine Miracles; Blood Magic; Soul Magic; Life Burn; Curses and Hexes; Telepathy; Mind Control; Necromancy; Summoning; Alchemy; Qi Cultivation; Bloodline / Innate; Spirit Bonding; Artifact-Bound; Emotion-Driven; Song and Music; Wild Magic; Magitech.
- *How common it is:* None; Rare (a handful, feared or hunted); Guarded (common but controlled by an order, church or crown); Widespread (everyday magic in trades and homes); Saturated (magic in the air, the water and the laws of nature).

**Environment and Location**, alone or to sharpen another pick:
- *Wild land:* Forest; Jungle; Desert; Tundra or Arctic; Mountains; Steppe or Grassland; Savanna; Swamp or Marsh; Volcanic lands; River delta.
- *Water:* Coast; Islands or Archipelago; Open sea aboard ship; Underwater city; Frozen sea.
- *Below:* Caverns; Underdark; Mines; Catacombs; Sewers.
- *Settled:* Capital city; Port city; Walled town; Village; Frontier town; Slums; Bazaar; Inn or tavern.
- *Seats of power:* Castle; Palace; Manor or estate; Parliament; Temple or monastery; Academy.
- *Confined:* Train; Airship; Prison; Hospital or asylum; Hotel; Lighthouse; Snowbound house; Besieged fort.
- *Conflict:* Battlefield; Front line; Occupied city; Border crossing.
- *Built wonders:* Tower; Labyrinth; Dungeon; Ruins; Floating islands; Sky city; Megacity; Arcology.
- *Space:* Starship; Space station; Colony dome; Asteroid mine; Alien world.
- *Otherworlds:* Faerie realm; Underworld; Heaven; Astral plane; Dream world; Mirror world; Pocket dimension.
- *Everyday modern:* Apartment block; Suburb; Office; School campus; Small town; Farm; Shopping mall.

### 17. Peoples and Creatures

Who lives in the world besides humans. Each pick is a Delta concept.

- *Whole-world premises:* Anthropomorphic / Furry World; SCP World (a secret foundation contains anomalous objects and beings); Omegaverse (people divided into alpha, beta and omega designations with instinctive hierarchies); Affini (towering plant-based aliens who treat humanity with benevolent, controlling care, from the web-fiction setting of that name); Monster-girl World (humans the minority); Uplifted Animals.
- *Dragons and great beasts:* Dragons; Titans / Giants; Monsters; Chimeras / Hybrids; Wyverns; Griffins; Phoenixes; Hydras; Krakens; Kaiju; Sphinxes.
- *Elder races:* Elves; Dwarves; Orcs; Goblins; Kobolds; Trolls; Ogres; Halflings; Gnomes; Dark Elves.
- *Fey and nature:* Fairies; Elementals; Changelings; Dryads / Nymphs; Satyrs / Fauns; Selkies; Treants; Will-o'-the-wisps.
- *Beastfolk and hybrids:* Beastfolk / Beastkin; Nekomimi / Catfolk; Dog People / Inumimi; Centaurs; Minotaurs; Harpies; Merfolk / Sirens; Naga; Lamia; Arachne / Drider; Lizardfolk; Bunnyfolk; Foxfolk; Werewolves / Lycanthropes; Gorgons.
- *Eastern folklore:* Spirits / Yokai; Kitsune; Tsukumogami (possessed objects); Oni; Tengu; Kappa; Jiangshi; Gumiho; Djinn.
- *Undead and night:* Undead; Wendigo; Skinwalkers; Vampires; Dhampirs; Liches; Ghouls; Banshees; Dullahan; Revenants.
- *Divine and infernal:* Gods; Angels / Celestials; Demons / Devils; Succubi / Incubi; Nephilim; Tieflings; Fallen Angels; Psychopomps.
- *Shapes and imitations:* Shapeshifters; Mimics; Doppelgangers; Slimes; Living Dolls / Puppets; Body-snatchers; Skin-thieves.
- *Made beings:* Golems / Constructs; Homunculi; Clones / Duplicates; Androids / AI / Robots; Cyborgs; Automatons; Bio-engineered soldiers; Digital ghosts (uploaded minds).
- *Many-as-one and the alien:* Hiveminds / Swarms; Collectives; Insect Swarms; Eldritch / Abyssal Beings; Symbiotic Parasites; Extraterrestrials; Fungal networks; Living planets.

### 18. Social Order, Faith and Politics

These become Lore extracts and faction Cards. Under the Claim Layer, prophecy, scripture and revelation are recorded as Claims, so the Manifest decides separately whether the gods are real and whether the prophecy is true. Depiction is not endorsement.

- *How people are ranked:* Caste; Feudal Estates; Class Society; Clan and Kinship; Slave Society; Meritocracy by Examination; Martial Hierarchy; Magical Aristocracy; Sect and School; Guild Society; Age Hierarchy; Matriarchy; Patriarchy; Species Hierarchy; Egalitarian Commune.
- *Who rules:* Absolute Monarchy; Constitutional Monarchy; Elective Monarchy; Empire; Aristocratic Council; Merchant Republic; City-State; Theocracy; Magocracy; Stratocracy / Military Junta; Technocracy; Corporatocracy; Oligarchy; Democracy; Confederation; Tribal Confederacy; Shadow Government; Machine Rule; Anarchy.
- *How faith is organized:* Monotheism; Pantheon; Dualism; Animism; Shamanism; Ancestor Veneration; State Religion; Competing Faiths; Syncretism; Mystery Cults; Gnostic Faith; Mysticism; Gods Walk the Earth; Absent or Dead Gods; Philosophical Faith; Machine Cult / AI Worship; Eldritch Cult; Secular World.
- *Real traditions to draw on:* Christianity; Catholicism; Protestantism; Orthodox Christianity; Islam; Judaism; Hinduism; Buddhism; Sikhism; Jainism; Shinto; Taoism; Confucianism; Zoroastrianism; Norse; Greco-Roman; Egyptian; Mesoamerican; Celtic; Slavic; Paganism; Wicca; Vodou / Hoodoo; Santería; Yoruba and the Orisha; Technopuritanism (a Christian movement holding that God exists in the future, to be built); Agnosticism; Atheism / Secular Humanism.
- *What faith causes:* Prophecy; The Chosen One; False Messiah; Charismatic Cult; Fundamentalism; Heresy and Inquisition; Apostasy; Holy War; Schism; Crisis of Faith; Miracles; Church Politics; Martyrdom and Sainthood; Relics; Pilgrimage; Judgment and Afterlife; Apotheosis; Deicide; Persecution.
- *Ideologies in play:* Monarchism / Legitimism; Traditionalism; Conservatism; Liberalism; Libertarianism; Socialism; Communism; Anarchism; Nationalism; Imperialism; Fascism; Authoritarianism; Theocratic Rule; Technocracy; Populism; Environmentalism; Transhumanism; Isolationism; Separatism; Accelerationism.
- *The political situation:* Succession Crisis; Civil War; Revolution; Coup; Election; Rebellion; Cold War; Occupation; Colonial Frontier; Secession; Regency; Conspiracy; Assassination Aftermath; Trade War; Peace Treaty; War of Partition.
- *Character political temperaments,* each material for a Card and a Voice (labels kept as the Play Menu gives them): Woke / Progressive; Tumblerina; Blue Sky Head; Nationalist; Speciesist / Racist; Sons of Man Supremacist; Transhumanist; Pronatalist; Rationalist / Effective Altruist; Far-Right; 4chan /pol/; 4chan /b/; Nazi; Far-Left; Militant Feminist; Religious Zealot; Anarchist; Eco-Extremist; Corporate Capitalist; Communist / Socialist; Primitivist; Nihilist; Pragmatist / Realist; Disillusioned 90s Liberal; Libertarian-Adjacent; Moderate Centrist; Heterodox Contrarian; Apolitical Normie.

### 19. Progression Mechanics

For LitRPG, cultivation and game-world novels. In a novel these are rules of the Substrate and conventions of the page, not a resolution system: outcomes still come from Cards, Competence and the setting under pre-commitment (`scriptorium-drafting`), and a real draw is used only where the Manifest declares chance for genuinely uncertain contests.

| Option | What it sets |
|---|---|
| The System / Status Screen | A System extract; status blocks on the page; System messages as a Stated exposition Mode |
| Classes and Skill Trees | Competence structure; Developments logged as such |
| Cultivation Realms | Realm thresholds; breakthroughs as Clocks |
| Tower or Dungeon Climbing | Part and chapter structure by floor |
| Dungeon Core | The protagonist is the dungeon; domain Conditions |
| Quests and Achievements | Promise Obligations issued by the System |
| Relationship Meters | Shown on the page, or tracked only in the Record |
| Reputation and Factions | Faction Clocks |
| Survival Resources | Graded Conditions with Bands |
| Sanity and Stress | A personal Clock |
| Inventory and Crafting | Competence and equipment in the Card |
| Domain or Kingdom Management | Population, treasury and armies as Graded Conditions; seasonal Clocks |
| Economy and Trade | Prices and markets as Lore |
| Mass Battles | Battles resolved as armies, at the scale of the Strand |
| Time Loop | A reset rule in the Substrate; the Chronology keeps every loop |
| Death and Return | A reset rule; what carries over, declared |
| Permadeath | Death is final for every Agent, the protagonist included |
| Hidden Stats | Tracked in the Record, never shown on the page |
| Random Rewards (Gacha) | Rolled rewards; real draws, declared as such |
| Numbers on the page | Visible figures throughout, or figures kept in the Record only |

## Course V · Questions and Bounds

### 20. Thematic Questions

A question the novel keeps asking, ranked among the Aims and used to choose Probe contexts. A question, not an answer: the Manifest fixes no answer in advance unless the Author declares a Controlling Idea, which is otherwise named at the last Part Review.

What power costs, and who pays; whether a person can remake themselves; loyalty or ambition; order or justice; faith and doubt; freedom and security; love and duty; memory and truth; what outlives us; survival and decency; belonging and exile; what revenge leaves; identity across bodies, lives or worlds; progress and its price; the individual and the state.

### 21. Content Bounds

How much of the darkness is on the page. Tone is not intensity, and these are set separately.

| Dimension | Options |
|---|---|
| Violence | Off the page; brief and unflinching; graphic |
| Atrocity (massacre, torture, slavery) | Referenced; depicted without endorsement; central |
| Body horror | None; restrained; graphic |
| Intimacy | Closed door; fade to black; sensual but non-explicit |
| Language | Clean; period oaths; coarse |

Held whatever the picks: minors are never sexualized, and abuse in a character's past may be referenced as backstory but is never depicted sexually. A combination that needs what the Operator declines fails Validation now.

### 22. Shelf and Comparables

Optional. The Author may name a shelf and up to three books the novel stands beside. They inform the Reader and the Aims only. The Touchstone is written fresh, and no living author's text is imitated or reproduced.

Shelves: Grimdark fantasy; Progression fantasy; Romantasy; Cozy fantasy; Epic fantasy; Political fantasy; Space opera; Military science fiction; Literary historical; Historical adventure; Cultivation web novel; Isekai light novel; Gothic horror; Cosmic horror; Thriller; Mystery.

## Recording the picks

Readback the picks with the Declaration, then write them into the Manifest under the Intent as a `## Menu Picks` section. Record one line per pick, with its mark and the field it set:

```markdown
## Menu Picks
- Genre: Political Thriller + Low Fantasy (U) · base genre; Genre Regime Soft
- Base Setting: Hundred Years' War (U) · base setting
- Tone: Grim, with dry wit (U, drawn: Tool Draw) · Touchstone; Kernel
- Ending: Triumph (U) · Author Objective; TRIUMPH Regime (Hard)
- Reader's Stance: Free to root against (U) · Reader; Anti-aim; Kernel line
```

Unpicked categories are not listed; the Manifest's own fields carry their `E` and `I` marks. A pick changed after ratification is an amendment, classed under the Manifest's Amendment Rule like any other change.

## A first serving, for shape

> Three picks to start. Answer with numbers, names, several at once, or "roll".
>
> **Genre:** 1 Political Thriller · 2 High Fantasy · 3 Cultivation · 4 Horror · 5 Romance · 6 Revenge. Thirty-four more are available.

Once the Author picks, the setting category and tone follow, five or six options each, suited to that pick.

## Provenance

Carried from the Play Menu v1.1 (Operative Mode Framework, Draft 0.4), recast where a novel needs it: Genre (from Story Types), Tone and Atmosphere, Character Archetypes, Romance, Protagonist (from Role and Profession and from Story Hooks), Base Setting (the Historical, Sci-Fi, Post-Apocalyptic, Dark World, Trope Fusion, Fantasy and Magic, and Environment categories), Peoples and Creatures, Social Order, Faith and Politics (from Social Structure, Religions, and Politics and Ideology), and Progression Mechanics (from Story Mechanics). The Play Menu's cited sources apply to the lists carried from it.

New for the Scriptorium: Form and Scale, Ending, the Reader's Stance, Narration, Prose Register, Structure and Pacing, Exposition and Secrets, Arc Shape, Antagonism, Cast Breadth, Thematic Questions, Content Bounds, and Shelf and Comparables. Added to carried lists: Court Intrigue, Literary, Family Saga / Chronicle, Picaresque, Gothic Romance and Romantasy (Genre); Hundred Years' War (Historical); War of Partition (political situation).

Dropped from the Play Menu because a novel has no Player: the Player's Seat and Interaction Basis, the Resolution Protocol, Transparency levels, Oracle Play, and Social Combat.