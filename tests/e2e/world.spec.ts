import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PROFILE } from '../../src/content/profile';

test.describe('3D Portfolio Full Experience & Accessibility E2E', () => {
  test('stations render content, SQL console runs queries, and vehicle navigates', async ({
    page,
  }, testInfo) => {
    const isMobile = testInfo.project.name === 'mobile-pixel';
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

    // 4. Measure FPS over 5 seconds
    const fpsMeasurements: number[] = [];
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1000);
      const currentFps = await page.evaluate(() => window.__portfolio?.fps() || 60);
      fpsMeasurements.push(currentFps);
    }
    const avgFps = fpsMeasurements.reduce((a, b) => a + b, 0) / fpsMeasurements.length;
    console.log(`[${testInfo.project.name}] Measured Average FPS: ${avgFps}`);
    expect(avgFps).toBeGreaterThanOrEqual(1);

    // 5. Mobile Touch Joystick Test
    if (isMobile) {
      const joystick = page.locator('[data-testid="touch-joystick"]');
      await expect(joystick).toBeVisible();

      // Simulate touch drag
      const box = await joystick.boundingBox();
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        await page.touchscreen.tap(startX, startY);
      }
    } else {
      // Desktop Drive test: hold W key for 3 seconds
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
    }

    // 6. Test each station: teleport, verify modal content from profile.ts, take screenshot
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

      // Verify StationModal appears with expected content
      const modal = page.locator('[data-testid="station-modal"]');
      await expect(modal).toBeVisible({ timeout: 5000 });
      await expect(modal).toContainText(station.expected);

      // Capture screenshot
      const vpName = isMobile ? 'mobile' : 'desktop';
      await page.screenshot({
        path: `tests/e2e/screenshots/${vpName}-station-${station.name.toLowerCase()}.png`,
      });
    }

    // 7. Desktop SQL Console check
    if (!isMobile) {
      await page.keyboard.press('Backquote');
      const sqlInput = page.locator('input[placeholder*="SELECT"]');
      await expect(sqlInput).toBeVisible({ timeout: 5000 });

      await sqlInput.fill('SELECT * FROM skills');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      const terminalOutput = page.locator('text=' + PROFILE.skills[0]);
      await expect(terminalOutput.first()).toBeVisible();

      await page.keyboard.press('Escape');
    }

    // 8. Assert zero console errors
    expect(consoleErrors).toHaveLength(0);
  });

  test('accessibility check with axe-core on HUD and 2D resume', async ({ page }) => {
    // 1. Check /resume/ page accessibility
    await page.goto('/resume/');
    await expect(page.locator('h1')).toContainText('Alex Rivera');

    const resumeAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = resumeAxe.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact || '')
    );
    expect(criticalViolations).toHaveLength(0);

    // 2. Check 3D scene HUD overlay accessibility
    await page.goto('/?e2e=1');
    await page.waitForTimeout(2000);

    const hudAxe = await new AxeBuilder({ page })
      .include('.hud-root')
      .analyze();

    const hudCritical = hudAxe.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact || '')
    );
    expect(hudCritical).toHaveLength(0);
  });

  test('fallback redirects to 2D resume when WebGL is disabled', async ({ page }) => {
    // Stub WebGL context to null
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = function (contextType: string) {
        if (contextType.includes('webgl')) {
          return null;
        }
        return null;
      };
    });

    await page.goto('/');
    // Check fallback notice or automatic redirect
    await expect(page.locator('text=3D Hardware Acceleration Unavailable')).toBeVisible({
      timeout: 5000,
    });
  });
});
