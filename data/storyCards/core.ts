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

export const CORE_STORIES: StoryCardDef[] = [
  {
    title: STORY_TITLES.DESPERADOES,
    intro: "Your checkered past is catching up with you and the Alliance is hot on your tail! It's time to make a final cash grab and head out to the Rim to retire before the Alliance makes other arrangements.",
    setupDescription: "Start with 1 Warrant. Harken jobs unavailable.",
    rules: createStoryRules(STORY_TITLES.DESPERADOES, [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }
    ])
  },
  {
    title: STORY_TITLES.FIRST_TIME_IN_CAPTAINS_CHAIR,
    intro: "So you finally took the plunge and borrowed enough credits for a ship to call your own. You're in debt up to your eyeballs with a creditor that's not the sort of man to be trifled with.",
    setupDescription: "Starting Jobs drawn only from Harken and Amnon Duul.",
    rules: createStoryRules(STORY_TITLES.FIRST_TIME_IN_CAPTAINS_CHAIR, [
      { type: 'allowContacts', contacts: [CONTACT_NAMES.HARKEN, CONTACT_NAMES.AMNON_DUUL] }
    ])
  },
  {
    title: "Harken's Folly",
    intro: "Commander Harken has been entrusted by the Alliance to provide security for a gathering of Alliance VIPs and Parliament Officials. Lead Harken off on a wild goose chase and infiltrate the venue. Inside, plant bugs and hack secure servers to gather sensitive intel that'll make you rich."
  },
  {
    title: "Niska's Holiday",
    intro: "Adelai Niska is taking a holiday and has left his operations in the incompetent hands of one of his wife's many nephews. This presents an opportunity for an ambitious Captain to prove himself during his absence. Insure the continuing profitability of Niska's criminal enterprise and ensure his nephew's failure."
  },
  {
    title: "Patience's War",
    intro: "Patience has gotten herself embroiled in an all out Range War. She is paying hard cash to any crew smart enough to use a gun and dumb enough to put themselves in harm's way... and you know just the right crew for the job!"
  },
  {
    title: STORY_TITLES.RESPECTABLE_PERSONS,
    intro: "There's a heap of trouble waiting out in the 'Verse. The Big Black is full of derelict ships, drifting proof of their Captain's missteps. Keeping you and yours in bullets and chow can be challenge enough. Not everyone has the mettle to keep their boat in the air. Prove you've got what it takes."
  },
  {
    title: "The King Of All Londinium",
    intro: "The New Cardiff Museum is about to play host to a grand exhibit of \"Earth That Was\" artifacts, the centerpiece of which is the Crown Jewels of old England. Endeavor to swap a quality counterfeit for the \"Shiny Hat\" and make off with the real one leaving no one the wiser."
  },
];