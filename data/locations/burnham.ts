import { StarSystemDef } from '../../types/locations';

export const BURNHAM: StarSystemDef = {
  id: 'burnham',
  label: 'Burnham',
  planets: [
    { id: 'miranda', label: 'Miranda', type: 'planet' },
  ],
  otherLocations: [
    { id: 'reaver_space', label: 'Reaver Space', type: 'space' },
  ]
};