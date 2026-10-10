# Master Creator

A library of reusable pixel-art assets: characters, animals, weapons, effects, screen overlays, type and sounds. Every asset is code, not an image file, so it can be recolored, re-dressed, turned to any of its facings and animated, and any game in this style can import it instead of rebuilding it.

Deadlight Hollow is built from it: the game keeps a copy of `assets/` and loads its shared art from that copy. Future games in the same style use it too.

## Open the library

The library is a single web page with no build step. Serve this folder with any static server and open `index.html`:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000/
```

Pick a category, tap an asset, and the panel on the right (a full screen sheet on a phone) previews it live. You can turn sprites through their facings with the arrows or the arrow keys, switch animations, change options and presets, play sounds, and copy the code that draws what you see.

## What's in it

| Category | Assets | Code |
|---|---|---|
| Characters | Survivor (two body types, six skin tones, every hair, headwear, top, pants, shoes and pack, held guns), Zombie (rot, decay, eyes, wounds, shamble and lurch), Training robot (seven looks), Brute | `assets/characters/` |
| Animals | Dog (Shepherd, Lab, Terrier, Husky), Cat (Shorthair, Longhair), seven coats, markings, eyes, collars | `assets/animals/` |
| Weapons | Light Pistol, Heavy Pistol, Hand Cannon, Tactical AR, Heavy AR, smoke, incendiary and explosive grenades | `assets/weapons/` |
| Items | Sand perch, Inlet mackerel, Rock cod, Moonfin, each raw, cooking, cooked or burnt | `assets/props/camp.js` |
| Props and scenery | 79 props in two sets. Camp: shelters, tents, furniture, storage, fire and cooking, lights and power, workshop, structures, shore and garden. Workshop: salvage walls, workshop interior, robot shop and yard | `assets/props/` |
| Effects | Campfire flames, blood splat, drips, hand smear, claw gouges, scuffs and dirt, blood palette | `assets/effects/grime.js`, `assets/props/camp.js` |
| Screens and broadcast | TV power-on logo, channel number, channel flip, digital breakup, NO SIGNAL, captions, lower third, ticker, corner bug | `assets/effects/tv.js`, `broadcast.js` |
| Interface and type | Pixel font 5 × 7, spray-paint lettering, map markers | `assets/ui/font5x7.js`, `assets/props/` |
| Sounds | 25 synthesised sounds: the room, the street, broadcast stings and beds, a TV voice, and game blips | `assets/sounds/` |

Shared drawing tools live in `assets/core/`: `paint.js` (the half-unit grid painter, noise, dithering) and `kit.js` (small canvas helpers and a seeded random number generator).

## Using an asset in a game

Assets are plain ES modules with no dependencies outside this folder. Two ways to bring them into a game:

1. **Copy the `assets/` folder** into the game and import from it. This is the simplest and keeps the game self-contained.
2. **Add this repo as a git submodule** and import from it, so updates arrive with `git submodule update --remote`.

Every entry in the library shows its exact import and call under "Use it". For example:

```js
import {survivor} from './assets/characters/character.js';

const c = canvas.getContext('2d');   // a 160 × 192 canvas
c.scale(2, 2);                        // art is drawn in world units, two pixels each
survivor(c, facing, frame, true, {body: 1, hair: 6, top: 3, gun: 'light-pistol'});
```

Facings run 0 to 7: right, front right, front, front left, left, back left, back, back right.

## The catalogue

`assets/catalog.js` lists every asset with what the library needs to preview it: its category and group, a summary, where the code is, how to call it, its size, facings and animations, its options and presets, and a `draw` (or, for sounds, `play`) function that calls the asset's own code. The library never draws anything itself, so what you see is exactly what a game gets.

To add an asset, write its module under `assets/<category>/`, then add an entry to the catalogue. `CLAUDE.md` has the rules for art and code.

## Checks

```sh
npm install               # installs playwright-core, used only by the checks
python3 -m http.server 8771 &
node tests/smoke.mjs http://127.0.0.1:8771     # every asset draws in every facing, frame and option; every sound is audible and never clips
node tools/parity.mjs http://127.0.0.1:8771 "" /path/to/game/dist   # assets shared with a game still draw identically there
```

Both use the Chromium that Playwright can find; set `CHROMIUM` to point at another one.

## Roadmap

1. **Ground and scenery tiles:** sand, rock walls, water and floors as reusable tiles, so new places can be laid out from them (today each of the game's maps paints its own ground).
2. **Sprite sheet export** to PNG for engines and tools that want images.
3. **New assets for the tutorial:** the pump-action shotgun, backpacks of several sizes and the apartment.
