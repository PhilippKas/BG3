import {
  BACKGROUNDS,
  CLASSES,
  FEATS,
  RACES,
  SUBCLASSES,
  ABILITY_IMPROVEMENT,
} from '../data';
import {
  SKILLS,
  SKILL_NAMES,
  type Ability,
  type ArmourCategory,
  type Background,
  type ClassDef,
  type Choice,
  type Feat,
  type Race,
  type Skill,
  type Spell,
  type Subclass,
  type Subrace,
  type Tag,
  type Tags,
} from '../data/schema';
import { ABILITY_CAP, type Scores } from './abilities';
import { affinity, dot, topReasons, type Profile } from './tags';

export interface Ranked<T> {
  item: T;
  score: number;
  /** 0–100 fit percentage for display. */
  fit: number;
  reasons: Tag[];
}

const rank = <T extends { tags: Tags }>(items: T[], profile: Profile, bonus: (t: T) => number = () => 0): Ranked<T>[] =>
  items
    .map((item) => {
      const a = affinity(item.tags, profile);
      return { item, score: a + bonus(item), fit: Math.round(Math.max(0, Math.min(1, a)) * 100), reasons: topReasons(item.tags, profile) };
    })
    .sort((x, y) => y.score - x.score);

export const rankClasses = (profile: Profile) => rank(CLASSES, profile);

export const rankSubclasses = (cls: ClassDef, profile: Profile) =>
  rank(
    SUBCLASSES.filter((s) => s.classId === cls.id),
    profile,
  );

// ----- Weapon style ---------------------------------------------------------

export const WEAPON_STYLES = ['two-handed', 'shield', 'dual-wield', 'ranged', 'finesse'] as const;
export type WeaponStyle = (typeof WEAPON_STYLES)[number] | 'unarmed' | 'caster';

export const WEAPON_STYLE_LABELS: Record<WeaponStyle, string> = {
  'two-handed': 'Two-handed weapon',
  shield: 'Weapon and shield',
  'dual-wield': 'Dual wielding',
  ranged: 'Ranged weapons',
  finesse: 'Single finesse weapon',
  unarmed: 'Unarmed strikes',
  caster: 'Spellcasting focus',
};

export function allowedWeaponStyles(cls: ClassDef, sub: Subclass): WeaponStyle[] {
  const pick = (style: string[]) => WEAPON_STYLES.filter((w) => style.includes(w));
  if (cls.style.includes('unarmed')) return ['unarmed'];
  const fromSub = pick(sub.style ?? []);
  const allowed: WeaponStyle[] = fromSub.length ? fromSub : pick(cls.style);
  return allowed.length ? allowed : ['caster'];
}

export function rankWeaponStyles(allowed: WeaponStyle[], profile: Profile): WeaponStyle[] {
  const w: Record<WeaponStyle, number> = {
    'two-handed': profile.brute + 0.3 * profile.martial,
    shield: profile.protector + 0.3 * (profile.order + profile.divine),
    'dual-wield': 0.7 * profile.finesse + 0.3 * profile.trickster + 0.2 * profile.wild,
    ranged: 1.2 * profile.ranged,
    finesse: 0.8 * profile.finesse + 0.3 * profile.charm,
    unarmed: 0,
    caster: 0,
  };
  // Stable sort keeps the class's preferred order on ties.
  return [...allowed].sort((a, b) => w[b] - w[a]);
}

/** Ability priority adjusted for DEX-based fighters. */
export function abilityPriority(cls: ClassDef, sub: Subclass, weaponStyle: WeaponStyle): Ability[] {
  const base = [...(sub.abilityPriority ?? cls.abilityPriority)];
  if (cls.id === 'fighter' && ['finesse', 'dual-wield', 'ranged'].includes(weaponStyle) && base[0] === 'STR') {
    const dex = base.indexOf('DEX');
    base[dex] = 'STR';
    base[0] = 'DEX';
  }
  return base;
}

// ----- Race -----------------------------------------------------------------

export interface RaceChoice {
  race: Race;
  subrace?: Subrace;
}

export function raceArmour(race: Race, subrace?: Subrace): ArmourCategory[] {
  return [...new Set([...race.armour, ...(subrace?.armour ?? [])])];
}

function raceSynergy(race: Race, subrace: Subrace | undefined, classArmour: ArmourCategory[], style: Set<string>, primary: Ability): number {
  let s = 0;
  const armour = raceArmour(race, subrace);
  if (style.has('unarmed')) {
    // Armour training is wasted on unarmoured fighters.
  } else if (!classArmour.includes('medium') && armour.includes('medium')) s += style.has('caster') ? 0.12 : 0.06;
  else if (!classArmour.includes('light') && armour.includes('light')) s += 0.05;
  if (race.id === 'half-orc' && primary === 'STR') s += 0.06;
  if (race.id === 'halfling') s += 0.02;
  // Human Versatility (an extra skill) suits almost any concept.
  if (race.id === 'human') s += 0.04;
  if (race.darkvision > 0 || (subrace?.darkvision ?? 0) > 0) s += 0.02;
  if (subrace?.id === 'wood-elf' || subrace?.id === 'wood-half-elf') s += style.has('melee') ? 0.03 : 0.01;
  if (race.id === 'githyanki') s += 0.02;
  return s;
}

