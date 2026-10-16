import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STORY } from '../data/story';
import type { StoryOption } from '../data/schema';
import { rollFate, type StoryStep } from '../engine/story';
import { useBuild, useStore } from '../store/build';
import { Dice } from './Icons';

const ROLL_MS = 700;

export function StoryPath() {
  const build = useBuild();
  const answerScene = useStore((s) => s.answerScene);
  const [viewing, setViewing] = useState<string | null>(null);
  const [rolling, setRolling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const { walk, fill } = build.story;
  const step = (viewing && walk.steps.find((s) => s.scene.id === viewing && s.chosen)) || walk.next;
  const index = step ? walk.steps.indexOf(step) : walk.steps.length;
  const chapterNo = STORY.findIndex((c) => c.id === (step ?? walk.steps[walk.steps.length - 1])?.chapter.id);
  const progress = walk.complete ? 1 : walk.chapterIndex / STORY.length;

  const choose = (s: StoryStep, option: StoryOption, rolled = false) => {
    answerScene(s.scene.id, option.id, rolled);
    setViewing(null);
  };
  const roll = (s: StoryStep) => {
    setRolling(true);
    timer.current = setTimeout(() => {
      setRolling(false);
      choose(s, rollFate(s.scene, s.before), true);
    }, ROLL_MS);
  };

  return (
    <div className="story-layout">
      <div>
        <div className="spread">
          <span className="faint">
            {walk.complete && !viewing ? 'Your story is written' : `${STORY[chapterNo]?.title ?? ''}`}
          </span>
          <span className="faint">
            Chapter {Math.min(chapterNo + 1, STORY.length)} of {STORY.length}
          </span>
        </div>
        <div className="progress" aria-hidden>
          <div style={{ width: `${progress * 100}%` }} />
        </div>
        {step ? (
          <SceneCard
            key={step.scene.id}
            step={step}
            fill={fill}
            showIntro={index === 0 || walk.steps[index - 1]?.chapter.id !== step.chapter.id}
            prevLore={walk.steps[index - 1]?.chosen?.lore}
            rolling={rolling}
            onChoose={(o) => choose(step, o)}
            onRoll={() => roll(step)}
            onBack={index > 0 ? () => setViewing(walk.steps[index - 1]!.scene.id) : undefined}
            onResume={viewing ? () => setViewing(null) : undefined}
          />
        ) : (
          <StoryEnd onRevise={() => setViewing(walk.steps[0]?.scene.id ?? null)} />
        )}
      </div>
      <StorySoFar onSelect={setViewing} current={step?.scene.id} />
    </div>
  );
}

function SceneCard(props: {
  step: StoryStep;
  fill: (t: string) => string;
  showIntro: boolean;
  /** Lore unlocked by the previous choice (e.g. about the chosen homeland). */
  prevLore?: string;
  rolling: boolean;
  onChoose: (o: StoryOption) => void;
  onRoll: () => void;
  onBack?: () => void;
  onResume?: () => void;
}) {
  const { step, fill, rolling } = props;
  const { scene, chosen, available } = step;
  // A rolled twist isn't pickable by hand, but still shows as the current answer.
  const options = chosen && !available.includes(chosen) ? [...available, chosen] : available;
  return (
    <div className="card scene" data-testid="scene" data-scene={scene.id}>
      {props.showIntro && (
        <div className="chapter-intro">
          <h2>{step.chapter.title}</h2>
          <p>{fill(step.chapter.intro)}</p>
        </div>
      )}
      {props.prevLore && (
        <div className="lore" style={{ margin: '0 0 16px' }} data-testid="lore">
          {props.prevLore}
        </div>
      )}
      <h1 className="question" data-testid="question">
        {fill(scene.text)}
      </h1>
      <div className="options" role="group" aria-label="Choices">
        {options.map((o) => (
          <button
            key={o.id}
            className="option"
            aria-pressed={chosen?.id === o.id}
            disabled={rolling}
            onClick={() => props.onChoose(o)}
          >
            {fill(o.text)}
            {chosen?.id === o.id && step.rolled && (
              <span className="chip chip-accent" style={{ marginLeft: 8 }}>
                {o.fateOnly ? 'Twist of fate' : 'Fate decided'}
              </span>
            )}
          </button>
        ))}
      </div>
      {chosen?.lore && (
        <div className="lore" data-testid="lore">
          {chosen.lore}
        </div>
      )}
      <div className="spread" style={{ marginTop: 16 }}>
        <button className="btn btn-ghost" disabled={!props.onBack || rolling} onClick={props.onBack}>
          ← Back
        </button>
        <div className="row">
          {scene.fate && (
            <button className={`btn dice-btn ${rolling ? 'rolling' : ''}`} disabled={rolling} onClick={props.onRoll} data-testid="roll">
              <Dice width={18} /> {rolling ? 'The dice are falling…' : 'Let fate decide'}
            </button>
          )}
          {props.onResume && (
            <button className="btn btn-ghost" onClick={props.onResume}>
              Continue →
            </button>
          )}
        </div>
      </div>
      {scene.fate && !chosen && (
        <p className="faint small" style={{ margin: '10px 0 0' }}>
          Fate may choose an outcome you can’t pick yourself.
        </p>
      )}
    </div>
  );
}

function StorySoFar({ onSelect, current }: { onSelect: (sceneId: string) => void; current?: string }) {
  const build = useBuild();
  const { walk, fill } = build.story;
  const answered = walk.steps.filter((s) => s.chosen);
  let lastChapter = '';
  return (
    <aside className="card story-panel" aria-label="Your story so far">
      <h3>Your story so far</h3>
      {answered.length === 0 && <p className="faint small">Your choices will be written here as you make them.</p>}
      {answered.map((s) => {
        const header = s.chapter.id !== lastChapter ? s.chapter.title.replace(/^(Prologue|Chapter [IVX]+): /, '') : null;
        lastChapter = s.chapter.id;
        return (
          <div key={s.scene.id}>
            {header && <div className="story-chapter">{header}</div>}
            <button
              className={`story-line ${current === s.scene.id ? 'current' : ''}`}
              onClick={() => onSelect(s.scene.id)}
              title="Revisit this choice"
            >
              {fill(s.chosen!.narration)}
            </button>
          </div>
        );
      })}
    </aside>
  );
}

function StoryEnd({ onRevise }: { onRevise: () => void }) {
  const build = useBuild();
  const update = useStore((s) => s.update);
  return (
    <div className="card scene" data-testid="story-end">
      <div className="chapter-intro">
        <h2>Epilogue</h2>
        <p>
          Then everything changed. What happens next is yours to play. Before you go, check the names of the people who shaped
          your story.
        </p>
      </div>
      <label className="field" style={{ marginBottom: 12 }}>
        Your name
        <input
          className="input"
          value={build.choices.name}
          placeholder="the wanderer"
          maxLength={80}
          onChange={(e) => update({ name: e.target.value })}
        />
      </label>
      <PeopleEditor />
      <div className="row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onRevise}>
          Revise from the start
        </button>
        <Link to="/character" className="btn btn-primary">
          See your character →
        </Link>
      </div>
    </div>
  );
}

export function PeopleEditor() {
  const build = useBuild();
  const setPersonName = useStore((s) => s.setPersonName);
  if (!build.story.people.length) return null;
  return (
    <div className="people" data-testid="people">
      <div className="faint small" style={{ marginBottom: 6 }}>
        People in your story
      </div>
      {build.story.people.map((p) => (
        <label key={p.key} className="field person">
          {p.role}
          <input
            className="input"
            aria-label={`${p.role} name`}
            value={build.choices.storyNames[p.key] ?? ''}
            placeholder={p.name}
            maxLength={60}
            onChange={(e) => setPersonName(p.key, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
