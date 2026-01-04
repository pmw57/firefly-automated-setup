
import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES } from '../../ids';
import { createStoryRules } from '../utils';

export const STORIES_M_O: StoryCardDef[] = [
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/2277037/upstarter",
    rules: createStoryRules("The Magnificent Crew", [
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Gameplay Note',
          content: ['This story features special high-value cargo sales rules that apply during gameplay.']
        }
      }
    ]),
    rating: 2
  },
  {
    title: "Mark Of A Great Captain",
    intro: "If you don't much care for the wellbeing of your crew, your crew won't care much for you. Do what you can to keep your chosen family together. Without them, who's gonna keep you company when you're floating in the black?",
    setupDescription: "Follow the 'Special Draft & Hiring Rules', 'Mandatory Ship Upgrade', and 'Game Timer' overrides.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/286230/mark-of-a-great-captain-story-card",
    rating: 2,
    rules: createStoryRules("Mark Of A Great Captain", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Draft & Hiring Rules',
          content: [
            { type: 'list', items: [
              ['Each player must choose a ', { type: 'strong', content: 'Moral Leader' }, '.'],
              [{ type: 'strong', content: 'Special Hiring Round:' }, ' Starting with the 1st player, each player searches for and hires one crew card from any supply deck. Continue hiring rounds until all ships are full.'],
              [{ type: 'strong', content: 'Fixed Crew:' }, ' Remove all other crew cards from play. You may only use the crew you start with.'],
            ]}
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Mandatory Ship Upgrade',
          content: ["After collecting Starting Supplies, each player must pay ", { type: 'strong', content: '$600' }, " for an ", { type: 'strong', content: 'Expanded Crew Quarters' }, ", increasing crew capacity by 3."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Use ", { type: 'strong', content: '7 Disgruntled tokens' }, " as a timer. The first player discards 1 token at the start of each round. When the timer runs out, a special game event occurs (arrest of 4 crew members from each ship)."]
        }
      }
    ])
  },
  {
    title: "Master Of All",
    intro: "The 'Verse is a profitable place for a crew that can rise to any occasion. Be the first to prove their crew is ready for anything... without attracting the law.",
    setupDescription: "Follow the 'Special Placement' and 'Special Job Draw' overrides. Start with an Alliance Alert card.",
    sourceUrl: "https://boardgamegeek.com/thread/2941994/master-of-all-story-card",
    requiredExpansion: "community",
    rules: createStoryRules("Master Of All", [
      { type: 'addFlag', flag: 'startWithAlertCard' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Placement',
          content: ["In turn order, choose an empty planet with a Contact as a starting point."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Special Job Draw',
          content: ["Draw only 3 of that contact's jobs for your Starting Jobs."]
        }
      }
    ])
  },
  {
    title: "Miranda",
    intro: "You suspect that there is a hidden message in the Fruity Oaty Bars advertisement recently broadcast by the Alliance network. Decoding it may reveal something of value or maybe it's just a new form of subliminal advertising.",
    setupDescription: "Follow the 'Special Placement & Crew Draw' override.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1135128/article/1512332#1512332",
    rating: 2,
    rules: createStoryRules("Miranda", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Placement & Crew Draw',
          content: [
            { type: 'list', items: [
              ["Place your Firefly on a supply world to begin the game."],
              ["Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed."]
            ]}
          ]
        }
      }
    ])
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
    rating: 2
  },
  {
    title: "My Fellow Browncoats",
    isCoOp: true,
    intro: "The crew of Serenity needs your help. They've been captured by the Alliance and sent to unknown prison camps all over the 'Verse. For a price, Badger might let you in on a little secret.",
    setupDescription: "Follow the 'Rescue Mission Setup' override.",
    rules: createStoryRules("My Fellow Browncoats", [
      { 
        type: 'addSpecialRule', 
        category: 'goal',
        rule: {
          title: 'Rescue Mission Setup',
          content: [
            { type: 'list', items: [
              ['Place ', { type: 'strong', content: 'Serenity' }, ' on Shadow, Murphy as the drop-off point for rescued crew.'],
              ['Shuffle Malcolm, Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River together.'],
              ['Place them face down as the ', { type: 'strong', content: '"Prisoner Deck"' }, '. They are your goals for this game.']
            ]}
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/3282832/my-fellow-browncoats-remastered-into-a-solo-and-co",
    requiredExpansion: "community"
  },
  {
    title: "My Number One Guy",
    intro: " ",
    isPvP: true,
    sourceUrl: "https://boardgamegeek.com/thread/1076645/story-card-my-number-one-guy-player-vs-player",
    setupDescription: "Follow the 'Special Job Draw' override.",
    rating: 0,
    requiredExpansion: "community",
    rules: createStoryRules("My Number One Guy", [
      { 
        type: 'addSpecialRule', 
        category: 'jobs',
        rule: {
          title: 'Special Job Draw',
          content: ["Draw three starting jobs from a single contact, and two other jobs from any other contacts. You may only keep 3 jobs."]
        }
      }
    ])
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
        description: "Use 26 Disgruntled tokens as the game timer."
      },
      {
        title: "Medium",
        description: "Use 21 Disgruntled tokens as the game timer."
      },
      {
        title: "Hard",
        description: "Use 17 Disgruntled tokens as the game timer."
      }
    ],
    setupDescription: "Follow the 'Custom Mudder Deck' override.",
    sourceUrl: "https://boardgamegeek.com/filepage/294565/new-heroes-of-canton-co-op-story-card",
    requiredExpansion: "community",
    rules: createStoryRules("New Heroes of Canton", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Custom Mudder Deck',
          content: [
            { type: 'list', items: [
              ['Pull all ', { type: 'strong', content: 'Mudders' }, ' from Supply decks.'],
              ['Shuffle together the ', { type: 'strong', content: 'Foreman' }, ' plus ', { type: 'strong', content: '3 Mudders per player' }, '.'],
              ['Place this new deck face up.'],
              ['If the Foreman is on top after a shuffle, reshuffle.']
            ]}
          ]
        }
      }
    ])
  },
  {
    title: "Oh Captain My Captain",
    intro: "Remember that one time your Leader failed a Niska Job? Well, Niska remembers and now he's lookin' to kill some folk.",
    setupDescription: "Follow the 'Game Timer' override. Niska is unavailable for jobs.",
    sourceUrl: "https://boardgamegeek.com/thread/3019475/war-stories-and-oh-captain-my-captain-story-cards",
    requiredExpansion: "community",
    rules: createStoryRules("Oh Captain My Captain", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Niska's Grudge",
          content: ["Do not prime Niska's deck. No starting jobs are drawn from Niska."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Give the first player a pile of 20 Disgruntled tokens. At the start of each of that player's turns, discard one token. After the last token is discarded, all players get one last turn, then the game is over."]
        }
      }
    ])
  },
  {
    title: "Old Friends And New",
    intro: "You thought he was dead, but now you know your old War buddy is being held in a max-security prison on Valentine. You'll need the help of some new friends to unlock the Cortex master identity files, then mingle with the high and mighty to get the prison plans, and finally it's off to the rescue!",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1119976/story-card-old-friends-and-new",
    rating: 2
  },
];
