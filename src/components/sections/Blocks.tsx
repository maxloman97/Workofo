import type { CSSProperties } from 'react';
import type { CmsSection } from '../../lib/cms';
import { WATCH_VIDEO_URL } from '../../lib/config';
import { isModernHomeLocale, ui, type Locale } from '../../lib/locales';
import { localePath } from '../../lib/paths';
import { imgSrc, parseItemsJson, richToHtml } from '../../lib/rich';

type Props = { section: CmsSection; locale?: Locale };

const ASSETS = {
  showcase: [
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/1378116b-7d3d-4053-a18a-eda2bbd4414c_800w.webp',
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c84b7f97-eae3-47f2-b1c9-b368ba61f05f_800w.webp',
    'https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/91126dae-53d0-49d3-b421-2b3d436408b8_800w.png',
  ],
};

const CLIENT_LOGOS = [
  { name: 'Telenordi', image: '/clients/telenordi.png?v=2' },
  { name: 'Senukai', image: '/clients/senukai.png?v=2' },
  { name: 'Barbora', image: '/clients/barbora.png?v=2' },
  { name: 'Tele2', image: '/clients/tele2.png?v=2' },
  { name: 'Planas Chuliganas', image: '/clients/planas-chuliganas.png?v=2' },
];

/** Modern homepage hero — EN SEO copy used as placeholder for SE until rewritten. */
const MODERN_HOME_HERO = {
  eyebrow: 'AI-powered workforce scheduling',
  heading: 'AI-powered employee scheduling software built around real demand',
  body: 'Forecast staffing demand, apply real-world labor rules and automatically create optimized employee schedules around when and where work actually happens.',
  primaryCta: 'Book a demo',
  secondaryCta: 'Calculate your potential',
} as const;

