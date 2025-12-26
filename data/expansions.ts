


// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { ExpansionDef } from '../types/index';

export const SPRITE_SHEET_URL = "assets/images/game/expansion_sprites.png";

// FIX: This type was defined locally, but now it's part of the main ExpansionDef to fix type errors.
// The existing data structure is now compatible with the updated ExpansionDef.
type CategorizedExpansionDef = ExpansionDef;

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
    id: 'aces_eights',
    label: "Aces & Eights",
    description: "Adds high-stakes gambling missions and new gear for games of chance.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '0% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'white_lightning',
    label: "White Lightning",
    description: "A cargo lifter converted into a popular saloon ship, as a cover for rumrunning and smuggling.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '25% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'cantankerous',
    label: "Cantankerous",
    description: "A resurrected Alliance military vessel with reusable ship upgrades and not much room for passengers.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'sprite', value: '50% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'huntingdons_bolt',
    label: "Huntingdon's Bolt",
    description: "A courier ship with anonymity style and safety, providing modular systems, and a hyper-efficient core.",
    themeColor: 'orangeRed',
    icon: { type: 'sprite', value: '75% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '100% 25%' },
    category: 'independent'
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
    category: 'independent'
  }
];