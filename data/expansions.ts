import { ExpansionDef } from '../types';

export const SPRITE_SHEET_URL = "./expansion_sprites.png";

export const EXPANSIONS_METADATA: ExpansionDef[] = [
  // Special Entry: Base Game (Hidden from toggles, used for icons)
  {
    id: 'base',
    label: "Base Game",
    description: "Core game content.",
    themeColor: 'dark',
    icon: { 
      type: 'svg', 
      value: "base_icon_placeholder" // Handled specifically in components
    }
  },
  // Row 1 (Y = 0%)
  // 1. Breakin' Atmo
  {
    id: 'breakin_atmo',
    label: "Breakin' Atmo",
    description: "Adds 50 new jobs and 25 new supply cards to the 'Verse.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '0% 0%' },
    page_10th: 28
  },
  // 2. Big Damn Heroes
  {
    id: 'big_damn_heroes',
    label: "Big Damn Heroes",
    description: "Adds 5 new leaders and over 50 new cards. (Rule: Take $100 when proceeding while misbehaving).",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '25% 0%' },
    page_10th: 28
  },
  // 3. Pirates & Bounty Hunters
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'black',
    icon: { type: 'sprite', value: '50% 0%' },
    page_10th: 29
  },
  // 4. Blue Sun
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Expands the 'Verse with the Western Rim (Lord Harrow, Mr. Universe) and Reaver mechanics.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '75% 0%' },
    page_10th: 36
  },
  // 5. Kalidasa
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Expands the 'Verse with the Eastern Rim (Fanty & Mingo, Magistrate Higgins) and the Operative.",
    themeColor: 'deepBrown',
    icon: { type: 'sprite', value: '100% 0%' },
    page_10th: 42
  },

  // Row 2 (Y = 25% in a 5-row grid)
  // 1. Coachworks
  {
    id: 'coachworks',
    label: "Coachworks",
    description: "Adds the Jetwash and Esmerelda ships, plus new setup cards.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'sprite', value: '0% 25%' },
    page_10th: 47
  },
  // 2. Crime & Punishment
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving with new Alliance Alert cards and severe penalties.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '25% 25%' },
    page_10th: 49
  },
  // 3. Still Flying
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'darkOliveGreen',
    icon: { type: 'sprite', value: '50% 25%' },
    page_10th: 50
  },
  // 4. 10th Anniversary
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'saddleBrown',
    icon: { type: 'sprite', value: '75% 25%' },
    page_10th: 53
  },
  // 5. Black Market
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '100% 25%' }
  },

  // Community Content (SVG Icon)
  {
    id: 'community',
    label: "Community Content",
    description: "Unofficial Story Cards created by the Firefly community.",
    themeColor: 'teal',
    icon: { 
      type: 'svg', 
      value: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
    }
  }
];