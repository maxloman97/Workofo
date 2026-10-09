import { useEffect, useRef } from 'react';

/**
 * Arlanda video case — empty player until VIDEO_SRC is set.
 * Contained card that expands to full-bleed on scroll (Zendesk-style).
 * Dark shell; neutral player chrome (no accent orange).
 */
const VIDEO_SRC: string | null = null;

export default function ArlandaCase() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Desktop: hold the contained card longer before full-bleed. Mobile keeps the original window.
      const desktop = window.matchMedia('(min-width: 961px)').matches;

      let progress: number;
      if (reduce) {
        progress = rect.top < vh * (desktop ? 0.42 : 0.55) ? 1 : 0;
      } else {
        // 0 while below fold; reaches 1 as the section settles near the top third
        const start = vh * (desktop ? 0.58 : 0.82);
        const end = vh * (desktop ? 0.16 : 0.28);
        progress = (start - rect.top) / (start - end);
        progress = Math.min(1, Math.max(0, progress));
      }

      el.style.setProperty('--expand', progress.toFixed(4));
      el.classList.toggle('is-expanded', progress > 0.92);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="arlanda-case"
      className="arlanda-case"
      aria-labelledby="arlanda-case-heading"
      style={{ ['--expand' as string]: '0' }}
    >
      <div className="arlanda-case__shell">
        <div className="arlanda-case__inner">
          <div className="arlanda-case__media">
            {VIDEO_SRC ? (
              <video className="arlanda-case__video" controls playsInline preload="metadata">
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            ) : (
              <button
                type="button"
                className="arlanda-case__player"
                aria-label="Case film coming soon"
                disabled
              >
                <span className="arlanda-case__play" aria-hidden="true">
                  {/* Original circular play mark — filled circle + rounded triangle (not a Flaticon asset). */}
                  <svg viewBox="0 0 48 48" width="64" height="64" focusable="false">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M24 2c12.15 0 22 9.85 22 22S36.15 46 24 46 2 36.15 2 24 11.85 2 24 2Zm-4.6 12.35c0-1.2 1.28-1.95 2.32-1.32l13.05 7.9c.98.6.98 2.05 0 2.64l-13.05 7.9c-1.04.63-2.32-.12-2.32-1.32V14.35Z"
                    />
                  </svg>
                </span>
                <span className="arlanda-case__player-label">Case film coming soon</span>
              </button>
            )}
          </div>

          <div className="arlanda-case__copy">
            <p className="t-overline arlanda-case__eyebrow">Case study</p>
            <h2 id="arlanda-case-heading">Arlanda Airport</h2>
            <p className="lede arlanda-case__lede">
              Sweden’s biggest airport. Staffing matched to passenger demand across terminals.
            </p>

            <blockquote className="arlanda-case__quote">
              <p>
                “We plan shifts to the terminal’s actual traffic, not last week’s template.”
              </p>
            </blockquote>

            <ul className="arlanda-case__results">
              <li>
                <strong>~12%</strong>
                <span>effective capacity</span>
              </li>
              <li>
                <strong>15 min</strong>
                <span>demand intervals</span>
              </li>
              <li>
                <strong>Fewer</strong>
                <span>last-minute changes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
