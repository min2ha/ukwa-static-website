import { useState, useEffect, useCallback } from 'react';
import PageInfoStripe from '../components/PageInfoStripe';
import CollectionsSearch from '../components/CollectionsSearch';
import { useCollectionData } from '../hooks/useCollectionData';

const ITEMS_PER_PAGE = 15;

// ─── Collections intro blurb (collapsed to ~5 lines with "View more") ────────

function CollectionsIntro() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 mb-2">
      <div
        className={`text-sm text-gray-600 dark:text-dark-400 leading-relaxed overflow-hidden transition-all duration-300 ${expanded ? '' : 'line-clamp-5'}`}
      >
        <p className="mb-2">
          The archived websites included in these collections were captured between 2005 and 2023
          inclusive. At present, the collections are static, although more recently archived
          websites and new collections will be added over time.
        </p>
        <p className="mb-2">
          The UK Web Archive curates many different types of special collections, covering a wide
          range of topics and themes reflecting contemporary life in the UK.
        </p>
        <p className="mb-2">
          Collections are created by a wide range of contributors, including subject specialists
          and curators across the UK legal deposit libraries, cultural heritage organisations,
          research institutions, community groups, and individuals. Members of the public can also
          nominate websites for inclusion by emailing{' '}
          <a href="mailto:web-archivist@bl.uk" className="text-accent-primary hover:underline">
            web-archivist@bl.uk
          </a>
          .
        </p>
        <p className="mb-2">
          No collection can ever be fully comprehensive. Selecting websites for inclusion is a
          manual process, and some websites cannot be archived because of technical limitations or
          because they fall outside the collection&apos;s scope and selection criteria.
        </p>
        <p>
          For more information about individual collections, including their scope and collecting
          priorities, see the collection scoping documents available through the{' '}
          <a
            href="https://bl.iro.bl.uk/collections/d09fbc16-7a76-49db-a45f-16a99c30ae3e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-primary hover:underline"
          >
            British Library research repository
          </a>
          .
        </p>
      </div>
      <button
        onClick={() => setExpanded(v => !v)}
        className="mt-1 text-xs font-medium text-accent-primary hover:underline focus:outline-none"
      >
        {expanded ? 'View less' : 'View more'}
      </button>
    </div>
  );
}

// ─── Badge colour maps ────────────────────────────────────────────────────────

const DEPTH_COLOURS = {
  DEEP: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  CAPPED_LARGE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  CAPPED: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

const FREQ_COLOURS = {
  DAILY: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  WEEKLY: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  MONTHLY: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  QUARTERLY: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  SIXMONTHLY: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  ANNUAL: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const LICENCE_COLOURS = {
  GRANTED: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  NOT_INITIATED: 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-400',
  QUEUED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  NONE: 'bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-500',
};

const SCOPE_COLOURS = {
  root: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  subdomains: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Badge({ label, colourClass }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colourClass}`}>
      {label}
    </span>
  );
}

function getDomain(url) {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url; }
}

function formatFreq(f) {
  const map = { DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', SIXMONTHLY: '6-Monthly', ANNUAL: 'Annual' };
  return map[f] ?? f;
}

function formatYear(dateStr) {
  return dateStr ? dateStr.slice(0, 4) : null;
}

function truncate(str, n) {
  if (!str || str.length <= n) return str;
  return str.slice(0, n).trimEnd() + '…';
}

function licenceBadgesFromSummary(summary) {
  if (!summary) return [];
  return Object.entries(summary)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      key: status,
      label: `${status.replace(/_/g, ' ')} (${count.toLocaleString()})`,
      colourClass: LICENCE_COLOURS[status] ?? 'bg-gray-100 text-gray-600',
    }));
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function Spinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary" />
      <p className="text-gray-500 dark:text-dark-400 text-sm">{message}</p>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function buildPageWindows(page, totalPages) {
  const show = new Set([1, totalPages, page, page - 1, page - 2, page + 1, page + 2]);
  const sorted = [...show].filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
    result.push(sorted[i]);
  }
  return result;
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  const navBtn = 'p-2 rounded-lg text-gray-500 dark:text-dark-400 hover:bg-gray-100 dark:hover:bg-dark-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors';
  const pageBtn = (active) =>
    `w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-accent-primary text-white shadow-sm'
             : 'text-gray-600 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-700'
    }`;
  const windows = buildPageWindows(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 mt-8">
      <button onClick={() => onPage(page - 1)} disabled={page === 1} className={navBtn} aria-label="Previous page">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {windows.map((w, i) =>
        w === '…' ? (
          <span key={`d-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 dark:text-dark-500 text-sm select-none">…</span>
        ) : (
          <button key={w} onClick={() => onPage(w)} className={pageBtn(w === page)}>{w}</button>
        )
      )}
      <button onClick={() => onPage(page + 1)} disabled={page === totalPages} className={navBtn} aria-label="Next page">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <span className="ml-2 text-sm text-gray-400 dark:text-dark-500">Page {page} of {totalPages}</span>
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