export function Hero({ section, locale = 'en' }: Props) {
  const modern = isModernHomeLocale(locale);
  // Modern home always uses the locale demo path; CMS may still hold an older /en/... CTA.
  const demoHref = modern
    ? localePath(locale, '/get-in-touch')
    : section.ctaUrl && !section.ctaUrl.startsWith('/en/')
      ? section.ctaUrl
      : localePath(locale, '/get-in-touch');
  const eyebrow = modern
    ? locale === 'se'
      ? ui('heroEyebrow', locale)
      : MODERN_HOME_HERO.eyebrow
    : ui('heroEyebrow', locale);
  const heading = modern ? MODERN_HOME_HERO.heading : section.heading;
  const body = modern ? MODERN_HOME_HERO.body : section.subheading;
  const primaryCta = modern
    ? locale === 'se'
      ? ui('bookDemo', locale)
      : MODERN_HOME_HERO.primaryCta
    : ui('bookDemo', locale);
  const secondaryHref = modern ? '#calculate-potential' : WATCH_VIDEO_URL;
  const secondaryCta = modern
    ? locale === 'se'
      ? ui('calculatePotential', locale)
      : MODERN_HOME_HERO.secondaryCta
    : ui('watchVideo', locale);

  return (
    <section className={`hero${modern ? ' hero--en' : ''}`}>
      <div className="hero__inner">
        <div className="hero__stack">
          <div className="hero__copy">
            <p className="t-overline hero__eyebrow">
              {modern && <span className="hero__eyebrow-dot" aria-hidden="true" />}
              {eyebrow}
            </p>
            {heading && <h1 data-split>{heading}</h1>}
            {body && <p className="lede">{body}</p>}
            <div className="hero__actions">
              <a className="btn btn--primary btn--cta" href={demoHref}>
                {primaryCta}
              </a>
              <a
                className="btn btn--ghost btn--cta"
                href={secondaryHref}
                {...(modern
                  ? {}
                  : { target: '_blank', rel: 'noreferrer noopener' })}
              >
                {!modern && (
                  <svg className="btn__icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                    <path d="M3.2 1.6v10.8L12.2 7 3.2 1.6z" fill="currentColor" />
                  </svg>
                )}
                {secondaryCta}
                {modern && (
                  <svg className="btn__icon btn__icon--trail btn__icon--down" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                    <path d="M7 2.5v9M3.5 8 7 11.5 10.5 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            </div>
          </div>

          <figure className="hero-preview">
            <img
              src="/workofo-preview.png?v=3"
              alt="Workofo scheduling illustration"
              width={1600}
              height={900}
              loading="eager"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ label }: { label: string }) {
  return (
    <section className="page-hero">
      <p className="t-overline section__eyebrow">{label}</p>
      <h1>{label}</h1>
    </section>
  );
}

/** Intrinsic aspect ratios so logos can be sized to equal visual area, not equal height. */
const LOGO_RATIOS: Record<string, number> = {
  telenordi: 8.07,
  senukai: 2.98,
  barbora: 4.77,
  tele2: 2.65,
  'planas chuliganas': 2.57,
};

function logoWidth(name?: string): number | undefined {
  const ratio = name ? LOGO_RATIOS[name.trim().toLowerCase()] : undefined;
  if (!ratio) return undefined;
  return Math.round(Math.sqrt(2500 * ratio));
}

function resolveLogoSrc(image?: string): string {
  if (!image) return '';
  if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http'))) return image;
  return imgSrc(image, 360, 120);
}

export function LogoStrip({ section, locale = 'en' }: Props) {
  const items = parseItemsJson<{ name?: string; image?: string }>(section.items);
  const source = items.some((item) => item.image) ? items : CLIENT_LOGOS;
  const logos = source
    .map((item) => ({
      name: item.name,
      src: resolveLogoSrc(item.image),
    }))
    .filter((item) => item.src);

  const label = isModernHomeLocale(locale)
    ? 'Trusted by teams across Europe'
    : section.heading || section.subheading || '';

  if (!logos.length && !label) return null;

  return (
    <section className="logo-proof" aria-label={label || 'Clients'} data-reveal>
      <div className="logo-proof__inner">
        {label && <p className="logo-proof__label">{label}</p>}
        {logos.length > 0 && (
          <ul className="logo-proof__row">
            {logos.map((item, i) => {
              const w = logoWidth(item.name);
              return (
                <li
                  className="logo-proof__item"
                  key={`${item.name || 'logo'}-${i}`}
                  style={w ? ({ '--logo-w': `${w}px` } as CSSProperties) : undefined}
                >
                  <img src={item.src} alt={item.name || ''} loading="lazy" decoding="async" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

const PROBLEM_IMAGES = [
  '/problem/static-schedules.png?v=2',
  '/problem/complex-rules.png?v=2',
  '/problem/mismatch.png?v=2',
];

function resolveItemImage(image?: string): string {
  if (!image) return '';
  if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http'))) return image;
  return imgSrc(image, 640, 400);
}

export function Problem({ section }: Props) {
  const items = parseItemsJson<{ title?: string; body?: string; image?: string }>(section.items);
  const html = richToHtml(section.body);
  return (
    <section className="section problem shell__inner" data-reveal>
      <div className="problem__intro">
        {section.heading && <h2 data-split>{section.heading}</h2>}
        {section.subheading && <p className="lede">{section.subheading}</p>}
        {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
      <div className="problem__grid">
        {items.map((item, i) => {
          const src = resolveItemImage(item.image) || PROBLEM_IMAGES[i % PROBLEM_IMAGES.length];
          return (
            <article key={i} className="problem__item">
              {src && (
                <figure className="problem__media">
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </figure>
              )}
              <div className="problem__copy">
                <h3>{item.title || `Point ${i + 1}`}</h3>
                {item.body && <p>{item.body}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Steps({ section }: Props) {
  const items = parseItemsJson<{ title?: string; body?: string }>(section.items);
  return (
    <section className="section steps shell__inner" data-reveal>
      <div className="steps__intro">
        {section.heading && <p className="t-overline section__eyebrow">{section.heading}</p>}
        {section.subheading && <h2 data-split>{section.subheading}</h2>}
      </div>
      <ol className="steps__list">
        {items.map((item, i) => {
          const title = item.title || `Step ${i + 1}`;
          const variant = /forecast/i.test(title)
            ? 'steps__item--forecast'
            : /constraint/i.test(title)
              ? 'steps__item--constraints'
              : /optimize/i.test(title)
                ? 'steps__item--optimize'
                : /adjust/i.test(title)
                  ? 'steps__item--adjust'
                  : '';
          return (
            <li key={i} className={`steps__item${variant ? ` ${variant}` : ''}`}>
              <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
              {item.body && <p>{item.body}</p>}
            </li>
          );
        })}
      </ol>
      {section.ctaLabel && <p className="steps__note">{section.ctaLabel}</p>}
    </section>
  );
}

export function Benefits({ section, locale = 'en' }: Props) {
  const items = parseItemsJson<{ title?: string; body?: string }>(section.items).slice(0, 4);
  const demoHref =
    section.ctaUrl && !section.ctaUrl.startsWith('/en/')
      ? section.ctaUrl
      : localePath(locale, '/get-in-touch');
  const ctaLabel = section.ctaLabel || ui('bookDemo', locale);
  const count = Math.max(items.length, 1);

  return (
    <section className="section benefits shell__inner" data-reveal>
      <div className="benefits__header">
        <div className="benefits__header-copy">
          {section.heading && <h2 data-split>{section.heading}</h2>}
          {section.subheading && <p className="lede">{section.subheading}</p>}
        </div>
        <a className="btn btn--primary" href={demoHref}>
          {ctaLabel}
        </a>
      </div>
      <div className={`benefits__grid benefits__grid--${count}`}>
        {items.map((item, i) => {
          const title = item.title || `Benefit ${i + 1}`;
          const isForecast = /forecast/i.test(title);
          return (
            <article
              key={i}
              className={`benefits__item benefits__item--${i + 1}${isForecast ? ' benefits__item--forecast' : ''}`}
            >
              <h3>{title}</h3>
              {item.body && <p>{item.body}</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function Testimonial({ section }: Props) {
  const html = richToHtml(section.body);
  return (
    <section className="testimonial">
      <div className="testimonial__inner" data-reveal>
        {section.ctaLabel && <p className="t-overline">{section.ctaLabel}</p>}
        {section.heading && <blockquote data-split>{section.heading}</blockquote>}
        {section.subheading && <cite>{section.subheading}</cite>}
        {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
    </section>
  );
}

export function CaseStudies({ section }: Props) {
  const items = parseItemsJson<{
    title?: string;
    challenge?: string;
    action?: string;
    result?: string;
  }>(section.items);
  const variants = ['stack-card--fintech', 'stack-card--luma', 'stack-card--os'];
  return (
    <section className="section case-studies shell__inner" data-reveal>
      {section.heading && <h2 data-split>{section.heading}</h2>}
      {section.subheading && <p className="lede">{section.subheading}</p>}
      <div className="stack-stage">
        <p className="stack-watermark" aria-hidden="true">
          Showcase
        </p>
        {items.map((item, i) => (
          <article key={i} className={`stack-card ${variants[i % variants.length]}`} data-stack>
            <h3>{item.title || `Case ${i + 1}`}</h3>
            <div className="case-studies__meta" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {item.challenge && (
                <div>
                  <strong style={{ color: '#fff' }}>Challenge</strong>
                  {item.challenge}
                </div>
              )}
              {item.action && (
                <div>
                  <strong style={{ color: '#fff' }}>What Workofo did</strong>
                  {item.action}
                </div>
              )}
              {item.result && (
                <div>
                  <strong style={{ color: '#fff' }}>Result</strong>
                  {item.result}
                </div>
              )}
            </div>
            <div className="stack-card__media">
              <div className="stack-card__media-inner">
                <img src={ASSETS.showcase[i % ASSETS.showcase.length]} alt="" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RichText({ section }: Props) {
  const html = richToHtml(section.body);
  const src = imgSrc(section.image, 1200, 800);
  return (
    <section className="section rich-text shell__inner" data-reveal>
      {section.heading && <h2 data-split>{section.heading}</h2>}
      {section.subheading && <p className="lede">{section.subheading}</p>}
      {src && <img src={src} alt="" style={{ borderRadius: 28, marginBottom: '1.25rem' }} />}
      {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
    </section>
  );
}

export function JobList({ section }: Props) {
  const items = parseItemsJson<{
    title?: string;
    body?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  }>(section.items);
  return (
    <section className="section job-list shell__inner" data-reveal>
      {section.heading && <h2 data-split>{section.heading}</h2>}
      {section.subheading && <p className="lede">{section.subheading}</p>}
      <div className="job-list__grid" style={{ gridTemplateColumns: '1fr' }}>
        {items.map((item, i) => (
          <article key={i} className="job-list__item">
            <h3>{item.title || `Role ${i + 1}`}</h3>
            {item.body && <p>{item.body}</p>}
            {item.ctaLabel && item.ctaUrl && (
              <a className="btn btn--ghost" href={item.ctaUrl}>
                {item.ctaLabel}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
