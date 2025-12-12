
import { ExpansionDef } from '../types';

export const SPRITE_SHEET_URL = "https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg";

export const EXPANSIONS_METADATA: ExpansionDef[] = [
  // 1. Breakin' Atmo
  {
    id: 'breakin_atmo',
    label: "Breakin' Atmo",
    description: "Adds 50 new jobs and 25 new supply cards to the 'Verse.",
    themeColor: 'steelBlue',
    icon: { type: 'text', value: 'BA' }
  },
  // 2. Big Damn Heroes
  {
    id: 'big_damn_heroes',
    label: "Big Damn Heroes",
    description: "Adds 5 new leaders and over 50 new cards. (Rule: Take $100 when proceeding while misbehaving).",
    themeColor: 'steelBlue',
    icon: { type: 'text', value: 'BH' }
  },
  // 3. Pirates & Bounty Hunters
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'black',
    icon: { type: 'sprite', value: '11% 6%' }
  },
  // 4. Blue Sun
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Expands the 'Verse with the Western Rim (Lord Harrow, Mr. Universe) and Reaver mechanics.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '36% 6%' }
  },
  // 5. Kalidasa
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Expands the 'Verse with the Eastern Rim (Fanty & Mingo, Magistrate Higgins) and the Operative.",
    themeColor: 'deepBrown',
    icon: { type: 'sprite', value: '61% 6%' }
  },
  // 6. Coachworks
  {
    id: 'coachworks',
    label: "Coachworks",
    description: "Adds the Jetwash and Esmerelda ships, plus new setup cards.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'text', value: 'CW' }
  },
  // 7. Crime & Punishment
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving with new Alliance Alert cards and severe penalties.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '86% 7%' }
  },
  // 8. Still Flying
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'darkOliveGreen',
    icon: { type: 'text', value: 'SF' }
  },
  // 9. 10th Anniversary
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'saddleBrown',
    icon: { type: 'text', value: '10' }
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
    description: "Unofficial Story Cards created by the Firefly community.",
    themeColor: 'teal',
    icon: { type: 'text', value: 'CC' }
  }
];
