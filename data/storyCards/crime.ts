import { StoryCardDef } from '../../types';
import { CONTACT_NAMES } from '../ids';
import { createStoryRules } from './utils';

export const CRIME_STORIES: StoryCardDef[] = [
  {
    title: "Smuggler's Blues",
    intro: "Bringin' goods to folk who want 'em is an old-fashioned way to make a living... 'cept, sometimes, a law or two gets in the way.",
    requiredExpansion: "crime",
    sourceUrl: "https://boardgamegeek.com/image/3464668/firefly-the-game-crime-and-punishment",
    setupDescription: "Place 3 Contraband on each planetary sector in Alliance space. Optional: If playing with both Blue Sun and Kalidasa, place 2 Contraband on each Planetary Sector in Rim Space instead. Place a $2000 bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks. Players do not receive Starting Jobs and begin at Londinium. Start with one random Alliance Alert Card in play.",
    rules: createStoryRules("Smuggler's Blues", [
      { type: "addFlag", flag: "smugglersBluesSetup" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Smuggler's Blues Contraband",
          content: ["Place 3 Contraband on each planetary sector in Alliance Space."]
        }
      },
      { type: "addFlag", flag: "startWithAlertCard" },
      { type: "setShipPlacement", location: "londinium" },
      {
        type: "addSpecialRule",
        category: "draft",
        rule: {
          title: "Story Override: Starting Location",
          content: [{ type: 'paragraph', content: ['All players begin the game at ', { type: 'strong', content: 'Londinium' }, '. The standard draft for ship/leader selection still occurs, but placement is fixed.'] }]
        },
      },
      { type: "setJobMode", mode: "no_jobs" },
      {
        type: "addSpecialRule",
        category: "jobs",
        rule: {
          title: "Contact Deck Bonus",
          content: [{ type: 'paragraph', content: ['Place a ', { type: 'strong', content: '$2000 Bill' }, ' under the Contact Decks for ', { type: 'strong', content: 'Amnon Duul, Patience, Badger, and Niska' }, '.'] }]
        },
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ])
  },
  {
    title: "Wanted Men",
    intro: "Infamy's a funny thing. Bucking the law, while a might stressful day-to-day, leads to being known. The more you're known, the more your name's worth. Trick of it is, you got to sock away a lifetime of credits before you find yourself retiring early, in an Alliance lockup...",
    setupDescription: "Each player starts the game with 1 Warrant. Players' starting locations may not be within Alliance Space. Start with one random Alliance Alert Card in play. Starting Jobs may only be drawn from Patience, Badger, Niska, Mr. Universe and Fanty & Mingo.",
    requiredExpansion: "crime",
    sourceUrl: "https://boardgamegeek.com/image/3524452",
    rules: createStoryRules("Wanted Men", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'addFlag', flag: 'startOutsideAllianceSpace' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Placement Restriction',
          content: [`Players' starting locations `, { type: 'strong', content: `may not be within Alliance Space` }, `.`]
        }
      },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'allowContacts', contacts: [CONTACT_NAMES.PATIENCE, CONTACT_NAMES.BADGER, CONTACT_NAMES.NISKA, CONTACT_NAMES.MR_UNIVERSE, CONTACT_NAMES.FANTY_MINGO] },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Limited Job Contacts",
          content: ["Job contacts are limited. Draw one Job Card from each Contact listed below."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Alliance High Alert',
          content: ['Begin the game with one random Alliance Alert Card in play.']
        }
      }
    ])
  },
];