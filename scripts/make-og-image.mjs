import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function makeOgImage() {
  console.log('Capturing OG Social preview image...');

  const server = http.createServer((req, res) => {
    const cleanUrl = req.url.split('?')[0];
    let filePath = path.join(rootDir, 'dist', cleanUrl === '/' ? 'index.html' : cleanUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime =
        ext === '.html'
          ? 'text/html'
          : ext === '.js'
            ? 'text/javascript'
            : ext === '.css'
              ? 'text/css'
              : ext === '.svg'
                ? 'image/svg+xml'
                : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      filePath = path.join(rootDir, 'dist', 'index.html');
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404);
        res.end();
      }
    }
  });

  await new Promise((resolve) => server.listen(4198, resolve));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  await page.goto('http://localhost:4198/?e2e=1', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(4000);

  const publicDir = path.join(rootDir, 'public');
  const ogPath = path.join(publicDir, 'og-image.png');
  await page.screenshot({ path: ogPath });

  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.copyFileSync(ogPath, path.join(rootDir, 'dist', 'og-image.png'));
  }

  console.log(`Saved OG image to ${ogPath}`);
  await browser.close();
  server.close();
}

makeOgImage().catch((err) => {
  console.error(err);
  process.exit(1);
});
