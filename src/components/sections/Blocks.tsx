import type { CmsSection } from '../../lib/cms';
import { WATCH_VIDEO_URL } from '../../lib/config';
import { ui, type Locale } from '../../lib/locales';
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

export function Hero({ section, locale = 'en' }: Props) {
  const demoHref = section.ctaUrl || `/${locale}/get-in-touch`;
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__stack">
          <div className="hero__copy">
            <p className="t-overline hero__eyebrow">{ui('heroEyebrow', locale)}</p>
            {section.heading && <h1 data-split>{section.heading}</h1>}
            {section.subheading && <p className="lede">{section.subheading}</p>}
            <div className="hero__actions">
              <a className="btn btn--primary btn--cta" href={demoHref}>
                {ui('bookDemo', locale)}
              </a>
              <a
                className="btn btn--ghost btn--cta"
                href={WATCH_VIDEO_URL}
                target="_blank"
                rel="noreferrer noopener"
              >
                <svg className="btn__icon" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
                  <path d="M3.2 1.6v10.8L12.2 7 3.2 1.6z" fill="currentColor" />
                </svg>
                {ui('watchVideo', locale)}
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

function resolveLogoSrc(image?: string): string {
  if (!image) return '';
  if (typeof image === 'string' && (image.startsWith('/') || image.startsWith('http'))) return image;
  return imgSrc(image, 360, 120);
}

function LogoMarqueeRow({
  items,
  duration,
}: {
  items: Array<{ name?: string; src: string }>;
  duration: number;
}) {
  const loop = items.length ? [...items, ...items, ...items] : [];
  return (
    <div className="marquee-row marquee-row--transparent">
      <div className="marquee-track marquee-track--logos" data-marquee data-duration={duration}>
        {loop.map((item, i) => (
          <span className="marquee-logo" key={`${item.name || 'logo'}-${i}`}>
            <img src={item.src} alt={item.name || ''} loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function LogoStrip({ section }: Props) {
  const items = parseItemsJson<{ name?: string; image?: string }>(section.items);
  const source = items.some((item) => item.image) ? items : CLIENT_LOGOS;
  const logos = source
    .map((item) => ({
      name: item.name,
      src: resolveLogoSrc(item.image),
    }))
    .filter((item) => item.src);

  return (
    <>
      <section className="section logo-strip shell__inner" data-reveal>
        {section.heading && <p className="t-overline section__eyebrow">{section.heading}</p>}
        {section.subheading && <p className="muted">{section.subheading}</p>}
      </section>
      {logos.length > 0 && (
        <div className="marquee-band marquee-band--logos">
          <LogoMarqueeRow items={logos} duration={60} />
        </div>
      )}
    </>
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
  const demoHref = section.ctaUrl || `/${locale}/get-in-touch`;
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
