import type { Feat } from './schema';

export const ABILITY_IMPROVEMENT = 'ability-improvement';

export const FEATS: Feat[] = [
  { id: ABILITY_IMPROVEMENT, name: 'Ability Improvement', summary: 'Increase one ability score by 2, or two ability scores by 1 (max 20).', tags: {}, synergy: [], repeatable: true },
  { id: 'actor', name: 'Actor', summary: '+1 CHA; expertise in Deception and Performance.', abilityPlus: ['CHA'], tags: { charm: 3, trickster: 2, music: 1 }, synergy: ['skills'] },
  { id: 'alert', name: 'Alert', summary: '+5 Initiative and you can’t be surprised.', tags: { shadow: 1, protector: 1, scholar: 1 }, synergy: ['caster', 'stealth', 'control'] },
  { id: 'athlete', name: 'Athlete', summary: '+1 STR or DEX; stand up from prone cheaply and jump further.', abilityPlus: ['STR', 'DEX'], tags: { martial: 1, finesse: 1 }, synergy: ['unarmed'] },
  { id: 'charger', name: 'Charger', summary: 'Charge attacks that deal extra damage or shove.', tags: { brute: 2 }, synergy: ['melee'] },
  { id: 'crossbow-expert', name: 'Crossbow Expert', summary: 'No disadvantage firing at close range; more piercing damage.', tags: { ranged: 2 }, synergy: ['ranged'] },
  { id: 'defensive-duellist', name: 'Defensive Duellist', summary: 'Reaction: add proficiency to AC when wielding a finesse weapon.', requires: { ability: { ability: 'DEX', min: 13 } }, tags: { finesse: 2, protector: 1 }, synergy: ['finesse'] },
  { id: 'dual-wielder', name: 'Dual Wielder', summary: '+1 AC while dual wielding; dual wield non-light weapons.', tags: { finesse: 1, martial: 1 }, synergy: ['dual-wield'] },
  { id: 'dungeon-delver', name: 'Dungeon Delver', summary: 'Advantage to find and resist traps.', tags: { shadow: 1, scholar: 1 }, synergy: ['skills'] },
  { id: 'durable', name: 'Durable', summary: '+1 CON; regain full HP on a short rest.', abilityPlus: ['CON'], tags: { protector: 1 }, synergy: ['tank'] },
  { id: 'elemental-adept', name: 'Elemental Adept', summary: 'Your spells of one element ignore resistance and roll at least 2 per die.', requires: { spellcaster: true }, tags: { elemental: 3 }, synergy: ['blaster'] },
  { id: 'great-weapon-master', name: 'Great Weapon Master', summary: 'Toggle −5 to hit for +10 damage with heavy weapons; bonus attack on kills and crits.', tags: { brute: 3, martial: 1 }, synergy: ['two-handed'] },
  { id: 'heavily-armoured', name: 'Heavily Armoured', summary: '+1 STR; proficiency with heavy armour.', abilityPlus: ['STR'], requires: { armour: 'medium' }, tags: { protector: 2 }, synergy: [] },
  { id: 'heavy-armour-master', name: 'Heavy Armour Master', summary: '+1 STR; reduce non-magical physical damage by 3 in heavy armour.', abilityPlus: ['STR'], requires: { armour: 'heavy' }, tags: { protector: 3 }, synergy: ['heavy-armour', 'tank'] },
  { id: 'lightly-armoured', name: 'Lightly Armoured', summary: '+1 STR or DEX; proficiency with light armour.', abilityPlus: ['STR', 'DEX'], tags: {}, synergy: [] },
  { id: 'lucky', name: 'Lucky', summary: 'Three luck points per long rest for advantage on rolls or to make enemies reroll.', tags: { trickster: 1, wild: 1 }, synergy: ['melee', 'ranged', 'caster', 'skills'] },
  { id: 'mage-slayer', name: 'Mage Slayer', summary: 'Punish nearby spellcasters and resist their spells.', tags: { vengeance: 2, martial: 1 }, synergy: ['melee'] },
  { id: 'magic-initiate', name: 'Magic Initiate', summary: 'Learn two cantrips and one 1st-level spell from another class.', tags: { arcane: 1, divine: 1, pact: 1, nature: 1 }, synergy: ['caster'] },
  { id: 'martial-adept', name: 'Martial Adept', summary: 'Learn two Battle Master manoeuvres and gain a superiority die.', tags: { martial: 2 }, synergy: ['melee', 'ranged'] },
  { id: 'medium-armour-master', name: 'Medium Armour Master', summary: 'Medium armour no longer hampers Stealth and allows +3 DEX to AC.', requires: { armour: 'medium' }, tags: { finesse: 1, protector: 1 }, synergy: ['shield'] },
  { id: 'mobile', name: 'Mobile', summary: '+3 m speed; Dash ignores difficult terrain; no opportunity attacks from creatures you attacked.', tags: { finesse: 2, wild: 1 }, synergy: ['melee', 'unarmed'] },
  { id: 'moderately-armoured', name: 'Moderately Armoured', summary: '+1 STR or DEX; proficiency with medium armour and shields.', abilityPlus: ['STR', 'DEX'], requires: { armour: 'light' }, tags: { protector: 1 }, synergy: ['caster'] },
  { id: 'performer', name: 'Performer', summary: '+1 CHA; proficiency with musical instruments.', abilityPlus: ['CHA'], tags: { music: 3, charm: 1 }, synergy: [] },
  { id: 'polearm-master', name: 'Polearm Master', summary: 'Bonus-action butt-end attack; opportunity attacks when enemies approach.', tags: { martial: 2, protector: 1 }, synergy: ['two-handed', 'melee'] },
  { id: 'resilient', name: 'Resilient', summary: '+1 to an ability and proficiency in its saving throws (often CON for concentration).', abilityPlus: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'], tags: { protector: 1, order: 1 }, synergy: ['concentration'] },
  { id: 'ritual-caster', name: 'Ritual Caster', summary: 'Learn two ritual spells that you can cast without slots.', requires: { ability: { ability: 'INT', min: 13 } }, tags: { scholar: 2, arcane: 1 }, synergy: [] },
  { id: 'savage-attacker', name: 'Savage Attacker', summary: 'Roll melee weapon damage twice and use the higher result.', tags: { brute: 2 }, synergy: ['melee'] },
  { id: 'sentinel', name: 'Sentinel', summary: 'Opportunity attacks stop movement; punish enemies who attack allies.', tags: { protector: 3, order: 1 }, synergy: ['tank', 'melee'] },
  { id: 'sharpshooter', name: 'Sharpshooter', summary: 'Toggle −5 to hit for +10 damage with ranged weapons; ignore high-ground penalties.', tags: { ranged: 3 }, synergy: ['ranged'] },
  { id: 'shield-master', name: 'Shield Master', summary: 'Add shield AC to Dexterity saves and take no damage on success.', tags: { protector: 2 }, synergy: ['shield'] },
  { id: 'skilled', name: 'Skilled', summary: 'Gain proficiency in three skills.', tags: { scholar: 1, trickster: 1 }, synergy: ['skills'] },
  { id: 'spell-sniper', name: 'Spell Sniper', summary: 'Learn an attack cantrip; spell attacks crit on 19–20.', requires: { spellcaster: true }, tags: { ranged: 2, arcane: 1 }, synergy: ['blaster'] },
  { id: 'tavern-brawler', name: 'Tavern Brawler', summary: '+1 STR or CON; add Strength twice to unarmed, improvised and thrown attacks.', abilityPlus: ['STR', 'CON'], tags: { brute: 2, wild: 1 }, synergy: ['unarmed', 'throw'] },
  { id: 'tough', name: 'Tough', summary: '+2 hit points per level.', tags: { protector: 2, brute: 1 }, synergy: ['tank'] },
  { id: 'war-caster', name: 'War Caster', summary: 'Advantage on concentration saves; cast Shocking Grasp as an opportunity attack.', requires: { spellcaster: true }, tags: { arcane: 1, martial: 1 }, synergy: ['concentration'] },
  { id: 'weapon-master', name: 'Weapon Master', summary: '+1 STR or DEX; proficiency with four weapons.', abilityPlus: ['STR', 'DEX'], tags: { martial: 2 }, synergy: [] },
];

export const featById = (id: string) => FEATS.find((f) => f.id === id);
