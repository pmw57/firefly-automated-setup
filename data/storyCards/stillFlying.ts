import { StoryCardDef, SetupRule } from '../../types';
import { STORY_TITLES } from '../ids';

// Helper to avoid repeating source info
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
    return rules.map(rule => ({
        ...rule,
        source: 'story',
        sourceName,
    })) as SetupRule[];
};

export const STILL_FLYING_STORIES: StoryCardDef[] = [
  {
    title: STORY_TITLES.RARE_SPECIMEN,
    intro: "Saffron's at it again. This time, she's convinced Badger that she's from a respectable family, and now the sad little king has his eye on a psychotic blushing bride. Whoever collects the most presents gets to give the toast... before it turns into a shotgun wedding.",
    setupDescription: "Players start with a Caper Card. No Starting Jobs dealt.",
    requiredExpansion: "still_flying",
    rules: createStoryRules(STORY_TITLES.RARE_SPECIMEN, [
      { type: 'setJobMode', mode: 'caper_start' }
    ])
  },
  {
    title: "The Rumrunner's Seasonal",
    intro: "An eccentric billionaire arranges a very special race every year to pick his most favorite captain. Win and you're set for life... or at least until someone breaks your record next time around.",
    requiredExpansion: "still_flying",
    additionalRequirements: ["blue", "kalidasa"]
  },
  {
    title: "The Smuggly Bustle",
    intro: "The Alliance is cracking down. May come a day when there won't be room for naughty men and women to slip about, but for now, the right set of connections could help make you a smuggler extraordinaire.",
    setupDescription: "Place an Alliance Alert Token in every planetary Sector in Alliance Space. Requires Blue Sun & Kalidasa.",
    requiredExpansion: "still_flying",
    additionalRequirements: ["blue", "kalidasa"],
    rules: createStoryRules("The Smuggly Bustle", [
      { type: 'addFlag', flag: 'placeAllianceAlertsInAllianceSpace' }
    ])
  },
];