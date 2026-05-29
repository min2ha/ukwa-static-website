import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageInfoStripe from '../components/PageInfoStripe';
import { languages, languageOrder } from '../config/languages';
import { useCollectionData } from '../hooks/useCollectionData';

// ─── Localised microcopy ─────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Sitemap',
    lede: 'Every public page on the UK Web Archive, grouped by area. Use the filter to jump to anything in a second.',
    filterPlaceholder: 'Filter pages — try “FAQ”, “Brexit”, “contact”…',
    sectionMain: 'Main pages',
    sectionInformation: 'Information',
    sectionCollections: 'Featured collections',
    sectionLanguages: 'Languages',
    sectionExternal: 'External resources',
    statPages: 'Pages',
    statCollections: 'Collections',
    statTargets: 'Archived websites',
    statLanguages: 'Languages',
    viewAllCollections: 'View all collections and themes',
    empty: 'No pages match your filter.',
    external: 'External link',
    descMain: 'Quick paths to the core areas of the archive.',
    descInformation: 'Policies, accessibility, technical detail and help.',
    descCollections: 'Top curated themes — browse the full catalogue from any of these.',
    descLanguages: 'Browse the archive in your preferred language.',
    descExternal: 'Useful sites hosted elsewhere by the British Library.',
  },
  cy: {
    title: 'Map y Wefan',
    lede: "Pob tudalen gyhoeddus ar Archif We'r DU, wedi'i grwpio yn ôl ardal. Defnyddiwch yr hidlydd i fynd at unrhyw beth mewn eiliad.",
    filterPlaceholder: 'Hidlo tudalennau — rhowch gynnig ar “Cwestiynau”, “Brexit”, “cyswllt”…',
    sectionMain: 'Prif dudalennau',
    sectionInformation: 'Gwybodaeth',
    sectionCollections: 'Casgliadau dethol',
    sectionLanguages: 'Ieithoedd',
    sectionExternal: 'Adnoddau allanol',
    statPages: 'Tudalennau',
    statCollections: 'Casgliadau',
    statTargets: 'Gwefannau wedi archifo',
    statLanguages: 'Ieithoedd',
    viewAllCollections: "Gweld pob casgliad a thema",
    empty: 'Does dim tudalennau yn cyfateb i’r hidlydd.',
    external: 'Dolen allanol',
    descMain: "Llwybrau cyflym i rannau craidd yr archif.",
    descInformation: 'Polisïau, hygyrchedd, manylion technegol a chymorth.',
    descCollections: 'Prif themâu — porwch y catalog llawn o unrhyw un o’r rhain.',
    descLanguages: "Porwch yr archif yn eich iaith ddewisol.",
    descExternal: "Gwefannau defnyddiol a westeir mewn lleoedd eraill gan y Llyfrgell Brydeinig.",
  },
  gd: {
    title: 'Mapa na Làraich',
    lede: "Gach duilleag phoblach air Tasglann Lìn na RA, air a roinn ann am roinnean. Cleachd am pìos sgrùdaidh gus rud sam bith a lorg ann an diog.",
    filterPlaceholder: 'Sgrùd duilleagan — feuch “FAQ”, “Brexit”, “fios”…',
    sectionMain: 'Prìomh dhuilleagan',
    sectionInformation: 'Fiosrachadh',
    sectionCollections: 'Cruinneachaidhean taghte',
    sectionLanguages: 'Cànanan',
    sectionExternal: 'Goireasan an taobh a-muigh',
    statPages: 'Duilleagan',
    statCollections: 'Cruinneachaidhean',
    statTargets: 'Làraichean tasglannaichte',
    statLanguages: 'Cànanan',
    viewAllCollections: 'Faic gach cruinneachadh agus cuspair',
    empty: 'Chan eil duilleagan sam bith a’ freagairt ris an sgrùdadh.',
    external: 'Ceangal a-muigh',
    descMain: 'Slighean luath gu prìomh roinnean an tasglainn.',
    descInformation: 'Poileasaidhean, in-ruigsinneachd, fiosrachadh teicnigeach is taic.',
    descCollections: "Prìomh chuspairean — rùraich an catalog slàn bho ghin de seo.",
    descLanguages: 'Rùraich an tasglann anns a’ chànan as fheàrr leat.',
    descExternal: "Làraichean feumail a tha aig Leabharlann Bhreatainn an àite eile.",
  },
};

// ─── Icons (inline SVGs keep us dependency-free and theme-aware) ─────────────

