import HeraldryDivider from './HeraldryDivider';

export default function FooterLogos({ theme }) {
  const isDark = theme === 'dark';

  return (
    <section
      style={{
        borderTop: '1px solid var(--gold-dark)',
        borderBottom: '1px solid var(--gold-dark)',
        background: isDark
          ? 'linear-gradient(180deg, rgba(13,27,71,0.55) 0%, rgba(7,15,43,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(245,240,232,0.9) 0%, rgba(237,229,208,0.95) 100%)',
      }}
      className="py-10"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-5">
          <p
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              color: isDark ? 'var(--gold-dark)' : 'var(--navy)',
              fontSize: '0.65rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
            }}
          >
            ✦  Partner Institutions  ✦
          </p>
        </div>

        <HeraldryDivider
          gold={isDark ? '#7a5f28' : '#c9a84c'}
          className="mb-6"
        />

        <div
          className="heritage-panel p-6 md:p-8"
          style={{ borderRadius: '2px' }}
        >
          <img
            src="/images/footer/about-logos.png"
            alt="Partner institutions including The British Library, National Library of Scotland, National Library of Wales, Bodleian Libraries, Cambridge University Library, and Trinity College Dublin"
            className="max-w-full h-auto mx-auto block"
            style={{ filter: isDark ? 'brightness(0.88) contrast(1.05)' : 'none' }}
          />
        </div>

        <HeraldryDivider
          gold={isDark ? '#7a5f28' : '#c9a84c'}
          className="mt-6"
        />
      </div>
    </section>
  );
}
