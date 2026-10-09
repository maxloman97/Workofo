import { useCallback, useEffect, useRef, useState } from 'react';

import { industryPath, localePath } from '../../lib/paths';
import type { Locale } from '../../lib/locales';
import type { IndustrySlug } from '../../lib/solutions';

type LocaleProps = { locale?: Locale };

const INDUSTRIES = [
  {
    name: 'Retail',
    slug: 'retail',
    image: '/industries/retail.jpg',
    body: 'Match labour to demand across stores, departments and fulfilment.',
  },
  {
    name: 'Hospitality & QSRs',
    slug: 'hospitality-qsrs',
    image: '/industries/hospitality-qsrs.jpg',
    body: 'Align front-of-house and kitchen teams with every rush.',
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    image: '/industries/healthcare.jpg',
    body: 'Plan clinical and support staff to patient demand and skill mix.',
  },
  {
    name: 'Warehousing & Logistics',
    slug: 'warehousing-logistics',
    image: '/industries/warehousing-logistics.jpg',
    body: 'Match warehouse teams to inbound waves and outbound cut-offs.',
  },
  {
    name: 'Facility Management',
    slug: 'facility-management',
    image: '/industries/facility-management.jpg',
    body: 'Coordinate mobile teams across sites, skills and service windows.',
  },
] as const;

export function HomeIndustries({ locale = 'en' }: LocaleProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const syncActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = [...track.querySelectorAll<HTMLElement>('.home-industries__slide')];
    if (!slides.length) return;
    const left = track.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - left);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    syncActive();
    track.addEventListener('scroll', syncActive, { passive: true });
    window.addEventListener('resize', syncActive);
    return () => {
      track.removeEventListener('scroll', syncActive);
      window.removeEventListener('resize', syncActive);
    };
  }, [syncActive]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.querySelectorAll<HTMLElement>('.home-industries__slide')[index];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
  };

  const step = (dir: -1 | 1) => {
    scrollToIndex(Math.min(INDUSTRIES.length - 1, Math.max(0, active + dir)));
  };

  return (
    <section className="home-industries" aria-labelledby="home-industries-heading">
      <div className="home-journey__inner">
        <header className="home-journey__intro">
          <div>
            <p className="t-overline home-journey__eyebrow">Industries</p>
            <h2 id="home-industries-heading">AI employee scheduling built for how your industry works.</h2>
          </div>
          <p className="lede home-journey__lede">
            Workofo is workforce scheduling software for shift-based operations where staffing needs change with demand.
            Forecast workload, optimize staffing levels and build schedules around how your business actually operates.
          </p>
        </header>

        <div className="home-industries__carousel">
          <ul
            ref={trackRef}
            className="home-industries__track"
            aria-label="Industry solutions"
          >
            {INDUSTRIES.map((industry) => (
              <li key={industry.slug} className="home-industries__slide">
                <a
                  className="home-industries__card"
                  href={industryPath(locale, industry.slug as IndustrySlug)}
                >
                  <img
                    className="home-industries__photo"
                    src={industry.image}
                    alt=""
                    width={640}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                  <span className="home-industries__shade" aria-hidden="true" />
                  <span className="home-industries__card-copy">
                    <span className="home-industries__name">{industry.name}</span>
                    <span className="home-industries__body">{industry.body}</span>
                    <span className="home-industries__cta">
                      See how it works
                      <svg width="14" height="14" viewBox="0 0 14 14" focusable="false" aria-hidden="true">
                        <path
                          d="M3 7h8M8 3.5 11.5 7 8 10.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
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

          <div className="home-industries__controls">
            <div className="home-industries__arrows">
              <button
                type="button"
                className="home-industries__arrow"
                aria-label="Previous industry"
                disabled={active <= 0}
                onClick={() => step(-1)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" focusable="false" aria-hidden="true">
                  <path
                    d="M11.5 4.5 7 9l4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="home-industries__arrow"
                aria-label="Next industry"
                disabled={active >= INDUSTRIES.length - 1}
                onClick={() => step(1)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" focusable="false" aria-hidden="true">
                  <path
                    d="M6.5 4.5 11 9l-4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="home-industries__dots" role="tablist" aria-label="Industry slides">
              {INDUSTRIES.map((industry, i) => (
                <button
                  key={industry.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Show ${industry.name}`}
                  className={`home-industries__dot${i === active ? ' is-active' : ''}`}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
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

function buildFaqs(locale: Locale): Faq[] {
  const sol = (slug: IndustrySlug, label: string) =>
    `<a href="${industryPath(locale, slug)}">${label}</a>`;
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
          <a className="btn btn--primary home-faq__cta" href={localePath(locale, '/get-in-touch')}>
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
