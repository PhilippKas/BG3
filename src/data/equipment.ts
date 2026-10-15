import type { BaseArmour, BaseWeapon } from './schema';

export const WEAPONS: BaseWeapon[] = [
  // Simple melee
  { id: 'club', name: 'Club', category: 'simple', kind: 'melee', damage: '1d4', damageType: 'Bludgeoning', properties: ['light'] },
  { id: 'dagger', name: 'Dagger', category: 'simple', kind: 'melee', damage: '1d4', damageType: 'Piercing', properties: ['finesse', 'light', 'thrown'] },
  { id: 'greatclub', name: 'Greatclub', category: 'simple', kind: 'melee', damage: '1d8', damageType: 'Bludgeoning', properties: ['two-handed'] },
  { id: 'handaxe', name: 'Handaxe', category: 'simple', kind: 'melee', damage: '1d6', damageType: 'Slashing', properties: ['light', 'thrown'] },
  { id: 'javelin', name: 'Javelin', category: 'simple', kind: 'melee', damage: '1d6', damageType: 'Piercing', properties: ['thrown'] },
  { id: 'light-hammer', name: 'Light Hammer', category: 'simple', kind: 'melee', damage: '1d4', damageType: 'Bludgeoning', properties: ['light', 'thrown'] },
  { id: 'mace', name: 'Mace', category: 'simple', kind: 'melee', damage: '1d6', damageType: 'Bludgeoning', properties: [] },
  { id: 'quarterstaff', name: 'Quarterstaff', category: 'simple', kind: 'melee', damage: '1d6', versatile: '1d8', damageType: 'Bludgeoning', properties: ['versatile'] },
  { id: 'sickle', name: 'Sickle', category: 'simple', kind: 'melee', damage: '1d4', damageType: 'Slashing', properties: ['light'] },
  { id: 'spear', name: 'Spear', category: 'simple', kind: 'melee', damage: '1d6', versatile: '1d8', damageType: 'Piercing', properties: ['thrown', 'versatile'] },
  // Simple ranged
  { id: 'light-crossbow', name: 'Light Crossbow', category: 'simple', kind: 'ranged', damage: '1d8', damageType: 'Piercing', properties: ['two-handed'] },
  { id: 'shortbow', name: 'Shortbow', category: 'simple', kind: 'ranged', damage: '1d6', damageType: 'Piercing', properties: ['two-handed'] },
  // Martial melee
  { id: 'battleaxe', name: 'Battleaxe', category: 'martial', kind: 'melee', damage: '1d8', versatile: '1d10', damageType: 'Slashing', properties: ['versatile'] },
  { id: 'flail', name: 'Flail', category: 'martial', kind: 'melee', damage: '1d8', damageType: 'Bludgeoning', properties: [] },
  { id: 'glaive', name: 'Glaive', category: 'martial', kind: 'melee', damage: '1d10', damageType: 'Slashing', properties: ['heavy', 'reach', 'two-handed'] },
  { id: 'greataxe', name: 'Greataxe', category: 'martial', kind: 'melee', damage: '1d12', damageType: 'Slashing', properties: ['heavy', 'two-handed'] },
  { id: 'greatsword', name: 'Greatsword', category: 'martial', kind: 'melee', damage: '2d6', damageType: 'Slashing', properties: ['heavy', 'two-handed'] },
  { id: 'halberd', name: 'Halberd', category: 'martial', kind: 'melee', damage: '1d10', damageType: 'Slashing', properties: ['heavy', 'reach', 'two-handed'] },
  { id: 'longsword', name: 'Longsword', category: 'martial', kind: 'melee', damage: '1d8', versatile: '1d10', damageType: 'Slashing', properties: ['versatile'] },
  { id: 'maul', name: 'Maul', category: 'martial', kind: 'melee', damage: '2d6', damageType: 'Bludgeoning', properties: ['heavy', 'two-handed'] },
  { id: 'morningstar', name: 'Morningstar', category: 'martial', kind: 'melee', damage: '1d8', damageType: 'Piercing', properties: [] },
  { id: 'pike', name: 'Pike', category: 'martial', kind: 'melee', damage: '1d10', damageType: 'Piercing', properties: ['heavy', 'reach', 'two-handed'] },
  { id: 'rapier', name: 'Rapier', category: 'martial', kind: 'melee', damage: '1d8', damageType: 'Piercing', properties: ['finesse'] },
  { id: 'scimitar', name: 'Scimitar', category: 'martial', kind: 'melee', damage: '1d6', damageType: 'Slashing', properties: ['finesse', 'light'] },
  { id: 'shortsword', name: 'Shortsword', category: 'martial', kind: 'melee', damage: '1d6', damageType: 'Piercing', properties: ['finesse', 'light'] },
  { id: 'trident', name: 'Trident', category: 'martial', kind: 'melee', damage: '1d6', versatile: '1d8', damageType: 'Piercing', properties: ['thrown', 'versatile'] },
  { id: 'war-pick', name: 'War Pick', category: 'martial', kind: 'melee', damage: '1d8', damageType: 'Piercing', properties: [] },
  { id: 'warhammer', name: 'Warhammer', category: 'martial', kind: 'melee', damage: '1d8', versatile: '1d10', damageType: 'Bludgeoning', properties: ['versatile'] },
  // Martial ranged
  { id: 'hand-crossbow', name: 'Hand Crossbow', category: 'martial', kind: 'ranged', damage: '1d6', damageType: 'Piercing', properties: ['light'] },
  { id: 'heavy-crossbow', name: 'Heavy Crossbow', category: 'martial', kind: 'ranged', damage: '1d10', damageType: 'Piercing', properties: ['heavy', 'two-handed'] },
  { id: 'longbow', name: 'Longbow', category: 'martial', kind: 'ranged', damage: '1d8', damageType: 'Piercing', properties: ['heavy', 'two-handed'] },
];

