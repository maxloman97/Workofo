#!/usr/bin/env node
/**
 * One-shot seed for Workofo: CMS Pages/Sections, Book a Demo form, blog posts.
 * Run from project root with TOKEN + SITE_ID in env (or /tmp files from prior mint).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const TOKEN = process.env.TOKEN || readFileSync('/tmp/wix_token_workofo.txt', 'utf8').trim();
const SITE_ID = process.env.SITE_ID || readFileSync('/tmp/wix_site_workofo.txt', 'utf8').trim();

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
    const err = new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 800)}`);
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

// ─── CMS: Pages ─────────────────────────────────────────────────────────────
console.log('Creating Pages collection…');
await withRetry(
  () =>
    wix('POST', '/wix-data/v2/collections', {
      collection: {
        id: 'Pages',
        displayName: 'Pages',
        fields: [
          { key: 'title', displayName: 'Title', type: 'TEXT' },
          { key: 'slug', displayName: 'Slug', type: 'TEXT' },
          { key: 'language', displayName: 'Language', type: 'TEXT' },
        ],
        permissions: PERMS,
      },
    }),
  'Pages collection',
);

console.log('Creating Sections collection…');
await withRetry(
  () =>
    wix('POST', '/wix-data/v2/collections', {
      collection: {
        id: 'Sections',
        displayName: 'Sections',
        fields: [
          {
            key: 'page',
            displayName: 'Page',
            type: 'REFERENCE',
            typeMetadata: { reference: { referencedCollectionId: 'Pages' } },
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
  'Sections collection',
);

const pageDefs = [
  // lt
  { title: 'Workofo — Pradžia', slug: 'home', language: 'lt' },
  { title: 'Kainos', slug: 'pricing', language: 'lt' },
  { title: 'Apie mus', slug: 'about', language: 'lt' },
  // en
  { title: 'Workofo — Home', slug: 'home', language: 'en' },
  { title: 'Pricing', slug: 'pricing', language: 'en' },
  { title: 'About', slug: 'about', language: 'en' },
  // se (partial — home only, Feature 4)
  { title: 'Workofo — Startsida', slug: 'home', language: 'se' },
];

console.log('Inserting Pages…');
const pagesInsert = await withRetry(
  () =>
    wix('POST', '/wix-data/v2/bulk/items/insert', {
      dataCollectionId: 'Pages',
      dataItems: pageDefs.map((d) => ({ data: d })),
      returnEntity: true,
    }),
  'Pages insert',
);

const pageIdByKey = {};
for (const r of pagesInsert.results || []) {
  const item = r.dataItem;
  if (!item?.data) continue;
  const key = `${item.data.language}:${item.data.slug}`;
  pageIdByKey[key] = item.id;
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

const featureItemsLt = JSON.stringify([
  { title: 'Tvarkaraščiai', body: 'Suplanuokite komandos laiką vienoje vietoje.' },
  { title: 'Analitika', body: 'Sekite produktyvumą ir klientų srautą realiu laiku.' },
  { title: 'Automatizacija', body: 'Priminkite, sinchronizuokite ir taupykite laiką.' },
]);
const featureItemsEn = JSON.stringify([
  { title: 'Scheduling', body: 'Plan your team’s time in one place.' },
  { title: 'Analytics', body: 'Track productivity and customer flow in real time.' },
  { title: 'Automation', body: 'Remind, sync, and reclaim hours every week.' },
]);
const pricingLt = JSON.stringify([
  { name: 'Starter', price: '€29', period: '/mėn', features: ['Iki 5 narių', 'Pagrindinė analitika', 'El. paštas'] },
  { name: 'Pro', price: '€79', period: '/mėn', features: ['Iki 25 narių', 'Išplėstinė analitika', 'Prioritetinė pagalba'] },
  { name: 'Enterprise', price: 'Individualiai', period: '', features: ['Neriboti nariai', 'SSO', 'Dedicated CSM'] },
]);
const pricingEn = JSON.stringify([
  { name: 'Starter', price: '$29', period: '/mo', features: ['Up to 5 seats', 'Core analytics', 'Email support'] },
  { name: 'Pro', price: '$79', period: '/mo', features: ['Up to 25 seats', 'Advanced analytics', 'Priority support'] },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited seats', 'SSO', 'Dedicated CSM'] },
]);

const sections = [
  // LT home
  section('lt', 'home', 1, 'hero', {
    heading: 'Planuokite. Matuokite. Augkite.',
    subheading: 'Workofo — B2B tvarkaraščių ir analitikos platforma komandoms.',
    ctaLabel: 'Užsisakyti demo',
    ctaUrl: '/lt/pricing',
  }),
  section('lt', 'home', 2, 'featureGrid', {
    heading: 'Kodėl Workofo',
    items: featureItemsLt,
  }),
  section('lt', 'home', 3, 'testimonial', {
    heading: '„Sutaupėme 8 valandas per savaitę.“',
    subheading: 'Aistė K., Ops vadovė',
    body: '<p>Workofo pakeitė mūsų savaitės planavimą — visi mato tą patį tvarkaraštį ir metrikas.</p>',
  }),
  section('lt', 'home', 4, 'cta', {
    heading: 'Pasiruošę pradėti?',
    subheading: 'Užsisakykite asmeninę demonstraciją.',
    ctaLabel: 'Užsisakyti demo',
    ctaUrl: '/lt/pricing',
  }),
  // LT pricing
  section('lt', 'pricing', 1, 'hero', {
    heading: 'Aiškios kainos. Jokių staigmenų.',
    subheading: 'Pasirinkite planą, kuris atitinka jūsų komandą.',
  }),
  section('lt', 'pricing', 2, 'pricing', {
    heading: 'Planai',
    items: pricingLt,
  }),
  section('lt', 'pricing', 3, 'demoForm', {
    heading: 'Užsisakykite demo',
    subheading: 'Atsakysime per 1 darbo dieną.',
  }),
  // LT about
  section('lt', 'about', 1, 'hero', {
    heading: 'Apie Workofo',
    subheading: 'Kuriame įrankius, kurie padeda komandoms dirbti kartu.',
  }),
  section('lt', 'about', 2, 'textImage', {
    heading: 'Mūsų misija',
    body: '<p>Tikime, kad tvarkaraščiai ir analitika turi būti paprasti. Workofo jungia abu į vieną švarią platformą.</p>',
    subheading: 'Nuo Vilniaus — komandoms visame pasaulyje.',
  }),
  section('lt', 'about', 3, 'richText', {
    heading: 'Kaip dirbame',
    body: '<p>Produktą kuriame kartu su klientais. Kiekviena funkcija prasideda nuo realios operacinės problemos.</p>',
  }),
  // EN home
  section('en', 'home', 1, 'hero', {
    heading: 'Schedule. Measure. Grow.',
    subheading: 'Workofo is the B2B scheduling and analytics platform for modern teams.',
    ctaLabel: 'Book a demo',
    ctaUrl: '/en/pricing',
  }),
  section('en', 'home', 2, 'featureGrid', {
    heading: 'Why Workofo',
    items: featureItemsEn,
  }),
  section('en', 'home', 3, 'testimonial', {
    heading: '“We reclaimed 8 hours every week.”',
    subheading: 'Aiste K., Head of Ops',
    body: '<p>Workofo replaced our patchwork of spreadsheets — one schedule, one analytics view.</p>',
  }),
  section('en', 'home', 4, 'cta', {
    heading: 'Ready to start?',
    subheading: 'Book a personal walkthrough with our team.',
    ctaLabel: 'Book a demo',
    ctaUrl: '/en/pricing',
  }),
  // EN pricing
  section('en', 'pricing', 1, 'hero', {
    heading: 'Simple pricing. No surprises.',
    subheading: 'Pick the plan that fits your team.',
  }),
  section('en', 'pricing', 2, 'pricing', {
    heading: 'Plans',
    items: pricingEn,
  }),
  section('en', 'pricing', 3, 'demoForm', {
    heading: 'Book a demo',
    subheading: 'We’ll reply within one business day.',
  }),
  // EN about
  section('en', 'about', 1, 'hero', {
    heading: 'About Workofo',
    subheading: 'We build tools that help teams work together.',
  }),
  section('en', 'about', 2, 'textImage', {
    heading: 'Our mission',
    body: '<p>Scheduling and analytics should be simple. Workofo brings both into one clean platform.</p>',
    subheading: 'Built in Vilnius — used by teams worldwide.',
  }),
  section('en', 'about', 3, 'richText', {
    heading: 'How we work',
    body: '<p>We ship with customers. Every feature starts from a real operational pain point.</p>',
  }),
  // SE home — includes an EXTRA richText that LT/EN home do not have (Feature 4)
  section('se', 'home', 1, 'hero', {
    heading: 'Planera. Mät. Väx.',
    subheading: 'Workofo är plattformen för schemaläggning och analys för moderna team.',
    ctaLabel: 'Boka en demo',
    ctaUrl: '/se/pricing',
  }),
  section('se', 'home', 2, 'featureGrid', {
    heading: 'Varför Workofo',
    items: JSON.stringify([
      { title: 'Schemaläggning', body: 'Planera teamets tid på ett ställe.' },
      { title: 'Analys', body: 'Följ produktivitet i realtid.' },
      { title: 'Automation', body: 'Påminn, synka och spara tid.' },
    ]),
  }),
  section('se', 'home', 3, 'testimonial', {
    heading: '“Vi sparade 8 timmar i veckan.”',
    subheading: 'Aiste K., Ops-chef',
    body: '<p>Workofo ersatte våra kalkylblad — ett schema, en analysvy.</p>',
  }),
  section('se', 'home', 4, 'richText', {
    heading: 'Extra svensk sektion',
    body: '<p>Den här paragrafen finns bara på den svenska startsidan. Den skapades i CMS som en ny <strong>richText</strong>-sektion — utan kodändring. Det bevisar Feature 4: nya stycken per språk = nya CMS-sektioner.</p>',
  }),
  section('se', 'home', 5, 'cta', {
    heading: 'Redo att börja?',
    subheading: 'Boka en personlig genomgång.',
    ctaLabel: 'Boka en demo',
    ctaUrl: '/en/pricing',
  }),
];

console.log(`Inserting ${sections.length} Sections…`);
const secInsert = await withRetry(
  () =>
    wix('POST', '/wix-data/v2/bulk/items/insert', {
      dataCollectionId: 'Sections',
      dataItems: sections,
      returnEntity: true,
    }),
  'Sections insert',
);
console.log('Sections successes:', secInsert.bulkActionMetadata?.totalSuccesses);

// Verify
const pagesQ = await wix('POST', '/wix-data/v2/items/query', { dataCollectionId: 'Pages' });
const secsQ = await wix('POST', '/wix-data/v2/items/query', {
  dataCollectionId: 'Sections',
  query: { paging: { limit: 100 } },
});
console.log('Verified Pages:', pagesQ.dataItems?.length, 'Sections:', secsQ.dataItems?.length);

// ─── Forms: Book a Demo ─────────────────────────────────────────────────────
console.log('Cleaning default forms…');
const listed = await wix('GET', '/form-schema-service/v4/forms?namespace=wix.form_app.form');
for (const f of listed.forms || []) {
  console.log('Deleting form', f.id, f.name);
  await wix('DELETE', `/form-schema-service/v4/forms/${f.id}`);
}

const lc = () => randomUUID();
const F1 = lc();
const F2 = lc();
const F3 = lc();
const F4 = lc();
const SUBMIT = lc();
const STEP = lc();

console.log('Creating Book a Demo form…');
const formRes = await wix('POST', '/form-schema-service/v4/forms', {
  form: {
    name: 'Book a Demo',
    namespace: 'wix.form_app.form',
    formFields: [
      {
        id: SUBMIT,
        hidden: false,
        identifier: 'SUBMIT_BUTTON',
        fieldType: 'DISPLAY',
        displayOptions: {
          displayFieldType: 'PAGE_NAVIGATION',
          pageNavigationOptions: { nextPageText: 'Next', previousPageText: 'Back', submitText: 'Book demo' },
        },
      },
      {
        id: F1,
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
            textInputOptions: { label: 'Name', showLabel: true },
          },
        },
      },
      {
        id: F2,
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
            textInputOptions: { label: 'Work email', showLabel: true },
          },
        },
      },
      {
        id: F3,
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
            textInputOptions: { label: 'Company', showLabel: true },
          },
        },
      },
      {
        id: F4,
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
        id: STEP,
        name: 'Page 1',
        layout: {
          large: {
            items: [
              { fieldId: F1, row: 0, column: 0, width: 12, height: 1 },
              { fieldId: F2, row: 1, column: 0, width: 12, height: 1 },
              { fieldId: F3, row: 2, column: 0, width: 12, height: 1 },
              { fieldId: F4, row: 3, column: 0, width: 12, height: 1 },
              { fieldId: SUBMIT, row: 4, column: 0, width: 12, height: 1 },
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
writeFileSync(
  '/tmp/wix_seeded_workofo.json',
  JSON.stringify({ formId, pageIdByKey, siteId: SITE_ID }, null, 2),
);

// ─── Blog ───────────────────────────────────────────────────────────────────
console.log('Fetching author member…');
const members = await wix('GET', '/members/v1/members?fieldsets=PUBLIC&paging.limit=1');
const memberId = members.members?.[0]?.id || members.members?.[0]?._id;
if (!memberId) throw new Error('No site member for blog author');
console.log('Author memberId:', memberId);

function ricosPost(title, heading, paragraphs) {
  const nodes = [
    {
      type: 'HEADING',
      id: 'h1',
      nodes: [{ type: 'TEXT', id: '', nodes: [], textData: { text: heading, decorations: [] } }],
      headingData: { level: 2 },
    },
    ...paragraphs.map((p, i) => ({
      type: 'PARAGRAPH',
      id: `p${i}`,
      nodes: [{ type: 'TEXT', id: '', nodes: [], textData: { text: p, decorations: [] } }],
      paragraphData: {},
    })),
  ];
  return { title, memberId, richContent: { nodes } };
}

console.log('Creating blog posts…');
const blogRes = await withRetry(
  () =>
    wix('POST', '/blog/v3/bulk/draft-posts/create', {
      draftPosts: [
        ricosPost(
          'How scheduling analytics cut meeting waste',
          'Fewer meetings, clearer calendars',
          [
            'Teams lose hours to double-bookings and unclear ownership. Workofo surfaces conflicts before they land on the calendar.',
            'Start with a shared schedule, then layer analytics to see where time actually goes.',
          ],
        ),
        ricosPost(
          'Three metrics every ops lead should track',
          'Utilization, wait time, and throughput',
          [
            'Utilization without context is vanity. Pair it with customer wait time and weekly throughput.',
            'Workofo’s dashboards keep these three signals next to the schedule that produced them.',
          ],
        ),
        ricosPost(
          'From spreadsheet chaos to one source of truth',
          'A migration playbook',
          [
            'Most teams start in Sheets. The jump to Workofo works best when you migrate one team first.',
            'Import people, lock a weekly ritual, then expand. Don’t boil the ocean on day one.',
          ],
        ),
      ],
      publish: true,
    }),
  'Blog posts',
);
console.log(
  'Blog results:',
  (blogRes.results || []).map((r) => r.itemMetadata),
);

console.log('\n✅ Seed complete');
console.log(JSON.stringify({ formId, pages: Object.keys(pageIdByKey).length }, null, 2));
