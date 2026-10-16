import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../data';
import { TAG_LABELS } from '../data/tags';
import { dominantTags } from '../engine/tags';
import { StoryPath } from '../components/StoryPath';
import { useBuild, useStore } from '../store/build';

export function Questionnaire() {
  const mode = useBuild().mode;
  const setMode = useStore((s) => s.setMode);
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'center' }}>
        <div className="segmented" role="group" aria-label="Origin mode">
          <button aria-pressed={mode === 'story'} onClick={() => setMode('story')}>
            Story path
          </button>
          <button aria-pressed={mode === 'quick'} onClick={() => setMode('quick')}>
            Quick quiz
          </button>
        </div>
      </div>
      {mode === 'story' ? <StoryPath /> : <QuickQuiz />}
    </div>
  );
}

function QuickQuiz() {
  const answers = useStore((s) => s.choices.answers);
  const answer = useStore((s) => s.answer);
  const build = useBuild();
  const navigate = useNavigate();
  const firstOpen = QUESTIONS.findIndex((q) => !answers[q.id]);
  const [index, setIndex] = useState(firstOpen === -1 ? 0 : firstOpen);
  const q = QUESTIONS[index]!;
  const answered = QUESTIONS.filter((x) => answers[x.id]).length;
  const traits = dominantTags(build.profile, 6);

  const choose = (optionId: string) => {
    answer(q.id, optionId);
    const updated = { ...answers, [q.id]: optionId };
    const after = QUESTIONS.findIndex((x, i) => i > index && !updated[x.id]);
    const any = QUESTIONS.findIndex((x) => !updated[x.id]);
    if (after !== -1) setIndex(after);
    else if (any !== -1) setIndex(any);
    else navigate('/character');
  };

  return (
    <div className="quiz">
      <div className="spread">
        <span className="faint">
          Question {index + 1} of {QUESTIONS.length}
        </span>
        <span className="faint">{answered} answered</span>
      </div>
      <div className="progress" aria-hidden>
        <div style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="card">
        <h1 className="question" data-testid="question">
          {q.prompt}
        </h1>
        <div className="options" role="group" aria-label="Answers">
          {q.options.map((o) => (
            <button key={o.id} className="option" aria-pressed={answers[q.id] === o.id} onClick={() => choose(o.id)}>
              {o.text}
            </button>
          ))}
        </div>
        <div className="spread" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" disabled={index === 0} onClick={() => setIndex(index - 1)}>
            ← Back
          </button>
          {answered === QUESTIONS.length ? (
            <Link to="/character" className="btn btn-primary">
              See your character →
            </Link>
          ) : (
            <button className="btn btn-ghost" disabled={index === QUESTIONS.length - 1} onClick={() => setIndex(index + 1)}>
              Skip →
            </button>
          )}
        </div>
      </div>

      <div className="dots" aria-label="Jump to question">
        {QUESTIONS.map((x, i) => (
          <button
            key={x.id}
            className={`${answers[x.id] ? 'done' : ''} ${i === index ? 'current' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Question ${i + 1}${answers[x.id] ? ' (answered)' : ''}`}
          />
        ))}
      </div>

      {traits.length > 0 && (
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div className="faint" style={{ marginBottom: 8 }}>
            Your story so far speaks of…
          </div>
          <div className="traits" style={{ justifyContent: 'center' }}>
            {traits.map((t) => (
              <span key={t} className="chip">
                {TAG_LABELS[t]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
