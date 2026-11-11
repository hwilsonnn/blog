# Markdown-built SPA

The browser still loads one HTML shell, intercepts internal links, and fetches
HTML fragments into `main#root`. Markdown and front matter are parsed **only at
build time**. No framework, Markdown parser, or content JSON ships to the browser.

## Build and run

Use Node.js 22.22.2+, 24.15.0+, or 26+ (matching the test tooling). Run commands from this directory:

```sh
npm ci
npm run build
```

Serve `dist/` with your usual static HTTP server. Opening `index.html` directly
as a local file will not work because the SPA fetches route fragments over HTTP.
On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

For deployment below a path, build with that path:

```sh
npm run build -- --base=/blog
```

Serve that build at `/blog/`. Deploy **the contents of `dist/`**, including
`404.html` and `.nojekyll`. Source HTML contains build
placeholders and is not meant to be served directly. The build replaces `dist/`.

## Writing content

- `content/blogs/*.md` → `/articles/<filename>`
- `content/projects/*.md` → `/projects/<filename>`
- `content/about.md` → `/about/`

The Markdown was copied from the parent application's `src/content/`; this
directory is now the source for this application's builds. The parent is not
modified or required. The imported project descriptions retain their original
wording, including descriptions of the older React site.

Create a lowercase kebab-case filename such as `my-new-post.md` (not `index.md`):

```markdown
---
title: "My new post"
date: "2026-11-09"
tags: ["javascript", "notes"]
excerpt: "A short summary shown on the listing page."
gif: "breakdance.gif"
---

## A section

Write Markdown here.
```

Both blog posts and projects accept an optional `gif` filename for their listing
card, for example `gif: "breakdance.gif"`. Put the file directly in `assets/` and
use its exact filename, including `.gif`, without a directory or URL. The build
reports invalid filenames or missing assets. If omitted, cards keep the existing
alternating `dunking.gif` / `breakdance.gif` default. This requires no runtime JS.

Project entries also accept `github` and `demo` HTTP(S) URLs. About uses the
profile metadata already present in `content/about.md`. Required fields, dates,
filenames, and metadata URLs are validated before replacing the previous build.
Listing counts, cards, and date ordering are generated automatically.

Tables, fenced code blocks, inline code, lists, and automatic URL linking are
supported. Headings receive unique IDs for anchor links. Raw HTML in Markdown is
escaped; markup inside code fences is displayed as code. There is no runtime
syntax highlighter.

Use site-root paths for internal links and images, for example
`[Another post](/articles/url-pattern)` or `![Description](/assets/example.png)`.
The build prefixes these with the deployment base path. Ordinary relative URLs
resolve against the visible SPA route, not the Markdown file. Put images in
`assets/`, which is copied as-is.

## Layout and routing

- `index.html`: shell template; `404.html`: static-host deep-link redirect.
- `templates/home.html`: home fragment template.
- `templates/pages.mjs`: shared listing, detail, About, and navigation markup.
- `index.css`: shared styling, including the former inline route styles.
- `scripts/build.mjs`: content validation and HTML generation.
- `router.js`: the only application JavaScript sent to the browser.

Output stays compatible with the original routing process:

```text
dist/
  index.html
  404.html
  router.js
  index.css
  favicon.svg
  assets/
  routes/
    home.html
    about.html
    articles/
      index.html
      url-pattern.html
      ...
    projects/
      index.html
      md-editor.html
      ...
```

On a static host, deep links first reach `404.html`, which redirects to the shell
using `?p=`. The shell restores the route, query string, and anchor, then fetches
the generated fragment. Hosts that rewrite application routes to `index.html`
also work; missing fragment requests must return 404 rather than a shell.
Configure your host to serve `404.html` for missing pages or rewrite application
routes to the shell if you want to open deep links directly. No separate documents
are generated for public application URLs. JavaScript remains necessary to display
and navigate the SPA. Titles and descriptions update after each fragment loads.

## Verification

```sh
npm test
```

Tests cover content rendering and validation, generated links and assets, SPA
navigation and history, deep-link redirects, and root/subpath deployments.
Router tests use the generated files as fetch responses and do not start a server.
