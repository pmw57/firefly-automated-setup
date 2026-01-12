import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const KALIDASA_STORIES: StoryCardDef[] = [
  {
    title: "It's All In Who You Know",
    intro: "Credits are all well and good, but a strong network of contacts will pay greater dividends in the future. That's a lesson every captain gets to learn early, or they're likely not to be around long enough to learn it at all.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785039/gerryrailbaron",
    setupDescription: "Creates an Alliance Alert Token stack. No starting jobs are dealt.",
    tags: ['reputation', 'verse_variant'],
    rules: createStoryRules("It's All In Who You Know", [
      { type: 'createAlertTokenStack', multiplier: 3 },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Word Gets Around',
          content: ['Create a stack of Alliance Alert Tokens equal to three times the number of players.']
        }
      },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Building A Network',
          content: ["No starting jobs are dealt. You must build your network from scratch."]
        }
      }
    ])
  },
  {
    title: "The Scavenger's 'Verse",
    intro: "Scour the 'Verse high and low, to the Rim and back you may go.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785038/gerryrailbaron",
    tags: ['character', 'mystery'],
  },
  {
    title: "The Well's Run Dry",
    intro: "Increased Alliance oversight has made gettin' paid hard. Folks are limited to whatever cash they've got stashed under their bedrolls; even the movers and shakers are findin' the spigot's run dry.",
    requiredExpansion: "kalidasa",
    sourceUrl: "https://boardgamegeek.com/image/2785037/gerryrailbaron",
    tags: ['smugglers_run'],
  },
];
