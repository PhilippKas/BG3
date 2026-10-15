import spellsJson from './spells.json';
import itemsJson from './items.json';
import type { Item, Spell } from './schema';

export { RACES, raceById } from './races';
export { CLASSES, classById } from './classes';
export { SUBCLASSES, subclassById, subclassesFor } from './subclasses';
export { BACKGROUNDS, backgroundById } from './backgrounds';
export { FEATS, featById, ABILITY_IMPROVEMENT } from './feats';
export { FIGHTING_STYLES, METAMAGIC, PACT_BOONS, INVOCATIONS } from './choices';
export { QUESTIONS } from './questionnaire';
export { WEAPONS, ARMOURS, SHIELD_AC, weaponById } from './equipment';

// JSON data is validated by `npm run validate-data` and the data tests.
export const SPELLS = spellsJson as Spell[];
export const ITEMS = itemsJson as Item[];

const spellIndex = new Map(SPELLS.map((s) => [s.id, s]));
export const spellById = (id: string) => spellIndex.get(id);