// ─── Cover image helpers ──────────────────────────────────────────────────────

const FALLBACK_COVER = '/images/TopicsThemes/collections/collection_default.png';

// Cover sized by the padding-bottom aspect-ratio hack rather than CSS
// `aspect-ratio`. Safari collapses an `aspect-ratio` flex child to 0 height
// when every descendant is `position: absolute`, leaving the cover unpainted;
// padding-bottom drives layout off the parent's resolved width and works
// identically in Safari/Chrome/Edge. Children use `absolute inset-0` to fill.
function CoverFrame({ paddingBottom, children }) {
  return (
    <div className="relative w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-dark-900" style={{ paddingBottom }}>
      {children}
    </div>
  );
}

function CoverBackground({ src, className = '' }) {
  const primary = src ?? FALLBACK_COVER;
  const layered = primary === FALLBACK_COVER
    ? `url('${FALLBACK_COVER}')`
    : `url('${primary}'), url('${FALLBACK_COVER}')`;
  return (
    <div
      role="img"
      aria-hidden="true"
      style={{ backgroundImage: layered }}
      className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 ${className}`}
    />
  );
}

function StatPill({ value, label, accent = 'default' }) {
  const accents = {
    default: 'text-gray-900 dark:text-dark-100',
    success: 'text-emerald-600 dark:text-emerald-400',
    info: 'text-blue-600 dark:text-blue-400',
  };
  return (
    <div>
      <div className={`text-xl font-bold tracking-tight ${accents[accent]}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-[0.08em] text-gray-400 dark:text-dark-500 font-semibold mt-0.5">
        {label}
      </div>
    </div>
  );
}

function LicenceBar({ licence, total }) {
  if (!licence || !total) return null;
  const order = ['GRANTED', 'PENDING', 'QUEUED', 'NOT_INITIATED', 'NONE'];
  const colours = {
    GRANTED: 'bg-emerald-500',
    PENDING: 'bg-amber-400',
    QUEUED: 'bg-blue-400',
    NOT_INITIATED: 'bg-gray-300 dark:bg-dark-600',
    NONE: 'bg-gray-200 dark:bg-dark-700',
  };
  const segs = order
    .map(k => ({ k, n: licence[k] ?? 0 }))
    .filter(s => s.n > 0);
  if (segs.length === 0) return null;
  return (
    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100 dark:bg-dark-700">
      {segs.map(s => (
        <div
          key={s.k}
          className={colours[s.k]}
          style={{ width: `${(s.n / total) * 100}%` }}
          title={`${s.k.replace(/_/g, ' ')}: ${s.n.toLocaleString()}`}
        />
      ))}
    </div>
  );
}

// ─── Dataset card (top-level theme) ───────────────────────────────────────────