export function rankRaces(
  profile: Profile,
  classArmour: ArmourCategory[],
  style: Set<string>,
  primary: Ability,
): Ranked<RaceChoice>[] {
  const out: Ranked<RaceChoice>[] = [];
  for (const race of RACES) {
    const options = race.subraces.length ? race.subraces : [undefined];
    for (const subrace of options) {
      const tags: Tags = { ...race.tags };
      for (const [t, w] of Object.entries(subrace?.tags ?? {}) as [Tag, number][]) tags[t] = (tags[t] ?? 0) + w;
      const a = affinity(tags, profile);
      out.push({
        item: { race, subrace },
        score: a + raceSynergy(race, subrace, classArmour, style, primary),
        fit: Math.round(Math.max(0, a) * 100),
        reasons: topReasons(tags, profile),
      });
    }
  }
  return out.sort((x, y) => y.score - x.score);
}

// ----- Background & skills --------------------------------------------------

const SKILL_TAGS: Record<Skill, Tags> = {
  Acrobatics: { finesse: 2 },
  'Animal Handling': { beast: 2, nature: 1 },
  Arcana: { arcane: 2, scholar: 1 },
  Athletics: { brute: 2, martial: 1 },
  Deception: { trickster: 2 },
  History: { scholar: 2, noble: 1 },
  Insight: { healer: 1, divine: 1, ascetic: 1 },
  Intimidation: { brute: 1, vengeance: 2 },
  Investigation: { scholar: 2 },
  Medicine: { healer: 2 },
  Nature: { nature: 2 },
  Perception: { shadow: 1, ranged: 1 },
  Performance: { music: 3 },
  Persuasion: { charm: 2, noble: 1 },
  Religion: { divine: 2 },
  'Sleight of Hand': { trickster: 1, shadow: 1 },
  Stealth: { shadow: 2 },
  Survival: { nature: 1, outcast: 1 },
};

function skillValue(skill: Skill, priority: Ability[], profile: Profile): number {
  const idx = priority.indexOf(SKILLS[skill]);
  return (6 - idx) * 0.6 + dot(SKILL_TAGS[skill], profile) * 0.15 + (skill === 'Perception' ? 1.5 : 0);
}

export function rankBackgrounds(profile: Profile, priority: Ability[]) {
  return rank(BACKGROUNDS, profile, (b: Background) => {
    const useful = b.skills.filter((s) => priority.slice(0, 3).includes(SKILLS[s])).length;
    return useful * 0.04;
  });
}

export function pickSkills(
  cls: ClassDef,
  fixed: Skill[],
  priority: Ability[],
  profile: Profile,
  override: Skill[] | undefined,
): Skill[] {
  const pool = (cls.skillChoices.from === 'any' ? SKILL_NAMES : cls.skillChoices.from).filter((s) => !fixed.includes(s));
  const count = cls.skillChoices.count;
  const valid = (override ?? []).filter((s) => pool.includes(s));
  if (override && valid.length === count) return valid;
  const auto = [...pool].sort((a, b) => skillValue(b, priority, profile) - skillValue(a, priority, profile));
  const out = [...valid];
  for (const s of auto) if (out.length < count && !out.includes(s)) out.push(s);
  return out;
}

export function bestExtraSkill(taken: Skill[], priority: Ability[], profile: Profile): Skill | undefined {
  return SKILL_NAMES.filter((s) => !taken.includes(s)).sort(
    (a, b) => skillValue(b, priority, profile) - skillValue(a, priority, profile),
  )[0];
}

// ----- Feats ----------------------------------------------------------------

export interface FeatContext {
  profile: Profile;
  style: Set<string>;
  armour: ArmourCategory[];
  caster: boolean;
  scores: Scores;
  priority: Ability[];
  saves: Ability[];
  taken: string[];
}

export function featEligible(feat: Feat, ctx: FeatContext): boolean {
  if (!feat.repeatable && ctx.taken.includes(feat.id)) return false;
  const r = feat.requires;
  if (r?.armour && !ctx.armour.includes(r.armour)) return false;
  if (r?.spellcaster && !ctx.caster) return false;
  if (r?.ability && ctx.scores[r.ability.ability] < r.ability.min) return false;
  // Pointless armour feats
  if (feat.id === 'lightly-armoured' && ctx.armour.includes('light')) return false;
  if (feat.id === 'moderately-armoured' && ctx.armour.includes('medium')) return false;
  if (feat.id === 'heavily-armoured' && ctx.armour.includes('heavy')) return false;
  if (feat.abilityPlus && !feat.abilityPlus.some((a) => ctx.scores[a] < ABILITY_CAP)) return false;
  return true;
}

