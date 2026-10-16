import { z } from 'zod';
import { BACKGROUNDS, CLASSES, FEATS, ITEMS, QUESTIONS, RACES, SPELLS, SUBCLASSES, weaponById } from './index';
import { Background, ClassDef, Feat, Item, Question, Race, Spell, StoryChapter, StoryPerson, Subclass } from './schema';
import { STORY, STORY_PEOPLE } from './story';

/** Words that would give away story content; item descriptions must avoid them. */
const SPOILER_WORDS = /\b(astarion|shadowheart|gale|lae'?zel|wyll|karlach|minthara|halsin|jaheira|minsc|withers|orin|gortash|ketheric|raphael|nautiloid|illithid|mind ?flayers?|tadpoles?|absolute|netherbrain|emperor|dark urge)\b/i;

/** Returns a list of human-readable problems (empty when the data is valid). */
export function validateAll(): string[] {
  const problems: string[] = [];
  const check = <T>(label: string, schema: z.ZodType<T>, rows: unknown[]) => {
    rows.forEach((row, i) => {
      const r = schema.safeParse(row);
      if (!r.success) problems.push(`${label}[${i}] ${(row as { id?: string }).id ?? ''}: ${r.error.issues.map((x) => `${x.path.join('.')} ${x.message}`).join('; ')}`);
    });
  };
  check('race', Race, RACES);
  check('class', ClassDef, CLASSES);
  check('subclass', Subclass, SUBCLASSES);
  check('background', Background, BACKGROUNDS);
  check('feat', Feat, FEATS);
  check('spell', Spell, SPELLS);
  check('item', Item, ITEMS);
  check('question', Question, QUESTIONS);
  check('story chapter', StoryChapter, STORY);
  check('story person', StoryPerson, STORY_PEOPLE);

  const unique = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problems.push(`duplicate ${label} id: ${id}`);
      seen.add(id);
    }
  };
  unique('class', CLASSES.map((c) => c.id));
  unique('subclass', SUBCLASSES.map((c) => c.id));
  unique('race', RACES.flatMap((r) => [r.id, ...r.subraces.map((s) => s.id)]));
  unique('spell', SPELLS.map((s) => s.id));
  unique('item', ITEMS.map((s) => s.id));
  unique('feat', FEATS.map((s) => s.id));

  const spellIds = new Set(SPELLS.map((s) => s.id));
  const classIds = new Set(CLASSES.map((c) => c.id));
  for (const s of SPELLS) for (const c of s.classes) if (!classIds.has(c)) problems.push(`spell ${s.id}: unknown class ${c}`);
  for (const sc of SUBCLASSES) {
    if (!classIds.has(sc.classId)) problems.push(`subclass ${sc.id}: unknown class ${sc.classId}`);
    for (const b of sc.bonusSpells ?? []) for (const id of b.spells) if (!spellIds.has(id)) problems.push(`subclass ${sc.id}: unknown spell ${id}`);
  }
  for (const r of RACES) {
    for (const s of [...(r.innateSpells ?? []), ...r.subraces.flatMap((x) => x.innateSpells ?? [])]) {
      if (!spellIds.has(s.spell)) problems.push(`race ${r.id}: unknown spell ${s.spell}`);
    }
  }
  for (const c of CLASSES) {
    if (CLASSES.length && !SUBCLASSES.some((s) => s.classId === c.id)) problems.push(`class ${c.id}: no subclasses`);
    if (c.casterType !== 'none' && !SPELLS.some((s) => s.classes.includes(c.id) && s.level === 1)) problems.push(`class ${c.id}: no level-1 spells`);
  }
  for (const i of ITEMS) {
    if (i.weapon && !weaponById(i.weapon)) problems.push(`item ${i.id}: unknown weapon ${i.weapon}`);
    if (!i.roleDescription.trim()) problems.push(`item ${i.id}: missing roleDescription`);
    if (i.roleDescription.toLowerCase().includes(i.name.toLowerCase())) problems.push(`item ${i.id}: roleDescription reveals the name`);
    if (SPOILER_WORDS.test(i.roleDescription) || i.properties.some((p) => SPOILER_WORDS.test(p))) problems.push(`item ${i.id}: spoiler word in public text`);
  }
  for (const q of QUESTIONS) {
    for (const o of q.options) if (SPOILER_WORDS.test(o.text) || SPOILER_WORDS.test(o.fragment)) problems.push(`question ${q.id}/${o.id}: spoiler word`);
  }
  const sceneIds = STORY.flatMap((c) => c.scenes.map((s) => s.id));
  unique('story scene', sceneIds);
  for (const c of STORY) {
    if (SPOILER_WORDS.test(c.intro)) problems.push(`story ${c.id}: spoiler word in intro`);
    for (const s of c.scenes) {
      unique(`option in scene ${s.id}`, s.options.map((o) => o.id));
      for (const text of [s.text, ...s.options.flatMap((o) => [o.text, o.narration, o.lore ?? ''])]) {
        if (SPOILER_WORDS.test(text)) problems.push(`story ${s.id}: spoiler word in "${text.slice(0, 40)}…"`);
      }
      if (s.options.some((o) => o.fateOnly) && !s.fate) problems.push(`story ${s.id}: fate-only option in a scene without a fate roll`);
    }
  }
  return problems;
}
