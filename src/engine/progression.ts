import type { CasterType, ClassDef, Subclass } from '../data/schema';

const FULL: number[][] = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
];

const HALF: number[][] = [[], [2], [3], [3], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3, 2], [4, 3, 2], [4, 3, 3], [4, 3, 3]];

const THIRD: number[][] = [[], [], [2], [3], [3], [3], [4, 2], [4, 2], [4, 2], [4, 3], [4, 3], [4, 3]];

/** Warlock pact slots: [count, slot level]. */
const PACT: [number, number][] = [
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 2],
  [2, 3],
  [2, 3],
  [2, 4],
  [2, 4],
  [2, 5],
  [2, 5],
  [3, 5],
  [3, 5],
];

const THIRD_CANTRIPS = [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3];
const THIRD_KNOWN = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8];
const INVOCATIONS = [0, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6];

export const proficiencyBonus = (level: number) => 2 + Math.floor((level - 1) / 4);

export function effectiveCaster(cls: ClassDef, sub?: Subclass): CasterType {
  if (cls.casterType !== 'none') return cls.casterType;
  return sub?.casterType ?? 'none';
}

/** Spell slots per spell level (index 0 = 1st-level slots). */
export function spellSlots(caster: CasterType, level: number): number[] {
  const i = level - 1;
  switch (caster) {
    case 'full':
      return FULL[i] ?? [];
    case 'half':
      return HALF[i] ?? [];
    case 'third':
      return THIRD[i] ?? [];
    case 'pact': {
      const [count, slotLevel] = PACT[i] ?? [0, 0];
      const slots = Array<number>(slotLevel).fill(0);
      if (slotLevel) slots[slotLevel - 1] = count;
      return slots;
    }
    default:
      return [];
  }
}

export function maxSpellLevel(caster: CasterType, level: number): number {
  const slots = spellSlots(caster, level);
  return slots.length;
}

export function cantripsKnown(cls: ClassDef, sub: Subclass | undefined, level: number): number {
  if (cls.cantrips) return cls.cantrips[level - 1] ?? 0;
  if (sub?.casterType === 'third') return THIRD_CANTRIPS[level - 1] ?? 0;
  return 0;
}

/** Number of spells known (known casters) or learned into the spellbook (wizard). */
export function spellsKnown(cls: ClassDef, sub: Subclass | undefined, level: number): number {
  if (level < 1) return 0;
  if (cls.spellPrep === 'spellbook') return 6 + 2 * (level - 1);
  if (cls.spellsKnown) return cls.spellsKnown[level - 1] ?? 0;
  if (sub?.casterType === 'third') return THIRD_KNOWN[level - 1] ?? 0;
  return 0;
}

/** Prepared spell count for prepared casters (and wizards preparing from their spellbook). */
export function spellsPrepared(cls: ClassDef, level: number, castingMod: number): number {
  if (cls.spellPrep === 'prepared' || cls.spellPrep === 'spellbook') {
    const lvl = cls.casterType === 'half' ? Math.floor(level / 2) : level;
    if (cls.casterType === 'half' && level < 2) return 0;
    return Math.max(1, castingMod + lvl);
  }
  return 0;
}

export const invocationsKnown = (level: number) => INVOCATIONS[level - 1] ?? 0;

export function metamagicKnown(level: number): number {
  if (level >= 10) return 3;
  if (level >= 3) return 2;
  return 0;
}

export function extraAttackLevel(cls: ClassDef, sub?: Subclass): number | undefined {
  return sub?.extraAttackAt ?? cls.extraAttackAt;
}

export const averageHpPerLevel = (hitDie: number) => hitDie / 2 + 1;
