import './lumina.css';
import { PALETTES, PALETTE_NAMES, getPaletteVars } from './colors.js';

const SWATCH_COLORS = {
  indigo:  '#6366f1',
  violet:  '#8b5cf6',
  emerald: '#10b981',
  rose:    '#f43f5e',
  amber:   '#f59e0b',
  sky:     '#0ea5e9',
};

export class LuminaTheme {
  constructor(config) {
    this.config = config;
    this.currentColor = config.color || 'indigo';
    this.isDark = this._resolveInitialMode(config.darkMode);
    this.customColor = config.customColor?.primary || null;
    this._injectFonts();
  }

  mount() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    this._applyColorVars();
    document.body.innerHTML = this._renderShell();
    this._initHero();
    this._bindTopbar();
    this._bindSidebar();
    this._bindColorPicker();
    this._observeToc();
  }

  setNav(navItems, currentFile) {
    const nav = document.getElementById('rs-nav');
    if (!nav) return;
    nav.innerHTML = this._renderNav(navItems, currentFile);
    this._bindNavItems(currentFile);
  }

  setLoading() {
    this._setContent(`
      <div class="rs-loading">
        <div class="rs-spinner"></div>
        <span>Loading…</span>
      </div>
    `);
    this._setToc([]);
  }

  setPage(html, toc, title, isRoot = false) {
    document.title = title
      ? `${title} — ${this.config.title}`
      : this.config.title;

    const hero = document.getElementById('rs-hero');
    if (hero) hero.hidden = !(isRoot && !!this.config.hero);

    this._setContent(`<div class="rs-markdown${isRoot && this.config.hero ? ' rs-has-hero' : ''}">${html}</div>`);
    this._setToc(toc);
  }

  setError(message) {
    this._setContent(`
      <div class="rs-error">
        <strong>Could not load page</strong>
        ${message}
      </div>
    `);
    this._setToc([]);
  }

  // ── Private ───────────────────────────────────────────────

  _resolveInitialMode(darkMode) {
    const stored = localStorage.getItem('rs-theme');
    if (stored) return stored === 'dark';
    if (darkMode === 'dark') return true;
    if (darkMode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  _applyColorVars() {
    const mode = this.isDark ? 'dark' : 'light';
    const vars = getPaletteVars(this.currentColor, mode, this.customColor);
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  _injectFonts() {
    if (document.getElementById('rs-fonts')) return;
    const link = document.createElement('link');
    link.id = 'rs-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap';
    document.head.appendChild(link);
  }

  _renderShell() {
    const { title, logo } = this.config;
    return `
      <div id="rs-app">
        <header id="rs-topbar">
          <button class="rs-hamburger" id="rs-hamburger" aria-label="Toggle menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <a href="#/" class="rs-logo" id="rs-logo">
            ${logo ? `<img src="${logo}" alt="${title} logo">` : ''}
            <span class="rs-logo-text">${title}</span>
          </a>

          <div class="rs-topbar-spacer"></div>

          <div class="rs-color-picker" id="rs-color-picker">
            <button class="rs-color-trigger" id="rs-color-trigger" aria-label="Choose accent color">
              <span class="rs-color-dot" id="rs-color-dot"></span>
              <span>Color</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="rs-color-dropdown" id="rs-color-dropdown">
              <label>Accent color</label>
              <div class="rs-palette-swatches" id="rs-swatches">
                ${PALETTE_NAMES.map(name => `
                  <button
                    class="rs-swatch${name === this.currentColor && !this.customColor ? ' active' : ''}"
                    data-color="${name}"
                    style="background:${SWATCH_COLORS[name]}"
                    title="${name.charAt(0).toUpperCase() + name.slice(1)}"
                    aria-label="${name}"
                  ></button>
                `).join('')}
              </div>
              <div class="rs-custom-color">
                <label for="rs-custom-hex">Custom</label>
                <input type="color" id="rs-custom-hex" value="${this.customColor || '#6366f1'}" aria-label="Custom accent color">
              </div>
            </div>
          </div>

          <button class="rs-theme-toggle" id="rs-theme-toggle" aria-label="Toggle dark mode">
            <svg class="rs-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg class="rs-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </header>

        <section id="rs-hero" hidden aria-label="Project hero"></section>

        <nav id="rs-sidebar" aria-label="Site navigation">
          <div class="rs-nav-section">
            <div id="rs-nav"></div>
          </div>
        </nav>

        <div id="rs-sidebar-overlay"></div>

        <main id="rs-content">
          <div id="rs-content-inner">
            <div class="rs-loading"><div class="rs-spinner"></div><span>Loading…</span></div>
          </div>
        </main>

        <aside id="rs-toc" aria-label="Table of contents">
          <div id="rs-toc-inner"></div>
        </aside>

        <footer id="rs-footer">
          <span>Powered by <a href="https://github.com/anishhs-gh/restyles" target="_blank" rel="noopener">ReStyles</a> — themes by <a href="https://github.com/anishhs-gh" target="_blank" rel="noopener">anishhs-gh</a></span>
        </footer>
      </div>
    `;
  }

  _initHero() {
    const { hero, title, description } = this.config;
    if (!hero) return;

    const heroTitle = hero.title || title;
    const heroDesc = hero.description ?? description ?? '';

    const githubBtn = hero.githubUrl ? `
      <a href="${hero.githubUrl}" class="rs-btn rs-btn-github" target="_blank" rel="noopener" aria-label="View on GitHub">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
        View on GitHub
      </a>` : '';

    const downloadBtn = hero.downloadUrl ? `
      <a href="${hero.downloadUrl}" class="rs-btn rs-btn-download" aria-label="Download source code">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Download .zip
      </a>` : '';

    const el = document.getElementById('rs-hero');
    if (!el) return;
    el.innerHTML = `
      <div class="rs-hero-inner">
        <h1 class="rs-hero-title">${heroTitle}</h1>
        ${heroDesc ? `<p class="rs-hero-desc">${heroDesc}</p>` : ''}
        ${githubBtn || downloadBtn ? `<div class="rs-hero-btns">${githubBtn}${downloadBtn}</div>` : ''}
      </div>
      <div class="rs-hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z" fill="var(--rs-bg)"/>
        </svg>
      </div>
    `;
  }

  _renderNav(items, currentFile) {
    if (!items.length) return '';
    return items.map(item => {
      if (item.url) {
        return `<a class="rs-nav-item external" href="${item.url}" target="_blank" rel="noopener">${item.label}</a>`;
      }
      const isActive = item.file === currentFile;
      return `<button class="rs-nav-item${isActive ? ' active' : ''}" data-file="${item.file}">${item.label}</button>`;
    }).join('');
  }

  _bindNavItems(currentFile) {
    document.querySelectorAll('.rs-nav-item[data-file]').forEach(btn => {
      btn.addEventListener('click', () => {
        const file = btn.dataset.file;
        window.location.hash = file === this.config.root ? '#/' : '#/' + file.replace(/\.md$/, '');
        this._closeSidebar();
      });
    });
  }

  _bindTopbar() {
    document.getElementById('rs-theme-toggle')?.addEventListener('click', () => this._toggleDark());
  }

  _bindSidebar() {
    const hamburger = document.getElementById('rs-hamburger');
    const overlay   = document.getElementById('rs-sidebar-overlay');
    const sidebar   = document.getElementById('rs-sidebar');
    hamburger?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('open');
    });
    overlay?.addEventListener('click', () => this._closeSidebar());
  }

  _closeSidebar() {
    document.getElementById('rs-sidebar')?.classList.remove('open');
    document.getElementById('rs-sidebar-overlay')?.classList.remove('open');
  }

  _bindColorPicker() {
    const trigger   = document.getElementById('rs-color-trigger');
    const dropdown  = document.getElementById('rs-color-dropdown');
    const customHex = document.getElementById('rs-custom-hex');

    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown?.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#rs-color-picker')) dropdown?.classList.remove('open');
    });

    document.querySelectorAll('.rs-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.customColor = null;
        this.currentColor = swatch.dataset.color;
        document.querySelectorAll('.rs-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        this._applyColorVars();
        this._updateColorDot();
        localStorage.setItem('rs-color', this.currentColor);
        localStorage.removeItem('rs-custom-color');
      });
    });

    customHex?.addEventListener('input', (e) => {
      this.customColor = e.target.value;
      document.querySelectorAll('.rs-swatch').forEach(s => s.classList.remove('active'));
      this._applyColorVars();
      this._updateColorDot();
      localStorage.setItem('rs-custom-color', this.customColor);
    });

    const savedCustom = localStorage.getItem('rs-custom-color');
    const savedColor  = localStorage.getItem('rs-color');
    if (savedCustom) {
      this.customColor = savedCustom;
      if (customHex) customHex.value = savedCustom;
      this._applyColorVars();
    } else if (savedColor && PALETTE_NAMES.includes(savedColor)) {
      this.currentColor = savedColor;
      document.querySelectorAll('.rs-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === savedColor);
      });
      this._applyColorVars();
    }
    this._updateColorDot();
  }

  _updateColorDot() {
    const dot = document.getElementById('rs-color-dot');
    if (dot) dot.style.background = 'var(--rs-primary)';
  }

  _toggleDark() {
    this.isDark = !this.isDark;
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
    localStorage.setItem('rs-theme', this.isDark ? 'dark' : 'light');
    this._applyColorVars();
  }

  _setContent(html) {
    const inner = document.getElementById('rs-content-inner');
    if (inner) inner.innerHTML = html;
  }

  _setToc(items) {
    const container = document.getElementById('rs-toc-inner');
    if (!container) return;
    if (!items.length) { container.innerHTML = ''; return; }

    container.innerHTML = `
      <div class="rs-toc-label">On this page</div>
      <ul class="rs-toc-list">
        ${items.map(item => `
          <li class="rs-toc-item">
            <a class="rs-toc-link rs-toc-depth-${item.level}" href="#${item.slug}">${item.text}</a>
          </li>
        `).join('')}
      </ul>
    `;
  }

  _observeToc() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.rs-toc-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0% -60% 0%', threshold: 0 });

    const content = document.getElementById('rs-content');
    if (!content) return;
    const mo = new MutationObserver(() => {
      content.querySelectorAll('[id].rs-heading').forEach(h => observer.observe(h));
    });
    mo.observe(content, { childList: true, subtree: true });
  }
}
