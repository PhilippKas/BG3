import type { Choice } from './schema';

export const FIGHTING_STYLES: (Choice & { classes: string[] })[] = [
  { id: 'archery', name: 'Archery', summary: '+2 to ranged weapon attack rolls.', tags: { ranged: 3 }, rating: 3, synergy: ['ranged'], classes: ['fighter', 'ranger'] },
  { id: 'defence', name: 'Defence', summary: '+1 AC while wearing armour.', tags: { protector: 2 }, rating: 2, synergy: ['tank', 'heavy-armour'], classes: ['fighter', 'paladin', 'ranger'] },
  { id: 'duelling', name: 'Duelling', summary: '+2 damage with a one-handed weapon and no other weapon.', tags: { finesse: 1, martial: 1 }, rating: 2, synergy: ['shield', 'finesse'], classes: ['fighter', 'paladin', 'ranger', 'bard'] },
  { id: 'great-weapon-fighting', name: 'Great Weapon Fighting', summary: 'Reroll 1s and 2s on two-handed weapon damage.', tags: { brute: 2 }, rating: 2, synergy: ['two-handed'], classes: ['fighter', 'paladin'] },
  { id: 'protection', name: 'Protection', summary: 'Reaction: impose disadvantage on an attack against a nearby ally (needs a shield).', tags: { protector: 3 }, rating: 1, synergy: ['shield'], classes: ['fighter', 'paladin'] },
  { id: 'two-weapon-fighting', name: 'Two-Weapon Fighting', summary: 'Add your ability modifier to off-hand attack damage.', tags: { finesse: 2 }, rating: 2, synergy: ['dual-wield'], classes: ['fighter', 'ranger', 'bard'] },
];

export const METAMAGIC: Choice[] = [
  { id: 'careful', name: 'Careful Spell', summary: 'Allies automatically succeed on saves against your spell.', tags: { protector: 1 }, rating: 1 },
  { id: 'distant', name: 'Distant Spell', summary: 'Increase a spell’s range; touch spells reach 9 m.', tags: { ranged: 1 }, rating: 1 },
  { id: 'extended', name: 'Extended Spell', summary: 'Double the duration of a spell.', tags: { order: 1 }, rating: 1 },
  { id: 'heightened', name: 'Heightened Spell', summary: 'Targets have disadvantage on their first save.', tags: { trickster: 1, charm: 1 }, rating: 2 },
  { id: 'quickened', name: 'Quickened Spell', summary: 'Cast an action spell as a bonus action.', tags: { elemental: 2, wild: 1 }, rating: 3 },
  { id: 'twinned', name: 'Twinned Spell', summary: 'A single-target spell hits a second creature.', tags: { healer: 1, charm: 1 }, rating: 3 },
];

export const PACT_BOONS: Choice[] = [
  { id: 'pact-of-the-blade', name: 'Pact of the Blade', summary: 'Bind a weapon; it becomes magical and uses Charisma.', tags: { martial: 3 }, rating: 2, synergy: ['melee'] },
  { id: 'pact-of-the-chain', name: 'Pact of the Chain', summary: 'An improved familiar (imp, quasit, pseudodragon or sprite).', tags: { beast: 2, trickster: 1 }, rating: 2, synergy: ['summon'] },
  { id: 'pact-of-the-tome', name: 'Pact of the Tome', summary: 'Learn three extra cantrips from any class.', tags: { scholar: 3, arcane: 1 }, rating: 2, synergy: ['caster'] },
];

