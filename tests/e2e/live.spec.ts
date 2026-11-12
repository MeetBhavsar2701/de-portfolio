import { test, expect } from '@playwright/test';

const LIVE_URL = process.env.LIVE_URL || 'https://meetbhavsar2701.github.io/de-portfolio/';

test.describe('Live Production Smoke Test', () => {
  test('live deployed site loads, renders 3D world, stations open, resume works', async ({
    page,
    request,
  }, testInfo) => {
    const isMobile = testInfo.project.name.includes('mobile');
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('GL Driver Message')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      // Ignore optional analytics or third-party favicon requests if any
      if (!req.url().includes('google-analytics')) {
        failedRequests.push(req.url());
      }
    });

    // 1. Check HTTP response status
    const response = await page.goto(LIVE_URL + '?e2e=1', { waitUntil: 'load', timeout: 30000 });
    expect(response?.status()).toBe(200);

    // 2. Wait for canvas element
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 20000 });
    await page.waitForTimeout(3000);

    // 3. Teleport to each station and verify modal
    const stations = ['Source', 'Ingest', 'Transform', 'Warehouse', 'Dashboard', 'Output'] as const;

    for (const station of stations) {
      await page.evaluate((st) => {
        window.__portfolio?.teleportToStation(st as any);
      }, station);

      const modal = page.locator('[data-testid="station-modal"]');
      await expect(modal).toBeVisible({ timeout: 8000 });
      await expect(modal).toContainText(station);

      // Save live station screenshot
      const vpName = isMobile ? 'mobile' : 'desktop';
      await page.screenshot({
        path: `docs/live/${vpName}-station-${station.toLowerCase()}.png`,
      });
    }

    // 4. Verify /resume/ page loads with HTTP 200
    const resumeRes = await request.get(new URL('resume/', LIVE_URL).toString());
    expect(resumeRes.status()).toBe(200);
    const resumeText = await resumeRes.text();
    expect(resumeText).toContain('Alex Rivera');

    // 5. Verify /resume.pdf returns PDF
    const pdfRes = await request.get(new URL('resume.pdf', LIVE_URL).toString());
    expect(pdfRes.status()).toBe(200);
    expect(pdfRes.headers()['content-type'] || '').toContain('application/pdf');

    // 6. Verify og-image.png returns image
    const ogRes = await request.get(new URL('og-image.png', LIVE_URL).toString());
    expect(ogRes.status()).toBe(200);
    expect(ogRes.headers()['content-type'] || '').toContain('image/png');

    // 7. Verify zero fatal console errors and zero failed requests
    expect(consoleErrors).toHaveLength(0);
    expect(failedRequests).toHaveLength(0);
  });
});

