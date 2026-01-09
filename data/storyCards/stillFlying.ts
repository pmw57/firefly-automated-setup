import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const STILL_FLYING_STORIES: StoryCardDef[] = [
  {
    title: "A Rare Specimen Indeed",
    soloTimerAdjustment: "Send Out Invites before discarding your last token to win the game.",
    intro: "Saffron's at it again. This time, she's convinced Badger that she's from a respectable family, and now the sad little king has his eye on a psychotic blushing bride. Whoever collects the most presents gets to give the toast... before it turns into a shotgun wedding.",
    setupDescription: "No starting jobs are dealt. Each player begins the game with one Caper.",
    requiredExpansion: "still_flying",
    sourceUrl: "https://boardgamegeek.com/image/8103875/sjliver",
    rules: createStoryRules("A Rare Specimen Indeed", [
      { type: 'setJobMode', mode: 'caper_start' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Caper Bonus',
          content: ["Each player begins the game with one Caper card."]
        }
      }
    ])
  },
  {
    title: "The Rumrunner's Seasonal",
    intro: "An eccentric billionaire arranges a very special race every year to pick his most favorite captain. Win and you're set for life... or at least until someone breaks your record next time around.",
    requiredExpansion: "still_flying",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103881/sjliver"
  },
  {
    title: "The Smuggly Bustle",
    intro: "The Alliance is cracking down. May come a day when there won't be room for naughty men and women to slip about, but for now, the right set of connections could help make you a smuggler extraordinaire.",
    requiredExpansion: "still_flying",
    additionalRequirements: ["blue", "kalidasa"],
    setupDescription: "Place an Alliance Alert Token on every planetary sector in Alliance Space.",
    sourceUrl: "https://boardgamegeek.com/image/8103882/sjliver",
    rules: createStoryRules("The Smuggly Bustle", [
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Alliance Space Lockdown',
          content: ["Place an Alliance Alert Token on every planetary sector in Alliance Space."]
        }
      }
    ])
  },
];