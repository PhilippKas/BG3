import { z } from 'zod';
import { TAGS } from './tags';

export const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const;
export const Ability = z.enum(ABILITIES);
export type Ability = z.infer<typeof Ability>;

export const SKILLS = {
  Acrobatics: 'DEX',
  'Animal Handling': 'WIS',
  Arcana: 'INT',
  Athletics: 'STR',
  Deception: 'CHA',
  History: 'INT',
  Insight: 'WIS',
  Intimidation: 'CHA',
  Investigation: 'INT',
  Medicine: 'WIS',
  Nature: 'INT',
  Perception: 'WIS',
  Performance: 'CHA',
  Persuasion: 'CHA',
  Religion: 'INT',
  'Sleight of Hand': 'DEX',
  Stealth: 'DEX',
  Survival: 'WIS',
} as const satisfies Record<string, Ability>;
export type Skill = keyof typeof SKILLS;
export const SKILL_NAMES = Object.keys(SKILLS) as Skill[];
export const SkillSchema = z.enum(SKILL_NAMES as [Skill, ...Skill[]]);

export const Tag = z.enum(TAGS);
export type Tag = z.infer<typeof Tag>;
/** Weighted affinity of an entity to trait tags (weights roughly 1–3). */
export const Tags = z.partialRecord(Tag, z.number().min(0).max(5));
export type Tags = z.infer<typeof Tags>;

export const ArmourCategory = z.enum(['light', 'medium', 'heavy', 'shield']);
export type ArmourCategory = z.infer<typeof ArmourCategory>;

const Feature = z.object({
  name: z.string(),
  summary: z.string(),
});
export type Feature = z.infer<typeof Feature>;

const InnateSpell = z.object({ level: z.number().int().min(1).max(12), spell: z.string() });

export const Subrace = z.object({
  id: z.string(),
  name: z.string(),
  features: z.array(Feature),
  tags: Tags,
  speed: z.number().optional(),
  darkvision: z.number().optional(),
  armour: z.array(ArmourCategory).optional(),
  weapons: z.array(z.string()).optional(),
  skills: z.array(SkillSchema).optional(),
  innateSpells: z.array(InnateSpell).optional(),
  /** Extra cantrip chosen from a class list (e.g. High Elf: wizard). */
  bonusCantripFrom: z.string().optional(),
  hpPerLevel: z.number().optional(),
});
export type Subrace = z.infer<typeof Subrace>;

export const Race = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  speed: z.number(),
  darkvision: z.number(),
  features: z.array(Feature),
  armour: z.array(ArmourCategory),
  weapons: z.array(z.string()),
  skills: z.array(SkillSchema),
  /** Number of free skill proficiencies of your choice (Human Versatility). */
  bonusSkills: z.number().int().optional(),
  innateSpells: z.array(InnateSpell).optional(),
  subraces: z.array(Subrace),
  tags: Tags,
});
export type Race = z.infer<typeof Race>;

export const Background = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  skills: z.tuple([SkillSchema, SkillSchema]),
  tags: Tags,
});
export type Background = z.infer<typeof Background>;

export const CasterType = z.enum(['none', 'full', 'half', 'third', 'pact']);
export type CasterType = z.infer<typeof CasterType>;

export const SpellPrep = z.enum(['known', 'prepared', 'spellbook']);

export const ClassLevel = z.object({
  level: z.number().int().min(1).max(12),
  features: z.array(Feature),
});

export const Subclass = z.object({
  id: z.string(),
  classId: z.string(),
  name: z.string(),
  summary: z.string(),
  tags: Tags,
  /** Ability priority override (most important first). */
  abilityPriority: z.array(Ability).length(6).optional(),
  features: z.array(z.object({ level: z.number().int(), name: z.string(), summary: z.string() })),
  extraArmour: z.array(ArmourCategory).optional(),
  extraWeapons: z.array(z.string()).optional(),
  /** Spells always prepared / added at a given class level. */
  bonusSpells: z.array(z.object({ level: z.number().int(), spells: z.array(z.string()) })).optional(),
  /** Grants third-caster spellcasting (Eldritch Knight, Arcane Trickster). */
  casterType: CasterType.optional(),
  spellList: z.string().optional(),
  extraAttackAt: z.number().int().optional(),
  /** Style hint used by the gear and feat engine. */
  style: z.array(z.string()).optional(),
});
export type Subclass = z.infer<typeof Subclass>;

