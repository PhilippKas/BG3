import type { StoryChapter, StoryOption, StoryPerson, Tags } from './schema';

/**
 * The Story Path: a branching walk through the character's life before the
 * game begins. Scene text speaks to the player (“you”); narration is the
 * backstory paragraph (third person, “they”). Placeholders in braces are
 * filled from STORY_PEOPLE, `defines` and the character name.
 *
 * Spoiler rule: general Forgotten Realms lore only — nothing from the game's plot.
 */

const opt = (id: string, text: string, narration: string, tags: Tags, extra: Partial<StoryOption> = {}): StoryOption => ({
  id,
  text,
  narration,
  tags,
  ...extra,
});

export const STORY_PEOPLE: StoryPerson[] = [
  { key: 'mentor', role: 'Mentor', names: ['Ardeth Vane', 'Ilsabet Morn', 'Corwin Halloway', 'Yssra Tel', 'Old Bartholomew'] },
  { key: 'rival', role: 'Rival', names: ['Kestrel', 'Dain Voss', 'Mira Blackfen', 'Sorrel', 'Jax Dunmore'] },
  { key: 'sibling', role: 'Sibling', names: ['Elowen', 'Teodor', 'Nessa', 'Bram', 'Lirien'] },
  { key: 'patron', role: 'Patron', names: ['the Velvet Voice', 'the Ashen Notary', 'the Quiet Hunger', 'the Laughing Thorn', 'the Pale Ledger'] },
  { key: 'love', role: 'Beloved', names: ['Ansel', 'Rhosyn', 'Kaito', 'Delphine', 'Wren'] },
  { key: 'friend', role: 'Sworn companion', names: ['Hollis', 'Brindle', 'Tamsin', 'Oric', 'Sabine'] },
  { key: 'beast', role: 'Animal companion', names: ['Ash', 'Moonpaw', 'Grim', 'Quill', 'Ember'] },
  { key: 'captain', role: 'Former captain', names: ['Captain Rourke', 'Captain Ysolde Marr', 'Captain Fennick', 'Captain Haldis'] },
  { key: 'creditor', role: 'Creditor', names: ['Mother Gethra', 'the Vance Syndicate', 'Silk-Hand Oleander', 'Guildmistress Tessaly'] },
];

export const DEFAULT_HERO_NAME = 'the wanderer';

