# Theme tokens

Every colour, font, and measurement in the theme is an `--andes-*` token.
A host can supply its own values before or after `theme.css`; the theme
follows.

| token | meaning |
|---|---|
| `--andes-bg` | page background |
| `--andes-bg-elevated` | cards, sidebar |
| `--andes-bg-subtle` | muted surfaces |
| `--andes-text` | body text |
| `--andes-text-muted` | captions, metadata |
| `--andes-border` | hairlines |
| `--andes-accent` | links, active navigation |

The wiki maps these onto Coherence tokens, so its four themes keep working
while the prose stylesheet stays identical to a published docs site.
