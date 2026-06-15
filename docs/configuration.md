# Configuration

All ReStyles settings live in `restyles.config.json` at your repo root.

## Full reference

```json
{
  "theme": "lumina",
  "title": "My Project",
  "description": "Documentation for my project",
  "logo": "public/logo.png",
  "favicon": "public/favicon.png",
  "color": "indigo",
  "darkMode": "auto",
  "root": "README.md",
  "nav": [
    { "label": "Home",   "file": "README.md" },
    { "label": "Guide",  "file": "docs/guide.md" },
    { "label": "GitHub", "url": "https://github.com/yourname/repo" }
  ],
  "customColor": {
    "primary": "#7c3aed"
  },
  "hero": {
    "title": "My Project",
    "description": "A short, punchy description.",
    "githubUrl": "https://github.com/yourname/repo",
    "downloadUrl": "https://github.com/yourname/repo/archive/refs/heads/main.zip"
  }
}
```

## Options

### `theme`
**Type:** `string` | **Default:** `"lumina"`

The theme to use. Currently available: `lumina`.

---

### `title`
**Type:** `string` | **Default:** `"ReStyles Docs"`

Your project name. Shown in the topbar and browser tab title.

---

### `description`
**Type:** `string` | **Default:** `""`

A short description used in the `<meta name="description">` tag.

---

### `logo`
**Type:** `string` | **Default:** `null`

Path to a logo image relative to your repo root. Shown next to the title in the topbar. Recommended size: 28×28px or smaller.

---

### `favicon`
**Type:** `string` | **Default:** `null`

Path to a favicon file relative to your repo root. Supports `.ico`, `.png`, `.svg`, and `.webp`. ReStyles sets the correct MIME type automatically.

```json
"favicon": "public/favicon.png"
```

---

### `color`
**Type:** `string` | **Default:** `"indigo"`

The default accent color palette. One of: `indigo`, `violet`, `emerald`, `rose`, `amber`, `sky`.

Users can change this from the topbar color picker — their choice is saved in `localStorage`.

---

### `darkMode`
**Type:** `"auto" | "light" | "dark"` | **Default:** `"auto"`

- `"auto"` — follows the user's OS preference (`prefers-color-scheme`)
- `"light"` — always starts in light mode
- `"dark"` — always starts in dark mode

The user's manual toggle overrides this and is saved in `localStorage`.

---

### `root`
**Type:** `string` | **Default:** `"README.md"`

The markdown file shown at `#/`. This is your home page.

---

### `nav`
**Type:** `Array` | **Default:** `[]`

Sidebar navigation items. Two shapes:

**Internal page** — navigates within the site:
```json
{ "label": "Guide", "file": "docs/guide.md" }
```

**External link** — opens in a new tab:
```json
{ "label": "GitHub", "url": "https://github.com/yourname/repo" }
```

---

### `customColor`
**Type:** `object` | **Default:** `null`

Override the accent color with any hex value. Takes precedence over `color`.

```json
"customColor": { "primary": "#e11d48" }
```

ReStyles auto-derives hover and soft variants from your custom primary.

---

### `hero`
**Type:** `object` | **Default:** `null`

Adds a full-width landing banner above the content on the root page only. All sub-fields are optional.

```json
"hero": {
  "title": "My Project",
  "description": "One-line pitch for your project.",
  "githubUrl": "https://github.com/yourname/repo",
  "downloadUrl": "https://github.com/yourname/repo/archive/refs/heads/main.zip"
}
```

| Field | Description |
|-------|-------------|
| `title` | Hero heading. Falls back to `config.title` if omitted. |
| `description` | Subheading text. Falls back to `config.description` if omitted. |
| `githubUrl` | Shows a "View on GitHub" button. Omit to hide the button. |
| `downloadUrl` | Shows a "Download .zip" button. Omit to hide the button. |

The first `# Heading` in your root markdown file is hidden automatically when a hero is shown, to avoid duplication.
