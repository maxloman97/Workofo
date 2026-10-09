#!/usr/bin/env node
/**
 * One-shot: insert Swedish (language=se) SitePages + SiteSections mirroring EN home.
 * Idempotent — exits if any se pages already exist. Does not wipe other locales.
 *
 * Usage: node scripts/seed-se-pages.cjs
 */
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { execSync } = require('node:child_process');

const ROOT = join(__dirname, '..');
const SITE_ID =
  process.env.SITE_ID || JSON.parse(readFileSync(join(ROOT, 'wix.config.json'), 'utf8')).siteId;

function mintToken() {
  if (process.env.TOKEN) return process.env.TOKEN.trim();
  return execSync(`npx @wix/cli@latest token --site ${SITE_ID}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

const TOKEN = mintToken();

async function wix(method, path, body) {
  const res = await fetch(`https://www.wixapis.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'wix-site-id': SITE_ID,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 800)}`);
  return json;
}

async function main() {
  const existing = await wix('POST', '/wix-data/v2/items/query', {
    dataCollectionId: 'SitePages',
    query: { filter: { language: { $eq: 'se' } }, paging: { limit: 20 } },
  });
  if ((existing.dataItems || []).length > 0) {
    console.log('SE pages already exist — skipping insert.');
    for (const x of existing.dataItems) {
      console.log(`  ${x.data.language}:${x.data.slug} ${x.id}`);
    }
    return;
  }

  // Pull EN logo strip items for the SE mirror.
  const enPages = await wix('POST', '/wix-data/v2/items/query', {
    dataCollectionId: 'SitePages',
    query: { filter: { language: { $eq: 'en' }, slug: { $eq: 'home' } }, paging: { limit: 1 } },
  });
  const enHomeId = enPages.dataItems?.[0]?.id;
  let logos =
    '[{"name":"Telenordi","image":"/clients/telenordi.png?v=2"},{"name":"Senukai","image":"/clients/senukai.png?v=2"},{"name":"Barbora","image":"/clients/barbora.png?v=2"},{"name":"Tele2","image":"/clients/tele2.png?v=2"},{"name":"Planas Chuliganas","image":"/clients/planas-chuliganas.png?v=2"}]';
  if (enHomeId) {
    const secs = await wix('POST', '/wix-data/v2/items/query', {
      dataCollectionId: 'SiteSections',
      query: {
        filter: { page: { $eq: enHomeId }, type: { $eq: 'logoStrip' } },
        paging: { limit: 1 },
      },
    });
    const items = secs.dataItems?.[0]?.data?.items;
    if (typeof items === 'string' && items.length) logos = items;
  }

  const pageDefs = [
    {
      title: 'Workofo | AI workforce scheduling',
      slug: 'home',
      language: 'se',
      navLabel: 'Hem',
      navOrder: 0,
    },
    { title: 'Jobb', slug: 'jobs', language: 'se', navLabel: 'Jobb', navOrder: 1 },
    {
      title: 'Boka en demo',
      slug: 'get-in-touch',
      language: 'se',
      navLabel: 'Kontakt',
      navOrder: 2,
    },
  ];

  const pagesInsert = await wix('POST', '/wix-data/v2/bulk/items/insert', {
    dataCollectionId: 'SitePages',
    dataItems: pageDefs.map((d) => ({ data: d })),
    returnEntity: true,
  });

  const pageIdBySlug = {};
  for (const r of pagesInsert.results || []) {
    const item = r.dataItem;
    if (!item?.data) continue;
    pageIdBySlug[item.data.slug] = item.id;
    console.log('inserted page', item.data.slug, item.id);
  }

  function section(slug, order, type, fields) {
    return {
      data: {
        page: pageIdBySlug[slug],
        order,
        type,
        heading: fields.heading || '',
        subheading: fields.subheading || '',
        body: fields.body || '',
        ctaLabel: fields.ctaLabel || '',
        ctaUrl: fields.ctaUrl || '',
        items: fields.items || '',
      },
    };
  }

  const sections = [
    section('home', 1, 'hero', {
      heading: 'AI-powered employee scheduling software built around real demand',
      subheading:
        'Forecast demand, apply real-world labor rules and automatically create optimized schedules around when and where work actually happens.',
      ctaLabel: 'Boka en demo',
      ctaUrl: '/se/get-in-touch',
    }),
    section('home', 2, 'logoStrip', {
      heading: 'Some of our clients',
      subheading:
        'Trusted by teams across Europe to improve coverage, productivity, and schedule quality with AI.',
      items: logos,
    }),
    section('home', 3, 'problem', {
      heading: 'Work and schedules rarely match',
      subheading:
        'When demand fluctuates and rules are complex, manual planning becomes costly and unreliable.',
    }),
    section('home', 4, 'steps', {
      heading: 'How Workofo works',
      subheading: 'From demand forecasting to compliant schedules in four simple steps.',
    }),
    section('home', 5, 'benefits', {
      heading: 'Why teams choose Workofo',
      subheading:
        'Experience fairness in scheduling, increased employee satisfaction, exceptional service for your customers, and operational excellence unlike any other.',
    }),
    section('home', 6, 'testimonial', {
      ctaLabel: 'What our customers say',
      heading:
        'We have been using Workofo for more than two years for teams serving large customers, and for planning and managing blended traffic. Our experience is top notch. The provider is flexible, the product is reliable, easy to use, and is being regularly updated.',
      subheading: 'Dovydas Braukyla, CEO, Planas Chuliganas, telemarketing / call center provider',
    }),
    section('home', 7, 'demoForm', {
      heading: 'See how much workforce capacity you can unlock',
      subheading:
        'See how AI-driven scheduling improves coverage and productivity in your operations.',
    }),
    section('get-in-touch', 1, 'hero', {
      heading: 'See how much you can save with Workofo',
      subheading:
        'AI-powered workforce planning with 15-minute accuracy and built-in compliance. Typical savings: 5–15% of scheduled hours.',
    }),
    section('get-in-touch', 2, 'demoForm', {
      heading: 'Boka en demo',
      subheading: 'Tell us a bit about your operation and we’ll tailor the demo for you.',
    }),
    section('jobs', 1, 'hero', {
      heading: 'Join our team',
      subheading:
        'Explore opportunities to join an innovative team passionate about revolutionizing how businesses manage their workforce.',
    }),
    section('jobs', 2, 'jobList', {
      heading: 'Open roles',
    }),
  ];

  const secInsert = await wix('POST', '/wix-data/v2/bulk/items/insert', {
    dataCollectionId: 'SiteSections',
    dataItems: sections,
    returnEntity: true,
  });
  console.log('inserted sections:', (secInsert.results || []).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
