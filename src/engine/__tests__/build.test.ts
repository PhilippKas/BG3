import { describe, expect, it } from 'vitest';
import { CLASSES, QUESTIONS } from '../../data';
import { deriveBuild, emptyChoices, type Choices } from '../build';

const answer = (ids: string[]): Choices => {
  const c = emptyChoices();
  QUESTIONS.forEach((q, i) => (c.answers[q.id] = ids[i]!));
  return c;
};

const PERSONAS: Record<string, string[]> = {
  warlock: ['bargain', 'alleys', 'minds', 'soul', 'strange', 'laughed', 'underground', 'door', 'talk', 'staff', 'ambition', 'fiend', 'spell', 'patron', 'power'],
  paladin: ['god', 'temple', 'frontline', 'people', 'rock', 'oath', 'shrine', 'enemy', 'shield', 'shield', 'courage', 'common', 'kick', 'serve', 'safer'],
  rogue: ['none', 'alleys', 'shadows', 'freedom', 'invisible', 'laughed', 'underground', 'trade', 'flank', 'rapier', 'cunning', 'small', 'pick', 'mark', 'secrets'],
  wizard: ['study', 'manor', 'fire', 'knowledge', 'wise', 'forgave', 'library', 'door', 'unleash', 'staff', 'curiosity', 'fey', 'spell', 'iam', 'secrets'],
  barbarian: ['none', 'wilds', 'charge', 'control', 'menacing', 'storm', 'sky', 'laugh', 'unleash', 'great', 'courage', 'orc', 'kick', 'nomaster', 'buried'],
  bard: ['blood', 'troupe', 'minds', 'freedom', 'charming', 'laughed', 'tavern', 'laugh', 'talk', 'lute', 'cunning', 'fey', 'persuade', 'mark', 'songs'],
};

describe('recommendation engine', () => {
  it('persona answers are valid', () => {
    for (const ids of Object.values(PERSONAS)) {
      QUESTIONS.forEach((q, i) => expect(q.options.map((o) => o.id)).toContain(ids[i]));
    }
  });

  it.each(Object.keys(PERSONAS))('recommends %s for a matching backstory', (cls) => {
    const b = deriveBuild(answer(PERSONAS[cls]!));
    expect(b.cls.id).toBe(cls);
    expect(b.complete).toBe(true);
  });

  it('respects overrides', () => {
    const c = answer(PERSONAS.wizard!);
    c.classId = 'fighter';
    c.subclassId = 'eldritch-knight';
    c.raceId = 'githyanki';
    const b = deriveBuild(c);
    expect(b.cls.id).toBe('fighter');
    expect(b.sub.id).toBe('eldritch-knight');
    expect(b.race.id).toBe('githyanki');
  });

  it('ignores a subclass that belongs to another class', () => {
    const c = answer(PERSONAS.wizard!);
    c.subclassId = 'berserker';
    expect(deriveBuild(c).sub.classId).toBe('wizard');
  });
});

describe('every class produces a legal 12-level plan', () => {
  it.each(CLASSES.map((c) => c.id))('%s', (classId) => {
    const c = emptyChoices();
    c.classId = classId;
    const b = deriveBuild(c);
    expect(b.levels).toHaveLength(12);
    expect(b.pointBuyValid).toBe(true);
    for (const l of b.levels) {
      expect(Object.values(l.scores).every((v) => v <= 20)).toBe(true);
      for (const p of l.picks) {
        expect(p.chosen.length).toBeLessThanOrEqual(p.count);
        expect(new Set(p.chosen).size).toBe(p.chosen.length);
      }
      // feats only at feat levels
      expect(l.picks.some((p) => p.kind === 'feat')).toBe(b.cls.featLevels.includes(l.level));
    }
    // HP grows every level
    for (let i = 1; i < 12; i++) expect(b.levels[i]!.hp).toBeGreaterThan(b.levels[i - 1]!.hp);
    // No spell is learned twice
    const learned = b.levels.flatMap((l) => l.picks.filter((p) => ['cantrips', 'spells', 'secrets', 'arcanum'].includes(p.kind)).flatMap((p) => p.chosen));
    expect(new Set(learned).size).toBe(learned.length);
  });
});

describe('spell legality', () => {
  it('never learns a spell above the highest available slot', () => {
    for (const cls of CLASSES) {
      const c = emptyChoices();
      c.classId = cls.id;
      const b = deriveBuild(c);
      for (const l of b.levels) {
        const max = l.slots.length;
        for (const p of l.picks.filter((p) => p.kind === 'spells' || p.kind === 'secrets')) {
          for (const id of p.chosen) {
            const opt = p.options.find((o) => o.id === id)!;
            expect(opt.meta, `${cls.id} L${l.level} ${id}`).toMatch(/^Level (\d)/);
            expect(Number(opt.meta!.match(/^Level (\d)/)![1])).toBeLessThanOrEqual(max);
          }
        }
      }
    }
  });

  it('user override of a pick is honoured', () => {
    const c = emptyChoices();
    c.classId = 'wizard';
    c.picks['1:cantrips'] = ['acid-splash'];
    const b = deriveBuild(c);
    expect(b.levels[0]!.picks.find((p) => p.kind === 'cantrips')!.chosen[0]).toBe('acid-splash');
  });
});

describe('backstory', () => {
  it('includes the chosen name and contains no blank fragments', () => {
    const c = answer(PERSONAS.bard!);
    c.name = 'Lyra';
    const b = deriveBuild(c);
    expect(b.backstory.startsWith('Lyra is')).toBe(true);
    expect(b.backstory).not.toContain('undefined');
  });
});
