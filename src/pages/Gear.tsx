import { Link } from 'react-router-dom';
import type { Item } from '../data/schema';
import { Eye } from '../components/Icons';
import { useBuild, useStore, type SpoilerLevel } from '../store/build';
import { WEAPON_STYLE_LABELS } from '../engine/recommend';

const SPOILER_LABELS: Record<SpoilerLevel, string> = {
  0: 'Roles only',
  1: 'Show names',
  2: 'Names & where',
};

export function Gear() {
  const build = useBuild();
  const spoilerLevel = useStore((s) => s.spoilerLevel);
  const setSpoilerLevel = useStore((s) => s.setSpoilerLevel);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Gear plan</h1>
          <p>
            Built around <b>{WEAPON_STYLE_LABELS[build.weaponStyle].toLowerCase()}</b> and{' '}
            <b>{build.armourPlan.category === 'none' ? 'no armour' : `${build.armourPlan.category} armour`}</b>. The baseline
            for each slot is ordinary equipment. Notable items are described only by what they do. Reveal names or
            locations if you want them.
          </p>
        </div>
        <div className="segmented" role="group" aria-label="Spoiler level">
          {([0, 1, 2] as SpoilerLevel[]).map((l) => (
            <button key={l} aria-pressed={spoilerLevel === l} onClick={() => setSpoilerLevel(l)}>
              {SPOILER_LABELS[l]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-3">
        {build.gear.map((slot) => (
          <div className="card gear-slot" key={slot.slot} data-testid={`slot-${slot.slot}`}>
            <h3>{slot.label}</h3>
            {slot.baseline && (
              <div className="baseline">
                <div className="faint">Baseline</div>
                {slot.baseline}
              </div>
            )}
            <div className="small muted">
              <b>Look for:</b> {slot.lookFor}
            </div>
            {slot.items.map(({ item }) => (
              <GearItem key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
      <p className="faint" style={{ marginTop: 20 }}>
        The local item list is a curated selection. Acts and locations appear only where they’ve been checked, and the
        list doesn’t cover every item in the game. <Link to="/builds">Export your build</Link> to keep your plan.
      </p>
    </div>
  );
}

function GearItem({ item }: { item: Item }) {
  const global = useStore((s) => s.spoilerLevel);
  const local = useStore((s) => s.revealed[item.id] ?? 0);
  const reveal = useStore((s) => s.reveal);
  const level = Math.max(global, local);
  return (
    <div className="item" data-testid="gear-item">
      <div className={`small rarity-${item.rarity}`}>
        <b>{item.rarity}</b> · {item.base}
      </div>
      <div className="item-role">{item.roleDescription}</div>
      <ul className="item-props">
        {item.properties.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {level >= 1 && (
        <div className="secret" data-testid="item-secret">
          <span className="secret-name">{item.name}</span>
          {level >= 2 && (
            <div className="small muted">
              {item.act ? `Act ${item.act}` : 'Act not recorded'}
              {item.location ? ` — ${item.location}` : ' · location not in the local data'}
            </div>
          )}
        </div>
      )}
      {level < 2 && (
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }} onClick={() => reveal(item.id)} data-testid="reveal">
          <Eye width={14} /> {level === 0 ? 'Reveal name' : 'Reveal where to find it'}
        </button>
      )}
    </div>
  );
}
