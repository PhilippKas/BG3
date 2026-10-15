/**
 * EXPERIMENTAL: pulls spell and item pages from bg3.wiki (CC BY-SA 4.0) via the
 * MediaWiki API and writes the raw infobox fields to `data-import/` for review.
 *
 * It does NOT overwrite src/data: trait tags, role descriptions and spoiler
 * classification are hand-authored, so imported rows are merged by a person.
 *
 *   npm run import-data                # spells + items
 *   npm run import-data -- spells      # only spells
 *
 * Category names can change on the wiki; adjust CATEGORIES if a run returns nothing.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { parseInfobox } from './wiki-parse';

const API = 'https://bg3.wiki/w/api.php';
const CATEGORIES: Record<string, string[]> = {
  spells: ['Category:Spells'],
  items: ['Category:Weapons', 'Category:Armour', 'Category:Clothing', 'Category:Amulets', 'Category:Rings', 'Category:Helmets', 'Category:Cloaks', 'Category:Handwear', 'Category:Footwear'],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped MediaWiki JSON
async function api(params: Record<string, string>): Promise<any> {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'bg3-origin-planner data import (personal use)' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function categoryMembers(category: string): Promise<string[]> {
  const titles: string[] = [];
  let cont: string | undefined;
  do {
    const r = await api({ action: 'query', list: 'categorymembers', cmtitle: category, cmlimit: '500', cmnamespace: '0', ...(cont ? { cmcontinue: cont } : {}) });
    titles.push(...r.query.categorymembers.map((m: { title: string }) => m.title));
    cont = r.continue?.cmcontinue;
  } while (cont);
  return titles;
}

async function pages(titles: string[]) {
  const rows: Record<string, unknown>[] = [];
  for (let i = 0; i < titles.length; i += 50) {
    const r = await api({ action: 'query', prop: 'revisions', rvprop: 'content', rvslots: 'main', titles: titles.slice(i, i + 50).join('|') });
    for (const p of r.query.pages) {
      const text = p.revisions?.[0]?.slots?.main?.content;
      if (text) rows.push({ title: p.title, ...parseInfobox(text) });
    }
    process.stdout.write(`  ${Math.min(i + 50, titles.length)}/${titles.length}\r`);
  }
  return rows;
}

async function main() {
  const which = process.argv.slice(2).filter((a) => a in CATEGORIES);
  mkdirSync('data-import', { recursive: true });
  for (const kind of which.length ? which : Object.keys(CATEGORIES)) {
    console.log(`Importing ${kind}…`);
    const titles = [...new Set((await Promise.all(CATEGORIES[kind]!.map(categoryMembers))).flat())];
    const rows = await pages(titles);
    writeFileSync(`data-import/${kind}.wiki.json`, JSON.stringify(rows, null, 2));
    console.log(`\n✓ ${rows.length} ${kind} → data-import/${kind}.wiki.json (source: bg3.wiki, CC BY-SA 4.0)`);
  }
}

if (process.argv[1]?.endsWith('import-wiki.ts')) {
  main().catch((e) => {
    console.error(`Import failed: ${e.message}\nIs bg3.wiki reachable from this machine?`);
    process.exit(1);
  });
}
