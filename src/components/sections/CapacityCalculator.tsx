import { useEffect, useMemo, useRef, useState } from 'react';

const THINK_MS = 800;
const CAPACITY_GAIN = 0.12;

type Props = {
  demoHref?: string;
};

function clampNumber(value: string, fallback: number, min = 0, max = 1_000_000) {
  const n = Number(String(value).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function formatHours(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    const rounded = m >= 10 ? Math.round(m) : Math.round(m * 100) / 100;
    const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    return `€${text}m`;
  }
  if (n >= 1_000) {
    const k = Math.round(n / 1000);
    return `€${k.toLocaleString('en-US')}k`;
  }
  return `€${Math.round(n).toLocaleString('en-US')}`;
}

export default function CapacityCalculator({ demoHref = '/en/get-in-touch' }: Props) {
  const [employees, setEmployees] = useState('250');
  const [hours, setHours] = useState('35');
  const [cost, setCost] = useState('20');
  const [showMethod, setShowMethod] = useState(false);

  const estimate = useMemo(() => {
    const e = clampNumber(employees, 250, 1, 100_000);
    const h = clampNumber(hours, 35, 1, 168);
    const c = clampNumber(cost, 20, 1, 10_000);
    const weekly = e * h;
    const monthHours = weekly * CAPACITY_GAIN * (52 / 12);
    const yearValue = weekly * 52 * c * CAPACITY_GAIN;
    return {
      hoursLabel: formatHours(monthHours),
      valueLabel: formatMoney(yearValue),
    };
  }, [employees, hours, cost]);

  const [shown, setShown] = useState(estimate);
  const [thinking, setThinking] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setThinking(true);
    const t = window.setTimeout(() => {
      setShown(estimate);
      setThinking(false);
    }, THINK_MS);
    return () => window.clearTimeout(t);
  }, [estimate]);

  return (
    <section id="calculate-potential" className="capacity-calc" aria-labelledby="capacity-calc-heading">
      <div className="capacity-calc__inner">
        <header className="capacity-calc__intro">
          <p className="t-overline capacity-calc__eyebrow">Capacity calculator</p>
          <h2 id="capacity-calc-heading">See how much capacity Workofo could unlock</h2>
          <p className="lede capacity-calc__lede">
            Estimate the hours and capacity value hidden in your current schedules.
          </p>
        </header>

        <div className="capacity-calc__card">
          <div className="capacity-calc__grid">
            <div className="capacity-calc__inputs">
              <div className="capacity-calc__panel-head">
                <h3>Your workforce</h3>
                <p>Adjust the values to explore your potential.</p>
              </div>

              <label className="capacity-calc__field">
                <span>Number of shift employees</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  aria-label="Number of shift employees"
                />
              </label>

              <label className="capacity-calc__field">
                <span>Average hours per employee / week</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  aria-label="Average hours per employee per week"
                />
              </label>

              <label className="capacity-calc__field">
                <span>Average hourly cost</span>
                <div className="capacity-calc__money">
                  <span className="capacity-calc__currency" aria-hidden="true">
                    €
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cost}
                    onChange={(e) => setCost(e.target.value.replace(/^€/, ''))}
                    aria-label="Average hourly cost in euros"
                  />
                </div>
                <small>Include salary and employer costs.</small>
              </label>

              <p className={`capacity-calc__live${thinking ? ' is-thinking' : ''}`}>
                <span className="capacity-calc__dot" aria-hidden="true" />
                {thinking ? 'Calculating your estimate…' : 'Estimate updates as you type'}
              </p>
            </div>

            <div className="capacity-calc__results">
              <div className="capacity-calc__panel-head">
                <h3>Your estimated potential</h3>
              </div>

              <div
                className={`capacity-calc__metrics${thinking ? ' is-thinking' : ''}`}
                aria-live="polite"
                aria-busy={thinking}
              >
                <div className="capacity-calc__metric">
                  <p className="capacity-calc__metric-label">Hours unlocked per month</p>
                  <p className="capacity-calc__value">
                    <span className="capacity-calc__approx" aria-label="approximately">≈</span>
                    {shown.hoursLabel}
                    <span className="capacity-calc__unit">h</span>
                  </p>
                </div>
                <div className="capacity-calc__metric">
                  <p className="capacity-calc__metric-label">Annual capacity value</p>
                  <p className="capacity-calc__value">
                    <span className="capacity-calc__approx" aria-label="approximately">≈</span>
                    {shown.valueLabel}
                  </p>
                </div>
              </div>

              <p className="capacity-calc__basis">
                Based on 12% more effective capacity, within the typical 5–15% range.
              </p>

              <a className="btn btn--primary capacity-calc__cta" href={demoHref}>
                Book a demo
              </a>

              <button
                type="button"
                className="capacity-calc__method-link"
                onClick={() => setShowMethod((v) => !v)}
                aria-expanded={showMethod}
              >
                See how the estimate works
              </button>

              {showMethod && (
                <p className="capacity-calc__method">
                  Weekly hours × 12% capacity unlock, scaled to a month (52/12) for hours and to a full
                  year for capacity value using your average hourly cost.
                </p>
              )}
            </div>
          </div>

          <p className="capacity-calc__disclaimer">
            Illustrative estimate based on 52 weeks. Capacity value is not guaranteed cash savings.
          </p>
        </div>
      </div>
    </section>
  );
}
