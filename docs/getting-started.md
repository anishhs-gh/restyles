# Getting Started

Get a beautiful docs site live in under 5 minutes.

## Prerequisites

- A GitHub repository with some markdown files (even just a `README.md`)
- GitHub Pages enabled on your repo

## Step 1 — Add a config file

Create `restyles.config.json` at your repo root:

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

That's the only file you need to add. No `index.html`, no build tool setup in your repo.

## Step 2 — Add the GitHub Actions workflow

Create `.github/workflows/docs.yml`:

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

This calls ReStyles' reusable workflow, which:
1. Runs `npx @anishhs/restyles@latest build` — reads your config and generates `_site/`
2. Uploads `_site/` as a Pages artifact and deploys it directly — no extra branch needed

## Step 3 — Enable GitHub Pages

In your repo go to **Settings → Pages** and set **Source** to **GitHub Actions**.

That's the only setting you need to change. No branch to create, no folder to pick.

## Your repo structure

You don't need any special file layout. Just reference your markdown files in `nav`:

```
my-project/
├── restyles.config.json     ← the only ReStyles file you add
├── .github/
│   └── workflows/
│       └── docs.yml         ← calls the ReStyles workflow
├── README.md                ← becomes your home page
└── docs/
    ├── guide.md
    └── api.md
```

ReStyles copies all files referenced in your config into `_site/` at build time. You never commit `_site/` yourself.

## Navigation and URLs

ReStyles uses hash-based routing so it works on GitHub Pages without any server configuration:

| URL | Renders |
|-----|---------|
| `yoursite.com/#/` | `README.md` (root) |
| `yoursite.com/#/docs/guide` | `docs/guide.md` |
| `yoursite.com/#/docs/guide~section-slug` | `docs/guide.md` scrolled to that heading |

Clicking sidebar links and in-page anchor links updates the hash automatically. The full URL (including section) survives page reload.

## Adding a hero section

Add a `hero` block to your config to show a landing banner on the home page:

```json
"hero": {
  "title": "My Project",
  "description": "A short, punchy description of what your project does.",
  "githubUrl": "https://github.com/yourname/repo",
  "downloadUrl": "https://github.com/yourname/repo/archive/refs/heads/main.zip"
}
```

The hero appears only on the root page. The `downloadUrl` is optional.

## Using the composite action instead

If you need more control over your workflow steps, use the composite action directly:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: anishhs-gh/restyles@v1
```
