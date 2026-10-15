import { Link } from 'react-router-dom';
import { spellById } from '../data';
import { ABILITIES } from '../data/schema';
import type { Build, LevelPick, LevelPlan } from '../engine/build';
import { describeReasons } from '../engine/tags';
import { useBuild, useStore } from '../store/build';

const ordinal = (n: number) => ['1st', '2nd', '3rd', '4th', '5th', '6th'][n - 1] ?? `${n}th`;

export function Progression() {
  const build = useBuild();
  const picks = useStore((s) => s.choices.picks);
  const setPick = useStore((s) => s.setPick);
  const overrides = Object.keys(picks).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Levels 1–12</h1>
          <p>
            {build.subrace?.name ?? build.race.name} {build.cls.name} ({build.sub.name}). Every pick below is a suggestion
            based on your story and build. Use the dropdowns to change any of them; later levels adapt to your choices.
          </p>
        </div>
        {overrides > 0 && (
          <button className="btn" onClick={() => Object.keys(picks).forEach((k) => setPick(k, []))}>
            Reset {overrides} change{overrides === 1 ? '' : 's'}
          </button>
        )}
      </div>
      <div className="timeline">
        {build.levels.map((l) => (
          <LevelCard key={l.level} level={l} build={build} prev={build.levels[l.level - 2]} />
        ))}
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
        <Link className="btn" to="/spells">
          Spellbook
        </Link>
        <Link className="btn btn-primary" to="/gear">
          Gear plan →
        </Link>
      </div>
    </div>
  );
}

function LevelCard({ level: l, build, prev }: { level: LevelPlan; build: Build; prev?: LevelPlan }) {
  const changed = prev ? ABILITIES.filter((a) => l.scores[a] !== prev.scores[a]) : [];
  const newSlotLevel = prev && l.slots.length > prev.slots.length ? l.slots.length : 0;
  return (
    <section className="level" data-testid={`level-${l.level}`}>
      <div className="level-num" aria-hidden>
        {l.level}
      </div>
      <div className="card">
        <h2 style={{ fontSize: '1.05rem' }}>Level {l.level}</h2>
        <div className="level-meta">
          <span className="chip chip-plain">HP {l.hp} (+{l.hpGain})</span>
          <span className="chip chip-plain">Proficiency +{l.proficiency}</span>
          {l.attacks > 1 && <span className="chip chip-plain">{l.attacks} attacks</span>}
          {l.slots.some((n) => n > 0) && (
            <span className="chip chip-plain" title="Spell slots per spell level">
              Slots {l.slots.map((n, i) => (n ? `${ordinal(i + 1)}×${n}` : null)).filter(Boolean).join(' ')}
            </span>
          )}
          {newSlotLevel > 0 && <span className="chip chip-good">New: {ordinal(newSlotLevel)}-level spells</span>}
          {l.spellDC !== undefined && <span className="chip chip-plain">Spell DC {l.spellDC}</span>}
          {changed.map((a) => (
            <span key={a} className="chip chip-good">
              {a} {prev!.scores[a]} → {l.scores[a]}
            </span>
          ))}
        </div>
        {l.features.map((f, i) => (
          <div key={i} className="feature small">
            <b>{f.name}</b> {f.source === 'subclass' && <span className="chip chip-plain">{build.cls.subclassLabel}</span>}{' '}
            <span className="muted">— {f.summary}</span>
          </div>
        ))}
        {l.grantedSpells.length > 0 && (
          <div className="feature small">
            <b>Granted spells:</b>{' '}
            <span className="muted">{l.grantedSpells.map((id) => spellById(id)?.name ?? id).join(', ')}</span>
          </div>
        )}
        {l.picks.map((p) => (
          <PickEditor key={p.key} pick={p} />
        ))}
        {l.prepared.length > 0 && (
          <details className="pick">
            <summary className="small">
              <b>Suggested prepared spells</b> <span className="faint">({l.preparedCount} per long rest)</span>
            </summary>
            <p className="small muted" style={{ marginTop: 6 }}>
              {l.prepared.map((id) => spellById(id)?.name).join(', ')}
            </p>
          </details>
        )}
        {l.features.length === 0 && l.picks.length === 0 && l.grantedSpells.length === 0 && (
          <p className="faint small">More hit points and a stronger character — no new choices this level.</p>
        )}
      </div>
    </section>
  );
}

function PickEditor({ pick }: { pick: LevelPick }) {
  const setPick = useStore((s) => s.setPick);
  const change = (slot: number, id: string) => {
    const next = [...pick.chosen];
    const swap = next.indexOf(id);
    if (swap !== -1) next[swap] = next[slot]!;
    next[slot] = id;
    setPick(pick.key, next);
  };
  return (
    <div className="pick" data-testid={`pick-${pick.kind}`}>
      <div className="pick-head">
        <h4>
          {pick.label}
          {pick.count > 1 && <span className="faint"> · choose {pick.count}</span>}
        </h4>
        <div className="row">
          {pick.note && <span className="chip chip-good">{pick.note}</span>}
          {pick.overridden && (
            <button className="btn btn-ghost btn-sm" onClick={() => setPick(pick.key, [])}>
              Reset
            </button>
          )}
        </div>
      </div>
      {pick.chosen.map((id, slot) => {
        const opt = pick.options.find((o) => o.id === id)!;
        return (
          <div className="pick-slot" key={slot}>
            <select className="select" aria-label={`${pick.label} ${slot + 1}`} value={id} onChange={(e) => change(slot, e.target.value)}>
              {pick.options.map((o, i) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                  {i < pick.count ? ' ★' : ''}
                  {o.meta ? ` (${o.meta.split(' · ').slice(0, 2).join(', ')})` : ''}
                </option>
              ))}
            </select>
            <div className="pick-desc">
              {opt.meta && <span className="faint">{opt.meta} — </span>}
              {opt.summary} <span className="why">{describeReasons(opt.reasons).replace('A flexible choice for your concept.', '')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

