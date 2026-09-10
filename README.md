# Menulytr layout study

Five restaurant menu layouts for one invented restaurant, Osteria Lume. Same dishes, same photos, one shared palette.

## Run locally

Double-click `run.bat`. It serves the folder on http://localhost:8090 with Node (or Python if Node is missing) and opens the browser. Or run:

```
node serve.js . 8090
```

The site is static, so it also deploys as-is to GitHub Pages.

## Layouts

| # | Name | File | Idea |
|---|------|------|------|
| 01 | Carta | `variations/01-editorial.html` | Printed single column with dotted leaders and a floating hover preview |
| 02 | Mosaico | `variations/02-gallery.html` | Photo grid, sliding filter pill, dish detail dialog |
| 03 | Bottega | `variations/03-split.html` | Sticky sidebar with scroll-spy, chip nav on phones |
| 04 | Tavola | `variations/04-story.html` | Full-height chapters with a pinned image panel that follows the dish |
| 05 | Lavagna | `variations/05-board.html` | Dense columned board with instant search and highlights |

## Shared pieces

- `assets/menu.js` holds the restaurant data: five categories, eight items each, Unsplash photo ids.
- `assets/palette.js` renders the top-right dock: layout switcher and palette panel (presets, every color, corner radius, heading typeface, copy as CSS). Saved to localStorage once you change something.
- `assets/scene.js` has five small three.js background scenes (dust, blob, rings, waves, orbs) that recolor with the palette.
- `assets/base.css` has tokens, reset, dock and panel styles, and reveal helpers.
- `assets/ui.js` has render helpers, reveal-on-scroll, and scroll-spy.

Photos from Unsplash. Type by Fraunces, Instrument Sans, and JetBrains Mono via Google Fonts. three.js r158 from cdnjs.
