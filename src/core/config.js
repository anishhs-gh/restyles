const DEFAULTS = {
  theme: 'lumina',
  title: 'ReStyles Docs',
  description: '',
  logo: null,
  favicon: null, // path to favicon file (any format: .ico, .png, .svg)
  root: 'README.md',
  color: 'indigo',
  darkMode: 'auto', // 'auto' | 'light' | 'dark'
  nav: [],
  customColor: null,
  hero: null, // { title?, description?, githubUrl?, downloadUrl? }
};

export async function loadConfig() {
  try {
    const res = await fetch('./restyles.config.json');
    if (!res.ok) throw new Error('No config found');
    const userConfig = await res.json();
    return { ...DEFAULTS, ...userConfig };
  } catch {
    console.warn('[ReStyles] restyles.config.json not found, using defaults.');
    return { ...DEFAULTS };
  }
}
