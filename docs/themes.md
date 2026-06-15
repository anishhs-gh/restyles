# Themes

ReStyles is designed to be extensible. Each theme is a self-contained bundle — layout, styles, and interactivity compiled into a single JavaScript file.

## Available themes

### Lumina *(current)*

A clean, modern documentation theme inspired by the best doc sites on the web.

**Layout:** Three-column — sidebar navigation + content area + in-page TOC

**Features:**
- Sticky topbar with color picker and dark/light toggle
- Collapsible sidebar on mobile with smooth overlay
- Syntax-highlighted code blocks (One Light / One Dark Pro) with copy button
- Auto-generated TOC with active-section scroll tracking
- Hero section for the root page
- Hash-based routing with compound anchor support (`#/page~section`)
- Responsive from 320px to 4K

**Best for:** Libraries, CLIs, APIs, and any project that needs well-structured documentation.

## Color palettes

Every theme ships with 6 built-in palettes, each tuned separately for light and dark mode. Users can also enter any custom hex color from the topbar picker.

| Palette | Light | Dark |
|---------|-------|------|
| Indigo  | `#6366f1` | `#818cf8` |
| Violet  | `#8b5cf6` | `#a78bfa` |
| Emerald | `#10b981` | `#34d399` |
| Rose    | `#f43f5e` | `#fb7185` |
| Amber   | `#f59e0b` | `#fbbf24` |
| Sky     | `#0ea5e9` | `#38bdf8` |

Color and dark/light preferences are saved in `localStorage` under `rs-color`, `rs-custom-color`, and `rs-theme`.

## Roadmap

Themes planned for future releases:

- **Nebula** — single-page landing + docs hybrid, great for libraries with a marketing angle
- **Canvas** — blog/journal layout with post list and reading progress bar
- **Studio** — portfolio/showcase theme for creative projects

## Building a theme

A ReStyles theme exports a class with this interface:

```js
export class MyTheme {
  constructor(config) {}        // set up initial state from config
  mount()                       // render shell HTML into document.body
  setNav(navItems, currentFile) // update sidebar with active state
  setLoading()                  // show spinner in the content area
  setPage(html, toc, title, isRoot) // render markdown + TOC
  setError(message)             // show error state
}
```

ReStyles core handles config loading, routing, and markdown fetching. Your theme only handles presentation. See `src/themes/lumina/` for a reference implementation.