const ICONS = {
  home: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
    </svg>
  ),
  collections: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  save: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
    </svg>
  ),
  about: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m4-3.13a4 4 0 110-8 4 4 0 010 8zm6 0a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  ),
  contact: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  themes: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h10M7 16h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
    </svg>
  ),
  document: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 2v6h6" />
    </svg>
  ),
  question: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093M12 17h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
  ),
  accessibility: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M12 9v4m0 0l-3 7m3-7l3 7" />
    </svg>
  ),
  shield: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  ),
  cog: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
    </svg>
  ),
  takedown: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  sitemap: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v4m0 0H7a1 1 0 00-1 1v3m6-4h5a1 1 0 011 1v3M4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
    </svg>
  ),
  globe: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </svg>
  ),
  externalLink: (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M10 14L19 5M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" />
    </svg>
  ),
};

function iconFor(slug) {
  switch (slug) {
    case '': return ICONS.home;
    case 'themes': return ICONS.collections;
    case 'save-website': return ICONS.save;
    case 'about': return ICONS.about;
    case 'contact': return ICONS.contact;
    case 'information/faq': return ICONS.question;
    case 'information/accessibility': return ICONS.accessibility;
    case 'information/terms': return ICONS.shield;
    case 'information/technical-information': return ICONS.cog;
    case 'information/notice-and-takedown': return ICONS.takedown;
    case 'information/sitemap': return ICONS.sitemap;
    default: return ICONS.document;
  }
}

// ─── Reusable card ──────────────────────────────────────────────────────────

