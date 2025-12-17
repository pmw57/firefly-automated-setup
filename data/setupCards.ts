import { SetupCardDef } from '../types';

// Standard Flow Template
const STANDARD_STEPS = [
  { id: 'C1' }, { id: 'C2' }, { id: 'C3' }, { id: 'C4' }, { id: 'C5' }, { id: 'C6' }, { id: 'C_PRIME' }
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
      { id: 'C1', overrides: { forceReshuffle: true } }, // 1. Nav (Force Reshuffle)
      { id: 'C3' }, // 2. Ships & Leaders (Order Swapped)
      { id: 'C2', overrides: { awfulCrowdedAllianceMode: true } }, // 3. Alliance & Reaver (Alert Tokens rule)
      { id: 'C4' }, // 4. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6', overrides: { awfulJobMode: true } }, // 6. Jobs
      { id: 'C_PRIME' } // 7. Prime
    ]
  },

  // 4. Kalidasa
  {
    id: "TheRimsTheThing",
    label: "The Rim's The Thing",
    description: "Focuses on the outer planets. Uses only Border Nav cards. Contact Decks contain only Blue Sun and Kalidasa cards.",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_RIM_JOBS' },
      { id: 'C1', overrides: { rimNavMode: true } },
      { id: 'C3' }, // Swap: Choose Ships & Leaders first (Phase 3)
      { id: 'C2' }, // Then place Alliance & Reaver (Phase 4)
      { id: 'C4' }, { id: 'C5' },
      { id: 'C6', overrides: { rimJobMode: true } }, // Expansion contacts only
      { id: 'C_PRIME' }
    ]
  },
  {
    id: "TimesNotOnOurSide",
    label: "Time's Not On Our Side",
    description: "A race against time. Uses Disgruntled tokens as a game timer. Nav decks are harder (Reshuffle included).",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_TIME_LIMIT' },
      { id: 'C1', overrides: { forceReshuffle: true } }, // Enforce Reshuffle rules
      { id: 'C3' }, // Choose Ships & Leaders (Swapped with C2)
      { id: 'C2' }, // Alliance & Reaver (Swapped with C3)
      { id: 'C4' }, { id: 'C5' }, 
      { id: 'C6', overrides: { timesJobMode: true } }, 
      { id: 'C_PRIME' }
    ]
  },

  // 5. Coachworks
  {
    id: "TheBrowncoatWay",
    label: "The Browncoat Way",
    description: "A harder economy. Ships must be purchased with starting cash. No free fuel/parts. No starting jobs.",
    requiredExpansion: 'coachworks',
    steps: [
      { id: 'C4' }, // 1. Goal (First!)
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (With overrides)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'D_BC_CAPITOL', overrides: { startingCredits: 12000 } }, // 4. Starting Capitol (Override base credits)
      { id: 'C3', overrides: { browncoatDraftMode: true } }, // 5. Ships
      { id: 'C6', overrides: { browncoatJobMode: true } }, // 6. Jobs (With overrides)
      { id: 'C_PRIME' } // 7. Priming
    ]
  },
  {
    id: "TheBlitz",
    label: "The Blitz",
    description: "Standard supplies are replaced by 'Strip Mining' (drafting cards). Priming the Pump discards double the cards.",
    requiredExpansion: 'coachworks',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'D_STRIP_MINING' }, // 5. Strip Mining (Replaces Supplies)
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME', overrides: { blitzPrimeMode: true } } // 7. Prime (Double Dip)
    ]
  },

  // 6. Crime & Punishment
  {
    id: "AllianceHighAlert",
    label: "Alliance High Alert",
    description: "Starts with an Alliance Alert card in play. Harken is unavailable for starting jobs.",
    requiredExpansion: 'crime',
    steps: [
      { id: 'D_ALLIANCE_ALERT' }, // 1. Alert Cards
      { id: 'C1' }, // 2. Nav
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'C4' }, // 5. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6', overrides: { allianceHighAlertJobMode: true } }, // 7. Jobs (No Harken)
      { id: 'C_PRIME' } // 8. Prime
    ]
  },
  { 
    id: "ClearerSkiesBetterDays", 
    label: "Clearer Skies, Better Days", 
    description: "Features 'Full Burn' mechanic for risky travel. No Alert Tokens are used.",
    requiredExpansion: 'crime',
    steps: [
      { id: 'C1', overrides: { forceReshuffle: true, clearerSkiesNavMode: true } }, // 1. Nav (Full Burn Rule)
      { id: 'C2', overrides: { noAlertTokens: true } }, // 2. Alliance (No Alert Tokens)
      { id: 'C3' }, // 3. Ships
      { id: 'C4' }, // 4. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME' } // 7. Prime
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
      { id: 'C4' }, // Goal Of The Game
      { id: 'C1', overrides: { flyingSoloNavMode: true } }, // Nav Decks (Modified text)
      { id: 'C2' }, // Alliance & Reaver Ships
      { id: 'C3' }, // Choose Ship & Leader
      { id: 'C5' }, // Starting Supplies
      { id: 'C6' }, // Starting Jobs
      { id: 'C_PRIME' }, // Priming The Pump (Modified buying rule)
      { id: 'D_GAME_LENGTH_TOKENS' } // Game Length Tokens
    ]
  },
  {
    id: "AintAllButtonsAndCharts",
    label: "Ain't All Buttons & Charts",
    description: "Players draft Shuttles from the supply deck. Specific starting jobs from Amnon Duul, Lord Harrow, and Magistrate Higgins.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'D_SHUTTLE' }, // 5. Shuttles
      { id: 'C5' }, // 6. Supplies
      { id: 'C6', overrides: { buttonsJobMode: true } }, // 7. Jobs (Specific Contacts)
      { id: 'C_PRIME' } // 8. Prime
    ]
  },
  {
    id: "HomeSweetHaven",
    label: "Home Sweet Haven",
    description: "Draft Haven tokens to establish a home base. Ships start at Havens. Includes 'Local Heroes' bonuses.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Uses Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'D_HAVEN_DRAFT' }, // 4. Leaders, Havens & Ships
      { id: 'C5' }, // 5. Supplies
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME' }, // 7. Prime
      { id: 'D_LOCAL_HEROES' } // 8. Local Heroes
    ]
  },

  // 8. Black Market
  { 
    id: "TheHeatIsOn", 
    label: "The Heat Is On", 
    description: "Starts with an Alliance Alert card. Leaders begin play with a Wanted Token. Wanted tokens accumulate on leaders.",
    requiredExpansion: 'black_market',
    steps: [
      { id: 'D_PRESSURES_HIGH' }, // 1. The Pressure's High
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3', overrides: { wantedLeaderMode: true } }, // 4. Ships
      { id: 'C4' }, // 5. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6' }, // 7. Jobs
      { id: 'C_PRIME' } // 8. Prime
    ] 
  }
];