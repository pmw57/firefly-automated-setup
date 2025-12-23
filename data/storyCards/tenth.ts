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

export const TENTH_STORIES: StoryCardDef[] = [
  {
    title: STORY_TITLES.A_FRIEND_IN_EVERY_PORT,
    intro: "High places, low places... When you sail the Black for a living, best to have friends in ALL places.",
    setupDescription: "Draft 3 specific contact decks for starting jobs. Priming the Pump discards 2x cards. Requires Blue Sun & Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    rules: [
      { type: 'setJobMode', mode: 'draft_choice', source: 'story', sourceName: STORY_TITLES.A_FRIEND_IN_EVERY_PORT },
      { type: 'modifyPrime', multiplier: 2, source: 'story', sourceName: STORY_TITLES.A_FRIEND_IN_EVERY_PORT },
    ],
  },
  {
    title: "Aces Up Your Sleeve",
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
    requiredExpansion: "tenth"
  },
  {
    title: "Dead Man's Hand",
    intro: "The tale of the Dead Man's Hand followed mankind from Earth-That-Was out to the Black. Honor the legends of the outlaws of old with a series of adventures across the 'Verse.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"]
  },
  {
    title: STORY_TITLES.ITS_A_MAD_MAD_VERSE,
    intro: "A mishap at Eavesdown Docks seriously injures a renowned swindler. Before passing, he shares clues that will lead to a hidden fortune. News spreads fast, igniting a frenzied race.",
    setupDescription: "All ships start at Persephone. Requires Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["kalidasa"],
    rules: createStoryRules(STORY_TITLES.ITS_A_MAD_MAD_VERSE, [
      { type: 'setShipPlacement', location: 'persephone' }
    ])
  },
  {
    title: STORY_TITLES.LETS_BE_BAD_GUYS,
    intro: "It takes a particular kind of sinner to build lasting bridges with Adelai Niska. Are you that brand of renegade?",
    setupDescription: "Niska is forbidden for Starting Jobs.",
    requiredExpansion: "tenth",
    rules: createStoryRules(STORY_TITLES.LETS_BE_BAD_GUYS, [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA }
    ])
  },
  {
    title: "Red Skies Over Ransom",
    intro: "Reavers are pushing out more and more, making delivery runs almost impossible. Keelhauler Transport & Trading Co. is hiring skilled pilots, madcap mercs, and crafty smugglers to haul needed goods to their Rim distributors.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"]
  },
  {
    title: STORY_TITLES.RUNNING_ON_EMPTY,
    intro: "Dust Devil attacks on refineries have spiked fuel prices. Higher costs and shortages are squeezing the entire 'Verse, causing worlds of hurt. The perpetrators must be found!",
    setupDescription: "Receive +$1200 Starting Credits. No Starting Fuel/Parts. Requires Blue Sun & Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    rules: createStoryRules(STORY_TITLES.RUNNING_ON_EMPTY, [
      { type: 'modifyResource', resource: 'credits', method: 'add', value: 1200, description: "Story Bonus" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No Starting Fuel/Parts" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No Starting Fuel/Parts" }
    ])
  },
  {
    title: "The Wobbly Headed Doll Caper",
    intro: "Dolls with big heads that wobble! What could go wrong!",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"]
  },
];