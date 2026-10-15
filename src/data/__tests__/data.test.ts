import { describe, expect, it } from 'vitest';
import { validateAll } from '../validate';

describe('game data', () => {
  it('passes schema validation and reference checks', () => {
    const problems = validateAll();
    expect(problems).toEqual([]);
  });
});
