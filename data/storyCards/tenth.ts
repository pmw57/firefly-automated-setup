
import { StoryCardDef } from '../../types';

export const TENTH_STORIES: StoryCardDef[] = [
  {
    title: "A Friend In Every Port",
    intro: "High places, low places... When you sail the Black for a living, best to have friends in ALL places.",
    setupDescription: "Draft 3 specific contact decks for starting jobs. Priming the Pump discards 2x cards. Requires Blue Sun & Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    setupConfig: {
      jobDrawMode: "draft_choice",
      primingMultiplier: 2
    }
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
    title: "It's a Mad, Mad, Mad, Mad 'Verse!",
    intro: "A mishap at Eavesdown Docks seriously injures a renowned swindler. Before passing, he shares clues that will lead to a hidden fortune. News spreads fast, igniting a frenzied race.",
    setupDescription: "All ships start at Persephone. Requires Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["kalidasa"],
    setupConfig: {
      shipPlacementMode: "persephone"
    }
  },
  {
    title: "Let's Be Bad Guys",
    intro: "It takes a particular kind of sinner to build lasting bridges with Adelai Niska. Are you that brand of renegade?",
    setupDescription: "Niska is forbidden for Starting Jobs.",
    requiredExpansion: "tenth",
    setupConfig: {
      forbiddenStartingContact: "Niska"
    }
  },
  {
    title: "Red Skies Over Ransom",
    intro: "Reavers are pushing out more and more, making delivery runs almost impossible. Keelhauler Transport & Trading Co. is hiring skilled pilots, madcap mercs, and crafty smugglers to haul needed goods to their Rim distributors.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"]
  },
  {
    title: "Running On Empty",
    intro: "Dust Devil attacks on refineries have spiked fuel prices. Higher costs and shortages are squeezing the entire 'Verse, causing worlds of hurt. The perpetrators must be found!",
    setupDescription: "Receive +$1200 Starting Credits. No Starting Fuel/Parts. Requires Blue Sun & Kalidasa.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    setupConfig: {
      startingCreditsBonus: 1200,
      noStartingFuelParts: true
    }
  },
  {
    title: "The Wobbly Headed Doll Caper",
    intro: "Dolls with big heads that wobble! What could go wrong!",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"]
  },
];
