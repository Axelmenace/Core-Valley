/* Ficcraft: “The Drowned Marches”, a sample realm that shows how the pieces fit.
   Built as an ordinary archive, so loading it is just an import. */
(function () {
  'use strict';
  const FC = window.FC;
  const U = FC.U;

  function sampleRealm() {
    const DAY = 86400000;
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const at = (daysAgo, hour, min) => base.getTime() - daysAgo * DAY + (hour * 60 + (min || 0)) * 60000;

    const rid = U.uid();
    const realm = {
      id: rid,
      name: 'The Drowned Marches',
      premise: 'A coast where the sea climbs a little higher every year. Those who can bargain with the tide hold it back, and the sea takes a memory in payment.',
      sigil: 's-wave',
      created: at(35, 20),
      sample: true,
    };

    const codex = [
      ['Tidebinding', 'magic', ['binding', 'tide-binding'], 'Bargaining with the sea. A binder asks the tide to hold for one turning, and the sea takes a memory in payment.',
        'A binder lays both hands on the wall stones at the turn of the tide and names a limit: *this high and no higher*. If the sea accepts, the water stops at the line for one turning, about twelve hours.\n\nThe price is a memory, and **the sea chooses which**. It takes the memory the binder values least on that day, which is a mercy early in a career and a catastrophe late in one.\n\n- A binding protects a line, never a person.\n- It cannot be paid in advance or stored.\n- Binders who try to steer the choice lose two memories instead of one.\n\nSee [[The Salt Synod]], who keep count, and [[The Ledger of Tides]].'],
      ['The Salt Synod', 'faction', ['Synod', 'salt-priests'], 'Priest-auditors who keep the Ledger of Tides and decide whose walls are bound, and by whom.',
        'Began as clerks to the binders’ guild; became a priesthood because it held the only records. Wears undyed wool and salt-white cords.\n\nOwns the right to **draw the line**: the chalk-and-salt mark that decides what a binding protects. Everything seaward of the line belongs to the sea.\n\nTells the story of [[Old Vessa]] at every ordination.'],
      ['Maren Coldwater', 'character', ['Maren'], 'A tidebinder of Gullmark who has given away so much of herself that she keeps a diary to know who she is.',
        'Forty-one. Has bound the Gullmark wall more times than anyone living. Precise, dry, kind in ways she doesn’t notice.\n\nShe no longer remembers her mother’s face, the house she grew up in, or why she became a binder. She reads her own entries in [[The Ledger of Tides]] the way other people read a biography.'],
      ['Gullmark', 'place', ['the Mark'], 'The last walled harbour town of the Marches. Half its streets now lie below the high-water line.',
        'An upper town of slate and Synod stone, and a lower town that floods twice a day. Lower-town families move their furniture upstairs at every flood and down again at every ebb.\n\nThe great wall is bound every turning. Its line was redrawn eleven years ago, and three streets were left outside it.'],
      ['The Ledger of Tides', 'artifact', ['the Ledger', 'Ledger'], 'The Synod’s record of every bargain struck with the sea, and of what each binder paid.',
        'Kept in the Synod house in Gullmark, one volume per year, chained to its lectern. Each entry: date, tide height, binder, and the memory taken *as the binder reports it afterwards*.\n\nRumoured to have a second book.'],
      ['The Drowning of Old Vessa', 'event', ['Old Vessa', 'the Drowning', 'Vessa'], 'Two hundred years ago a city refused the Synod’s terms. The sea took all of it in a single night.',
        'The Synod’s founding cautionary tale. The official version: Vessa’s binders tried to work without a Ledger, and the sea, unpaid, collected everything at once.\n\nThe ruins are visible at the lowest spring tides, three miles out.'],
    ].map(([name, kind, aliases, summary, body], i) => ({
      id: U.uid(), realmId: rid, name, kind, aliases, summary, body, created: at(34 - i, 21), updated: at(20 - i, 21),
    }));

    const threads = [];
    const entries = [];
    function thread(t, list) {
      const id = U.uid();
      const th = Object.assign({ id, realmId: rid, tags: [], distillation: '', parentId: null, parentEntryId: null }, t);
      let seq = 0;
      const ids = [];
      for (const row of list) {
        const [type, body, d, h, m, extra] = row;
        const e = Object.assign({ id: U.uid(), threadId: id, seq: ++seq, type, body, created: at(d, h, m) }, extra || {});
        entries.push(e);
        ids.push(e.id);
      }
      const times = entries.filter((e) => e.threadId === id).map((e) => e.created);
      th.created = Math.min(...times);
      th.updated = Math.max(...times);
      if (th.distillation) th.distilled = th.updated;
      threads.push(th);
      return { id, ids };
    }

    const main = thread(
      {
        title: 'What does the sea take?',
        status: 'burning',
        tags: ['magic', 'core'],
        distillation:
          '**Tidebinding is a bargain, not a power.** A binder holds back one turning of the tide; the sea takes one memory in payment, and the sea chooses which.\n\n- A binding protects a *line*, never a person. Whoever draws the line decides who is saved.\n- The sea takes the least-valued memory first, so the cost compounds over a career.\n- [[The Salt Synod]] records every bargain in [[The Ledger of Tides]], which may be the only place a binder’s lost life survives.\n\nStill open: is the Ledger honest? (The second book.)',
      },
      [
        ['waypoint', 'The first idea', 34, 21, 2],
        ['musing', 'Started from an image: a woman at a sea wall at night, talking to the water the way you’d talk to a creditor. The tide stops at her feet. She walks home and can’t remember her mother’s face.', 34, 21, 4],
        ['whatif', 'What if [[Tidebinding]] is a *bargain* rather than a power? The sea isn’t commanded. It’s negotiated with, and it always collects.', 34, 21, 15],
        ['riddle', 'What does the sea want with memories? Does it want anything at all, or is “want” the wrong word?', 34, 21, 31],
        ['musing', 'I like that it can’t be stockpiled. You can’t pay in advance. Every high tide is a fresh negotiation, which means every high tide is a scene.', 34, 22, 2],
        ['lore', 'Real-world anchor: the Dutch *waterschappen*, water boards that are among the oldest democratic bodies in Europe, because everyone behind a dike shares one fate. A binders’ guild could work the same way: shared walls, shared debt.', 34, 22, 20],
        ['canon', 'A binding holds the tide for one turning, about twelve hours. Nothing longer has ever worked.', 34, 22, 41],
        ['waypoint', 'The cost', 29, 19, 30],
        ['whatif', 'What if the sea takes the memory the binder values *least*? A mercy at first. Then the binder runs out of unimportant memories.', 29, 19, 34],
        ['musing', 'That’s the engine. Early bindings are cheap: a song you half knew, the name of a neighbour’s dog. A veteran binder is paying with the core of themselves.', 29, 19, 50],
        ['riddle', 'Can a binder choose which memory goes?', 29, 20, 5, { resolved: at(27, 20) }],
        ['canon', 'No. The binder offers; the sea chooses. Binders who try to steer the choice lose two memories instead of one.', 27, 20, 0],
        ['fragment', 'Maren set her palms flat against the wall stones and felt the cold come up through them. “High water,” she said, “and not a hand higher.”\n\nThe sea leaned on the wall like a drunk against a door. Then it eased. Somewhere behind her eyes a small room went dark: a kitchen, she thought, and a blue cup. She did not know whose.', 27, 20, 25, { ribbon: true }],
        ['oracle', 'Describe this from the point of view of someone who hates it.', 27, 21, 10, { oracle: 'craft' }],
        ['musing', 'A fisherman’s widow. The binders saved the town and let her husband’s boat founder, because the boat was outside the wall. Bindings protect places, not people. Whoever draws the wall’s line decides who is worth saving.', 27, 21, 18],
        ['canon', 'A binding protects a line, never a person. Whatever lies seaward of the line belongs to the sea.', 27, 21, 40],
        ['whatif', 'What if the line is literally drawn, in chalk and salt, and [[The Salt Synod]] owns the right to draw it?', 27, 21, 52],
        ['waypoint', 'Who keeps count', 20, 20, 0],
        ['musing', 'Somebody has to know who has paid what, or binders get used up unevenly. Enter the Synod and [[The Ledger of Tides]].', 20, 20, 3],
        ['canon', 'The Synod keeps the Ledger. Every binding is entered: date, tide height, binder, and the memory taken as the binder reports it afterwards, if they can.', 20, 20, 25],
        ['riddle', 'If a binder can’t remember what they lost, how do they report it? Do their families fill in the Ledger for them?', 20, 20, 47],
        ['whatif', 'What if the Ledger is the only place a binder’s lost memories still exist? Old binders come to the Synod house to read about their own lives.', 13, 21, 0],
        ['musing', 'That’s the heart of the book: [[Maren Coldwater]] reading her own entries like a stranger’s biography.', 13, 21, 9, { ribbon: true }],
        ['riddle', 'Who is allowed to read the Ledger, and what does the Synod do with everything it knows?', 13, 21, 30],
        ['lore', 'Byzantine logothetes; the English exchequer’s pipe rolls. An accounting office that becomes a priesthood because it holds the only records.', 13, 21, 44],
        ['canon', '[[Old Vessa]] refused the Synod’s terms and tried to bind without a Ledger. The sea took the city in one night. The Synod has told the story at every ordination since.', 13, 22, 5],
        ['riddle', 'Is the Vessa story true, or is it Synod propaganda?', 13, 22, 12],
        ['musing', 'Leaving that open for now. But I want the reader to suspect the Synod well before the characters do.', 6, 20, 15],
        ['oracle', 'Who keeps the records, and what do they leave out?', 6, 20, 22, { oracle: 'power' }],
        ['musing', 'They leave out the bindings that failed. The Ledger only records bargains the sea accepted. The failures, the drownings, go into a second book that nobody is shown.', 6, 20, 30],
        ['whatif', 'What if Maren finds the second book?', 2, 22, 40],
      ]
    );

    const branch = thread(
      {
        title: 'What if the debt is inherited?',
        status: 'kindling',
        tags: ['magic'],
        parentId: main.id,
        parentEntryId: main.ids[9],
      },
      [
        ['musing', '> That’s the engine. Early bindings are cheap… A veteran binder is paying with the core of themselves.\n\nBranching this off. If a binder dies still owing the sea, does the debt pass on?', 26, 21, 0],
        ['whatif', 'What if the children of binders are born with gaps, memories missing *in advance* of anything they’ve lived?', 26, 21, 12],
        ['riddle', 'Is that too dark? Or is it the reason binder families only marry each other?', 26, 21, 30],
        ['musing', 'If it’s true, the Synod would track bloodlines. Genealogy as theology. That ties straight back to [[The Ledger of Tides]].', 25, 22, 0],
      ]
    );
    void branch;

    thread(
      { title: 'Gullmark at low tide', status: 'spark', tags: ['setting'] },
      [
        ['fragment', 'At low water [[Gullmark]] smells of rope and iodine and something sweet underneath: [[Saltgrass]] rotting in the drowned lanes. Children run the lower streets at the ebb, collecting what the night left behind. A shoe, a key, once a whole chair, perfectly dry.', 9, 19, 0],
        ['musing', 'Two towns in one. The dry upper town with the Synod house, and the tidal lower town where people still live, carrying their furniture upstairs twice a day.', 9, 19, 20],
        ['riddle', 'Why haven’t the lower-town families left? What keeps them there?', 9, 19, 35],
      ]
    );

    thread(
      { title: 'A schism in the Synod', status: 'kindling', tags: ['factions'] },
      [
        ['musing', '[[The Salt Synod]] can’t be all of one mind. There should be a faction that thinks binding itself is the sin, that the sea should be allowed to win.', 16, 20, 0],
        ['whatif', 'What if that faction, the Yielders, is the one telling the truth about [[Old Vessa]]?', 16, 20, 10],
        ['riddle', 'What do the Yielders actually want: an orderly retreat inland, or something closer to a death cult?', 16, 20, 25],
        ['musing', 'Orderly retreat is more interesting. They’re the realists of this world, and everyone hates them for it.', 15, 21, 0],
        ['lore', '[[The Breakwater Guild]] could be paying for the binders out of pure commerce: the harbour is worth more than the people in it.', 15, 21, 20],
      ]
    );

    thread(
      { title: 'Maren keeps a diary', status: 'banked', tags: ['character'] },
      [
        ['musing', '[[Maren Coldwater]] writes down everything she does each day, because she doesn’t trust what the tide will leave her. Could the diary carry half the book’s point of view?', 22, 21, 0],
        ['musing', 'Banking this. A diary frame could be a gimmick; revisit once the plot is clearer.', 22, 21, 30],
      ]
    );

    thread(
      { title: 'Ending: does the sea win?', status: 'spark', tags: ['plot'] },
      [
        ['whatif', 'What if the ending is the town choosing to leave, and the last binding is Maren holding the tide just long enough for the evacuation, knowing it will take everything she has left?', 4, 21, 0],
        ['riddle', 'Is that ending earned if the Synod is the villain? Or does the sea need to be the antagonist after all?', 4, 21, 15],
      ]
    );

    return { format: 'ficcraft-archive', version: 1, exportedAt: new Date().toISOString(), realms: [realm], threads, entries, codex };
  }

  FC.sampleRealm = sampleRealm;
})();
