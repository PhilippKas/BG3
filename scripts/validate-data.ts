import { validateAll } from '../src/data/validate';

const problems = validateAll();
if (problems.length) {
  console.error(`✗ ${problems.length} data problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('✓ All game data is valid.');
