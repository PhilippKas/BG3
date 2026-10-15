import { ARMOURS, ITEMS, SHIELD_AC, weaponById } from '../data';
import type { Ability, ArmourCategory, BaseWeapon, ClassDef, Item, Slot, Subclass } from '../data/schema';
import { modifier, type Scores } from './abilities';
import { affinity, type Profile } from './tags';
import type { WeaponStyle } from './recommend';

export interface ArmourPlan {
  label: string;
  ac: number;
  category: ArmourCategory | 'none';
  shield: boolean;
  note?: string;
}

export function hasWeaponProficiency(profs: string[], weapon: BaseWeapon): boolean {
  return profs.includes(weapon.category) || profs.includes(weapon.id);
}

export function planArmour(
  cls: ClassDef,
  sub: Subclass,
  armour: ArmourCategory[],
  scores: Scores,
  weaponStyle: WeaponStyle,
  defenceStyle: boolean,
): ArmourPlan {
  const dex = modifier(scores.DEX);
  const shield = armour.includes('shield') && (weaponStyle === 'shield' || (weaponStyle === 'caster' && cls.casterType !== 'none'));
  const candidates: ArmourPlan[] = [];
  for (const cat of ['heavy', 'medium', 'light'] as const) {
    // Monks lose their class features in armour.
    if (!armour.includes(cat) || cls.id === 'monk') continue;
    const best = ARMOURS.filter((a) => a.category === cat).sort((a, b) => b.ac - a.ac)[0]!;
    const dexBonus = best.dexCap === null ? dex : Math.min(dex, best.dexCap);
    candidates.push({ label: best.name, ac: best.ac + dexBonus, category: cat, shield });
  }
  if (cls.id === 'barbarian') {
    candidates.push({ label: 'Unarmoured Defence', ac: 10 + dex + modifier(scores.CON), category: 'none', shield, note: 'AC = 10 + DEX + CON' });
  }
  if (cls.id === 'monk') {
    candidates.push({ label: 'Unarmoured Defence', ac: 10 + dex + modifier(scores.WIS), category: 'none', shield: false, note: 'AC = 10 + DEX + WIS' });
  }
  if (sub.id === 'draconic') {
    candidates.push({ label: 'Draconic Resilience', ac: 13 + dex, category: 'none', shield, note: 'Natural armour: 13 + DEX' });
  }
  if (!candidates.length) {
    candidates.push({ label: 'Robes + Mage Armour', ac: 13 + dex, category: 'none', shield, note: 'Assumes the Mage Armour spell (or a scroll/potion)' });
  }
  const best = candidates.sort((a, b) => b.ac - a.ac)[0]!;
  return { ...best, ac: best.ac + (best.shield ? SHIELD_AC : 0) + (defenceStyle && best.category !== 'none' ? 1 : 0) };
}

export interface WeaponPlan {
  melee: string;
  offhand: string;
  ranged: string;
}

function firstProficient(ids: string[], profs: string[]): BaseWeapon | undefined {
  return ids.map(weaponById).find((w): w is BaseWeapon => !!w && hasWeaponProficiency(profs, w));
}

export function planWeapons(weaponStyle: WeaponStyle, profs: string[], feats: string[], primary: Ability): WeaponPlan {
  const name = (ids: string[], fallback = '—') => firstProficient(ids, profs)?.name ?? fallback;
  const rangedBackup =
    primary === 'STR'
      ? name(['longbow', 'heavy-crossbow', 'javelin', 'handaxe', 'light-crossbow', 'shortbow'])
      : name(['hand-crossbow', 'longbow', 'light-crossbow', 'shortbow']);
  switch (weaponStyle) {
    case 'two-handed': {
      const polearm = feats.includes('polearm-master');
      return {
        melee: polearm ? name(['glaive', 'halberd', 'quarterstaff', 'spear']) : name(['greatsword', 'maul', 'greataxe', 'greatclub', 'quarterstaff']),
        offhand: '— (two-handed)',
        ranged: rangedBackup,
      };
    }
    case 'shield':
      return { melee: name(['longsword', 'warhammer', 'morningstar', 'flail', 'mace', 'scimitar']), offhand: 'Shield', ranged: rangedBackup };
    case 'dual-wield': {
      const dw = feats.includes('dual-wielder');
      const main = dw ? name(['rapier', 'longsword', 'shortsword']) : name(['shortsword', 'scimitar', 'dagger', 'handaxe']);
      return { melee: main, offhand: dw ? main : name(['scimitar', 'shortsword', 'dagger']), ranged: rangedBackup };
    }
    case 'finesse':
      return { melee: name(['rapier', 'shortsword', 'scimitar', 'dagger']), offhand: '— (free hand)', ranged: rangedBackup };
    case 'ranged':
      return {
        melee: name(['shortsword', 'scimitar', 'rapier', 'dagger']),
        offhand: '—',
        ranged: name(primary === 'STR' ? ['longbow', 'heavy-crossbow'] : ['longbow', 'hand-crossbow', 'heavy-crossbow', 'shortbow', 'light-crossbow']),
      };
    case 'unarmed':
      return { melee: 'Unarmed strikes (keep hands free)', offhand: '—', ranged: name(['shortbow', 'light-crossbow', 'dagger']) };
    case 'caster':
    default:
      return { melee: name(['quarterstaff', 'mace', 'dagger', 'club']), offhand: '— (or a shield if proficient)', ranged: name(['light-crossbow', 'shortbow', 'hand-crossbow']) };
  }
}

