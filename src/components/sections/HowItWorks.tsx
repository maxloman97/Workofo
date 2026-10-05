import { useEffect, useRef, useState } from 'react';

type Step = { title: string; body?: string };

type Props = {
  steps: Step[];
  note?: string;
  demoHref?: string;
};

const ADVANCE_MS = 6000;

const VISUALS: Array<{ test: RegExp; src: string; alt: string }> = [
  { test: /forecast/i, src: '/steps-forecast.png?v=5', alt: 'AI demand forecast curve' },
  { test: /constraint|rule/i, src: '/steps-constraints.png?v=5', alt: 'Labor rules applied to shifts' },
  { test: /optimi/i, src: '/steps-optimize.png?v=5', alt: 'Optimized demand-driven shifts' },
  { test: /adjust|change/i, src: '/steps-adjust.png?v=5', alt: 'Fast replanning when things change' },
];

function visualFor(title: string, i: number) {
  return VISUALS.find((v) => v.test.test(title)) ?? VISUALS[i % VISUALS.length];
}

export default function HowItWorks({ steps, note, demoHref = '/en/get-in-touch' }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = rootRef.current;
    if (reduce || !el) return;
    const io = new IntersectionObserver(([entry]) => setAutoplay(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = autoplay && !paused && steps.length > 1;

  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % steps.length), ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [running, active, steps.length]);

  if (!steps.length) return null;

  const [noteLead, ...noteParts] = (note ?? '').split(/\s+—\s+/);
  const noteRest = noteParts.join(' — ');

  return (
    <section
      ref={rootRef}
      className="how-it-works"
      aria-labelledby="how-it-works-heading"
      style={{ ['--hiw-advance' as string]: `${ADVANCE_MS}ms` }}
    >
      <div className="how-it-works__inner">
        <header className="how-it-works__intro">
          <div className="how-it-works__heading">
            <p className="t-overline how-it-works__eyebrow">How Workofo works</p>
            <h2 id="how-it-works-heading">From demand forecast to a ready schedule</h2>
          </div>
          <p className="lede how-it-works__lede">
            Every shift is built on real demand and the rules you already work under. That is where the
            extra 5–15% capacity comes from.
          </p>
        </header>

        <div
          className="how-it-works__body"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <ol className="how-it-works__steps">
            {steps.map((step, i) => {
              const isActive = i === active;
              const visual = visualFor(step.title, i);
              return (
                <li key={i} className={`how-it-works__step${isActive ? ' is-active' : ''}`}>
                  <button
                    type="button"
                    className="how-it-works__trigger"
                    aria-expanded={isActive}
                    aria-controls={`hiw-panel-${i}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="how-it-works__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="how-it-works__title">{step.title}</span>
                  </button>
                  <div id={`hiw-panel-${i}`} className="how-it-works__detail">
                    <div className="how-it-works__detail-inner">
                      {step.body && <p>{step.body}</p>}
                      <figure className="how-it-works__inline-visual">
                        <img src={visual.src} alt="" loading="lazy" decoding="async" width={905} height={1024} />
                      </figure>
                    </div>
                  </div>
                  <span
                    className={`how-it-works__progress${isActive && running ? ' is-running' : ''}`}
                    aria-hidden="true"
                  />
                </li>
              );
            })}
          </ol>

          <figure className="how-it-works__visual" aria-live="polite">
            {steps.map((step, i) => {
              const visual = visualFor(step.title, i);
              return (
                <img
                  key={i}
                  src={visual.src}
                  alt={i === active ? visual.alt : ''}
                  aria-hidden={i !== active}
                  className={i === active ? 'is-active' : ''}
                  loading="lazy"
                  decoding="async"
                  width={905}
                  height={1024}
                />
              );
            })}
            <figcaption>
              <span className="how-it-works__visual-num">{String(active + 1).padStart(2, '0')}</span>
              {steps[active].title}
            </figcaption>
          </figure>
        </div>

        <footer className="how-it-works__footer">
          {note && (
            <p className="how-it-works__note">
              <span className="how-it-works__note-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                  <path
                    d="M8 1.75 2.75 3.9v3.7c0 3.1 2.2 5.6 5.25 6.65 3.05-1.05 5.25-3.55 5.25-6.65V3.9L8 1.75Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path d="m5.6 8.1 1.7 1.7 3.2-3.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="how-it-works__note-text">
                {noteLead && <strong>{noteLead}</strong>}
                {noteRest && <span>{noteLead ? ` — ${noteRest}` : noteRest}</span>}
              </span>
            </p>
          )}
          <a className="btn btn--primary how-it-works__cta" href={demoHref}>
            Book a demo
          </a>
        </footer>
      </div>
    </section>
  );
}
