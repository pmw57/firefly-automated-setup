import { StoryCardDef } from '../../../types';
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
    setupDescription: "Each player chooses a Moral Leader. After all players collect their Starting Supplies, each player pays for an Expanded Crew Quarters ($600) and can now hold 3 more crew. Hiring Crew: Starting with 1st player, each player searches for and hires a crew card from any supply deck of their choice. Continue rounds of hiring crew until all player ships have a full set of crew on their ship. Remove all other crew cards from play. You may only use the crew you start with. 7 Disgruntled tokens will be used as a timer that triggers the arrest of 4 crew members from each ship. First player will discard 1 token at the start of each round of play.",
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
    setupDescription: "In turn order, choose an empty planet with a Contact as a starting point. Draw only 3 of that contact's jobs for your Starting Jobs. Start with an Alliance Alert in play and replace it whenever a Goal Token is won or when any RESHUFFLE card is drawn.",
    sourceUrl: "https://boardgamegeek.com/thread/2941994/master-of-all-story-card",
    requiredExpansion: "community",
    rules: createStoryRules("Master Of All", [
      { type: 'addFlag', flag: 'startWithAlertCard' }
    ])
  },
  {
    title: "Miranda",
    intro: "You suspect that there is a hidden message in the Fruity Oaty Bars advertisement recently broadcast by the Alliance network. Decoding it may reveal something of value or maybe it's just a new form of subliminal advertising.",
    setupDescription: "Place your Firefly on a supply world to begin the game. Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed.",
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
    setupDescription: "Draw three starting jobs from a single contact, and two other jobs from any other contacts. You may only keep 3 jobs.",
    rating: 0,
    requiredExpansion: "community",
    rules: createStoryRules("My Number One Guy", [
      { type: 'addFlag', flag: 'customJobDraw' }
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
    setupDescription: "Pull all Mudders from Supply decks. Shuffle together the Foreman plus 3 Mudders per player. Place them face up. If the Foreman is on top after a shuffle, reshuffle. ",
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
    title: "Old Friends And New",
    intro: "You thought he was dead, but now you know your old War buddy is being held in a max-security prison on Valentine. You'll need the help of some new friends to unlock the Cortex master identity files, then mingle with the high and mighty to get the prison plans, and finally it's off to the rescue!",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1119976/story-card-old-friends-and-new",
    rating: 2
  },
];