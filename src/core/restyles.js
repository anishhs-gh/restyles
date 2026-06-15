import { loadConfig } from './config.js';
import { Router, scrollToAnchor } from './router.js';
import { fetchAndRender, wireCodeCopy } from './markdown.js';
import { LuminaTheme } from '../themes/lumina/index.js';

const THEMES = {
  lumina: LuminaTheme,
};

async function init() {
  const config = await loadConfig();

  const ThemeClass = THEMES[config.theme] || LuminaTheme;
  const theme = new ThemeClass(config);
  theme.mount();

  const router = new Router(config.root, async (filePath, anchor) => {
    theme.setLoading();
    theme.setNav(config.nav, filePath);

    try {
      const { html, toc } = await fetchAndRender(filePath);
      const isRoot = filePath === config.root;
      theme.setPage(html, toc, getNavLabel(config.nav, filePath, config.root), isRoot);

      const inner = document.getElementById('rs-content-inner');
      if (inner) wireCodeCopy(inner);

      // Wire all in-page anchor clicks so they preserve the current route.
      wireAnchorLinks(router);

      if (anchor) {
        // Small delay lets the DOM settle (fonts, images) before scrolling.
        setTimeout(() => scrollToAnchor(anchor), 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    } catch (err) {
      theme.setError(`<p>${err.message}</p>`);
    }
  });

  theme.setNav(config.nav, router.currentFile());
  router.start();
}

// Intercept clicks on in-page anchors in both the content and TOC areas.
// Instead of letting the browser set hash = "#slug" (which loses the route),
// we call router.pushSection() to write "#/current-route~slug" and scroll manually.
function wireAnchorLinks(router) {
  ['rs-content-inner', 'rs-toc-inner'].forEach(id => {
    const container = document.getElementById(id);
    if (!container) return;
    container.querySelectorAll('a[href^="#"]').forEach(a => {
      // Replace any previous listener by cloning (avoids double-binding across re-renders)
      const fresh = a.cloneNode(true);
      a.replaceWith(fresh);
      fresh.addEventListener('click', e => {
        const slug = fresh.getAttribute('href').slice(1);
        if (!slug) return;
        e.preventDefault();
        router.pushSection(slug);
        scrollToAnchor(slug);
      });
    });
  });
}

function getNavLabel(nav, filePath, root) {
  if (filePath === root && nav.length === 0) return null;
  const item = nav.find(n => n.file === filePath);
  return item?.label || null;
}

init();
