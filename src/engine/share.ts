import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { z } from 'zod';
import { ABILITIES } from '../data/schema';
import type { Choices } from './build';

const ScoresSchema = z.object(Object.fromEntries(ABILITIES.map((a) => [a, z.number().int().min(3).max(20)])) as Record<(typeof ABILITIES)[number], z.ZodNumber>);

export const ChoicesSchema = z.strictObject({
  name: z.string().max(80).default(''),
  answers: z.record(z.string(), z.string()).default({}),
  classId: z.string().optional(),
  subclassId: z.string().optional(),
  raceId: z.string().optional(),
  subraceId: z.string().optional(),
  backgroundId: z.string().optional(),
  weaponStyle: z.enum(['two-handed', 'shield', 'dual-wield', 'ranged', 'finesse', 'unarmed', 'caster']).optional(),
  base: ScoresSchema.optional(),
  plus2: z.enum(ABILITIES).optional(),
  plus1: z.enum(ABILITIES).optional(),
  skills: z.array(z.string()).optional(),
  picks: z.record(z.string(), z.array(z.string())).default({}),
  favouriteSpells: z.array(z.string()).default([]),
  excludedSpells: z.array(z.string()).default([]),
});

export const BuildFile = z.object({
  app: z.literal('bg3-origin-planner'),
  version: z.literal(1),
  choices: ChoicesSchema,
});

export function parseChoices(data: unknown): Choices | null {
  const file = BuildFile.safeParse(data);
  if (file.success) return file.data.choices as Choices;
  const direct = ChoicesSchema.safeParse(data);
  return direct.success ? (direct.data as Choices) : null;
}

export const exportBuild = (choices: Choices) =>
  JSON.stringify({ app: 'bg3-origin-planner', version: 1, choices }, null, 2);

export const encodeShare = (choices: Choices) => compressToEncodedURIComponent(JSON.stringify(choices));

export function decodeShare(data: string): Choices | null {
  try {
    const json = decompressFromEncodedURIComponent(data);
    return json ? parseChoices(JSON.parse(json)) : null;
  } catch {
    return null;
  }
}
