# Workofo — Wix-managed headless SaaS marketing site

Astro + React frontend hosted on **Wix**, content in **Wix CMS** (`SitePages` / `SiteSections`), blog via **Wix Blog**, leads via **Wix Forms**. Dashboard edits appear on the live site without a code redeploy (SSR).

Design system: [`design.md`](design.md) (Aura AI System) applied as CSS on the existing Wix/Astro stack — no Tailwind rewrite. Legacy test collections `Pages` / `Sections` are unused.

## Locales

| URL segment | Language |
|-------------|----------|
| `en` (default) | English — `/` redirects here |
| `en` | English |
| `se` | Swedish (`lang="sv"`) |

All pages live under `/[lang]/…`. Localization is **CMS `language` fields**, not translation-key files.

## CMS collections (redesign)

### `SitePages`

| Field | Type | Notes |
|-------|------|--------|
| `title` | Text | Page / document title |
| `slug` | Text | Shared across languages (`home`, `get-in-touch`, `jobs`, …) |
| `language` | Text | `lt` \| `en` \| `se` |
| `navLabel` | Text | Optional nav label |
| `navOrder` | Number | Nav sort (home excluded from nav links) |

### `SiteSections`

| Field | Type | Notes |
|-------|------|--------|
| `page` | Reference → SitePages | Parent page |
| `order` | Number | Ascending render order |
| `type` | Text | See section types below |
| `heading` / `subheading` | Text | |
| `body` | Rich text | |
| `image` | Image | Optional |
| `ctaLabel` / `ctaUrl` | Text | |
| `items` | Text | JSON array (shape depends on `type`) |

**Section types:** `hero` · `logoStrip` · `problem` · `steps` · `benefits` · `testimonial` · `caseStudies` · `demoForm` · `richText` · `jobList`

Permissions: **read = Anyone**.

### Seeded content (from workofo.com)

- **en + lt:** `home` (full marketing stack), `get-in-touch` (hero + demo form), `jobs` (hero + job list)
- **se:** not seeded yet → “Not translated yet” for missing slugs
- Blog posts remain in **Wix Blog** (previously migrated)

Legacy `Pages` / `Sections` are abandoned — do not edit them for the live site.

## Config

| Variable | Purpose |
|----------|---------|
| `PUBLIC_WIX_DEMO_FORM_ID` | Wix Forms schema id for Book a Demo |

```bash
npx @wix/cli@latest env set --key=PUBLIC_WIX_DEMO_FORM_ID --value=<form-id>
```

Email notifications: **Wix dashboard → Automations** (not in this repo).

## Develop

```bash
npx @wix/cli@latest login
npm install --ignore-scripts
# optional re-seed CMS + form:
node scripts/seed.mjs
# copy form id into .env.local as PUBLIC_WIX_DEMO_FORM_ID
npm run dev
```

Always use `npm install --ignore-scripts` (sharp unused).

## Build & release

```bash
npx @wix/cli@latest build
CI=1 npx @wix/cli@latest release
```

Re-release only when **frontend** code changes; CMS/Blog/Forms are runtime.

## Project notes

- Managed Astro: no OAuth client in app code (`@wix/astro` auto-auth).
- Site / app ids: `wix.config.json`.
- Seed: `node scripts/seed.mjs` (CLI login required).
