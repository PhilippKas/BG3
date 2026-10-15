import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SPELLS } from '../data';
import type { Spell } from '../data/schema';
import { Ban, Star } from '../components/Icons';
import { useBuild, useStore } from '../store/build';

const LEVEL_NAMES = ['Cantrips', '1st level', '2nd level', '3rd level', '4th level', '5th level', '6th level'];

export function Spells() {
  const build = useBuild();
  const favourites = useStore((s) => s.choices.favouriteSpells);
  const excluded = useStore((s) => s.choices.excludedSpells);
  const toggle = useStore((s) => s.toggleSpell);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [school, setSchool] = useState('all');
  const [scope, setScope] = useState<'class' | 'mine' | 'all'>('class');

  const learnedAt = useMemo(() => {
    const m = new Map<string, string>();
    for (const l of build.levels) {
      for (const p of l.picks) {
        if (['cantrips', 'spells', 'secrets', 'arcanum'].includes(p.kind)) p.chosen.forEach((id) => m.set(id, `Learned at level ${l.level}`));
      }
      l.grantedSpells.forEach((id) => m.set(id, `Granted at level ${l.level}`));
    }
    return m;
  }, [build]);
  const preparedAt12 = new Set(build.levels[11]!.prepared);

  const spells = SPELLS.filter((s) => {
    if (scope === 'class' && !(build.spellList && s.classes.includes(build.spellList)) && !learnedAt.has(s.id)) return false;
    if (scope === 'mine' && !learnedAt.has(s.id) && !preparedAt12.has(s.id)) return false;
    if (level !== 'all' && String(s.level) !== level) return false;
    if (school !== 'all' && s.school !== school) return false;
    if (query && !`${s.name} ${s.summary}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const grouped = LEVEL_NAMES.map((name, lvl) => ({ name, spells: spells.filter((s) => s.level === lvl) })).filter((g) => g.spells.length);
  const schools = [...new Set(SPELLS.map((s) => s.school))].sort();
  const noCasting = !build.spellList && learnedAt.size === 0;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Spellbook</h1>
          <p>
            {build.spellList
              ? `Spells available to your ${build.sub.casterType === 'third' ? build.sub.name : build.cls.name}. `
              : 'Your class doesn’t cast spells, but racial magic is listed here. '}
            ★ marks a favourite: the planner picks favourites first. ⊘ excludes a spell so it’s never suggested.
          </p>
        </div>
      </div>
      {noCasting && (
        <div className="notice">
          {build.cls.name}s don’t cast spells. Switch <Link to="/character">class or subclass</Link> if you want magic, or
          browse all spells below.
        </div>
      )}
      <div className="filters">
        <div className="segmented" role="group" aria-label="Spell scope">
          {(
            [
              ['class', 'Class list'],
              ['mine', 'My spells'],
              ['all', 'All spells'],
            ] as const
          ).map(([v, label]) => (
            <button key={v} aria-pressed={scope === v} onClick={() => setScope(v)}>
              {label}
            </button>
          ))}
        </div>
        <label className="field">
          Search
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or effect" />
        </label>
        <label className="field">
          Level
          <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">All levels</option>
            {LEVEL_NAMES.map((n, i) => (
              <option key={n} value={i}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          School
          <select className="select" value={school} onChange={(e) => setSchool(e.target.value)}>
            <option value="all">All schools</option>
            {schools.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      {grouped.length === 0 && <div className="card empty">No spells match these filters.</div>}
      <div className="stack">
        {grouped.map((g) => (
          <div className="card" key={g.name}>
            <h2>
              {g.name} <span className="faint">({g.spells.length})</span>
            </h2>
            {g.spells.map((s) => (
              <SpellRow
                key={s.id}
                spell={s}
                note={learnedAt.get(s.id) ?? (preparedAt12.has(s.id) ? 'Suggested to prepare' : undefined)}
                favourite={favourites.includes(s.id)}
                excluded={excluded.includes(s.id)}
                onFavourite={() => toggle('favouriteSpells', s.id)}
                onExclude={() => toggle('excludedSpells', s.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SpellRow(props: {
  spell: Spell;
  note?: string;
  favourite: boolean;
  excluded: boolean;
  onFavourite: () => void;
  onExclude: () => void;
}) {
  const { spell: s } = props;
  return (
    <div className="spell" style={{ opacity: props.excluded ? 0.55 : 1 }}>
      <div>
        <div className="row">
          <span className="spell-name">{s.name}</span>
          {props.note && <span className={`chip ${props.note.startsWith('Suggested') ? 'chip-plain' : 'chip-good'}`}>{props.note}</span>}
        </div>
        <div className="faint">
          {s.school} · {s.cast === 'action' ? 'Action' : s.cast === 'bonus' ? 'Bonus action' : 'Reaction'}
          {s.concentration ? ' · Concentration' : ''}
          {s.damage ? ` · ${s.damage}` : ''} · {s.classes.map((c) => c[0]!.toUpperCase() + c.slice(1)).join(', ')}
        </div>
        <div className="small">{s.summary}</div>
      </div>
      <div className="spell-actions">
        <button className="icon-btn" aria-pressed={props.favourite} aria-label={`Favourite ${s.name}`} title="Favourite" onClick={props.onFavourite}>
          <Star />
        </button>
        <button className="icon-btn exclude" aria-pressed={props.excluded} aria-label={`Exclude ${s.name}`} title="Never suggest" onClick={props.onExclude}>
          <Ban />
        </button>
      </div>
    </div>
  );
}