export const ClassDef = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  hitDie: z.number().int(),
  primary: z.array(Ability),
  abilityPriority: z.array(Ability).length(6),
  saves: z.tuple([Ability, Ability]),
  armour: z.array(ArmourCategory),
  weapons: z.array(z.string()),
  skillChoices: z.object({ count: z.number().int(), from: z.union([z.literal('any'), z.array(SkillSchema)]) }),
  subclassLevel: z.number().int(),
  subclassLabel: z.string(),
  featLevels: z.array(z.number().int()),
  extraAttackAt: z.number().int().optional(),
  casterType: CasterType,
  castingAbility: Ability.optional(),
  spellPrep: SpellPrep.optional(),
  /** Cantrips known per level (index 0 = level 1). */
  cantrips: z.array(z.number().int()).length(12).optional(),
  /** Spells known per level for 'known' casters (index 0 = level 1). */
  spellsKnown: z.array(z.number().int()).length(12).optional(),
  levels: z.array(ClassLevel).length(12),
  tags: Tags,
  /** Style hint used by the gear and feat engine. */
  style: z.array(z.string()),
});
export type ClassDef = z.infer<typeof ClassDef>;

export const Feat = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  tags: Tags,
  /** Ability increase options (half-feats). */
  abilityPlus: z.array(Ability).optional(),
  requires: z
    .object({
      armour: ArmourCategory.optional(),
      spellcaster: z.boolean().optional(),
      ability: z.object({ ability: Ability, min: z.number() }).optional(),
    })
    .optional(),
  /** Style keywords this feat synergises with (e.g. 'two-handed', 'ranged', 'concentration'). */
  synergy: z.array(z.string()),
  repeatable: z.boolean().optional(),
});
export type Feat = z.infer<typeof Feat>;

export const School = z.enum([
  'Abjuration',
  'Conjuration',
  'Divination',
  'Enchantment',
  'Evocation',
  'Illusion',
  'Necromancy',
  'Transmutation',
]);

export const Spell = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().int().min(0).max(6),
  school: School,
  classes: z.array(z.string()),
  concentration: z.boolean(),
  ritual: z.boolean().optional(),
  cast: z.enum(['action', 'bonus', 'reaction']),
  damage: z.string().optional(),
  summary: z.string(),
  /** Broad role, used for party balance. */
  role: z.array(z.enum(['damage', 'control', 'buff', 'heal', 'defence', 'utility', 'summon', 'debuff'])),
  /** General strength 1 (niche) – 3 (staple). */
  rating: z.number().int().min(1).max(3),
  tags: Tags,
});
export type Spell = z.infer<typeof Spell>;

export const Choice = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  minLevel: z.number().int().optional(),
  requires: z.string().optional(),
  tags: Tags,
  rating: z.number().int().min(1).max(3),
  synergy: z.array(z.string()).optional(),
});
export type Choice = z.infer<typeof Choice>;

export const Slot = z.enum([
  'head',
  'cloak',
  'armour',
  'hands',
  'feet',
  'amulet',
  'ring',
  'melee',
  'offhand',
  'ranged',
]);
export type Slot = z.infer<typeof Slot>;

export const BaseWeapon = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['simple', 'martial']),
  kind: z.enum(['melee', 'ranged']),
  damage: z.string(),
  versatile: z.string().optional(),
  damageType: z.enum(['Bludgeoning', 'Piercing', 'Slashing']),
  properties: z.array(z.enum(['finesse', 'light', 'heavy', 'two-handed', 'versatile', 'reach', 'thrown'])),
});
export type BaseWeapon = z.infer<typeof BaseWeapon>;

export const BaseArmour = z.object({
  id: z.string(),
  name: z.string(),
  category: ArmourCategory,
  ac: z.number().int(),
  dexCap: z.number().int().nullable(),
  stealthDisadvantage: z.boolean(),
});
export type BaseArmour = z.infer<typeof BaseArmour>;

export const Item = z.object({
  id: z.string(),
  /** SPOILER tier 1 */
  name: z.string(),
  slot: Slot,
  /** Base type shown openly, e.g. 'Rapier', 'Medium armour', 'Ring'. */
  base: z.string(),
  rarity: z.enum(['Uncommon', 'Rare', 'Very Rare', 'Legendary']),
  /** Spoiler-free description of what the item does for a build. */
  roleDescription: z.string(),
  /** Concrete mechanical properties (no story). */
  properties: z.array(z.string()),
  /** SPOILER tier 2 — omitted when not verified. */
  act: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  /** SPOILER tier 2 — omitted when not verified. */
  location: z.string().optional(),
  armourCategory: ArmourCategory.optional(),
  /** Base weapon id for weapons (used for proficiency checks). */
  weapon: z.string().optional(),
  tags: Tags,
  /** Abilities / styles this item rewards, e.g. 'CHA', 'caster', 'two-handed'. */
  synergy: z.array(z.string()),
  rating: z.number().int().min(1).max(3),
});
export type Item = z.infer<typeof Item>;

export const AnswerOption = z.object({
  id: z.string(),
  text: z.string(),
  tags: Tags,
  /** Sentence used to compose the generated backstory. */
  fragment: z.string(),
});

export const Question = z.object({
  id: z.string(),
  prompt: z.string(),
  options: z.array(AnswerOption).min(2),
});
export type Question = z.infer<typeof Question>;