export const INVOCATIONS: Choice[] = [
  { id: 'agonising-blast', name: 'Agonising Blast', summary: 'Add Charisma to Eldritch Blast damage.', tags: { pact: 2, elemental: 1 }, rating: 3, synergy: ['blaster'] },
  { id: 'repelling-blast', name: 'Repelling Blast', summary: 'Eldritch Blast pushes targets back.', tags: { protector: 1, wild: 1 }, rating: 3, synergy: ['blaster'] },
  { id: 'devils-sight', name: 'Devil’s Sight', summary: 'See normally in magical darkness.', tags: { shadow: 2 }, rating: 2 },
  { id: 'armour-of-shadows', name: 'Armour of Shadows', summary: 'Cast Mage Armour at will.', tags: { shadow: 1, protector: 1 }, rating: 2 },
  { id: 'beast-speech', name: 'Beast Speech', summary: 'Cast Speak with Animals at will.', tags: { beast: 2 }, rating: 1 },
  { id: 'beguiling-influence', name: 'Beguiling Influence', summary: 'Proficiency in Deception and Persuasion.', tags: { charm: 2 }, rating: 1 },
  { id: 'fiendish-vigour', name: 'Fiendish Vigour', summary: 'Cast False Life at will.', tags: { death: 1 }, rating: 1 },
  { id: 'mask-of-many-faces', name: 'Mask of Many Faces', summary: 'Cast Disguise Self at will.', tags: { trickster: 2 }, rating: 1 },
  { id: 'misty-visions', name: 'Misty Visions', summary: 'Cast Silent Image at will.', tags: { trickster: 1 }, rating: 1 },
  { id: 'thief-of-five-fates', name: 'Thief of Five Fates', summary: 'Cast Bane once per long rest.', tags: { trickster: 1 }, rating: 1 },
  { id: 'book-of-ancient-secrets', name: 'Book of Ancient Secrets', summary: 'Learn ritual spells.', requires: 'pact-of-the-tome', tags: { scholar: 2 }, rating: 2 },
  { id: 'one-with-shadows', name: 'One with Shadows', summary: 'Turn invisible in dim light or darkness.', minLevel: 5, tags: { shadow: 3 }, rating: 2 },
  { id: 'mire-the-mind', name: 'Mire the Mind', summary: 'Cast Slow once per long rest.', minLevel: 5, tags: { trickster: 1 }, rating: 1 },
  { id: 'sign-of-ill-omen', name: 'Sign of Ill Omen', summary: 'Cast Bestow Curse once per long rest.', minLevel: 5, tags: { death: 1 }, rating: 1 },
  { id: 'thirsting-blade', name: 'Thirsting Blade', summary: 'Attack twice with your pact weapon.', minLevel: 5, requires: 'pact-of-the-blade', tags: { martial: 3 }, rating: 3, synergy: ['melee'] },
  { id: 'dreadful-word', name: 'Dreadful Word', summary: 'Cast Confusion once per long rest.', minLevel: 7, tags: { trickster: 1 }, rating: 1 },
  { id: 'sculptor-of-flesh', name: 'Sculptor of Flesh', summary: 'Cast Polymorph once per long rest.', minLevel: 7, tags: { wild: 1 }, rating: 2 },
  { id: 'minions-of-chaos', name: 'Minions of Chaos', summary: 'Cast Conjure Elemental once per long rest.', minLevel: 9, tags: { elemental: 1 }, rating: 1, synergy: ['summon'] },
  { id: 'otherworldly-leap', name: 'Otherworldly Leap', summary: 'Cast Enhance Leap at will.', minLevel: 9, tags: { wild: 1 }, rating: 1 },
  { id: 'whispers-of-the-grave', name: 'Whispers of the Grave', summary: 'Cast Speak with Dead at will.', minLevel: 9, tags: { death: 2 }, rating: 1 },
  { id: 'ascendant-step', name: 'Ascendant Step', summary: 'Cast Levitate on yourself at will.', minLevel: 9, tags: { wild: 1 }, rating: 1 },
  { id: 'lifedrinker', name: 'Lifedrinker', summary: 'Pact weapon hits deal extra necrotic damage equal to Charisma.', minLevel: 12, requires: 'pact-of-the-blade', tags: { martial: 2, death: 1 }, rating: 3, synergy: ['melee'] },
];
