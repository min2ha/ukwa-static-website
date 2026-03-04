import { NavLink } from 'react-router-dom';
import HeraldryDivider from '../components/HeraldryDivider';

/* ── Inline SVG icons ── */
function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function MagnifyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Data ── */
const STATS = [
  { number: '800M+',  label: 'Pages Archived',        sub: 'And still counting' },
  { number: '21 yrs', label: 'Of Digital History',     sub: 'Since 2004' },
  { number: '6',      label: 'Legal Deposit Libraries', sub: 'Working together' },
];

const REASONS = [
  {
    Icon: ClockIcon,
    tag: 'Preservation',
    title: 'History is disappearing',
    body: 'Up to 25% of web pages from a decade ago no longer exist. News articles, government pages, community blogs — gone overnight. We capture them before they vanish forever.',
  },
  {
    Icon: MagnifyIcon,
    tag: 'Discovery',
    title: 'Research without limits',
    body: 'Need to see how a website looked in 2008? Want to verify what a politician promised? The archive lets you travel through time — no DeLorean required.',
  },
  {
    Icon: ShieldIcon,
    tag: 'Accountability',
    title: 'Hold the record straight',
    body: 'Government policies, corporate claims, breaking news — the archive keeps them honest. What was published online doesn\'t have to disappear when it\'s inconvenient.',
  },
  {
    Icon: HeartIcon,
    tag: 'Culture',
    title: 'Digital culture, preserved',
    body: 'Fan sites, indie blogs, local news, community spaces — the UK\'s digital soul lives here. Your internet childhood is worth preserving just as much as any museum exhibit.',
  },
];

/* ── Main Component ── */
export default function HomePage({ theme }) {
  const isDark = theme === 'dark';

  return (
    <main>

      {/* ════════════════ HERO ════════════════ */}
      <section className="home-hero">
        {/* Gothic tracery overlay */}
        <div className="home-hero-tracery" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">

          {/* Live badge */}
          <div className="hero-badge">
            <span className="hero-live-dot" aria-hidden="true" />
            <span>The British Library · Est. 2004</span>
          </div>

          {/* Main headline */}
          <h1 className="hero-headline">
            The Web Forgets.
            <br />
            <span className="hero-headline-accent">We Don't.</span>
          </h1>

          {/* Subhead */}
          <p className="hero-subhead">
            Millions of websites vanish every year — news articles, government records, cultural landmarks, community spaces.
            The UK Web Archive captures them all, preserving the digital history of a nation for everyone, forever.
          </p>

          {/* CTAs */}
          <div className="hero-cta-group">
            <NavLink to="/save-website" className="hero-cta-primary">
              <PlusIcon />
              Nominate a Website
            </NavLink>
            <a
              href="https://www.webarchive.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-secondary"
            >
              <SearchIcon />
              Search the Archive
            </a>
          </div>

          {/* Live whisper */}
          <p className="hero-whisper">✦ &thinsp; Archiving the UK web, right now &thinsp; ✦</p>
        </div>

        <HeraldryDivider gold="#9c7a35" className="relative z-10 px-6" />
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <section className="stats-band" aria-label="Archive statistics">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label} className={`stat-block${i < STATS.length - 1 ? ' stat-block-divider' : ''}`}>
                <span className="stat-number">{s.number}</span>
                <span className="stat-label">{s.label}</span>
                <span className="stat-sub">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ WHY IT MATTERS ════════════════ */}
      <section className={`reasons-section ${isDark ? 'reasons-section-dark' : 'reasons-section-light'}`}>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">

          <div className="section-header">
            <p className="section-eyebrow">Why Web Archiving Matters</p>
            <h2 className={`section-title ${isDark ? 'section-title-dark' : 'section-title-light'}`}>
              Every Link Is a Piece of History
            </h2>
            <p className={`section-sub ${isDark ? 'section-sub-dark' : 'section-sub-light'}`}>
              The internet moves fast. The archive doesn't let it forget.
            </p>
          </div>

          <div className="reasons-grid">
            {REASONS.map(({ Icon, tag, title, body }) => (
              <div
                key={title}
                className={`reason-card ${isDark ? 'reason-card-dark' : 'reason-card-light'}`}
              >
                <div className="reason-icon">
                  <Icon />
                </div>
                <span className="reason-tag">{tag}</span>
                <h3 className={`reason-title ${isDark ? 'reason-title-dark' : 'reason-title-light'}`}>{title}</h3>
                <p className={`reason-body ${isDark ? 'reason-body-dark' : 'reason-body-light'}`}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ GET INVOLVED ════════════════ */}
      <section className="engage-band" aria-label="Get involved">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">

          <div className="section-header">
            <p className="section-eyebrow engage-eyebrow">Join the Mission</p>
            <h2 className="section-title engage-title">
              You Can Shape What Gets Saved
            </h2>
            <p className="section-sub engage-sub">
              The archive isn't just for institutions. Anyone can contribute — and it takes less than a minute.
            </p>
          </div>

          <div className="engage-grid">
            <NavLink to="/save-website" className="engage-card">
              <span className="engage-card-icon" aria-hidden="true">⊕</span>
              <h3 className="engage-card-title">Nominate a Website</h3>
              <p className="engage-card-body">
                Know a UK website that deserves to be preserved? Submit it. Local news, indie blogs, community
                groups, cultural projects — every nomination helps shape what history remembers.
              </p>
              <span className="engage-card-cta">
                Submit a nomination <ArrowIcon />
              </span>
            </NavLink>

            <a
              href="https://www.webarchive.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="engage-card"
            >
              <span className="engage-card-icon" aria-hidden="true">⊙</span>
              <h3 className="engage-card-title">Explore the Archive</h3>
              <p className="engage-card-body">
                Search billions of archived pages. Discover what UK websites looked like years ago.
                Great for research, journalism, fact-checking — or pure nostalgia.
              </p>
              <span className="engage-card-cta">
                Start exploring <ArrowIcon />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════ TRUST / INSTITUTIONAL NOTE ════════════════ */}
      <section className={`trust-section ${isDark ? 'trust-section-dark' : 'trust-section-light'}`} aria-label="About the institution">
        <div className="max-w-3xl mx-auto px-6 py-14 text-center">
          <HeraldryDivider gold={isDark ? '#9c7a35' : '#c9a84c'} className="mb-8" />

          <p className={`trust-label ${isDark ? 'trust-label-dark' : 'trust-label-light'}`}>
            Operated by The British Library
          </p>
          <p className={`trust-body ${isDark ? 'trust-body-dark' : 'trust-body-light'}`}>
            Operated under the Legal Deposit Libraries Act and supported by six of the UK's greatest research
            libraries. The UK Web Archive is a public good — free, permanent, and for everyone.
          </p>

          <HeraldryDivider gold={isDark ? '#9c7a35' : '#c9a84c'} className="mt-8" />
        </div>
      </section>

    </main>
  );
}
