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

export const KALIDASA_STORIES: StoryCardDef[] = [
  {
    title: "It's All In Who You Know",
    intro: "Credits are all well and good, but a strong network of contacts will pay greater dividends in the future. That's a lesson every captain gets to learn early, or they're likely not to be around long enough to learn it at all.",
    setupDescription: "Create a stack of Alliance Alert Tokens (3x Players). No Starting Jobs.",
    requiredExpansion: "kalidasa",
    rules: createStoryRules("It's All In Who You Know", [
      { type: 'createAlertTokenStack', multiplier: 3 },
      { type: 'setJobMode', mode: 'no_jobs' }
    ])
  },
  {
    title: "The Scavenger's 'Verse",
    intro: "Scour the 'Verse high and low, to the Rim and back you may go.",
    requiredExpansion: "kalidasa"
  },
  {
    title: "The Well's Run Dry",
    intro: "Increased Alliance oversight has made gettin' paid hard. Folks are limited to whatever cash they've got stashed under their bedrolls; even the movers and shakers are findin' the spigot's run dry.",
    requiredExpansion: "kalidasa"
  },
];