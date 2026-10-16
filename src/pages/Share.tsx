import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deriveBuild } from '../engine/build';
import { decodeShare } from '../engine/share';
import { useStore } from '../store/build';

export function Share() {
  const { data = '' } = useParams();
  const choices = useMemo(() => decodeShare(data), [data]);
  const replace = useStore((s) => s.replace);
  const save = useStore((s) => s.save);
  const navigate = useNavigate();

  if (!choices) {
    return (
      <div className="card empty">
        <h2>That share link is broken</h2>
        <p>It may have been cut off when it was copied.</p>
        <Link className="btn" to="/">
          Go home
        </Link>
      </div>
    );
  }
  const b = deriveBuild(choices);
  return (
    <div className="card" style={{ maxWidth: 560, margin: '24px auto' }}>
      <h1>{choices.name || 'A shared character'}</h1>
      <p className="muted">
        {b.subrace?.name ?? b.race.name} {b.cls.name} · {b.sub.name} · {b.background.name}
      </p>
      <p className="backstory small">{b.story.chapters[0]?.paragraphs[0] ?? b.backstory.split('\n\n')[0]}</p>
      <p className="faint">Opening this build replaces your current one. Save your current build first if you want to keep it.</p>
      <div className="row">
        <button
          className="btn"
          onClick={() => {
            save();
          }}
        >
          Save my current build
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            replace(choices);
            navigate('/character');
          }}
        >
          Open this build
        </button>
      </div>
    </div>
  );
}
