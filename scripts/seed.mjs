#!/usr/bin/env node
/**
 * Seed Workofo redesign CMS: SitePages / SiteSections from workofo.com copy,
 * plus Book a Demo form aligned with get-in-touch fields.
 * Does NOT write to legacy Pages / Sections collections.
 *
 * Usage (from project root, after `npx @wix/cli@latest login`):
 *   node scripts/seed.mjs
 * Or with explicit token:
 *   TOKEN=… SITE_ID=… node scripts/seed.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE_ID =
  process.env.SITE_ID || JSON.parse(readFileSync(join(ROOT, 'wix.config.json'), 'utf8')).siteId;

function mintToken() {
  if (process.env.TOKEN) return process.env.TOKEN.trim();
  console.log('Minting site token via Wix CLI…');
  return execSync(`npx @wix/cli@latest token --site ${SITE_ID}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

const TOKEN = mintToken();
const TMP = join(ROOT, '.tmp');
if (!existsSync(TMP)) mkdirSync(TMP, { recursive: true });

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
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 1000)}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function withRetry(fn, label) {
  try {
    return await fn();
  } catch (e) {
    if (e.status === 403 || e.status === 400 || e.status >= 500) {
      console.warn(`Retry once for ${label}: ${e.message.slice(0, 200)}`);
      await new Promise((r) => setTimeout(r, 2500));
      return await fn();
    }
    throw e;
  }
}

const PERMS = { insert: 'ADMIN', update: 'ADMIN', remove: 'ADMIN', read: 'ANYONE' };
const SITE_PAGES = 'SitePages';
const SITE_SECTIONS = 'SiteSections';

// ─── Collections ────────────────────────────────────────────────────────────
console.log(`Creating ${SITE_PAGES}…`);
try {
  await withRetry(
    () =>
      wix('POST', '/wix-data/v2/collections', {
        collection: {
          id: SITE_PAGES,
          displayName: 'Site Pages',
          fields: [
            { key: 'title', displayName: 'Title', type: 'TEXT' },
            { key: 'slug', displayName: 'Slug', type: 'TEXT' },
            { key: 'language', displayName: 'Language', type: 'TEXT' },
            { key: 'navLabel', displayName: 'Nav Label', type: 'TEXT' },
            { key: 'navOrder', displayName: 'Nav Order', type: 'NUMBER' },
          ],
          permissions: PERMS,
        },
      }),
    SITE_PAGES,
  );
} catch (e) {
  if (!/already exists|WDE0117|409/i.test(e.message)) throw e;
  console.log(`${SITE_PAGES} already exists — continuing`);
}

console.log(`Creating ${SITE_SECTIONS}…`);
try {
  await withRetry(
    () =>
      wix('POST', '/wix-data/v2/collections', {
        collection: {
          id: SITE_SECTIONS,
          displayName: 'Site Sections',
          fields: [
            {
              key: 'page',
              displayName: 'Page',
              type: 'REFERENCE',
              typeMetadata: { reference: { referencedCollectionId: SITE_PAGES } },
            },
            { key: 'order', displayName: 'Order', type: 'NUMBER' },
            { key: 'type', displayName: 'Type', type: 'TEXT' },
            { key: 'heading', displayName: 'Heading', type: 'TEXT' },
            { key: 'subheading', displayName: 'Subheading', type: 'TEXT' },
            { key: 'body', displayName: 'Body', type: 'RICH_TEXT' },
            { key: 'image', displayName: 'Image', type: 'IMAGE' },
            { key: 'ctaLabel', displayName: 'CTA Label', type: 'TEXT' },
            { key: 'ctaUrl', displayName: 'CTA URL', type: 'TEXT' },
            { key: 'items', displayName: 'Items', type: 'TEXT' },
          ],
          permissions: PERMS,
        },
      }),
    SITE_SECTIONS,
  );
} catch (e) {
  if (!/already exists|WDE0117|409/i.test(e.message)) throw e;
  console.log(`${SITE_SECTIONS} already exists — continuing`);
}

// Clear existing redesign content (idempotent re-seed)
console.log('Clearing previous SitePages / SiteSections items…');
for (const col of [SITE_SECTIONS, SITE_PAGES]) {
  const q = await wix('POST', '/wix-data/v2/items/query', {
    dataCollectionId: col,
    query: { paging: { limit: 200 } },
  });
  const ids = (q.dataItems || []).map((d) => d.id).filter(Boolean);
  if (ids.length) {
    await wix('POST', '/wix-data/v2/bulk/items/remove', {
      dataCollectionId: col,
      dataItemIds: ids,
    });
    console.log(`Removed ${ids.length} from ${col}`);
  }
}

const pageDefs = [
  // EN
  {
    title: 'Employee Scheduling Software | AI Workforce Optimization | Workofo',
    slug: 'home',
    language: 'en',
    navLabel: 'Home',
    navOrder: 0,
  },
  { title: 'Book a Demo', slug: 'get-in-touch', language: 'en', navLabel: 'Contact', navOrder: 2 },
  { title: 'Jobs', slug: 'jobs', language: 'en', navLabel: 'Jobs', navOrder: 1 },
  // LT
  { title: 'Workofo — AI darbo jėgos planavimas', slug: 'home', language: 'lt', navLabel: 'Pradžia', navOrder: 0 },
  { title: 'Užsisakyti demo', slug: 'get-in-touch', language: 'lt', navLabel: 'Kontaktai', navOrder: 2 },
  { title: 'Karjera', slug: 'jobs', language: 'lt', navLabel: 'Karjera', navOrder: 1 },
  // SE (URL segment; html lang is sv). Modern home stack mirrors EN in code.
  { title: 'Workofo | AI workforce scheduling', slug: 'home', language: 'se', navLabel: 'Hem', navOrder: 0 },
  { title: 'Boka en demo', slug: 'get-in-touch', language: 'se', navLabel: 'Kontakt', navOrder: 2 },
  { title: 'Jobb', slug: 'jobs', language: 'se', navLabel: 'Jobb', navOrder: 1 },
];

console.log('Inserting SitePages…');
const pagesInsert = await withRetry(
  () =>
    wix('POST', '/wix-data/v2/bulk/items/insert', {
      dataCollectionId: SITE_PAGES,
      dataItems: pageDefs.map((d) => ({ data: d })),
      returnEntity: true,
    }),
  'SitePages insert',
);

const pageIdByKey = {};
for (const r of pagesInsert.results || []) {
  const item = r.dataItem;
  if (!item?.data) continue;
  pageIdByKey[`${item.data.language}:${item.data.slug}`] = item.id;
}
console.log('Page IDs:', pageIdByKey);

function section(lang, slug, order, type, fields) {
  const pageId = pageIdByKey[`${lang}:${slug}`];
  if (!pageId) throw new Error(`Missing page ${lang}:${slug}`);
  return {
    data: {
      page: pageId,
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

const logosEn = JSON.stringify([
  { name: 'Telenordi', image: '/clients/telenordi.png?v=2' },
  { name: 'Senukai', image: '/clients/senukai.png?v=2' },
  { name: 'Barbora', image: '/clients/barbora.png?v=2' },
  { name: 'Tele2', image: '/clients/tele2.png?v=2' },
  { name: 'Planas Chuliganas', image: '/clients/planas-chuliganas.png?v=2' },
]);
const logosLt = JSON.stringify([
  { name: 'Telenordi', image: '/clients/telenordi.png?v=2' },
  { name: 'Senukai', image: '/clients/senukai.png?v=2' },
  { name: 'Barbora', image: '/clients/barbora.png?v=2' },
  { name: 'Tele2', image: '/clients/tele2.png?v=2' },
  { name: 'Planas Chuliganas', image: '/clients/planas-chuliganas.png?v=2' },
]);

const problemEn = JSON.stringify([
  {
    title: 'Static schedules',
    body: 'Fixed shifts don’t follow reality. Workload and demand change daily. Schedules usually don’t.',
    image: '/problem/static-schedules.png?v=2',
  },
  {
    title: 'Rules are too complex to manage manually',
    body: 'Labor law, union agreements, shift edges, skill mixes, locations, and patterns are hard to optimize by hand.',
    image: '/problem/complex-rules.png?v=2',
  },
  {
    title: 'Paying for mismatch',
    body: 'Overstaffing wastes budget. Understaffing hurts service levels and increases burnout.',
    image: '/problem/mismatch.png?v=2',
  },
]);
const problemLt = JSON.stringify([
  {
    title: 'Statiniai grafikai',
    body: 'Fiksuotos pamainos neatitinka realybės. Darbo krūvis keičiasi kasdien — grafikai dažnai ne.',
    image: '/problem/static-schedules.png?v=2',
  },
  {
    title: 'Taisyklės per sudėtingos rankiniu būdu',
    body: 'Darbo teisė, sutartys, įgūdžiai, vietos ir modeliai sunkiai optimizuojami be AI.',
    image: '/problem/complex-rules.png?v=2',
  },
  {
    title: 'Mokate už neatitikimą',
    body: 'Perteklinis personalas švaisto biudžetą. Trūkumas kenkia aptarnavimui ir didina perdegimą.',
    image: '/problem/mismatch.png?v=2',
  },
]);

const stepsEn = JSON.stringify([
  {
    title: 'Forecast demand or workload with AI',
    body: 'Sales, volume, tasks, or service targets: whatever defines work in your business.',
  },
  {
    title: 'Include real-world constraints',
    body: 'Labor law, union agreements, contracts, skills, locations, rules, availability and internal policies are enforced automatically.',
  },
  {
    title: 'Optimize schedules automatically',
    body: 'The system creates flexible, demand-driven shifts, not fixed templates.',
  },
  {
    title: 'Adjust fast when things change',
    body: 'Replan quickly without rebuilding schedules from scratch, always staying in control.',
  },
]);
const stepsLt = JSON.stringify([
  {
    title: 'Prognozuokite paklausą ar darbo krūvį su AI',
    body: 'Pardavimai, apimtys, užduotys ar aptarnavimo tikslai — kas apibrėžia darbą jūsų versle.',
  },
  {
    title: 'Įtraukite realias sąlygas',
    body: 'Darbo teisė, sutartys, įgūdžiai, vietos, taisyklės ir prieinamumas taikomi automatiškai.',
  },
  {
    title: 'Optimizuokite grafikus automatiškai',
    body: 'Sistema kuria lanksčias, paklausa pagrįstas pamainas — ne fiksuotus šablonus.',
  },
  {
    title: 'Greitai koreguokite pokyčius',
    body: 'Perplanuokite be grafikų kūrimo nuo nulio — kontrolė lieka jums.',
  },
]);

const benefitsEn = JSON.stringify([
  {
    title: 'Unlock 5–15% more effective capacity',
    body: 'By optimizing shift lengths, start/end times, skill mixes, and allocation, Workofo finds opportunities manual planning misses.',
  },
  {
    title: 'Better coverage during peak workload',
    body: 'Staff critical periods properly without increasing headcount.',
  },
  {
    title: 'Higher productivity per employee hour',
    body: 'More people working on value-adding tasks, fewer idle or mismatched hours.',
  },
  {
    title: 'Less chaos for managers',
    body: 'Faster planning, fewer last-minute changes, clearer schedules teams can trust.',
  },
  {
    title: 'Built-in compliance and fairness',
    body: 'Rules, contracts, and preferences respected automatically.',
  },
]);
const benefitsLt = JSON.stringify([
  {
    title: 'Atrakinkite 5–15% efektyvesnės talpos',
    body: 'Optimizuojant pamainų trukmę, pradžias/pabaigas ir įgūdžių derinį Workofo randa tai, ką praleidžia rankinis planavimas.',
  },
  {
    title: 'Geresnis padengimas piko metu',
    body: 'Užtikrinkite kritinius laikotarpius be papildomų etatų.',
  },
  {
    title: 'Didesnis produktyvumas per valandą',
    body: 'Daugiau vertę kuriančio darbo, mažiau tuščių ar netinkamų valandų.',
  },
  {
    title: 'Mažiau chaoso vadovams',
    body: 'Greitesnis planavimas, mažiau paskutinės minutės keitimų, aiškesni grafikai.',
  },
  {
    title: 'Atitiktis ir teisingumas',
    body: 'Taisyklės, sutartys ir pageidavimai taikomi automatiškai.',
  },
]);

const casesEn = JSON.stringify([
  {
    title: 'Home goods retail chain',
    challenge: '50–70 business rules per store + fluctuating customer flows.',
    action: 'Modeled rules and optimized shifts based on demand.',
    result: 'Freed up 8–10% of scheduled hours and improved service consistency.',
  },
  {
    title: 'Pharmacy chain',
    challenge: 'Strict compliance + skill-based staffing requirements.',
    action: 'Enforced rules automatically and optimized staffing plans.',
    result: 'Identified 8.7% free hours and reduced customer waiting times.',
  },
]);
const casesLt = JSON.stringify([
  {
    title: 'Namų prekių mažmeninė grandinė',
    challenge: '50–70 verslo taisyklių parduotuvėje + kintantys srautai.',
    action: 'Modeliavo taisykles ir optimizavo pamainas pagal paklausą.',
    result: 'Atlaisvino 8–10% planuotų valandų ir pagerino aptarnavimą.',
  },
  {
    title: 'Vaistinių tinklas',
    challenge: 'Griežta atitiktis + įgūdžiais grįstas personalas.',
    action: 'Automatiškai taikė taisykles ir optimizavo planus.',
    result: 'Identifikavo 8,7% laisvų valandų ir sutrumpino laukimą.',
  },
]);

const jobsEn = JSON.stringify([
  {
    title: 'Lead Front end / Full stack developer',
    body: 'Help build AI that creates smarter work schedules for retail stores, restaurants, and service teams. Our software is already used by Decathlon, Jysk, and Tele2. You’ll tackle real backend challenges with Spring and REST APIs.',
    ctaLabel: 'Get in touch',
    ctaUrl: '/en/get-in-touch',
  },
  {
    title: 'Front end developer',
    body: 'Build the interface that managers use to schedule thousands of employees across Europe. React/TypeScript/Next.js stack, real problems to solve, and you’ll see your work in action at companies like Decathlon and Jysk.',
    ctaLabel: 'Get in touch',
    ctaUrl: '/en/get-in-touch',
  },
]);
const jobsLt = JSON.stringify([
  {
    title: 'Lead Front end / Full stack programuotojas',
    body: 'Kurkime AI, kuris kuria išmanesnius grafikus mažmenai, restoranams ir paslaugoms. Mūsų programinę įrangą jau naudoja Decathlon, Jysk ir Tele2.',
    ctaLabel: 'Susisiekti',
    ctaUrl: '/lt/get-in-touch',
  },
  {
    title: 'Front end programuotojas',
    body: 'Kurkite sąsają, kuria vadovai planuoja tūkstančius darbuotojų Europoje. React/TypeScript/Next.js.',
    ctaLabel: 'Susisiekti',
    ctaUrl: '/lt/get-in-touch',
  },
]);

const sections = [
  // EN home
  section('en', 'home', 1, 'hero', {
    heading: 'AI-powered employee scheduling software built around real demand',
    subheading:
      'Forecast demand, apply real-world labor rules and automatically create optimized schedules around when and where work actually happens.',
    ctaLabel: 'Book a demo',
    ctaUrl: '/en/get-in-touch',
    body: 'Unlock 5–15% more effective capacity',
  }),
  section('en', 'home', 2, 'logoStrip', {
    heading: 'Some of our clients',
    subheading: 'Trusted by teams across Europe to improve coverage, productivity, and schedule quality with AI.',
    items: logosEn,
  }),
  section('en', 'home', 3, 'problem', {
    heading: 'Work and schedules rarely match',
    subheading: 'When demand fluctuates and rules are complex, manual planning becomes costly and unreliable.',
    body: '<p>The result: higher labor costs, inconsistent coverage, and constant rework for managers. Workofo AI matches staffing to demand automatically, while enforcing every rule.</p>',
    items: problemEn,
  }),
  section('en', 'home', 4, 'steps', {
    heading: 'How Workofo works',
    subheading: 'From demand forecasting to compliant schedules in four simple steps.',
    ctaLabel: 'You stay in control: Workofo automates the heavy lifting, not decision-making.',
    items: stepsEn,
  }),
  section('en', 'home', 5, 'benefits', {
    heading: 'Why teams choose Workofo',
    subheading:
      'Experience fairness in scheduling, increased employee satisfaction, exceptional service for your customers, and operational excellence unlike any other.',
    items: benefitsEn,
  }),
  section('en', 'home', 6, 'testimonial', {
    ctaLabel: 'What our customers say',
    heading:
      'We have been using Workofo for more than two years for teams serving large customers, and for planning and managing blended traffic. Our experience is top notch. The provider is flexible, the product is reliable, easy to use, and is being regularly updated.',
    subheading: 'Dovydas Braukyla, CEO, Planas Chuliganas, telemarketing / call center provider',
  }),
  section('en', 'home', 7, 'demoForm', {
    heading: 'See how much workforce capacity you can unlock',
    subheading: 'See how AI-driven scheduling improves coverage and productivity in your operations.',
  }),

  // EN get-in-touch
  section('en', 'get-in-touch', 1, 'hero', {
    heading: 'See how much you can save with Workofo',
    subheading:
      'AI-powered workforce planning with 15-minute accuracy and built-in compliance. Typical savings: 5–15% of scheduled hours.',
    body: 'Used by multi-site teams across Europe. Managers stay in control.',
  }),
  section('en', 'get-in-touch', 2, 'demoForm', {
    heading: 'Book a demo',
    subheading: 'Tell us a bit about your operation and we’ll tailor the demo for you.',
  }),

  // EN jobs
  section('en', 'jobs', 1, 'hero', {
    heading: 'Join our team',
    subheading:
      'Explore opportunities to join an innovative team passionate about revolutionizing how businesses manage their workforce.',
  }),
  section('en', 'jobs', 2, 'jobList', {
    heading: 'Open roles',
    items: jobsEn,
  }),

  // LT home
  section('lt', 'home', 1, 'hero', {
    heading: 'AI darbo jėgos planavimas, atrakantis 5–15% efektyvesnės talpos',
    subheading:
      'Prognozuokite paklausą ir darbo krūvį bei automatiškai optimizuokite grafikus — komandos dirba tada ir ten, kur reikia.',
    ctaLabel: 'Sužinokite kaip veikia',
    ctaUrl: '/lt/get-in-touch',
    body: 'Naudojama mažmenoje, svetingume ir paslaugose visoje Europoje.',
  }),
  section('lt', 'home', 2, 'logoStrip', {
    heading: 'Mūsų klientai',
    subheading: 'Komandos Europoje gerina padengimą, produktyvumą ir grafikų kokybę su AI.',
    items: logosLt,
  }),
  section('lt', 'home', 3, 'problem', {
    heading: 'Darbas ir grafikai retai sutampa',
    subheading: 'Kai paklausa svyruoja ir taisyklės sudėtingos, rankinis planavimas tampa brangus ir nepatikimas.',
    body: '<p>Rezultatas: didesnės darbo sąnaudos, nenuoseklus padengimas ir nuolatinis vadovų perplanavimas. Workofo AI derina personalą prie paklausos — laikydamasis visų taisyklių.</p>',
    items: problemLt,
  }),
  section('lt', 'home', 4, 'steps', {
    heading: 'Kaip veikia Workofo',
    subheading: 'Nuo paklausos prognozės iki atitinkančių grafikų — keturi paprasti žingsniai.',
    ctaLabel: 'Kontrolė lieka jums — Workofo automatizuoja sunkų darbą, ne sprendimus.',
    items: stepsLt,
  }),
  section('lt', 'home', 5, 'benefits', {
    heading: 'Kodėl komandos renkasi Workofo',
    subheading: 'Teisingesni grafikai, didesnis darbuotojų pasitenkinimas, geresnis aptarnavimas ir operacinis meistriškumas.',
    items: benefitsLt,
  }),
  section('lt', 'home', 6, 'testimonial', {
    ctaLabel: 'Ką sako klientai',
    heading:
      'Workofo naudojame daugiau nei dvejus metus komandoms, aptarnaujančioms didelius klientus, ir mišraus srauto planavimui. Patirtis puiki — lankstus partneris, patikimas ir nuolat tobulinamas produktas.',
    subheading: 'Dovydas Braukyla, CEO — Planas Chuliganas',
  }),
  section('lt', 'home', 7, 'demoForm', {
    heading: 'Sužinokite, kiek talpos galite atrakinti',
    subheading: 'Kaip AI planavimas gerina padengimą ir produktyvumą jūsų operacijose.',
  }),

  section('lt', 'get-in-touch', 1, 'hero', {
    heading: 'Sužinokite, kiek galite sutaupyti su Workofo',
    subheading:
      'AI darbo jėgos planavimas su 15 min. tikslumu ir įmontuota atitiktimi. Tipinis taupymas: 5–15% planuotų valandų.',
    body: 'Naudojama daugiavietėse komandose Europoje. Vadovai išlieka kontroliuojantys.',
  }),
  section('lt', 'get-in-touch', 2, 'demoForm', {
    heading: 'Užsisakyti demo',
    subheading: 'Papasakokite apie savo operacijas — pritaikysime demonstraciją.',
  }),

  section('lt', 'jobs', 1, 'hero', {
    heading: 'Prisijunkite prie komandos',
    subheading: 'Ieškome talentų, kurie nori keisti, kaip verslai valdo darbo jėgą.',
  }),
  section('lt', 'jobs', 2, 'jobList', {
    heading: 'Atviros pozicijos',
    items: jobsLt,
  }),

  // SE home — structural mirror of EN (EN placeholder copy; rewrite in CMS / code later)
  section('se', 'home', 1, 'hero', {
    heading: 'AI-powered employee scheduling software built around real demand',
    subheading:
      'Forecast demand, apply real-world labor rules and automatically create optimized schedules around when and where work actually happens.',
    ctaLabel: 'Boka en demo',
    ctaUrl: '/se/get-in-touch',
  }),
  section('se', 'home', 2, 'logoStrip', {
    heading: 'Some of our clients',
    subheading: 'Trusted by teams across Europe to improve coverage, productivity, and schedule quality with AI.',
    items: logosEn,
  }),
  section('se', 'home', 3, 'problem', {
    heading: 'Work and schedules rarely match',
    subheading: 'When demand fluctuates and rules are complex, manual planning becomes costly and unreliable.',
    body: '<p>The result: higher labor costs, inconsistent coverage, and constant rework for managers. Workofo AI matches staffing to demand automatically, while enforcing every rule.</p>',
    items: problemEn,
  }),
  section('se', 'home', 4, 'steps', {
    heading: 'How Workofo works',
    subheading: 'From demand forecasting to compliant schedules in four simple steps.',
    ctaLabel: 'You stay in control: Workofo automates the heavy lifting, not decision-making.',
    items: stepsEn,
  }),
  section('se', 'home', 5, 'benefits', {
    heading: 'Why teams choose Workofo',
    subheading:
      'Experience fairness in scheduling, increased employee satisfaction, exceptional service for your customers, and operational excellence unlike any other.',
    items: benefitsEn,
  }),
  section('se', 'home', 6, 'testimonial', {
    ctaLabel: 'What our customers say',
    heading:
      'We have been using Workofo for more than two years for teams serving large customers, and for planning and managing blended traffic. Our experience is top notch. The provider is flexible, the product is reliable, easy to use, and is being regularly updated.',
    subheading: 'Dovydas Braukyla, CEO, Planas Chuliganas, telemarketing / call center provider',
  }),
  section('se', 'home', 7, 'demoForm', {
    heading: 'See how much workforce capacity you can unlock',
    subheading: 'See how AI-driven scheduling improves coverage and productivity in your operations.',
  }),
  section('se', 'get-in-touch', 1, 'hero', {
    heading: 'See how much you can save with Workofo',
    subheading:
      'AI-powered workforce planning with 15-minute accuracy and built-in compliance. Typical savings: 5–15% of scheduled hours.',
  }),
  section('se', 'get-in-touch', 2, 'demoForm', {
    heading: 'Boka en demo',
    subheading: 'Tell us a bit about your operation and we’ll tailor the demo for you.',
  }),
  section('se', 'jobs', 1, 'hero', {
    heading: 'Join our team',
    subheading:
      'Explore opportunities to join an innovative team passionate about revolutionizing how businesses manage their workforce.',
  }),
  section('se', 'jobs', 2, 'jobList', {
    heading: 'Open roles',
    items: jobsEn,
  }),
];

console.log(`Inserting ${sections.length} SiteSections…`);
const secInsert = await withRetry(
  () =>
    wix('POST', '/wix-data/v2/bulk/items/insert', {
      dataCollectionId: SITE_SECTIONS,
      dataItems: sections,
      returnEntity: true,
    }),
  'SiteSections insert',
);
console.log('Sections successes:', secInsert.bulkActionMetadata?.totalSuccesses);

// ─── Forms (aligned with workofo.com/get-in-touch) ──────────────────────────
console.log('Listing forms…');
const listed = await wix('GET', '/form-schema-service/v4/forms?namespace=wix.form_app.form');
for (const f of listed.forms || []) {
  console.log('Deleting form', f.id, f.name);
  await wix('DELETE', `/form-schema-service/v4/forms/${f.id}`);
}

const lc = () => randomUUID();
const ids = {
  submit: lc(),
  first: lc(),
  last: lc(),
  email: lc(),
  phone: lc(),
  company: lc(),
  employees: lc(),
  challenges: lc(),
  systems: lc(),
  message: lc(),
  step: lc(),
  ...Object.fromEntries(
    ['o1', 'o2', 'o3', 'o4', 'o5'].map((k) => [k, lc()]),
  ),
};

console.log('Creating Book a Demo form…');
const formRes = await wix('POST', '/form-schema-service/v4/forms', {
  form: {
    name: 'Book a Demo',
    namespace: 'wix.form_app.form',
    formFields: [
      {
        id: ids.submit,
        hidden: false,
        identifier: 'SUBMIT_BUTTON',
        fieldType: 'DISPLAY',
        displayOptions: {
          displayFieldType: 'PAGE_NAVIGATION',
          pageNavigationOptions: {
            nextPageText: 'Next',
            previousPageText: 'Back',
            submitText: 'Book a demo',
          },
        },
      },
      {
        id: ids.first,
        hidden: false,
        identifier: 'CONTACTS_FIRST_NAME',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'first_name',
          pii: true,
          required: true,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], minLength: 1, maxLength: 80 },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'First Name', showLabel: true },
          },
        },
      },
      {
        id: ids.last,
        hidden: false,
        identifier: 'CONTACTS_LAST_NAME',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'last_name',
          pii: true,
          required: true,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], minLength: 1, maxLength: 80 },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'Last Name', showLabel: true },
          },
        },
      },
      {
        id: ids.email,
        hidden: false,
        identifier: 'CONTACTS_EMAIL',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'email',
          pii: true,
          required: true,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'EMAIL', enum: [] },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'Email', showLabel: true },
          },
        },
      },
      {
        id: ids.phone,
        hidden: false,
        identifier: 'CONTACTS_PHONE',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'phone',
          pii: true,
          required: false,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], maxLength: 40 },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'Phone Number', showLabel: true },
          },
        },
      },
      {
        id: ids.company,
        hidden: false,
        identifier: 'CONTACTS_COMPANY',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'company',
          pii: false,
          required: true,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], minLength: 1, maxLength: 120 },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'Company Name', showLabel: true },
          },
        },
      },
      {
        id: ids.employees,
        hidden: false,
        identifier: 'employee_count',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'employee_count',
          pii: false,
          required: false,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [] },
            componentType: 'DROPDOWN',
            dropdownOptions: {
              label: 'Number of scheduled (shift) employees',
              showLabel: true,
              options: [
                { id: ids.o1, label: 'Up to 100', value: 'up_to_100' },
                { id: ids.o2, label: '101 – 250', value: '101_250' },
                { id: ids.o3, label: '251 – 1000', value: '251_1000' },
                { id: ids.o4, label: '1001 – 5000', value: '1001_5000' },
                { id: ids.o5, label: 'More than 5000', value: '5000_plus' },
              ],
            },
          },
        },
      },
      {
        id: ids.challenges,
        hidden: false,
        identifier: 'challenges',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'challenges',
          pii: false,
          required: false,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], maxLength: 2000 },
            componentType: 'TEXT_INPUT',
            textInputOptions: {
              label: 'Main issues or challenges with employee scheduling',
              showLabel: true,
            },
          },
        },
      },
      {
        id: ids.systems,
        hidden: false,
        identifier: 'systems',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'systems',
          pii: false,
          required: false,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], maxLength: 1000 },
            componentType: 'TEXT_INPUT',
            textInputOptions: {
              label: 'Systems or software you now use for schedules',
              showLabel: true,
            },
          },
        },
      },
      {
        id: ids.message,
        hidden: false,
        identifier: 'message',
        fieldType: 'INPUT',
        inputOptions: {
          target: 'message',
          pii: false,
          required: false,
          inputType: 'STRING',
          readOnly: false,
          stringOptions: {
            validation: { format: 'UNKNOWN_FORMAT', enum: [], maxLength: 2000 },
            componentType: 'TEXT_INPUT',
            textInputOptions: { label: 'Message', showLabel: true },
          },
        },
      },
    ],
    steps: [
      {
        id: ids.step,
        name: 'Page 1',
        layout: {
          large: {
            items: [
              { fieldId: ids.first, row: 0, column: 0, width: 6, height: 1 },
              { fieldId: ids.last, row: 0, column: 6, width: 6, height: 1 },
              { fieldId: ids.email, row: 1, column: 0, width: 6, height: 1 },
              { fieldId: ids.phone, row: 1, column: 6, width: 6, height: 1 },
              { fieldId: ids.company, row: 2, column: 0, width: 12, height: 1 },
              { fieldId: ids.employees, row: 3, column: 0, width: 12, height: 1 },
              { fieldId: ids.challenges, row: 4, column: 0, width: 12, height: 1 },
              { fieldId: ids.systems, row: 5, column: 0, width: 12, height: 1 },
              { fieldId: ids.message, row: 6, column: 0, width: 12, height: 1 },
              { fieldId: ids.submit, row: 7, column: 0, width: 12, height: 1 },
            ],
            sections: [],
          },
        },
      },
    ],
    enabled: true,
  },
});

const formId = formRes.form?.id;
console.log('Form ID:', formId);
console.log(
  'Form targets:',
  (formRes.form?.fields || []).map((f) => f.target),
);

const out = { formId, pageIdByKey, siteId: SITE_ID, collections: [SITE_PAGES, SITE_SECTIONS] };
writeFileSync(join(TMP, 'wix_seeded_workofo.json'), JSON.stringify(out, null, 2));
writeFileSync(join(ROOT, '.env.local.form'), `PUBLIC_WIX_DEMO_FORM_ID=${formId}\n`);
console.log('Wrote .tmp/wix_seeded_workofo.json and .env.local.form');
console.log('Done. Update PUBLIC_WIX_DEMO_FORM_ID in .env.local to', formId);
