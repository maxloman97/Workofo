type LocaleProps = { locale?: string };

const INDUSTRIES = [
  {
    name: 'Retail',
    slug: 'retail',
    body: 'Match labour to demand across stores, departments and fulfilment, with built-in compliance and 15-minute scheduling accuracy.',
  },
  {
    name: 'Hospitality & QSRs',
    slug: 'hospitality-qsrs',
    body: 'Align front-of-house, kitchen and events staff with every rush, while keeping labour rules and preferences fair.',
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    body: 'Plan nurses, carers and support staff to patient acuity and ward demand, with rest rules and skill mix enforced.',
  },
  {
    name: 'Warehousing & Logistics',
    slug: 'warehousing-logistics',
    body: 'Match pickers, packers and yard teams to inbound waves and outbound cut-offs, with certifications built in.',
  },
  {
    name: 'Facility Management',
    slug: 'facility-management',
    body: 'Coordinate mobile teams across sites and contracts, balancing skills, travel time and service windows.',
  },
] as const;

export function HomeIndustries({ locale = 'en' }: LocaleProps) {
  return (
    <section className="home-industries" aria-labelledby="home-industries-heading">
      <div className="home-journey__inner">
        <header className="home-journey__intro">
          <div>
            <p className="t-overline home-journey__eyebrow">Industries</p>
            <h2 id="home-industries-heading">Built for every shift-based operation</h2>
          </div>
          <p className="lede home-journey__lede">
            Demand looks different in a store, a ward or a warehouse. Workofo models the workload drivers and rules
            of your industry, so schedules fit how your operation actually runs.
          </p>
        </header>

        <ul className="home-industries__list">
          {INDUSTRIES.map((industry) => (
            <li key={industry.slug}>
              <a className="home-industries__row" href={`/${locale}/solutions/${industry.slug}`}>
                <span className="home-industries__name">{industry.name}</span>
                <span className="home-industries__meta">
                  <span className="home-industries__body">{industry.body}</span>
                  <span className="home-industries__link">
                  <span className="visually-hidden">{industry.name} scheduling</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
                    <path
                      d="M4 9h10M10 5l4 4-4 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const OUTCOMES = [
  {
    title: 'Better coverage during peak workload',
    body: 'Staff critical periods properly without increasing headcount.',
  },
  {
    title: 'Higher productivity per employee hour',
    body: 'More people on value-adding tasks, fewer idle or mismatched hours.',
  },
  {
    title: 'Less chaos for managers',
    body: 'Faster planning, fewer last-minute changes and schedules teams can trust.',
  },
] as const;

export function HomeProof() {
  return (
    <section className="home-proof" aria-labelledby="home-proof-heading">
      <div className="home-journey__inner">
        <header className="home-journey__intro">
          <div>
            <p className="t-overline home-journey__eyebrow">Customer proof</p>
            <h2 id="home-proof-heading">Running daily operations, not just pilots</h2>
          </div>
          <p className="lede home-journey__lede">
            Teams use Workofo every day to plan blended traffic, large customer accounts and multi-site operations.
          </p>
        </header>

        <div className="home-proof__grid">
          <figure className="home-proof__quote">
            <span className="home-proof__years">
              <strong>2+ years</strong> in production
            </span>
            <blockquote>
              <p>
                “Our experience is top notch. The provider is flexible, the product is reliable, easy to use, and is
                being regularly updated.”
              </p>
            </blockquote>
            <figcaption>
              <img
                src="/clients/planas-chuliganas.png?v=2"
                alt="Planas Chuliganas"
                width={120}
                height={40}
                loading="lazy"
                decoding="async"
              />
              <span>
                <strong>Dovydas Braukyla</strong>
                <span>CEO, Planas Chuliganas · Contact center</span>
              </span>
            </figcaption>
          </figure>

          <ul className="home-proof__outcomes">
            {OUTCOMES.map((item, i) => (
              <li key={item.title}>
                <span className="home-proof__num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type Faq = { q: string; a: string; html?: string };

function buildFaqs(locale: string): Faq[] {
  const sol = (slug: string, label: string) => `<a href="/${locale}/solutions/${slug}">${label}</a>`;
  return [
    {
      q: 'What is AI employee scheduling software?',
      a: 'AI employee scheduling software forecasts workload and automatically builds staff schedules that match it, while respecting labor rules. Instead of copying fixed shift templates, Workofo creates demand-driven shifts around when and where work actually happens.',
    },
    {
      q: 'How does Workofo forecast labor demand?',
      a: 'Workofo uses the drivers that define work in your business, such as sales, volumes, tasks or service targets, and forecasts staffing needs down to 15-minute intervals per location.',
    },
    {
      q: 'Can Workofo handle labor law and union agreements?',
      a: 'Yes. Labor law, union agreements, contracts, skills, locations, availability and internal policies are enforced automatically in every schedule Workofo creates.',
    },
    {
      q: 'How much capacity can we unlock?',
      a: 'Teams typically unlock 5–15% more effective capacity by optimizing shift lengths, start and end times, skill mix and allocation. Use the capacity calculator on this page for an estimate based on your workforce.',
      html: 'Teams typically unlock 5–15% more effective capacity by optimizing shift lengths, start and end times, skill mix and allocation. Use the <a href="#calculate-potential">capacity calculator</a> for an estimate based on your workforce.',
    },
    {
      q: 'Which industries is Workofo built for?',
      a: 'Workofo is built for shift-based operations in retail, hospitality and QSRs, healthcare, warehousing and logistics, facility management and contact centers.',
      html: `Workofo is built for shift-based operations in ${sol('retail', 'retail')}, ${sol('hospitality-qsrs', 'hospitality and QSRs')}, ${sol('healthcare', 'healthcare')}, ${sol('warehousing-logistics', 'warehousing and logistics')}, ${sol('facility-management', 'facility management')} and contact centers.`,
    },
    {
      q: 'Do managers stay in control of the schedule?',
      a: 'Yes. Workofo automates the heavy lifting, not decision-making. Managers review and adjust schedules, and can replan quickly when things change without rebuilding from scratch.',
    },
  ];
}

export function HomeFaq({ locale = 'en' }: LocaleProps) {
  const faqs = buildFaqs(locale);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="home-faq" aria-labelledby="home-faq-heading">
      <div className="home-journey__inner home-faq__layout">
        <header className="home-faq__intro">
          <p className="t-overline home-journey__eyebrow">FAQ</p>
          <h2 id="home-faq-heading">Employee scheduling software, answered</h2>
          <p className="lede home-journey__lede">
            Still deciding? See Workofo with your own scheduling rules and demand data.
          </p>
          <a className="btn btn--primary home-faq__cta" href={`/${locale}/get-in-touch`}>
            Book a demo
          </a>
        </header>

        <div className="home-faq__list">
          {faqs.map((f, i) => (
            <details key={f.q} className="home-faq__item" open={i === 0}>
              <summary>
                <h3>{f.q}</h3>
                <span className="home-faq__icon" aria-hidden="true" />
              </summary>
              <p dangerouslySetInnerHTML={{ __html: f.html ?? f.a }} />
            </details>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
