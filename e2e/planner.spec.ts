import { expect, test, type Page } from '@playwright/test';


/** Answers every question by clicking the option whose text matches. */
async function answerAll(page: Page, picks: string[]) {
  await page.goto('/#/origin');
  for (const text of picks) {
    await page.getByRole('button', { name: text, exact: false }).first().click();
  }
}

const WARLOCK_ANSWERS = [
  'I made a bargain',
  'Picking pockets',
  'Twisting their minds',
  'My soul',
  'Strange, unsettling',
  'I laughed',
  'The dark beneath the earth',
  'It’s a door',
  'Talk. There’s always',
  'A staff or wand',
  'Ambition.',
  'something infernal',
  'Cast a spell on it',
  'I answer to my patron',
  'Power, plain and simple',
];

test('questionnaire produces a full build with 12 levels', async ({ page }) => {
  await answerAll(page, WARLOCK_ANSWERS);
  await expect(page).toHaveURL(/#\/character/);
  await expect(page.getByTestId('summary')).toContainText('Warlock');
  await expect(page.getByTestId('points-left')).toContainText('0 / 27');
  await expect(page.getByTestId('backstory')).toContainText('bargain');

  await page.getByRole('link', { name: 'Levels 1–12', exact: true }).click();
  for (let l = 1; l <= 12; l++) await expect(page.getByTestId(`level-${l}`)).toBeVisible();
  await expect(page.getByTestId('level-1').getByTestId('pick-cantrips')).toBeVisible();
});

test('overriding the class updates the build', async ({ page }) => {
  await answerAll(page, WARLOCK_ANSWERS);
  await page.getByTestId('class-select').selectOption('fighter');
  await expect(page.getByTestId('summary')).toContainText('Fighter');
  await expect(page.getByText('Reset').first()).toBeVisible();
});

test('gear hides item names until revealed', async ({ page }) => {
  await answerAll(page, WARLOCK_ANSWERS);
  await page.goto('/#/gear');
  const items = page.getByTestId('gear-item');
  await expect(items.first()).toBeVisible();
  // No secret section is rendered by default.
  await expect(page.getByTestId('item-secret')).toHaveCount(0);
  const html = await page.locator('main').innerHTML();
  for (const name of ['Markoheshkir', 'Birthright', 'Spellcrux Amulet', 'Helldusk']) expect(html).not.toContain(name);

  await items.first().getByTestId('reveal').click();
  await expect(items.first().getByTestId('item-secret')).toBeVisible();
  await expect(page.getByTestId('item-secret')).toHaveCount(1);
});

test('state survives a reload', async ({ page }) => {
  await answerAll(page, WARLOCK_ANSWERS);
  await page.getByLabel('Character name').fill('Vex');
  await page.reload();
  await expect(page.getByLabel('Character name')).toHaveValue('Vex');
  await expect(page.getByTestId('summary')).toContainText('Warlock');
});

test('share link round-trips a build', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await answerAll(page, WARLOCK_ANSWERS);
  await page.getByLabel('Character name').fill('Shared Sam');
  await page.goto('/#/builds');
  await page.getByRole('button', { name: 'Copy share link' }).click();
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toContain('#/share/');

  const fresh = await context.newPage();
  await fresh.goto('/');
  await fresh.evaluate(() => localStorage.clear());
  await fresh.goto(url.replace(/^https?:\/\/[^/]+/, ''));
  await expect(fresh.getByRole('heading', { name: 'Shared Sam' })).toBeVisible();
  await fresh.getByRole('button', { name: 'Open this build' }).click();
  await expect(fresh.getByTestId('summary')).toContainText('Warlock');
});
