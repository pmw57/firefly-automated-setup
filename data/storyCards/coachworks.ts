import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const COACHWORKS_STORIES: StoryCardDef[] = [
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785043/gerryrailbaron",
    setupDescription: "Start with 1 Warrant. No jobs are dealt; instead, a shared hand is created on top of the Contact Decks.",
    rules: createStoryRules("Down And Out", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Shared Hand Setup',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: "No Starting Jobs are dealt." }, " Instead, place one Job from each Contact face up on top of its deck."] },
            { type: 'paragraph', content: ["These face-up Jobs form a shared hand of inactive Jobs that all players may access."] }
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
    setupDescription: "Special 'winds of fate' job draw rules.",
    rules: createStoryRules("Where The Wind Takes Us", [
      { type: 'setJobMode', mode: 'wind_takes_us' }
    ])
  },
];