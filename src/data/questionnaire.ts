import type { Question } from './schema';

/**
 * Roleplay questions about the character's past. Every answer nudges a set of
 * trait tags; the recommendation engine turns the summed tags into a build.
 * Nothing here references the game's story.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'power',
    prompt: 'When you first felt power stir within you, where did it come from?',
    options: [
      { id: 'study', text: 'Years of study by candlelight, memorising arcane formulae.', tags: { arcane: 3, scholar: 2 }, fragment: 'Power did not come easily; it was earned through years of study by candlelight.' },
      { id: 'blood', text: 'It was always in my blood. One day it simply woke.', tags: { innate: 3, wild: 1 }, fragment: 'Magic slept in their blood until the day it woke on its own.' },
      { id: 'bargain', text: 'I made a bargain with something that answered when I called.', tags: { pact: 3, shadow: 1 }, fragment: 'In a desperate hour they called out, and something answered. A bargain was struck.' },
      { id: 'god', text: 'A god chose me, or I chose a god.', tags: { divine: 3, order: 1 }, fragment: 'Faith gave them purpose, and their god gave them power in return.' },
      { id: 'land', text: 'The land itself: the forests, the storms, the beasts.', tags: { nature: 3, beast: 1 }, fragment: 'The wild places taught them their secrets: the turning seasons, the voice of the storm.' },
      { id: 'none', text: 'I have no magic. I have steel, sweat and scars.', tags: { martial: 3, brute: 1 }, fragment: 'They never needed magic. Steel, sweat and scars have served them well enough.' },
    ],
  },
  {
    id: 'youth',
    prompt: 'How did you survive your youth?',
    options: [
      { id: 'alleys', text: 'Picking pockets and running across the rooftops of a crowded city.', tags: { outcast: 2, shadow: 2, finesse: 1 }, fragment: 'They grew up quick-fingered and hungry in the alleys of a crowded city.' },
      { id: 'manor', text: 'In a manor, tutored in etiquette, history and duty.', tags: { noble: 3, charm: 1 }, fragment: 'They were raised in a manor among tutors, banquets and expectations.' },
      { id: 'wilds', text: 'Wandering the wilds with my kin, far from any wall.', tags: { nature: 2, wild: 1, beast: 1 }, fragment: 'Their childhood was spent beneath open skies, far from any city wall.' },
      { id: 'temple', text: 'In a temple or monastery, under strict rule.', tags: { order: 2, divine: 1, ascetic: 2 }, fragment: 'Bells, prayers and discipline marked every hour of their early years.' },
      { id: 'troupe', text: 'On the road with travelling performers.', tags: { music: 3, charm: 2 }, fragment: 'They grew up on the road with a band of travelling performers, learning that every crowd can be won.' },
      { id: 'militia', text: 'Drilled in a militia or mercenary company.', tags: { martial: 2, protector: 1, order: 1 }, fragment: 'Drill sergeants and campfires raised them as much as any parent did.' },
    ],
  },
  {
    id: 'fight',
    prompt: 'When talking fails and steel is drawn, where are you?',
    options: [
      { id: 'frontline', text: 'In the front line, taking the blows meant for others.', tags: { protector: 3, martial: 1 }, fragment: 'In a fight they stand in front, taking the blows meant for others.' },
      { id: 'charge', text: 'Charging in, roaring.', tags: { brute: 3, wild: 1 }, fragment: 'When battle comes, they charge headlong with a roar.' },
      { id: 'shadows', text: 'Striking from the shadows when they least expect it.', tags: { shadow: 3, finesse: 2 }, fragment: 'They prefer to strike from the shadows, before the enemy even knows they are there.' },
      { id: 'afar', text: 'At a distance, with arrow or bolt.', tags: { ranged: 3, finesse: 1 }, fragment: 'They keep their distance and let arrows do the talking.' },
      { id: 'fire', text: 'Raining fire and lightning on them.', tags: { elemental: 3, innate: 1 }, fragment: 'Enemies who corner them tend to end up scorched.' },
      { id: 'minds', text: 'Twisting their minds so they turn on each other.', tags: { trickster: 2, charm: 2 }, fragment: 'Their favourite weapon is the enemy’s own mind.' },
      { id: 'mend', text: 'Behind my friends, keeping them on their feet.', tags: { healer: 3, protector: 1 }, fragment: 'In battle their first thought is to keep their friends standing.' },
    ],
  },
  {
    id: 'fear',
    prompt: 'What do you fear losing most?',
    options: [
      { id: 'freedom', text: 'My freedom.', tags: { wild: 2, outcast: 1 }, fragment: 'Above all, they fear chains, whether of iron or of obligation.' },
      { id: 'people', text: 'The people I’ve sworn to protect.', tags: { protector: 3 }, fragment: 'Their deepest fear is failing the people who depend on them.' },
      { id: 'name', text: 'My name and my family’s legacy.', tags: { noble: 2, order: 1 }, fragment: 'They carry the weight of a family name and dread being the one to tarnish it.' },
      { id: 'knowledge', text: 'Knowledge. Forgetting what I’ve learned.', tags: { scholar: 3 }, fragment: 'They fear ignorance more than death: forgetting is the true end.' },
      { id: 'soul', text: 'My soul, if it isn’t already spoken for.', tags: { pact: 2, death: 1 }, fragment: 'They sometimes wonder whether their soul is still entirely their own.' },
      { id: 'control', text: 'Control over myself and what’s inside me.', tags: { innate: 2, wild: 1, brute: 1 }, fragment: 'Something inside them strains to get out, and they fear the day it does.' },
    ],
  },
  {
    id: 'seen',
    prompt: 'How do strangers usually see you?',
    options: [
      { id: 'charming', text: 'Charming. Maybe a little too charming.', tags: { charm: 3 }, fragment: 'Strangers find them disarmingly charming, sometimes suspiciously so.' },
      { id: 'menacing', text: 'Intimidating. People step aside.', tags: { brute: 2, vengeance: 1 }, fragment: 'People tend to step aside when they walk into a room.' },
      { id: 'invisible', text: 'They don’t. I’m easy to overlook.', tags: { shadow: 2, trickster: 1 }, fragment: 'Most people never notice them, which suits them fine.' },
      { id: 'wise', text: 'Calm and wise beyond my years.', tags: { divine: 1, nature: 1, ascetic: 1, healer: 1 }, fragment: 'Others see a calm, perceptive soul who listens more than they speak.' },
      { id: 'strange', text: 'Strange, unsettling. Animals avoid me.', tags: { pact: 1, death: 2, outcast: 1 }, fragment: 'There is something unsettling about them that even animals sense.' },
      { id: 'rock', text: 'Dependable, a rock in a storm.', tags: { protector: 2, order: 1 }, fragment: 'Companions see in them a rock to lean on when things go wrong.' },
    ],
  },
  {
    id: 'wrong',
    prompt: 'Long ago, someone did you a great wrong. What did you do?',
    options: [
      { id: 'hunted', text: 'I hunted them down.', tags: { vengeance: 3, ranged: 1 }, fragment: 'When they were wronged, they tracked the culprit across half the land.' },
      { id: 'forgave', text: 'I forgave. Hatred is a poison.', tags: { light: 2, healer: 1, divine: 1 }, fragment: 'They were once deeply wronged, and chose forgiveness over hatred.' },
      { id: 'oath', text: 'I swore an oath that nobody would suffer like that again.', tags: { order: 2, protector: 2, divine: 1 }, fragment: 'An old injustice shaped them, and they swore an oath that it would never happen again.' },
      { id: 'laughed', text: 'I laughed, and stole their purse.', tags: { trickster: 2, shadow: 1, charm: 1 }, fragment: 'When someone crossed them, they laughed it off and left with the offender’s purse.' },
      { id: 'storm', text: 'I let the storm inside me out.', tags: { wild: 2, elemental: 1, brute: 1 }, fragment: 'The one time they were truly wronged, the storm inside them broke loose.' },
    ],
  },
  {
    id: 'home',
    prompt: 'Which place feels most like home?',
    options: [
      { id: 'forest', text: 'A deep forest under ancient trees.', tags: { nature: 2, beast: 1 }, fragment: 'Their heart is at home beneath ancient trees.' },
      { id: 'library', text: 'A candlelit library.', tags: { scholar: 2, arcane: 1 }, fragment: 'They feel most at home among dusty shelves and candlelight.' },
      { id: 'tavern', text: 'A raucous tavern with a good band.', tags: { music: 2, charm: 1 }, fragment: 'Give them a raucous tavern and a good band and they are home.' },
      { id: 'underground', text: 'The dark beneath the earth.', tags: { shadow: 2, outcast: 1 }, fragment: 'The silent dark beneath the earth comforts them more than sunlight.' },
      { id: 'shrine', text: 'A quiet shrine or cathedral.', tags: { divine: 2, light: 1 }, fragment: 'A quiet shrine is where they find their peace.' },
      { id: 'yard', text: 'A training yard at dawn.', tags: { martial: 2, order: 1, ascetic: 1 }, fragment: 'Dawn in a training yard, steel in hand: that is home.' },
      { id: 'sky', text: 'Under open skies, as a storm rolls in.', tags: { elemental: 2, wild: 1 }, fragment: 'They feel most alive under open skies as a storm rolls in.' },
    ],
  },
  {
    id: 'death',
    prompt: 'What is your relationship with death?',
    options: [
      { id: 'door', text: 'It’s a door. I’ve glimpsed what lies beyond.', tags: { death: 3, scholar: 1 }, fragment: 'Death holds no mystery for them. They have glimpsed what lies beyond.' },
      { id: 'enemy', text: 'It’s the enemy of everything I serve.', tags: { light: 3, healer: 1 }, fragment: 'They see death as the great enemy, to be fought at every bedside.' },
      { id: 'cycle', text: 'Part of nature’s cycle, neither good nor evil.', tags: { nature: 2, ascetic: 1 }, fragment: 'To them, death is simply part of the great cycle.' },
      { id: 'trade', text: 'Something I deal out. Professionally.', tags: { shadow: 2, vengeance: 1, death: 1 }, fragment: 'Death is their trade, and they are very good at it.' },
      { id: 'laugh', text: 'I’ll face it laughing, drink in hand.', tags: { brute: 1, wild: 1, charm: 1 }, fragment: 'They plan to meet death laughing, drink in hand.' },
    ],
  },
  {
    id: 'cornered',
    prompt: 'Your companions are cornered and outnumbered. What do you do?',
    options: [
      { id: 'shield', text: 'Step in front of them.', tags: { protector: 3 }, fragment: 'When friends are cornered, they step in front without hesitation.' },
      { id: 'heal', text: 'Keep them alive, whatever it costs me.', tags: { healer: 3, divine: 1 }, fragment: 'They would spend their last breath keeping friends alive.' },
      { id: 'flank', text: 'Vanish, then reappear behind the enemy.', tags: { shadow: 2, trickster: 1, finesse: 1 }, fragment: 'Outnumbered, they vanish, only to reappear behind the enemy.' },
      { id: 'talk', text: 'Talk. There’s always a deal to be made.', tags: { charm: 3, trickster: 1 }, fragment: 'Outnumbered, they talk; there is always a deal to be made.' },
      { id: 'unleash', text: 'Unleash everything I have.', tags: { elemental: 2, brute: 1, innate: 1 }, fragment: 'Cornered, they hold nothing back.' },
      { id: 'summon', text: 'Call for help that isn’t entirely human.', tags: { beast: 2, nature: 1, death: 1 }, fragment: 'When outnumbered, they call allies that are not entirely human.' },
    ],
  },
  {
    id: 'weapon',
    prompt: 'What would you want to be buried with?',
    options: [
      { id: 'great', text: 'A greatsword or greataxe.', tags: { brute: 2, martial: 1 }, fragment: 'They will be buried with their great blade.' },
      { id: 'rapier', text: 'A rapier, or a pair of daggers.', tags: { finesse: 3 }, fragment: 'A slender blade rarely leaves their side.' },
      { id: 'bow', text: 'My bow.', tags: { ranged: 3 }, fragment: 'Their bow is their most trusted companion.' },
      { id: 'staff', text: 'A staff or wand.', tags: { arcane: 2, innate: 1 }, fragment: 'A worn staff carries the marks of a lifetime of spellwork.' },
      { id: 'symbol', text: 'A holy symbol.', tags: { divine: 2, light: 1 }, fragment: 'A holy symbol hangs at their neck, polished smooth by years of prayer.' },
      { id: 'shield', text: 'A sword and shield.', tags: { protector: 2, martial: 1 }, fragment: 'Sword and shield: simple, honest, reliable.' },
      { id: 'fists', text: 'Nothing. My fists are enough.', tags: { ascetic: 3, brute: 1 }, fragment: 'They need no weapon: their body is weapon enough.' },
      { id: 'lute', text: 'A lute.', tags: { music: 3 }, fragment: 'A battered lute has travelled every road with them.' },
    ],
  },
  {
    id: 'virtue',
    prompt: 'Which virtue do you value above all others?',
    options: [
      { id: 'discipline', text: 'Discipline.', tags: { order: 2, ascetic: 2 }, fragment: 'Discipline is their highest virtue.' },
      { id: 'cunning', text: 'Cunning.', tags: { trickster: 2, shadow: 1 }, fragment: 'They prize cunning over strength.' },
      { id: 'courage', text: 'Courage.', tags: { martial: 1, protector: 1, brute: 1 }, fragment: 'Courage, they say, is the only virtue that makes the others possible.' },
      { id: 'mercy', text: 'Mercy.', tags: { healer: 2, light: 1 }, fragment: 'Mercy is the virtue they hold dearest.' },
      { id: 'curiosity', text: 'Curiosity.', tags: { scholar: 2, arcane: 1 }, fragment: 'Endless curiosity drives them.' },
      { id: 'ambition', text: 'Ambition.', tags: { pact: 2, noble: 1, innate: 1 }, fragment: 'Ambition burns in them; they intend to be someone who matters.' },
    ],
  },
  {
    id: 'blood',
    prompt: 'What do people whisper about your bloodline?',
    options: [
      { id: 'dragon', text: 'That dragon’s blood runs in my veins.', tags: { innate: 2, elemental: 2 }, fragment: 'People whisper that dragon’s blood runs in their veins.' },
      { id: 'fiend', text: 'That something infernal marked my family.', tags: { pact: 1, outcast: 2, elemental: 1 }, fragment: 'Their family carries an infernal mark that earns them wary looks.' },
      { id: 'fey', text: 'That my ancestors danced with the fey.', tags: { nature: 1, charm: 1, finesse: 1, arcane: 1 }, fragment: 'Their ancestors, the stories say, danced with the fey.' },
      { id: 'underdark', text: 'That my people come from the dark below.', tags: { shadow: 2, outcast: 1 }, fragment: 'Their people come from the dark below, and the surface has never fully trusted them.' },
      { id: 'stone', text: 'That we are carved from stone and forge-fire.', tags: { protector: 1, order: 1, martial: 1 }, fragment: 'Their folk, it’s said, were carved from stone and forge-fire.' },
      { id: 'small', text: 'Nothing. Small folk like us are easily overlooked.', tags: { trickster: 2, scholar: 1 }, fragment: 'Small and easily overlooked, they have learned to use it to their advantage.' },
      { id: 'astral', text: 'That my people were raised for war among the stars.', tags: { martial: 2, vengeance: 1, ascetic: 1 }, fragment: 'Their people were raised for war among the silver seas of the Astral Plane.' },
      { id: 'orc', text: 'That orc blood gives me my temper.', tags: { brute: 2, outcast: 1 }, fragment: 'Orc blood, people mutter, explains their temper.' },
      { id: 'common', text: 'Nothing. I come from ordinary folk, and I’m proud of it.', tags: { order: 1, protector: 1 }, fragment: 'They come from ordinary folk and are proud of it.' },
    ],
  },
  {
    id: 'door',
    prompt: 'A locked door stands between you and what you want. You…',
    options: [
      { id: 'kick', text: 'Kick it in.', tags: { brute: 2 }, fragment: 'Locked doors rarely stay closed for long around them.' },
      { id: 'pick', text: 'Pick the lock.', tags: { shadow: 1, finesse: 1, trickster: 1 }, fragment: 'Locks are puzzles they enjoy solving.' },
      { id: 'spell', text: 'Cast a spell on it.', tags: { arcane: 2 }, fragment: 'A word of power opens most doors.' },
      { id: 'persuade', text: 'Persuade the guard to open it for me.', tags: { charm: 2 }, fragment: 'Why break a door when the guard will happily open it?' },
      { id: 'window', text: 'Find another way. There’s always a window.', tags: { wild: 1, trickster: 1, nature: 1 }, fragment: 'There is always another way in, and they usually find it.' },
    ],
  },
  {
    id: 'authority',
    prompt: 'What is your relationship with authority?',
    options: [
      { id: 'iam', text: 'I am the authority.', tags: { noble: 3 }, fragment: 'They are used to giving orders, not taking them.' },
      { id: 'serve', text: 'I serve a higher cause.', tags: { order: 2, divine: 1 }, fragment: 'They serve a higher cause and expect others to do the same.' },
      { id: 'nomaster', text: 'I follow no master.', tags: { wild: 2, outcast: 1 }, fragment: 'They follow no master and never will.' },
      { id: 'patron', text: 'I answer to my patron, whether I like it or not.', tags: { pact: 3 }, fragment: 'They answer to a patron, whether they like it or not.' },
      { id: 'mark', text: 'Authority is just a mark waiting to be fleeced.', tags: { trickster: 2, outcast: 1 }, fragment: 'To them, every official is a mark waiting to be fleeced.' },
    ],
  },
  {
    id: 'legacy',
    prompt: 'What legacy do you want to leave behind?',
    options: [
      { id: 'songs', text: 'Songs sung about me in every tavern.', tags: { music: 2, charm: 1 }, fragment: 'They dream of songs about their deeds sung in every tavern.' },
      { id: 'safer', text: 'A world made a little safer.', tags: { protector: 2, light: 1 }, fragment: 'All they want is to leave the world a little safer than they found it.' },
      { id: 'secrets', text: 'Secrets uncovered that no one else could find.', tags: { scholar: 2, arcane: 1 }, fragment: 'They hope to uncover secrets no one else could find.' },
      { id: 'buried', text: 'Enemies buried.', tags: { vengeance: 3 }, fragment: 'Their legacy will be measured in enemies buried.' },
      { id: 'power', text: 'Power, plain and simple.', tags: { pact: 1, innate: 1, elemental: 1, noble: 1 }, fragment: 'They want power, plain and simple, and they are not ashamed of it.' },
      { id: 'wild', text: 'Wild places left untamed.', tags: { nature: 3 }, fragment: 'They want the wild places to remain untamed long after they are gone.' },
    ],
  },
];
