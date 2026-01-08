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
          title: 'Competing for Scraps',
          content: [{ type: 'paragraph', content: ["Place one job from each Contact face up on top of its deck. These face up Jobs form a shared hand of Inactive Jobs that everyone may use."]}]
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
    ])
  },
];