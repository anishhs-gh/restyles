import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const CLI  = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../bin/restyles.js');
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist/lumina.iife.js');

if (!fs.existsSync(DIST)) {
  console.error('dist/lumina.iife.js not found — run `npm run build` first.');
  process.exit(1);
}

function tempProject(config, files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-test-'));
  fs.writeFileSync(path.join(dir, 'restyles.config.json'), JSON.stringify(config));
  for (const [name, content] of Object.entries(files)) {
    const dest = path.join(dir, name);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  }
  return dir;
}

function build(dir) {
  return execSync(`node "${CLI}" build`, { cwd: dir, encoding: 'utf8', stdio: 'pipe' });
}

test('generates index.html with correct title and description', () => {
  const dir = tempProject(
    { theme: 'lumina', title: 'My Project', description: 'A test site', root: 'README.md', nav: [] },
    { 'README.md': '# Hello' }
  );
  try {
    build(dir);
    const html = fs.readFileSync(path.join(dir, '_site', 'index.html'), 'utf8');
    assert.ok(html.includes('<title>My Project</title>'), 'title tag');
    assert.ok(html.includes('content="A test site"'), 'description meta');
    assert.ok(html.includes('src="./lumina.iife.js"'), 'bundle script tag');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('copies bundle and config into _site/', () => {
  const dir = tempProject(
    { theme: 'lumina', title: 'Test', root: 'README.md', nav: [] },
    { 'README.md': '# Hello' }
  );
  try {
    build(dir);
    assert.ok(fs.existsSync(path.join(dir, '_site', 'lumina.iife.js')), 'bundle present');
    const cfg = JSON.parse(
      fs.readFileSync(path.join(dir, '_site', 'restyles.config.json'), 'utf8')
    );
    assert.equal(cfg.title, 'Test', 'config copied');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('copies nav markdown files preserving directory structure', () => {
  const dir = tempProject(
    {
      theme: 'lumina',
      title: 'Test',
      root: 'README.md',
      nav: [{ label: 'Guide', file: 'docs/guide.md' }],
    },
    { 'README.md': '# Home', 'docs/guide.md': '# Guide' }
  );
  try {
    build(dir);
    assert.ok(fs.existsSync(path.join(dir, '_site', 'README.md')), 'root md copied');
    assert.ok(fs.existsSync(path.join(dir, '_site', 'docs', 'guide.md')), 'nested md copied');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('emits favicon link with correct MIME type', () => {
  const dir = tempProject(
    { theme: 'lumina', title: 'Test', root: 'README.md', favicon: 'icon.png', nav: [] },
    { 'README.md': '# Hello', 'icon.png': '' }
  );
  try {
    build(dir);
    const html = fs.readFileSync(path.join(dir, '_site', 'index.html'), 'utf8');
    assert.ok(html.includes('rel="icon"'), 'favicon link present');
    assert.ok(html.includes('type="image/png"'), 'correct MIME type');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('exits non-zero when restyles.config.json is missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-test-'));
  try {
    assert.throws(
      () => build(dir),
      (err) => {
        assert.ok(err.stderr.includes('restyles.config.json not found'), 'error message in stderr');
        return true;
      }
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('warns about missing nav file but still builds successfully', () => {
  const dir = tempProject(
    {
      theme: 'lumina',
      title: 'Test',
      root: 'README.md',
      nav: [{ label: 'Ghost', file: 'ghost.md' }],
    },
    { 'README.md': '# Hello' }
  );
  try {
    build(dir);
    assert.ok(fs.existsSync(path.join(dir, '_site', 'index.html')), '_site still created');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
