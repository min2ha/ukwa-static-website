---
title: "Technical Information"
description: "Technical details about how the UK Web Archive operates"
---

# Technical Information

## How we crawl the web

The UK Web Archive uses web crawling software to collect publicly accessible UK websites. Our primary tool is [Heritrix](https://github.com/internetarchive/heritrix3), an open-source web crawler developed by the Internet Archive.

## Storage and preservation

Archived content is stored in the **WARC** (Web ARChive) file format, an ISO standard (ISO 28500) for web archive data. WARC files preserve the original HTTP responses alongside metadata such as crawl timestamps and checksums.

## Access infrastructure

- **Full-text search** is powered by [Apache Solr](https://solr.apache.org/).
- **Playback** of archived pages uses the [PyWB](https://github.com/webrecorder/pywb) web archive replay system.
- **URL deduplication** is handled through content hashing to avoid storing duplicate resources.

## Scale

Each year we collect:
- Millions of individual UK domains
- Billions of individual resources (HTML, images, PDFs, video, etc.)
- Petabytes of data in total

## Open source

Much of our tooling is open source. You can find our software repositories on [GitHub](https://github.com/ukwa).

## APIs and data access

Researchers can request access to datasets and APIs. Please contact us at web-archivist@bl.uk for more information.