const SLOT_LABELS: Record<Slot, string> = {
  head: 'Head',
  cloak: 'Cloak',
  armour: 'Armour',
  hands: 'Hands',
  feet: 'Feet',
  amulet: 'Amulet',
  ring: 'Rings',
  melee: 'Melee weapon',
  offhand: 'Off-hand',
  ranged: 'Ranged weapon',
};

export interface GearSlotPlan {
  slot: Slot;
  label: string;
  /** Spoiler-free baseline (base item type). */
  baseline: string;
  /** What to look for in this slot. */
  lookFor: string;
  items: { item: Item; score: number }[];
}

export interface GearContext {
  profile: Profile;
  synergy: Set<string>;
  armour: ArmourCategory[];
  weaponProfs: string[];
  weaponStyle: WeaponStyle;
  armourPlan: ArmourPlan;
  weapons: WeaponPlan;
  primary: Ability;
}

function itemFits(item: Item, ctx: GearContext): boolean {
  if (item.armourCategory && item.slot === 'armour' && !ctx.armour.includes(item.armourCategory)) return false;
  if (item.slot === 'armour' && ctx.armourPlan.category === 'none' && ctx.synergy.has('unarmoured')) return false;
  if (item.slot === 'offhand' && item.armourCategory === 'shield' && !ctx.armourPlan.shield) return false;
  if (item.weapon) {
    const w = weaponById(item.weapon);
    if (!w || !hasWeaponProficiency(ctx.weaponProfs, w)) return false;
    if (item.slot === 'melee') {
      const p = w.properties;
      const ok: Record<WeaponStyle, boolean> = {
        'two-handed': p.includes('two-handed') || p.includes('versatile') || p.includes('thrown'),
        shield: !p.includes('two-handed'),
        'dual-wield': p.includes('light') || p.includes('finesse'),
        finesse: p.includes('finesse'),
        ranged: false,
        unarmed: false,
        caster: item.synergy.includes('caster'),
      };
      if (!ok[ctx.weaponStyle]) return false;
    }
  }
  // Items tied to abilities need at least one ability or style match.
  return item.synergy.some((s) => ctx.synergy.has(s));
}

const LOOK_FOR: Record<string, (ctx: GearContext) => string> = {
  head: (c) => (c.synergy.has('caster') ? 'Spell save DC or spell attack bonuses.' : 'Initiative, saving throws or your main ability.'),
  cloak: () => 'AC, saving throws or resistances.',
  armour: (c) => (c.armourPlan.category === 'none' ? 'Clothing/robes with spellcasting or AC bonuses.' : `Better ${c.armourPlan.category} armour (+1/+2) or armour with defensive riders.`),
  hands: (c) => (c.synergy.has('caster') ? 'Bonuses to spell damage or concentration.' : 'Extra damage or attack-roll bonuses on hit.'),
  feet: () => 'Movement speed, mobility tricks or immunity to difficult terrain.',
  amulet: (c) => (c.synergy.has('caster') ? 'Spell slot recovery or spell DC.' : 'Free spells (e.g. teleport) or ability boosts.'),
  ring: () => 'Two ring slots: stack AC/saves, extra damage riders or utility.',
  melee: (c) => (c.weaponStyle === 'unarmed' ? 'Gloves and items that empower unarmed strikes.' : 'A +1/+2 version of your weapon, or one with damage riders.'),
  offhand: (c) => (c.armourPlan.shield ? 'A magic shield (+1/+2) or one with reactions.' : 'Depends on your style.'),
  ranged: () => 'A magic bow or crossbow for when melee isn’t possible.',
};

export function planGear(ctx: GearContext): GearSlotPlan[] {
  const slots: Slot[] = ['head', 'cloak', 'armour', 'hands', 'feet', 'amulet', 'ring', 'melee', 'offhand', 'ranged'];
  const baseline: Partial<Record<Slot, string>> = {
    armour: `${ctx.armourPlan.label}${ctx.armourPlan.note ? ` — ${ctx.armourPlan.note}` : ''}`,
    melee: ctx.weapons.melee,
    offhand: ctx.armourPlan.shield ? 'Shield' : ctx.weapons.offhand,
    ranged: ctx.weapons.ranged,
  };
  return slots.map((slot) => {
    const items = ITEMS.filter((i) => i.slot === slot && itemFits(i, ctx))
      .map((item) => ({
        item,
        score: item.rating + affinity(item.tags, ctx.profile) * 2 + item.synergy.filter((s) => ctx.synergy.has(s)).length * 1.5,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return { slot, label: SLOT_LABELS[slot], baseline: baseline[slot] ?? 'Any', lookFor: LOOK_FOR[slot]!(ctx), items };
  });
}