export const STORY: StoryChapter[] = [
  {
    id: 'prologue',
    title: 'Prologue: The Realms, 1492 DR',
    intro:
      'It is the Year of Three Ships Sailing, 1492 by the Dalereckoning. More than a century ago the gods were cast down to walk Faerûn as mortals. Within living memory the Weave of magic tore apart and was mended again. Kingdoms rose and fell, and the Sword Coast endured, as it always does, on trade, ambition and stubbornness. This is the world you were born into.',
    scenes: [
      {
        id: 'homeland',
        weight: 2,
        text: 'Where were you born?',
        options: [
          opt('baldurs-gate', 'Baldur’s Gate: the great port at the mouth of the Chionthar.', '{name} was born in Baldur’s Gate, where every coin changes hands twice before noon and the gulls are the only honest thieves.', { charm: 1, trickster: 1, outcast: 1 }, {
            sets: ['city'],
            defines: { home: 'Baldur’s Gate' },
            lore: 'Baldur’s Gate is the busiest trading port on the Sword Coast, ruled by a council of dukes and kept in rough order by the Flaming Fist mercenary company. Wealth sits in the Upper City; everything else rolls downhill into the Lower City.',
          }),
          opt('waterdeep', 'Waterdeep: the City of Splendours, ruled by masked lords.', '{name} was born in Waterdeep, the City of Splendours, where even the beggars have opinions about politics.', { noble: 1, scholar: 1, arcane: 1 }, {
            sets: ['city'],
            defines: { home: 'Waterdeep' },
            lore: 'Waterdeep is the largest city of the North. Its Masked Lords rule in secret, its guilds rule in public, and its Blackstaff has guarded the city’s magic for generations.',
          }),
          opt('neverwinter', 'Neverwinter: the Jewel of the North, rebuilt from fire.', '{name} was born in Neverwinter, a city that has burned and been rebuilt so often that its people treat disaster as weather.', { order: 1, protector: 1 }, {
            sets: ['city'],
            defines: { home: 'Neverwinter' },
            lore: 'Neverwinter sits by a river warmed by a slumbering volcano. It has survived plague, war and eruption, and its people are fiercely proud of rebuilding every time.',
          }),
          opt('amn', 'Amn: the merchant kingdom where wealth is law.', '{name} was born in Amn, where gold opens every door and unlicensed magic can get you killed.', { noble: 1, trickster: 1, scholar: 1 }, {
            sets: ['city'],
            defines: { home: 'Amn' },
            lore: 'Amn is a wealthy kingdom south of the Sword Coast, governed by a council of merchant princes. Arcane magic there is tightly licensed, and unlicensed spellcasters are hunted.',
          }),
          opt('calimshan', 'Calimshan: desert cities where genies once ruled.', '{name} was born under the hot sky of Calimshan, among bazaars, spice and the long memory of genie lords.', { elemental: 1, innate: 1, trickster: 1 }, {
            sets: ['city'],
            defines: { home: 'Calimshan' },
            lore: 'Calimshan is an ancient desert land of crowded cities and old empires. Genies once ruled it, and their elemental magic still lingers in its bloodlines.',
          }),
          opt('underdark', 'The Underdark: lightless caverns beneath the world.', '{name} was born in the Underdark, in a world without sun, where every shadow is either shelter or threat.', { shadow: 2, outcast: 1 }, {
            sets: ['underdark'],
            defines: { home: 'the Underdark' },
            lore: 'The Underdark is a vast web of caverns beneath Faerûn, home to drow cities, deep gnome enclaves, duergar strongholds and things that have never seen light.',
          }),
          opt('high-forest', 'The High Forest: a wood older than any kingdom.', '{name} was born beneath the canopy of the High Forest, where the trees remember empires that the world has forgotten.', { nature: 2, beast: 1 }, {
            sets: ['wild'],
            defines: { home: 'the High Forest' },
            lore: 'The High Forest is one of the largest and oldest forests in Faerûn. Elves, druids and stranger things dwell within it, and travellers who leave the path rarely come back the same.',
          }),
          opt('astral', 'The Astral Plane: a silver void, among a people raised for war.', '{name} was born on the silver sea of the Astral Plane, among a people for whom war is both faith and trade.', { martial: 2, ascetic: 1, outcast: 1 }, {
            sets: ['astral'],
            defines: { home: 'the Astral Plane' },
            lore: 'The Astral Plane is a timeless silver void between worlds. Fortress-cities drift in it, and the warrior people who live there raid other planes and train their children for battle.',
          }),
          opt('road', 'Nowhere and everywhere: a caravan that never stopped.', '{name} was born on the road, in a caravan that never stayed anywhere long enough to call it home.', { wild: 1, music: 1, charm: 1 }, {
            sets: ['road'],
            defines: { home: 'the open road' },
            lore: 'Caravans cross the Sword Coast along the Trade Way, carrying goods, news and performers between cities. Their people belong everywhere and nowhere.',
          }),
        ],
      },
      {
        id: 'family',
        text: 'What was your family’s place in {home}?',
        options: [
          opt('nobles', 'Old money and an even older name.', 'Their family was old money with an older name, and expected them to carry both without complaint.', { noble: 3 }, { sets: ['noble'], requires: { none: ['wild', 'astral'] } }),
          opt('merchants', 'Merchants and craftsfolk: comfortable, never safe.', 'Their family were merchants and craftsfolk, comfortable but never safe, always one bad season from ruin.', { order: 1, scholar: 1, charm: 1 }, { sets: ['trade'], requires: { none: ['wild', 'astral'] } }),
          opt('nothing', 'We had nothing, and I lost even that early.', 'They had nothing, and soon they had no family either. They learned early that no one was coming to help.', { outcast: 3 }, { sets: ['orphan'] }),
          opt('temple', 'Servants of a temple, raised among prayers.', 'Their family served a temple, and their earliest memories are of incense, candles and hymns.', { divine: 2, order: 1 }, { sets: ['temple'], requires: { none: ['astral'] } }),
          opt('soldiers', 'Soldiers and sellswords, generation after generation.', 'Their family were soldiers, guards and sellswords for as long as anyone could remember.', { martial: 2, protector: 1 }, { sets: ['soldiers'], requires: { none: ['wild', 'astral'] } }),
          opt('wardens', 'Hunters and wardens, living by the old ways.', 'Their family were hunters and wardens who lived by the old ways and trusted the forest more than any town.', { nature: 2, beast: 1, ranged: 1 }, { sets: ['wardens'], requires: { any: ['wild', 'road'] } }),
          opt('house', 'A ruthless house that schemed in the dark.', 'Their family was a ruthless house that schemed in the dark, where a kind word was a weapon and a gift was a threat.', { shadow: 2, noble: 1, trickster: 1 }, { sets: ['noble'], requires: { all: ['underdark'] } }),
          opt('warband', 'A war-band. I held a blade before I could read.', 'They were raised in a war-band and held a blade before they could read.', { martial: 3, order: 1 }, { sets: ['soldiers'], requires: { any: ['astral'] } }),
        ],
      },
      {
        id: 'omen',
        text: 'Something marked your birth. What do the old folk say about it?',
        fate: true,
        options: [
          opt('ordinary', 'Nothing at all. An ordinary child on an ordinary day.', 'By every account they were an ordinary child, born on an ordinary day.', { order: 1, protector: 1 }),
          opt('storm', 'A storm broke the moment I was born.', 'The night they were born, a storm broke out of a clear sky and lightning struck the same tree three times.', { innate: 2, elemental: 2 }, { sets: ['storm-born'] }),
          opt('stranger', 'A stranger came to the door and asked to hold me.', 'A stranger in a grey cloak came to the door the day they were born, asked to hold the baby, and left without giving a name.', { pact: 1, trickster: 1, shadow: 1 }, { sets: ['stranger'] }),
          opt('bells', 'Every temple bell in town rang on its own.', 'When they were born, every temple bell in {home} rang at once, and no bell-ringer would admit to it.', { divine: 2, light: 1 }, { sets: ['blessed'] }),
          opt('beasts', 'Wild animals gathered outside the house.', 'On the night of their birth, wolves, foxes and owls gathered outside in silence until dawn.', { nature: 2, beast: 2 }, { sets: ['beast-touched'] }),
          opt('strange-blood', 'My parent never spoke of the other. Some say their eyes burned like coals.', 'One of their parents never spoke of the other. Those who had met that stranger said their eyes burned like coals and that they cast no shadow.', { innate: 2, pact: 1, outcast: 1 }, { sets: ['strange-blood'], fateOnly: true }),
        ],
      },
    ],
  },
  {
    id: 'childhood',
    title: 'Chapter I: Small Hands',
    intro: 'Every legend was once a child with scraped knees. Before the world knew your name, you were learning who you were.',
    scenes: [
      {
        id: 'days',
        text: 'What did you do with your days as a child?',
        options: [
          opt('street', 'Ran with a gang of street children, stealing what we needed.', 'As a child they ran with a gang of street children, learning which pockets were heavy and which alleys had two exits.', { shadow: 2, outcast: 1, finesse: 1 }, { sets: ['street'], requires: { any: ['city', 'orphan', 'underdark'] } }),
          opt('books', 'Read everything I could find: books, maps, languages.', 'They read everything they could get their hands on: books, maps, ledgers and the margins of other people’s letters.', { scholar: 2, arcane: 1 }, { sets: ['bookish'] }),
          opt('drills', 'Trained with blade and shield until my arms shook.', 'They trained with blade and shield every morning until their arms shook.', { martial: 2, protector: 1 }, { sets: ['trained'] }),
          opt('roaming', 'Roamed the hills and woods, often for days.', 'They roamed the hills and woods for days at a time and came home with burrs in their hair and stories nobody believed.', { nature: 2, wild: 1 }, { sets: ['roamer'] }),
          opt('performing', 'Sang, danced and juggled for coins.', 'They sang, danced and juggled on street corners and stages for coins and applause.', { music: 2, charm: 1 }, { sets: ['performer'] }),
          opt('rites', 'Prayed, fasted and learned the old rites.', 'They spent their days in prayer and fasting, learning the old rites by heart.', { divine: 1, ascetic: 2, order: 1 }, { sets: ['devout'] }),
        ],
      },
      {
        id: 'gang',
        requires: { all: ['street'] },
        text: 'The gang had a leader, {rival}: older, quicker and crueller. What were you to them?',
        options: [
          opt('right-hand', 'Their right hand. I learned to lie with a straight face.', 'They became the right hand of {rival}, the gang’s leader, and learned to lie with a perfectly straight face.', { trickster: 2, charm: 1 }, { sets: ['rival-known'] }),
          opt('rival', 'Their rival. We fought over everything.', '{rival} led the gang, and they fought over everything: territory, loot, and who was really in charge.', { vengeance: 1, brute: 1 }, { sets: ['rival-known'] }),
          opt('shadow', 'Their shadow. I watched, learned and left them behind.', 'They followed {rival}, the gang’s leader, like a shadow, learned every trick, and then slipped away to work alone.', { shadow: 2, finesse: 1 }, { sets: ['rival-known'] }),
        ],
      },
      {
        id: 'sibling',
        text: 'You were not the only child. Tell me about {sibling}.',
        options: [
          opt('elder', 'My elder sibling, the one everyone loved more.', 'Their elder sibling, {sibling}, was the one everyone loved more, and they never quite stopped trying to measure up.', { vengeance: 1, noble: 1 }),
          opt('younger', 'My younger sibling. I would die for them.', 'Their younger sibling, {sibling}, was the one person they would have died for without a second thought.', { protector: 3 }),
          opt('twin', 'My twin. We were never apart, until we were.', 'They had a twin, {sibling}, and the two were never apart until the day they were.', { innate: 1, wild: 1 }),
          opt('adopted', 'An adopted sibling, taken in from the cold.', 'Their family took in {sibling}, a half-starved child found in the cold, and the two grew up as close as blood.', { outcast: 1, healer: 1 }),
        ],
      },
      {
        id: 'end-of-childhood',
        text: 'What ended your childhood?',
        fate: true,
        options: [
          opt('plague', 'A plague that took half the street.', 'Childhood ended the year the plague came and took half the street. They learned too young how fragile people are.', { healer: 2, death: 1 }, { sets: ['plague'] }),
          opt('raid', 'Raiders who burned our home.', 'Childhood ended in fire, the night raiders burned their home. They still dream of the smoke.', { vengeance: 2, brute: 1 }, { sets: ['raid'] }),
          opt('sent-away', 'I was sent away to a school, a temple or a master.', 'Childhood ended when they were sent away to strangers, with one bag and orders to make the family proud.', { scholar: 1, order: 1 }, { sets: ['sent-away'] }),
          opt('ran-away', 'I ran away and never looked back.', 'Childhood ended the night they ran away with nothing but the clothes they wore. They never looked back.', { wild: 2, outcast: 1 }, { sets: ['ran-away'] }),
          opt('debts', 'Debts. My family sold everything, then sold my service.', 'Childhood ended when the family’s debts came due. When everything else was sold, so was their service.', { outcast: 1, trickster: 1 }, { sets: ['indentured'] }),
          opt('vanished', '{sibling} vanished one night without a trace.', 'Childhood ended the night {sibling} vanished without a trace. The searchers gave up after a week. They never did.', { shadow: 1, vengeance: 2 }, { sets: ['sibling-vanished'], fateOnly: true }),
        ],
      },
    ],
  },
  {
    id: 'awakening',
    title: 'Chapter II: The Awakening',
    intro: 'Some are born with power, some earn it, and some have it forced upon them. Sooner or later, you discovered what you could do.',
    scenes: [
      {
        id: 'source',
        weight: 3,
        text: 'Then came the moment you discovered what you could do. What happened?',
        options: [
          opt('apprentice', '{mentor}, a reclusive mage, took me as an apprentice.', 'Everything changed when {mentor}, a reclusive mage, saw something in them and took them on as an apprentice.', { arcane: 3, scholar: 2 }, { sets: ['path-study'] }),
          opt('outburst', 'Power burst out of me in a moment of fear.', 'Everything changed the day fear cracked something open inside them and raw power came pouring out.', { innate: 3, wild: 1 }, { sets: ['path-blood'] }),
          opt('called-out', 'Alone and desperate, I called out, and something answered.', 'Everything changed on the night they called out in desperation and something answered.', { pact: 3, shadow: 1 }, { sets: ['path-pact'] }),
          opt('dream', 'A god spoke to me in a dream I could not forget.', 'Everything changed when a god spoke to them in a dream so vivid they woke with the words still on their lips.', { divine: 3, order: 1 }, { sets: ['path-faith'] }),
          opt('circle', 'The wild claimed me. A druid circle found me half-feral.', 'Everything changed when a circle of druids found them living half-feral in the wild and decided to keep them.', { nature: 3, beast: 1 }, { sets: ['path-wild'] }),
          opt('war', 'No magic. A war came, and someone handed me a sword.', 'Everything changed when war came and someone handed them a sword.', { martial: 3 }, { sets: ['path-war'] }),
          opt('song', 'I found a song that made people do what I asked.', 'Everything changed the night they found a song that made a whole room do exactly what they wanted.', { music: 2, charm: 2 }, { sets: ['path-song'] }),
          opt('monastery', 'A monastery took me in and made my body a weapon.', 'Everything changed when a remote monastery took them in and taught them to turn their own body into a weapon.', { ascetic: 3, order: 1 }, { sets: ['path-fist'] }),
          opt('rage', 'A rage woke in me, older than I am.', 'Everything changed the first time the rage came: a fury older than they were, and stronger.', { brute: 3, wild: 2 }, { sets: ['path-rage'] }),
          opt('hunt', 'I learned to hunt to survive, and then to hunt monsters.', 'Everything changed when hunting stopped being about food and became about the things that hunt people.', { ranged: 3, nature: 1, vengeance: 1 }, { sets: ['path-hunt'] }),
          opt('shadows', 'I learned the trade of locks, knives and silence.', 'Everything changed when a guild of thieves noticed their quick hands and taught them the trade of locks, knives and silence.', { shadow: 3, finesse: 2 }, { sets: ['path-shadow'] }),
        ],
      },
      // --- Study
      {
        id: 'tower',
        weight: 1.5,
        requires: { all: ['path-study'] },
        text: '{mentor}’s tower was full of secrets. Which did you study most?',
        options: [
          opt('destruction', 'Fire and lightning: the art of destruction.', 'In {mentor}’s tower they studied the art of destruction: fire, frost and lightning bent to precise formulae.', { elemental: 3 }),
          opt('mind', 'The workings of the mind: charms and illusions.', 'In {mentor}’s tower they studied the workings of the mind, learning how easily a person can be charmed or fooled.', { trickster: 2, charm: 1 }),
          opt('wards', 'Wards and protective circles.', 'In {mentor}’s tower they studied wards and protective circles, the quiet magic that keeps everything else from going wrong.', { protector: 2, order: 1 }),
          opt('death', 'Death, and what lies beyond it.', 'In {mentor}’s tower they studied death and what lies beyond it, in a locked room their mentor pretended not to know about.', { death: 3 }),
          opt('battle-magic', 'Battle magic. I wanted a sword in one hand and a spell in the other.', 'In {mentor}’s tower they studied battle magic, practising sword forms between lessons until the two became one art.', { martial: 2, arcane: 1, finesse: 1 }),
        ],
      },
      {
        id: 'tower-empty',
        requires: { all: ['path-study'] },
        text: 'One morning {mentor} was gone. What did you find in the tower?',
        fate: true,
        options: [
          opt('heir', 'A letter naming me heir to everything.', 'One morning {mentor} was simply gone, leaving a letter that named them heir to the tower and everything in it.', { noble: 1, scholar: 1 }),
          opt('struggle', 'Signs of a struggle and a shattered ward.', 'One morning {mentor} was gone. The ward on the door was shattered and the study was torn apart. Nobody has seen {mentor} since.', { vengeance: 2 }, { sets: ['mentor-taken'] }),
          opt('left', 'Nothing. They simply left, and took their secrets with them.', 'One morning {mentor} was gone, along with every book that mattered. No note, no goodbye.', { scholar: 1, outcast: 1 }),
          opt('journal', 'A journal showing that {mentor} had been studying me.', 'One morning {mentor} was gone. All that remained was a journal full of notes about their apprentice, as if they had been the experiment all along.', { trickster: 1, pact: 1 }, { sets: ['mentor-taken'], fateOnly: true }),
        ],
      },
      // --- Blood
      {
        id: 'power-form',
        weight: 1.5,
        requires: { all: ['path-blood'] },
        text: 'What form did your power take?',
        options: [
          opt('fire-storm', 'Fire and storm, roaring out of my hands.', 'Their power came out as fire and storm, roaring from their hands.', { elemental: 3 }),
          opt('chaos', 'Chaos. Colours changed, people floated, and once a sheep appeared.', 'Their power came out as pure chaos: colours changed, people floated, and on one memorable occasion a sheep appeared.', { wild: 3 }),
          opt('shadow-form', 'Shadows that moved when I wasn’t looking.', 'Their power came out as shadows that moved when no one was looking and a cold that would not leave the room.', { shadow: 2, death: 1 }),
          opt('scales', 'Scales on my skin and a dragon’s roar in my throat.', 'Their power came out as scales across their skin and a dragon’s roar in their throat.', { innate: 2, noble: 1, elemental: 1 }),
        ],
      },
      {
        id: 'power-reaction',
        requires: { all: ['path-blood'] },
        text: 'How did people react?',
        options: [
          opt('exiled', 'They feared me. I was driven out.', 'The people of {home} feared what they had seen and drove them out.', { outcast: 2 }),
          opt('wanted', 'Someone powerful wanted to use me.', 'Someone powerful heard about what they could do and wanted to own it.', { trickster: 1, noble: 1 }),
          opt('hidden', 'I hid it and learned control on my own.', 'They hid what had happened and spent years learning control alone.', { order: 1, ascetic: 1 }),
        ],
      },
      // --- Pact
      {
        id: 'patron',
        weight: 1.5,
        requires: { all: ['path-pact'] },
        text: 'Who answered your call? You know it only as {patron}.',
        options: [
          opt('fiend', 'A fiend, with a contract and a smile.', 'The voice that answered called itself {patron}, a fiend that came with a contract and a smile.', { elemental: 1, vengeance: 1, pact: 1 }),
          opt('fey', 'A fey lord, beautiful and capricious.', 'The voice that answered called itself {patron}, a fey lord as beautiful as it was capricious.', { charm: 2, nature: 1 }),
          opt('elder', 'Something vast and alien from beyond the stars.', 'The voice that answered called itself {patron}. It came from beyond the stars, and it did not think the way people think.', { scholar: 1, death: 1, trickster: 1 }),
          opt('blade', 'A sentient blade, whispering from the shadows.', 'The voice that answered called itself {patron}. It was a blade, and it whispered to them from the shadows.', { martial: 2, shadow: 1 }),
        ],
      },
      {
        id: 'price',
        requires: { all: ['path-pact'] },
        text: 'What did {patron} ask in return?',
        options: [
          opt('years', 'Years of my life.', 'The price was years of their life. They try not to count how many.', { death: 2 }),
          opt('favour', 'A favour, to be named later.', 'The price was a favour, to be named later. It has not been named yet.', { pact: 1, trickster: 1 }, { sets: ['owes-patron'] }),
          opt('name', 'My true name. I can never say it aloud again.', 'The price was their true name. They can never speak it aloud again.', { shadow: 2, outcast: 1 }),
          opt('hunt', 'Service. I hunt what my patron wants hunted.', 'The price was service: they hunt whatever {patron} wants hunted.', { vengeance: 2, ranged: 1 }),
        ],
      },
      // --- Faith
      {
        id: 'god',
        weight: 1.5,
        requires: { all: ['path-faith'] },
        text: 'What kind of god called you?',
        options: [
          opt('life', 'A god of life and healing.', 'The god who called them was a god of life and healing.', { healer: 3, light: 1 }),
          opt('storm-god', 'A god of storms and fury.', 'The god who called them was a god of storms and fury.', { elemental: 2, vengeance: 1 }),
          opt('war-god', 'A god of war and honour.', 'The god who called them was a god of war and honour.', { martial: 2, order: 1 }),
          opt('trickster-god', 'A god of trickery and secrets.', 'The god who called them was a god of trickery and secrets, which explained a great deal about the dream.', { trickster: 3 }),
          opt('dawn', 'A god of light and the dawn.', 'The god who called them was a god of light and the dawn.', { light: 3 }),
          opt('knowledge-god', 'A god of knowledge.', 'The god who called them was a god of knowledge.', { scholar: 3 }),
          opt('death-god', 'A god of death and endings.', 'The god who called them was a god of death and endings.', { death: 3 }),
          opt('nature-god', 'A god of the wild green world.', 'The god who called them was a god of the wild green world.', { nature: 3 }),
        ],
      },
      {
        id: 'calling',
        weight: 1.5,
        requires: { all: ['path-faith'] },
        text: 'What did you do with that calling?',
        options: [
          opt('oath', 'Swore a holy oath to protect the innocent.', 'They swore a holy oath to protect the innocent and have kept it ever since, at no small cost.', { protector: 3, order: 1, martial: 1 }),
          opt('priest', 'Became a priest and served the faithful.', 'They became a priest and spent years tending to the faithful.', { healer: 1, divine: 3 }),
          opt('crusade', 'Took up arms and swore vengeance on the god’s enemies.', 'They took up arms and swore vengeance on their god’s enemies.', { vengeance: 3, martial: 1 }),
          opt('doubt', 'Doubted. I still don’t know why I was chosen.', 'They doubted. They still do not understand why they were chosen.', { outcast: 1, scholar: 1, divine: 1 }),
        ],
      },
      // --- Wild
      {
        id: 'circle-lesson',
        weight: 1.5,
        requires: { all: ['path-wild'] },
        text: 'Among the circle, what did you learn first?',
        options: [
          opt('shapes', 'To take the shapes of beasts.', 'The circle first taught them to take the shapes of beasts, and for a while they forgot how to be anything else.', { beast: 3, wild: 1 }),
          opt('storms', 'To call down storms.', 'The circle first taught them to call down storms.', { elemental: 3 }),
          opt('healing', 'To heal the land and those who walk it.', 'The circle first taught them to heal the land and everything that walks it.', { healer: 2, nature: 1 }),
          opt('tracking', 'To track and hunt whatever threatens the wild.', 'The circle first taught them to track and hunt whatever threatened the wild.', { ranged: 2, vengeance: 1, nature: 1 }),
          opt('decay', 'That decay is life too.', 'The circle first taught them that rot and decay are part of life too, a lesson most of the circle found unsettling.', { death: 2, nature: 1 }),
        ],
      },
      // --- War
      {
        id: 'battlefield',
        weight: 1.5,
        requires: { all: ['path-war'] },
        text: 'Where did you stand in battle?',
        options: [
          opt('shield-wall', 'In the front of the shield wall.', 'They fought in the front of the shield wall, where the line holds or everyone dies.', { protector: 2, martial: 1 }),
          opt('scout', 'Out ahead as a scout and archer.', 'They fought as a scout and archer, out ahead of everyone else.', { ranged: 3 }),
          opt('berserker', 'Among the raiders, screaming.', 'They fought among the raiders, screaming, and do not remember most of it.', { brute: 3, wild: 1 }),
          opt('duellist', 'As a duellist, one opponent at a time.', 'They fought as a duellist, one opponent at a time.', { finesse: 2, charm: 1 }),
          opt('bodyguard', 'Guarding a battle-mage, and picking up a few tricks.', 'They fought as a battle-mage’s bodyguard and picked up a few tricks along the way.', { arcane: 2, martial: 1 }),
        ],
      },
      {
        id: 'war-end',
        requires: { all: ['path-war'] },
        text: 'How did your war end?',
        fate: true,
        options: [
          opt('victory', 'In victory, with a medal I later threw in a river.', 'The war ended in victory and a medal, which they later threw in a river.', { noble: 1, outcast: 1 }),
          opt('survivor', 'In defeat. I was the only survivor of my company.', 'The war ended in defeat. They were the only survivor of their company.', { vengeance: 2, death: 1 }),
          opt('deserter', 'I deserted.', 'The war did not end for them. They simply walked away from it one night.', { trickster: 1, wild: 1 }),
          opt('left-for-dead', 'I was left for dead by {captain}.', 'The war ended when {captain} ordered a retreat and left them for dead on the field.', { vengeance: 3 }, { sets: ['captain-betrayal'], fateOnly: true }),
        ],
      },
      // --- Song
      {
        id: 'voice',
        weight: 1.5,
        requires: { all: ['path-song'] },
        text: 'What did your voice do?',
        options: [
          opt('mend', 'Healed the hurting.', 'Their voice could heal the hurting.', { healer: 2, music: 1 }),
          opt('crowds', 'Turned crowds into mobs.', 'Their voice could turn a crowd into a mob, which is a frightening thing to discover.', { charm: 2, trickster: 1 }),
          opt('blades', 'Made blades dance.', 'Their songs made blades dance, theirs most of all.', { finesse: 2, martial: 1 }),
          opt('histories', 'Told forbidden histories.', 'Their songs told forbidden histories that powerful people wanted forgotten.', { scholar: 2 }),
        ],
      },
      // --- Fist
      {
        id: 'discipline',
        weight: 1.5,
        requires: { all: ['path-fist'] },
        text: 'What did the monastery teach you?',
        options: [
          opt('balance', 'Perfect balance: the open hand.', 'The monastery taught them perfect balance: how to strike, throw and yield like water.', { ascetic: 2, order: 1 }),
          opt('unseen', 'To move unseen in the dark.', 'The monastery taught them to move unseen in the dark.', { shadow: 3 }),
          opt('elements', 'To bend the elements with breath and stance.', 'The monastery taught them to bend the elements with breath and stance.', { elemental: 3 }),
          opt('wine', 'That a little wine loosens the body. Officially frowned upon.', 'The monastery taught them, unofficially, that a little wine loosens the body.', { wild: 2, charm: 1 }),
        ],
      },
      // --- Rage
      {
        id: 'fury',
        weight: 1.5,
        requires: { all: ['path-rage'] },
        text: 'What wakes the rage?',
        options: [
          opt('the-weak', 'Seeing the weak get hurt.', 'The rage wakes whenever they see the weak get hurt, and it does not sleep again until it is over.', { brute: 1, protector: 2 }),
          opt('cages', 'Being caged, held down or told no.', 'The rage wakes whenever someone tries to cage them, hold them down or tell them no.', { brute: 1, wild: 2 }),
          opt('ancestors', 'The call of the beast-spirits my ancestors followed.', 'The rage comes with the howl of the beast-spirits their ancestors followed.', { beast: 2, brute: 1, nature: 1 }),
          opt('giant', 'Something giant in my blood. I grow when I’m angry.', 'There is something of the giants in their blood. When the rage comes, they seem to grow.', { brute: 2, elemental: 1, noble: 1 }),
        ],
      },
      // --- Hunt
      {
        id: 'quarry',
        weight: 1.5,
        requires: { all: ['path-hunt'] },
        text: 'What did you hunt?',
        options: [
          opt('preyers', 'Beasts that preyed on villages.', 'They hunted the beasts that preyed on villages, and the villages paid in bread and gratitude.', { ranged: 1, protector: 2 }),
          opt('bounties', 'Bounties. Anyone with a price on their head.', 'They hunted bounties: anyone with a price on their head and a reason to run.', { vengeance: 2, ranged: 1 }),
          opt('dark-things', 'Things that crawl out of the dark.', 'They hunted the things that crawl out of the dark, and learned to move like them.', { shadow: 2, ranged: 1 }),
          opt('with-companion', 'Anything, with my animal companion at my side.', 'They hunted anything that needed hunting, with a loyal animal companion at their side.', { beast: 2, ranged: 1, nature: 1 }),
        ],
      },
      // --- Shadow
      {
        id: 'guild',
        weight: 1.5,
        requires: { all: ['path-shadow'] },
        text: 'What was your speciality in the guild?',
        options: [
          opt('burglar', 'Burglary: rooftops, windows and vaults.', 'In the guild they specialised in burglary: rooftops, windows and vaults that were supposed to be impossible.', { finesse: 2, trickster: 1 }),
          opt('knife', 'The knife in the dark. I was the one they sent last.', 'In the guild they were the knife in the dark, the one sent when talking had failed.', { death: 2, vengeance: 1 }),
          opt('face', 'The face: forged papers and false names.', 'In the guild they were the face of every job, with forged papers, false names and a smile for every guard.', { charm: 2, trickster: 1 }),
          opt('magic-tricks', 'Magic tricks that weren’t really tricks.', 'In the guild they used magic tricks that were not really tricks at all.', { arcane: 2, trickster: 1 }),
        ],
      },
    ],
  },
  {
    id: 'bond',
    title: 'Chapter III: The Bond',
    intro: 'No one walks the whole road alone. Somewhere along the way, someone mattered.',
    scenes: [
      {
        id: 'who',
        text: 'Of everyone you met, one person mattered most. Who?',
        options: [
          opt('love', '{love}, who made me laugh when nothing was funny.', 'Of everyone they met, {love} mattered most: the one who could make them laugh when nothing was funny.', { charm: 1, healer: 1 }, { sets: ['has-bond'] }),
          opt('friend', '{friend}, my sworn companion on the road.', 'Of everyone they met, {friend} mattered most, a sworn companion who shared every road and every bad meal.', { protector: 2 }, { sets: ['has-bond'] }),
          opt('sibling', '{sibling}. Always {sibling}.', 'Of everyone they ever met, {sibling} still mattered most.', { protector: 1, healer: 1 }, { sets: ['has-bond'], requires: { none: ['sibling-vanished'] } }),
          opt('lost-sibling', '{sibling}, whom I never stopped looking for.', 'Of everyone they ever met, the one who mattered most was still {sibling}, the sibling they never stopped looking for.', { vengeance: 1, protector: 1 }, { sets: ['seeking-sibling'], requires: { all: ['sibling-vanished'] } }),
          opt('beast', 'A beast I named {beast}.', 'Of every companion they had, {beast} mattered most, a wild animal that chose to follow them and never left.', { beast: 3 }, { sets: ['has-bond'] }),
          opt('mentor', '{mentor}, who believed in me.', 'Of everyone they met, {mentor} mattered most, the first person who believed in them.', { scholar: 1, protector: 1 }, { sets: ['has-bond'], requires: { all: ['path-study'] } }),
          opt('no-one', 'No one. I made sure of that.', 'They made sure no one ever got close enough to matter.', { outcast: 2, shadow: 1 }, { sets: ['alone'] }),
        ],
      },
      {
        id: 'fate-of-bond',
        requires: { all: ['has-bond'] },
        text: 'What became of them?',
        fate: true,
        options: [
          opt('waiting', 'They are waiting for me to come home.', 'That person is still waiting for {name} to come home, and the thought has carried them through more than one bad night.', { protector: 2, light: 1 }),
          opt('parted', 'We parted in anger, and I never apologised.', 'The two parted in anger, and the apology was never made. It still sits in {name}’s throat.', { vengeance: 1, outcast: 1 }),
          opt('lost', 'They died, and I could not save them.', 'That person died, and nothing {name} did could prevent it.', { death: 2, healer: 1 }),
          opt('danger', 'They are in danger, and I am on my way.', 'Somewhere, that person is in danger, and {name} is on the way.', { protector: 2, vengeance: 1 }),
          opt('betrayed', 'They sold me out to my enemies.', 'In the end, the one person {name} trusted most sold them out to their enemies.', { vengeance: 3, outcast: 1 }, { fateOnly: true }),
        ],
      },
      {
        id: 'arms-length',
        requires: { any: ['alone', 'seeking-sibling'] },
        text: 'Why do you keep everyone else at arm’s length?',
        options: [
          opt('hurt', 'Everyone I let close gets hurt.', 'Everyone they let close gets hurt, so they stopped letting anyone close.', { death: 1, protector: 1 }),
          opt('tools', 'People are tools. Useful, fragile tools.', 'To them, people are tools: useful, and fragile.', { trickster: 2, noble: 1 }),
          opt('thoughts', 'I prefer the company of my own thoughts.', 'They prefer the company of their own thoughts, which are at least predictable.', { scholar: 2, ascetic: 1 }),
        ],
      },
    ],
  },
  {
    id: 'wound',
    title: 'Chapter IV: The Wound',
    intro: 'Every story has a scar in it somewhere. Yours still aches when the weather turns.',
    scenes: [
      {
        id: 'scar',
        text: 'Every story has a wound. What is yours?',
        fate: true,
        options: [
          opt('killed', 'I killed someone, and I am still not sure it was justified.', 'They killed someone once, and they are still not sure it was justified.', { vengeance: 1, death: 2 }, { sets: ['killer'] }),
          opt('stole', 'I stole something I should never have touched.', 'They stole something they should never have touched.', { trickster: 2, shadow: 1 }, { sets: ['thief'] }),
          opt('debt', 'I owe a dangerous debt to {creditor}.', 'They owe a dangerous debt to {creditor}, who never forgets and never forgives.', { outcast: 1, trickster: 1 }, { sets: ['debtor'] }),
          opt('vow', 'I broke a vow.', 'They broke a vow, and some part of them has been trying to mend it ever since.', { order: 1, outcast: 1 }, { sets: ['regret'] }),
          opt('failed', 'I failed the people who depended on me.', 'They failed the people who depended on them, and they have not forgiven themselves.', { protector: 2 }, { sets: ['regret'] }),
          opt('betrayed', 'I was betrayed by {rival}.', 'They were betrayed by {rival}, and the knife is still in their back.', { vengeance: 2 }, { sets: ['betrayed'] }),
          opt('false-name', 'I learned that my family’s history was a lie.', 'They discovered that everything their family had told them about who they were was a lie.', { noble: 1, outcast: 2 }, { sets: ['regret'], fateOnly: true }),
        ],
      },
      {
        id: 'victim',
        requires: { all: ['killer'] },
        text: 'Who was it?',
        options: [
          opt('collector', 'A tyrant’s tax collector.', 'The dead official was a tyrant’s tax collector. Half of {home} cheered. The other half sent hunters.', { vengeance: 1, light: 1, outcast: 1 }),
          opt('friend', 'A friend, in a fight that went too far.', 'It was a friend, in a fight that went too far.', { brute: 2, death: 1 }),
          opt('monster', 'A monster wearing a person’s face.', 'It was a monster wearing a person’s face, though they could never prove it.', { vengeance: 2, light: 1 }),
        ],
      },
      {
        id: 'loot',
        requires: { all: ['thief'] },
        text: 'What did you steal?',
        options: [
          opt('relic', 'A relic from a temple.', 'It was a relic from a temple, and the priests have long memories.', { divine: 1, trickster: 1 }),
          opt('spellbook', 'A wizard’s spellbook.', 'It was a wizard’s spellbook, and they have been learning from it ever since.', { arcane: 2 }),
          opt('ring', 'A noble’s signet ring, and with it their identity.', 'It was a noble’s signet ring, and with it, for a while, an entire identity.', { noble: 2, trickster: 1 }),
        ],
      },
      {
        id: 'terms',
        requires: { all: ['debtor'] },
        text: 'What does {creditor} want?',
        options: [
          opt('gold', 'Gold, more than I’ll ever have.', '{creditor} wants gold, more than they will ever have.', { outcast: 1, trickster: 1 }),
          opt('job', 'One more job, and then we’re even.', '{creditor} wants one more job. It is always one more job.', { shadow: 2 }),
          opt('secret', 'Something only I can give, and won’t say what.', '{creditor} wants something only they can give, and will not say what it is.', { pact: 1, trickster: 1 }),
        ],
      },
      {
        id: 'grudge',
        requires: { all: ['betrayed'] },
        text: 'How do you feel about {rival} now?',
        options: [
          opt('hunt', 'I will find them.', 'They will find {rival}. It is only a matter of time.', { vengeance: 3 }, { sets: ['hunting-rival'] }),
          opt('forgive', 'I’ve forgiven them. Mostly.', 'They have forgiven {rival}, mostly, on good days.', { light: 2, healer: 1 }),
          opt('understand', 'I want to understand why.', 'More than revenge, they want to understand why {rival} did it.', { scholar: 2 }),
        ],
      },
      {
        id: 'carry',
        requires: { all: ['regret'] },
        text: 'How do you carry it?',
        options: [
          opt('atone', 'Atonement. Every good deed is a payment.', 'They carry it as a debt and treat every good deed as a payment against it.', { light: 2, protector: 1 }),
          opt('drink', 'Drink, and silence.', 'They carry it with drink and silence.', { wild: 1, outcast: 1 }),
          opt('mask', 'Behind a mask. No one gets to see it.', 'They carry it behind a mask that no one gets to look under.', { trickster: 2 }),
          opt('harden', 'I let it make me harder.', 'They let it harden them, like steel in cold water.', { brute: 1, vengeance: 1 }),
        ],
      },
    ],
  },
  {
    id: 'road',
    title: 'Chapter V: The Road',
    intro: 'The years since have been a road of their own: long, crooked and full of strangers.',
    scenes: [
      {
        id: 'living',
        text: 'Since then, how have you made your way in the world?',
        options: [
          opt('sellsword', 'As a sellsword, taking any job that pays.', 'Since then they have made their living as a sellsword, taking any job that pays.', { martial: 2, outcast: 1 }),
          opt('healer', 'As a wandering healer.', 'Since then they have wandered from village to village as a healer.', { healer: 3 }),
          opt('con', 'As a thief and a con artist.', 'Since then they have lived by theft and clever lies.', { trickster: 2, shadow: 1 }),
          opt('ruins', 'As an adventurer, chasing ruins and rumours.', 'Since then they have chased ruins and rumours across the Sword Coast.', { scholar: 1, wild: 1, ranged: 1 }),
          opt('order', 'In the service of a temple or order.', 'Since then they have served a temple and its order faithfully.', { divine: 1, order: 2 }),
          opt('taverns', 'Performing in taverns up and down the Coast.', 'Since then they have performed in every tavern from {home} to the Moonsea, and been thrown out of most of them.', { music: 3 }),
          opt('hunter', 'Hunting: beasts, bounties, or one particular person.', 'Since then they have lived as a hunter of beasts, of bounties, and of one particular person.', { vengeance: 2, ranged: 1 }),
          opt('libraries', 'Studying in libraries and archives.', 'Since then they have studied in every library and archive that would let them in, and a few that would not.', { scholar: 2, arcane: 1 }),
          opt('wilds', 'Living off the land, far from towns.', 'Since then they have lived off the land, far from towns and the people in them.', { nature: 2, beast: 1 }),
        ],
      },
      {
        id: 'seek',
        text: 'What do you seek, more than anything?',
        options: [
          opt('power', 'Enough power that no one can hurt me again.', 'Above all they want power, enough that no one can ever hurt them again.', { pact: 1, innate: 1, elemental: 1 }),
          opt('answers', 'Answers about my past.', 'Above all they want answers about their own past.', { scholar: 2 }),
          opt('revenge', 'Revenge.', 'Above all they want revenge.', { vengeance: 3 }),
          opt('redemption', 'Redemption.', 'Above all they want redemption.', { light: 2, protector: 1 }),
          opt('freedom', 'Freedom, from every chain.', 'Above all they want freedom from every chain, visible or not.', { wild: 2 }),
          opt('fortune', 'Gold. Lots of it.', 'Above all they want gold, and plenty of it.', { trickster: 1, noble: 1 }),
          opt('find-sibling', 'To find {sibling}.', 'Above all they want to find {sibling}, alive.', { protector: 2, vengeance: 1 }, { requires: { all: ['sibling-vanished'] } }),
          opt('find-mentor', 'To find out what happened to {mentor}.', 'Above all they want to find out what happened to {mentor}.', { scholar: 1, vengeance: 1, protector: 1 }, { requires: { all: ['mentor-taken'] } }),
          opt('free-of-patron', 'To be free of {patron}.', 'Above all they want to be free of {patron}, whatever it costs.', { pact: 1, wild: 1 }, { requires: { all: ['owes-patron'] } }),
          opt('captain', 'To look {captain} in the eye one more time.', 'Above all they want to look {captain} in the eye one more time.', { vengeance: 3 }, { requires: { all: ['captain-betrayal'] } }),
        ],
      },
    ],
  },
  {
    id: 'eve',
    title: 'Chapter VI: The Eve',
    intro: 'And then came the last ordinary night: the moment just before everything changed.',
    scenes: [
      {
        id: 'where',
        text: 'Where were you on the night everything changed?',
        options: [
          opt('road', 'On the road to Baldur’s Gate, a day from its walls.', 'On the night everything changed, they were on the road to Baldur’s Gate, a day from its walls.', { wild: 1 }),
          opt('tavern', 'In a crowded tavern in Baldur’s Gate.', 'On the night everything changed, they were in a crowded tavern in Baldur’s Gate, nursing a drink and watching the door.', { charm: 1 }),
          opt('ship', 'On a ship, sailing up the coast.', 'On the night everything changed, they were on a ship sailing up the Sword Coast.', { elemental: 1 }),
          opt('stars', 'Asleep under the stars, far from any town.', 'On the night everything changed, they were asleep under the stars, far from any town.', { nature: 1 }),
          opt('trail', 'Following a trail I had been on for weeks.', 'On the night everything changed, they were following a trail they had been on for weeks.', { vengeance: 1, ranged: 1 }),
          opt('shrine', 'At prayer, alone in a roadside shrine.', 'On the night everything changed, they were at prayer, alone in a roadside shrine.', { divine: 1 }),
        ],
      },
      {
        id: 'last-thought',
        text: 'What was on your mind in that last ordinary moment?',
        fate: true,
        options: [
          opt('face', 'A face from the past.', 'Their last ordinary thought was of a face from the past. Then everything changed.', { protector: 1 }),
          opt('weight', 'The weight of what I had done.', 'Their last ordinary thought was of the weight of what they had done. Then everything changed.', { vengeance: 1, death: 1 }),
          opt('job', 'Tomorrow’s work.', 'Their last ordinary thought was about tomorrow’s work. Then everything changed.', { order: 1 }),
          opt('peace', 'Nothing. For once, I was at peace.', 'For once they were at peace, thinking of nothing at all. Then everything changed.', { ascetic: 1, light: 1 }),
          opt('watched', 'A sudden, sharp sense of being watched.', 'Their last ordinary thought was a sudden, sharp sense of being watched. Then everything changed.', { shadow: 1 }, { fateOnly: true }),
        ],
      },
    ],
  },
];

export const STORY_SCENES = STORY.flatMap((c) => c.scenes.map((s) => ({ ...s, chapterId: c.id })));
