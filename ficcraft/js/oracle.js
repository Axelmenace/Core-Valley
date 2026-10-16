/* Ficcraft: the Oracle, a deck of questions for when the page goes quiet.
   The deck favours second-order questions: cost, who pays, who is left out,
   how a thing looks from below, and how it changed over time. */
(function () {
  'use strict';
  const FC = window.FC;

  const CATS = [
    { id: 'magic', label: 'Magic & the Uncanny' },
    { id: 'peoples', label: 'Peoples & Customs' },
    { id: 'power', label: 'Power & Politics' },
    { id: 'faith', label: 'Faith & Cosmos' },
    { id: 'land', label: 'Land, Sea & Sky' },
    { id: 'history', label: 'History & Memory' },
    { id: 'trade', label: 'Trade & Daily Life' },
    { id: 'character', label: 'Characters & Desire' },
    { id: 'story', label: 'Conflict & Story' },
    { id: 'craft', label: 'Craft & Method' },
  ];

  const DECK = {
    magic: [
      'What does this magic cost, and who actually pays it: the one who casts it, or someone downstream?',
      'What can magic not do here, even in principle? What do people wish it could?',
      'Who discovered it first, and what did they get wrong that everyone still believes?',
      'How does magic show up in a farmer’s ordinary week, far from any battle?',
      'What does magic smell, sound or feel like to someone standing nearby?',
      'Who is forbidden to use it, and how is that rule enforced?',
      'What happens when a working fails halfway through?',
      'What would a sceptic in this world say about magic, and in what way are they right?',
      'Which trade has magic made obsolete? Who lost their living, and what did they do next?',
      'Is there a black market for magic? What is sold there that cannot be sold openly?',
      'What does magic leave behind: residue, scars, debt, silence?',
      'How do children first learn they have the gift, or that they never will?',
      'Which natural law does your magic quietly break, and what knock-on effect has nobody in the world noticed yet?',
      'If one practitioner taught the secret to one stranger today, what would change within a generation?',
      'What is the most boring, practical use of magic, the one everyone takes for granted?',
    ],
    peoples: [
      'What do these people find disgusting that their neighbours find delicious?',
      'How do they greet a stranger, and what does getting the greeting wrong signal?',
      'What do they do with their dead, and what does that say about what they fear?',
      'What counts as a polite lie here?',
      'What do parents tell children to keep them from danger, and what is the danger really?',
      'Which holiday has forgotten what it was for?',
      'What do they call themselves, and what do outsiders call them?',
      'What is the most common insult, and what does it reveal about what they value?',
      'Who does the hardest physical work, and how are those people regarded?',
      'What would an outsider mistake for hostility that is really hospitality?',
      'What song does everyone know and nobody admits to liking?',
      'What feeling do they have a word for that your own language lacks?',
      'How does a person here become an adult? Is there a moment, a test, a price?',
      'Who is allowed to marry whom, and who quietly ignores the rule?',
    ],
    power: [
      'Who actually holds power, as distinct from who appears to?',
      'What happens on the morning after the ruler dies without warning?',
      'What does the state tax, and what does that tell you about what it can see?',
      'Who keeps the records, and what do they leave out?',
      'Which law is broken by everyone and enforced only when convenient?',
      'Which faction would gain most from your protagonist’s failure?',
      'How does news travel, and how long does it take to cross the realm?',
      'What does a common person owe their lord, and what is owed in return?',
      'Who was on the losing side of the last succession, and where are they now?',
      'What single compromise keeps the peace, and who resents it?',
      'What does treason look like here, and how is it punished?',
      'Where does the army’s food come from, and who goes hungry so it can eat?',
      'What can a ruler not do, by custom, even with all the soldiers in the world?',
      'Who is the most powerful person nobody has heard of?',
    ],
    faith: [
      'What do the priests know that the faithful don’t?',
      'What question does the faith refuse to answer?',
      'Is any of it true? Decide privately, even if you never tell the reader.',
      'Which heresy is gaining followers, and why now?',
      'What does a prayer consist of: words, gestures, offerings, silence?',
      'Who is turned away from the temples, and where do they worship instead?',
      'What does the faith say happens to the wicked, and do the wicked believe it?',
      'Which sacred object was lost, and who claims to have it?',
      'How does the faith explain suffering, and does the explanation comfort anyone?',
      'Which ritual began as something purely practical?',
      'What does the faith ask of an ordinary believer on an ordinary day?',
      'How do the gods (or the faithful’s idea of them) change when times are hard?',
    ],
    land: [
      'Where does the fresh water come from, and who controls it?',
      'What do the seasons do to travel, trade and war?',
      'What is the most dangerous place within a day’s walk of the capital?',
      'What grows here and nowhere else, and who profits from it?',
      'Which border is a river, which is a mountain, and which is a lie?',
      'What does the land look like where the maps stop being accurate?',
      'Which natural disaster do people still tell stories about?',
      'What does the night sky look like, and what do people steer by?',
      'Which road is everyone afraid of, and why do people still take it?',
      'What would a traveller notice first about the air, the light, the soil?',
      'Where do people go to be alone, and what do they find there?',
      'What has the land been changed into by people, and what did it used to be?',
    ],
    history: [
      'What happened three hundred years before your story that everyone remembers slightly wrong?',
      'Which ruin is everyone sure they understand?',
      'Which event do both sides commemorate, each with the opposite meaning?',
      'Who wrote the histories, and what were they paid to say?',
      'Which art or technique was lost, and is anyone searching for it?',
      'What did the previous age believe was its greatest achievement?',
      'What is the oldest thing still in daily use?',
      'Which war ended without a winner, and who is still fighting it quietly?',
      'What would a historian of your world get angry about after a few drinks?',
      'Which founding myth would embarrass its heroes if the truth came out?',
      'What is remembered as a golden age, and who was suffering during it?',
      'Which name has been scratched out of the records, and why?',
    ],
    trade: [
      'What does a loaf of bread cost, and what does that mean for a day labourer?',
      'What is the money made of, and who can mint it or forge it?',
      'What does an ordinary breakfast look like here?',
      'What is the most valuable trade good, and who carries it?',
      'Which profession is respected but poor? Which is despised but rich?',
      'What does a typical home smell like?',
      'How do people tell the time without a clock?',
      'What do people do for fun after dark?',
      'What would a merchant risk their life to obtain?',
      'What is scarce here that is common elsewhere, and how has that shaped manners?',
      'Who mends things, and what can’t be mended?',
      'How does someone without land or family survive the winter?',
      'What is the most common way to cheat a customer, and how do the wise avoid it?',
    ],
    character: [
      'What does this character want, and what do they need instead?',
      'What lie does this character believe about themselves?',
      'Who taught them their most useful skill, and what did the lesson cost?',
      'What would they never do, and what would make them do it?',
      'What do they do with their hands when they are nervous?',
      'Who would they betray, and who would they die for? Are those the same person?',
      'What is the worst thing they have done that no one knows about?',
      'What do they hope people will say at their funeral?',
      'What ordinary thing are they unreasonably bad at?',
      'Whose approval do they still crave, though that person is long gone?',
      'What do they believe that the reader will know is wrong?',
      'What is their relationship to money?',
      'What do they want so badly they are ashamed of it?',
      'Who in their life sees them most clearly, and how do they treat that person?',
    ],
    story: [
      'What is the worst thing that could happen to your protagonist right now? Do it, or promise it.',
      'What does the antagonist believe they are saving?',
      'Who wins if nothing changes?',
      'What secret, revealed at the midpoint, would recolour everything before it?',
      'What is the price of victory, and who pays it?',
      'Which two of your characters want the same thing for opposite reasons?',
      'What would a reader expect to happen next? Now: what is the second most interesting option?',
      'Where is the story’s ticking clock?',
      'What would this story be about if the villain were telling it?',
      'What promise did your opening make that the ending must keep?',
      'Which scene are you dreading writing, and why is it the one that matters?',
      'What can your protagonist do at the end that they could not do at the start?',
    ],
    craft: [
      'Write the scene where this idea is first explained, then cut every sentence that explains.',
      'Describe this from the point of view of someone who hates it.',
      'What is the smallest, most specific detail that would make this feel real?',
      'If you cut this idea, what would the story lose? If nothing, why is it here?',
      'What is the cliché version of this idea? Name it, then twist one element.',
      'How would this look to a child? To a scholar? To someone starving?',
      'Which part of this idea are you avoiding thinking about?',
      'Summarise this idea in one sentence a stranger could repeat at a dinner table.',
      'What does this idea share with the rest of your world, and what does it contradict?',
      'Where does this idea touch your protagonist directly?',
      'What would you have to research to write this honestly? Write down three questions.',
      'Read your distillation aloud. Which sentence do you no longer believe?',
    ],
  };

  const KIND_DECK = {
    character: [
      'What does {name} want that they would never say aloud?',
      'What does {name} carry everywhere, and why?',
      'Who in this world would cross the street to avoid {name}?',
      'What was {name} doing ten years before the story begins?',
      'What is {name} wrong about?',
      'What would make {name} laugh despite themselves?',
      'How does {name} speak: clipped, ornate, careful, crude?',
      'What does {name} do on a day when nothing is at stake?',
    ],
    place: [
      'What does {name} sound like at dawn?',
      'Who built {name}, and who lives there now?',
      'What is {name} famous for, and what is it quietly known for?',
      'How would you smuggle something into {name}?',
      'What has {name} lost in the last hundred years?',
      'Who in {name} is hungry tonight?',
      'Where in {name} do people go to say things they shouldn’t?',
    ],
    faction: [
      'What does {name} promise its members, and what does it actually give them?',
      'Who founded {name}, and would they recognise it today?',
      'What is the argument inside {name} that might one day split it?',
      'How does someone leave {name}? Can they?',
      'What does {name} want from your protagonist?',
      'What does {name} call its enemies, and what do its enemies call it?',
      'Who pays for {name}, and what do they expect in return?',
    ],
    magic: [
      'What does {name} cost, and who keeps the ledger?',
      'What is the one thing {name} cannot do?',
      'How was {name} discovered, and who tried to suppress it?',
      'What does {name} look like to someone who cannot use it?',
      'What happens when {name} is used carelessly?',
      'Who profits from {name} without ever practising it?',
      'What everyday word or gesture comes from {name}?',
    ],
    artifact: [
      'Who made {name}, and what did they intend?',
      'Who has owned {name}, and how did each of them lose it?',
      'What does {name} do that its maker never foresaw?',
      'What would happen if {name} were destroyed?',
      'Who is searching for {name} right now?',
      'What does {name} feel like to hold?',
    ],
    creature: [
      'What does {name} eat, and what eats it?',
      'What do the locals call {name}, and what do scholars call it?',
      'Which part of {name} is valuable, and who hunts it?',
      'What superstition surrounds {name}?',
      'What does {name} do when no one is watching?',
      'How has {name} adapted to people, and people to it?',
    ],
    culture: [
      'What does {name} celebrate that outsiders find strange?',
      'How does {name} raise its children?',
      'What did {name} borrow from its neighbours and now claim to have invented?',
      'What do the elders of {name} fear the young are forgetting?',
      'What is the worst insult in the language of {name}?',
      'What does a guest in {name} owe their host?',
    ],
    event: [
      'Who remembers {name} differently, and why?',
      'What would have happened if {name} had gone the other way?',
      'Who profited from {name}?',
      'Which songs or sayings came out of {name}?',
      'What physical evidence of {name} can still be found?',
      'Who was there at {name} and has never told anyone?',
    ],
    concept: [
      'Where does {name} touch ordinary life?',
      'Who disagrees about {name}, and what is at stake for them?',
      'How would you explain {name} to a child in this world?',
      'What is the oldest form of {name}?',
      'Who benefits from people misunderstanding {name}?',
    ],
  };

  const ALL = [];
  for (const c of CATS) for (const q of DECK[c.id]) ALL.push({ cat: c.id, q });

  const bags = new Map();
  function fromBag(key, pool) {
    let bag = bags.get(key);
    if (!bag || !bag.length) {
      bag = pool.map((_, i) => i);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      bags.set(key, bag);
    }
    return pool[bag.pop()];
  }

  function draw(cat) {
    const pool = cat && DECK[cat] ? ALL.filter((c) => c.cat === cat) : ALL;
    const card = fromBag(cat || '*', pool);
    return { cat: card.cat, label: catLabel(card.cat), q: card.q, n: ALL.indexOf(card) + 1, total: ALL.length };
  }

  function interrogate(kind, name) {
    const pool = KIND_DECK[kind] || KIND_DECK.concept;
    const q = fromBag('kind:' + kind, pool);
    return { cat: 'codex', label: (FC.model.KINDS[kind] || FC.model.KINDS.concept).label, q: q.replace(/\{name\}/g, name), n: 0, total: 0 };
  }

  function catLabel(id) {
    const c = CATS.find((x) => x.id === id);
    return c ? c.label : 'The Oracle';
  }

  FC.oracle = { CATS, DECK, KIND_DECK, draw, interrogate, catLabel, size: ALL.length };
})();
