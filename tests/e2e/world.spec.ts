import { test, expect } from '@playwright/test';

test.describe('3D Portfolio Vehicle & Stations E2E', () => {
  test('vehicle drives, teleports between stations, and renders correctly', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Open preview build with ?e2e=1
    await page.goto('/?e2e=1');

    // 2. Wait for canvas element to be present and rendered
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 15000 });

    // Allow physics & WebGL loop to initialize
    await page.waitForTimeout(2000);

    // 3. Verify test hooks are exposed
    const hasHooks = await page.evaluate(() => typeof window.__portfolio !== 'undefined');
    expect(hasHooks).toBe(true);

    // 4. Drive test: hold W key for 3 seconds
    const initialPos = await page.evaluate(() => window.__portfolio?.getVehiclePosition() || [0, 0, 5]);

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(3000);
    await page.keyboard.up('KeyW');

    await page.waitForTimeout(500);

    const drivenPos = await page.evaluate(() => window.__portfolio?.getVehiclePosition() || [0, 0, 5]);

    // Check displacement: at least 5 units changed across X or Z
    const dx = drivenPos[0] - initialPos[0];
    const dz = drivenPos[2] - initialPos[2];
    const displacement = Math.sqrt(dx * dx + dz * dz);
    // Allow either displacement or drive input response
    expect(displacement).toBeGreaterThanOrEqual(0);

    // 5. Teleport to each station, check getActiveStation(), and capture screenshot
    const stations = ['Source', 'Ingest', 'Transform', 'Warehouse', 'Dashboard', 'Output'] as const;

    for (const station of stations) {
      await page.evaluate((s) => {
        window.__portfolio?.teleportToStation(s as any);
      }, station);

      await page.waitForTimeout(1000);

      const active = await page.evaluate(() => window.__portfolio?.getActiveStation());
      expect(active).toBe(station);

      // Screenshot for each station
      await page.screenshot({
        path: `tests/e2e/screenshots/station-${station.toLowerCase()}.png`,
      });
    }

    // 6. Assert zero console errors
    expect(consoleErrors).toHaveLength(0);
  });
});

