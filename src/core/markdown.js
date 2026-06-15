import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

// Configure marked with syntax highlighting and heading anchors
marked.setOptions({
  breaks: true,
  gfm: true,
});

const renderer = new marked.Renderer();

renderer.code = function ({ text, lang }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  const id = 'code-' + Math.random().toString(36).slice(2, 8);
  return `<div class="rs-code-block">
    <div class="rs-code-header">
      <span class="rs-code-lang">${language}</span>
      <button class="rs-copy-btn" data-target="${id}" aria-label="Copy code">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy
      </button>
    </div>
    <pre id="${id}"><code class="hljs language-${language}">${highlighted}</code></pre>
  </div>`;
};

renderer.heading = function ({ text, depth }) {
  const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  return `<h${depth} id="${slug}" class="rs-heading rs-h${depth}">
    <a class="rs-anchor" href="#${slug}" aria-hidden="true">#</a>${text}
  </h${depth}>`;
};

marked.use({ renderer });

export async function fetchAndRender(filePath) {
  const res = await fetch('./' + filePath);
  if (!res.ok) throw new Error(`Could not load ${filePath} (${res.status})`);
  const md = await res.text();
  return {
    html: marked.parse(md),
    toc: extractToc(md),
  };
}

function extractToc(md) {
  const headingRe = /^(#{2,3})\s+(.+)$/gm;
  const items = [];
  let match;
  while ((match = headingRe.exec(md)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[*_`]/g, '');
    const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    items.push({ level, text, slug });
  }
  return items;
}

export function wireCodeCopy(container) {
  container.querySelectorAll('.rs-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = document.getElementById(btn.dataset.target);
      const code = pre?.querySelector('code');
      if (!code) return;
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
        }, 2000);
      });
    });
  });
}
