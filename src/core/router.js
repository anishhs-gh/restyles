// Hash routing format:
//   #/                          → root file
//   #/docs/guide                → docs/guide.md
//   #/docs/guide~step-2         → docs/guide.md, scroll to #step-2
//   #/~how-it-works             → root file, scroll to #how-it-works
//
// Bare in-page anchors (#slug) are intercepted by wireAnchorLinks() and
// converted to the compound format above, so they are never stored bare.

export class Router {
  constructor(rootFile, onNavigate) {
    this.rootFile  = rootFile;
    this.onNavigate = onNavigate;
    this._currentFile = null;
    window.addEventListener('hashchange', () => this._resolve());
  }

  start() {
    const hash = window.location.hash;
    if (hash && !hash.startsWith('#/')) {
      // Bare anchor on initial load (old bookmark / external link):
      // treat as root + anchor so the page still renders.
      this._currentFile = this.rootFile;
      this.onNavigate(this.rootFile, hash.slice(1));
    } else {
      this._resolve();
    }
  }

  currentFile() {
    return this._parse(window.location.hash).file;
  }

  // Called by anchor-link interception to update URL without full reload.
  // Preserves current route, appends the anchor slug.
  pushSection(slug) {
    const { routePart } = this._parse(window.location.hash);
    window.location.hash = routePart + (slug ? '~' + slug : '');
  }

  _resolve() {
    const hash = window.location.hash;
    // Ignore bare anchors — they are handled by wireAnchorLinks interception.
    if (hash && !hash.startsWith('#/')) return;

    const { file, anchor } = this._parse(hash);

    if (file === this._currentFile) {
      // Same page — just scroll, no content reload.
      if (anchor) scrollToAnchor(anchor);
      return;
    }

    this._currentFile = file;
    this.onNavigate(file, anchor);
  }

  _parse(hash) {
    if (!hash || hash === '#' || hash === '#/') {
      return { file: this.rootFile, anchor: null, routePart: '#/' };
    }

    const withoutPrefix = hash.replace(/^#\//, ''); // e.g. "docs/guide~step-2" or "~how-it-works"
    const tilde = withoutPrefix.indexOf('~');
    const routeStr = tilde === -1 ? withoutPrefix : withoutPrefix.slice(0, tilde);
    const anchor   = tilde === -1 ? null : (withoutPrefix.slice(tilde + 1) || null);

    const file = !routeStr
      ? this.rootFile
      : routeStr.endsWith('.md') ? routeStr : routeStr + '.md';

    return { file, anchor, routePart: '#/' + routeStr };
  }
}

export function scrollToAnchor(slug) {
  const el = document.getElementById(slug);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}
