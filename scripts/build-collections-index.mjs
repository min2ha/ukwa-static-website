#!/usr/bin/env node
// Build-time indexer for collection datasets.
//
// Auto-discovers every *.json source file in public/DataSets/Collections/
// (excluding the generated manifest and items/ directory), then writes:
//
//   public/DataSets/Collections/manifest.json
//     – tree of every collection across every dataset, with aggregated stats
//       (item counts, licence summary, date ranges). NO items. ~50-100KB.
//
//   public/DataSets/Collections/items/{collectionId}.json
//     – one file per collection containing only the items whose
//       `Collection ID` equals that id. Typical size 50KB–4MB.
//
// Runtime fetches the manifest once for navigation, then fetches a single
// items file when the user drills into a leaf. The 39MB Brexit blob is
// never sent to the browser as a single payload.

import {
  readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync,
} from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const COLLECTIONS_DIR = join(ROOT, 'public', 'DataSets', 'Collections');
const IMAGES_DIR = join(ROOT, 'public', 'images', 'TopicsThemes', 'collections');
const IMAGE_URL_PREFIX = '/images/TopicsThemes/collections/';
const OUT_MANIFEST = join(COLLECTIONS_DIR, 'manifest.json');
const OUT_ITEMS_DIR = join(COLLECTIONS_DIR, 'items');

const SOURCE_PATTERN = /^multi-tier-hierarchy-dataset-collection-.+\.json$/;
const IMAGE_PATTERN = /^collection_(\d+)\.png$/i;
const DEFAULT_IMAGE = 'collection_default.png';

// ─── Image discovery & assignment ────────────────────────────────────────────

function discoverImages() {
  if (!existsSync(IMAGES_DIR)) return { pool: [], hasDefault: false };
  const all = readdirSync(IMAGES_DIR);
  const pool = [];
  for (const name of all) {
    if (name === DEFAULT_IMAGE) continue;
    if (!IMAGE_PATTERN.test(name)) continue;
    pool.push(name);
  }
  return {
    pool,
    hasDefault: all.includes(DEFAULT_IMAGE),
  };
}

// Fisher–Yates shuffle (in-place).
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a randomised, even-distribution image assigner.
// Every collection ID gets a random image from the pool. With more collections
// than images, the pool is reshuffled and cycled so the same image isn't
// repeated until the pool is exhausted.
function makeImagePicker(images) {
  if (images.pool.length === 0) {
    return () => images.hasDefault ? IMAGE_URL_PREFIX + DEFAULT_IMAGE : null;
  }
  let queue = [];
  return () => {
    if (queue.length === 0) queue = shuffle([...images.pool]);
    return IMAGE_URL_PREFIX + queue.pop();
  };
}

function discoverSources() {
  if (!existsSync(COLLECTIONS_DIR)) {
    throw new Error(`Collections directory not found: ${COLLECTIONS_DIR}`);
  }
  return readdirSync(COLLECTIONS_DIR, { withFileTypes: true })
    .filter(d => d.isFile() && SOURCE_PATTERN.test(d.name))
    .map(d => join(COLLECTIONS_DIR, d.name))
    .sort();
}

function buildCollectionMap(items) {
  const map = new Map();

  for (const item of items) {
    const id = item['Collection ID'];
    if (id == null) continue;

    if (!map.has(id)) {
      map.set(id, {
        id,
        name: item['Collection or Subsection Name'],
        higherLevel: item['Higher Level Collection'],
        type: item['Main Collection or Subsection'],
        directItemCount: 0,
        subtreeItemCount: 0,
        licence: { GRANTED: 0, PENDING: 0, NOT_INITIATED: 0, QUEUED: 0, NONE: 0 },
        crawlStartMin: null,
        crawlStartMax: null,
        children: [],
        directItems: [],
      });
    }

    const c = map.get(id);
    c.directItemCount += 1;
    c.directItems.push(item);

    const status = item['Licence Status'] || 'NONE';
    if (c.licence[status] != null) c.licence[status] += 1;
    else c.licence[status] = 1;

    const date = item['Crawl Start Date']?.slice(0, 10);
    if (date) {
      if (!c.crawlStartMin || date < c.crawlStartMin) c.crawlStartMin = date;
      if (!c.crawlStartMax || date > c.crawlStartMax) c.crawlStartMax = date;
    }
  }

  // Wire up parent → children
  for (const c of map.values()) {
    if (c.higherLevel !== c.id && map.has(c.higherLevel)) {
      map.get(c.higherLevel).children.push(c.id);
    }
  }

  // Sort children for stable output
  for (const c of map.values()) c.children.sort((a, b) => a - b);

  // Compute subtree item counts (DFS from each node, memoised)
  function computeSubtree(id, seen = new Set()) {
    if (seen.has(id)) return 0;
    seen.add(id);
    const c = map.get(id);
    if (!c) return 0;
    if (c.subtreeItemCount > 0) return c.subtreeItemCount;
    let total = c.directItemCount;
    for (const childId of c.children) total += computeSubtree(childId, seen);
    c.subtreeItemCount = total;
    return total;
  }
  for (const c of map.values()) computeSubtree(c.id);

  return map;
}

