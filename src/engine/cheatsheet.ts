import { spellById, weaponById } from '../data';
import { ABILITIES, SKILLS, type Item } from '../data/schema';
import { TAG_LABELS } from '../data/tags';
import { formatMod, modifier } from './abilities';
import type { Build, LevelPick } from './build';
import { WEAPON_STYLE_LABELS } from './recommend';
import { dominantTags } from './tags';

/** 0 = role only, 1 = name, 2 = name and where to find it. */
export type RevealLevel = (item: Item) => 0 | 1 | 2;

export interface CheatSheetOptions {
  reveal: RevealLevel;
  /** Open the print dialog when the page loads (for "Print / Save as PDF"). */
  autoPrint?: boolean;
}

const esc = (s: string | number) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const ordinal = (n: number) => ['1st', '2nd', '3rd', '4th', '5th', '6th'][n - 1] ?? `${n}th`;

const pickNames = (p: LevelPick) => p.chosen.map((id) => p.options.find((o) => o.id === id)?.name ?? id);

export const cheatSheetTitle = (b: Build) => b.choices.name.trim() || `${b.subrace?.name ?? b.race.name} ${b.cls.name}`;

export const cheatSheetFileName = (b: Build) =>
  `${cheatSheetTitle(b).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'character'}-cheat-sheet.html`;

