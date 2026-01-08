import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const KALIDASA_STORIES: StoryCardDef[] = [
  {
    title: "It's All In Who You Know",
    intro: "Credits are all well and good, but a strong network of contacts will pay greater dividends in the future. That's a lesson every captain gets to learn early, or they're likely not to be around long enough to learn it at all.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785039/gerryrailbaron",
    setupDescription: "Creates an Alliance Alert Token stack. No starting jobs are dealt.",
    noJobsMessage: {
      title: "Building A Network",
      description: "No starting jobs are dealt. You must build your network from scratch."
    },
    rules: createStoryRules("It's All In Who You Know", [
      { type: 'createAlertTokenStack', multiplier: 3, title: "Word Gets Around" },
      { type: 'setJobMode', mode: 'no_jobs' }
    ])
  },
  {
    title: "The Scavenger's 'Verse",
    intro: "Scour the 'Verse high and low, to the Rim and back you may go.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785038/gerryrailbaron"
  },
  {
    title: "The Well's Run Dry",
    intro: "Increased Alliance oversight has made gettin' paid hard. Folks are limited to whatever cash they've got stashed under their bedrolls; even the movers and shakers are findin' the spigot's run dry.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785037/gerryrailbaron"
  },
];