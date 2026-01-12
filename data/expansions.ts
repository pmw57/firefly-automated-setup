

import { ExpansionDef } from '../types/index';
import { createExpansionRules } from './storyCards/utils';

// This type alias clarifies that the metadata array conforms to the full ExpansionDef,
// which includes the 'category' property used for grouping expansions in the UI.
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
    description: "Adds new skill-based Jobs, resourceful Crew, and specialized gear for bigger scores.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '0% 0%' },
    page_10th: 28,
    category: 'core_mechanics',
    isSupplyHeavy: true
  },
  {
    id: 'big_damn_heroes',
    label: "Big Damn Heroes",
    description: "Recruit special versions of Serenity's Crew with a unique 'Big Damn Heroes' ability.",
    themeColor: 'steelBlue',
    icon: { type: 'sprite', value: '25% 0%' },
    page_10th: 28,
    category: 'core_mechanics'
  },
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces player-versus-player conflict with piracy, bounties, new ships, and aggressive leaders.",
    themeColor: 'black',
    icon: { type: 'sprite', value: '50% 0%' },
    page_10th: 29,
    category: 'core_mechanics',
    isSupplyHeavy: true
  },
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Explore the dangerous Blue Sun Rim, facing new Reaver threats and powerful ship upgrades.",
    themeColor: 'darkSlateBlue',
    icon: { type: 'sprite', value: '75% 0%' },
    page_10th: 36,
    category: 'map',
    rules: createExpansionRules('Blue Sun', [
      { type: 'addFlag', flag: 'blueSunReaverPlacement' },
      { type: 'addFlag', flag: 'activatesRimDecks' }
    ])
  },
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Venture into the Kalidasa Rim, avoiding the relentless Alliance Operative and discovering new opportunities.",
    themeColor: 'deepBrown',
    icon: { type: 'sprite', value: '100% 0%' },
    page_10th: 42,
    category: 'map',
    isSupplyHeavy: true,
    rules: createExpansionRules('Kalidasa', [
      { type: 'addFlag', flag: 'activatesRimDecks' }
    ])
  },
  {
    id: 'coachworks',
    label: "Coachworks",
    description: "Adds two new ships, Esmeralda and Jetwash, each with new Supply/Story/Setup cards.",
    themeColor: 'rebeccaPurple',
    icon: { type: 'sprite', value: '0% 25%' },
    page_10th: 47,
    category: 'variants'
  },
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Adds new troubles with Misbehave cards, game-wide Alliance Priority Alerts, and new stories.",
    themeColor: 'cordovan',
    icon: { type: 'sprite', value: '25% 25%' },
    page_10th: 49,
    category: 'variants',
    rules: createExpansionRules('Crime & Punishment', [
      {
        type: 'addSpecialRule',
        category: 'nav',
        rule: {
          title: 'Additional Components',
          content: ["Shuffle the Alliance Priority Alert cards and place them as a face-down deck. Add the new Misbehave cards to the Misbehave deck."]
        }
      }
    ])
  },
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the Restless Sole ship, shuttles, new cards, and risky Capers from Saffron.",
    themeColor: 'darkOliveGreen',
    icon: { type: 'sprite', value: '50% 25%' },
    page_10th: 50,
    category: 'variants',
    isSupplyHeavy: true
  },
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Includes new cards of all types, all released promo cards, and expanded solo rules.",
    themeColor: 'saddleBrown',
    icon: { type: 'sprite', value: '75% 25%' },
    page_10th: 53,
    category: 'variants'
  },
  {
    id: 'aces_eights',
    label: "Aces & Eights",
    description: "Adds high-stakes gambling missions and new gear for games of chance.",
    themeColor: 'gamblingGreen',
    icon: { type: 'sprite', value: '0% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'white_lightning',
    label: "White Lightning",
    description: "Pilot the White Lightning, a saloon ship perfect for rumrunning, smuggling, and new jobs.",
    themeColor: 'mediumPurple',
    icon: { type: 'sprite', value: '25% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'cantankerous',
    label: "Cantankerous",
    description: "Fly the Cantankerous, a repurposed Alliance gunship with powerful, reusable ship upgrades.",
    themeColor: 'tan',
    icon: { type: 'sprite', value: '50% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'huntingdons_bolt',
    label: "Huntingdon's Bolt",
    description: "Command the Huntingdon's Bolt, a hyper-efficient courier ship with unique modular ship upgrades.",
    themeColor: 'cyan',
    icon: { type: 'sprite', value: '75% 50%' },
    category: 'independent',
    hidden: true
  },
  {
    id: 'local_color',
    label: "Local Color",
    description: "Unofficial content required by some community stories.",
    themeColor: 'teal',
    icon: { type: 'text', value: 'LC' },
    category: 'independent',
    hidden: true,
    rules: createExpansionRules('Local Color', [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Local Color Deck',
          content: ["Place the Local Color deck near the map, close to the Nav Decks."]
        }
      }
    ])
  },
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '100% 25%' },
    category: 'independent',
    rules: createExpansionRules('Black Market', [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Black Market Deck',
          content: ["Place the Black Market deck near the Supply Planets."]
        }
      }
    ])
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