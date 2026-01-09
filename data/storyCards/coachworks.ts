import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const COACHWORKS_STORIES: StoryCardDef[] = [
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785043/gerryrailbaron",
    setupDescription: "Place one job from each Contact face up on top of its deck. These face up Jobs form a shared hand of Inactive Jobs that everyone may use. All Players start with a Warrant token.",
    rules: createStoryRules("Down and Out", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'A Checkered Past',
          content: ["All Players start with a Warrant token."]
        }
      },
      { type: 'setJobMode', mode: 'no_jobs' },
      { type: 'addFlag', flag: 'sharedHandSetup' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Shared Hand of Inactive Jobs',
          content: [
            { type: 'paragraph', content: ["No Starting Jobs are dealt. Instead, a shared pool of jobs is available to all players from the start of the game."] },
            { type: 'list', items: [
              ["One ", { type: 'strong', content: 'face-up Job Card' }, " is placed on top of each Contact's deck. These form the shared hand of ", { type: 'strong', content: 'Inactive Jobs' }, "."],
              ["Players may take a face-up Job from this shared hand by using a ", { type: 'strong', content: 'Deal Action' }, " at the Contact's location."],
              ["When a shared Job is taken, it is immediately replaced with the next card from that Contact's deck."]
            ]}
          ]
        }
      }
    ])
  },
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785042/gerryrailbaron",
    setupDescription: "Special 'winds of fate' rules for placing Goal tokens. No Starting Jobs are dealt.",
    rules: createStoryRules("Where The Wind Takes Us", [
      { type: 'setJobMode', mode: 'wind_takes_us' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "The Winds of Fate",
          content: [
            { type: 'paragraph', content: ["Each player draws jobs from a single Contact Deck of their choice:"] },
            { type: 'list', items: [
              ["Draw ", { type: 'strong', content: "4 Job Cards" }, " each (for 3 or fewer players)."],
              ["Draw ", { type: 'strong', content: "3 Job Cards" }, " each (for 4 or more players)."]
            ]},
            { type: 'paragraph', content: ['Place a ', { type: 'strong', content: 'Goal Token' }, ' at each Job\'s Drop Off / Target / Destination Sector.'] },
            { type: 'paragraph', content: ['After placing tokens, return all drawn Job cards to their Contact Decks and reshuffle the decks.'] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Do not deal any other Starting Jobs.' }] }
          ]
        }
      }
    ])
  },
];