import type { CmsSection } from '../../lib/cms';
import { imgSrc, parseItemsJson, richToHtml } from '../../lib/rich';

type Props = { section: CmsSection };

function ThemedBlock({ label }: { label?: string }) {
  return (
    <div className="themed-block" aria-hidden="true">
      <span>{label || 'Workofo'}</span>
    </div>
  );
}

export function Hero({ section }: Props) {
  const src = imgSrc(section.image, 1400, 900);
  return (
    <section className="hero">
      <div className="hero__copy">
        {section.heading && <h1>{section.heading}</h1>}
        {section.subheading && <p className="lede">{section.subheading}</p>}
        {section.ctaLabel && section.ctaUrl && (
          <a className="btn btn--primary" href={section.ctaUrl}>
            {section.ctaLabel}
          </a>
        )}
      </div>
      <div className="hero__visual">{src ? <img src={src} alt="" /> : <ThemedBlock />}</div>
    </section>
  );
}

export function TextImage({ section }: Props) {
  const src = imgSrc(section.image, 900, 700);
  const html = richToHtml(section.body);
  return (
    <section className="text-image">
      <div>
        {section.heading && <h2>{section.heading}</h2>}
        {section.subheading && <p className="muted">{section.subheading}</p>}
        {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
      </div>
      <div className="text-image__media">{src ? <img src={src} alt="" /> : <ThemedBlock label="Visual" />}</div>
    </section>
  );
}

export function RichText({ section }: Props) {
  const html = richToHtml(section.body);
  return (
    <section className="rich-text">
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p className="muted">{section.subheading}</p>}
      {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
    </section>
  );
}

export function FeatureGrid({ section }: Props) {
  const items = parseItemsJson<{ title?: string; body?: string }>(section.items);
  return (
    <section className="feature-grid">
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p className="muted">{section.subheading}</p>}
      <div className="feature-grid__list">
        {items.map((item, i) => (
          <article key={i} className="feature">
            <h3>{item.title || `Feature ${i + 1}`}</h3>
            {item.body && <p>{item.body}</p>}
          </article>
        ))}
        {items.length === 0 && <p className="muted">Add JSON items in the CMS `items` field.</p>}
      </div>
    </section>
  );
}

export function Pricing({ section }: Props) {
  const tiers = parseItemsJson<{
    name?: string;
    price?: string;
    period?: string;
    features?: string[];
  }>(section.items);
  return (
    <section className="pricing">
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p className="muted">{section.subheading}</p>}
      <div className="pricing__grid">
        {tiers.map((tier, i) => (
          <article key={i} className="tier">
            <h3>{tier.name || `Plan ${i + 1}`}</h3>
            <p className="tier__price">
              {tier.price}
              {tier.period && <span>{tier.period}</span>}
            </p>
            <ul>
              {(tier.features || []).map((f, j) => (
                <li key={j}>{f}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Testimonial({ section }: Props) {
  const html = richToHtml(section.body);
  return (
    <section className="testimonial">
      {section.heading && <blockquote>{section.heading}</blockquote>}
      {section.subheading && <cite>{section.subheading}</cite>}
      {html && <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />}
    </section>
  );
}

export function Cta({ section }: Props) {
  return (
    <section className="cta-band">
      {section.heading && <h2>{section.heading}</h2>}
      {section.subheading && <p>{section.subheading}</p>}
      {section.ctaLabel && section.ctaUrl && (
        <a className="btn btn--primary" href={section.ctaUrl}>
          {section.ctaLabel}
        </a>
      )}
    </section>
  );
}
