import { StoryCardDef } from '../../types';
import { CONTACT_NAMES } from '../ids';

export const TENTH_STORIES: StoryCardDef[] = [
  {
    title: "A Friend In Every Port",
    intro: "High places, low places... When you sail the Black for a living, best to be on terms with as many folks as possible.",
    setupDescription: "Starting Jobs: Starting with the last player to choose a Leader, each player chooses 1 Job from 3 different Contacts. Mr. Universe cannot be chosen for starting Jobs. Priming the Pump: Reveal the top 6 cards of each Supply deck. Place the revealed cards in their discard piles.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103874/sjliver",
    tags: ['character'],
    rules: [
      { type: 'setJobMode', mode: 'draft_choice', source: 'story', sourceName: "A Friend In Every Port" },
      { type: 'addFlag', flag: 'useAllContactsForJobDraft', source: 'story', sourceName: "A Friend In Every Port" },
      { type: 'modifyPrime', multiplier: 2, source: 'story', sourceName: "A Friend In Every Port" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Friends in Low Places",
          content: ["Starting with the last player to choose a Leader, each player chooses 1 Job from 3 different Contacts. Mr. Universe cannot be chosen for these starting Jobs."]
        },
        source: 'story', 
        sourceName: "A Friend In Every Port"
      }
    ],
  },
  {
    title: "Aces Up Your Sleeve",
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
    setupDescription: "Create a stack of Alliance Alert Tokens equal to four times the number of players.",
    requiredExpansion: "tenth",
    sourceUrl: "https://boardgamegeek.com/image/8103873/sjliver",
    tags: ['reputation'],
    rules: [
      { type: 'createAlertTokenStack', multiplier: 4, source: 'story', sourceName: "Aces Up Your Sleeve" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Making a Name',
          content: ['Create a stack of Alliance Alert Tokens equal to four times the number of players.']
        },
        source: 'story', 
        sourceName: "Aces Up Your Sleeve"
      }
    ]
  },
  {
    title: "Dead Man's Hand",
    intro: "The tale of the Dead Man's Hand followed mankind from Earth-That-Was out to the Black. Honor the legends of the outlaws of old with a series of adventures across the 'Verse.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"],
    sourceUrl: "https://boardgamegeek.com/image/8103876/sjliver",
    tags: ['classic_heist'],
  },
  {
    title: "It's a Mad, Mad, Mad, Mad 'Verse!",
    intro: "A mishap at Eavesdown Docks seriously injures a renowned swindler. Before passing, he shares clues that will lead to a hidden fortune. News spreads fast, igniting a frenzied race.",
    setupDescription: "Players begin at Persephone.",
    requiredExpansion: "tenth",
    additionalRequirements: ["kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103877",
    tags: ['classic_heist'],
    rules: [
      { type: 'setShipPlacement', location: 'persephone', source: 'story', sourceName: "It's a Mad, Mad, Mad, Mad 'Verse!" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "A Frenzied Race",
          content: ["Players begin at Persephone."]
        },
        source: 'story', 
        sourceName: "It's a Mad, Mad, Mad, Mad 'Verse!"
      }
    ]
  },
  {
    title: "Let's Be Bad Guys",
    intro: "It takes a particular kind of sinner to build lasting bridges with Adelai Niska. Are you that brand of renegade?",
    setupDescription: "Players may not deal with Niska until they are Solid with at least one other Contact. Jobs for Niska are not dealt during Set Up.",
    requiredExpansion: "tenth",
    sourceUrl: "https://boardgamegeek.com/image/8103878/sjliver",
    tags: ['criminal_enterprise'],
    rules: [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA, source: 'story', sourceName: "Let's Be Bad Guys" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Earning Trust',
          content: ["Jobs for Niska are not dealt during Set Up."]
        },
        source: 'story', 
        sourceName: "Let's Be Bad Guys"
      }
    ]
  },
  {
    title: "Red Skies Over Ransom",
    intro: "Reavers are pushing out more and more, making delivery runs almost impossible. Keelhauler Transport & Trading Co. is hiring skilled pilots, madcap mercs, and crafty smugglers to haul needed goods to their Rim distributors.",
    setupDescription: "Reaver Sighting!: Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times. Put a stack of Reaver Alert Tokens there as a reminder. These tokens are never cleared.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue"],
    sourceUrl: "https://boardgamegeek.com/image/8103879/sjliver",
    tags: ['survival'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: { 
            content: ['⚠️ Restriction: New Canaan may not be chosen as a starting location.'],
            position: 'before'
        },
        source: 'story', 
        sourceName: "Red Skies Over Ransom"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Reaver Sighting!",
          content: ["Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times. Put a stack of Reaver Alert Tokens there as a reminder. These tokens are never cleared."]
        },
        source: 'story', 
        sourceName: "Red Skies Over Ransom"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Reaver Sighting!",
          content: ["Treat New Canaan, Blue Sun as if there is a Reaver Cutter there at all times."]
        },
        source: 'story', 
        sourceName: "Red Skies Over Ransom"
      },
      {
        type: 'createAlertTokenStack',
        fixedValue: 6,
        tokenName: 'Reaver Alert Tokens',
        description: 'Place this stack on New Canaan. These tokens are never cleared.',
        source: 'story', 
        sourceName: "Red Skies Over Ransom"
      }
    ]
  },
  {
    title: "Running On Empty",
    intro: "Dust Devil attacks on refineries have spiked fuel prices. Higher costs and shortages are squeezing the entire 'Verse, causing worlds of hurt. The perpetrators must be found!",
    setupDescription: "Players do not receive free starting Fuel or Parts. Each player begins with an extra $1200.",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103880/sjliver",
    tags: ['character'],
    rules: [
      { type: 'modifyResource', resource: 'credits', method: 'add', value: 1200, description: "Story Bonus", source: 'story', sourceName: "Running On Empty" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No Starting Fuel", source: 'story', sourceName: "Running On Empty" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No Starting Parts", source: 'story', sourceName: "Running On Empty" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Fuel Shortage',
          content: ["Players do not receive free starting Fuel or Parts. Each player begins with an extra $1200."]
        },
        source: 'story', 
        sourceName: "Running On Empty"
      }
    ]
  },
  {
    title: "The Wobbly Headed Doll Caper",
    intro: "Dolls with big heads that wobble! What could go wrong!",
    requiredExpansion: "tenth",
    additionalRequirements: ["blue", "kalidasa"],
    sourceUrl: "https://boardgamegeek.com/image/8103883/sjliver",
    tags: ['classic_heist', 'mystery'],
  },
];