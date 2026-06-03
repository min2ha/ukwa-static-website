import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

const MIN_QUERY = 2;
const MAX_COLLECTION_HITS = 6;
const MAX_TARGET_HITS = 10;

const HINT_EXAMPLES = ['Brexit', 'BBC News', 'Climate', 'Conservative Party', 'NHS'];

// Escape user input before building a highlight regex.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Lightweight scoring: exact > word-start prefix > anywhere. Lower is better.
function scoreMatch(haystack, needle) {
  if (!haystack) return Infinity;
  const h = haystack.toLowerCase();
  if (h === needle) return 0;
  if (h.startsWith(needle)) return 1;
  // word-start match (after space or punctuation)
  if (new RegExp(`(^|[\\s\\-_:/.])${escapeRegex(needle)}`).test(h)) return 2;
  const idx = h.indexOf(needle);
  if (idx >= 0) return 3 + Math.min(idx, 20) / 100;
  return Infinity;
}

function Highlight({ text, query }) {
  if (!query || !text) return text;
  const re = new RegExp(`(${escapeRegex(query)})`, 'ig');
  const parts = String(text).split(re);
  return parts.map((p, i) =>
    re.test(p) && p.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-amber-200/70 dark:bg-amber-300/30 text-inherit rounded-sm px-0.5"
      >
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function CollectionIcon() {
  return (
    <svg className="w-4 h-4 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg className="w-4 h-4 text-accent-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.828 10.172a4 4 0 015.656 0M10.172 13.828a4 4 0 01-5.656 0m9.9 0a4 4 0 010-5.656m-4.244 0a4 4 0 00-5.656 5.656" />
    </svg>
  );
}

export default function CollectionsSearch({
  manifest,
  loadSearchIndex,
  searchIndex,
  loadingSearchIndex,
  getCollection,
  onPickCollection,
  onPickTarget,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  // Collections are searched against the already-loaded manifest tree.
  const collectionsForSearch = useMemo(() => {
    if (!manifest) return [];
    const rows = [];
    for (const ds of manifest.datasets) {
      for (const id of Object.keys(ds.collections)) {
        const c = ds.collections[id];
        rows.push({
          id: c.id,
          name: c.name,
          type: c.type,
          datasetId: ds.collectionId,
          datasetName: ds.collectionName,
          isRoot: c.id === ds.collectionId,
          itemCount: c.subtreeItemCount ?? c.directItemCount ?? 0,
        });
      }
    }
    return rows;
  }, [manifest]);

  // Trigger the lazy fetch the first time the user focuses the box.
  const handleFocus = useCallback(() => {
    if (!searchIndex && !loadingSearchIndex) loadSearchIndex();
    if (query.trim().length >= MIN_QUERY) setOpen(true);
  }, [searchIndex, loadingSearchIndex, loadSearchIndex, query]);

  // Open / re-rank suggestions when the query changes.
  useEffect(() => {
    setActiveIdx(0);
    if (query.trim().length >= MIN_QUERY) setOpen(true);
    else setOpen(false);
  }, [query]);

  // Click-outside dismiss.
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Global `/` shortcut to focus the search box (only when not already typing).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== '/') return;
      const target = e.target;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const needle = query.trim().toLowerCase();

  const { collectionHits, targetHits } = useMemo(() => {
    if (needle.length < MIN_QUERY) return { collectionHits: [], targetHits: [] };

    // ── Collections ────────────────────────────────────────────
    const cScored = [];
    for (const c of collectionsForSearch) {
      const s = scoreMatch(c.name, needle);
      if (Number.isFinite(s)) cScored.push({ ...c, _score: s });
    }
    cScored.sort((a, b) => a._score - b._score || b.itemCount - a.itemCount);
    const collectionHits = cScored.slice(0, MAX_COLLECTION_HITS);

    // ── Targets ───────────────────────────────────────────────
    let targetHits = [];
    if (Array.isArray(searchIndex) && searchIndex.length > 0) {
      const buf = [];
      for (let k = 0; k < searchIndex.length; k++) {
        const row = searchIndex[k];
        let s = scoreMatch(row.t, needle);
        // Domain matches contribute a secondary signal — slightly weaker than title.
        if (!Number.isFinite(s)) {
          const ds = scoreMatch(row.d, needle);
          if (Number.isFinite(ds)) s = ds + 1;
        }
        if (Number.isFinite(s)) {
          buf.push({ row, score: s });
          // Early exit once we have plenty of candidates with score 0/1.
          if (buf.length > MAX_TARGET_HITS * 12) break;
        }
      }
      buf.sort((a, b) => a.score - b.score);
      targetHits = buf.slice(0, MAX_TARGET_HITS).map(({ row }) => ({
        id: row.i,
        title: row.t,
        domain: row.d,
        collectionId: row.c,
        collectionName: getCollection?.(row.c)?.name ?? null,
      }));
    }

    return { collectionHits, targetHits };
  }, [needle, collectionsForSearch, searchIndex, getCollection]);

  // Combined, ordered list for keyboard nav.
  const allHits = useMemo(
    () => [
      ...collectionHits.map(h => ({ kind: 'collection', payload: h })),
      ...targetHits.map(h => ({ kind: 'target', payload: h })),
    ],
    [collectionHits, targetHits]
  );

  const pick = useCallback((hit) => {
    if (!hit) return;
    if (hit.kind === 'collection') {
      onPickCollection?.(hit.payload.id);
    } else {
      onPickTarget?.(hit.payload);
    }
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  }, [onPickCollection, onPickTarget]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!open || allHits.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => (i + 1) % allHits.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => (i - 1 + allHits.length) % allHits.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(allHits[activeIdx]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(allHits.length - 1);
    }
  }, [open, allHits, activeIdx, pick]);

  // Keep the active suggestion scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const showEmpty =
    open &&
    needle.length >= MIN_QUERY &&
    allHits.length === 0 &&
    !loadingSearchIndex;

  return (
    <div ref={wrapperRef} className="relative max-w-2xl">
      {/* Input */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-500 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search collections and archived websites — try “Brexit”, “BBC News” or “Climate”"
          aria-label="Search collections and archived websites"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="collections-search-listbox"
          aria-activedescendant={open && allHits[activeIdx] ? `csearch-opt-${activeIdx}` : undefined}
          role="combobox"
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-shadow"
        />
        {/* `/` hint or clear button */}
        {query ? (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-200 p-1 rounded-md"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[11px] font-mono font-medium text-gray-500 dark:text-dark-400 bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded">
            /
          </kbd>
        )}
      </div>

      {/* Hint row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-dark-400">
        <span className="font-medium text-gray-600 dark:text-dark-300">Try:</span>
        {HINT_EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => { setQuery(ex); inputRef.current?.focus(); }}
            className="px-2 py-0.5 rounded-full border border-gray-200 dark:border-dark-700 hover:border-accent-primary hover:text-accent-primary transition-colors"
          >
            {ex}
          </button>
        ))}
        <span className="ml-auto hidden md:inline text-gray-400 dark:text-dark-500">
          {manifest && (
            <>
              {manifest.summary?.totalCollections?.toLocaleString?.() ?? '—'} collections ·{' '}
              {manifest.summary?.totalItems?.toLocaleString?.() ?? '—'} archived websites
            </>
          )}
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          id="collections-search-listbox"
          role="listbox"
          ref={listRef}
          className="absolute z-30 left-0 right-0 mt-2 max-h-[28rem] overflow-y-auto rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-2xl backdrop-blur-sm"
        >
          {/* Collections group */}
          {collectionHits.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-dark-500">
                Collections &amp; Themes · {collectionHits.length}
              </div>
              <ul>
                {collectionHits.map((h, i) => {
                  const idx = i;
                  const active = idx === activeIdx;
                  return (
                    <li key={`c-${h.id}`}>
                      <button
                        id={`csearch-opt-${idx}`}
                        data-idx={idx}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => pick({ kind: 'collection', payload: h })}
                        className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                          active
                            ? 'bg-accent-primary/10 dark:bg-accent-primary/20'
                            : 'hover:bg-gray-50 dark:hover:bg-dark-700/60'
                        }`}
                      >
                        <span className="mt-0.5"><CollectionIcon /></span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-gray-900 dark:text-dark-100 truncate">
                            <Highlight text={h.name} query={needle} />
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-dark-400 truncate">
                            {h.isRoot ? 'Top-level collection' : `In ${h.datasetName}`}
                            {h.itemCount > 0 && (
                              <> · {h.itemCount.toLocaleString()} target{h.itemCount === 1 ? '' : 's'}</>
                            )}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 dark:text-dark-500 mt-1 shrink-0">
                          #{h.id}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Targets group */}
          {targetHits.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-dark-500 border-t border-gray-100 dark:border-dark-700/60">
                Archived Websites · {targetHits.length}
              </div>
              <ul>
                {targetHits.map((h, i) => {
                  const idx = collectionHits.length + i;
                  const active = idx === activeIdx;
                  return (
                    <li key={`t-${h.id}`}>
                      <button
                        id={`csearch-opt-${idx}`}
                        data-idx={idx}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => pick({ kind: 'target', payload: h })}
                        className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                          active
                            ? 'bg-accent-primary/10 dark:bg-accent-primary/20'
                            : 'hover:bg-gray-50 dark:hover:bg-dark-700/60'
                        }`}
                      >
                        <span className="mt-0.5"><TargetIcon /></span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-gray-900 dark:text-dark-100 truncate">
                            <Highlight text={h.title} query={needle} />
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-dark-400 truncate">
                            {h.domain && <span className="font-mono">{h.domain}</span>}
                            {h.collectionName && (
                              <span className="ml-1">· in {h.collectionName}</span>
                            )}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Loading state for the index */}
          {loadingSearchIndex && targetHits.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500 dark:text-dark-400">
              <span className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-dark-600 border-t-accent-primary animate-spin" />
              Building the website search index…
            </div>
          )}

          {/* Empty state */}
          {showEmpty && (
            <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-dark-400">
              <div className="text-2xl mb-1">🔍</div>
              No matches for <span className="font-semibold">&ldquo;{query.trim()}&rdquo;</span>. Try a broader term.
            </div>
          )}

          {/* Footer keys */}
          {(collectionHits.length > 0 || targetHits.length > 0) && (
            <div className="flex items-center justify-end gap-3 px-4 py-2 text-[11px] text-gray-400 dark:text-dark-500 border-t border-gray-100 dark:border-dark-700/60 bg-gray-50/60 dark:bg-dark-900/40">
              <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 font-mono">↵</kbd> open</span>
              <span><kbd className="px-1 py-0.5 rounded bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 font-mono">Esc</kbd> close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
