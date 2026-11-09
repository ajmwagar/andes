# Embed a demo

A documentation page is Markdown, but it is not sanitised. A raw `<iframe>`
passes through to the built page, and anything under `public/` is copied
verbatim, so a demo is just a directory:

```
public/demos/hello/index.html   ->   /demos/hello/index.html
```

Use a **relative** `src`. The app uses hash routing, so the pathname never
changes and a relative path resolves correctly at both `/` and a subpath like
`/soil/`.

<iframe src="demos/hello/index.html" title="Hello demo" style="width:100%;height:240px;border:1px solid var(--andes-border);border-radius:8px"></iframe>

That is the whole mechanism. A Rust/WASM surface is built by whatever owns it
and copied into `public/demos/<slug>/` before the docs build.