export function cheatSheetHtml(b: Build, opts: CheatSheetOptions): string {
  const title = cheatSheetTitle(b);
  const l1 = b.levels[0]!;
  const l12 = b.levels[11]!;
  const people = b.subrace?.name ?? b.race.name;
  const prof = new Map(b.skills.map((s) => [s.skill, s.source]));
  const traits = dominantTags(b.profile, 5).map((t) => TAG_LABELS[t]);

  // --- Character creation checklist
  const l1Picks = l1.picks.map((p) => `<li><b>${esc(p.label)}:</b> ${esc(pickNames(p).join(', '))}</li>`).join('');
  const creation = `
    <ol class="steps">
      <li><b>Race:</b> ${esc(b.race.name)}${b.subrace ? ` → ${esc(b.subrace.name)}` : ''}</li>
      <li><b>Class:</b> ${esc(b.cls.name)}${b.cls.subclassLevel === 1 ? ` → ${esc(b.sub.name)}` : ` <span class="m">(${esc(b.cls.subclassLabel)} at level ${b.cls.subclassLevel}: ${esc(b.sub.name)})</span>`}</li>
      <li><b>Background:</b> ${esc(b.background.name)} <span class="m">(${esc(b.background.skills.join(', '))})</span></li>
      <li><b>Abilities (point buy):</b> ${ABILITIES.map((a) => `${a} ${b.base[a]}`).join(' · ')}<br/>
        <b>Bonuses:</b> +2 ${b.plus2}, +1 ${b.plus1} → ${ABILITIES.map((a) => `${a} ${b.start[a]}`).join(' · ')}</li>
      <li><b>Skills:</b> ${esc(b.skills.filter((s) => s.source === b.cls.name || s.source.includes('Versatility')).map((s) => s.skill).join(', '))}</li>
      ${l1Picks}
    </ol>`;

  // --- Stats
  const abilityRows = ABILITIES.map(
    (a) =>
      `<tr${b.priority[0] === a ? ' class="hl"' : ''}><th>${a}</th><td>${b.start[a]} <span class="m">(${formatMod(modifier(b.start[a]))})</span></td><td>${l12.scores[a]} <span class="m">(${formatMod(modifier(l12.scores[a]))})</span></td><td>${b.saves.includes(a) ? '●' : ''}</td></tr>`,
  ).join('');
  const skillRows = Object.keys(SKILLS)
    .filter((s) => prof.has(s as keyof typeof SKILLS))
    .map((s) => {
      const ab = SKILLS[s as keyof typeof SKILLS];
      return `<li>${esc(s)} <span class="m">${formatMod(modifier(b.start[ab]) + 2)}</span></li>`;
    })
    .join('');

  // --- Level plan
  const levelRows = b.levels
    .map((l) => {
      const features = l.features.map((f) => esc(f.name)).join(', ');
      const picks = l.picks
        .map((p) => `<div><b>${esc(p.label)}:</b> ${esc(pickNames(p).join(', '))}${p.note ? ` <span class="m">(${esc(p.note)})</span>` : ''}</div>`)
        .join('');
      const granted = l.grantedSpells.length
        ? `<div><b>Granted:</b> ${esc(l.grantedSpells.map((id) => spellById(id)?.name ?? id).join(', '))}</div>`
        : '';
      const slots = l.slots.some(Boolean)
        ? l.slots.map((n, i) => (n ? `${ordinal(i + 1)}×${n}` : '')).filter(Boolean).join(' ')
        : '—';
      return `<tr><td class="lv">${l.level}</td><td>${l.hp}</td><td>${features || '<span class="m">—</span>'}</td><td>${picks}${granted}</td><td class="m">${slots}</td></tr>`;
    })
    .join('');

  // --- Spells
  const spellIds = b.allSpells.filter((id) => spellById(id));
  const spellList = spellIds.length
    ? [0, 1, 2, 3, 4, 5, 6]
        .map((lvl) => {
          const names = spellIds.map((id) => spellById(id)!).filter((s) => s.level === lvl).map((s) => `${esc(s.name)}${s.concentration ? '<sup>C</sup>' : ''}`);
          return names.length ? `<div><b>${lvl === 0 ? 'Cantrips' : `${ordinal(lvl)}`}:</b> ${names.join(', ')}</div>` : '';
        })
        .join('')
    : '<p class="m">No spellcasting.</p>';
  const prepared = l12.prepared.length
    ? `<p><b>Suggested preparation at level 12 (${l12.preparedCount}):</b> ${esc(l12.prepared.map((id) => spellById(id)?.name ?? id).join(', '))}</p>`
    : '';

  // --- Gear
  const gearRows = b.gear
    .map((g) => {
      const items = g.items
        .map(({ item }) => {
          const lvl = opts.reveal(item);
          const name = lvl >= 1 ? `<b>${esc(item.name)}</b> — ` : '';
          const where = lvl >= 2 ? ` <span class="m">[${item.act ? `Act ${item.act}` : 'act not recorded'}${item.location ? `: ${esc(item.location)}` : ''}]</span>` : '';
          return `<li>${name}${esc(item.roleDescription)}${where}</li>`;
        })
        .join('');
      return `<tr><th>${esc(g.label)}</th><td>${g.baseline ? esc(g.baseline) : '<span class="m">—</span>'}</td><td><div class="m">${esc(g.lookFor)}</div>${items ? `<ul>${items}</ul>` : ''}</td></tr>`;
    })
    .join('');

  // --- Story
  const story =
    b.mode === 'story' && b.story.chapters.length
      ? b.story.chapters.map((c) => `<h3>${esc(c.title)}</h3>${c.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}`).join('')
      : b.backstory
          .split('\n\n')
          .map((p) => `<p>${esc(p)}</p>`)
          .join('');
  const peopleList = b.story.people.length
    ? `<p><b>People:</b> ${b.story.people.map((p) => `${esc(p.name)} <span class="m">(${esc(p.role.toLowerCase())})</span>`).join(', ')}</p>`
    : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)} — BG3 cheat sheet</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { font: 10.5pt/1.4 system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; color: #231b12; background: #fff; margin: 0; padding: 16px; max-width: 1000px; margin-inline: auto; }
  h1 { font: 700 20pt Georgia, serif; margin: 0; }
  h2 { font: 700 12pt Georgia, serif; text-transform: uppercase; letter-spacing: .06em; color: #7a5518; border-bottom: 1.5px solid #c9a25a; padding-bottom: 2px; margin: 16px 0 8px; }
  h3 { font: 700 10.5pt Georgia, serif; color: #7a5518; margin: 10px 0 2px; }
  p { margin: 0 0 6px; }
  .sub { color: #5d4e3c; margin: 2px 0 0; }
  .chips span { display: inline-block; background: #f0e3c4; border-radius: 99px; padding: 0 8px; margin: 4px 4px 0 0; font-size: 9pt; }
  .m { color: #7d6d58; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 20px; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px; }
  .stat b { white-space: nowrap; }
  .stat { border: 1px solid #d9c9a8; border-radius: 6px; padding: 4px 8px; }
  .stat b { display: block; font-size: 13pt; }
  .stat span { font-size: 8pt; text-transform: uppercase; letter-spacing: .05em; color: #7d6d58; }
  table { border-collapse: collapse; width: 100%; }
  th, td { text-align: left; vertical-align: top; padding: 3px 6px; border-bottom: 1px solid #e6dcc6; }
  thead th { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .05em; color: #7d6d58; }
  tr.hl th, tr.hl td { background: #f7efdc; }
  td.lv { font: 700 12pt Georgia, serif; text-align: center; width: 30px; }
  .levels td:nth-child(2) { width: 36px; }
  .levels td:nth-child(5) { width: 110px; font-size: 9pt; }
  ul, ol { margin: 0; padding-left: 18px; }
  .skills { columns: 2; }
  .steps li { margin-bottom: 3px; }
  .story p { font-family: Georgia, serif; }
  footer { margin-top: 18px; font-size: 8pt; color: #9a8a74; border-top: 1px solid #e6dcc6; padding-top: 6px; }
  tr, li, .stat, h2, h3 { break-inside: avoid; }
  h2, h3 { break-after: avoid; }
  .grid > section { break-inside: avoid; }
  @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } .stats { grid-template-columns: repeat(2, 1fr); } }
  @media print { body { padding: 0; } a { color: inherit; } }
</style>
</head>
<body>
<header>
  <h1>${esc(title)}</h1>
  <p class="sub">${esc(people)} ${esc(b.cls.name)} · ${esc(b.sub.name)} · ${esc(b.background.name)} · ${esc(WEAPON_STYLE_LABELS[b.weaponStyle])}</p>
  <div class="chips">${traits.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
</header>

<div class="grid">
  <section>
    <h2>Character creation</h2>
    ${creation}
  </section>
  <section>
    <h2>At a glance</h2>
    <div class="stats">
      <div class="stat"><span>HP L1 / L12</span><b>${l1.hp} / ${l12.hp}</b></div>
      <div class="stat"><span>Armour class</span><b>${b.armourPlan.ac}</b></div>
      <div class="stat"><span>Initiative</span><b>${formatMod(modifier(b.start.DEX))}</b></div>
      <div class="stat"><span>Speed</span><b>${b.speed} m</b></div>
      ${l1.spellDC !== undefined ? `<div class="stat"><span>Spell DC L1 / L12</span><b>${l1.spellDC} / ${l12.spellDC}</b></div>` : ''}
      ${l1.spellAttack !== undefined ? `<div class="stat"><span>Spell attack</span><b>${formatMod(l1.spellAttack)} / ${formatMod(l12.spellAttack!)}</b></div>` : ''}
      <div class="stat"><span>Darkvision</span><b>${b.darkvision ? `${b.darkvision} m` : '—'}</b></div>
      <div class="stat"><span>Attacks (L12)</span><b>${l12.attacks}</b></div>
    </div>
    <p class="m">Armour: ${esc(b.armourPlan.label)}${b.armourPlan.shield ? ' + shield' : ''}</p>
    <table>
      <thead><tr><th></th><th>Level 1</th><th>Level 12</th><th>Save</th></tr></thead>
      <tbody>${abilityRows}</tbody>
    </table>
  </section>
</div>

<div class="grid">
  <section>
    <h2>Skills</h2>
    <ul class="skills">${skillRows}</ul>
  </section>
  <section>
    <h2>Proficiencies</h2>
    <p><b>Armour:</b> ${esc(b.armour.join(', ') || 'none')}</p>
    <p><b>Weapons:</b> ${esc(b.weaponProfs.map((w) => weaponById(w)?.name ?? `${w} weapons`).join(', '))}</p>
    <p><b>Loadout:</b> ${esc(b.weapons.melee)}${b.armourPlan.shield ? ' + shield' : ''} · ranged: ${esc(b.weapons.ranged)}</p>
  </section>
</div>

<section>
  <h2>Level-up plan</h2>
  <table class="levels">
    <thead><tr><th>Lv</th><th>HP</th><th>Features</th><th>Your choices</th><th>Spell slots</th></tr></thead>
    <tbody>${levelRows}</tbody>
  </table>
</section>

<section>
  <h2>Spells</h2>
  ${spellList}
  ${prepared}
</section>

<section>
  <h2>Gear goals</h2>
  <table>
    <thead><tr><th>Slot</th><th>Baseline</th><th>Look for</th></tr></thead>
    <tbody>${gearRows}</tbody>
  </table>
</section>

<section class="story">
  <h2>Backstory &amp; roleplay</h2>
  ${story}
  ${peopleList}
</section>

<footer>Made with BG3 Origin Planner, a fan-made tool not affiliated with Larian Studios or Wizards of the Coast. Hand-curated data; verify details in game.</footer>
${opts.autoPrint ? '<script>window.addEventListener("load", () => setTimeout(() => window.print(), 100));</script>' : ''}
</body>
</html>`;
}
