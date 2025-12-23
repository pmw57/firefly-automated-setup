import { StoryCardDef, SetupRule } from '../../types';

// Helper to avoid repeating source info
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
    return rules.map(rule => ({
        ...rule,
        source: 'story',
        sourceName,
    })) as SetupRule[];
};

export const COACHWORKS_STORIES: StoryCardDef[] = [
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    setupDescription: "Create shared hand of Inactive Jobs. Start with Warrant Token.",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785043/gerryrailbaron",
    rules: createStoryRules("Down And Out", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'addFlag', flag: 'sharedHandSetup' }
    ])
  },
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    setupDescription: "Place Goal Tokens at destination sectors instead of keeping starting jobs.",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785042/gerryrailbaron",
    rules: createStoryRules("Where The Wind Takes Us", [
      { type: 'setJobMode', mode: 'wind_takes_us' }
    ])
  },
];