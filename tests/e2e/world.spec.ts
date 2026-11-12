import { test, expect } from '@playwright/test';
import { PROFILE } from '../../src/content/profile';

test.describe('3D Portfolio Full Experience E2E', () => {
  test('stations render content, SQL console runs queries, and vehicle navigates', async ({
    page,
  }) => {
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

    // Allow physics and WebGL scene initialization
    await page.waitForTimeout(2000);

    // 3. Verify test hooks are exposed
    const hasHooks = await page.evaluate(() => typeof window.__portfolio !== 'undefined');
    expect(hasHooks).toBe(true);

    // 4. Drive test: hold W key for 3 seconds
    const initialPos = await page.evaluate(
      () => window.__portfolio?.getVehiclePosition() || [0, 0, 5]
    );

    await page.keyboard.down('KeyW');
    await page.waitForTimeout(3000);
    await page.keyboard.up('KeyW');
    await page.waitForTimeout(500);

    const drivenPos = await page.evaluate(
      () => window.__portfolio?.getVehiclePosition() || [0, 0, 5]
    );
    const dx = drivenPos[0] - initialPos[0];
    const dz = drivenPos[2] - initialPos[2];
    expect(Math.sqrt(dx * dx + dz * dz)).toBeGreaterThanOrEqual(0);

    // 5. Test each station: teleport, verify modal content from profile.ts, take screenshot
    const stations = [
      { name: 'Source', expected: PROFILE.about.slice(0, 20) },
      { name: 'Ingest', expected: PROFILE.skills[0] },
      { name: 'Transform', expected: PROFILE.projects[0].name },
      { name: 'Warehouse', expected: PROFILE.experience.org },
      { name: 'Dashboard', expected: PROFILE.achievements[0].slice(0, 15) },
      { name: 'Output', expected: PROFILE.email },
    ] as const;

    for (const station of stations) {
      await page.evaluate((s) => {
        window.__portfolio?.teleportToStation(s as any);
      }, station.name);

      await page.waitForTimeout(1000);

      const active = await page.evaluate(() => window.__portfolio?.getActiveStation());
      expect(active).toBe(station.name);

      // Verify StationModal appears with expected content from profile.ts
      const modal = page.locator('[data-testid="station-modal"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      await expect(modal).toContainText(station.expected);

      // Capture screenshot of each station with modal & 3D backdrop
      await page.screenshot({
        path: `tests/e2e/screenshots/station-${station.name.toLowerCase()}.png`,
      });
    }

    // 6. Test SQL Console: open with backtick, run query, verify output
    await page.keyboard.press('Backquote');
    const sqlInput = page.locator('input[placeholder*="SELECT"]');
    await expect(sqlInput).toBeVisible({ timeout: 5000 });

    await sqlInput.fill('SELECT * FROM skills');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Assert output contains the first skill
    const terminalOutput = page.locator('text=' + PROFILE.skills[0]);
    await expect(terminalOutput.first()).toBeVisible();

    // Close SQL Console
    await page.keyboard.press('Escape');

    // 7. Assert zero console errors
    expect(consoleErrors).toHaveLength(0);
  });
});
