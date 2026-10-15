import {
  ABILITY_IMPROVEMENT,
  FIGHTING_STYLES,
  INVOCATIONS,
  METAMAGIC,
  PACT_BOONS,
  QUESTIONS,
  SPELLS,
  backgroundById,
  classById,
  featById,
  raceById,
  spellById,
  subclassById,
} from '../data';
import {
  type Ability,
  type ArmourCategory,
  type Background,
  type Choice,
  type ClassDef,
  type Feature,
  type Race,
  type Skill,
  type Spell,
  type Subclass,
  type Subrace,
  type Tag,
} from '../data/schema';
import {
  addIncreases,
  allocate,
  applyBonuses,
  isLegalPointBuy,
  isValidPointBuy,
  modifier,
  planAbilityImprovement,
  type Scores,
} from './abilities';
import { planArmour, planGear, planWeapons, type ArmourPlan, type GearSlotPlan, type WeaponPlan } from './gear';
import {
  cantripsKnown,
  effectiveCaster,
  extraAttackLevel,
  invocationsKnown,
  maxSpellLevel,
  metamagicKnown,
  proficiencyBonus,
  spellSlots,
  spellsKnown,
  spellsPrepared,
  averageHpPerLevel,
} from './progression';
import {
  abilityPriority,
  allowedWeaponStyles,
  bestExtraSkill,
  halfFeatAbility,
  pickSkills,
  raceArmour,
  rankBackgrounds,
  rankChoices,
  rankClasses,
  rankFeats,
  rankRaces,
  rankSpells,
  rankSubclasses,
  rankWeaponStyles,
  type FeatContext,
  type RaceChoice,
  type Ranked,
  type WeaponStyle,
} from './recommend';
import { buildProfile, type Profile } from './tags';
import { composeBackstory } from './backstory';

export type PickKind =
  | 'fighting-style'
  | 'feat'
  | 'cantrips'
  | 'spells'
  | 'secrets'
  | 'arcanum'
  | 'metamagic'
  | 'pact-boon'
  | 'invocations';

export interface Choices {
  name: string;
  answers: Record<string, string>;
  classId?: string;
  subclassId?: string;
  raceId?: string;
  subraceId?: string;
  backgroundId?: string;
  weaponStyle?: WeaponStyle;
  base?: Scores;
  plus2?: Ability;
  plus1?: Ability;
  skills?: Skill[];
  /** Overrides keyed by `${level}:${kind}`. */
  picks: Record<string, string[]>;
  favouriteSpells: string[];
  excludedSpells: string[];
}

export const emptyChoices = (): Choices => ({ name: '', answers: {}, picks: {}, favouriteSpells: [], excludedSpells: [] });

export interface PickOption {
  id: string;
  name: string;
  summary: string;
  score: number;
  reasons: Tag[];
  meta?: string;
}

export interface LevelPick {
  key: string;
  kind: PickKind;
  label: string;
  count: number;
  options: PickOption[];
  chosen: string[];
  overridden: boolean;
  /** Extra info such as the ability increase applied by a feat. */
  note?: string;
}

export interface LevelFeature extends Feature {
  source: 'class' | 'subclass' | 'race';
}

export interface LevelPlan {
  level: number;
  hp: number;
  hpGain: number;
  proficiency: number;
  features: LevelFeature[];
  picks: LevelPick[];
  /** Always-prepared or racial spells gained this level. */
  grantedSpells: string[];
  /** Suggested prepared spells (prepared casters / wizards). */
  prepared: string[];
  preparedCount: number;
  slots: number[];
  scores: Scores;
  attacks: number;
  spellDC?: number;
  spellAttack?: number;
}

export interface Build {
  choices: Choices;
  profile: Profile;
  answered: number;
  complete: boolean;
  cls: ClassDef;
  sub: Subclass;
  race: Race;
  subrace?: Subrace;
  background: Background;
  ranked: {
    classes: Ranked<ClassDef>[];
    subclasses: Ranked<Subclass>[];
    races: Ranked<RaceChoice>[];
    backgrounds: Ranked<Background>[];
    weaponStyles: WeaponStyle[];
  };
  weaponStyle: WeaponStyle;
  style: Set<string>;
  priority: Ability[];
  base: Scores;
  plus2: Ability;
  plus1: Ability;
  pointBuyValid: boolean;
  start: Scores;
  final: Scores;
  saves: Ability[];
  skills: { skill: Skill; source: string }[];
  armour: ArmourCategory[];
  weaponProfs: string[];
  armourPlan: ArmourPlan;
  weapons: WeaponPlan;
  speed: number;
  darkvision: number;
  levels: LevelPlan[];
  spellList?: string;
  castingAbility?: Ability;
  allSpells: string[];
  backstory: string;
  gear: GearSlotPlan[];
}

