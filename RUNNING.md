# Running ukwa-static-website-goth-3

A React + Vite static website. No backend required.

---

## Prerequisites

| Tool | Minimum version | Check |
|------|----------------|-------|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |

---

## Quick Start

```bash
# 1. Enter the project directory
cd ukwa-static-website-goth-3

# 2. Install dependencies (first time only)
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3001** in your browser.

---

## Available Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server with hot-reload on port **3001** |
| `npm run build` | Compile production build into `dist/` |
| `npm run preview` | Serve the production `dist/` build locally for testing |
| `npm run lint` | Run ESLint checks across the source files |

---

## Development Workflow

### Start dev server
```bash
npm run dev
# → http://localhost:3001
```

The server is accessible on your local network too (`host: true` in `vite.config.js`), so you can preview on a phone at `http://<your-ip>:3001`.

### Editing content

All page content is plain Markdown. No rebuild needed in dev — just save and refresh.

```
public/content/
├── en/
│   ├── _index.md          ← English home (not shown on / — see below)
│   ├── about/_index.md    ← /about
│   ├── contact/_index.md  ← /contact
│   └── save-website/_index.md  ← /save-website
├── cy/                    ← Welsh (Cymraeg) pages
└── gd/                    ← Scottish Gaelic pages
```

> **Note:** The English home page (`/`) uses the custom `HomePage.jsx` component, not the `_index.md` file. Edit `src/pages/HomePage.jsx` to change the home page content.

### Editing styles

All custom CSS lives in `src/index.css`. Tailwind utilities are also available throughout. Changes hot-reload instantly in dev.

### Changing the theme default

The site defaults to **light mode**. To change the default:

```js
// src/hooks/useTheme.js
return localStorage.getItem(STORAGE_KEY) || 'light';  // change to 'dark'
```

---

## Production Build

```bash
# Build
npm run build

# Preview the built output locally
npm run preview
# → http://localhost:4173
```

The built files are in `dist/`. Deploy that folder to any static host.

---

## Deployment

### Azure Static Web Apps

The project includes `staticwebapp.config.json` for Azure. Deploy via the Azure portal or CLI:

```bash
# Using Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli
swa deploy dist/ --deployment-token <YOUR_TOKEN>
```

The config handles:
- SPA routing fallback (all routes serve `index.html`)
- `Cache-Control` headers for content vs. images
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`)

### Netlify / Vercel

Point the build command and publish directory:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |

For Netlify, add a `public/_redirects` file to handle client-side routing:

```
/*  /index.html  200
```

### Any static file host (nginx, Apache, S3, GitHub Pages)

Copy the contents of `dist/` to your web root. Ensure your server is configured to serve `index.html` for all unknown routes (SPA fallback).

**nginx example:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Project Structure

```
ukwa-static-website-goth-3/
├── public/
│   ├── content/          Markdown page content (en/cy/gd)
│   └── images/           Logos and footer images
├── src/
│   ├── components/       Shared UI components (Header, Footer, etc.)
│   ├── hooks/            useTheme, useLanguage, useMarkdown
│   ├── pages/            HomePage.jsx, MarkdownPage.jsx
│   ├── config/           languages.js (site titles, nav menus)
│   ├── App.jsx           Routes
│   ├── main.jsx          React entry point
│   └── index.css         All custom styles + Tailwind
├── index.html            HTML shell (fonts loaded here)
├── vite.config.js        Dev server port 3001, sourcemaps
├── tailwind.config.js    Tailwind theme tokens
└── staticwebapp.config.json  Azure deployment config
```

---

## Troubleshooting

**Port 3001 already in use**
```bash
# Kill whatever is on the port
lsof -ti:3001 | xargs kill
npm run dev
```

**`node_modules` errors after copying the folder**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Fonts not loading**
The site uses Google Fonts. An internet connection is required in dev. Fonts load from `index.html` via a `<link>` tag.

**Content changes not reflecting**
In dev, Markdown files are fetched at runtime — a hard refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`) clears any browser cache.
