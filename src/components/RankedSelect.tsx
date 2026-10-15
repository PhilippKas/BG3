import type { Tag } from '../data/schema';
import { describeReasons } from '../engine/tags';

export interface RankedOption {
  id: string;
  name: string;
  fit?: number;
  reasons?: Tag[];
}

interface Props {
  label: string;
  value: string;
  options: RankedOption[];
  /** id of the engine's top recommendation */
  recommended: string;
  overridden: boolean;
  onChange: (id: string | undefined) => void;
  testId?: string;
}

/** A select listing options by fit, with the reason for the current pick underneath. */
export function RankedSelect({ label, value, options, recommended, overridden, onChange, testId }: Props) {
  const current = options.find((o) => o.id === value);
  return (
    <div className="choice-row">
      <span>{label}</span>
      <div>
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <select
            className="select"
            aria-label={label}
            data-testid={testId}
            value={value}
            onChange={(e) => onChange(e.target.value === recommended ? undefined : e.target.value)}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
                {o.id === recommended ? ' ★' : ''}
                {o.fit !== undefined ? ` — ${o.fit}% fit` : ''}
              </option>
            ))}
          </select>
          {overridden && (
            <button className="btn btn-ghost btn-sm" onClick={() => onChange(undefined)} title="Back to recommendation">
              Reset
            </button>
          )}
        </div>
        {current?.reasons && <div className="why">{overridden ? 'Your choice. ' : '★ Recommended. '}{describeReasons(current.reasons)}</div>}
      </div>
    </div>
  );
}
