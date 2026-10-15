import type { Subclass } from './schema';

const sc = (s: Subclass): Subclass => s;

export const SUBCLASSES: Subclass[] = [
  // Barbarian
  sc({
    id: 'berserker', classId: 'barbarian', name: 'Path of the Berserker',
    summary: 'Pure fury: frenzied extra attacks and throwing enemies around.',
    tags: { brute: 3, wild: 1, vengeance: 1 },
    features: [
      { level: 3, name: 'Frenzy', summary: 'Rage frenziedly to make a bonus-action attack each turn.' },
      { level: 6, name: 'Mindless Rage', summary: 'Immune to Charmed and Frightened while raging.' },
      { level: 10, name: 'Intimidating Presence', summary: 'Frighten an enemy with your menace.' },
    ],
    style: ['two-handed', 'throw'],
  }),
  sc({
    id: 'wildheart', classId: 'barbarian', name: 'Path of the Wildheart',
    summary: 'A spiritual bond with animal totems grants bestial aspects.',
    tags: { beast: 3, nature: 2, wild: 1, protector: 1 },
    features: [
      { level: 3, name: 'Bestial Heart', summary: 'Rage in the style of a chosen animal (e.g. Bear: resist almost all damage).' },
      { level: 6, name: 'Aspect of the Beast', summary: 'Choose an animal aspect for exploration and combat bonuses.' },
      { level: 10, name: 'Nature Speaker', summary: 'Speak with Animals and commune with nature.' },
    ],
    style: ['two-handed', 'tank'],
  }),
  sc({
    id: 'wild-magic-barbarian', classId: 'barbarian', name: 'Path of Wild Magic',
    summary: 'Rage surges with unpredictable magic.',
    tags: { wild: 3, innate: 1, brute: 1, trickster: 1 },
    features: [
      { level: 3, name: 'Wild Surge', summary: 'Entering rage triggers a random magical effect.' },
      { level: 6, name: 'Bolstering Magic', summary: 'Grant allies a bonus to rolls or restore a spell slot.' },
      { level: 10, name: 'Unstable Backlash', summary: 'Taking damage while raging can trigger a new surge.' },
    ],
    style: ['two-handed'],
  }),
  sc({
    id: 'giants', classId: 'barbarian', name: 'Path of Giants',
    summary: 'Channel the might of giants: grow larger and hurl weapons.',
    tags: { brute: 3, elemental: 1, noble: 1 },
    features: [
      { level: 3, name: 'Giant’s Rage', summary: 'Grow larger while raging, boosting throws and carrying capacity.' },
      { level: 6, name: 'Elemental Cleaver', summary: 'Infuse your weapon with elemental power; it returns when thrown.' },
      { level: 10, name: 'Mighty Impel', summary: 'Hurl creatures across the battlefield.' },
    ],
    style: ['two-handed', 'throw'],
  }),
  // Bard
  sc({
    id: 'lore', classId: 'bard', name: 'College of Lore',
    summary: 'A master of knowledge who undermines foes with Cutting Words.',
    tags: { scholar: 3, charm: 1, trickster: 1 },
    features: [
      { level: 3, name: 'Bonus Proficiencies', summary: 'Three extra skill proficiencies.' },
      { level: 3, name: 'Cutting Words', summary: 'Reaction: reduce an enemy’s roll with Bardic Inspiration.' },
      { level: 6, name: 'Magical Secrets', summary: 'Learn two spells from any class.' },
    ],
    style: ['caster', 'skills', 'control'],
  }),
  sc({
    id: 'valour', classId: 'bard', name: 'College of Valour',
    summary: 'A battle-skald who fights in the front line and inspires allies.',
    tags: { martial: 2, protector: 1, music: 1 },
    abilityPriority: ['CHA', 'DEX', 'CON', 'WIS', 'STR', 'INT'],
    extraArmour: ['medium', 'shield'],
    extraWeapons: ['martial'],
    extraAttackAt: 6,
    features: [
      { level: 3, name: 'Combat Inspiration', summary: 'Inspiration can boost damage or AC.' },
      { level: 6, name: 'Extra Attack', summary: 'Attack twice per Attack action.' },
    ],
    style: ['melee', 'shield', 'caster'],
  }),
  sc({
    id: 'swords', classId: 'bard', name: 'College of Swords',
    summary: 'A duellist performer with flashy Blade Flourishes.',
    tags: { finesse: 3, martial: 1, charm: 1 },
    abilityPriority: ['DEX', 'CHA', 'CON', 'WIS', 'INT', 'STR'],
    extraArmour: ['medium'],
    extraWeapons: ['scimitar'],
    extraAttackAt: 6,
    features: [
      { level: 3, name: 'Fighting Style', summary: 'Duelling or Two-Weapon Fighting.' },
      { level: 3, name: 'Blade Flourish', summary: 'Weapon attacks can add Slashing, Defensive or Mobile flourishes.' },
      { level: 6, name: 'Extra Attack', summary: 'Attack twice per Attack action.' },
    ],
    style: ['melee', 'finesse', 'dual-wield', 'ranged'],
  }),
  sc({
    id: 'glamour', classId: 'bard', name: 'College of Glamour',
    summary: 'A fey-touched performer who enthrals and empowers with presence.',
    tags: { charm: 3, trickster: 1, nature: 1 },
    features: [
      { level: 3, name: 'Mantle of Inspiration', summary: 'Grant allies temporary hit points and let them reposition.' },
      { level: 3, name: 'Enthralling Performance', summary: 'Charm listeners after a performance.' },
      { level: 6, name: 'Mantle of Majesty', summary: 'Command creatures as a bonus action.' },
    ],
    style: ['caster', 'support'],
  }),
  // Cleric
  sc({
    id: 'knowledge', classId: 'cleric', name: 'Knowledge Domain',
    summary: 'A seeker of lore with expertise and mind-reading tricks.',
    tags: { scholar: 3, divine: 1 },
    bonusSpells: [
      { level: 1, spells: ['command', 'sleep'] },
      { level: 3, spells: ['calm-emotions', 'hold-person'] },
    ],
    features: [
      { level: 1, name: 'Blessings of Knowledge', summary: 'Expertise in two knowledge skills.' },
      { level: 2, name: 'Knowledge of the Ages', summary: 'Channel Divinity: gain proficiency in a skill.' },
      { level: 8, name: 'Potent Spellcasting', summary: 'Add Wisdom to cantrip damage.' },
    ],
    style: ['caster', 'skills'],
  }),
  sc({
    id: 'life', classId: 'cleric', name: 'Life Domain',
    summary: 'The premier healer, wearing heavy armour and boosting every heal.',
    tags: { healer: 3, protector: 2, light: 1 },
    extraArmour: ['heavy'],
    bonusSpells: [
      { level: 1, spells: ['bless', 'cure-wounds'] },
      { level: 3, spells: ['aid', 'lesser-restoration'] },
      { level: 5, spells: ['beacon-of-hope', 'revivify'] },
      { level: 7, spells: ['death-ward', 'guardian-of-faith'] },
      { level: 9, spells: ['mass-cure-wounds', 'greater-restoration'] },
    ],
    features: [
      { level: 1, name: 'Disciple of Life', summary: 'Healing spells restore extra hit points.' },
      { level: 2, name: 'Preserve Life', summary: 'Channel Divinity: heal several allies at once.' },
      { level: 8, name: 'Divine Strike', summary: 'Weapon attacks deal extra radiant damage.' },
    ],
    style: ['caster', 'healer', 'heavy-armour', 'shield'],
  }),
  sc({
    id: 'light', classId: 'cleric', name: 'Light Domain',
    summary: 'A radiant blaster who blinds attackers and burns foes.',
    tags: { light: 3, elemental: 2, divine: 1 },
    bonusSpells: [
      { level: 1, spells: ['burning-hands', 'faerie-fire'] },
      { level: 3, spells: ['flaming-sphere', 'scorching-ray'] },
      { level: 5, spells: ['daylight', 'fireball'] },
      { level: 7, spells: ['guardian-of-faith', 'wall-of-fire'] },
      { level: 9, spells: ['flame-strike'] },
    ],
    features: [
      { level: 1, name: 'Warding Flare', summary: 'Reaction: impose disadvantage on an attack against you.' },
      { level: 2, name: 'Radiance of the Dawn', summary: 'Channel Divinity: radiant burst around you.' },
      { level: 8, name: 'Potent Spellcasting', summary: 'Add Wisdom to cantrip damage.' },
    ],
    style: ['caster', 'blaster'],
  }),
  sc({
    id: 'nature-domain', classId: 'cleric', name: 'Nature Domain',
    summary: 'A priest of the wild with heavy armour and druidic tricks.',
    tags: { nature: 3, beast: 1, divine: 1 },
    extraArmour: ['heavy'],
    bonusSpells: [
      { level: 1, spells: ['animal-friendship', 'speak-with-animals'] },
      { level: 3, spells: ['barkskin', 'spike-growth'] },
      { level: 5, spells: ['plant-growth', 'sleet-storm'] },
      { level: 7, spells: ['dominate-beast', 'grasping-vine'] },
      { level: 9, spells: ['insect-plague', 'wall-of-stone'] },
    ],
    features: [
      { level: 1, name: 'Acolyte of Nature', summary: 'Learn a Druid cantrip and a nature skill.' },
      { level: 2, name: 'Charm Animals and Plants', summary: 'Channel Divinity: charm nearby beasts and plants.' },
      { level: 8, name: 'Divine Strike', summary: 'Weapon attacks deal extra elemental damage.' },
    ],
    style: ['caster', 'heavy-armour', 'shield'],
  }),
  sc({
    id: 'tempest', classId: 'cleric', name: 'Tempest Domain',
    summary: 'Wielder of thunder and lightning who maximises storm damage.',
    tags: { elemental: 3, wild: 1, vengeance: 1 },
    extraArmour: ['heavy'],
    extraWeapons: ['martial'],
    bonusSpells: [
      { level: 1, spells: ['fog-cloud', 'thunderwave'] },
      { level: 3, spells: ['gust-of-wind', 'shatter'] },
      { level: 5, spells: ['call-lightning', 'sleet-storm'] },
      { level: 7, spells: ['ice-storm', 'freedom-of-movement'] },
      { level: 9, spells: ['destructive-wave', 'insect-plague'] },
    ],
    features: [
      { level: 1, name: 'Wrath of the Storm', summary: 'Reaction: deal thunder or lightning damage to an attacker.' },
      { level: 2, name: 'Destructive Wrath', summary: 'Channel Divinity: maximise thunder or lightning damage.' },
      { level: 8, name: 'Divine Strike', summary: 'Weapon attacks deal extra thunder damage.' },
    ],
    style: ['caster', 'blaster', 'heavy-armour', 'shield'],
  }),
  sc({
    id: 'trickery', classId: 'cleric', name: 'Trickery Domain',
    summary: 'A divine deceiver who sows confusion with illusions and duplicates.',
    tags: { trickster: 3, shadow: 1, charm: 1 },
    bonusSpells: [
      { level: 1, spells: ['charm-person', 'disguise-self'] },
      { level: 3, spells: ['mirror-image', 'pass-without-trace'] },
      { level: 5, spells: ['bestow-curse', 'fear'] },
      { level: 7, spells: ['dimension-door', 'polymorph'] },
      { level: 9, spells: ['dominate-person', 'seeming'] },
    ],
    features: [
      { level: 1, name: 'Blessing of the Trickster', summary: 'Give an ally advantage on Stealth.' },
      { level: 2, name: 'Invoke Duplicity', summary: 'Channel Divinity: create an illusory duplicate.' },
      { level: 8, name: 'Divine Strike', summary: 'Weapon attacks deal extra poison damage.' },
    ],
    style: ['caster', 'support'],
  }),
  sc({
    id: 'war', classId: 'cleric', name: 'War Domain',
    summary: 'A battle priest who strikes extra blows and guides attacks.',
    tags: { martial: 3, divine: 1, protector: 1 },
    abilityPriority: ['WIS', 'STR', 'CON', 'DEX', 'CHA', 'INT'],
    extraArmour: ['heavy'],
    extraWeapons: ['martial'],
    bonusSpells: [
      { level: 1, spells: ['divine-favour', 'shield-of-faith'] },
      { level: 3, spells: ['magic-weapon', 'spiritual-weapon'] },
      { level: 5, spells: ['crusaders-mantle', 'spirit-guardians'] },
      { level: 7, spells: ['freedom-of-movement', 'stoneskin'] },
      { level: 9, spells: ['flame-strike', 'hold-monster'] },
    ],
    features: [
      { level: 1, name: 'War Priest', summary: 'Make a bonus-action weapon attack a few times per rest.' },
      { level: 2, name: 'Guided Strike', summary: 'Channel Divinity: +10 to an attack roll.' },
      { level: 8, name: 'Divine Strike', summary: 'Weapon attacks deal extra damage.' },
    ],
    style: ['melee', 'heavy-armour', 'shield', 'two-handed', 'caster'],
  }),
  sc({
    id: 'death-domain', classId: 'cleric', name: 'Death Domain',
    summary: 'A necromantic priest whose cantrips strike twice.',
    tags: { death: 3, shadow: 1 },
    extraWeapons: ['martial'],
    bonusSpells: [
      { level: 1, spells: ['false-life', 'ray-of-sickness'] },
      { level: 3, spells: ['blindness', 'ray-of-enfeeblement'] },
      { level: 5, spells: ['animate-dead', 'vampiric-touch'] },
      { level: 7, spells: ['blight', 'death-ward'] },
      { level: 9, spells: ['cloudkill', 'contagion'] },
    ],
    features: [
      { level: 1, name: 'Reaper', summary: 'Single-target necromancy cantrips hit two targets.' },
      { level: 2, name: 'Touch of Death', summary: 'Channel Divinity: add heavy necrotic damage on a melee hit.' },
      { level: 6, name: 'Inescapable Destruction', summary: 'Your necrotic damage ignores resistance.' },
    ],
    style: ['caster', 'blaster'],
  }),
  // Druid
  sc({
    id: 'land', classId: 'druid', name: 'Circle of the Land',
    summary: 'A spell-focused druid with bonus spells tied to a chosen land.',
    tags: { nature: 3, scholar: 1, elemental: 1 },
    features: [
      { level: 2, name: 'Bonus Cantrip & Natural Recovery', summary: 'An extra cantrip and recover spell slots on a short rest.' },
      { level: 3, name: 'Circle Spells', summary: 'Gain always-prepared spells from your chosen land.' },
      { level: 6, name: 'Land’s Stride', summary: 'Ignore difficult terrain from plants.' },
      { level: 10, name: 'Nature’s Ward', summary: 'Immune to poison and disease.' },
    ],
    style: ['caster', 'control'],
  }),
  sc({
    id: 'moon', classId: 'druid', name: 'Circle of the Moon',
    summary: 'A shapeshifter who fights on the front line in powerful beast forms.',
    tags: { beast: 3, wild: 2, brute: 1 },
    features: [
      { level: 2, name: 'Combat Wild Shape', summary: 'Wild Shape as a bonus action into stronger forms.' },
      { level: 6, name: 'Primal Strike', summary: 'Beast attacks count as magical; new forms.' },
      { level: 10, name: 'Elemental Wild Shape', summary: 'Transform into elementals.' },
    ],
    style: ['tank', 'shapeshift'],
  }),
  sc({
    id: 'spores', classId: 'druid', name: 'Circle of Spores',
    summary: 'A druid of decay who wields fungal spores and necrotic power.',
    tags: { death: 3, nature: 2 },
    features: [
      { level: 2, name: 'Halo of Spores & Symbiotic Entity', summary: 'Necrotic reaction damage and a temporary-HP combat form.' },
      { level: 6, name: 'Fungal Infestation', summary: 'Raise fallen enemies as zombies.' },
      { level: 10, name: 'Spreading Spores', summary: 'Spread a cloud of spores.' },
    ],
    style: ['melee', 'caster'],
  }),
  sc({
    id: 'stars', classId: 'druid', name: 'Circle of Stars',
    summary: 'A stargazer who takes starry forms to heal, shoot or focus.',
    tags: { light: 2, nature: 1, scholar: 1, healer: 1 },
    features: [
      { level: 2, name: 'Starry Form', summary: 'Archer, Chalice or Dragon constellation forms.' },
      { level: 6, name: 'Cosmic Omen', summary: 'Weal or Woe reactions to modify rolls.' },
      { level: 10, name: 'Twinkling Constellations', summary: 'Starry forms become stronger.' },
    ],
    style: ['caster', 'healer'],
  }),
  // Fighter
  sc({
    id: 'battle-master', classId: 'fighter', name: 'Battle Master',
    summary: 'A tactician who uses manoeuvres to trip, disarm and command.',
    tags: { martial: 3, order: 1, noble: 1 },
    features: [
      { level: 3, name: 'Combat Superiority', summary: 'Superiority dice fuel tactical manoeuvres.' },
      { level: 7, name: 'Know Your Enemy', summary: 'Learn a creature’s strengths and weaknesses.' },
      { level: 10, name: 'Improved Combat Superiority', summary: 'Superiority dice become d10s.' },
    ],
    style: ['melee'],
  }),
  sc({
    id: 'eldritch-knight', classId: 'fighter', name: 'Eldritch Knight',
    summary: 'A warrior-mage who blends weapon skill with abjuration and evocation.',
    tags: { arcane: 2, martial: 2, scholar: 1 },
    abilityPriority: ['STR', 'CON', 'INT', 'DEX', 'WIS', 'CHA'],
    casterType: 'third',
    spellList: 'wizard',
    features: [
      { level: 3, name: 'Spellcasting & Weapon Bond', summary: 'Cast Wizard spells (INT); your weapon can’t be disarmed.' },
      { level: 7, name: 'War Magic', summary: 'Cast a cantrip and make a weapon attack.' },
      { level: 10, name: 'Eldritch Strike', summary: 'Your hits weaken saves against your spells.' },
    ],
    style: ['melee', 'caster'],
  }),
  sc({
    id: 'champion', classId: 'fighter', name: 'Champion',
    summary: 'Simple, robust excellence: more critical hits and athletic prowess.',
    tags: { martial: 3, brute: 1 },
    features: [
      { level: 3, name: 'Improved Critical Hit', summary: 'Score critical hits on a 19 or 20.' },
      { level: 7, name: 'Remarkable Athlete', summary: 'Bonus to STR/DEX/CON checks and jumping.' },
      { level: 10, name: 'Additional Fighting Style', summary: 'Choose a second fighting style.' },
    ],
    style: ['melee'],
  }),
  sc({
    id: 'arcane-archer', classId: 'fighter', name: 'Arcane Archer',
    summary: 'An archer who infuses arrows with magical effects.',
    tags: { ranged: 3, arcane: 2 },
    abilityPriority: ['DEX', 'CON', 'INT', 'WIS', 'STR', 'CHA'],
    features: [
      { level: 3, name: 'Arcane Shot', summary: 'Infuse arrows with magical effects a few times per short rest.' },
      { level: 7, name: 'Curving Shot', summary: 'Redirect a missed magic arrow.' },
      { level: 10, name: 'Arcane Shot Improvement', summary: 'Arcane Shots get stronger.' },
    ],
    style: ['ranged'],
  }),
  // Monk
  sc({
    id: 'open-hand', classId: 'monk', name: 'Way of the Open Hand',
    summary: 'The purest martial artist, adding control to every Flurry.',
    tags: { ascetic: 3, order: 1 },
    features: [
      { level: 3, name: 'Open Hand Technique', summary: 'Flurry of Blows can knock prone, push or topple.' },
      { level: 6, name: 'Wholeness of Body', summary: 'Heal yourself.' },
      { level: 11, name: 'Tranquility', summary: 'Gain Sanctuary after a long rest.' },
    ],
    style: ['unarmed'],
  }),
  sc({
    id: 'shadow-monk', classId: 'monk', name: 'Way of Shadow',
    summary: 'A ninja who uses darkness to teleport and strike unseen.',
    tags: { shadow: 3, finesse: 1, trickster: 1 },
    features: [
      { level: 3, name: 'Shadow Arts', summary: 'Spend ki to cast Darkness, Pass without Trace and more.' },
      { level: 6, name: 'Shadow Step', summary: 'Teleport between shadows with advantage on your next attack.' },
      { level: 11, name: 'Cloak of Shadows', summary: 'Become invisible in darkness.' },
    ],
    style: ['unarmed', 'stealth'],
  }),
  sc({
    id: 'four-elements', classId: 'monk', name: 'Way of the Four Elements',
    summary: 'A monk who channels elemental disciplines through ki.',
    tags: { elemental: 3, ascetic: 1 },
    features: [
      { level: 3, name: 'Elemental Disciplines', summary: 'Spend ki to cast elemental techniques.' },
      { level: 6, name: 'More Disciplines', summary: 'Learn additional disciplines.' },
      { level: 11, name: 'More Disciplines', summary: 'Learn additional disciplines.' },
    ],
    style: ['unarmed', 'caster'],
  }),
  sc({
    id: 'drunken-master', classId: 'monk', name: 'Way of the Drunken Master',
    summary: 'An unpredictable brawler who staggers through attacks.',
    tags: { wild: 2, trickster: 2, charm: 1 },
    features: [
      { level: 3, name: 'Drunken Technique', summary: 'Flurry of Blows also grants Disengage-like mobility.' },
      { level: 6, name: 'Tipsy Sway', summary: 'Redirect missed attacks and get up easily.' },
      { level: 11, name: 'Drunkard’s Luck', summary: 'Spend ki to cancel disadvantage.' },
    ],
    style: ['unarmed'],
  }),
  // Paladin
  sc({
    id: 'devotion', classId: 'paladin', name: 'Oath of Devotion',
    summary: 'The classic knight: honesty, courage and protection.',
    tags: { light: 2, protector: 2, order: 2 },
    bonusSpells: [
      { level: 3, spells: ['protection-from-evil-and-good', 'sanctuary'] },
      { level: 5, spells: ['lesser-restoration', 'silence'] },
      { level: 9, spells: ['beacon-of-hope', 'remove-curse'] },
    ],
    features: [
      { level: 1, name: 'Sacred Weapon', summary: 'Add Charisma to attack rolls with a weapon.' },
      { level: 7, name: 'Aura of Devotion', summary: 'You and allies can’t be Charmed.' },
    ],
    style: ['melee', 'heavy-armour'],
  }),
  sc({
    id: 'ancients', classId: 'paladin', name: 'Oath of the Ancients',
    summary: 'A green knight who defends light and life against despair.',
    tags: { nature: 2, light: 2, protector: 2 },
    bonusSpells: [
      { level: 3, spells: ['ensnaring-strike', 'speak-with-animals'] },
      { level: 5, spells: ['misty-step', 'moonbeam'] },
      { level: 9, spells: ['plant-growth', 'protection-from-energy'] },
    ],
    features: [
      { level: 1, name: 'Healing Radiance', summary: 'Heal nearby allies with Channel Oath.' },
      { level: 7, name: 'Aura of Warding', summary: 'You and allies resist spell damage.' },
    ],
    style: ['melee', 'heavy-armour', 'tank'],
  }),
  sc({
    id: 'vengeance-oath', classId: 'paladin', name: 'Oath of Vengeance',
    summary: 'A relentless avenger who hunts down evil at any cost.',
    tags: { vengeance: 3, martial: 1 },
    bonusSpells: [
      { level: 3, spells: ['bane', 'hunters-mark'] },
      { level: 5, spells: ['hold-person', 'misty-step'] },
      { level: 9, spells: ['haste', 'protection-from-energy'] },
    ],
    features: [
      { level: 1, name: 'Vow of Enmity', summary: 'Gain advantage against a chosen target.' },
      { level: 7, name: 'Relentless Avenger', summary: 'Move after an opportunity attack.' },
    ],
    style: ['melee', 'two-handed'],
  }),
  sc({
    id: 'crown', classId: 'paladin', name: 'Oath of the Crown',
    summary: 'A guardian of law and civilisation who draws attacks onto themself.',
    tags: { order: 3, noble: 2, protector: 2 },
    bonusSpells: [
      { level: 3, spells: ['command', 'compelled-duel'] },
      { level: 5, spells: ['warding-bond', 'spiritual-weapon'] },
      { level: 9, spells: ['crusaders-mantle', 'spirit-guardians'] },
    ],
    features: [
      { level: 1, name: 'Champion Challenge', summary: 'Compel enemies to stay close to you.' },
      { level: 7, name: 'Divine Allegiance', summary: 'Take damage meant for an ally.' },
    ],
    style: ['melee', 'heavy-armour', 'shield', 'tank'],
  }),
  // Ranger
  sc({
    id: 'hunter', classId: 'ranger', name: 'Hunter',
    summary: 'A monster-slayer with tools for single targets or crowds.',
    tags: { vengeance: 2, ranged: 1, martial: 1 },
    features: [
      { level: 3, name: 'Hunter’s Prey', summary: 'Colossus Slayer, Giant Killer or Horde Breaker.' },
      { level: 7, name: 'Defensive Tactics', summary: 'Choose a defensive technique.' },
      { level: 11, name: 'Multiattack', summary: 'Volley or Whirlwind Attack.' },
    ],
    style: [],
  }),
  sc({
    id: 'beast-master', classId: 'ranger', name: 'Beast Master',
    summary: 'A ranger who fights alongside a loyal animal companion.',
    tags: { beast: 3, nature: 1, protector: 1 },
    features: [
      { level: 3, name: 'Ranger’s Companion', summary: 'Summon a permanent animal companion.' },
      { level: 7, name: 'Exceptional Training', summary: 'Your companion gains new abilities.' },
      { level: 11, name: 'Bestial Fury', summary: 'Your companion attacks twice.' },
    ],
    style: ['summon'],
  }),
  sc({
    id: 'gloom-stalker', classId: 'ranger', name: 'Gloom Stalker',
    summary: 'An ambusher at home in darkness who strikes hard on the first turn.',
    tags: { shadow: 3, ranged: 1, finesse: 1 },
    bonusSpells: [
      { level: 3, spells: ['disguise-self'] },
      { level: 5, spells: ['misty-step'] },
      { level: 9, spells: ['fear'] },
    ],
    features: [
      { level: 3, name: 'Dread Ambusher', summary: 'Bonus initiative and an extra attack on your first turn.' },
      { level: 3, name: 'Umbral Sight', summary: 'Darkvision and invisibility to darkvision.' },
      { level: 7, name: 'Iron Mind', summary: 'Proficiency in Wisdom saves.' },
      { level: 11, name: 'Stalker’s Flurry', summary: 'Attack again when you miss.' },
    ],
    style: ['stealth'],
  }),
  sc({
    id: 'swarmkeeper', classId: 'ranger', name: 'Swarmkeeper',
    summary: 'A ranger accompanied by a swarm of nature spirits.',
    tags: { nature: 2, beast: 2, wild: 1 },
    bonusSpells: [
      { level: 3, spells: ['mage-hand', 'faerie-fire'] },
      { level: 5, spells: ['web'] },
      { level: 9, spells: ['gaseous-form'] },
    ],
    features: [
      { level: 3, name: 'Gathered Swarm', summary: 'Your swarm adds damage or moves creatures.' },
      { level: 7, name: 'Writhing Tide', summary: 'Your swarm lets you fly briefly.' },
      { level: 11, name: 'Mighty Swarm', summary: 'Your swarm grows stronger.' },
    ],
    style: [],
  }),
  // Rogue
  sc({
    id: 'thief', classId: 'rogue', name: 'Thief',
    summary: 'A nimble burglar with an extra bonus action every turn.',
    tags: { shadow: 2, trickster: 1, finesse: 2 },
    features: [
      { level: 3, name: 'Fast Hands', summary: 'An additional bonus action each turn.' },
      { level: 3, name: 'Second-Storey Work', summary: 'Improved climbing and jumping.' },
      { level: 9, name: 'Supreme Sneak', summary: 'Advantage on Stealth.' },
    ],
    style: ['ranged', 'dual-wield', 'finesse'],
  }),
  sc({
    id: 'arcane-trickster', classId: 'rogue', name: 'Arcane Trickster',
    summary: 'A rogue who adds enchantment and illusion magic to their bag of tricks.',
    tags: { arcane: 2, trickster: 2, charm: 1 },
    abilityPriority: ['DEX', 'INT', 'CON', 'WIS', 'CHA', 'STR'],
    casterType: 'third',
    spellList: 'wizard',
    features: [
      { level: 3, name: 'Spellcasting & Mage Hand Legerdemain', summary: 'Cast Wizard spells (INT); an invisible Mage Hand.' },
      { level: 9, name: 'Magical Ambush', summary: 'Spells cast while hidden are harder to resist.' },
    ],
    style: ['finesse', 'caster'],
  }),
  sc({
    id: 'assassin', classId: 'rogue', name: 'Assassin',
    summary: 'A master of ambushes who crits surprised targets.',
    tags: { shadow: 3, vengeance: 2, death: 1 },
    features: [
      { level: 3, name: 'Assassinate', summary: 'Advantage against creatures that haven’t acted; hits on surprised creatures are critical.' },
      { level: 9, name: 'Infiltration Expertise', summary: 'Create false identities.' },
    ],
    style: ['melee', 'stealth'],
  }),
  sc({
    id: 'swashbuckler', classId: 'rogue', name: 'Swashbuckler',
    summary: 'A charming duellist who fights one-on-one with flair.',
    tags: { charm: 2, finesse: 2, martial: 1 },
    features: [
      { level: 3, name: 'Fancy Footwork & Rakish Audacity', summary: 'Sneak Attack in one-on-one duels; Charisma to initiative.' },
      { level: 3, name: 'Dirty Tricks', summary: 'Sand throws, disarms and taunts.' },
      { level: 9, name: 'Panache', summary: 'Charm or taunt with your bravado.' },
    ],
    style: ['melee', 'finesse', 'dual-wield'],
  }),
  // Sorcerer
  sc({
    id: 'wild-magic-sorcerer', classId: 'sorcerer', name: 'Wild Magic',
    summary: 'Chaotic magic that surges unpredictably, for better or worse.',
    tags: { wild: 3, innate: 1, trickster: 1 },
    features: [
      { level: 1, name: 'Wild Magic Surge & Tides of Chaos', summary: 'Random surges; gain advantage then risk a surge.' },
      { level: 6, name: 'Bend Luck', summary: 'Spend sorcery points to modify a roll.' },
    ],
    style: ['caster', 'blaster'],
  }),
  sc({
    id: 'draconic', classId: 'sorcerer', name: 'Draconic Bloodline',
    summary: 'Dragon blood gives toughness, natural armour and elemental power.',
    tags: { elemental: 3, noble: 1, innate: 1 },
    features: [
      { level: 1, name: 'Draconic Resilience', summary: '+1 HP per level and natural AC 13 + DEX.' },
      { level: 6, name: 'Elemental Affinity', summary: 'Add Charisma to damage of your ancestry’s element.' },
    ],
    style: ['caster', 'blaster'],
  }),
  sc({
    id: 'storm', classId: 'sorcerer', name: 'Storm Sorcery',
    summary: 'Storm-born magic that lets you fly short distances after casting.',
    tags: { elemental: 3, wild: 1 },
    features: [
      { level: 1, name: 'Tempestuous Magic', summary: 'Fly a short distance as a bonus action after casting.' },
      { level: 6, name: 'Heart of the Storm', summary: 'Resist lightning and thunder; damage nearby enemies.' },
    ],
    style: ['caster', 'blaster'],
  }),
  sc({
    id: 'shadow-sorcerer', classId: 'sorcerer', name: 'Shadow Magic',
    summary: 'Magic from the Shadowfell: see in darkness and refuse to die.',
    tags: { shadow: 3, death: 2 },
    bonusSpells: [{ level: 3, spells: ['darkness'] }],
    features: [
      { level: 1, name: 'Eyes of the Dark & Strength of the Grave', summary: 'Superior darkvision; chance to stay at 1 HP.' },
      { level: 6, name: 'Hound of Ill Omen', summary: 'Summon a shadowy hound that hampers a target.' },
    ],
    style: ['caster', 'control'],
  }),
  // Warlock
  sc({
    id: 'fiend', classId: 'warlock', name: 'The Fiend',
    summary: 'A pact with a lower-planes power, rewarding kills with vitality.',
    tags: { pact: 2, elemental: 2, vengeance: 1 },
    bonusSpells: [
      { level: 1, spells: ['burning-hands', 'command'] },
      { level: 3, spells: ['blindness', 'scorching-ray'] },
      { level: 5, spells: ['fireball', 'stinking-cloud'] },
    ],
    features: [
      { level: 1, name: 'Dark One’s Blessing', summary: 'Gain temporary hit points when you reduce an enemy to 0 HP.' },
      { level: 6, name: 'Dark One’s Own Luck', summary: 'Add a d10 to an ability check or save.' },
      { level: 10, name: 'Fiendish Resilience', summary: 'Resistance to a chosen damage type.' },
    ],
    style: ['caster', 'blaster'],
  }),
  sc({
    id: 'great-old-one', classId: 'warlock', name: 'The Great Old One',
    summary: 'A pact with an unknowable entity that grants psychic power.',
    tags: { pact: 2, scholar: 1, trickster: 1, death: 1 },
    bonusSpells: [
      { level: 1, spells: ['dissonant-whispers', 'tashas-hideous-laughter'] },
      { level: 3, spells: ['detect-thoughts', 'phantasmal-force'] },
    ],
    features: [
      { level: 1, name: 'Mortal Reminder', summary: 'Critical hits frighten nearby enemies.' },
      { level: 6, name: 'Entropic Ward', summary: 'Impose disadvantage on an attack and gain advantage after.' },
      { level: 10, name: 'Thought Shield', summary: 'Resistance to psychic damage.' },
    ],
    style: ['caster', 'control'],
  }),
  sc({
    id: 'archfey', classId: 'warlock', name: 'The Archfey',
    summary: 'A pact with a fey lord, granting beguiling and misleading magic.',
    tags: { pact: 2, charm: 2, nature: 1, trickster: 1 },
    bonusSpells: [
      { level: 1, spells: ['faerie-fire', 'sleep'] },
      { level: 3, spells: ['calm-emotions', 'phantasmal-force'] },
    ],
    features: [
      { level: 1, name: 'Fey Presence', summary: 'Charm or frighten nearby creatures.' },
      { level: 6, name: 'Misty Escape', summary: 'Turn invisible and teleport when hurt.' },
      { level: 10, name: 'Beguiling Defences', summary: 'Immune to Charmed; turn charms back.' },
    ],
    style: ['caster', 'control'],
  }),
  sc({
    id: 'hexblade', classId: 'warlock', name: 'The Hexblade',
    summary: 'A pact with a sentient weapon: fight in melee using Charisma.',
    tags: { pact: 2, martial: 2, shadow: 1 },
    abilityPriority: ['CHA', 'CON', 'DEX', 'STR', 'WIS', 'INT'],
    extraArmour: ['medium', 'shield'],
    extraWeapons: ['martial'],
    bonusSpells: [
      { level: 1, spells: ['shield', 'wrathful-smite'] },
      { level: 3, spells: ['blur', 'branding-smite'] },
    ],
    features: [
      { level: 1, name: 'Hex Warrior', summary: 'Use Charisma for attacks with a bound weapon.' },
      { level: 1, name: 'Hexblade’s Curse', summary: 'Curse a target for bonus damage and expanded crits.' },
      { level: 6, name: 'Accursed Specter', summary: 'Raise a slain humanoid as a spectral servant.' },
      { level: 10, name: 'Armour of Hexes', summary: 'Attacks from your cursed target may miss you.' },
    ],
    style: ['melee', 'shield', 'two-handed', 'caster'],
  }),
  // Wizard
  ...(
    [
      ['abjuration', 'Abjuration', 'Wards and protective magic; an Arcane Ward absorbs damage.', { protector: 3, order: 1 }, 'Arcane Ward', 'A magical ward absorbs damage and is recharged by casting Abjuration spells.', ['caster', 'tank']],
      ['conjuration', 'Conjuration', 'Summoning and teleportation.', { beast: 1, trickster: 1, scholar: 1 }, 'Minor Conjuration', 'Conjure a mundane object; Benign Transposition teleport.', ['caster', 'summon']],
      ['divination', 'Divination', 'Foresight: replace dice rolls with Portent.', { scholar: 3, light: 1 }, 'Portent', 'After a long rest, roll two d20s and use them to replace rolls.', ['caster', 'control']],
      ['enchantment', 'Enchantment', 'Charms that bend minds to your will.', { charm: 3, trickster: 1 }, 'Hypnotic Gaze', 'Charm and stun a nearby creature.', ['caster', 'control']],
      ['evocation', 'Evocation', 'Raw destructive power that spares your allies.', { elemental: 3 }, 'Sculpt Spells', 'Allies automatically succeed against your evocation spells.', ['caster', 'blaster']],
      ['necromancy', 'Necromancy', 'Mastery of death: drain life and raise servants.', { death: 3 }, 'Grim Harvest', 'Heal when your spells kill creatures.', ['caster', 'summon']],
      ['illusion', 'Illusion', 'Deceive the senses with improved illusions.', { trickster: 3, shadow: 1 }, 'Improved Minor Illusion', 'Cast Minor Illusion as a bonus action.', ['caster', 'control']],
      ['transmutation', 'Transmutation', 'Alter matter; carry a Transmuter’s Stone.', { scholar: 2, nature: 1 }, 'Experimental Alchemy', 'Brew potions more effectively.', ['caster']],
    ] as const
  ).map(([id, name, summary, tags, feat, featSummary, style]) =>
    sc({
      id,
      classId: 'wizard',
      name: `School of ${name}`,
      summary,
      tags: { arcane: 1, ...tags },
      features: [
        { level: 2, name: feat, summary: featSummary },
        { level: 6, name: 'School Feature', summary: `A stronger ${name.toLowerCase()} feature.` },
        { level: 10, name: 'School Feature', summary: `A capstone ${name.toLowerCase()} feature for this level range.` },
      ],
      style: [...style],
    }),
  ),
  sc({
    id: 'bladesinging', classId: 'wizard', name: 'Bladesinging',
    summary: 'An elegant wizard who fights in melee, boosting AC with a Bladesong.',
    tags: { arcane: 2, finesse: 2, music: 1 },
    abilityPriority: ['INT', 'DEX', 'CON', 'WIS', 'CHA', 'STR'],
    extraArmour: ['light'],
    extraWeapons: ['rapier', 'longsword', 'shortsword', 'scimitar'],
    extraAttackAt: 6,
    features: [
      { level: 2, name: 'Bladesong', summary: 'Add Intelligence to AC, gain speed and concentration bonuses.' },
      { level: 6, name: 'Extra Attack', summary: 'Attack twice; one attack can be a cantrip.' },
      { level: 10, name: 'Song of Defence', summary: 'Spend a spell slot to reduce damage.' },
    ],
    style: ['melee', 'finesse', 'caster'],
  }),
];

export const subclassById = (id: string) => SUBCLASSES.find((s) => s.id === id);
export const subclassesFor = (classId: string) => SUBCLASSES.filter((s) => s.classId === classId);
