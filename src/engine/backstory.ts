import { QUESTIONS } from '../data';
import type { Build } from './build';

const article = (word: string) => (/^[AEIOU]/i.test(word) ? 'an' : 'a');

/** Compose a short, spoiler-free backstory from the questionnaire answers. */
export function composeBackstory(build: Build): string {
  const name = build.choices.name.trim() || 'Our hero';
  const people = build.subrace?.name ?? build.race.name;
  const opening = `${name} is ${article(people)} ${people} ${build.cls.name.toLowerCase()} with ${article(build.background.name)} ${build.background.name.toLowerCase()}'s past.`;
  const fragments = QUESTIONS.map((q) => q.options.find((o) => o.id === build.choices.answers[q.id])?.fragment).filter(
    (f): f is string => !!f,
  );
  if (!fragments.length) return `${opening} Their story is still unwritten — answer the questions to shape it.`;
  const third = Math.ceil(fragments.length / 3);
  const paragraphs = [fragments.slice(0, third), fragments.slice(third, third * 2), fragments.slice(third * 2)].filter((p) => p.length);
  paragraphs[0] = [opening, ...paragraphs[0]!];
  return paragraphs.map((p) => p.join(' ')).join('\n\n');
}
