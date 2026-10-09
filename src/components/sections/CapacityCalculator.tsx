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
    const text = Number.isInteger(rounded)
      ? String(rounded)
      : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    return `€${text}m`;
  }
  if (n >= 1_000) {
    const k = Math.round(n / 1000);
    return `€${k.toLocaleString('en-US')}k`;
  }
  return `€${Math.round(n).toLocaleString('en-US')}`;
}

function formatDisplay(n: number, prefix?: string, suffix?: string) {
  const core = Math.round(n).toLocaleString('en-US');
  return `${prefix ?? ''}${core}${suffix ?? ''}`;
}

type SliderFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  minLabel: string;
  maxLabel: string;
};

function SliderField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
  hint,
  minLabel,
  maxLabel,
}: SliderFieldProps) {
  const numeric = clampNumber(value, min, min, max);
  const percent = ((numeric - min) / (max - min)) * 100;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(numeric));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setDraft(String(Math.round(numeric)));
  }, [numeric, editing]);

  useEffect(() => {
    if (!editing || !inputRef.current) return;
    const el = inputRef.current;
    // Click-to-edit: select all. Key-to-edit: keep the typed digit and place caret at end.
    if (draft === String(Math.round(numeric))) {
      el.select();
    } else {
      el.focus();
      const n = el.value.length;
      el.setSelectionRange(n, n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when entering edit mode
  }, [editing]);

  const commit = () => {
    const next = clampNumber(draft, numeric, min, max);
    onChange(String(Math.round(next)));
    setEditing(false);
  };

  return (
    <div className="calc-slider">
      <div className="calc-slider__header">
        <label className="calc-slider__label" htmlFor={id}>
          {label}
        </label>
        {editing ? (
          <span className="calc-slider__value is-editing">
            {prefix ? <span aria-hidden="true">{prefix}</span> : null}
            <input
              ref={inputRef}
              type="text"
              inputMode="decimal"
              value={draft}
              aria-label={label}
              onChange={(e) => setDraft(e.target.value.replace(/[^\d.]/g, ''))}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  commit();
                }
                if (e.key === 'Escape') {
                  setDraft(String(Math.round(numeric)));
                  setEditing(false);
                }
              }}
            />
            {suffix ? <span aria-hidden="true">{suffix}</span> : null}
          </span>
        ) : (
          <button
            type="button"
            className="calc-slider__value"
            onClick={() => setEditing(true)}
            onKeyDown={(e) => {
              // Digits / decimal start typing immediately
              if (e.key.length === 1 && /[\d.]/.test(e.key)) {
                e.preventDefault();
                setDraft(e.key === '.' ? '0.' : e.key);
                setEditing(true);
              }
            }}
            aria-label={`Edit ${label}, currently ${formatDisplay(numeric, prefix, suffix)}`}
          >
            <span className="calc-slider__value-text">
              {formatDisplay(numeric, prefix, suffix)}
            </span>
            <span className="calc-slider__edit" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 12 12" focusable="false">
                <path
                  d="M8.6 1.4a1.1 1.1 0 0 1 1.55 1.55L4.2 8.9 1.5 9.5l.6-2.7L8.6 1.4z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
        )}
      </div>

      <div className="calc-slider__control">
        <input
          id={id}
          className="calc-slider__range"
          type="range"
          min={min}
          max={max}
          step={step}
          value={numeric}
          onChange={(e) => onChange(e.target.value)}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={numeric}
          aria-label={label}
          style={{ ['--progress' as string]: `${percent}%` }}
        />
      </div>

      <div className="calc-slider__bounds" aria-hidden="true">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {hint ? <p className="calc-slider__hint">{hint}</p> : null}
    </div>
  );
}

export default function CapacityCalculator({ demoHref = '/get-in-touch' }: Props) {
  const [employees, setEmployees] = useState('250');
  const [hours, setHours] = useState('35');
  const [cost, setCost] = useState('20');

  const estimate = useMemo(() => {
    const e = clampNumber(employees, 250, 10, 5000);
    const h = clampNumber(hours, 35, 8, 60);
    const c = clampNumber(cost, 20, 8, 100);
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
          <h2 id="capacity-calc-heading">See what smarter workforce scheduling could unlock</h2>
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

              <SliderField
                id="calc-employees"
                label="Number of shift employees"
                value={employees}
                onChange={setEmployees}
                min={10}
                max={2000}
                step={10}
                minLabel="10"
                maxLabel="2,000"
              />

              <SliderField
                id="calc-hours"
                label="Average hours / week"
                value={hours}
                onChange={setHours}
                min={8}
                max={48}
                step={1}
                suffix="h"
                minLabel="8h"
                maxLabel="48h"
              />

              <SliderField
                id="calc-cost"
                label="Average hourly cost"
                value={cost}
                onChange={setCost}
                min={10}
                max={60}
                step={1}
                prefix="€"
                minLabel="€10"
                maxLabel="€60"
                hint="Include salary and employer costs."
              />

              <p className={`capacity-calc__live${thinking ? ' is-thinking' : ''}`}>
                <span className="capacity-calc__dot" aria-hidden="true" />
                {thinking ? 'Calculating your estimate…' : 'Estimate updates as you adjust'}
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
                    <span className="capacity-calc__approx" aria-label="approximately">
                      ≈
                    </span>
                    {shown.hoursLabel}
                    <span className="capacity-calc__unit">h</span>
                  </p>
                </div>
                <div className="capacity-calc__metric">
                  <p className="capacity-calc__metric-label">Annual capacity value</p>
                  <p className="capacity-calc__value">
                    <span className="capacity-calc__approx" aria-label="approximately">
                      ≈
                    </span>
                    {shown.valueLabel}
                  </p>
                </div>
              </div>

              <p className="capacity-calc__basis">
                Based on 12% more effective capacity, within the typical 5–15% range.
              </p>

              <div className="capacity-calc__actions">
                <a className="btn btn--primary capacity-calc__cta" href={demoHref}>
                  Book a demo
                </a>
                <span className="capacity-calc__hint">
                  <button
                    type="button"
                    className="capacity-calc__hint-trigger"
                    aria-describedby="calc-estimate-tip"
                  >
                    How we estimate
                  </button>
                  <span id="calc-estimate-tip" role="tooltip" className="capacity-calc__tooltip">
                    Weekly hours × 12% illustrative capacity unlock, scaled to a month for hours and a year for
                    capacity value using your average hourly cost.
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