function findRoot(map) {
  // Self-referential parent (Collection ID == Higher Level Collection) is the typical root.
  for (const c of map.values()) if (c.id === c.higherLevel) return c;
  // Fallback: parent ID not present in the map.
  for (const c of map.values()) if (!map.has(c.higherLevel)) return c;
  return null;
}

function summariseCollection(c, pickImage) {
  return {
    id: c.id,
    name: c.name,
    higherLevel: c.higherLevel,
    type: c.type,
    directItemCount: c.directItemCount,
    subtreeItemCount: c.subtreeItemCount,
    children: c.children,
    licence: c.licence,
    crawlStartMin: c.crawlStartMin,
    crawlStartMax: c.crawlStartMax,
    coverImage: pickImage(),
  };
}

function processSource(filepath) {
  const filename = basename(filepath);
  const items = JSON.parse(readFileSync(filepath, 'utf8'));
  if (!Array.isArray(items)) throw new Error(`${filename} is not a JSON array`);

  const map = buildCollectionMap(items);
  const root = findRoot(map);
  if (!root) throw new Error(`No root collection found in ${filename}`);

  return { filename, root, collectionMap: map, totalItems: items.length };
}

function writeItemFiles(collectionMap) {
  let written = 0;
  for (const c of collectionMap.values()) {
    if (c.directItemCount === 0) continue;
    const out = join(OUT_ITEMS_DIR, `${c.id}.json`);
    writeFileSync(out, JSON.stringify(c.directItems));
    written += 1;
  }
  return written;
}

function main() {
  const sources = discoverSources();
  if (sources.length === 0) {
    console.warn('[collections-index] No source JSON files found.');
    return;
  }

  console.log(`[collections-index] Discovered ${sources.length} source file(s):`);
  for (const s of sources) console.log(`  - ${basename(s)}`);

  const images = discoverImages();
  console.log(
    `[collections-index] Image pool: ${images.pool.length} images` +
    (images.hasDefault ? ' + default fallback' : '')
  );
  const pickImage = makeImagePicker(images);

  // Reset items directory so deletions in source data propagate
  if (existsSync(OUT_ITEMS_DIR)) rmSync(OUT_ITEMS_DIR, { recursive: true });
  mkdirSync(OUT_ITEMS_DIR, { recursive: true });

  const datasets = [];
  let totalItems = 0;
  let totalCollections = 0;
  let totalItemFiles = 0;
  let assignedImages = 0;

  for (const src of sources) {
    const { filename, root, collectionMap, totalItems: count } = processSource(src);

    const written = writeItemFiles(collectionMap);
    totalItemFiles += written;

    const collections = {};
    for (const c of collectionMap.values()) {
      const summary = summariseCollection(c, pickImage);
      collections[c.id] = summary;
      if (summary.coverImage) assignedImages += 1;
    }

    datasets.push({
      collectionId: root.id,
      collectionName: root.name,
      higherLevel: root.higherLevel,
      sourceFile: filename,
      itemCount: count,
      collectionCount: collectionMap.size,
      collections,
    });

    totalItems += count;
    totalCollections += collectionMap.size;

    console.log(
      `  ✓ ${root.name} (#${root.id}): ${count.toLocaleString()} items across ` +
      `${collectionMap.size} collection(s), ${written} items file(s) written.`
    );
  }

  // Sort datasets by item count descending (largest themes first)
  datasets.sort((a, b) => b.itemCount - a.itemCount);

  const manifest = {
    version: '2.0',
    generated: new Date().toISOString(),
    summary: {
      datasetCount: datasets.length,
      totalCollections,
      totalItems,
      itemFileCount: totalItemFiles,
    },
    datasets,
  };

  writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2));

  const manifestKb = (Buffer.byteLength(JSON.stringify(manifest)) / 1024).toFixed(1);
  console.log(`\n[collections-index] manifest.json written (${manifestKb} KB)`);
  console.log(`[collections-index] ${totalItemFiles} per-collection items files written`);
  console.log(
    `[collections-index] Cover images: ${assignedImages} assigned from pool ` +
    `(pool size ${images.pool.length})`
  );
}

main();
