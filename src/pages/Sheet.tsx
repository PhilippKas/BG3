import { Link } from 'react-router-dom';
import { weaponById } from '../data';
import { PeopleEditor } from '../components/StoryPath';
import { originProgress } from '../components/progress';
import { ABILITIES, SKILL_NAMES, SKILLS, type Ability, type Skill } from '../data/schema';
import { TAG_LABELS } from '../data/tags';
import {
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  POINT_BUY_TOTAL,
  formatMod,
  modifier,
  pointsSpent,
} from '../engine/abilities';
import { WEAPON_STYLE_LABELS, type WeaponStyle } from '../engine/recommend';
import { dominantTags } from '../engine/tags';
import { RankedSelect, type RankedOption } from '../components/RankedSelect';
import { useToast } from '../components/Toast';
import { useBuild, useStore } from '../store/build';
import type { Build } from '../engine/build';

export function Sheet() {
  const build = useBuild();
  const update = useStore((s) => s.update);
  const toast = useToast();
  const { cls, sub, race, subrace, background, choices } = build;
  const l1 = build.levels[0]!;

  return (
    <div className="stack">
      {toast.node}
      {!build.complete && (
        <div className="notice">
          {build.answered === 0 ? (
            <>
              You haven’t told your story yet, so this is a generic starting point.{' '}
              <Link to="/origin">Answer the origin questions</Link> to get a build that fits your concept.
            </>
          ) : (
            <>
              {originProgress(build)}. <Link to="/origin">Finish your origin</Link> for a better fit.
            </>
          )}
        </div>
      )}

      <div className="card hero">
        <div className="hero-sigil" aria-hidden>
          {cls.name[0]}
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            className="name-input"
            placeholder="Name your character"
            aria-label="Character name"
            value={choices.name}
            maxLength={80}
            onChange={(e) => update({ name: e.target.value })}
          />
          <div className="muted" data-testid="summary">
            {subrace?.name ?? race.name} {cls.name} · {sub.name} · {background.name}
          </div>
        </div>
        <div className="traits">
          {dominantTags(build.profile, 4).map((t) => (
            <span key={t} className="chip">
              {TAG_LABELS[t]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-2">
        <OriginChoices build={build} />
        <div className="stack">
          <Abilities build={build} />
          <div className="card">
            <h2>At level 1</h2>
            <div className="stats">
              <Stat k="Hit points" v={l1.hp} n={`d${cls.hitDie} hit die`} />
              <Stat k="Armour class" v={build.armourPlan.ac} n={build.armourPlan.label} />
              <Stat k="Initiative" v={formatMod(modifier(build.start.DEX))} />
              <Stat k="Speed" v={`${build.speed} m`} n={build.darkvision ? `Darkvision ${build.darkvision} m` : 'No darkvision'} />
              <Stat k="Proficiency" v="+2" />
              {l1.spellDC !== undefined && <Stat k="Spell DC" v={l1.spellDC} n={`Attack ${formatMod(l1.spellAttack!)} (${build.castingAbility})`} />}
            </div>
            <h3 style={{ marginTop: 16 }}>Saving throws</h3>
            <div className="row">
              {ABILITIES.map((a) => {
                const prof = build.saves.includes(a);
                return (
                  <span key={a} className={`chip ${prof ? '' : 'chip-plain'}`} title={prof ? 'Proficient' : undefined}>
                    {a} {formatMod(modifier(build.start[a]) + (prof ? 2 : 0))}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <Skills build={build} />
        <div className="card">
          <h2>Proficiencies & traits</h2>
          <p className="small">
            <b>Armour:</b> {build.armour.length ? build.armour.join(', ') : 'none'}
            <br />
            <b>Weapons:</b> {build.weaponProfs.map((w) => weaponById(w)?.name ?? `${w} weapons`).join(', ')}
          </p>
          <ul className="list small">
            {[...race.features, ...(subrace?.features ?? [])].map((f) => (
              <li key={f.name}>
                <b>{f.name}.</b> <span className="muted">{f.summary}</span>
              </li>
            ))}
            {l1.features.map((f) => (
              <li key={`c-${f.name}`}>
                <b>{f.name}.</b> <span className="muted">{f.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <h2>Backstory</h2>
          <button
            className="btn btn-sm"
            onClick={() => navigator.clipboard?.writeText(build.backstory).then(() => toast.show('Backstory copied'))}
          >
            Copy
          </button>
        </div>
        {build.mode === 'story' && build.story.chapters.length > 0 ? (
          <>
            <div className="backstory" data-testid="backstory">
              {build.story.chapters.map((c) => (
                <section key={c.title} className="backstory-chapter">
                  <h3>{c.title}</h3>
                  {c.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </section>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <PeopleEditor />
            </div>
          </>
        ) : (
          <div className="backstory" data-testid="backstory">
            {build.backstory}
          </div>
        )}
        <p className="faint" style={{ marginTop: 12 }}>
          Generated from your {build.mode === 'story' ? 'story path' : 'answers'}. Use it as a starting point for your own words.
        </p>
      </div>

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <Link className="btn btn-primary" to="/progression">
          Plan levels 1–12 →
        </Link>
      </div>
    </div>
  );
}

function Stat({ k, v, n }: { k: string; v: string | number; n?: string }) {
  return (
    <div className="stat">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      {n && <div className="n">{n}</div>}
    </div>
  );
}

function OriginChoices({ build }: { build: Build }) {
  const update = useStore((s) => s.update);
  const { ranked, cls, sub, race, subrace, background, choices } = build;

  const raceOptions: RankedOption[] = [];
  for (const r of ranked.races) {
    if (!raceOptions.some((o) => o.id === r.item.race.id)) {
      raceOptions.push({ id: r.item.race.id, name: r.item.race.name, fit: r.fit, reasons: r.reasons });
    }
  }
  const subraceOptions: RankedOption[] = ranked.races
    .filter((r) => r.item.race.id === race.id && r.item.subrace)
    .map((r) => ({ id: r.item.subrace!.id, name: r.item.subrace!.name, fit: r.fit, reasons: r.reasons }));
  const recommendedSubrace = subraceOptions[0]?.id ?? '';

  return (
    <div className="card">
      <h2>Origin</h2>
      <RankedSelect
        label="Class"
        testId="class-select"
        value={cls.id}
        recommended={ranked.classes[0]!.item.id}
        overridden={!!choices.classId}
        options={ranked.classes.map((r) => ({ id: r.item.id, name: r.item.name, fit: r.fit, reasons: r.reasons }))}
        onChange={(id) => update({ classId: id, subclassId: undefined, weaponStyle: undefined, picks: {}, skills: undefined })}
      />
      <p className="small muted" style={{ margin: '4px 0 0' }}>
        {cls.summary}
      </p>
      <RankedSelect
        label={cls.subclassLabel}
        value={sub.id}
        recommended={ranked.subclasses[0]!.item.id}
        overridden={!!choices.subclassId && choices.subclassId === sub.id}
        options={ranked.subclasses.map((r) => ({ id: r.item.id, name: r.item.name, fit: r.fit, reasons: r.reasons }))}
        onChange={(id) => update({ subclassId: id, weaponStyle: undefined, picks: {} })}
      />
      <p className="small muted" style={{ margin: '4px 0 0' }}>
        {sub.summary} <span className="faint">(chosen at level {cls.subclassLevel})</span>
      </p>
      <RankedSelect
        label="Race"
        value={race.id}
        recommended={ranked.races[0]!.item.race.id}
        overridden={!!choices.raceId}
        options={raceOptions}
        onChange={(id) => update({ raceId: id, subraceId: undefined })}
      />
      {subraceOptions.length > 0 && (
        <RankedSelect
          label="Subrace"
          value={subrace?.id ?? ''}
          recommended={recommendedSubrace}
          overridden={!!choices.subraceId}
          options={subraceOptions}
          onChange={(id) => update({ subraceId: id })}
        />
      )}
      <RankedSelect
        label="Background"
        value={background.id}
        recommended={ranked.backgrounds[0]!.item.id}
        overridden={!!choices.backgroundId}
        options={ranked.backgrounds.map((r) => ({ id: r.item.id, name: r.item.name, fit: r.fit, reasons: r.reasons }))}
        onChange={(id) => update({ backgroundId: id })}
      />
      <p className="small muted" style={{ margin: '4px 0 0' }}>
        {background.summary} <span className="faint">Skills: {background.skills.join(', ')}</span>
      </p>
      {ranked.weaponStyles.length > 1 && (
        <div className="choice-row">
          <span>Fighting style</span>
          <div>
            <select
              className="select"
              aria-label="Weapon style"
              value={build.weaponStyle}
              onChange={(e) =>
                update({ weaponStyle: e.target.value === ranked.weaponStyles[0] ? undefined : (e.target.value as WeaponStyle) })
              }
            >
              {ranked.weaponStyles.map((w, i) => (
                <option key={w} value={w}>
                  {WEAPON_STYLE_LABELS[w]}
                  {i === 0 ? ' ★' : ''}
                </option>
              ))}
            </select>
            <div className="why">Shapes your ability priorities, feats and gear.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Abilities({ build }: { build: Build }) {
  const update = useStore((s) => s.update);
  const { base, plus2, plus1, priority } = build;
  const spent = pointsSpent(base);
  const left = POINT_BUY_TOTAL - spent;
  const custom = !!(build.choices.base || build.choices.plus1 || build.choices.plus2);

  const step = (a: Ability, delta: number) => {
    const next = { ...base, [a]: base[a] + delta };
    if (next[a] < POINT_BUY_MIN || next[a] > POINT_BUY_MAX || pointsSpent(next) > POINT_BUY_TOTAL) return;
    update({ base: next });
  };
  const setBonus = (kind: 'plus2' | 'plus1', a: Ability) => {
    if (kind === 'plus2') update({ plus2: a, plus1: a === plus1 ? plus2 : plus1 });
    else update({ plus1: a, plus2: a === plus2 ? plus1 : plus2 });
  };

  return (
    <div className="card">
      <div className="card-title">
        <h2>Ability scores</h2>
        <span className={`chip ${left === 0 ? 'chip-good' : 'chip-accent'}`} data-testid="points-left">
          {left} / {POINT_BUY_TOTAL} points left
        </span>
      </div>
      <div className="abilities">
        {ABILITIES.map((a) => (
          <div key={a} className={`ability ${priority[0] === a ? 'primary' : ''}`}>
            <div className="label">{a}</div>
            <div className="score">{build.start[a]}</div>
            <div className="mod">{formatMod(modifier(build.start[a]))}</div>
            <div className="stepper">
              <button aria-label={`Decrease ${a}`} onClick={() => step(a, -1)}>
                −
              </button>
              <button aria-label={`Increase ${a}`} onClick={() => step(a, +1)}>
                +
              </button>
            </div>
            <div className="faint" style={{ fontSize: '0.72rem' }}>
              base {base[a]}
            </div>
            <div className="bonus-picks">
              <button aria-pressed={plus2 === a} onClick={() => setBonus('plus2', a)} aria-label={`+2 to ${a}`}>
                +2
              </button>
              <button aria-pressed={plus1 === a} onClick={() => setBonus('plus1', a)} aria-label={`+1 to ${a}`}>
                +1
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="spread" style={{ marginTop: 10 }}>
        <span className="faint">
          Priority for this build: {priority.slice(0, 3).join(' › ')}. By level 12: {ABILITIES.map((a) => `${a} ${build.final[a]}`).join(' · ')}
        </span>
        {custom && (
          <button className="btn btn-ghost btn-sm" onClick={() => update({ base: undefined, plus1: undefined, plus2: undefined })}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function Skills({ build }: { build: Build }) {
  const update = useStore((s) => s.update);
  const { cls } = build;
  const profSkills = new Map(build.skills.map((s) => [s.skill, s.source]));
  const classPicks = build.skills.filter((s) => s.source === cls.name).map((s) => s.skill);
  const fixed = build.skills.filter((s) => s.source !== cls.name).map((s) => s.skill);
  const pool = (cls.skillChoices.from === 'any' ? SKILL_NAMES : cls.skillChoices.from).filter((s) => !fixed.includes(s));

  const toggle = (s: Skill) => {
    const has = classPicks.includes(s);
    let next = has ? classPicks.filter((x) => x !== s) : [...classPicks, s];
    if (next.length > cls.skillChoices.count) next = next.slice(next.length - cls.skillChoices.count);
    update({ skills: next });
  };

  return (
    <div className="card">
      <h2>Skills</h2>
      <div className="skills">
        {SKILL_NAMES.map((s) => {
          const source = profSkills.get(s);
          const mod = modifier(build.start[SKILLS[s]]) + (source ? 2 : 0);
          return (
            <div key={s} className={`skill ${source ? 'prof' : ''}`} title={source ? `From ${source}` : undefined}>
              <span>
                <span className="dot" />
                {s} <span className="faint">({SKILLS[s]})</span>
              </span>
              <span>{formatMod(mod)}</span>
            </div>
          );
        })}
      </div>
      <h3 style={{ marginTop: 14 }}>
        {cls.name} skills <span className="faint">(choose {cls.skillChoices.count})</span>
      </h3>
      <div className="row">
        {pool.map((s) => (
          <button
            key={s}
            className={`chip ${classPicks.includes(s) ? '' : 'chip-plain'}`}
            style={{ border: 0, cursor: 'pointer' }}
            aria-pressed={classPicks.includes(s)}
            onClick={() => toggle(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
