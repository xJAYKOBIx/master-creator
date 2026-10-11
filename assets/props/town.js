// Town props: the set pieces of the suburbs past your street, in four batches by district (civic.js: the school, the church and the
// water tower; shops.js: the shops and the gas station; park.js: the park, the creek and the ball fields; site.js: the building
// site). Same view, outline and padding as the street set; anything this set does not draw falls through to the street, house,
// workshop and camp sets, so a map built from town props can use every prop in the library.
import {painter} from '../core/paint.js';
import {PROP_PAD} from './camp.js';
import {propArt as streetPropArt} from './street.js';
import {CIVIC_ART,CIVIC_SAMPLES} from './civic.js';
import {SHOP_ART,SHOP_SAMPLES} from './shops.js';
import {PARK_ART,PARK_SAMPLES} from './park.js';
import {SITE_ART,SITE_SAMPLES} from './site.js';
export {PROP_PAD};
export const TOWN_ART={...CIVIC_ART,...SHOP_ART,...PARK_ART,...SITE_ART};
// The library's samples, district by district.
export const TOWN_SAMPLES=[...CIVIC_SAMPLES,...SHOP_SAMPLES,...PARK_SAMPLES,...SITE_SAMPLES];
export function propArt(c,o){if(!TOWN_ART[o.kind])return streetPropArt(c,o);c.save();c.scale(2,2);c.translate(PROP_PAD,o.z+PROP_PAD);TOWN_ART[o.kind](painter(c),o);c.restore();}
