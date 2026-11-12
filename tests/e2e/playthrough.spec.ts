import { test, expect } from '@playwright/test';

test.describe('Visitor Full Experience Playthrough', () => {
  test('visitor drives through pipeline, interacts with stations, queries SQL, toggles mute, and downloads resume', async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      // Ignore normal WebGL warning logs if any
      if (msg.type() === 'error' && !msg.text().includes('GL Driver Message')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(req.url());
    });

    // 1. Load production preview
    await page.goto('./?e2e=1');

    // Wait for canvas element
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Allow physics to boot
    await page.waitForTimeout(2000);

    // 2. Drive & visit every station sequentially
    const stations = ['Source', 'Ingest', 'Transform', 'Warehouse', 'Dashboard', 'Output'] as const;

    for (const station of stations) {
      // Teleport to ensure reliable visit across pipeline without flaky physical physics collisions in CI
      await page.evaluate((st) => {
        window.__portfolio?.teleportToStation(st as any);
      }, station);

      const modal = page.locator('[data-testid="station-modal"]');
      await expect(modal).toBeVisible({ timeout: 8000 });
      await expect(modal).toContainText(station);

      // Close modal with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

    // 3. Open SQL console, run two queries
    await page.keyboard.press('Backquote');
    const sqlInput = page.locator('input[placeholder*="SELECT"]');
    await expect(sqlInput).toBeVisible({ timeout: 5000 });

    // Query 1: SHOW TABLES
    await sqlInput.fill('SHOW TABLES');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await expect(page.locator('text=Tables_in_portfolio').first()).toBeVisible();

    // Query 2: SELECT * FROM experience
    await sqlInput.fill('SELECT * FROM experience');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await expect(page.locator('text=Data Platform Intern').first()).toBeVisible();

    // Close SQL console
    await page.keyboard.press('Escape');

    // 4. Toggle Mute
    const muteBtn = page.locator('button[aria-label*="Audio"]');
    await expect(muteBtn).toBeVisible();
    await muteBtn.click({ force: true });

    // 5. Assert resume.pdf responds with HTTP 200 and PDF content-type
    const pdfResponse = await request.get('./resume.pdf');
    expect(pdfResponse.status()).toBe(200);
    const contentType = pdfResponse.headers()['content-type'] || '';
    expect(contentType).toContain('application/pdf');

    // 6. Assert zero console errors & zero failed network requests
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });
});

