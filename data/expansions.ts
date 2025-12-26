import { ExpansionDef } from '../types';

export const SPRITE_SHEET_URL = "./expansion_sprites.png";

export type ExpansionCategory = 'core_mechanics' | 'map' | 'variants' | 'promo';

interface CategorizedExpansionDef extends ExpansionDef {
  category: ExpansionCategory;
}

export const EXPANSIONS_METADATA: CategorizedExpansionDef[] = [
  // Special Entry: Base Game (Hidden from toggles, used for icons)
  {
    id: 'base',
    label: "Base Game",
    description: "Core game content.",
    themeColor: 'dark',
    icon: { 
      type: 'svg', 
      value: "base_icon_placeholder" // Handled specifically in components
    },
    category: 'core_mechanics'
  },
  {
    id: 'breakin_atmo',
    label: "Breakin' Atmo",
    description: "Adds 50 new jobs and 25 new supply cards to the 'Verse.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '0% 0%' },
    page_10th: 28,
    category: 'core_mechanics'
  },
  {
    id: 'big_damn_heroes',
    label: "Big Damn Heroes",
    description: "Take $100 when proceeding while misbehaving with BDH.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '25% 0%' },
    page_10th: 28,
    category: 'core_mechanics'
  },
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'black',
    icon: { type: 'sprite', value: '50% 0%' },
    page_10th: 29,
    category: 'core_mechanics'
  },
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Western Rim of the 'Verse with Reavers.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '75% 0%' },
    page_10th: 36,
    category: 'map'
  },
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Eastern Rim of 'Verse with the Operative.",
    themeColor: 'deepBrown',
    icon: { type: 'sprite', value: '100% 0%' },
    page_10th: 42,
    category: 'map'
  },
  {
    id: 'coachworks',
    label: "Coachworks",
    description: "Jetwash and Esmerelda ships, plus setup cards.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'sprite', value: '0% 25%' },
    page_10th: 47,
    category: 'variants'
  },
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving, and Alliance Alerts.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '25% 25%' },
    page_10th: 49,
    category: 'variants'
  },
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'darkOliveGreen',
    icon: { type: 'sprite', value: '50% 25%' },
    page_10th: 50,
    category: 'variants'
  },
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'saddleBrown',
    icon: { type: 'sprite', value: '75% 25%' },
    page_10th: 53,
    category: 'variants'
  },
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '100% 25%' },
    category: 'promo'
  },
  {
    id: 'community',
    label: "Community Content",
    description: "Unofficial Story Cards created by the Firefly community.",
    themeColor: 'teal',
    icon: { 
      type: 'svg', 
      value: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" 
    },
    category: 'promo'
  }
];