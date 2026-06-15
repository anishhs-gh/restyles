// Each palette defines CSS custom property values for light and dark modes.
export const PALETTES = {
  indigo: {
    light: {
      '--rs-primary':        '#6366f1',
      '--rs-primary-hover':  '#4f46e5',
      '--rs-primary-soft':   '#e0e7ff',
      '--rs-primary-text':   '#3730a3',
    },
    dark: {
      '--rs-primary':        '#818cf8',
      '--rs-primary-hover':  '#6366f1',
      '--rs-primary-soft':   '#1e1b4b',
      '--rs-primary-text':   '#a5b4fc',
    },
  },
  violet: {
    light: {
      '--rs-primary':        '#8b5cf6',
      '--rs-primary-hover':  '#7c3aed',
      '--rs-primary-soft':   '#ede9fe',
      '--rs-primary-text':   '#5b21b6',
    },
    dark: {
      '--rs-primary':        '#a78bfa',
      '--rs-primary-hover':  '#8b5cf6',
      '--rs-primary-soft':   '#2e1065',
      '--rs-primary-text':   '#c4b5fd',
    },
  },
  emerald: {
    light: {
      '--rs-primary':        '#10b981',
      '--rs-primary-hover':  '#059669',
      '--rs-primary-soft':   '#d1fae5',
      '--rs-primary-text':   '#065f46',
    },
    dark: {
      '--rs-primary':        '#34d399',
      '--rs-primary-hover':  '#10b981',
      '--rs-primary-soft':   '#022c22',
      '--rs-primary-text':   '#6ee7b7',
    },
  },
  rose: {
    light: {
      '--rs-primary':        '#f43f5e',
      '--rs-primary-hover':  '#e11d48',
      '--rs-primary-soft':   '#ffe4e6',
      '--rs-primary-text':   '#9f1239',
    },
    dark: {
      '--rs-primary':        '#fb7185',
      '--rs-primary-hover':  '#f43f5e',
      '--rs-primary-soft':   '#4c0519',
      '--rs-primary-text':   '#fda4af',
    },
  },
  amber: {
    light: {
      '--rs-primary':        '#f59e0b',
      '--rs-primary-hover':  '#d97706',
      '--rs-primary-soft':   '#fef3c7',
      '--rs-primary-text':   '#92400e',
    },
    dark: {
      '--rs-primary':        '#fbbf24',
      '--rs-primary-hover':  '#f59e0b',
      '--rs-primary-soft':   '#451a03',
      '--rs-primary-text':   '#fcd34d',
    },
  },
  sky: {
    light: {
      '--rs-primary':        '#0ea5e9',
      '--rs-primary-hover':  '#0284c7',
      '--rs-primary-soft':   '#e0f2fe',
      '--rs-primary-text':   '#075985',
    },
    dark: {
      '--rs-primary':        '#38bdf8',
      '--rs-primary-hover':  '#0ea5e9',
      '--rs-primary-soft':   '#082f49',
      '--rs-primary-text':   '#7dd3fc',
    },
  },
};

export const PALETTE_NAMES = Object.keys(PALETTES);

export function getPaletteVars(colorName, mode, customColor) {
  if (customColor) {
    return buildCustomVars(customColor, mode);
  }
  const palette = PALETTES[colorName] || PALETTES.indigo;
  return palette[mode] || palette.light;
}

// Naive custom color: derive hover/soft from the hex
function buildCustomVars(hex, mode) {
  const darkened = darkenHex(hex, 0.15);
  const softened = mode === 'dark' ? darkenHex(hex, 0.7) : lightenHex(hex, 0.8);
  return {
    '--rs-primary':       hex,
    '--rs-primary-hover': darkened,
    '--rs-primary-soft':  softened,
    '--rs-primary-text':  mode === 'dark' ? lightenHex(hex, 0.4) : darkenHex(hex, 0.3),
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function darkenHex(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function lightenHex(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}
