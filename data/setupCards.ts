import { SetupCardDef, SetupCardStep, SetupRule } from '../types';
import { STEP_IDS } from './ids';

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

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
  { id: STEP_IDS.C1, title: `1. ${BASE_TITLES.C1}`, page: 3, manual: 'Core' }, 
  { id: STEP_IDS.C2, title: `2. ${BASE_TITLES.C2}`, page: 3, manual: 'Core' }, 
  { id: STEP_IDS.C3, title: `3. ${BASE_TITLES.C3}`, page: 3, manual: 'Core' }, 
  { id: STEP_IDS.C4, title: `4. ${BASE_TITLES.C4}`, page: 4, manual: 'Core' }, 
  { id: STEP_IDS.C5, title: `5. ${BASE_TITLES.C5}`, page: 4, manual: 'Core' }, 
  { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}`, page: 4, manual: 'Core' }, 
  { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}`, page: 4, manual: 'Core' }
];

const createRules = (id: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
    return rules.map(rule => ({
        ...rule,
        source: 'setupCard',
        sourceName: id,
    })) as SetupRule[];
};

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
    rules: createRules("Awful Crowded In My Sky", [
      { type: 'setNavMode', mode: 'standard_reshuffle' },
      { type: 'setAllianceMode', mode: 'awful_crowded' },
      { type: 'setJobMode', mode: 'awful_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.C1, title: `1. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C3, title: `2. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C4, title: `4. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C5, title: `5. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 4. Kalidasa
  {
    id: "TheRimsTheThing",
    label: "The Rim's The Thing",
    description: "Focuses on the outer planets. Uses only Border Nav cards. Contact Decks contain only Blue Sun and Kalidasa cards.",
    requiredExpansion: 'kalidasa',
    rules: createRules("The Rim's The Thing", [
      { type: 'setNavMode', mode: 'rim' },
      { type: 'setJobMode', mode: 'rim_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.D_RIM_JOBS, title: `1. ${BASE_TITLES.D_RIM_JOBS}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C3, title: `3. ${BASE_TITLES.C3}` }, 
      { id: STEP_IDS.C2, title: `4. ${BASE_TITLES.C2}` }, 
      { id: STEP_IDS.C4, title: `5. ${BASE_TITLES.C4}` }, 
      { id: STEP_IDS.C5, title: `6. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `7. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "TimesNotOnOurSide",
    label: "Time's Not On Our Side",
    description: "A race against time. Uses Disgruntled tokens as a game timer. Nav decks are harder (Reshuffle included).",
    requiredExpansion: 'kalidasa',
    rules: createRules("Time's Not On Our Side", [
      { type: 'setNavMode', mode: 'standard_reshuffle' },
      { type: 'setJobMode', mode: 'times_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.D_TIME_LIMIT, title: `1. ${BASE_TITLES.D_TIME_LIMIT}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C3, title: `3. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C2, title: `4. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C4, title: `5. ${BASE_TITLES.C4}` }, 
      { id: STEP_IDS.C5, title: `6. ${BASE_TITLES.C5}` }, 
      { id: STEP_IDS.C6, title: `7. ${BASE_TITLES.C6}` }, 
      { id: STEP_IDS.C_PRIME, title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 5. Coachworks
  {
    id: "TheBrowncoatWay",
    label: "The Browncoat Way",
    description: "A harder economy. Ships must be purchased with starting cash. No free fuel/parts. No starting jobs.",
    requiredExpansion: 'coachworks',
    rules: createRules("The Browncoat Way", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 12000, description: "Setup Card Allocation" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No free starting fuel." },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No free starting parts." },
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setDraftMode', mode: 'browncoat' },
      { type: 'setJobMode', mode: 'no_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.D_FIRST_GOAL, title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}`, page: 22, manual: 'Core' },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.D_BC_CAPITOL, title: `4. ${BASE_TITLES.D_BC_CAPITOL}` },
      { id: STEP_IDS.C3, title: `5. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "TheBlitz",
    label: "The Blitz",
    description: "Draft starting cards via 'Strip Mining' in addition to standard supplies. Priming the Pump discards double the cards.",
    requiredExpansion: 'coachworks',
    rules: createRules("The Blitz", [
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setPrimeMode', mode: 'blitz' },
    ]),
    steps: [
      { id: STEP_IDS.D_FIRST_GOAL, title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: STEP_IDS.C1, title: `2. Nav Setup` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.D_STRIP_MINING, title: `5. ${BASE_TITLES.D_STRIP_MINING}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. Priming the Pump: Double Dip` }
    ]
  },

  // 6. Crime & Punishment
  {
    id: "AllianceHighAlert",
    label: "Alliance High Alert",
    description: "Starts with an Alliance Alert card in play. Harken is unavailable for starting jobs.",
    requiredExpansion: 'crime',
    rules: createRules("Alliance High Alert", [
      { type: 'setJobMode', mode: 'high_alert_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.D_ALLIANCE_ALERT, title: `1. ${BASE_TITLES.D_ALLIANCE_ALERT}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C4, title: `5. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C5, title: `6. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `7. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  { 
    id: "ClearerSkiesBetterDays", 
    label: "Clearer Skies, Better Days", 
    description: "Features 'Full Burn' mechanic for risky travel. No Alert Tokens are used.",
    requiredExpansion: 'crime',
    rules: createRules("Clearer Skies, Better Days", [
      { type: 'setNavMode', mode: 'clearer_skies' },
      { type: 'setAllianceMode', mode: 'no_alerts' },
    ]),
    steps: [
      { id: STEP_IDS.C1, title: '1. Nav Decks & Navigation' },
      { id: STEP_IDS.C2, title: `2. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `3. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C4, title: `4. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C5, title: `5. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },

  // 7. 10th Anniversary
  {
    id: "FlyingSolo",
    label: "Flying Solo",
    description: "10th Anniversary Expanded Solo Mode. Pair this with another Setup Card to determine the board state.",
    requiredExpansion: 'tenth',
    mode: 'solo',
    rules: createRules("Flying Solo", [
      { type: 'setNavMode', mode: 'flying_solo' },
      { type: 'addFlag', flag: 'soloGameTimer' },
    ]),
    steps: [
      { id: STEP_IDS.D_FIRST_GOAL, title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C5, title: `5. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` },
      { id: STEP_IDS.D_GAME_LENGTH_TOKENS, title: `8. ${BASE_TITLES.D_GAME_LENGTH_TOKENS}` }
    ]
  },
  {
    id: "AintAllButtonsAndCharts",
    label: "Ain't All Buttons & Charts",
    description: "Players draft Shuttles from the supply deck. Specific starting jobs from Amnon Duul, Lord Harrow, and Magistrate Higgins.",
    requiredExpansion: 'tenth',
    rules: createRules("Ain't All Buttons & Charts", [
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setJobMode', mode: 'buttons_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.D_FIRST_GOAL, title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.D_SHUTTLE, title: `5. ${BASE_TITLES.D_SHUTTLE}` },
      { id: STEP_IDS.C5, title: `6. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `7. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: "HomeSweetHaven",
    label: "Home Sweet Haven",
    description: "Draft Haven tokens to establish a home base. Ships start at Havens. Includes 'Local Heroes' bonuses.",
    requiredExpansion: 'tenth',
    rules: createRules("Home Sweet Haven", [
      { type: 'setNavMode', mode: 'browncoat' },
    ]),
    steps: [
      { id: STEP_IDS.D_FIRST_GOAL, title: `1. ${BASE_TITLES.D_FIRST_GOAL}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}`, page: 54, manual: '10th AE'},
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.D_HAVEN_DRAFT, title: `4. ${BASE_TITLES.D_HAVEN_DRAFT}` },
      { id: STEP_IDS.C5, title: `5. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` },
      { id: STEP_IDS.D_LOCAL_HEROES, title: `8. ${BASE_TITLES.D_LOCAL_HEROES}` }
    ]
  },
  {
    id: "TheHeatIsOn",
    label: "The Heat Is On",
    description: "Leaders begin with Wanted tokens. Cruisers start at Regulus and Persephone. Pressure's High rules active.",
    requiredExpansion: 'tenth',
    rules: createRules("The Heat Is On", [
      { type: 'setAllianceMode', mode: 'extra_cruisers' },
      { type: 'setLeaderSetup', mode: 'wanted' },
    ]),
    steps: [
      { id: STEP_IDS.D_PRESSURES_HIGH, title: `1. ${BASE_TITLES.D_PRESSURES_HIGH}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C4, title: `5. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C5, title: `6. ${BASE_TITLES.C5}` },
      { id: STEP_IDS.C6, title: `7. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `8. ${BASE_TITLES.C_PRIME}` }
    ]
  }
];