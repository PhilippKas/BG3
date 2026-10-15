import { ABILITIES, type Ability } from '../data/schema';

export type Scores = Record<Ability, number>;

export const POINT_BUY_TOTAL = 27;
export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 15;
export const ABILITY_CAP = 20;

const COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

/** Base scores assigned in priority order (sums to exactly 27 points). */
export const STANDARD_SPREAD = [15, 14, 14, 10, 10, 8] as const;

export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : `${mod}`);

export function scoreCost(score: number): number {
  const c = COST[score];
  if (c === undefined) throw new RangeError(`Score ${score} is outside point-buy range`);
  return c;
}

export function pointsSpent(base: Scores): number {
  return ABILITIES.reduce((sum, a) => sum + scoreCost(base[a]), 0);
}

export function isValidPointBuy(base: Scores): boolean {
  return (
    ABILITIES.every((a) => base[a] >= POINT_BUY_MIN && base[a] <= POINT_BUY_MAX) && pointsSpent(base) === POINT_BUY_TOTAL
  );
}

/** Within range and not overspent (unspent points are allowed while editing). */
export function isLegalPointBuy(base: Scores): boolean {
  return (
    ABILITIES.every((a) => base[a] >= POINT_BUY_MIN && base[a] <= POINT_BUY_MAX) && pointsSpent(base) <= POINT_BUY_TOTAL
  );
}

export function allocate(priority: readonly Ability[]): Scores {
  const base = {} as Scores;
  priority.forEach((a, i) => (base[a] = STANDARD_SPREAD[i] ?? POINT_BUY_MIN));
  return base;
}

/** Apply the character-creation bonuses (+2 and +1 to two different abilities). */
export function applyBonuses(base: Scores, plus2: Ability, plus1: Ability): Scores {
  const out = { ...base };
  out[plus2] += 2;
  if (plus1 !== plus2) out[plus1] += 1;
  return out;
}

export function addIncreases(scores: Scores, inc: Partial<Scores>): Scores {
  const out = { ...scores };
  for (const a of ABILITIES) out[a] = Math.min(ABILITY_CAP, out[a] + (inc[a] ?? 0));
  return out;
}

/**
 * Pick an Ability Improvement split: get the most important odd score to even,
 * otherwise push the primary by two.
 */
export function planAbilityImprovement(scores: Scores, priority: readonly Ability[]): Partial<Scores> {
  const [p1, p2, p3] = priority as [Ability, Ability, Ability];
  if (scores[p1] < ABILITY_CAP) {
    if (scores[p1] % 2 === 1) {
      const partner = [p2, p3, 'CON' as Ability].find((a) => a !== p1 && scores[a] % 2 === 1 && scores[a] < ABILITY_CAP);
      return partner ? { [p1]: 1, [partner]: 1 } : { [p1]: 1, [p2]: scores[p2] < ABILITY_CAP ? 1 : 0 };
    }
    return scores[p1] + 2 <= ABILITY_CAP ? { [p1]: 2 } : { [p1]: 1, [p2]: 1 };
  }
  for (const a of [p2, p3]) {
    if (scores[a] < ABILITY_CAP - 1) return { [a]: 2 };
  }
  return { [p2]: 1, [p3]: 1 };
}
