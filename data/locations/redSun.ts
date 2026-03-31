import { StarSystemDef } from '../../types/locations';

export const RED_SUN: StarSystemDef = {
  id: 'red_sun',
  label: 'Red Sun',
  planets: [
    { id: 'ansonsWorld', label: 'Anson\'s World', type: 'planet' },
    { id: 'greenleaf', label: 'Greenleaf', type: 'planet' },
    { id: 'harvest', label: 'Harvest', type: 'planet' },
    { id: 'jiangyin', label: 'Jiangyin', type: 'planet' },
    { id: 'jubilee', label: 'Jubilee', type: 'planet' },
    { id: 'newMelbourne', label: 'New Melbourne', type: 'planet' },
    { id: 'spaceBazaar', label: 'Space Bazaar', type: 'planet' },
    { id: 'stAlbans', label: 'St. Albans', type: 'planet' },
  ],
  otherLocations: [
    { id: 'motherload', label: 'Motherload', type: 'space' },
  ]
};