import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deriveBuild, emptyChoices, modeOf, type Choices, type OriginMode } from '../engine/build';

export type SpoilerLevel = 0 | 1 | 2;
export type Theme = 'system' | 'light' | 'dark';

export interface SavedBuild {
  id: string;
  name: string;
  savedAt: string;
  choices: Choices;
}

interface State {
  choices: Choices;
  saved: SavedBuild[];
  spoilerLevel: SpoilerLevel;
  revealed: Record<string, SpoilerLevel>;
  theme: Theme;
  update: (patch: Partial<Choices>) => void;
  answer: (questionId: string, optionId: string) => void;
  answerScene: (sceneId: string, optionId: string, rolled?: boolean) => void;
  setMode: (mode: OriginMode) => void;
  setPersonName: (key: string, name: string) => void;
  setPick: (key: string, chosen: string[]) => void;
  toggleSpell: (list: 'favouriteSpells' | 'excludedSpells', id: string) => void;
  replace: (choices: Choices) => void;
  reset: () => void;
  /** Saves the current build (replacing one with the same name) and returns its name. */
  save: () => string;
  load: (id: string) => void;
  remove: (id: string) => void;
  setSpoilerLevel: (level: SpoilerLevel) => void;
  reveal: (itemId: string) => void;
  setTheme: (theme: Theme) => void;
}

const newId = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      choices: emptyChoices(),
      saved: [],
      spoilerLevel: 0,
      revealed: {},
      theme: 'system',
      update: (patch) => set((s) => ({ choices: { ...s.choices, ...patch } })),
      answer: (questionId, optionId) =>
        set((s) => ({ choices: { ...s.choices, mode: 'quick', answers: { ...s.choices.answers, [questionId]: optionId } } })),
      answerScene: (sceneId, optionId, rolled = false) =>
        set((s) => {
          const others = (s.choices.storyRolled ?? []).filter((id) => id !== sceneId);
          return {
            choices: {
              ...s.choices,
              mode: 'story',
              story: { ...s.choices.story, [sceneId]: optionId },
              storyRolled: rolled ? [...others, sceneId] : others,
            },
          };
        }),
      setMode: (mode) => set((s) => ({ choices: { ...s.choices, mode } })),
      setPersonName: (key, name) =>
        set((s) => {
          const storyNames = { ...s.choices.storyNames };
          if (name.trim()) storyNames[key] = name.slice(0, 60);
          else delete storyNames[key];
          return { choices: { ...s.choices, storyNames } };
        }),
      setPick: (key, chosen) =>
        set((s) => {
          const picks = { ...s.choices.picks };
          if (chosen.length) picks[key] = chosen;
          else delete picks[key];
          return { choices: { ...s.choices, picks } };
        }),
      toggleSpell: (list, id) =>
        set((s) => {
          const other = list === 'favouriteSpells' ? 'excludedSpells' : 'favouriteSpells';
          const has = s.choices[list].includes(id);
          return {
            choices: {
              ...s.choices,
              [list]: has ? s.choices[list].filter((x) => x !== id) : [...s.choices[list], id],
              [other]: s.choices[other].filter((x) => x !== id),
            },
          };
        }),
      replace: (choices) => set({ choices }),
      reset: () => set({ choices: emptyChoices(), revealed: {} }),
      save: () => {
        const { choices, saved } = get();
        const build = deriveBuild(choices);
        const name = choices.name.trim() || `${build.subrace?.name ?? build.race.name} ${build.cls.name}`;
        const existing = saved.find((b) => b.name === name);
        const entry: SavedBuild = { id: existing?.id ?? newId(), name, savedAt: new Date().toISOString(), choices };
        set({ saved: [entry, ...saved.filter((b) => b.id !== entry.id)] });
        return name;
      },
      load: (id) => {
        const b = get().saved.find((x) => x.id === id);
        if (b) set({ choices: b.choices, revealed: {} });
      },
      remove: (id) => set((s) => ({ saved: s.saved.filter((b) => b.id !== id) })),
      setSpoilerLevel: (spoilerLevel) => set({ spoilerLevel }),
      reveal: (itemId) =>
        set((s) => ({ revealed: { ...s.revealed, [itemId]: Math.min(2, (s.revealed[itemId] ?? 0) + 1) as SpoilerLevel } })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'bg3-origin-planner',
      version: 1,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        const choices = { ...emptyChoices(), ...(p.choices ?? {}) };
        return { ...current, ...p, choices: { ...choices, mode: modeOf(choices) } };
      },
    },
  ),
);

export function useBuild() {
  const choices = useStore((s) => s.choices);
  return useMemo(() => deriveBuild(choices), [choices]);
}
