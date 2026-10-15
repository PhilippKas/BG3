import type { Background } from './schema';

export const BACKGROUNDS: Background[] = [
  { id: 'acolyte', name: 'Acolyte', summary: 'You spent your life in service to a temple.', skills: ['Insight', 'Religion'], tags: { divine: 3, order: 1, healer: 1 } },
  { id: 'charlatan', name: 'Charlatan', summary: 'You’re an expert in manipulation, prone to exaggeration and more than happy to profit from it.', skills: ['Deception', 'Sleight of Hand'], tags: { trickster: 3, charm: 2 } },
  { id: 'criminal', name: 'Criminal', summary: 'You have a history of breaking the law and contacts in the underworld.', skills: ['Deception', 'Stealth'], tags: { shadow: 3, outcast: 2, trickster: 1 } },
  { id: 'entertainer', name: 'Entertainer', summary: 'You live to sway and subvert your audience, at home on any stage.', skills: ['Acrobatics', 'Performance'], tags: { music: 3, charm: 2 } },
  { id: 'folk-hero', name: 'Folk Hero', summary: 'You’re a champion of the common people, destined for greater things.', skills: ['Animal Handling', 'Survival'], tags: { protector: 3, nature: 1, light: 1 } },
  { id: 'guild-artisan', name: 'Guild Artisan', summary: 'A member of an artisan’s guild, you’re skilled in a craft and know how to deal.', skills: ['Insight', 'Persuasion'], tags: { scholar: 1, charm: 1, order: 2 } },
  { id: 'noble', name: 'Noble', summary: 'You were raised in a family among the social elite, accustomed to power and privilege.', skills: ['History', 'Persuasion'], tags: { noble: 3, charm: 1, order: 1 } },
  { id: 'outlander', name: 'Outlander', summary: 'You grew up in the wilds, far from civilisation.', skills: ['Athletics', 'Survival'], tags: { nature: 2, wild: 2, beast: 1 } },
  { id: 'sage', name: 'Sage', summary: 'You spent years learning the lore of the multiverse.', skills: ['Arcana', 'History'], tags: { scholar: 3, arcane: 2 } },
  { id: 'soldier', name: 'Soldier', summary: 'You’re trained in battlefield tactics and have served in an army.', skills: ['Athletics', 'Intimidation'], tags: { martial: 3, order: 1, protector: 1 } },
  { id: 'urchin', name: 'Urchin', summary: 'After surviving a poor and bleak childhood, you know how to make the most of very little.', skills: ['Sleight of Hand', 'Stealth'], tags: { outcast: 3, shadow: 1, finesse: 1 } },
  { id: 'haunted-one', name: 'Haunted One', summary: 'You are haunted by something so terrible you dare not speak of it.', skills: ['Medicine', 'Intimidation'], tags: { death: 3, vengeance: 1, outcast: 1 } },
];

export const backgroundById = (id: string) => BACKGROUNDS.find((b) => b.id === id);
