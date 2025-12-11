import { ExpansionDef } from '../types';

export const SPRITE_SHEET_URL = "https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg";

export const EXPANSIONS_METADATA: ExpansionDef[] = [
  // 1. Base Game (Implicit, but listed for order/color if needed)
  
  // 2. 10th Anniversary
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'yellow',
    icon: { type: 'text', value: '10' }
  },
  // 3. Still Flying
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'cyan',
    icon: { type: 'text', value: 'SF' }
  },
  // 4. Blue Sun
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Expands the 'Verse with the Western Rim (Lord Harrow, Mr. Universe) and Reaver mechanics.",
    themeColor: 'cornflower',
    icon: { type: 'sprite', value: '36% 6%' }
  },
  // 5. Kalidasa
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Expands the 'Verse with the Eastern Rim (Fanty & Mingo, Magistrate Higgins) and the Operative.",
    themeColor: 'khaki',
    icon: { type: 'sprite', value: '61% 6%' }
  },
  // 6. Pirates & Bounty Hunters
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'brown',
    icon: { type: 'sprite', value: '11% 6%' }
  },
  // 7. Crime & Punishment
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving with new Alliance Alert cards and severe penalties.",
    themeColor: 'firebrick',
    icon: { type: 'sprite', value: '86% 7%' }
  },
  // 8. Jetwash
  {
    id: 'jetwash',
    label: "Jetwash",
    description: "Adds the Jetwash ship and new setup cards.",
    themeColor: 'paleGreen',
    icon: { type: 'text', value: 'JW' }
  },
  // 9. Esmerelda
  {
    id: 'esmerelda',
    label: "Esmerelda",
    description: "Adds the Esmerelda ship and new setup cards.",
    themeColor: 'purple',
    icon: { type: 'text', value: 'ES' }
  },
  // 10. Black Market
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '36% 29%' }
  },
  // 11. Community Content
  {
    id: 'community',
    label: "Community Content",
    description: "Unofficial Story Cards and Scenarios created by the Firefly community.",
    themeColor: 'teal',
    icon: { type: 'text', value: 'CC' }
  }
];