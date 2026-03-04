import HeraldryDivider from './HeraldryDivider';

/* ── Tudor Rose SVG ── */
function TudorRose({ size = 28 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden="true"
    >
      {/* Outer red petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <ellipse
          key={i}
          cx="20" cy="20"
          rx="5" ry="10"
          fill="#8b0000"
          fillOpacity="0.85"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      {/* Inner white petals */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg, i) => (
        <ellipse
          key={`w${i}`}
          cx="20" cy="20"
          rx="3" ry="7"
          fill="#f5f0e8"
          fillOpacity="0.9"
          transform={`rotate(${deg} 20 20)`}
        />
      ))}
      {/* Golden centre */}
      <circle cx="20" cy="20" r="5" fill="#c9a84c" />
      <circle cx="20" cy="20" r="2" fill="#9c7a35" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top ornamental divider */}
        <HeraldryDivider gold="#9c7a35" className="mb-8" />

        <div className="grid md:grid-cols-3 gap-8 items-start">

          {/* Brand + Mission */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TudorRose size={24} />
              <p
                style={{
                  fontFamily: 'Cinzel, Georgia, serif',
                  color: 'var(--gold-light)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                The British Library
              </p>
            </div>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                color: 'var(--gold-pale)',
                fontSize: '1rem',
                lineHeight: '1.7',
                opacity: 0.85,
              }}
            >
              Preserving and curating the United Kingdom web record as a permanent public knowledge collection — for researchers, institutions, and future generations.
            </p>
          </div>

          {/* Heritage note */}
          <div className="md:text-center">
            <p
              style={{
                fontFamily: 'UnifrakturMaguntia, cursive',
                color: 'var(--gold)',
                fontSize: '1.6rem',
                lineHeight: '1.2',
                marginBottom: '0.5rem',
              }}
            >
              UK Web Archive
            </p>
            <p
              style={{
                fontFamily: 'IM Fell English SC, Georgia, serif',
                color: 'var(--gold-dark)',
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              Established in Service to the Nation
            </p>
          </div>

          {/* Legal */}
          <div className="md:text-right">
            <p
              style={{
                fontFamily: 'Cinzel, Georgia, serif',
                color: 'var(--gold-pale)',
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
              }}
            >
              &copy; {year} UK Web Archive
            </p>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                color: 'var(--gold-dark)',
                fontSize: '0.85rem',
                marginTop: '0.25rem',
                lineHeight: '1.5',
              }}
            >
              Operated under the Legal Deposit Libraries Act.<br />
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom ornament */}
        <HeraldryDivider gold="#7a5f28" className="mt-8" />

        <p
          className="text-center mt-4"
          style={{
            fontFamily: 'IM Fell English SC, Georgia, serif',
            color: 'var(--gold-dark)',
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          ✦  Honi soit qui mal y pense  ✦
        </p>
      </div>
    </footer>
  );
}
