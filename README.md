# andes

The FPL documentation theme. Two pieces, one visual language:

- **`@ajmwagar/andes`** — a static, Mintlify-style docs site for Vite: fixed
  sidebar, right-hand table of contents, command palette, dark mode, copyable
  code blocks, public/internal audience filtering at build time, hash routing.
- **`@ajmwagar/andes/theme.css`** — the token contract and the prose
  stylesheet, namespaced `.andes-prose`, for renderers that are not Vite apps
  (the wiki daemon renders Markdown in Rust and links this stylesheet).

A consumer never copies CSS out of this repository. A Vite site imports the
runtime; the wiki imports the theme and maps the tokens onto its own palette.

## Use

```bash
cp -R example my-docs && cd my-docs
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/, servable from any static host
```

`docs.json` is the navigation manifest:

```json
{
  "name": "Soil",
  "description": "The fungOS runtime.",
  "navigation": [
    {
      "group": "Start here",
      "audience": "public",
      "pages": [
        {
          "title": "Introduction",
          "slug": "introduction",
          "file": "docs/introduction.md",
          "description": "What soil is."
        }
      ]
    }
  ]
}
```

`file` is resolved from `repoRoot`, so pages point at the Markdown a repository
already has. Nothing has to move into the site directory.

`src/main.js` supplies the brand, the repository links, and the default page:

```js
import { mountDocs } from "@ajmwagar/andes";
import bundle from "virtual:docs-kit";

mountDocs(bundle, {
  brand: { name: "Soil", mark: "S", badge: "Docs" },
  // Keep private repository URLs out of public builds.
  repo: __DOCS_INTERNAL__
    ? {
        url: "https://github.com/fungOS-linux/soil",
        blobBase: "https://github.com/fungOS-linux/soil/blob/main",
        rawBase: "https://raw.githubusercontent.com/fungOS-linux/soil/main",
      }
    : {},
  defaultSlug: "introduction",
  storageKey: "soil-docs",
});
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import { docsKit } from "@ajmwagar/andes/vite";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    docsKit({
      root: import.meta.dirname,
      repoRoot: resolve(import.meta.dirname, ".."),
      manifest: "docs.json",
      defaultAudience: "public",
    }),
  ],
  optimizeDeps: { exclude: ["@ajmwagar/andes"] },
});
```

## Audiences

Groups are tagged `"audience": "public"` or `"internal"`. `DOCS_AUDIENCE`
selects what the build bundles; internal Markdown never enters a public bundle.

A manifest whose groups all carry the **same** audience is a single-audience
project. There is no split to build and no switch to show: the build includes
every page and the audience pill is hidden. An internal-only repository should
tag its groups `internal` and protect the artifact by hosting it behind auth —
not by pretending a public build of internal docs is safe.

## Hosting under a subpath

Hash routing means `dist/` needs no rewrite rules. For a site served at
`docs.fpl.dev/soil/`, set Vite's `base` and use relative asset paths in
`index.html`:

```js
export default defineConfig({ base: "/soil/" });
```

```html
<link rel="icon" href="favicon.svg" type="image/svg+xml" />
```

## Embedded demos

Markdown is rendered without a sanitizer, so a raw `<iframe>` passes through.
Anything under `public/` is copied verbatim:

```
public/demos/viewer/index.html  ->  /demos/viewer/index.html
```

Use a relative `src` — `demos/viewer/index.html`, not `/demos/...` — because the
pathname never changes under hash routing and a relative path works at both the
domain root and a subpath.

## For non-Vite renderers

Link the theme and add `.andes-prose` to the element that holds rendered
Markdown:

```html
<link rel="stylesheet" href="node_modules/@ajmwagar/andes/src/theme.css" />
<div class="prose andes-prose">…</div>
```

Supply your own values for any `--andes-*` token to adopt the theme to a host
palette. The wiki maps them onto Coherence, which keeps its light/dark/sepia
themes while the prose typography stays identical to a published docs site.

## Provenance

Extracted from the Transmog documentation site, which proved the shell on a real
product. `@ajmwagar/docs-kit` is the same engine under its original name; andes
is the continuation and adds single-audience builds and the shared
`theme.css`.

MIT © 2026 Avery Wagar.
