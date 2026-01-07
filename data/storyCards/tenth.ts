import { StoryCardDef } from '../../types';
import { CONTACT_NAMES } from '../ids';
import { createStoryRules } from './utils';

export const TENTH_STORIES: StoryCardDef[] = [
  {
    title: "A Friend In Every Port",
    intro: "High places, low places... When you sail the Black for a living, best to have friends in ALL places.",
    setupDescription: "Starting Jobs: Starting with the last player to choose a Leader, each player chooses 1 Job from 3 different Contacts. Mr. Universe cannot be chosen for starting Jobs. Priming the Pump: Reveal the top 6 cards of each Supply deck. Place the revealed cards in their discard piles.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103874/sjliver",
    rules: [
      { type: 'setJobMode', mode: 'draft_choice', source: 'story', sourceName: "A Friend In Every Port" },
      { type: 'modifyPrime', multiplier: 2, source: 'story', sourceName: "A Friend In Every Port" },
      {
        type: 'addSpecialRule',
        category: 'prime',
        source: 'story',
        sourceName: "A Friend In Every Port",
        rule: {
          title: "Priming the Pump Override",
          content: [
            "Reveal the top ",
            { type: 'strong', content: '6 cards' },
            " of each Supply deck. Place the revealed cards in their discard piles."
          ]
        }
      }
    ],
  },
  {
    title: "Aces Up Your Sleeve",
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
    setupDescription: "Create a stack of Alliance Alert Tokens equal to four times the number of players.",
    requiredExpansion: "tenth",
    sourceUrl: "https://boardgamegeek.com/image/8103873/sjliver",
    rules: createStoryRules("Aces Up Your Sleeve", [
      { type: 'createAlertTokenStack', multiplier: 4, title: "Making a Name" }
    ])
  },
  {
    title: "Dead Man's Hand",
    intro: "The tale of the Dead Man's Hand followed mankind from Earth-That-Was out to the Black. Honor the legends of the outlaws of old with a series of adventures across the 'Verse.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"],
    sourceUrl: "https://boardgamegeek.com/image/8103876/sjliver"
  },
  {
    title: "It's a Mad, Mad, Mad, Mad 'Verse!",
    intro: "A mishap at Eavesdown Docks seriously injures a renowned swindler. Before passing, he shares clues that will lead to a hidden fortune. News spreads fast, igniting a frenzied race.",
    setupDescription: "Players begin at Persephone.",
    requiredExpansion: "tenth",
    additionalRequirements: ["kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103877",
    rules: createStoryRules("It's a Mad, Mad, Mad, Mad 'Verse!", [
      { type: 'setShipPlacement', location: 'persephone' }
    ])
  },
  {
    title: "Let's Be Bad Guys",
    intro: "It takes a particular kind of sinner to build lasting bridges with Adelai Niska. Are you that brand of renegade?",
    setupDescription: "Players may not deal with Niska until they are Solid with at least one other Contact. Jobs for Niska are not dealt during Set Up.",
    requiredExpansion: "tenth",
    sourceUrl: "https://boardgamegeek.com/image/8103878/sjliver",
    rules: createStoryRules("Let's Be Bad Guys", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Earning Trust',
          content: ["Jobs for Niska are not dealt during Set Up."]
        }
      }
    ])
  },
  {
    title: "Red Skies Over Ransom",
    intro: "Reavers are pushing out more and more, making delivery runs almost impossible. Keelhauler Transport & Trading Co. is hiring skilled pilots, madcap mercs, and crafty smugglers to haul needed goods to their Rim distributors.",
    setupDescription: "Reaver Sighting!: Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times. Put a stack of Reaver Alert Tokens there as a reminder. These tokens are never cleared.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"],
    sourceUrl: "https://boardgamegeek.com/image/8103879/sjliver",
    rules: createStoryRules("Red Skies Over Ransom", [
      { type: 'addFlag', flag: 'excludeNewCanaanPlacement' },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Reaver Sighting!",
          content: ["Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times. Put a stack of Reaver Alert Tokens there as a reminder. These tokens are never cleared."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Reaver Sighting!",
          content: ["Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times."]
        }
      },
      {
        type: 'createAlertTokenStack',
        fixedValue: 6,
        tokenName: 'Reaver Alert Tokens',
        description: 'Place this stack on New Canaan. These tokens are never cleared.'
      }
    ])
  },
  {
    title: "Running On Empty",
    intro: "Dust Devil attacks on refineries have spiked fuel prices. Higher costs and shortages are squeezing the entire 'Verse, causing worlds of hurt. The perpetrators must be found!",
    setupDescription: "Players do not receive free starting Fuel or Parts. Each player begins with an extra $1200.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103880/sjliver",
    rules: createStoryRules("Running On Empty", [
      { type: 'modifyResource', resource: 'credits', method: 'add', value: 1200, description: "Story Bonus" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No Starting Fuel" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No Starting Parts" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Fuel Shortage',
          content: ["Players do not receive free starting Fuel or Parts. Each player begins with an extra $1200."]
        }
      }
    ])
  },
  {
    title: "The Wobbly Headed Doll Caper",
    intro: "Dolls with big heads that wobble! What could go wrong!",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103883/sjliver"
  },
];