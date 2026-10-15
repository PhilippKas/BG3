import { describe, expect, it } from 'vitest';
import { CLASSES } from '../../data';
import {
  addIncreases,
  allocate,
  applyBonuses,
  isValidPointBuy,
  modifier,
  planAbilityImprovement,
  pointsSpent,
} from '../abilities';

describe('point buy', () => {
  it('standard allocation spends exactly 27 points within 8–15', () => {
    for (const cls of CLASSES) {
      const base = allocate(cls.abilityPriority);
      expect(pointsSpent(base)).toBe(27);
      expect(isValidPointBuy(base)).toBe(true);
    }
  });

  it('rejects overspending and out-of-range scores', () => {
    expect(isValidPointBuy({ STR: 15, DEX: 15, CON: 15, INT: 15, WIS: 8, CHA: 8 })).toBe(false);
    expect(isValidPointBuy({ STR: 16, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 })).toBe(false);
  });

  it('applies +2 and +1 to different abilities', () => {
    const s = applyBonuses(allocate(['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR']), 'CHA', 'CON');
    expect(s.CHA).toBe(17);
    expect(s.CON).toBe(15);
  });
});

describe('modifiers', () => {
  it.each([
    [8, -1],
    [10, 0],
    [11, 0],
    [15, 2],
    [17, 3],
    [20, 5],
  ])('score %i → %i', (score, mod) => expect(modifier(score)).toBe(mod));
});

describe('ability improvement planning', () => {
  it('evens out an odd primary score with a partner', () => {
    const scores = { STR: 8, DEX: 14, CON: 15, INT: 10, WIS: 10, CHA: 17 };
    expect(planAbilityImprovement(scores, ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR'])).toEqual({ CHA: 1, CON: 1 });
  });

  it('never exceeds 20', () => {
    const scores = { STR: 8, DEX: 14, CON: 15, INT: 10, WIS: 10, CHA: 20 };
    const inc = planAbilityImprovement(scores, ['CHA', 'CON', 'DEX', 'WIS', 'INT', 'STR']);
    const after = addIncreases(scores, inc);
    expect(after.CHA).toBe(20);
    expect(Object.values(after).every((v) => v <= 20)).toBe(true);
  });
});