export const ARMOURS: BaseArmour[] = [
  { id: 'padded', name: 'Padded Armour', category: 'light', ac: 11, dexCap: null, stealthDisadvantage: true },
  { id: 'leather', name: 'Leather Armour', category: 'light', ac: 11, dexCap: null, stealthDisadvantage: false },
  { id: 'studded-leather', name: 'Studded Leather Armour', category: 'light', ac: 12, dexCap: null, stealthDisadvantage: false },
  { id: 'hide', name: 'Hide Armour', category: 'medium', ac: 12, dexCap: 2, stealthDisadvantage: false },
  { id: 'chain-shirt', name: 'Chain Shirt', category: 'medium', ac: 13, dexCap: 2, stealthDisadvantage: false },
  { id: 'scale-mail', name: 'Scale Mail', category: 'medium', ac: 14, dexCap: 2, stealthDisadvantage: true },
  { id: 'breastplate', name: 'Breastplate', category: 'medium', ac: 14, dexCap: 2, stealthDisadvantage: false },
  { id: 'half-plate', name: 'Half Plate Armour', category: 'medium', ac: 15, dexCap: 2, stealthDisadvantage: true },
  { id: 'ring-mail', name: 'Ring Mail', category: 'heavy', ac: 14, dexCap: 0, stealthDisadvantage: true },
  { id: 'chain-mail', name: 'Chain Mail', category: 'heavy', ac: 16, dexCap: 0, stealthDisadvantage: true },
  { id: 'splint', name: 'Splint Armour', category: 'heavy', ac: 17, dexCap: 0, stealthDisadvantage: true },
  { id: 'plate', name: 'Plate Armour', category: 'heavy', ac: 18, dexCap: 0, stealthDisadvantage: true },
];

export const SHIELD_AC = 2;

export const weaponById = (id: string) => WEAPONS.find((w) => w.id === id);
