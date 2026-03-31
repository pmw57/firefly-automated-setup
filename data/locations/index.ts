import { BLUE_SUN } from './blueSun';
import { BURNHAM } from './burnham';
import { GEORGIA } from './georgia';
import { MURPHY } from './murphy';
import { WHITE_SUN } from './whiteSun';
import { LUX } from './lux.ts';
import { QINSHIHUANG } from './qinShiHuang';
import { HEINLEIN } from './heinlein';
import { RED_SUN } from './redSun';
import { KALIDASA } from './kalidasa';
import { PENGLAI } from './penglai';
import { StarSystemDef, LocationDef } from '../../types/locations';

export const STAR_SYSTEMS: StarSystemDef[] = [
  BURNHAM,
  BLUE_SUN,
  GEORGIA,
  MURPHY,
  WHITE_SUN,
  LUX,
  QINSHIHUANG,
  HEINLEIN,
  RED_SUN,
  KALIDASA,
  PENGLAI,
];

export const ALL_LOCATIONS: LocationDef[] = [
  ...STAR_SYSTEMS.flatMap(system => [
    ...system.planets,
    ...system.otherLocations
  ]),
  { id: 'outside_alliance', label: 'Outside Alliance Space', type: 'space' }
];

export const LOCATION_IDS = ALL_LOCATIONS.map(loc => loc.id);

export const getLocationById = (id: string, locations?: LocationDef[]): LocationDef | undefined => {
  const source = locations || ALL_LOCATIONS;
  return source.find(loc => loc.id === id);
};
