# BG3 Origin Planner

A spoiler-free character planner for **Baldur’s Gate 3**. You play through your character’s life before the adventure, and the planner turns your choices into a backstory and a full build:

- **Story path:** a branching walk through the character’s past. A prologue of Forgotten Realms lore sets the scene: your homeland, family and the omens at your birth. Six chapters follow: *Small Hands*, *The Awakening*, *The Bond*, *The Wound*, *The Road* and *The Eve*. Earlier choices open or close later scenes. Some scenes let you **roll for fate**, which can produce twists you can’t pick by hand. Named people from your past (a mentor, a sibling, a rival and so on) appear along the way, and you can rename them.
- **Quick quiz:** the original 15 personality questions, if you just want a fast build.

- **Origin:** race and subrace, class and subclass, and background, each ranked by how well it fits your story, with a short reason for every pick.
- **Ability scores:** 27-point buy plus the +2/+1 bonuses, allocated for your class and weapon style. You can edit them with steppers.
- **Levels 1–12:** class features, feats and ability improvements, fighting styles, metamagic, pact boons, invocations, cantrips and spells for every level. Every pick can be changed, and later levels adapt to your changes.
- **Spellbook:** your class list with filters. Mark spells as favourites (picked first) or excluded (never suggested).
- **Gear plan, spoiler-free:** ordinary baseline equipment for each slot. Notable items are described only by what they do. Item names and locations stay hidden until you click *reveal*.
- **Backstory:** written chapter by chapter from your story-path choices (or a short paragraph in quick-quiz mode).
- **Builds:** save several builds in the browser, export or import JSON, share a link, or print.

## Run it

Requires **Node.js 20.19+ or 22.12+** (the current LTS is recommended). Older Node versions make `npm install` skip Vite’s native bundler binary, and `npm run dev` then fails with *“Cannot find native binding”*.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run build` | Type-check and build into `dist/` |
| `npm test` | Unit tests (engine, rules, data validation, sharing) |
| `npm run test:e2e` | Playwright browser tests (set `PW_CHROMIUM` to use a preinstalled Chromium) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run validate-data` | Schema and reference checks for all game data, plus a spoiler-word check |
| `npm run import-data` | *Experimental*: download spell and item infoboxes from bg3.wiki into `data-import/` for review |

### Deploy to GitHub Pages

`.github/workflows/deploy.yml` runs lint, data validation, tests and the build on every push and pull request. Pushes to `main` are also deployed to GitHub Pages. To enable it, go to **Settings → Pages → Source: GitHub Actions**.

## How the recommendations work

1. Every story choice (`src/data/story.ts`) or quiz answer (`src/data/questionnaire.ts`) adds weights to trait tags such as `pact`, `shadow`, `protector` or `elemental`. Defining story moments, such as your homeland and how your power awakened, count more than later ones (`src/engine/story.ts`).
2. Every race, class, subclass, background, feat, spell and item also carries trait tags. Candidates are ranked by cosine similarity to your trait profile, plus mechanical synergy: for example, medium armour for casters, Half-Orc for Strength builds, or feats that match your weapon style (`src/engine/recommend.ts`).
3. `src/engine/build.ts` walks levels 1–12. It applies feats and ability improvements, learns spells within the available spell slots, and respects every override you make.

## Spoiler policy

- Only content visible in the in-game character creator (races, classes, subclasses, backgrounds, spells, feats) is shown openly.
- Items have three tiers: a role description (default), the name (first click), and the act and location (second click). Hidden fields are not rendered until you reveal them.
- Companions, story events, quests and story-only powers are not in the data. `validate-data` fails if a spoiler word appears in public text.

## Data status

The rules data (races, classes, subclasses, backgrounds, feats, class tables) and about 200 spells were written by hand from the game’s rules. The item list is a **curated selection of 32 well-known items**. Item acts and locations are filled in only where they were checked.

There are known gaps and some uncertainty, so please verify details in game:

- Some subclass bonus-spell lists (Cleric domains, Paladin oaths, Warlock patrons) are BG3 adaptations that may differ slightly from the live game.
- Not every spell or item in the game is included yet.

To extend the data, run `npm run import-data` on a machine that can reach bg3.wiki. Then merge the reviewed rows into `src/data/spells.json` / `src/data/items.json`, adding tags, a `roleDescription` and spoiler fields. Finally, run `npm run validate-data`.

## Credits

Fan-made, not affiliated with Larian Studios or Wizards of the Coast. Baldur’s Gate 3 © Larian Studios. Imported wiki content comes from [bg3.wiki](https://bg3.wiki) under CC BY-SA 4.0.
