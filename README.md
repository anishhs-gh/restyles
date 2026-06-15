# ReStyles

Modern, beautiful themes for GitHub Pages — no Jekyll required.

Drop a single config file into your repo and get a fully-featured documentation site:

- **Markdown rendering** — your `README.md` becomes the home page
- **Sidebar navigation** — link any `.md` file, organized automatically
- **6 accent colors** — Indigo, Violet, Emerald, Rose, Amber, Sky — plus custom hex
- **Dark / Light mode** — auto-detects system preference, user-toggleable
- **Syntax highlighting** — 190+ languages, One Light / One Dark Pro colors, copy button
- **Auto-generated TOC** — from your `##` and `###` headings
- **Hero section** — optional landing banner with GitHub and Download buttons

## Quick Start

**1. Add a config file** to your repo root:

```json
{
  "theme": "lumina",
  "title": "My Project",
  "description": "Documentation for my project",
  "color": "indigo",
  "darkMode": "auto",
  "root": "README.md",
  "nav": [
    { "label": "Home",  "file": "README.md" },
    { "label": "Guide", "file": "docs/guide.md" },
    { "label": "GitHub", "url": "https://github.com/yourname/repo" }
  ]
}
```

**2. Add a GitHub Actions workflow** at `.github/workflows/docs.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  docs:
    uses: anishhs-gh/restyles/.github/workflows/deploy.yml@main
    permissions:
      contents: read
      pages: write
      id-token: write
```

**3. Enable GitHub Pages** in your repo settings — set source to **GitHub Actions**.

Push to `main`. Your docs are live.

## How It Works

ReStyles is a CLI + client-side engine:

1. The GitHub Actions workflow runs `npx @anishhs/restyles@latest build` in your repo
2. The CLI reads your `restyles.config.json`, bundles everything into `_site/`
3. `_site/` is uploaded as a Pages artifact and deployed directly — no extra branch
4. The deployed site is self-contained — no external dependencies

You never commit `_site/` or `index.html`. ReStyles generates both.

## Docs

- [Getting Started](docs/getting-started.md) — full setup walkthrough
- [Configuration](docs/configuration.md) — all config options
- [Themes](docs/themes.md) — Lumina details and roadmap

## License

MIT © [anishhs-gh](https://github.com/anishhs-gh)
