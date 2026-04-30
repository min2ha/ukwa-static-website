import { useState, useEffect, useCallback, useRef } from 'react';

const BASE = '/DataSets/Collections/';
const MANIFEST_URL = `${BASE}manifest.json`;
const ITEMS_URL = (id) => `${BASE}items/${id}.json`;

/**
 * useCollectionData
 *
 * Loads the build-time generated manifest (the entire collection tree, no items)
 * once on mount. Items for a single collection are fetched on demand and cached.
 *
 * Manifest shape (built by scripts/build-collections-index.mjs):
 *   {
 *     version, generated, summary,
 *     datasets: [
 *       {
 *         collectionId, collectionName, sourceFile, itemCount, collectionCount,
 *         collections: { [id]: { id, name, higherLevel, children, directItemCount,
 *                                subtreeItemCount, licence, crawlStartMin/Max } }
 *       }
 *     ]
 *   }
 */
export function useCollectionData() {
  const [manifest, setManifest] = useState(null);
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [error, setError] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});
  const itemsCacheRef = useRef(new Map());
  const collectionIndexRef = useRef(new Map()); // id -> { collection, datasetId }

  // Fetch the manifest once
  useEffect(() => {
    let cancelled = false;
    fetch(MANIFEST_URL)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(m => {
        if (cancelled) return;
        // Build flat id -> collection lookup across all datasets
        const idx = new Map();
        for (const ds of m.datasets) {
          for (const id of Object.keys(ds.collections)) {
            idx.set(Number(id), { collection: ds.collections[id], datasetId: ds.collectionId });
          }
        }
        collectionIndexRef.current = idx;
        setManifest(m);
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoadingManifest(false); });
    return () => { cancelled = true; };
  }, []);

  // Lazy-fetch direct items for one collection (returns from cache if present)
  const loadCollectionItems = useCallback(async (collectionId) => {
    const cache = itemsCacheRef.current;
    if (cache.has(collectionId)) return cache.get(collectionId);

    setLoadingItems(s => ({ ...s, [collectionId]: true }));
    try {
      const r = await fetch(ITEMS_URL(collectionId));
      if (r.status === 404) {
        cache.set(collectionId, []);
        return [];
      }
      if (!r.ok) throw new Error(`HTTP ${r.status} for items/${collectionId}.json`);
      const items = await r.json();
      cache.set(collectionId, items);
      return items;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoadingItems(s => ({ ...s, [collectionId]: false }));
    }
  }, []);

  // Lookup helpers operating on the manifest tree
  const getCollection = useCallback((id) => {
    const entry = collectionIndexRef.current.get(Number(id));
    return entry?.collection ?? null;
  }, []);

  const getDatasetIdFor = useCallback((id) => {
    const entry = collectionIndexRef.current.get(Number(id));
    return entry?.datasetId ?? null;
  }, []);

  const getChildren = useCallback((id) => {
    const c = getCollection(id);
    if (!c) return [];
    return c.children.map(cid => getCollection(cid)).filter(Boolean);
  }, [getCollection]);

  // Walk up the higherLevel chain to build the breadcrumb path
  const getAncestors = useCallback((id) => {
    const chain = [];
    const visited = new Set();
    let current = getCollection(id);
    while (current && current.higherLevel !== current.id && !visited.has(current.id)) {
      visited.add(current.id);
      const parent = getCollection(current.higherLevel);
      if (!parent) break;
      chain.unshift(parent);
      current = parent;
    }
    return chain;
  }, [getCollection]);

  return {
    manifest,
    loadingManifest,
    error,
    loadCollectionItems,
    isItemsLoading: (id) => !!loadingItems[id],
    isItemsCached: (id) => itemsCacheRef.current.has(Number(id)),
    getCollection,
    getDatasetIdFor,
    getChildren,
    getAncestors,
  };
}
