import { StoryCardDef } from '../../../types';

export const STORIES_M_O: StoryCardDef[] = [
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/2277037/upstarter",
    setupDescription: "No starting jobs are dealt.",
    tags: ['community', 'survival'],
    rules: [
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "The Magnificent Crew" },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Gameplay Note',
          content: ["This story features special high-value cargo sales rules that apply during gameplay."]
        },
        source: 'story', 
        sourceName: "The Magnificent Crew"
      }
    ],
    rating: 2
  },
  {
    title: "Mark Of A Great Captain",
    intro: "If you don't much care for the wellbeing of your crew, your crew won't care much for you. Do what you can to keep your chosen family together. Without them, who's gonna keep you company when you're floating in the black?",
    setupDescription: "Follow the 'Special Draft & Hiring Rules', 'Mandatory Ship Upgrade', and 'Game Timer' overrides.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/286230/mark-of-a-great-captain-story-card",
    rating: 2,
    tags: ['community', 'character'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Draft & Hiring Rules',
          content: ["Each player must choose a Moral Leader. Special Hiring Round: Starting with the 1st player, each player searches for and hires one crew card from any supply deck. Continue hiring rounds until all ships are full. Fixed Crew: Remove all other crew cards from play. You may only use the crew you start with."]
        },
        source: 'story', 
        sourceName: "Mark Of A Great Captain"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Mandatory Ship Upgrade',
          content: ["After collecting Starting Supplies, each player must pay $600 for an Expanded Crew Quarters, increasing crew capacity by 3."]
        },
        source: 'story', 
        sourceName: "Mark Of A Great Captain"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Game Timer',
          content: ["Use 7 Disgruntled tokens as the timer. The first player discards 1 token at the start of each round. When the timer runs out, a special game event occurs (arrest of 4 crew members from each ship)."]
        },
        source: 'story', 
        sourceName: "Mark Of A Great Captain"
      }
    ]
  },
  {
    title: "Master Of All",
    intro: "The 'Verse is a profitable place for a crew that can rise to any occasion. Be the first to prove their crew is ready for anything... without attracting the law.",
    setupDescription: "In turn order, choose an unoccupied planet with a Contact as a starting point. Then draw only 3 of that contact's jobs as starting hand. Start with an Alliance Alert in play and replace it whenever a Goal Token is won or when any RESHUFFLE card is drawn.",
    sourceUrl: "https://boardgamegeek.com/thread/2941994/master-of-all-story-card",
    requiredExpansion: "community",
    tags: ['community', 'reputation'],
    rules: [
      { type: 'addFlag', flag: 'startWithAlertCard', source: 'story', sourceName: "Master Of All" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'First Contact',
          content: ["In turn order, choose an unoccupied planet with a Contact as a starting point."]
        },
        source: 'story', 
        sourceName: "Master Of All"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          content: ["⚠️ Restriction: Starting location must be an unoccupied planet with a Contact."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Master Of All"
      },
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "Master Of All" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Proving Your Worth',
          content: ["Draw only 3 of that contact's jobs as starting hand."]
        },
        source: 'story', 
        sourceName: "Master Of All"
      },
      {
        type: 'setJobStepContent',
        position: 'before',
        content: [
          {
            type: 'paragraph',
            content: [
              'Draw ',
              { type: 'strong', content: '3 Jobs' },
              ' from your starting planet Contact.'
            ]
          },
          {
            type: 'paragraph-small-italic',
            content: ['You may keep any of the jobs drawn.']
          }
        ],
        source: 'story', 
        sourceName: "Master Of All"
      }
    ]
  },
  {
    title: "Miranda",
    intro: "You suspect that there is a hidden message in the Fruity Oaty Bars advertisement recently broadcast by the Alliance network. Decoding it may reveal something of value or maybe it's just a new form of subliminal advertising.",
    setupDescription: "Follow the 'Special Placement & Crew Draw' override.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1135128/article/1512332#1512332",
    rating: 2,
    tags: ['community', 'mystery'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Crew Draw',
          content: ["Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed."]
        },
        source: 'story', 
        sourceName: "Miranda"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'Supply World Start',
          content: ["Place your Firefly on a supply world to begin the game."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Miranda"
      }
    ]
  },
  {
    title: "Miranda's Secret",
    intro: "So you have heard of Miranda. The forgotton planet deep inside the Reaver space. There is some secret it holds that can change the Alliance position in the Verse. Are you bold enough to ventur there and try to find it?",
    additionalRequirements: [
      "blue",
      "pirates"
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/110153/story-card-mirandas-secret",
    requiredExpansion: "community",
    rating: 2,
    tags: ['community', 'mystery'],
  },
  {
    title: "My Fellow Browncoats",
    isCoOp: true,
    intro: "The crew of Serenity needs your help. They've been captured by the Alliance and sent to unknown prison camps all over the 'Verse. For a price, Badger might let you in on a little secret.",
    setupDescription: "Place Serenity on Shadow, Murphy as the drop-off point for Serenity's rescued crew. Shuffle Malcolm, Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River together. Place them face down as the \"Prisoner Deck\".",
    tags: ['community', 'jailbreak', 'against_the_black', 'coop'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Story Override',
          content: [
            "Place Serenity on Shadow, Murphy as the drop-off point for Serenity's rescued crew."
          ]
        },
        source: 'story', 
        sourceName: "My Fellow Browncoats"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'Rescue Mission Setup',
          content: [
            "Place the Serenity ship token on the 'Shadow, Murphy' sector. This will be the drop-off point for any rescued crew."
          ],
          position: 'before'
        },
        source: 'story', 
        sourceName: "My Fellow Browncoats"
      },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Prepare Prisoner Deck',
          badge: 'Story Setup',
          content: [
            {
              type: 'list',
              items: [
                ["Shuffle the 9 original Serenity crew cards (Malcolm, Zoë, Wash, Jayne, Kaylee, Simon Tam, River Tam, Inara, and Shepherd Book) together."],
                ["Place this shuffled deck face down. This is the 'Prisoner Deck' and represents your game goals."],
              ]
            }
          ]
        },
        source: 'story', 
        sourceName: "My Fellow Browncoats"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Story Override',
          content: [
            "Shuffle Malcolm, Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River together. Place them face down as the \"Prisoner Deck\"."
          ]
        },
        source: 'story',
        sourceName: "My Fellow Browncoats"
      }
    ]
  }
];