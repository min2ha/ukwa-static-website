import { useLanguage } from '../hooks/useLanguage';

export default function PageInfoStripe({ pageTitle }) {
  const lang = useLanguage();

  return (
    <div className="page-stripe">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center gap-2">
          {/* Fleur-de-lis accent */}
          <span
            style={{ color: 'var(--gold)', fontSize: '0.8rem' }}
            aria-hidden="true"
          >
            ⚜
          </span>

          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <span
                  style={{
                    fontFamily: 'Cinzel, Georgia, serif',
                    color: 'var(--gold-pale)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                  }}
                >
                  {lang.siteTitle}
                </span>
              </li>
              {pageTitle && (
                <>
                  <li aria-hidden="true">
                    <span style={{ color: 'var(--gold-dark)', fontSize: '0.7rem' }}>
                      ›
                    </span>
                  </li>
                  <li>
                    <span
                      style={{
                        fontFamily: 'IM Fell English SC, Georgia, serif',
                        color: 'var(--gold-light)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {pageTitle}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
}
