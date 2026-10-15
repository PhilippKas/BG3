import { describe, expect, it } from 'vitest';
import { classById, subclassById } from '../../data';
import { cantripsKnown, proficiencyBonus, spellSlots, spellsKnown, spellsPrepared } from '../progression';

describe('proficiency bonus', () => {
  it('follows 2/3/4 across levels 1–12', () => {
    expect([1, 4, 5, 8, 9, 12].map(proficiencyBonus)).toEqual([2, 2, 3, 3, 4, 4]);
  });
});

describe('spell slots', () => {
  it('full casters', () => {
    expect(spellSlots('full', 1)).toEqual([2]);
    expect(spellSlots('full', 5)).toEqual([4, 3, 2]);
    expect(spellSlots('full', 11)).toEqual([4, 3, 3, 3, 2, 1]);
  });
  it('half casters start at level 2', () => {
    expect(spellSlots('half', 1)).toEqual([]);
    expect(spellSlots('half', 2)).toEqual([2]);
    expect(spellSlots('half', 9)).toEqual([4, 3, 2]);
  });
  it('third casters start at level 3', () => {
    expect(spellSlots('third', 2)).toEqual([]);
    expect(spellSlots('third', 7)).toEqual([4, 2]);
  });
  it('warlocks have few slots at their highest level', () => {
    expect(spellSlots('pact', 1)).toEqual([1]);
    expect(spellSlots('pact', 5)).toEqual([0, 0, 2]);
    expect(spellSlots('pact', 11)).toEqual([0, 0, 0, 0, 3]);
  });
});

describe('spells known and cantrips', () => {
  it('sorcerer progression', () => {
    const s = classById('sorcerer')!;
    expect(cantripsKnown(s, undefined, 1)).toBe(4);
    expect(spellsKnown(s, undefined, 12)).toBe(12);
  });
  it('wizard spellbook: 6 at level 1, +2 per level', () => {
    const w = classById('wizard')!;
    expect(spellsKnown(w, undefined, 1)).toBe(6);
    expect(spellsKnown(w, undefined, 12)).toBe(28);
    expect(spellsKnown(w, undefined, 0)).toBe(0);
  });
  it('eldritch knight gains spells at level 3', () => {
    const f = classById('fighter')!;
    const ek = subclassById('eldritch-knight')!;
    expect(spellsKnown(f, ek, 2)).toBe(0);
    expect(spellsKnown(f, ek, 3)).toBe(3);
    expect(cantripsKnown(f, ek, 3)).toBe(2);
  });
  it('prepared casters prepare modifier + level', () => {
    expect(spellsPrepared(classById('cleric')!, 3, 3)).toBe(6);
    expect(spellsPrepared(classById('paladin')!, 1, 3)).toBe(0);
    expect(spellsPrepared(classById('paladin')!, 5, 3)).toBe(5);
  });
});
