import { describe, expect, it } from 'vitest';
import { CLASSES } from '../../data';
import { STORY, STORY_PEOPLE } from '../../data/story';
import { deriveBuild, emptyChoices, type Choices } from '../build';
import { fateOptions, fillText, pickable, placeholders, resolveNames, rollFate, walkStory, type StoryState } from '../story';

/** Deterministic PRNG so failures are reproducible. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Play the story to the end; `prefer` forces options by scene id when available. */
function play(rng: () => number, prefer: Record<string, string> = {}): StoryState {
  const state: StoryState = { story: {}, rolled: [] };
  for (let guard = 0; guard < 100; guard++) {
    const walk = walkStory(state);
    if (walk.complete) return state;
    const { scene, available } = walk.next!;
    const wanted = available.find((o) => o.id === prefer[scene.id]);
    if (wanted) state.story[scene.id] = wanted.id;
    else if (scene.fate && rng() < 0.4) {
      state.story[scene.id] = rollFate(scene, walk.flags, rng).id;
      state.rolled.push(scene.id);
    } else state.story[scene.id] = available[Math.floor(rng() * available.length)]!.id;
  }
  throw new Error('story did not finish');
}

const asChoices = (s: StoryState): Choices => ({ ...emptyChoices(), mode: 'story', story: s.story, storyRolled: s.rolled });

describe('story structure', () => {
  it('2000 random walks all finish without dead ends', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 2000; i++) {
      const state = play(rng);
      const walk = walkStory(state);
      expect(walk.complete).toBe(true);
      for (const step of walk.steps) expect(step.available.length, step.scene.id).toBeGreaterThanOrEqual(2);
      expect(walk.steps.length).toBeGreaterThanOrEqual(14);
      expect(walk.steps.length).toBeLessThanOrEqual(22);
    }
  });

  it('every flag a condition depends on is set by some option', () => {
    const set = new Set(STORY.flatMap((c) => c.scenes.flatMap((s) => s.options.flatMap((o) => o.sets ?? []))));
    const conds = STORY.flatMap((c) => c.scenes.flatMap((s) => [s.requires, ...s.options.map((o) => o.requires)]));
    for (const c of conds) for (const f of [...(c?.all ?? []), ...(c?.any ?? []), ...(c?.none ?? [])]) expect(set, f).toContain(f);
  });

  it('every placeholder resolves', () => {
    const known = new Set(['name', 'home', ...STORY_PEOPLE.map((p) => p.key)]);
    for (const c of STORY) {
      for (const text of [c.intro, ...c.scenes.flatMap((s) => [s.text, ...s.options.flatMap((o) => [o.text, o.narration, o.lore ?? ''])])]) {
        for (const p of placeholders(text)) expect(known, `${p} in "${text}"`).toContain(p);
      }
    }
    const rng = mulberry32(7);
    for (let i = 0; i < 200; i++) {
      const b = deriveBuild(asChoices(play(rng)));
      expect(b.backstory).not.toMatch(/\{\w+\}/);
    }
  });

  it('narration refers to the hero neutrally', () => {
    for (const c of STORY)
      for (const s of c.scenes)
        for (const o of s.options) expect(o.narration, `${s.id}/${o.id}`).not.toMatch(/\b(he|she|him|her|his|hers)\b/i);
  });

  it('fate-only twists are never offered by hand but can be rolled', () => {
    const twists = STORY.flatMap((c) => c.scenes.filter((s) => s.options.some((o) => o.fateOnly)));
    expect(twists.length).toBeGreaterThan(3);
    for (const scene of twists) {
      expect(scene.fate, scene.id).toBe(true);
      const flags = new Set<string>(['path-study', 'path-war', 'has-bond', 'sibling-vanished']);
      expect(pickable(scene, flags).some((o) => o.fateOnly)).toBe(false);
      const twist = fateOptions(scene, flags).find((o) => o.fateOnly)!;
      const seen = new Set(Array.from({ length: 500 }, (_, i) => rollFate(scene, flags, mulberry32(i)).id));
      expect(seen).toContain(twist.id);
    }
  });

  it('a hand-picked twist is ignored unless it was rolled', () => {
    const story = { homeland: 'baldurs-gate', family: 'merchants', omen: 'strange-blood' };
    expect(walkStory({ story, rolled: [] }).next?.scene.id).toBe('omen');
    expect(walkStory({ story, rolled: ['omen'] }).next?.scene.id).toBe('days');
  });
});

