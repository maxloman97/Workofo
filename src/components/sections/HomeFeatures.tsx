/** Drop a short product GIF/clip path here when ready. */
const PRODUCT_CLIP_SRC: string | null = null;

/** Kept for later — not rendered on EN home for now. */
export const FEATURE_CARDS = [
  {
    title: 'Demand forecasting',
    body: 'Forecast workload, sales, volume or service demand so you know how much staffing is needed before you build the schedule.',
    href: '#calculate-potential',
  },
  {
    title: 'Automated staff scheduling',
    body: 'Turn demand, availability and labor rules into optimized employee schedules managers can review, adjust and publish.',
    href: '#ai-scheduling-assistant',
  },
] as const;

const POINTS = [
  {
    title: 'Forecast demand',
    body: 'Turn real demand into accurate staffing needs.',
  },
  {
    title: 'Apply labor rules',
    body: 'Account for contracts, skills and availability.',
  },
  {
    title: 'Optimize schedules',
    body: 'Build schedules around demand automatically.',
  },
  {
    title: 'Adapt to change',
    body: 'Re-optimize when demand or availability shifts.',
  },
] as const;

export default function HomeFeatures() {
  return (
    <section className="home-features" aria-labelledby="home-features-heading">
      <div className="home-features__inner">
        <div className="home-features__top">
          <header className="home-features__intro">
            <p className="t-overline home-features__eyebrow">Employee scheduling software</p>
            <h2 id="home-features-heading">
              Employee scheduling that starts with demand, not last week’s template.
            </h2>
            <p className="lede home-features__lede">
              Workofo combines demand forecasting, labor rules and automated staff scheduling to create optimized
              schedules around real demand.
            </p>
          </header>

          <figure className="home-features__clip" aria-label="Workofo product preview">
            {PRODUCT_CLIP_SRC ? (
              <img
                className="home-features__clip-media"
                src={PRODUCT_CLIP_SRC}
                alt="Workofo product in action"
                width={960}
                height={720}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="home-features__clip-placeholder">
                <p className="home-features__clip-label">Feature visual</p>
              </div>
            )}
          </figure>
        </div>

        <ul className="home-features__points" data-reveal>
          {POINTS.map((point) => (
            <li key={point.title} className="home-features__point">
              <div className="home-features__point-body">
                <span className="home-features__check" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 14 14" focusable="false">
                    <path
                      d="M2.5 7.2 5.4 10l6.1-6.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
              <span className="home-features__point-wave" aria-hidden="true">
                <svg viewBox="0 0 320 56" preserveAspectRatio="none" focusable="false">
                  <path
                    d="M0 34c36-16 72-24 108-18 28 5 52 18 80 20 36 3 72-10 100-22 12-5 22-10 32-14v56H0V34z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
