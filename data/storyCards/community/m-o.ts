import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES } from '../../ids';

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
          title: 'Special Placement & Crew Draw',
          content: ["Place your Firefly on a supply world to begin the game. Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed."]
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
        category: 'draft_panel',
        rule: {
          title: 'Rescue Mission Setup',
          badge: 'Story Setup',
          content: [
            {
              type: 'list',
              items: [
                ["Place the Serenity ship token on the 'Shadow, Murphy' sector."],
                ["This will be the drop-off point for any rescued crew during the game."],
              ]
            }
          ]
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
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community"
  },
  {
    title: "My Number One Guy",
    intro: " ",
    isPvP: true,
    sourceUrl: "https://boardgamegeek.com/thread/1076645/story-card-my-number-one-guy-player-vs-player",
    setupDescription: "Follow the 'Special Job Draw' override.",
    rating: 0,
    tags: ['community', 'pvp'],
    requiredExpansion: "community",
    rules: [
      { 
        type: 'addSpecialRule', 
        category: 'jobs',
        rule: {
          title: 'Special Job Draw',
          content: ["Draw three starting jobs from a single contact, and two other jobs from any other contacts. You may only keep 3 jobs."]
        },
        source: 'story', 
        sourceName: "My Number One Guy"
      }
    ]
  },
  {
    title: "New Heroes of Canton",
    intro: "Them Mudders got the shortest end of a stick ever been offered. How's about we offer 'em a better stick.",
    additionalRequirements: [
      "kalidasa"
    ],    isCoOp: true,
    goals: [
      {
        title: "Easy",
        description: "Use 25 Disgruntled tokens as the game timer."
      },
      {
        title: "Medium",
        description: "Use 21 Disgruntled tokens as the game timer."
      },
      {
        title: "Pro",
        description: "Use 17 Disgruntled tokens as the game timer."
      }
    ],
    setupDescription: "Pull all Mudders from Supply decks. Shuffle a set # of Mudders and Foremen together. Place them face up. if the Foreman is on top after a Shuffle, reshuffle. 2/3/4 Players = 7/10/13 Goal Mudders and the Foreman. Easy/Medium/Pro: Use 25/21/17 Disgruntled tokens as a game timer.",
    sourceUrl: "https://boardgamegeek.com/filepage/294565/new-heroes-of-canton-co-op-story-card",
    requiredExpansion: "community",
    tags: ['community', 'against_the_black', 'coop'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Custom Mudder Deck',
          content: ["Pull all Mudders from Supply decks. Shuffle a set # of Mudders and Foremen together. Place them face up. if the Foreman is on top after a Shuffle, reshuffle. 2/3/4 Players = 7/10/13 Goal Mudders and the Foreman."]
        },
        source: 'story', 
        sourceName: "New Heroes of Canton"
      },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Custom Mudder Deck',
          badge: 'Story Setup',
          content: [
            {
              type: 'list',
              items: [
                ["Pull all Mudder cards from the Supply decks."],
                [
                  "Create a new deck with ",
                  {type: 'strong', content: 'The Foreman'},
                  " and a number of Mudders based on player count:",
                  {
                    type: 'list',
                    items: [
                      ['2 Players: 7 Mudders'],
                      ['3 Players: 10 Mudders'],
                      ['4 Players: 13 Mudders']
                    ]
                  }
                ],
                ["Shuffle this new deck and place it face up."],
                [{type: 'warning-box', content: ["If The Foreman is on top after shuffling, reshuffle the deck."]}]
              ]
            }
          ]
        },
        source: 'story', 
        sourceName: "New Heroes of Canton"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "A Hero's Gamble",
          content: ["Easy/Medium/Pro: Use 25/21/17 Disgruntled tokens as a game timer."]
        },
        source: 'story', 
        sourceName: "New Heroes of Canton"
      },
      {
        type: 'createAlertTokenStack',
        valuesByGoal: {
            "Easy": 25,
            "Medium": 21,
            "Pro": 17,
        },
        tokenName: 'Disgruntled Tokens',
        title: "A Hero's Gamble",
        description: "The first player takes the tokens.",
        source: 'story', 
        sourceName: "New Heroes of Canton"
      }
    ]
  },
  {
    title: "Oh Captain My Captain",
    intro: "Remember that one time your Leader failed a Niska Job? Well, Niska remembers and now he's lookin' to kill some folk.",
    setupDescription: "Don't draw Starting Jobs from Niska. 1st player is given 20 Disgruntle tokens as a game timer.",
    sourceUrl: "https://boardgamegeek.com/thread/3019475/war-stories-and-oh-captain-my-captain-story-cards",
    requiredExpansion: "community",
    tags: ['community', 'survival'],
    rules: [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA, source: 'story', sourceName: "Oh Captain My Captain" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Niska's Grudge",
          content: ["Don't draw Starting Jobs from Niska."]
        },
        source: 'story', 
        sourceName: "Oh Captain My Captain"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Niska Remembers",
          content: ["1st player is given 20 Disgruntle tokens as a game timer."]
        },
        source: 'story', 
        sourceName: "Oh Captain My Captain"
      },
      {
        type: 'createAlertTokenStack',
        fixedValue: 20,
        tokenName: 'Disgruntled Tokens',
        title: 'Game Timer',
        description: "Give the pile to the first player.",
        source: 'story', 
        sourceName: "Oh Captain My Captain"
      }
    ]
  },
  {
    title: "Old Friends And New",
    intro: "You thought he was dead, but now you know your old War buddy is being held in a max-security prison on Valentine. You'll need the help of some new friends to unlock the Cortex master identity files, then mingle with the high and mighty to get the prison plans, and finally it's off to the rescue!",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1119976/story-card-old-friends-and-new",
    rating: 2,
    tags: ['community', 'jailbreak'],
  },
];