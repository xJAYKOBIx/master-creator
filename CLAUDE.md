# Master Creator: rules for working here

This repo is a library of reusable pixel-art assets written as code. Games import from it, Deadlight Hollow first. Read `README.md` for the layout.

## What must never change by accident

- **Saved choices keep their meaning.** Option lists (hairstyles, tops, coats, breeds and the rest) are indexed, and games save those indexes. Only append new choices at the end; never reorder, remove or reuse an index.
- **Existing art stays pixel-identical** unless a change to that art was asked for. `tools/parity.mjs` checks this against Deadlight Hollow; run it after touching anything a game already uses.
- **Art is deterministic.** Noise and scatter come from seeded generators (`core/kit.js` `rng`, `core/paint.js` `hash2`), never `Math.random`, so an asset paints the same every time. (Randomize buttons are the exception: they pick options, not pixels.)

## How art is drawn

- World units on 2x canvases: one world unit is two screen pixels, and edges snap to a half-unit grid (`core/paint.js` `painter`). Characters and animals are drawn this way, with the foot anchor at (40, 85) in units, in an 80 × 96 unit (160 × 192 pixel) frame for people, and at (40, 58) in 80 × 80 units for animals.
- Eight facings, 0 to 7: right, front right, front, front left, left, back left, back, back right. Mirrored facings reuse the right-facing art.
- People have the darkest outlines (`#111319`) and strongest color. Solid props get a softer edge (`#191b21`). Scenery is muted and low contrast with no hard outlines on the ground.
- Looks swap whole color ramps by exact hex match (`characters/palette.js`), so outlines, shading and animation stay the same for every combination.
- Props draw with their footprint's top left corner at (0, 0) and height rising into negative y; `propArt(c, {kind, w, h, z, x, y})` adds the padding (`PROP_PAD`), the 2x scale and the grime at the foot. Real sample sizes live in `props/samples.js`.
- Screen art (TV pictures, overlays, the 5 × 7 font) is drawn at one canvas pixel per art pixel on a 240 × 135 picture.
- Sounds are synthesised with WebAudio through the kit in `sounds/kit.js`, so they can be rendered offline and never clip.

## Adding an asset

1. Write the module under `assets/<category>/`. It imports only from this repo, takes a 2D canvas context and draws; it touches no page, storage or game state.
2. Add an entry to `assets/catalog.js` (the entry shape is documented at the top of that file). Give it a real summary and a `usage` that a game can paste.
3. Run `node tests/smoke.mjs` (with the folder served) and look at it in the library on a phone-sized and a desktop-sized window.

## Code style

Match the surrounding code: dense modules, short helper names, a comment above each part saying what it draws and why. No build step and no runtime dependencies; `playwright-core` is only for the checks.