function PageCard({ to, href, external, icon, title, description, meta }) {
  const inner = (
    <>
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-accent-primary/10 text-accent-primary shrink-0 group-hover:bg-accent-primary group-hover:text-white transition-colors">
        <span className="block w-5 h-5">{icon}</span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="block text-sm font-semibold text-gray-900 dark:text-dark-100 truncate">
            {title}
          </span>
          {external && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-dark-400">
              <span className="w-3 h-3">{ICONS.externalLink}</span>
            </span>
          )}
        </span>
        {description && (
          <span className="block text-xs text-gray-500 dark:text-dark-400 mt-0.5 line-clamp-2">
            {description}
          </span>
        )}
        {meta && (
          <span className="block text-[11px] text-gray-400 dark:text-dark-500 mt-1 font-mono truncate">
            {meta}
          </span>
        )}
      </span>
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 dark:text-dark-500 group-hover:text-accent-primary transition-colors shrink-0">
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </>
  );

  const className =
    'group relative flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-accent-primary/50 dark:hover:border-accent-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1';

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
  ) : (
    <Link to={to} className={className}>{inner}</Link>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ id, label, description, count, children }) {
  return (
    <section aria-labelledby={`sm-${id}`} className="mb-12 scroll-mt-24" id={id}>
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <div>
          <h2
            id={`sm-${id}`}
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-100 tracking-tight"
          >
            {label}
          </h2>
          {description && (
            <p className="text-sm text-gray-500 dark:text-dark-400 mt-1 max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {typeof count === 'number' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-accent-primary/10 text-accent-primary">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

// ─── Stat pill ──────────────────────────────────────────────────────────────

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-start px-4 py-3 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700">
      <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-100 tabular-nums">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.1em] text-gray-500 dark:text-dark-400 font-semibold mt-0.5">
        {label}
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────

export default function SitemapPage({ langCode = 'en' }) {
  const lang = languages[langCode] || languages.en;
  const t = COPY[langCode] || COPY.en;
  const { manifest } = useCollectionData();
  const [filter, setFilter] = useState('');

  const breadcrumbs = [
    { label: lang.homeLabel, path: lang.urlPrefix || '/' },
    { label: lang.information.label, path: lang.information.path },
    { label: t.title },
  ];

  // ── Build the page index from the language config ──
  const mainPages = useMemo(
    () => lang.menu.map(item => ({
      title: item.name,
      to: item.path,
      slug: item.slug,
      icon: iconFor(item.slug),
      meta: item.path,
    })),
    [lang]
  );

  const informationPages = useMemo(
    () => lang.information.pages
      .filter(p => p.slug !== 'about') // About sits in main menu already
      .map(p => ({
        title: p.name,
        to: p.isExternal ? undefined : p.path,
        href: p.isExternal ? p.path : undefined,
        external: !!p.isExternal,
        slug: p.slug,
        icon: iconFor(p.slug),
        meta: p.path,
      })),
    [lang]
  );

  const internalInfoPages = useMemo(
    () => informationPages.filter(p => !p.external),
    [informationPages]
  );
  const externalInfoPages = useMemo(
    () => informationPages.filter(p => p.external),
    [informationPages]
  );

  const featuredCollections = useMemo(() => {
    if (!manifest?.datasets) return [];
    return manifest.datasets
      .slice()
      .sort((a, b) => b.itemCount - a.itemCount)
      .slice(0, 6)
      .map(ds => ({
        title: ds.collectionName,
        to: `${lang.urlPrefix || ''}/themes/collections`,
        icon: ICONS.collections,
        meta: `#${ds.collectionId} · ${ds.itemCount.toLocaleString()} ${t.statTargets.toLowerCase()}`,
      }));
  }, [manifest, lang, t]);

  const languagePages = useMemo(
    () => languageOrder.map(code => {
      const l = languages[code];
      return {
        title: `${l.name} · ${l.siteTitle}`,
        to: l.urlPrefix || '/',
        icon: ICONS.globe,
        meta: l.description,
      };
    }),
    []
  );

  // ── Live filter ──
  const needle = filter.trim().toLowerCase();
  const matches = (entry) =>
    !needle ||
    (entry.title && entry.title.toLowerCase().includes(needle)) ||
    (entry.meta && String(entry.meta).toLowerCase().includes(needle));

  const filteredMain = mainPages.filter(matches);
  const filteredInternalInfo = internalInfoPages.filter(matches);
  const filteredExternalInfo = externalInfoPages.filter(matches);
  const filteredCollections = featuredCollections.filter(matches);
  const filteredLanguages = languagePages.filter(matches);

  const totalMatches =
    filteredMain.length +
    filteredInternalInfo.length +
    filteredExternalInfo.length +
    filteredCollections.length +
    filteredLanguages.length;

  // ── Stats ──
  const pageTotal =
    mainPages.length +
    informationPages.length +
    languageOrder.length;

  return (
    <>
      <PageInfoStripe breadcrumbs={breadcrumbs} />

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/60 to-transparent dark:from-dark-900 dark:to-transparent border-b border-gray-200 dark:border-dark-700/60">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-accent-primary uppercase tracking-widest mb-3">
            <span className="w-8 h-px bg-accent-primary inline-block" />
            {lang.siteTitle}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-100 leading-tight">
            {t.title}
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-dark-400 max-w-3xl">
            {t.lede}
          </p>

          {/* Filter */}
          <div className="mt-6 relative max-w-2xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-500 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder={t.filterPlaceholder}
              aria-label={t.filterPlaceholder}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100 placeholder-gray-400 dark:placeholder-dark-500 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              autoComplete="off"
              spellCheck="false"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                aria-label="Clear filter"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-200 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-3xl">
            <Stat
              value={manifest?.summary?.totalCollections?.toLocaleString?.() ?? '—'}
              label={t.statCollections}
            />
            <Stat
              value={manifest?.summary?.totalItems?.toLocaleString?.() ?? '—'}
              label={t.statTargets}
            />
            <Stat value={languageOrder.length} label={t.statLanguages} />
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Empty state */}
        {needle && totalMatches === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-dark-700 p-10 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="text-gray-500 dark:text-dark-400 text-sm">{t.empty}</p>
          </div>
        )}

        {filteredMain.length > 0 && (
          <Section
            id="main"
            label={t.sectionMain}
            description={t.descMain}
            count={filteredMain.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredMain.map(p => (
                <PageCard
                  key={p.to}
                  to={p.to}
                  icon={p.icon}
                  title={p.title}
                  meta={p.meta}
                />
              ))}
            </div>
          </Section>
        )}

        {filteredInternalInfo.length > 0 && (
          <Section
            id="information"
            label={t.sectionInformation}
            description={t.descInformation}
            count={filteredInternalInfo.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredInternalInfo.map(p => (
                <PageCard
                  key={p.to}
                  to={p.to}
                  icon={p.icon}
                  title={p.title}
                  meta={p.meta}
                />
              ))}
            </div>
          </Section>
        )}

        {filteredCollections.length > 0 && (
          <Section
            id="collections"
            label={t.sectionCollections}
            description={t.descCollections}
            count={filteredCollections.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCollections.map((p, i) => (
                <PageCard
                  key={`${p.title}-${i}`}
                  to={p.to}
                  icon={p.icon}
                  title={p.title}
                  meta={p.meta}
                />
              ))}
            </div>
            <div className="mt-4">
              <Link
                to={`${lang.urlPrefix || ''}/themes/collections`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {t.viewAllCollections}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Section>
        )}

        {filteredLanguages.length > 0 && (
          <Section
            id="languages"
            label={t.sectionLanguages}
            description={t.descLanguages}
            count={filteredLanguages.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {filteredLanguages.map(p => (
                <PageCard
                  key={p.to}
                  to={p.to}
                  icon={p.icon}
                  title={p.title}
                  description={p.meta}
                />
              ))}
            </div>
          </Section>
        )}

        {filteredExternalInfo.length > 0 && (
          <Section
            id="external"
            label={t.sectionExternal}
            description={t.descExternal}
            count={filteredExternalInfo.length}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredExternalInfo.map(p => (
                <PageCard
                  key={p.href}
                  href={p.href}
                  external
                  icon={ICONS.externalLink}
                  title={p.title}
                  meta={p.meta}
                />
              ))}
            </div>
          </Section>
        )}
      </main>
    </>
  );
}
