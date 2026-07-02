import { expect, test } from '@playwright/test';

const CARD = 'Finalize pricing tiers';

test('loads the seeded public demo board (anon read via RLS)', async ({ page }) => {
  await page.goto('/');

  // The board must be served *from Supabase*, not the static fallback — otherwise
  // persistence and realtime are silently off. data-live proves the anon-key read worked.
  await expect(page.locator('[data-live="true"]')).toBeVisible();

  await expect(page.getByText('Product launch')).toBeVisible();
  await expect(page.getByTestId('column')).toHaveCount(3);
  await expect(page.getByTestId('card').filter({ hasText: CARD })).toBeVisible();
});

test('drag a card to another column and it persists', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-live="true"]')).toBeVisible();

  const card = page.getByTestId('card').filter({ hasText: CARD }).first();
  const done = page.getByTestId('column').filter({ hasText: 'Done' });
  await expect(card).toBeVisible();
  await expect(done).toBeVisible();

  const cb = (await card.boundingBox())!;
  const db = (await done.boundingBox())!;

  // Dropping the card persists it via a PATCH to the cards table. Wait for that response
  // before reloading, so we assert *real* persistence rather than the optimistic UI update
  // (and never race a fire-and-forget write against the reload).
  const patched = page.waitForResponse(
    (r) => r.url().includes('/rest/v1/cards') && r.request().method() === 'PATCH',
  );

  // dnd-kit PointerSensor has a 6px activation distance — move in steps to trigger the drag.
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2);
  await page.mouse.down();
  await page.mouse.move(cb.x + cb.width / 2 + 16, cb.y + cb.height / 2 + 6, { steps: 6 });
  await page.mouse.move(db.x + db.width / 2, db.y + 130, { steps: 14 });
  await page.mouse.move(db.x + db.width / 2, db.y + 145, { steps: 4 });
  await page.mouse.up();

  // Optimistic: the card is now inside the Done column.
  await expect(done.getByTestId('card').filter({ hasText: CARD })).toBeVisible();

  // Persisted: the write reached Supabase and succeeded.
  const res = await patched;
  expect(res.ok()).toBeTruthy();

  // ...so a reload re-fetches the board from Supabase with the card still in Done.
  await page.reload();
  await expect(page.locator('[data-live="true"]')).toBeVisible();
  await expect(
    page.getByTestId('column').filter({ hasText: 'Done' }).getByTestId('card').filter({ hasText: CARD }),
  ).toBeVisible();
});
