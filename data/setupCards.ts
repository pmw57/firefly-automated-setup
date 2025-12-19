import { SetupCardDef, SetupCardStep } from '../types';

// Base titles for reuse, to avoid typos
const BASE_TITLES = {
    C1: "Nav Decks",
    C2: "Alliance & Reaver Ships",
    C3: "Choose Ships & Leaders",
    C4: "Goal of the Game",
    C5: "Starting Supplies",
    C6: "Starting Jobs",
    C_PRIME: "Priming The Pump",
    D_FIRST_GOAL: "Goal of the Game",
    D_RIM_JOBS: "Rim Space Jobs",
    D_TIME_LIMIT: "Only So Much Time",
    D_SHUTTLE: "Choose Shuttles",
    D_HAVEN_DRAFT: "Choose Leaders, Havens & Ships",
    D_BC_CAPITOL: "Starting Capitol",
    D_LOCAL_HEROES: "Local Heroes",
    D_ALLIANCE_ALERT: "Alliance Alert Cards",
    D_PRESSURES_HIGH: "The Pressure's High",
    D_STRIP_MINING: "Strip Mining: Starting Cards",
    D_GAME_LENGTH_TOKENS: "Game Length Tokens",
};

// Standard Flow Template
const STANDARD_STEPS: SetupCardStep[] = [
  { id: 'C1', title: `1. ${BASE_TITLES.C1}`, page: 3, manual: 'Core' }, 
  { id: 'C2', title: `2. ${BASE_TITLES.C2}`, page: 3, manual: 'Core' }, 
  { id: 'C3', title: `3. ${BASE_TITLES.C3}`, page: 3, manual: 'Core' }, 
  { id: 'C4', title: `4. ${BASE_TITLES.C4}`, page: 4, manual: 'Core' }, 
  { id: 'C5', title: `5. ${BASE_TITLES.C5}`, page: 4, manual: 'Core' }, 
  { id: 'C6', title: `6. ${BASE_TITLES.C6}`, page: 4, manual: 'Core' }, 
  { id: 'C_PRIME', title: `7. ${BASE_TITLES.C_PRIME}`, page: 4, manual: 'Core' }
];