const isPlaceholder = (f: Feature) => f.summary === 'Your subclass grants a new feature.';

const toOption = <T extends { id: string; name: string; summary: string }>(r: Ranked<T>, meta?: string): PickOption => ({
  id: r.item.id,
  name: r.item.name,
  summary: r.item.summary,
  score: r.score,
  reasons: r.reasons,
  meta,
});

/** Resolve a pick: valid overrides first, then the best-ranked remaining options. */
function resolve(options: PickOption[], count: number, override: string[] | undefined): { chosen: string[]; overridden: boolean } {
  const valid = (override ?? []).filter((id) => options.some((o) => o.id === id)).slice(0, count);
  const chosen = [...valid];
  for (const o of options) if (chosen.length < count && !chosen.includes(o.id)) chosen.push(o.id);
  return { chosen, overridden: valid.length > 0 };
}

const spellMeta = (s: Spell) =>
  `${s.level === 0 ? 'Cantrip' : `Level ${s.level}`} · ${s.school}${s.concentration ? ' · Concentration' : ''}${s.damage ? ` · ${s.damage}` : ''}`;

export function deriveBuild(choices: Choices): Build {
  const profile = buildProfile(choices.answers);
  const answered = QUESTIONS.filter((q) => choices.answers[q.id]).length;

  // Class & subclass
  const classes = rankClasses(profile);
  const cls = (choices.classId && classById(choices.classId)) || classes[0]!.item;
  const subclasses = rankSubclasses(cls, profile);
  const chosenSub = choices.subclassId ? subclassById(choices.subclassId) : undefined;
  const sub = chosenSub && chosenSub.classId === cls.id ? chosenSub : subclasses[0]!.item;

  // Weapon style & ability priority
  const allowed = allowedWeaponStyles(cls, sub);
  const weaponStyles = rankWeaponStyles(allowed, profile);
  const weaponStyle = choices.weaponStyle && allowed.includes(choices.weaponStyle) ? choices.weaponStyle : weaponStyles[0]!;
  const caster = effectiveCaster(cls, sub);
  const style = new Set<string>([...cls.style, ...(sub.style ?? [])]);
  ['two-handed', 'shield', 'dual-wield', 'ranged', 'finesse'].forEach((s) => style.delete(s));
  style.add(weaponStyle);
  if (caster !== 'none') style.add('caster');
  if (caster === 'third') style.add('third-caster');
  const priority = abilityPriority(cls, sub, weaponStyle);

  // Race
  const classArmour = [...new Set([...cls.armour, ...(sub.extraArmour ?? [])])];
  const races = rankRaces(profile, classArmour, style, priority[0]!);
  const chosenRace = choices.raceId ? raceById(choices.raceId) : undefined;
  let race: Race;
  let subrace: Subrace | undefined;
  if (chosenRace) {
    race = chosenRace;
    subrace =
      race.subraces.find((s) => s.id === choices.subraceId) ??
      races.find((r) => r.item.race.id === race.id)?.item.subrace;
  } else {
    race = races[0]!.item.race;
    subrace = races[0]!.item.subrace;
  }

  // Background
  const backgrounds = rankBackgrounds(profile, priority);
  const background = (choices.backgroundId && backgroundById(choices.backgroundId)) || backgrounds[0]!.item;

  // Abilities
  const base = choices.base && isLegalPointBuy(choices.base) ? choices.base : allocate(priority);
  const plus2 = choices.plus2 ?? priority[0]!;
  const plus1 = choices.plus1 && choices.plus1 !== plus2 ? choices.plus1 : priority.find((a) => a !== plus2)!;
  const start = applyBonuses(base, plus2, plus1);

  // Proficiencies
  const armour = [...new Set<ArmourCategory>([...classArmour, ...raceArmour(race, subrace)])];
  const weaponProfs = [
    ...new Set([...cls.weapons, ...(sub.extraWeapons ?? []), ...race.weapons, ...(subrace?.weapons ?? [])]),
  ];
  const fixedSkills: { skill: Skill; source: string }[] = [
    ...background.skills.map((skill) => ({ skill, source: background.name })),
    ...[...race.skills, ...(subrace?.skills ?? [])].map((skill) => ({ skill, source: subrace?.name ?? race.name })),
  ];
  const fixed = fixedSkills.map((s) => s.skill);
  const classSkills = pickSkills(cls, fixed, priority, profile, choices.skills);
  const skills = [...fixedSkills, ...classSkills.map((skill) => ({ skill, source: cls.name }))];
  if (race.bonusSkills) {
    const extra = bestExtraSkill(
      skills.map((s) => s.skill),
      priority,
      profile,
    );
    if (extra) skills.push({ skill: extra, source: `${race.name} Versatility` });
  }
  const unique = skills.filter((s, i) => skills.findIndex((o) => o.skill === s.skill) === i);

  // Spell list
  const spellList = cls.casterType !== 'none' ? cls.id : sub.spellList;
  const castingAbility = cls.castingAbility ?? (sub.casterType === 'third' ? 'INT' : undefined);
  const excluded = new Set(choices.excludedSpells);
  const bonusSpellIds = (level: number) => (sub.bonusSpells ?? []).filter((b) => b.level === level).flatMap((b) => b.spells);
  const isWarlockPatronSpell = (id: string) => cls.id === 'warlock' && (sub.bonusSpells ?? []).some((b) => b.spells.includes(id));

  const startArmour = [...armour];

  // Level loop state
  let scores = { ...start };
  const known: Spell[] = [];
  const always = new Set<string>();
  const taken: string[] = [];
  const takenChoices = new Set<string>();
  let fightingStyles: string[] = [];
  const levels: LevelPlan[] = [];
  let hpPerLevelBonus = (subrace?.hpPerLevel ?? 0) + (sub.id === 'draconic' ? 1 : 0);

  for (let level = 1; level <= 12; level++) {
    const features: LevelFeature[] = [];
    const subFeatures = sub.features.filter((f) => f.level === level);
    for (const f of cls.levels[level - 1]!.features) {
      if (isPlaceholder(f) && subFeatures.length) continue;
      features.push({ ...f, source: 'class' });
    }
    if (level === cls.subclassLevel) features.push({ name: `${cls.subclassLabel}: ${sub.name}`, summary: sub.summary, source: 'subclass' });
    for (const f of subFeatures) features.push({ name: f.name, summary: f.summary, source: 'subclass' });
    const ea = extraAttackLevel(cls, sub);

    const picks: LevelPick[] = [];
    const grantedSpells: string[] = [];
    const key = (kind: PickKind) => `${level}:${kind}`;

    // Racial innate spells
    for (const s of [...(race.innateSpells ?? []), ...(subrace?.innateSpells ?? [])]) {
      if (s.level === level) grantedSpells.push(s.spell);
    }
    for (const id of bonusSpellIds(level)) if (!isWarlockPatronSpell(id)) grantedSpells.push(id);
    grantedSpells.forEach((id) => always.add(id));

    // Fighting style
    const fsLevel = { fighter: 1, paladin: 2, ranger: 2 }[cls.id as 'fighter'];
    const swordsBard = sub.id === 'swords' && level === 3;
    if (level === fsLevel || swordsBard || (sub.id === 'champion' && level === 10)) {
      const pool = FIGHTING_STYLES.filter(
        (f) => f.classes.includes(swordsBard ? 'bard' : cls.id) && !fightingStyles.includes(f.id) && (!swordsBard || ['duelling', 'two-weapon-fighting'].includes(f.id)),
      );
      const options = rankChoices(pool, profile, style).map((r) => toOption(r));
      const r = resolve(options, 1, choices.picks[key('fighting-style')]);
      fightingStyles = [...fightingStyles, ...r.chosen];
      picks.push({ key: key('fighting-style'), kind: 'fighting-style', label: 'Fighting Style', count: 1, options, ...r });
    }

    // Pact boon
    if (cls.id === 'warlock' && level === 3) {
      const options = rankChoices(PACT_BOONS, profile, style).map((r) => toOption(r));
      if (sub.id === 'hexblade') {
        const blade = options.findIndex((o) => o.id === 'pact-of-the-blade');
        options.unshift(...options.splice(blade, 1));
      }
      const r = resolve(options, 1, choices.picks[key('pact-boon')]);
      r.chosen.forEach((c) => takenChoices.add(c));
      picks.push({ key: key('pact-boon'), kind: 'pact-boon', label: 'Pact Boon', count: 1, options, ...r });
    }

    // Invocations
    if (cls.id === 'warlock') {
      const n = invocationsKnown(level) - invocationsKnown(level - 1);
      if (n > 0) {
        const pool = INVOCATIONS.filter(
          (i) => !takenChoices.has(i.id) && (i.minLevel ?? 1) <= level && (!i.requires || takenChoices.has(i.requires)),
        );
        const options = rankChoices(pool, profile, style).map((r) => toOption(r));
        const r = resolve(options, n, choices.picks[key('invocations')]);
        r.chosen.forEach((c) => takenChoices.add(c));
        picks.push({ key: key('invocations'), kind: 'invocations', label: 'Eldritch Invocations', count: n, options, ...r });
      }
    }

    // Metamagic
    if (cls.id === 'sorcerer') {
      const n = metamagicKnown(level) - metamagicKnown(level - 1);
      if (n > 0) {
        const pool: Choice[] = METAMAGIC.filter((m) => !takenChoices.has(m.id));
        const options = rankChoices(pool, profile, style).map((r) => toOption(r));
        const r = resolve(options, n, choices.picks[key('metamagic')]);
        r.chosen.forEach((c) => takenChoices.add(c));
        picks.push({ key: key('metamagic'), kind: 'metamagic', label: 'Metamagic', count: n, options, ...r });
      }
    }

    // Feats
    if (cls.featLevels.includes(level)) {
      const ctx: FeatContext = { profile, style, armour, caster: caster !== 'none', scores, priority, saves: cls.saves, taken };
      const ranked = rankFeats(ctx);
      const options = ranked.map((r) => toOption(r));
      const r = resolve(options, 1, choices.picks[key('feat')]);
      const feat = featById(r.chosen[0]!)!;
      let note: string | undefined;
      if (feat.id === ABILITY_IMPROVEMENT) {
        const inc = planAbilityImprovement(scores, priority);
        scores = addIncreases(scores, inc);
        note = Object.entries(inc)
          .filter(([, v]) => v)
          .map(([a, v]) => `+${v} ${a}`)
          .join(', ');
      } else {
        const a = halfFeatAbility(feat, ctx);
        if (a) {
          scores = addIncreases(scores, { [a]: 1 });
          note = `+1 ${a}`;
        }
        if (feat.id === 'tough') hpPerLevelBonus += 2;
        if (feat.id === 'heavily-armoured' && !armour.includes('heavy')) armour.push('heavy');
        if (feat.id === 'moderately-armoured') ['medium', 'shield'].forEach((c) => !armour.includes(c as ArmourCategory) && armour.push(c as ArmourCategory));
        if (feat.id === 'lightly-armoured' && !armour.includes('light')) armour.push('light');
      }
      taken.push(feat.id);
      picks.push({ key: key('feat'), kind: 'feat', label: 'Feat', count: 1, options, ...r, note });
    }

    // Spells
    const maxLevel = maxSpellLevel(caster, level);
    const listSpells = (spellLevelFilter: (s: Spell) => boolean, anyClass = false) =>
      SPELLS.filter(
        (s) =>
          spellLevelFilter(s) &&
          !excluded.has(s.id) &&
          !known.some((k) => k.id === s.id) &&
          !always.has(s.id) &&
          (anyClass || (spellList && s.classes.includes(spellList)) || isWarlockPatronSpell(s.id)),
      );
    const thirdSchools = sub.id === 'eldritch-knight' ? ['Abjuration', 'Evocation'] : sub.id === 'arcane-trickster' ? ['Enchantment', 'Illusion'] : null;
    const spellCtx = () => ({ profile, style, known, favourites: choices.favouriteSpells });
    const learn = (kind: PickKind, label: string, n: number, pool: Spell[]) => {
      if (n <= 0) return;
      const options = rankSpells(pool, spellCtx()).map((r) => toOption(r, spellMeta(r.item)));
      const r = resolve(options, n, choices.picks[key(kind)]);
      r.chosen.forEach((id) => known.push(spellById(id)!));
      picks.push({ key: key(kind), kind, label, count: n, options, ...r });
    };
    if (spellList) {
      learn('cantrips', 'Cantrips', cantripsKnown(cls, sub, level) - cantripsKnown(cls, sub, level - 1), listSpells((s) => s.level === 0));
      if (cls.spellPrep === 'known' || cls.spellPrep === 'spellbook' || sub.casterType === 'third') {
        let n = spellsKnown(cls, sub, level) - spellsKnown(cls, sub, level - 1);
        if (cls.id === 'bard' && level === 10) n -= 2;
        const pool = listSpells((s) => s.level >= 1 && s.level <= maxLevel && (!thirdSchools || thirdSchools.includes(s.school)));
        learn('spells', cls.spellPrep === 'spellbook' ? 'Spells for your spellbook' : 'Spells known', n, pool);
      }
      if (cls.id === 'bard' && (level === 10 || (sub.id === 'lore' && level === 6))) {
        learn('secrets', 'Magical Secrets (any class)', 2, listSpells((s) => s.level >= 1 && s.level <= maxLevel && !s.classes.includes('bard'), true));
      }
      if (cls.id === 'warlock' && level === 11) {
        learn('arcanum', 'Mystic Arcanum (6th level)', 1, listSpells((s) => s.level === 6));
      }
    }

    // Prepared spells suggestion
    const castingMod = castingAbility ? modifier(scores[castingAbility]) : 0;
    const preparedCount = spellsPrepared(cls, level, castingMod);
    let prepared: string[] = [];
    if (preparedCount > 0 && spellList) {
      const pool =
        cls.spellPrep === 'spellbook'
          ? known.filter((s) => s.level >= 1)
          : SPELLS.filter((s) => s.level >= 1 && s.level <= maxLevel && s.classes.includes(spellList) && !always.has(s.id) && !excluded.has(s.id));
      prepared = rankSpells(pool, { profile, style, known: [], favourites: choices.favouriteSpells })
        .slice(0, preparedCount)
        .map((r) => r.item.id);
    }

    const conMod = modifier(scores.CON);
    const hp = cls.hitDie + (level - 1) * averageHpPerLevel(cls.hitDie) + level * (conMod + hpPerLevelBonus);
    const prof = proficiencyBonus(level);
    const attacks = ea && level >= ea ? (cls.id === 'fighter' && level >= 11 ? 3 : 2) : 1;
    levels.push({
      level,
      hp,
      hpGain: hp - (levels[level - 2]?.hp ?? 0),
      proficiency: prof,
      features,
      picks,
      grantedSpells,
      prepared,
      preparedCount,
      slots: spellSlots(caster, level),
      scores: { ...scores },
      attacks,
      spellDC: castingAbility && spellList ? 8 + prof + castingMod : undefined,
      spellAttack: castingAbility && spellList ? prof + castingMod : undefined,
    });
  }

  const defence = fightingStyles.includes('defence');
  const armourPlan = planArmour(cls, sub, startArmour, start, weaponStyle, defence);
  const weapons = planWeapons(weaponStyle, weaponProfs, taken, priority[0]!);
  if (armourPlan.category === 'none') style.add('unarmoured');
  if (armourPlan.category === 'medium') style.add('medium-armour');
  if (armourPlan.category === 'heavy') style.add('heavy-armour');
  if (armourPlan.shield) style.add('shield');
  if (caster !== 'none') style.add('concentration');

  const synergy = new Set<string>([...style, priority[0]!, priority[1]!]);
  if (priority[0] === 'DEX') synergy.add('finesse');
  const gear = planGear({ profile, synergy, armour: startArmour, weaponProfs, weaponStyle, armourPlan, weapons, primary: priority[0]! });

  const final = levels[11]!.scores;
  const allSpells = [...new Set([...known.map((s) => s.id), ...always])];

  const build: Build = {
    choices,
    profile,
    answered,
    complete: answered === QUESTIONS.length,
    cls,
    sub,
    race,
    subrace,
    background,
    ranked: { classes, subclasses, races, backgrounds, weaponStyles },
    weaponStyle,
    style,
    priority,
    base,
    plus2,
    plus1,
    pointBuyValid: isValidPointBuy(base),
    start,
    final,
    saves: cls.saves,
    skills: unique,
    armour,
    weaponProfs,
    armourPlan,
    weapons,
    speed: subrace?.speed ?? race.speed,
    darkvision: subrace?.darkvision ?? race.darkvision,
    levels,
    spellList,
    castingAbility,
    allSpells,
    backstory: '',
    gear,
  };
  build.backstory = composeBackstory(build);
  return build;
}

