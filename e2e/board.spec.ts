import { expect, test } from '@playwright/test';

const CARD = 'Finalize pricing tiers';

test('loads the seeded public demo board (anon read via RLS)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Product launch')).toBeVisible();
  await expect(page.getByTestId('column')).toHaveCount(3);
  await expect(page.getByTestId('card').filter({ hasText: CARD })).toBeVisible();
});

test('drag a card to another column and it persists', async ({ page }) => {
  await page.goto('/');

  const card = page.getByTestId('card').filter({ hasText: CARD }).first();
  const done = page.getByTestId('column').filter({ hasText: 'Done' });
  await expect(card).toBeVisible();
  await expect(done).toBeVisible();

  const cb = (await card.boundingBox())!;
  const db = (await done.boundingBox())!;

  // dnd-kit PointerSensor has a 6px activation distance — move in steps to trigger the drag.
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
  await page.mouse.down();
  await page.mouse.move(cb.x + cb.width / 2 + 16, cb.y + cb.height / 2 + 6, { steps: 6 });
  await page.mouse.move(db.x + db.width / 2, db.y + 130, { steps: 14 });
  await page.mouse.move(db.x + db.width / 2, db.y + 145, { steps: 4 });
  await page.mouse.up();

  // The card is now inside the Done column.
  await expect(done.getByTestId('card').filter({ hasText: CARD })).toBeVisible();

  // And the move persisted: a reload re-fetches the board from Supabase.
  await page.reload();
  await expect(
    page.getByTestId('column').filter({ hasText: 'Done' }).getByTestId('card').filter({ hasText: CARD }),
  ).toBeVisible();
});
