
import { ExpansionDef } from '../types';

export const SPRITE_SHEET_URL = "./expansion_sprites.png";

export const EXPANSIONS_METADATA: ExpansionDef[] = [
  // Row 1 (Y = 0%)
  // 1. Breakin' Atmo
  {
    id: 'breakin_atmo',
    label: "Breakin' Atmo",
    description: "Adds 50 new jobs and 25 new supply cards to the 'Verse.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '0% 0%' }
  },
  // 2. Big Damn Heroes
  {
    id: 'big_damn_heroes',
    label: "Big Damn Heroes",
    description: "Adds 5 new leaders and over 50 new cards. (Rule: Take $100 when proceeding while misbehaving).",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '25% 0%' }
  },
  // 3. Pirates & Bounty Hunters
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'black',
    icon: { type: 'sprite', value: '50% 0%' }
  },
  // 4. Blue Sun
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Expands the 'Verse with the Western Rim (Lord Harrow, Mr. Universe) and Reaver mechanics.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '75% 0%' }
  },
  // 5. Kalidasa
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Expands the 'Verse with the Eastern Rim (Fanty & Mingo, Magistrate Higgins) and the Operative.",
    themeColor: 'deepBrown',
    icon: { type: 'sprite', value: '100% 0%' }
  },

  // Row 2 (Y = 25% in a 5-row grid)
  // 1. Coachworks
  {
    id: 'coachworks',
    label: "Coachworks",
    description: "Adds the Jetwash and Esmerelda ships, plus new setup cards.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'sprite', value: '0% 25%' }
  },
  // 2. Crime & Punishment
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving with new Alliance Alert cards and severe penalties.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '25% 25%' }
  },
  // 3. Still Flying
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'darkOliveGreen',
    icon: { type: 'sprite', value: '50% 25%' }
  },
  // 4. 10th Anniversary
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'saddleBrown',
    icon: { type: 'sprite', value: '75% 25%' }
  },
  // 5. Black Market
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '100% 25%' }
  },

  // Community Content (Text Fallback)
  {
    id: 'community',
    label: "Community Content",
    description: "Unofficial Story Cards created by the Firefly community.",
    themeColor: 'teal',
    icon: { type: 'text', value: 'CC' }
  }
];
