import { DEFAULT_HERO_NAME, STORY, STORY_PEOPLE } from '../data/story';
import type { Cond, StoryChapter, StoryOption, StoryScene, Tag } from '../data/schema';

export interface StoryState {
  story: Record<string, string>;
  rolled: string[];
}

export interface StoryStep {
  chapter: StoryChapter;
  scene: StoryScene;
  /** Options the player can pick by hand here. */
  available: StoryOption[];
  chosen?: StoryOption;
  rolled: boolean;
  /** Flags set before this scene (needed to re-roll or re-pick it). */
  before: Set<string>;
}

export interface StoryWalk {
  /** Answered steps in order, followed by the next open step (if any). */
  steps: StoryStep[];
  next?: StoryStep;
  complete: boolean;
  flags: Set<string>;
  defines: Record<string, string>;
  /** Index of the chapter the walk has reached (0-based). */
  chapterIndex: number;
}

export const meets = (cond: Cond | undefined, flags: Set<string>) =>
  !cond ||
  ((cond.all ?? []).every((f) => flags.has(f)) &&
    (!cond.any || cond.any.some((f) => flags.has(f))) &&
    (cond.none ?? []).every((f) => !flags.has(f)));

/** Options that can be picked by hand in a scene. */
export const pickable = (scene: StoryScene, flags: Set<string>) =>
  scene.options.filter((o) => !o.fateOnly && meets(o.requires, flags));

/** Options fate can choose from (including twists). */
export const fateOptions = (scene: StoryScene, flags: Set<string>) => scene.options.filter((o) => meets(o.requires, flags));

/**
 * Walk the story in order. Scenes whose conditions aren't met are skipped;
 * answers for unreachable scenes are ignored (and kept, in case the path returns).
 */
export function walkStory({ story, rolled }: StoryState): StoryWalk {
  const flags = new Set<string>();
  const defines: Record<string, string> = {};
  const steps: StoryStep[] = [];
  for (const [ci, chapter] of STORY.entries()) {
    for (const scene of chapter.scenes) {
      if (!meets(scene.requires, flags)) continue;
      const available = pickable(scene, flags);
      const wasRolled = rolled.includes(scene.id);
      const pool = wasRolled ? fateOptions(scene, flags) : available;
      const chosen = pool.find((o) => o.id === story[scene.id]);
      const step: StoryStep = { chapter, scene, available, chosen, rolled: wasRolled && !!chosen, before: new Set(flags) };
      if (!chosen) return { steps: [...steps, step], next: step, complete: false, flags, defines, chapterIndex: ci };
      steps.push(step);
      chosen.sets?.forEach((f) => flags.add(f));
      Object.assign(defines, chosen.defines);
    }
  }
  return { steps, complete: true, flags, defines, chapterIndex: STORY.length - 1 };
}

/** Weighted random pick among everything fate allows, twists included. */
export function rollFate(scene: StoryScene, flags: Set<string>, rng: () => number = Math.random): StoryOption {
  const options = fateOptions(scene, flags);
  const total = options.reduce((s, o) => s + (o.weight ?? 1), 0);
  let r = rng() * total;
  for (const o of options) {
    r -= o.weight ?? 1;
    if (r < 0) return o;
  }
  return options[options.length - 1]!;
}

/** Sum of the trait tags of every chosen option. */
export function storyTags(walk: StoryWalk): Partial<Record<Tag, number>> {
  const out: Partial<Record<Tag, number>> = {};
  for (const s of walk.steps) {
    if (!s.chosen) continue;
    const k = s.scene.weight ?? 1;
    for (const [t, w] of Object.entries(s.chosen.tags) as [Tag, number][]) out[t] = (out[t] ?? 0) + w * k;
  }
  return out;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export interface StoryPersonName {
  key: string;
  role: string;
  name: string;
  custom: boolean;
}

/** Names for every story person: custom names first, otherwise a stable default. */
export function resolveNames(story: Record<string, string>, custom: Record<string, string>): Record<string, StoryPersonName> {
  const seed = `${story.homeland ?? ''}/${story.family ?? ''}`;
  return Object.fromEntries(
    STORY_PEOPLE.map((p) => {
      const own = custom[p.key]?.trim();
      return [p.key, { key: p.key, role: p.role, name: own || p.names[hash(seed + p.key) % p.names.length]!, custom: !!own }];
    }),
  );
}

const PLACEHOLDER = /\{(\w+)\}/g;

export const placeholders = (text: string) => [...text.matchAll(PLACEHOLDER)].map((m) => m[1]!);

const capitaliseSentences = (text: string) => text.replace(/(^|[.!?]\s+)([a-z])/g, (_, a: string, b: string) => a + b.toUpperCase());

export function fillText(
  text: string,
  ctx: { hero: string; names: Record<string, StoryPersonName>; defines: Record<string, string> },
): string {
  const filled = text.replace(PLACEHOLDER, (m, key: string) => {
    if (key === 'name') return ctx.hero.trim() || DEFAULT_HERO_NAME;
    if (key === 'home') return ctx.defines.home ?? 'a distant land';
    return ctx.names[key]?.name ?? ctx.defines[key] ?? m;
  });
  return capitaliseSentences(filled);
}

export interface BackstoryChapter {
  title: string;
  paragraphs: string[];
}

/** The people who actually appear on this path. */
export function peopleInStory(walk: StoryWalk, names: Record<string, StoryPersonName>): StoryPersonName[] {
  const keys = new Set<string>();
  for (const s of walk.steps) {
    if (!s.chosen) continue;
    for (const k of [...placeholders(s.scene.text), ...placeholders(s.chosen.text), ...placeholders(s.chosen.narration)]) {
      if (names[k]) keys.add(k);
    }
  }
  return [...keys].map((k) => names[k]!);
}

export function storyBackstory(walk: StoryWalk, ctx: Parameters<typeof fillText>[1]): BackstoryChapter[] {
  const chapters: BackstoryChapter[] = [];
  for (const s of walk.steps) {
    if (!s.chosen) continue;
    const title = s.chapter.title.replace(/^(Prologue|Chapter [IVX]+): /, '');
    let ch = chapters[chapters.length - 1];
    if (!ch || ch.title !== title) chapters.push((ch = { title, paragraphs: [''] }));
    const sentence = fillText(s.chosen.narration, ctx);
    ch.paragraphs[0] = ch.paragraphs[0] ? `${ch.paragraphs[0]} ${sentence}` : sentence;
  }
  return chapters;
}

export const backstoryText = (chapters: BackstoryChapter[]) =>
  chapters.map((c) => `${c.title}\n\n${c.paragraphs.join('\n\n')}`).join('\n\n');
