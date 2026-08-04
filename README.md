# Workofo — Wix-managed headless SaaS marketing site

Astro + React frontend hosted on **Wix**, content in **Wix CMS**, blog via **Wix Blog**, leads via **Wix Forms**. Dashboard edits appear on the live site without a code redeploy (SSR).

## Locales

| URL segment | Language |
|-------------|----------|
| `lt` (default) | Lithuanian — `/` redirects here |
| `en` | English |
| `se` | Swedish (`lang="sv"`) |

All pages live under `/[lang]/…`. Language switcher is in the header. Localization is **CMS `language` fields**, not `@wix/essentials` translation keys — so new Swedish paragraphs = new CMS sections (Feature 4).

## CMS collections

### `Pages`

| Field | Type | Notes |
|-------|------|--------|
| `title` | Text | Page title |
| `slug` | Text | Same across languages (`home`, `pricing`, `about`, …) |
| `language` | Text | `lt` \| `en` \| `se` |

One item per page **per language**.

### `Sections`

| Field | Type | Notes |
|-------|------|--------|
| `page` | Reference → Pages | Parent page |
| `order` | Number | Ascending render order |
| `type` | Text | `hero` \| `textImage` \| `richText` \| `featureGrid` \| `pricing` \| `testimonial` \| `cta` \| `demoForm` |
| `heading` | Text | |
| `subheading` | Text | |
| `body` | Rich text | |
| `image` | Image | Optional; themed block if empty |
| `ctaLabel` | Text | |
| `ctaUrl` | Text | |
| `items` | Text | JSON array for `featureGrid` / `pricing` |

Permissions: **read = Anyone** (required for visitor SSR).

### Seeded content

- **lt + en:** `home` (hero → featureGrid → testimonial → cta), `pricing` (hero → pricing → demoForm), `about` (hero → textImage → richText)
- **se:** `home` only, plus an extra `richText` section that does **not** exist on LT/EN (Feature 4)

## Config

| Variable | Purpose |
|----------|---------|
| `PUBLIC_WIX_DEMO_FORM_ID` | Wix Forms schema id for Book a Demo (seeded as `59bbe7d1-bc2b-4575-9091-109371c66216`) |

Set locally in `.env.local`, or:

```bash
npx @wix/cli@latest env set --key=PUBLIC_WIX_DEMO_FORM_ID --value=<form-id>
```

Email notifications for form submissions are configured in the **Wix dashboard → Automations** — not in this repo.

## The 5 features (dashboard → live)

| # | Capability | Dashboard action |
|---|------------|------------------|
| 1 | Edit text & images | Edit a `Sections` heading/image → publish/save → refresh live page (SSR) |
| 2 | Blog | Wix Blog app → write/publish a post → appears at `/[lang]/blog` |
| 3 | New sections & pages | Add a `Sections` row (any known `type`) to an existing page, or create a new `Pages` item + sections (e.g. `careers`) |
| 4 | Swedish + new paragraphs | Create `Pages` with `language=se` and add a `richText` section; missing languages show “Not translated yet” with a link to `/lt/...` |
| 5 | Book a Demo → email | Submit the form → **Forms & Submissions** in the dashboard; wire Automations for email |

## Develop

```bash
# Node ≥ 20.11
npx @wix/cli@latest login   # if needed
npm install --ignore-scripts
npm run dev                 # → wix dev
```

## Build & release (Wix hosting)

```bash
npm run build               # → wix build
npm run release             # → wix release (publishes frontend to Wix)
```

Backend CMS/Blog/Forms content is fetched at runtime — re-release only when **frontend** code changes.

## Project notes

- Managed Astro: no OAuth client in app code (`@wix/astro` auto-auth).
- Site id / app id: see `wix.config.json`.
- Seed script (one-shot, already applied): `node scripts/seed.mjs` (needs a CLI site token).