export const SETUP_CARDS: SetupCardDef[] = [
  // 1. Base Game
  {
    id: "Standard",
    label: "Standard Game Setup",
    description: "The classic Firefly experience. Standard deck building, starting resources, and job allocation.",
    steps: STANDARD_STEPS
  },

  // 2. Pirates & Bounty Hunters
  // No standalone setup cards currently defined for Pirates that aren't grouped elsewhere.

  // 3. Blue Sun
  { 
    id: "AwfulCrowdedInMySky", 
    label: "Awful Crowded In My Sky", 
    description: "Alert Tokens are placed in every sector. Reshuffle cards are active. Specific starting jobs.",
    requiredExpansion: 'blue',
    steps: [
      { id: 'C1', title: `1. ${BASE_TITLES.C1}`, overrides: { navMode: 'standard_reshuffle' } },
      { id: 'C3', title: `2. ${BASE_TITLES.C3}` },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}`, overrides: { allianceMode: 'awful_crowded' } },
      { id: 'C4', title: `4. ${BASE_TITLES.C4}` },
      { id: 'C5', title: `5. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}`, overrides: { jobMode: 'awful_jobs' } },
      { id: 'C_PRIME', title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 4. Kalidasa
  {
    id: "TheRimsTheThing",
    label: "The Rim's The Thing",
    description: "Focuses on the outer planets. Uses only Border Nav cards. Contact Decks contain only Blue Sun and Kalidasa cards.",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_RIM_JOBS', title: `1. ${BASE_TITLES.D_RIM_JOBS}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'rim' } },
      { id: 'C3', title: `3. ${BASE_TITLES.C3}` }, 
      { id: 'C2', title: `4. ${BASE_TITLES.C2}` },
      { id: 'C4', title: `5. ${BASE_TITLES.C4}` }, 
      { id: 'C5', title: `6. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `7. ${BASE_TITLES.C6}`, overrides: { jobMode: 'rim_jobs' } },
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "TimesNotOnOurSide",
    label: "Time's Not On Our Side",
    description: "A race against time. Uses Disgruntled tokens as a game timer. Nav decks are harder (Reshuffle included).",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_TIME_LIMIT', title: `1. ${BASE_TITLES.D_TIME_LIMIT}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'standard_reshuffle' } },
      { id: 'C3', title: `3. ${BASE_TITLES.C3}` },
      { id: 'C2', title: `4. ${BASE_TITLES.C2}` },
      { id: 'C4', title: `5. ${BASE_TITLES.C4}` }, 
      { id: 'C5', title: `6. ${BASE_TITLES.C5}` }, 
      { id: 'C6', title: `7. ${BASE_TITLES.C6}`, overrides: { jobMode: 'times_jobs' } }, 
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 5. Coachworks
  {
    id: "TheBrowncoatWay",
    label: "The Browncoat Way",
    description: "A harder economy. Ships must be purchased with starting cash. No free fuel/parts. No starting jobs.",
    requiredExpansion: 'coachworks',
    effects: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 12000, source: { source: 'setupCard', name: "The Browncoat Way" }, description: "Setup Card Allocation" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', source: { source: 'setupCard', name: "The Browncoat Way" }, description: "No free starting fuel." },
      { type: 'modifyResource', resource: 'parts', method: 'disable', source: { source: 'setupCard', name: "The Browncoat Way" }, description: "No free starting parts." },
    ],
    steps: [
      { id: 'D_FIRST_GOAL', title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'browncoat' }, page: 22, manual: 'Core' },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'D_BC_CAPITOL', title: `4. ${BASE_TITLES.D_BC_CAPITOL}` },
      { id: 'C3', title: `5. ${BASE_TITLES.C3}`, overrides: { draftMode: 'browncoat' } },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}`, overrides: { jobMode: 'no_jobs' } },
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "TheBlitz",
    label: "The Blitz",
    description: "Draft starting cards via 'Strip Mining' in addition to standard supplies. Priming the Pump discards double the cards.",
    requiredExpansion: 'coachworks',
    steps: [
      { id: 'D_FIRST_GOAL', title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: 'C1', title: `2. Nav Setup`, overrides: { navMode: 'browncoat' } },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'C3', title: `4. ${BASE_TITLES.C3}` },
      { id: 'D_STRIP_MINING', title: `5. ${BASE_TITLES.D_STRIP_MINING}` },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}` },
      { id: 'C_PRIME', title: `7. Priming the Pump: Double Dip`, overrides: { primeMode: 'blitz' } }
    ]
  },

  // 6. Crime & Punishment
  {
    id: "AllianceHighAlert",
    label: "Alliance High Alert",
    description: "Starts with an Alliance Alert card in play. Harken is unavailable for starting jobs.",
    requiredExpansion: 'crime',
    steps: [
      { id: 'D_ALLIANCE_ALERT', title: `1. ${BASE_TITLES.D_ALLIANCE_ALERT}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}` },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'C3', title: `4. ${BASE_TITLES.C3}` },
      { id: 'C4', title: `5. ${BASE_TITLES.C4}` },
      { id: 'C5', title: `6. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `7. ${BASE_TITLES.C6}`, overrides: { jobMode: 'high_alert_jobs' } },
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  { 
    id: "ClearerSkiesBetterDays", 
    label: "Clearer Skies, Better Days", 
    description: "Features 'Full Burn' mechanic for risky travel. No Alert Tokens are used.",
    requiredExpansion: 'crime',
    steps: [
      { id: 'C1', title: '1. Nav Decks & Navigation', overrides: { navMode: 'clearer_skies' } },
      { id: 'C2', title: `2. ${BASE_TITLES.C2}`, overrides: { allianceMode: 'no_alerts' } },
      { id: 'C3', title: `3. ${BASE_TITLES.C3}` },
      { id: 'C4', title: `4. ${BASE_TITLES.C4}` },
      { id: 'C5', title: `5. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}` },
      { id: 'C_PRIME', title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 7. 10th Anniversary
  {
    id: "FlyingSolo",
    label: "Flying Solo",
    description: "10th Anniversary Expanded Solo Mode. Pair this with another Setup Card to determine the board state.",
    requiredExpansion: 'tenth',
    mode: 'solo',
    steps: [
      { id: 'D_FIRST_GOAL', title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'flying_solo' } },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'C3', title: `4. ${BASE_TITLES.C3}` },
      { id: 'C5', title: `5. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}` },
      { id: 'C_PRIME', title: `7. ${BASE_TITLES.C_PRIME}` },
      { id: 'D_GAME_LENGTH_TOKENS', title: `8. ${BASE_TITLES.D_GAME_LENGTH_TOKENS}` }
    ]
  },
  {
    id: "AintAllButtonsAndCharts",
    label: "Ain't All Buttons & Charts",
    description: "Players draft Shuttles from the supply deck. Specific starting jobs from Amnon Duul, Lord Harrow, and Magistrate Higgins.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'D_FIRST_GOAL', title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'browncoat' } },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'C3', title: `4. ${BASE_TITLES.C3}` },
      { id: 'D_SHUTTLE', title: `5. ${BASE_TITLES.D_SHUTTLE}` },
      { id: 'C5', title: `6. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `7. ${BASE_TITLES.C6}`, overrides: { jobMode: 'buttons_jobs' } },
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "HomeSweetHaven",
    label: "Home Sweet Haven",
    description: "Draft Haven tokens to establish a home base. Ships start at Havens. Includes 'Local Heroes' bonuses.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'D_FIRST_GOAL', title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}`, overrides: { navMode: 'browncoat' }, page: 54, manual: '10th AE'},
      { id: 'C2', title: `3. ${BASE_TITLES.C2}` },
      { id: 'D_HAVEN_DRAFT', title: `4. ${BASE_TITLES.D_HAVEN_DRAFT}` },
      { id: 'C5', title: `5. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `6. ${BASE_TITLES.C6}` },
      { id: 'C_PRIME', title: `7. ${BASE_TITLES.C_PRIME}` },
      { id: 'D_LOCAL_HEROES', title: `8. ${BASE_TITLES.D_LOCAL_HEROES}` }
    ]
  },
  {
    id: "TheHeatIsOn",
    label: "The Heat Is On",
    description: "Leaders begin with Wanted tokens. Cruisers start at Regulus and Persephone. Pressure's High rules active.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'D_PRESSURES_HIGH', title: `1. ${BASE_TITLES.D_PRESSURES_HIGH}` },
      { id: 'C1', title: `2. ${BASE_TITLES.C1}` },
      { id: 'C2', title: `3. ${BASE_TITLES.C2}`, overrides: { allianceMode: 'extra_cruisers' } },
      { id: 'C3', title: `4. ${BASE_TITLES.C3}`, overrides: { leaderSetup: 'wanted' } },
      { id: 'C4', title: `5. ${BASE_TITLES.C4}` },
      { id: 'C5', title: `6. ${BASE_TITLES.C5}` },
      { id: 'C6', title: `7. ${BASE_TITLES.C6}` },
      { id: 'C_PRIME', title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  }
];
