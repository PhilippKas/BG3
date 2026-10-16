import { Link } from 'react-router-dom';
import { QUESTIONS } from '../data';
import { useBuild, useStore } from '../store/build';

export function Home() {
  const build = useBuild();
  const setMode = useStore((s) => s.setMode);
  const answered = build.answered;
  return (
    <div className="landing">
      <h1>Who were you before the adventure began?</h1>
      <p className="lead">
        Live through your character’s past, from a birthplace in the Forgotten Realms to the night everything
        changed. Your choices write a backstory and shape a fitting Baldur’s Gate 3 build: race, class, ability scores,
        spells, feats and gear, all without spoilers.
      </p>
      <div className="row" style={{ justifyContent: 'center' }}>
        <Link to="/origin" className="btn btn-primary" onClick={() => setMode('story')}>
          {answered && build.mode === 'story' ? 'Continue your story' : 'Begin your story'}
        </Link>
        <Link to="/origin" className="btn" onClick={() => setMode('quick')}>
          Quick quiz ({QUESTIONS.length} questions)
        </Link>
        {answered > 0 && (
          <Link to="/character" className="btn">
            View {build.choices.name || 'your character'}
          </Link>
        )}
      </div>
      <div className="steps">
        <div className="card">
          <b>1 · Tell your story</b>
          <p className="small muted">A branching path through your past, with dice rolls if you want fate to decide.</p>
        </div>
        <div className="card">
          <b>2 · Get your build</b>
          <p className="small muted">A matching race, class and background, with 27-point-buy abilities and a reason for each pick.</p>
        </div>
        <div className="card">
          <b>3 · Plan levels 1–12</b>
          <p className="small muted">Feats, spells, fighting styles and invocations level by level. Change anything you like.</p>
        </div>
        <div className="card">
          <b>4 · Gear, spoiler-free</b>
          <p className="small muted">Gear is described by its role. You decide whether to reveal item names and where to find them.</p>
        </div>
      </div>
    </div>
  );
}
