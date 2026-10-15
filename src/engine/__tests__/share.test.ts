import { describe, expect, it } from 'vitest';
import { emptyChoices } from '../build';
import { decodeShare, encodeShare, exportBuild, parseChoices } from '../share';

describe('share & export', () => {
  const choices = {
    ...emptyChoices(),
    name: 'Tav',
    answers: { power: 'bargain' },
    classId: 'warlock',
    base: { STR: 8, DEX: 14, CON: 14, INT: 10, WIS: 10, CHA: 15 },
    picks: { '1:cantrips': ['eldritch-blast'] },
  };

  it('round-trips through a share string', () => {
    expect(decodeShare(encodeShare(choices))).toEqual(choices);
  });

  it('round-trips through an exported file', () => {
    expect(parseChoices(JSON.parse(exportBuild(choices)))).toEqual(choices);
  });

  it('rejects garbage', () => {
    expect(decodeShare('not-a-build')).toBeNull();
    expect(parseChoices({ app: 'other' , version: 2 })).toBeNull();
  });
});