function DatasetCard({ dataset, onClick }) {
  const root = dataset.collections[dataset.collectionId];
  const yearMin = formatYear(root?.crawlStartMin);
  const yearMax = formatYear(root?.crawlStartMax);
  const subCount = root?.children?.length ?? 0;
  const cover = root?.coverImage ?? FALLBACK_COVER;
  const coverage = yearMin && yearMax ? (yearMin === yearMax ? yearMin : `${yearMin}–${yearMax}`) : '—';

  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full flex flex-col bg-white dark:bg-dark-800 rounded-2xl border border-gray-200/70 dark:border-dark-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
    >
      {/* Cover — 16:9 via padding-bottom hack */}
      <CoverFrame paddingBottom="56.25%">
        <CoverBackground src={cover} />

        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Top chips */}
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md rounded-full px-3 py-1 text-[11px] text-white font-semibold border border-white/20 uppercase tracking-wider">
            Collection
          </div>
          <span className="inline-flex items-center bg-black/45 backdrop-blur-md rounded-md px-2 py-1 text-[11px] text-white/95 font-mono tabular-nums">
            #{dataset.collectionId}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h2 className="text-white text-xl md:text-2xl font-bold leading-tight tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {dataset.collectionName}
          </h2>
          {subCount > 0 && (
            <p className="text-white/85 text-xs mt-1.5 font-medium">
              {`${subCount} subsection${subCount !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>
      </CoverFrame>

      {/* Body */}
      <div className="flex flex-col flex-1 w-full p-5 gap-4">
        <div className="mt-auto w-full flex items-center pt-3 border-t border-gray-100 dark:border-dark-700">
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-primary group-hover:gap-2 transition-all">
            View
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Sub-collection card ──────────────────────────────────────────────────────

function CollectionCard({ collection, onClick }) {
  const childCount = collection.children?.length ?? 0;
  const hasChildren = childCount > 0;
  const itemCount = collection.subtreeItemCount ?? collection.directItemCount ?? 0;

  return (
    <button
      onClick={onClick}
      className="group relative text-left w-full flex items-center gap-3 bg-white dark:bg-dark-800 rounded-xl border border-gray-200/80 dark:border-dark-700 shadow-sm hover:shadow-md hover:border-accent-primary/40 dark:hover:border-accent-primary/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-1 px-4 py-3"
    >
      {/* Accent rail */}
      <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-primary/70 to-accent-secondary/70 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Folder glyph */}
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-primary/10 dark:bg-accent-primary/15 text-accent-primary shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
      </span>

      {/* Title + meta */}
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-gray-900 dark:text-dark-100 leading-snug truncate">
          {collection.name}
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500 dark:text-dark-400">
          <span className="font-mono tabular-nums text-gray-400 dark:text-dark-500">#{collection.id}</span>
          {hasChildren && (
            <>
              <span aria-hidden className="text-gray-300 dark:text-dark-600">·</span>
              <span>{childCount} subsection{childCount !== 1 ? 's' : ''}</span>
            </>
          )}
          {itemCount > 0 && (
            <>
              <span aria-hidden className="text-gray-300 dark:text-dark-600">·</span>
              <span>{itemCount.toLocaleString()} target{itemCount === 1 ? '' : 's'}</span>
            </>
          )}
        </span>
      </span>

      {/* Chevron */}
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 dark:text-dark-500 group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-colors shrink-0">
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}

function ItemCard({ item }) {
  const domain = getDomain(item['Primary Seed']);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  const year = formatYear(item['Crawl Start Date']);

  return (
    <div className="group flex flex-col bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-dark-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-accent-secondary" />
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start gap-3">
          <img
            src={faviconUrl} alt="" width={24} height={24}
            className="mt-0.5 rounded flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-100 leading-snug">
            {item['Title of Target']}
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed flex-1">
          {truncate(item['Description'], 130)}
        </p>
        <div className="text-xs text-accent-primary font-mono truncate" title={item['Primary Seed']}>
          {domain}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-gray-100 dark:border-dark-700">
          {item['Depth'] && <Badge label={item['Depth'].replace(/_/g, ' ')} colourClass={DEPTH_COLOURS[item['Depth']] ?? 'bg-gray-100 text-gray-600'} />}
          {item['Crawl Frequency'] && <Badge label={formatFreq(item['Crawl Frequency'])} colourClass={FREQ_COLOURS[item['Crawl Frequency']] ?? 'bg-gray-100 text-gray-600'} />}
          {item['Scope'] && item['Scope'] !== 'root' && <Badge label={item['Scope']} colourClass={SCOPE_COLOURS[item['Scope']] ?? 'bg-gray-100 text-gray-600'} />}
          {item['Licence Status'] && item['Licence Status'] !== 'NOT_INITIATED' && item['Licence Status'] !== 'PENDING' && <Badge label={item['Licence Status'].replace(/_/g, ' ')} colourClass={LICENCE_COLOURS[item['Licence Status']] ?? 'bg-gray-100 text-gray-600'} />}
          {year && <Badge label={`Since ${year}`} colourClass="bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-400" />}
        </div>
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, count, term }) {
  return (
    <div className="max-w-md">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" placeholder="Search targets…" value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
        />
        {value && (
          <button onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {term && (
        <p className="text-sm text-gray-500 dark:text-dark-400 mt-2">
          {count} result{count !== 1 ? 's' : ''} for &ldquo;{term}&rdquo;
        </p>
      )}
    </div>
  );
}

function BackButton({ label, onClick }) {
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-accent-primary hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-4 transition-colors">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to {label}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CollectionsPage() {
  const {
    manifest, loadingManifest, error,
    loadCollectionItems, isItemsLoading,
    getCollection, getChildren, getAncestors,
    loadSearchIndex, searchIndex, loadingSearchIndex,
  } = useCollectionData();

  // Navigation: stack of collection IDs from root → current.
  const [path, setPath] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(null);

  const currentId = path[path.length - 1] ?? null;
  const current = currentId != null ? getCollection(currentId) : null;
  const children = currentId != null ? getChildren(currentId) : [];
  const isLeaf = current ? children.length === 0 : false;
  const itemsLoading = currentId != null && isItemsLoading(currentId);

  // Fetch items only when we land on a leaf
  useEffect(() => {
    if (currentId != null && isLeaf) {
      let cancelled = false;
      setItems(null);
      loadCollectionItems(currentId).then(data => { if (!cancelled) setItems(data ?? []); });
      return () => { cancelled = true; };
    }
    setItems(null);
  }, [currentId, isLeaf, loadCollectionItems]);

  const navigateTo = useCallback((id) => {
    setPath(prev => [...prev, id]);
    setPage(1);
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateBack = useCallback(() => {
    setPath(prev => prev.slice(0, -1));
    setPage(1);
    setSearch('');
  }, []);

  const navigateToIndex = useCallback((idx) => {
    setPath(prev => prev.slice(0, idx + 1));
    setPage(1);
    setSearch('');
  }, []);

  // Jump to any collection (anywhere in the tree) by rebuilding the full
  // root → ... → target path. Used by the autocomplete to land the user
  // wherever they picked, breadcrumb intact.
  const navigateToCollection = useCallback((id) => {
    if (id == null) return;
    const ancestors = getAncestors(id);
    const fullPath = [...ancestors.map(a => a.id), Number(id)];
    setPath(fullPath);
    setPage(1);
    setSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [getAncestors]);

  // Jump to a target's parent collection and pre-filter the leaf view by its
  // title so the chosen result is the (typically only) card on screen.
  const navigateToTarget = useCallback((target) => {
    if (!target) return;
    const ancestors = getAncestors(target.collectionId);
    const fullPath = [...ancestors.map(a => a.id), Number(target.collectionId)];
    setPath(fullPath);
    setPage(1);
    setSearch(target.title ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [getAncestors]);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Breadcrumbs ──────────────────────────────────────────────────────────
  const breadcrumbs = (() => {
    const base = [
      { label: 'Home', path: '/' },
      { label: 'Themes', path: '/themes' },
      { label: 'Collections', onClick: path.length > 0 ? () => setPath([]) : undefined },
    ];
    path.forEach((id, i) => {
      const c = getCollection(id);
      const isLast = i === path.length - 1;
      base.push({
        label: c?.name ?? `#${id}`,
        path: isLast ? undefined : '#',
        onClick: isLast ? undefined : () => navigateToIndex(i),
      });
    });
    return base;
  })();

  // ── Error / loading ──────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <PageInfoStripe breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-100 mb-2">Failed to load data</h2>
            <p className="text-gray-500 dark:text-dark-400 font-mono text-sm">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (loadingManifest || !manifest) {
    return (
      <>
        <PageInfoStripe breadcrumbs={breadcrumbs} />
        <Spinner message="Loading collections…" />
      </>
    );
  }

  // ── Level 0: theme/dataset index ─────────────────────────────────────────
  if (path.length === 0) {
    return (
      <>
        <PageInfoStripe breadcrumbs={breadcrumbs} />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-accent-primary uppercase tracking-widest mb-2">
              <span className="w-8 h-px bg-accent-primary inline-block" />
              UK Web Archive
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-100 leading-tight">
              Collections and Themes
            </h1>
            <CollectionsIntro />
            <p className="mt-2 text-sm md:text-base text-gray-500 dark:text-dark-400">
              Browse curated themes below, or search instantly across every collection,
              subsection and archived website.
            </p>
          </div>

          <div className="mb-10">
            <CollectionsSearch
              manifest={manifest}
              loadSearchIndex={loadSearchIndex}
              searchIndex={searchIndex}
              loadingSearchIndex={loadingSearchIndex}
              getCollection={getCollection}
              onPickCollection={navigateToCollection}
              onPickTarget={navigateToTarget}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manifest.datasets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map(ds => (
              <DatasetCard key={ds.collectionId} dataset={ds} onClick={() => navigateTo(ds.collectionId)} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={Math.ceil(manifest.datasets.length / ITEMS_PER_PAGE)}
            onPage={handlePageChange}
          />
        </main>
      </>
    );
  }

  // ── Levels 1+: a collection (leaf or branch) ─────────────────────────────
  if (!current) {
    return (
      <>
        <PageInfoStripe breadcrumbs={breadcrumbs} />
        <div className="text-center py-20 text-gray-400 dark:text-dark-500">Collection not found.</div>
      </>
    );
  }

  const ancestors = getAncestors(currentId);
  const parent = ancestors[ancestors.length - 1] ?? null;
  const backLabel = path.length === 1 ? 'all themes' : (parent?.name ?? 'previous');

  // Branch view: render child collection cards
  if (!isLeaf) {
    const totalPages = Math.ceil(children.length / ITEMS_PER_PAGE);
    const paginated = children.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
      <>
        <PageInfoStripe breadcrumbs={breadcrumbs} />
        <main className="max-w-7xl mx-auto px-6 py-10">
          <BackButton label={backLabel} onClick={navigateBack} />

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-dark-800 rounded-2xl p-6 text-white mb-8">
            <div className="text-blue-200 text-sm font-medium mb-1">Collection #{current.id}</div>
            <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-2">{current.name}</h1>
            <p className="text-blue-200 text-sm">
              {children.length} subsection{children.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(c => <CollectionCard key={c.id} collection={c} onClick={() => navigateTo(c.id)} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={handlePageChange} />
        </main>
      </>
    );
  }

  // Leaf view: items within this collection
  const filtered = (items ?? []).filter(i => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      i['Title of Target']?.toLowerCase().includes(s) ||
      i['Description']?.toLowerCase().includes(s) ||
      getDomain(i['Primary Seed']).toLowerCase().includes(s)
    );
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <>
      <PageInfoStripe breadcrumbs={breadcrumbs} />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <BackButton label={backLabel} onClick={navigateBack} />

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-dark-800 rounded-2xl p-6 text-white mb-6">
          <div className="text-blue-200 text-sm font-medium mb-1">
            Collection #{current.id}
            {parent && <> · part of {parent.name}</>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-2">{current.name}</h1>
        </div>

        <SearchBar value={search} onChange={s => { setSearch(s); setPage(1); }} count={filtered.length} term={search} />

        {itemsLoading || items === null ? (
          <Spinner message="Loading targets…" />
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {paginated.map(item => <ItemCard key={item['Record ID']} item={item} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 dark:text-dark-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {search.trim() ? 'No targets match your search.' : 'No targets in this collection.'}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPage={handlePageChange} />
      </main>
    </>
  );
}
