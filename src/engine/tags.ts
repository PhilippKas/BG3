import { QUESTIONS } from '../data/questionnaire';
import { TAGS, TAG_LABELS } from '../data/tags';
import type { Tag, Tags } from '../data/schema';

export type Profile = Record<Tag, number>;

export const emptyProfile = (): Profile => Object.fromEntries(TAGS.map((t) => [t, 0])) as Profile;

export function buildProfile(answers: Record<string, string>): Profile {
  const p = emptyProfile();
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (!opt) continue;
    for (const [tag, w] of Object.entries(opt.tags) as [Tag, number][]) p[tag] += w;
  }
  return p;
}

const norm = (v: Iterable<number>) => Math.sqrt([...v].reduce((s, x) => s + x * x, 0));

export function dot(tags: Tags, profile: Profile): number {
  let s = 0;
  for (const [tag, w] of Object.entries(tags) as [Tag, number][]) s += w * profile[tag];
  return s;
}

/** Cosine similarity between an entity's tags and the profile (0–1). */
export function affinity(tags: Tags, profile: Profile): number {
  const nt = norm(Object.values(tags));
  const np = norm(Object.values(profile));
  if (!nt || !np) return 0;
  return dot(tags, profile) / (nt * np);
}

/** Tags that contribute the most to an entity's fit. */
export function topReasons(tags: Tags, profile: Profile, n = 2): Tag[] {
  return (Object.entries(tags) as [Tag, number][])
    .map(([t, w]) => [t, w * profile[t]] as const)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

export const describeReasons = (reasons: Tag[]) =>
  reasons.length ? `Fits your ${reasons.map((r) => TAG_LABELS[r]).join(' and ')}.` : 'A flexible choice for your concept.';

/** The strongest traits in a profile, for display. */
export function dominantTags(profile: Profile, n = 5): Tag[] {
  return (Object.entries(profile) as [Tag, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}