export function halfFeatAbility(feat: Feat, ctx: FeatContext): Ability | undefined {
  if (!feat.abilityPlus) return undefined;
  if (feat.id === 'resilient') {
    const pref: Ability[] = ctx.caster ? ['CON', 'WIS', 'DEX'] : ['WIS', 'CON', 'DEX'];
    return pref.find((a) => !ctx.saves.includes(a) && ctx.scores[a] < ABILITY_CAP) ?? feat.abilityPlus[0];
  }
  const ordered = ctx.priority.filter((a) => feat.abilityPlus!.includes(a) && ctx.scores[a] < ABILITY_CAP);
  return ordered.find((a) => ctx.scores[a] % 2 === 1) ?? ordered[0];
}

export function scoreFeat(feat: Feat, ctx: FeatContext): number {
  const [p1, p2] = ctx.priority as [Ability, Ability];
  if (feat.id === ABILITY_IMPROVEMENT) {
    if (ctx.scores[p1] < ABILITY_CAP) return 5 + (ctx.scores[p1] <= 16 ? 1 : 0);
    return ctx.scores[p2] < ABILITY_CAP ? 2 : 0.5;
  }
  let s = affinity(feat.tags, ctx.profile) * 3;
  s += feat.synergy.filter((k) => ctx.style.has(k)).length * 1.5;
  const ability = halfFeatAbility(feat, ctx);
  if (ability && (ability === p1 || ability === p2) && ctx.scores[ability] % 2 === 1) s += 1.5;
  if (feat.id === 'resilient' && ctx.caster && !ctx.saves.includes('CON')) s += 1;
  if (feat.id === 'war-caster' && ctx.style.has('melee')) s += 0.5;
  if (feat.id === 'alert') s += 0.5;
  return s;
}

export function rankFeats(ctx: FeatContext): Ranked<Feat>[] {
  return FEATS.filter((f) => featEligible(f, ctx))
    .map((item) => ({
      item,
      score: scoreFeat(item, ctx),
      fit: Math.round(affinity(item.tags, ctx.profile) * 100),
      reasons: topReasons(item.tags, ctx.profile),
    }))
    .sort((a, b) => b.score - a.score);
}

// ----- Generic choices (fighting styles, metamagic, invocations, pact boons)

export function rankChoices<T extends Choice>(choices: T[], profile: Profile, style: Set<string>): Ranked<T>[] {
  return choices
    .map((item) => ({
      item,
      score: item.rating + affinity(item.tags, profile) * 2 + (item.synergy ?? []).filter((k) => style.has(k)).length * 2,
      fit: Math.round(affinity(item.tags, profile) * 100),
      reasons: topReasons(item.tags, profile),
    }))
    .sort((a, b) => b.score - a.score);
}

// ----- Spells ---------------------------------------------------------------

export interface SpellContext {
  profile: Profile;
  style: Set<string>;
  known: Spell[];
  favourites: string[];
}

export function scoreSpell(spell: Spell, ctx: SpellContext): number {
  let s = affinity(spell.tags, ctx.profile) * 4 + spell.rating * 1.2;
  if (ctx.favourites.includes(spell.id)) s += 20;
  const roles = new Set(spell.role);
  if (ctx.style.has('blaster') && roles.has('damage')) s += 1;
  if (ctx.style.has('control') && (roles.has('control') || roles.has('debuff'))) s += 1;
  if (ctx.style.has('healer') && roles.has('heal')) s += 1;
  if (ctx.style.has('support') && roles.has('buff')) s += 0.8;
  if (ctx.style.has('tank') && roles.has('defence')) s += 0.5;
  if (spell.level === 0 && roles.has('damage') && !ctx.known.some((k) => k.level === 0 && k.role.includes('damage'))) s += 2;
  if (spell.level > 0 && roles.has('damage') && !ctx.known.some((k) => k.level > 0 && k.role.includes('damage'))) s += 0.8;
  const conc = ctx.known.filter((k) => k.concentration && k.level > 0).length;
  if (spell.concentration && conc >= 2) s -= 0.5 * (conc - 1);
  if (spell.cast === 'bonus') s += 0.2;
  s += 0.35 * spell.level;
  return s;
}

export function rankSpells(spells: Spell[], ctx: SpellContext): Ranked<Spell>[] {
  return spells
    .map((item) => ({
      item,
      score: scoreSpell(item, ctx),
      fit: Math.round(affinity(item.tags, ctx.profile) * 100),
      reasons: topReasons(item.tags, ctx.profile),
    }))
    .sort((a, b) => b.score - a.score);
}
