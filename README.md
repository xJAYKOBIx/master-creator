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
| Characters | Survivor (two body types, six skin tones, every hair, headwear, top, pants, shoes and pack, held guns), Zombie (rot, decay, eyes, wounds, shamble and lurch), Zombie pieces and the crawling half, the special dead (a screamer with its jaw hanging open, a swollen bloater, a spitter with an acid sac, each with an Act frame), Training robot (seven looks), Brute | `assets/characters/` |
| Animals | Dog (Shepherd, Lab, Terrier, Husky), Cat (Shorthair, Longhair), seven coats, markings, eyes, collars; idle, walk, run, sit, lie, sniff and stretch | `assets/animals/` |
| Weapons | Light Pistol, Heavy Pistol, Hand Cannon (secondaries, unlimited ammo), Tactical AR, Heavy AR, Pump Shotgun (primaries, carried ammo), smoke, incendiary and explosive grenades | `assets/weapons/` |
| Items | Sand perch, Inlet mackerel, Rock cod, Moonfin, each raw, cooking, cooked or burnt; backpacks: Canvas daypack (small, 5 × 4, 12 kg), Leather pack (medium, 6 × 6, 20 kg), Frame pack (large, 8 × 7, 32 kg), plus pockets with no pack; supplies with bag shape, stack and weight: shotgun shells, rifle rounds, gun oil, scrap metal, cloth and leather, powder, electronics, oil and solvent | `assets/props/camp.js`, `assets/gear/` |
| Props and scenery | 208 props in six sets. Camp: shelters, tents, furniture, storage, fire and cooking, lights and power, workshop, structures, shore and garden. Workshop: salvage walls, workshop interior, robot shop and yard. Home: painted walls, doorways and windows, a half-open inside door, living room, pets' corner, kitchen, bedroom, bathroom, front hall, wall pictures and the front yard. Street: parked cars in five paints, a police cruiser (light bar dark, red or blue; crashed with the door open; trunk open), utility poles, street lamps, fire hydrants, whole houses in six sidings with garages and chimneys, trees and pines, stop signs, trash bins, garden sheds, a survivor's stash, a portable generator, a work floodlight, an olive evac truck with the tailgate up or down, and wooden and chain-link fences. Town (`town.js`, gathering `civic.js`, `shops.js`, `park.js` and `site.js`): an elementary school, its gym, a white church with a steeple, gravestones, iron fencing and gates, a water tower, school buses, a flagpole and bike rack; a strip of four storefronts, a gas station store, pump canopy, pumps and price sign, dumpsters, an ice freezer, shopping carts, a newspaper box and payphone; a park bench, picnic table, play set, footbridge, gazebo, pond, boulders, cattails and litter bin, bleachers, a backstop, light towers, a snack stand and dugouts; house frames at three stages, a slab, scaffolding, portable toilets, lumber, pipes, the site office trailer, an excavator, site fencing, barriers, cones, a dirt heap and rebar. Base (`base.js`): LEET AF's staging hangar, with corrugated hangar walls and door columns, a stage, a podium, a pull-down projector screen with six briefing slides, folding chairs, a projector cart, a briefing board, the unit's banner, an armory cage, lockers, sample cases, a coffee table and an armored personnel carrier with its ramp up or down | `assets/props/` |
| Floors and ground | Wood boards, kitchen tile, bathroom tile, carpet, lawn, concrete, asphalt, dirt, gravel, field grass, still water and a hangar's sealed concrete, patterned by world position so neighbouring rooms line up | `assets/scenery/floors.js` |
| Effects | Campfire flames, blood splat, drips, hand smear, claw gouges, scuffs and dirt, blood palette; gore: gibs, fresh blood stamps (pool, spray, drops, drag mark, wall splatter) and the gore palette; hazards: a spitter's acid glob and bubbling pool, and puffs of bloater gas | `assets/effects/grime.js`, `assets/effects/gore.js`, `assets/effects/hazards.js`, `assets/props/camp.js` |
| Screens and broadcast | TV power-on logo, channel number, channel flip, digital breakup, NO SIGNAL, captions, lower third, ticker, corner bug | `assets/effects/tv.js`, `broadcast.js` |
| Interface and type | Pixel font 5 × 7, spray-paint lettering, map markers | `assets/ui/font5x7.js`, `assets/props/` |
| Sounds | 42 synthesised sounds: the room, the street (a cruiser speeding past, the crash), broadcast stings and beds, a TV voice, game blips, and combat: pistol and shotgun shots with a thump to layer under them, the pump, loading, an empty click, a dive, casings landing, zombie groans, hits and a bite, and scavenging: rummaging, picking something up and a car alarm. Any sound can be played quieter (`vol`) for something further away | `assets/sounds/` |

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

1. **Ground and scenery tiles:** sand, rock walls and water as reusable tiles like the house floors, so new places can be laid out from them.
2. **Sprite sheet export** to PNG for engines and tools that want images.
3. **Armor pieces** for head, body and legs, worn on the survivor, with wear showing as they lose condition.
