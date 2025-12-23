import { StoryCardDef, SetupRule } from '../../types';
import { STORY_TITLES, CONTACT_NAMES } from '../ids';

// Helper to avoid repeating source info
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
    return rules.map(rule => ({
        ...rule,
        source: 'story',
        sourceName,
    })) as SetupRule[];
};

export const SOLO_STORIES: StoryCardDef[] = [
  {
    title: STORY_TITLES.AWFUL_LONELY,
    intro: "It takes a brave soul to sail the Big Black alone... Pick your goal and test your skills.",
    setupDescription: "Solo Play. Draft Crew ($1000 limit). Stack 20 Disgruntled Tokens (Timer). Remove Piracy Jobs.",
    rules: createStoryRules(STORY_TITLES.AWFUL_LONELY, [
      { type: 'addFlag', flag: 'removePiracyJobs' },
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    goals: [
      { title: "Goal 1: The Good", description: "Making Connections: End the game Solid with 5 different Contacts." },
      { title: "Goal 2: The Bad", description: "Crime Does Pay: End the game with $15,000 or more." },
      { title: "Goal 3: The Ugly", description: "No Rest For The Wicked: Successfully Proceed past 20 or more Misbehave cards. Set aside Misbehave Cards you Proceed past to track your progress." }
    ],
    isSolo: true
  },
  {
    title: STORY_TITLES.A_FISTFUL_OF_SCOUNDRELS,
    intro: "A captain is only as good as his reputation. And you never know when the winds might change, so best to be on terms with as many folks as possible.",
    setupDescription: "Roots In The Community: Each time you gain Solid with a Contact, recover 2 Game Length Tokens.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.A_FISTFUL_OF_SCOUNDRELS, [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    challengeOptions: [
      { id: 'dont_prime_contacts', label: "Don't prime the Contact decks." },
      { id: 'illegal_jobs_only', label: "Work only Illegal Jobs." },
      { id: 'recover_1_glt', label: "Only recover 1 Game Length Token each time you become Solid." },
      { id: 'caper_first', label: "Complete a Caper before gaining any Solid Rep." }
    ],
    advancedRule: {
        id: "adv_alt_alliance_contacts",
        title: "Alternate Alliance Contacts"
    }
  },
  {
    title: STORY_TITLES.FOR_A_FEW_CREDITS_MORE,
    intro: "Money can't buy happiness, but empty pockets can't buy nothin'.",
    setupDescription: "No Starting Jobs (Prime Contact Decks). Start with 1 random Alliance Alert.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.FOR_A_FEW_CREDITS_MORE, [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'primeContacts' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    challengeOptions: [
        { id: 'one_job_per_contact', label: "Work no more than one Job per Contact." },
        { id: 'legal_jobs_only', label: "Work only Legal Jobs, including Bounties." },
        { id: 'single_contact', label: "Work for a single Contact only." },
        { id: 'pay_on_botch', label: "Pay your Crew whenever you Botch. Otherwise, Disgruntle them." }
    ],
    advancedRule: {
        id: "adv_alt_corvette_contacts",
        title: "Alternate Corvette Contacts"
    }
  },
  {
    title: "Goin' Reaver",
    intro: "Captain ain't been the same since we pulled 'em out of that Alliance black ops site: cagey, paranoid... rageful. We can't figure it out soon, it's gonna get real bad.",
    setupDescription: "Place Reaver Alert Tokens in Motherlode (Red Sun) and Uroboros Belt (Blue Sun).",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    rules: createStoryRules("Goin' Reaver", [
      { type: 'addFlag', flag: 'placeReaverAlertsInMotherlodeAndUroboros' },
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    advancedRule: {
        id: "adv_wolf_at_your_door",
        title: "Wolf At Your Door"
    }
  },
  {
    title: STORY_TITLES.HEROES_AND_MISFITS,
    intro: "Legends whisper the tales of the ship that could outrun Alliance Cruisers and Reavers alike. A ship that carried a rag-tag crew, each a misfit, each a hero. Now, it's time for you to make your own legacy.",
    setupDescription: "Starting Resources: Begin play at Persephone with Malcolm and Serenity (with Expanded Crew Quarters), Zoë, Wash, Jayne, Kaylee, Simon Tam, River Tam, Inara, Shepherd Book, and $2000. Alliance Alerts: Start with one random Alliance Alert in play. Adventure Deck: Shuffle all 3-Goal story cards into a single deck.",
    requiredExpansion: "tenth",
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.HEROES_AND_MISFITS, [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 2000, description: "Story Override" },
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setShipPlacement', location: 'persephone' }
    ]),
    challengeOptions: [
      { id: 'heroes_custom_setup', label: "Why should Mal have all the fun? Pick the Leader, Ship, and Supply Planet of your choice. Begin the game with $2000 and a full compliment of your favourite Crew from the show or game." }
    ],
    advancedRule: {
        id: "adv_contact_quirks_work",
        title: "Contact Quirks - Work"
    }
  },
  {
    title: "Once Upon A Time In The Big Black",
    intro: "Robin Hood, Ching Shih, Billy the Kid, Al Capone, Bori Khan. Test your mettle to tell a tale to match the legends.",
    setupDescription: "Special Rules: Collect Misbehave cards from completed Jobs (sideboard). 'Alliance Operatives' cannot be collected. Action: Spend $6000 to recover 1 Game Length Token (once/turn).",
    requiredExpansion: "tenth",
    isSolo: true,
    rules: createStoryRules("Once Upon A Time In The Big Black", [
      { type: 'addFlag', flag: 'soloGameTimer' }
    ]),
    challengeOptions: [
      { id: 'no_immoral', label: "Don't work Immoral Jobs." },
      { id: 'no_capers', label: "No Capers allowed!" },
      { id: 'no_aces', label: "Don't use Aces." },
      { id: 'universe_challenge', label: "Attach a Mr. Universe Challenge Card to every Job." }
    ],
    advancedRule: {
        id: "adv_alt_reaver_contacts",
        title: "Alternate Reaver Contacts"
    }
  },
  {
    title: STORY_TITLES.RACING_A_PALE_HORSE,
    intro: "The Operative has your scent. He's closing in on your home, and nothing can stop him. Well, maybe nothing except Glücklich Jiã's prototype next-gen artillery cannon...",
    setupDescription: "Place your Haven at Deadwood, Blue Sun. If you end your turn at your Haven, remove Disgruntled from all Crew. Do not use a Timer for this game.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.RACING_A_PALE_HORSE, [
      { type: 'addFlag', flag: 'disableSoloTimer' }
    ]),
    advancedRule: {
        id: "adv_automated_movement",
        title: "Automated Movement"
    }
  },
  {
    title: STORY_TITLES.SEEDS_OF_REBELLION,
    intro: "The New Resistance is ready to open up some eyes and change a few hearts. They need a savvy captain to deliver key personnel to the heart of Alliance space.",
    setupDescription: "Harken Forbidden: You may not deal with, or be Solid with Harken. Resistance Missions: Place Harken's 7 Immoral Transport Jobs in a separate discard pile to represent New Resistance Missions.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.SEEDS_OF_REBELLION, [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }
    ]),
    advancedRule: {
        id: "adv_lost_little_lambs",
        title: "Lost Little Lambs"
    }
  },
  {
    title: STORY_TITLES.THE_LONELY_SMUGGLERS_BLUES,
    intro: "Sometimes, it gets lonely in the Black, but it's a good way to dodge the law when you're haulin' goods that might draw the wrong kind of attention.",
    setupDescription: "Place 3 Contraband on each Supply Planet except Persephone and Space bazaar. Place a Goal Token on the Contact Decks for Amnon Duul, Patience, Badger, and Niska. Do not deal Starting Jobs. Begin play at Londinium. Start with one random Alliance Alert Card in play.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    rules: createStoryRules(STORY_TITLES.THE_LONELY_SMUGGLERS_BLUES, [
      { type: 'addFlag', flag: 'soloGameTimer' },
      { type: 'addFlag', flag: 'lonelySmugglerSetup' },
      { type: 'setShipPlacement', location: 'londinium' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ]),
    advancedRule: {
        id: "adv_lone_targets",
        title: "Lone Targets"
    }
  },
  {
    title: "The Raggedy Edge",
    intro: "It's a hard life out in the Black. See how long you can last before Reavers, the law, or bad luck catches up with you.",
    setupDescription: "Do not use a Timer for this game. Start with one random Alliance Alert Card in play. Begin play with 1 Goal Token.",
    requiredExpansion: "tenth",
    additionalRequirements: ["crime"],
    isSolo: true,
    rules: createStoryRules("The Raggedy Edge", [
      { type: 'modifyResource', resource: 'goalTokens', method: 'add', value: 1, description: "Begin play with 1 Goal Token." },
      { type: 'addFlag', flag: 'disableSoloTimer' },
      { type: 'addFlag', flag: 'startWithAlertCard' }
    ]),
    advancedRule: {
        id: "adv_contact_quirks_deal",
        title: "Contact Quirks - Deal"
    }
  },
];