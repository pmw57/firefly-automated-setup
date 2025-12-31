import { StoryCardDef, SetupRule } from '../../types/index';
import { CONTACT_NAMES } from '../ids';

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
    title: "Desperadoes",
    soloTimerAdjustment: "Declare Last Call before discarding your last token to win the game.",
    intro: "Your checkered past is catching up with you and the Alliance is hot on your tail! It's time to make a final cash grab and head out to the Rim to retire before the Alliance makes other arrangements.",
    setupDescription: "Start with 1 Warrant. Harken jobs unavailable.",
    sourceUrl: "https://boardgamegeek.com/image/2785050/gerryrailbaron",
    rules: createStoryRules("Desperadoes", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'forbidContact', contact: CONTACT_NAMES.HARKEN },
      { 
        type: 'addSpecialRule', 
        category: 'jobs',
        rule: {
          title: "Contact Restriction",
          content: ["Harken jobs are unavailable."]
        }
      }
    ])
  },
  {
    title: "First Time in the Captain's Chair",
    intro: "So you finally took the plunge and borrowed enough credits for a ship to call your own. You're in debt up to your eyeballs with a creditor that's not the sort of man to be trifled with.",
    setupDescription: "Starting Jobs drawn only from Harken and Amnon Duul.",
    sourceUrl: "https://boardgamegeek.com/image/2785053/gerryrailbaron",
    rules: createStoryRules("First Time in the Captain's Chair", [
      { type: 'allowContacts', contacts: [CONTACT_NAMES.HARKEN, CONTACT_NAMES.AMNON_DUUL] },
      { 
        type: 'addSpecialRule', 
        category: 'jobs',
        rule: {
          title: "Limited Job Contacts",
          content: ["Starting Jobs are drawn only from Harken and Amnon Duul."]
        }
      }
    ])
  },
  {
    title: "Harken's Folly",
    intro: "Commander Harken has been entrusted by the Alliance to provide security for a gathering of Alliance VIPs and Parliament Officials. Lead Harken off on a wild goose chase and infiltrate the venue. Inside, plant bugs and hack secure servers to gather sensitive intel that'll make you rich.",
    sourceUrl: "https://boardgamegeek.com/image/2785049/gerryrailbaron"
  },
  {
    title: "Niska's Holiday",
    intro: "Adelai Niska is taking a holiday and has left his operations in the incompetent hands of one of his wife's many nephews. This presents an opportunity for an ambitious Captain to prove himself during his absence. Insure the continuing profitability of Niska's criminal enterprise and ensure his nephew's failure.",
    sourceUrl: "https://boardgamegeek.com/image/2785048/gerryrailbaron"
  },
  {
    title: '"Respectable" Persons Of Business',
    soloTimerAdjustment: "Declare Last Call before discarding your last token to win the game.",
    intro: "There's a heap of trouble waiting out in the 'Verse. The Big Black is full of derelict ships, drifting proof of their Captain's missteps. Keeping you and yours in bullets and chow can be challenge enough. Not everyone has the mettle to keep their boat in the air. Prove you've got what it takes.",
    sourceUrl: "https://boardgamegeek.com/image/2785036/gerryrailbaron"
  },
  {
    title: "The King Of All Londinium",
    intro: "The New Cardiff Museum is about to play host to a grand exhibit of \"Earth That Was\" artifacts, the centerpiece of which is the Crown Jewels of old England. Endeavor to swap a quality counterfeit for the \"Shiny Hat\" and make off with the real one leaving no one the wiser.",
    sourceUrl: "https://boardgamegeek.com/image/2785047/gerryrailbaron"
  },
];