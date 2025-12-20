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

export const PIRATES_STORIES: StoryCardDef[] = [
  {
    title: "...Another Man's Treasure",
    intro: "Wealth can be measured in many ways. In some parts of the 'Verse Alliance credits ain't worth the paper they're printed on. For those regions, a more practical measure of wealth is required. Hoard a mountain of trade goods and spare parts, through any means necessary. Break contracts, steal from your rivals or just pick the bones. Anything goes!",
    setupDescription: "Choose Havens in Border Space. Remove all Piracy Jobs from decks after setup.",
    requiredExpansion: "pirates",
    rules: createStoryRules("...Another Man's Treasure", [
      { type: 'addFlag', flag: 'addBorderHavens' },
      { type: 'addFlag', flag: 'removePiracyJobs' }
    ])
  },
  {
    title: "Jail Break",
    intro: "Your friend has been pinched by the Alliance and you don't intend to let 'em twist. Bad plan's better than no plan...",
    requiredExpansion: "pirates"
  },
  {
    title: "The Choices We Make",
    intro: "The 'Verse is full of people trying to carve themselves a little slice, however they can. Even a good man can get turned about from time to time. The straight and narrow can get a might twisted when walkin' the raggedy edge. In the end, the mark a person leaves all comes down to the choices they make.",
    requiredExpansion: "pirates"
  },
];