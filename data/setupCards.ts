import { SetupCardDef, SetupCardStep, SetupRule } from '../types/index';
import { STEP_IDS, SETUP_CARD_IDS, CONTACT_NAMES } from './ids';

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
  {
    id: SETUP_CARD_IDS.STANDARD,
    label: "Standard Game Setup",
    description: "The classic Firefly experience. Standard deck building, starting resources, and job allocation.",
    steps: STANDARD_STEPS
  },
  { 
    id: SETUP_CARD_IDS.AWFUL_CROWDED, 
    label: "Awful Crowded In My Sky", 
    description: "Alert Tokens are placed in every sector. Reshuffle cards are active. Specific starting jobs.",
    requiredExpansion: 'blue',
    rules: createRules("Awful Crowded In My Sky", [
      { type: 'setNavMode', mode: 'standard_reshuffle' },
      { type: 'setAllianceMode', mode: 'awful_crowded' },
      { type: 'setJobContacts', contacts: [CONTACT_NAMES.HARKEN, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE] },
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
  {
    id: SETUP_CARD_IDS.RIMS_THE_THING,
    label: "The Rim's The Thing",
    description: "Focuses on the outer planets. Uses only Border Nav cards. Contact Decks contain only Blue Sun and Kalidasa cards.",
    requiredExpansion: 'kalidasa',
    rules: createRules("The Rim's The Thing", [
      { type: 'setNavMode', mode: 'rim' },
      { type: 'setJobContacts', contacts: [CONTACT_NAMES.LORD_HARROW, CONTACT_NAMES.MR_UNIVERSE, CONTACT_NAMES.FANTY_MINGO, CONTACT_NAMES.MAGISTRATE_HIGGINS] },
      { type: 'setJobMode', mode: 'rim_jobs' }, // Still needed for the rebuild step
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
    id: SETUP_CARD_IDS.TIMES_NOT_ON_OUR_SIDE,
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
  {
    id: SETUP_CARD_IDS.THE_BROWNCOAT_WAY,
    label: "The Browncoat Way",
    description: "A harder economy. Ships must be purchased with starting cash. No free fuel/parts. No starting jobs.",
    requiredExpansion: 'coachworks',
    rules: createRules("The Browncoat Way", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 12000, description: "Setup Card Allocation" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No Starting Fuel" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No Starting Parts" },
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setDraftMode', mode: 'browncoat' },
      { type: 'setJobMode', mode: 'no_jobs' },
    ]),
    steps: [
      { id: STEP_IDS.C4, title: `1. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C1, title: `2. ${BASE_TITLES.C1}`, page: 22, manual: 'Core' },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.D_BC_CAPITOL, title: `4. ${BASE_TITLES.D_BC_CAPITOL}` },
      { id: STEP_IDS.C3, title: `5. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. ${BASE_TITLES.C_PRIME}` }
    ]
  },
  {
    id: SETUP_CARD_IDS.THE_BLITZ,
    label: "The Blitz",
    description: "Draft starting cards via 'Strip Mining' in addition to standard supplies. Priming the Pump discards double the cards.",
    requiredExpansion: 'coachworks',
    rules: createRules("The Blitz", [
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setPrimeMode', mode: 'blitz' },
    ]),
    steps: [
      { id: STEP_IDS.C4, title: `1. ${BASE_TITLES.C4}` },
      { id: STEP_IDS.C1, title: `2. Nav Setup` },
      { id: STEP_IDS.C2, title: `3. ${BASE_TITLES.C2}` },
      { id: STEP_IDS.C3, title: `4. ${BASE_TITLES.C3}` },
      { id: STEP_IDS.D_STRIP_MINING, title: `5. ${BASE_TITLES.D_STRIP_MINING}` },
      { id: STEP_IDS.C6, title: `6. ${BASE_TITLES.C6}` },
      { id: STEP_IDS.C_PRIME, title: `7. Priming the Pump: Double Dip` }
    ]
  },
  {
    id: SETUP_CARD_IDS.ALLIANCE_HIGH_ALERT,
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
    id: SETUP_CARD_IDS.CLEARER_SKIES_BETTER_DAYS, 
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
  {
    id: SETUP_CARD_IDS.FLYING_SOLO,
    label: "Flying Solo",
    description: "10th Anniversary Expanded Solo Mode. Pair this with another Setup Card to determine the board state.",
    requiredExpansion: 'tenth',
    mode: 'solo',
    isCombinable: true,
    rules: createRules("Flying Solo", [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'setNavMode', mode: 'flying_solo' },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          badge: 'Setup Rule',
          title: 'Flying Solo: Post-Priming Purchase',
          content: ["After priming, you may spend up to $1000 to buy up to 4 Supply Cards that were revealed. Discounts from special abilities apply. Replace any purchased cards."]
        }
      }
    ]),
    steps: [
      // Although Flying Solo merges with another Setup Card, its steps still require
      // titles to conform to the SetupCardStep type and provide fallbacks.
      { id: STEP_IDS.C4, title: BASE_TITLES.C4 },
      { id: STEP_IDS.C1, title: BASE_TITLES.C1 },
      { id: STEP_IDS.C2, title: BASE_TITLES.C2 },
      { id: STEP_IDS.C3, title: BASE_TITLES.C3 },
      { id: STEP_IDS.C5, title: BASE_TITLES.C5 },
      { id: STEP_IDS.C6, title: BASE_TITLES.C6 },
      { id: STEP_IDS.C_PRIME, title: BASE_TITLES.C_PRIME },
      { id: STEP_IDS.D_GAME_LENGTH_TOKENS, title: `8. ${BASE_TITLES.D_GAME_LENGTH_TOKENS}` }
    ]
  },
  {
    id: SETUP_CARD_IDS.AINT_ALL_BUTTONS_AND_CHARTS,
    label: "Ain't All Buttons & Charts",
    description: "Players draft Shuttles from the supply deck. Specific starting jobs from Amnon Duul, Lord Harrow, and Magistrate Higgins.",
    requiredExpansion: 'tenth',
    rules: createRules("Ain't All Buttons & Charts", [
      { type: 'setNavMode', mode: 'browncoat' },
      { type: 'setJobContacts', contacts: [CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.LORD_HARROW, CONTACT_NAMES.MAGISTRATE_HIGGINS] },
      { 
        type: 'addSpecialRule', 
        category: 'jobs',
        rule: { title: 'Caper Bonus', content: ["Draw 1 Caper Card."] }
      }
    ]),
    steps: [
      { id: STEP_IDS.C4, title: `1. ${BASE_TITLES.C4}` },
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
    id: SETUP_CARD_IDS.HOME_SWEET_HAVEN,
    label: "Home Sweet Haven",
    description: "Draft Haven tokens to establish a home base. Ships start at Havens. Includes 'Local Heroes' bonuses.",
    requiredExpansion: 'tenth',
    rules: createRules("Home Sweet Haven", [
      { type: 'setNavMode', mode: 'browncoat' },
      { 
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Home Sweet Haven: Placement Rules',
          page: 35,
          manual: '10th AE',
          flags: ['isHavenPlacement'],
          content: [
            { type: 'list', items: [
                [`Each Haven must be placed in an unoccupied `, { type: 'strong', content: `Planetary Sector adjacent to a Supply Planet` }, `.` ],
                [`Havens may not be placed in a Sector with a `, { type: 'strong', content: `Contact` }, `.` ],
                [`Remaining players place their Havens in `, { type: 'strong', content: `reverse order` }, `.` ],
                [{ type: 'strong', content: `Players' ships start at their Havens.` }],
            ]}
          ]
        }
      }
    ]),
    steps: [
      { id: STEP_IDS.C4, title: `1. ${BASE_TITLES.C4}` },
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
    id: SETUP_CARD_IDS.THE_HEAT_IS_ON,
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
  },
  {
    id: SETUP_CARD_IDS.SOLITAIRE_FIREFLY,
    label: "Solitaire Firefly",
    description: "A solo campaign following the TV series, based on 'Awful Lonely in the Big Black' rules. Source: boardgamegeek.com/thread/1335810",
    requiredExpansion: 'community',
    iconOverride: 'community',
    mode: 'solo',
    sourceUrl: "https://boardgamegeek.com/thread/1335810/solitaire-firefly-some-new-story-cards-for-fans-of",
    rules: createRules("Solitaire Firefly", [
      { type: 'addFlag', flag: 'isSolitaireFirefly' },
      { type: 'addFlag', flag: 'removePiracyJobs' },
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Solitaire Firefly: Jobs & Contacts',
          content: ["For each Contact you were Solid with at the end of the last game, remove 2 of your completed Jobs from play. Keep any remaining completed Jobs; you begin the game Solid with those Contacts."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Solitaire Firefly: Supplies',
          content: ["You receive your standard starting credits. Remember to add any money you saved from the last game. After priming, you may spend up to $1000 (plus your saved money) to repurchase any Supply Cards you set aside at the end of the last game. Place any unpurchased cards into their discard piles."]
        }
      }
    ]),
    steps: [
      // Although Flying Solo merges with another Setup Card, its steps still require
      // titles to conform to the SetupCardStep type and provide fallbacks.
      { id: STEP_IDS.C4, title: BASE_TITLES.C4 },
      { id: STEP_IDS.C1, title: BASE_TITLES.C1 },
      { id: STEP_IDS.C2, title: BASE_TITLES.C2 },
      { id: STEP_IDS.C3, title: BASE_TITLES.C3 },
      { id: STEP_IDS.C5, title: BASE_TITLES.C5 },
      { id: STEP_IDS.C6, title: BASE_TITLES.C6 },
      { id: STEP_IDS.C_PRIME, title: BASE_TITLES.C_PRIME },
    ],
  }
];