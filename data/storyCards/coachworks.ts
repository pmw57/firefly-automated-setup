import { StoryCardDef } from '../../types';

export const COACHWORKS_STORIES: StoryCardDef[] = [
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785043/gerryrailbaron",
    setupDescription: "Place one job from each Contact face up on top of its deck. These face up Jobs form a shared hand of Inactive Jobs that everyone may use. All Players start with a Warrant token.",
    tags: ['reputation', 'classic_heist', 'verse_variant'],
    rules: [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant.", source: 'story', sourceName: "Down and Out" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'A Checkered Past',
          content: ["All Players start with a Warrant token."]
        },
        source: 'story', 
        sourceName: "Down and Out"
      },
      { type: 'setJobMode', mode: 'shared_hand', source: 'story', sourceName: "Down and Out" },
      { type: 'addFlag', flag: 'showNoJobsMessage', source: 'story', sourceName: "Down and Out" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Employer's Scraps",
          content: ["No Starting Jobs are dealt. Instead, a shared pool of jobs is available to all players from the start of the game. One face-up Job Card is placed on top of each Contact's deck. These form the shared hand of Inactive Jobs. Players may take a face-up Job from this shared hand by using a Deal Action at the Contact's location. When a shared Job is taken, it is immediately replaced with the next card from that Contact's deck."]
        },
        source: 'story', 
        sourceName: "Down and Out"
      }
    ]
  },
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    requiredExpansion: "coachworks",
    sourceUrl: "https://boardgamegeek.com/image/2785042/gerryrailbaron",
    setupDescription: "Special 'winds of fate' rules for placing Goal tokens. No Starting Jobs are dealt.",
    tags: ['character', 'verse_variant'],
    rules: [
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "Where The Wind Takes Us" },
      { 
        type: 'setJobStepContent', 
        position: 'before',
        content: [
          { type: 'paragraph', content: ["Instead of a standard job draw, follow these steps to determine the game's objectives:"] },
          {
            type: 'numbered-list',
            items: [
              ['Each player chooses to draw from a single Contact Deck of their choice.'],
              [{ type: 'placeholder', id: 'wind-takes-us-draw-count' }],
              ['Place a Goal Token at each Job\'s Drop Off / Target / Destination Sector.'],
              ['After placing all tokens, return the drawn Job Cards to their respective Contact Decks and reshuffle the decks.'],
              [{ type: 'strong', content: 'Do not deal any other Starting Jobs.' }]
            ]
          }
        ],
        source: 'story', 
        sourceName: "Where The Wind Takes Us"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Employer's Scraps",
          content: [
            "Each player draws jobs from a single Contact Deck of their choice: Draw 4 Job Cards each (for 3 or fewer players). Draw 3 Job Cards each (for 4 or more players). Place a Goal Token at each Job's Drop Off / Target / Destination Sector. After placing tokens, return all drawn Job cards to their Contact Decks and reshuffle the decks. Do not deal any other Starting Jobs."
          ]
        },
        source: 'story', 
        sourceName: "Where The Wind Takes Us"
      }
    ]
  },
];