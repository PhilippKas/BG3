import { describe, expect, it } from 'vitest';
import { parseInfobox } from '../../../scripts/wiki-parse';

describe('wiki infobox parser', () => {
  it('reads top-level fields and keeps nested templates and links intact', () => {
    const text = '{{WeaponPage\n| name = Example Blade\n| rarity = Rare\n| damage = {{DamageText|1d8|Slashing}}\n| notes = See [[Link|here]]\n}}\nBody';
    expect(parseInfobox(text)).toEqual({
      template: 'WeaponPage',
      name: 'Example Blade',
      rarity: 'Rare',
      damage: '{{DamageText|1d8|Slashing}}',
      notes: 'See [[Link|here]]',
    });
  });
});
