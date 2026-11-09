# Andes

Andes is the FPL documentation theme: a static, Mintlify-style docs site for
Vite, and a prose stylesheet that other renderers — the wiki daemon — share.

## What a site is

Three things:

- `docs.json` — the navigation manifest. Groups carry an audience; pages name a
  Markdown file and a slug.
- `content/` — the Markdown. It can live anywhere in the repository; the
  manifest points at it.
- `src/main.js` — brand, repository links, and the default page.

## Why hash routing

Pages are addressed as `#/guides/embed-a-demo`, so `dist/` works on any static
host with no rewrite rules. Subpath hosting is a `base` away:

```js
export default defineConfig({
  base: "/soil/",
  // …
});
```

## Next

Read [Embed a demo](#/guides/embed-a-demo) to see a live surface inside prose.
