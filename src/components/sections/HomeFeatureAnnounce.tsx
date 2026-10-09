type Props = {
  demoHref?: string;
};

export default function HomeFeatureAnnounce({ demoHref = '/get-in-touch' }: Props) {
  return (
    <section
      id="ai-scheduling-assistant"
      className="home-announce"
      aria-labelledby="home-announce-heading"
    >
      <div className="home-announce__inner">
        <div className="home-announce__copy">
          <div className="home-announce__kicker">
            <p className="t-overline home-announce__eyebrow">AI scheduling assistant</p>
            <span className="home-announce__badge">New</span>
          </div>
          <h2 id="home-announce-heading">Adjust employee schedules with AI, in plain language.</h2>
          <p className="lede home-announce__lede">
            Tell Workofo what changed. Add a shift, change staffing levels, move employees or update constraints using
            natural language. Workofo applies the changes to the schedule while keeping you in control of what gets
            published.
          </p>
          <div className="home-announce__actions">
            <a className="btn btn--primary" href={demoHref}>
              Book a demo
            </a>
          </div>
        </div>

        <figure className="home-announce__panel" aria-label="Feature preview placeholder">
          <div className="home-announce__placeholder">
            <p className="home-announce__placeholder-label">Feature visual</p>
          </div>
        </figure>
      </div>
    </section>
  );
}
