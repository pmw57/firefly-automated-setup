import { StoryCardDef } from '../../types';
import { CONTACT_NAMES } from '../ids';

export const CRIME_STORIES: StoryCardDef[] = [
  {
    title: "Smuggler's Blues",
    intro: "Bringin' goods to folk who want 'em is an old-fashioned way to make a living... 'cept, sometimes, a law or two gets in the way.",
    requiredExpansion: "crime",
    sourceUrl: "https://boardgamegeek.com/image/3464668/firefly-the-game-crime-and-punishment",
    setupDescription: "Place 3 Contraband on each Planetary Sector in Alliance Space. Optional: If playing with both Blue Sun and Kalidasa, place 2 Contraband on each Planetary Sector in Rim Space instead. Place a $2000 Bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks. Players do not receive Starting Jobs and begin at Londinium. Start with one random Alliance Alert Card in play.",
    tags: ['smugglers_run'],
    rules: [
      { type: "addFlag", flag: "smugglersBluesSetup", source: 'story', sourceName: "Smuggler's Blues" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "A Lucrative Opportunity",
          content: ["Place 3 Contraband on each planetary sector in Alliance Space. Optional: If playing with both Blue Sun and Kalidasa, place 2 Contraband on each Planetary Sector in Rim Space instead."]
        },
        source: 'story', 
        sourceName: "Smuggler's Blues"
      },
      { type: "addFlag", flag: "startWithAlertCard", source: 'story', sourceName: "Smuggler's Blues" },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ["Begin the game with one random Alliance Alert Card in play."]
        },
        source: 'story', 
        sourceName: "Smuggler's Blues"
      },
      { type: "setShipPlacement", location: "londinium", source: 'story', sourceName: "Smuggler's Blues" },
      {
        type: "addSpecialRule",
        category: "draft_placement",
        rule: {
          title: "In the Belly of the Beast",
          content: ["Players begin at Londinium."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Smuggler's Blues"
      },
      { type: "setJobMode", mode: "no_jobs", source: 'story', sourceName: "Smuggler's Blues" },
      {
        type: 'setJobStepContent',
        position: 'after',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'strong', content: 'Place $2000 under the following Contact decks:'}]
          },
          {
            type: 'list',
            items: [
              [{ type: 'strong', content: 'Amnon Duul'}],
              [{ type: 'strong', content: 'Patience'}],
              [{ type: 'strong', content: 'Badger'}],
              [{ type: 'strong', content: 'Niska'}]
            ]
          }
        ],
        source: 'story', 
        sourceName: "Smuggler's Blues"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "A Reliable Fence",
          content: ["Place a $2000 Bill under the Contact Decks for Amnon Duul, Patience, Badger, and Niska. Players do not receive Starting Jobs."]
        },
        source: 'story', 
        sourceName: "Smuggler's Blues"
      }
    ]
  },
  {
    title: "Wanted Men",
    intro: "Infamy's a funny thing. Bucking the law, while a might stressful day-to-day, leads to being known. The more you're known, the more your name's worth. Trick of it is, you got to sock away a lifetime of credits before you find yourself retiring early, in an Alliance lockup...",
    setupDescription: "Each player starts the game with 1 Warrant. Players' starting locations may not be within Alliance Space. Start with one random Alliance Alert in play. Starting Jobs may only be drawn from Patience, Badger, Niska, Mr. Universe and Fanty & Mingo.",
    requiredExpansion: "crime",
    sourceUrl: "https://boardgamegeek.com/image/3524452",
    tags: ['reputation', 'smugglers_run'],
    rules: [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant.", source: 'story', sourceName: "Wanted Men" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'A Price on Your Head',
          content: ["Each player starts the game with 1 Warrant."]
        },
        source: 'story', 
        sourceName: "Wanted Men"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: { 
            content: ['⚠️ Not within Alliance Space'],
            position: 'before'
        },
        source: 'story', 
        sourceName: "Wanted Men"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Laying Low',
          content: ["Players' starting locations may not be within Alliance Space."]
        },
        source: 'story', 
        sourceName: "Wanted Men"
      },
      { type: 'addFlag', flag: 'startWithAlertCard', source: 'story', sourceName: "Wanted Men" },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ["Begin the game with one random Alliance Alert Card in play."]
        },
        source: 'story', 
        sourceName: "Wanted Men"
      },
      { type: 'allowContacts', contacts: [CONTACT_NAMES.PATIENCE, CONTACT_NAMES.BADGER, CONTACT_NAMES.NISKA, CONTACT_NAMES.MR_UNIVERSE, CONTACT_NAMES.FANTY_MINGO], source: 'story', sourceName: "Wanted Men" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Known Associates",
          content: ["Starting Jobs may only be drawn from Patience, Badger, Niska, Mr. Universe and Fanty & Mingo."]
        },
        source: 'story', 
        sourceName: "Wanted Men"
      },
    ]
  },
];