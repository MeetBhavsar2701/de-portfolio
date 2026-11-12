import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function makeResumePdf() {
  console.log('Generating resume.pdf from built /resume/ page...');

  const resumeHtmlPath = path.join(rootDir, 'dist', 'resume', 'index.html');
  if (!fs.existsSync(resumeHtmlPath)) {
    console.error('Error: dist/resume/index.html not found. Run vite build first.');
    process.exit(1);
  }

  // Simple static file server for dist
  const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, 'dist', req.url === '/' ? 'index.html' : req.url);
    if (req.url.endsWith('/resume/')) {
      filePath = path.join(rootDir, 'dist', 'resume', 'index.html');
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(4199, resolve));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:4199/resume/', { waitUntil: 'networkidle' });

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pdfPath = path.join(publicDir, 'resume.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
  });

  // Also copy to dist/ if dist exists
  const distPublicPdf = path.join(rootDir, 'dist', 'resume.pdf');
  if (fs.existsSync(path.join(rootDir, 'dist'))) {
    fs.copyFileSync(pdfPath, distPublicPdf);
  }

  console.log(`Saved PDF to ${pdfPath}`);
  await browser.close();
  server.close();
}

makeResumePdf().catch((err) => {
  console.error(err);
  process.exit(1);
});

