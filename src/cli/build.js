import fs   from 'fs';
import path  from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cwd       = process.cwd();
const outDir    = path.join(cwd, '_site');

// ── Read config ───────────────────────────────────────────────────────────────
let config;
try {
  config = JSON.parse(fs.readFileSync(path.join(cwd, 'restyles.config.json'), 'utf8'));
} catch {
  console.error('[ReStyles] restyles.config.json not found. Run this command from your project root.');
  process.exit(1);
}

// ── Clean + create output dir ─────────────────────────────────────────────────
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

// ── Copy the JS bundle (self-hosted — no CDN dependency) ─────────────────────
const bundleSrc  = path.join(__dirname, '../../dist/lumina.iife.js');
const bundleDest = path.join(outDir, 'lumina.iife.js');
if (!fs.existsSync(bundleSrc)) {
  console.error('[ReStyles] dist/lumina.iife.js not found. Run `npm run build` first.');
  process.exit(1);
}
fs.copyFileSync(bundleSrc, bundleDest);

// ── Resolve favicon ───────────────────────────────────────────────────────────
let faviconLink = '';
if (config.favicon) {
  const ext  = path.extname(config.favicon).toLowerCase();
  const mime = ext === '.svg' ? 'image/svg+xml'
             : ext === '.png' ? 'image/png'
             : ext === '.webp' ? 'image/webp'
             : 'image/x-icon';
  faviconLink = `\n  <link rel="icon" href="./${config.favicon}" type="${mime}">`;
}

// ── Generate index.html ───────────────────────────────────────────────────────
const title       = escText(config.title || 'Docs');
const description = escAttr(config.description || '');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${description}">${faviconLink}
  <title>${title}</title>
  <script src="./lumina.iife.js"></script>
</head>
<body></body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), html);

// ── Copy restyles.config.json ─────────────────────────────────────────────────
fs.copyFileSync(
  path.join(cwd, 'restyles.config.json'),
  path.join(outDir, 'restyles.config.json')
);

// ── Collect files to copy ─────────────────────────────────────────────────────
const queue = new Set();
if (config.root)    queue.add(config.root);
if (config.logo)    queue.add(config.logo);
if (config.favicon) queue.add(config.favicon);
for (const item of config.nav || []) {
  if (item.file) queue.add(item.file);
}

let copied = 0, missing = 0;
for (const rel of queue) {
  const src  = path.join(cwd, rel);
  const dest = path.join(outDir, rel);
  if (!fs.existsSync(src)) {
    console.warn(`[ReStyles] Warning: ${rel} not found, skipping.`);
    missing++;
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
}

// ── Done ──────────────────────────────────────────────────────────────────────
console.log(`[ReStyles] Built → _site/`);
console.log(`  index.html       generated`);
console.log(`  lumina.iife.js   bundled`);
if (config.favicon) console.log(`  favicon          ${config.favicon}`);
console.log(`  markdown files   ${copied} copied${missing ? `, ${missing} skipped (not found)` : ''}`);

// ── Helpers ───────────────────────────────────────────────────────────────────
function escText(s) { return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escAttr(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
