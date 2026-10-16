import { describe, expect, it } from 'vitest';
import { CLASSES, ITEMS } from '../../data';
import { deriveBuild, emptyChoices } from '../build';
import { cheatSheetFileName, cheatSheetHtml } from '../cheatsheet';

const hidden = () => 0 as const;

describe('cheat sheet', () => {
  it.each(CLASSES.map((c) => c.id))('renders a complete sheet for a %s', (classId) => {
    const b = deriveBuild({ ...emptyChoices(), name: 'Vex', classId });
    const html = cheatSheetHtml(b, { reveal: hidden });
    expect(html.startsWith('<!doctype html>')).toBe(true);
    expect(html).toContain('<h1>Vex</h1>');
    expect(html).toContain(b.cls.name);
    expect(html).toContain(b.background.name);
    expect(html.match(/<td class="lv">/g)).toHaveLength(12);
    for (const s of ['Character creation', 'At a glance', 'Level-up plan', 'Spells', 'Gear goals', 'Backstory']) expect(html).toContain(s);
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('window.print');
  });

  it('keeps item names hidden unless revealed', () => {
    const b = deriveBuild({ ...emptyChoices(), classId: 'wizard' });
    const shown = b.gear.flatMap((g) => g.items.map((i) => i.item));
    expect(shown.length).toBeGreaterThan(0);
    const closed = cheatSheetHtml(b, { reveal: hidden });
    for (const item of ITEMS) expect(closed).not.toContain(item.name);

    const target = shown[0]!;
    const open = cheatSheetHtml(b, { reveal: (i) => (i.id === target.id ? 2 : 0) });
    expect(open).toContain(target.name);
    expect(open).toContain(target.act ? `Act ${target.act}` : 'act not recorded');
    for (const item of shown.slice(1)) expect(open).not.toContain(item.name);
  });

  it('includes the chaptered story and people for story builds', () => {
    const b = deriveBuild({
      ...emptyChoices(),
      mode: 'story',
      story: { homeland: 'waterdeep', family: 'merchants', omen: 'ordinary', days: 'books', sibling: 'twin' },
      storyNames: { sibling: 'Nessa' },
    });
    const html = cheatSheetHtml(b, { reveal: hidden });
    expect(html).toContain('<h3>The Realms, 1492 DR</h3>');
    expect(html).toContain('Nessa');
  });

  it('escapes user text and builds a safe file name', () => {
    const b = deriveBuild({ ...emptyChoices(), name: '<script>alert(1)</script> & Co' });
    const html = cheatSheetHtml(b, { reveal: hidden });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(cheatSheetFileName(b)).toBe('script-alert-1-script-co-cheat-sheet.html');
  });

  it('adds the print trigger only for the print variant', () => {
    const b = deriveBuild(emptyChoices());
    expect(cheatSheetHtml(b, { reveal: hidden, autoPrint: true })).toContain('window.print');
  });
});