describe('story → build', () => {
  const PERSONAS: Record<string, Record<string, string>> = {
    warlock: { source: 'called-out', patron: 'fiend', price: 'favour', who: 'no-one', scar: 'debt', living: 'con', seek: 'free-of-patron' },
    paladin: { family: 'temple', days: 'drills', source: 'dream', god: 'war-god', calling: 'oath', who: 'friend', scar: 'failed', carry: 'atone', living: 'order', seek: 'redemption' },
    wizard: { days: 'books', source: 'apprentice', tower: 'destruction', who: 'mentor', living: 'libraries', seek: 'answers' },
    druid: { homeland: 'high-forest', family: 'wardens', days: 'roaming', source: 'circle', 'circle-lesson': 'shapes', who: 'beast', living: 'wilds', seek: 'freedom' },
    bard: { family: 'merchants', days: 'performing', source: 'song', voice: 'crowds', who: 'love', living: 'taverns', where: 'tavern' },
    monk: { family: 'temple', days: 'rites', source: 'monastery', discipline: 'balance', who: 'no-one', 'arms-length': 'thoughts', living: 'order', seek: 'redemption', 'last-thought': 'peace' },
    rogue: { homeland: 'baldurs-gate', family: 'nothing', days: 'street', gang: 'shadow', source: 'shadows', guild: 'burglar', scar: 'stole', living: 'con', seek: 'fortune' },
    barbarian: { homeland: 'high-forest', family: 'nothing', days: 'roaming', source: 'war', battlefield: 'berserker', who: 'no-one', scar: 'killed', victim: 'friend', living: 'sellsword', seek: 'freedom' },
  };

  it.each(Object.keys(PERSONAS))('a matching story recommends %s', (cls) => {
    const state = play(mulberry32(1), PERSONAS[cls]);
    const b = deriveBuild(asChoices(state));
    expect(b.complete).toBe(true);
    expect(b.cls.id).toBe(cls);
  });

  it('all 12 classes are reachable through the story', () => {
    const rng = mulberry32(99);
    const seen = new Set<string>();
    for (let i = 0; i < 4000 && seen.size < CLASSES.length; i++) seen.add(deriveBuild(asChoices(play(rng))).cls.id);
    expect([...seen].sort()).toEqual(CLASSES.map((c) => c.id).sort());
  });

  it('writes a chaptered backstory with names', () => {
    const state = play(mulberry32(3), { source: 'apprentice', who: 'mentor' });
    const c = asChoices(state);
    c.name = 'Lyra';
    c.storyNames = { mentor: 'Magister Quell' };
    const b = deriveBuild(c);
    expect(b.story.chapters.map((x) => x.title)).toEqual(['The Realms, 1492 DR', 'Small Hands', 'The Awakening', 'The Bond', 'The Wound', 'The Road', 'The Eve']);
    expect(b.backstory).toContain('Magister Quell');
    expect(b.backstory).toContain('Lyra');
    expect(b.story.people.find((p) => p.key === 'mentor')).toMatchObject({ name: 'Magister Quell', custom: true });
  });

  it('default names are stable and fill sentence starts with a capital', () => {
    const names = resolveNames({ homeland: 'waterdeep' }, {});
    expect(resolveNames({ homeland: 'waterdeep' }, {})).toEqual(names);
    expect(fillText('{name} walked. {patron} smiled.', { hero: '', names, defines: {} })).toMatch(/^The wanderer walked\. [A-Z]/);
  });

  it('older builds with quiz answers default to quick mode', () => {
    const c = { ...emptyChoices(), answers: { power: 'bargain' } };
    expect(deriveBuild(c).mode).toBe('quick');
    expect(deriveBuild(emptyChoices()).mode).toBe('story');
  });
});
