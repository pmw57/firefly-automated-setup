import { StoryCardDef } from '../../types';

export const COACHWORKS_STORIES: StoryCardDef[] = [
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    setupDescription: "Create shared hand of Inactive Jobs. Start with Warrant Token.",
    requiredExpansion: "coachworks",
    effects: [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, source: { source: 'story', name: "Down And Out" }, description: "Start with 1 Warrant." }
    ],
    setupConfig: {
      flags: ['sharedHandSetup']
    }
  },
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    setupDescription: "Place Goal Tokens at destination sectors instead of keeping starting jobs.",
    requiredExpansion: "coachworks",
    setupConfig: {
      jobDrawMode: "wind_takes_us"
    }
  },
];