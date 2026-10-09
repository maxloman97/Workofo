/**
 * Stats band — figures already used on the EN homepage / case.
 * Do not invent scale metrics.
 */
const STATS = [
  {
    value: '5–15%',
    label: 'Typical capacity unlock',
  },
  {
    value: '15 min',
    label: 'Demand forecast intervals',
  },
  {
    value: '2+',
    label: 'Years in production',
  },
] as const;

export default function HomeStats() {
  return (
    <section className="home-stats" aria-labelledby="home-stats-heading" data-reveal>
      <div className="home-stats__inner">
        <header className="home-stats__intro">
          <p className="t-overline home-stats__eyebrow">By the numbers</p>
          <h2 id="home-stats-heading">What shift-based teams measure with Workofo</h2>
        </header>

        <ul className="home-stats__grid">
          {STATS.map((stat) => (
            <li key={stat.label}>
              <p className="home-stats__value">{stat.value}</p>
              <p className="home-stats__label">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
