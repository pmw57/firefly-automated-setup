import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES, STEP_IDS } from '../../ids';
import { createStoryRules } from '../utils';

export const STORIES_R_S: StoryCardDef[] = [
  {
    title: "Rags To Riches",
    intro: " ",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/108288/rags-to-riches",
    rating: 0
  },
  {
    title: "Return to Sturges",
    intro: "The Barrle of Sturges was the shortest and bloodiest battle of the Unification War. Badger has broadcast news that there is a hoard of Alliance treasure left in the wreckage of this space battle to a few \"trusted friends\". The race is on to get the information, equipment and speed to get there first, find the goods and get clear before the Alliance shows up to claim its property!",
    setupDescription: "Follow the 'Leader Restriction' override.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/125866/return-to-sturges-a-firefly-mission",
    rules: createStoryRules("Return to Sturges", [
      { 
        type: 'addSpecialRule', 
        category: 'draft',
        rule: {
          title: 'Leader Restriction',
          content: ["Captains Nandi and Atherton may not be used by any player."]
        }
      }
    ])
  },
  {
    title: "River's Run 1v1",
    intro: "The Alliance had her in that institution for a purpose, whatever it was, and they will want her back.",
    isPvP: true,
    additionalRequirements: [
      "blue"
    ],
    setupDescription: "Follow the 'Asymmetric Setup' and 'Bounty Deck Setup' overrides.",
    sourceUrl: "https://boardgamegeek.com/thread/3454248/rivers-run-1v1",
    requiredExpansion: "community",
    rules: createStoryRules("River's Run 1v1", [
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Asymmetric Setup',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: 'Player 1 (Serenity):' }] },
            { type: 'list', items: [
              ['Leader: ', { type: 'strong', content: 'Malcolm' }, ', Ship: ', { type: 'strong', content: 'Serenity' }, '.'],
              ['Crew: Zoë, Wash, Kaylee, Jayne, Inara, Book, Simon, and River.'],
              ['Upgrades: Xùnsù Whisper X1 (Meridian), Expanded Crew Quarters (Osiris), EVA Suit (Space Bazaar for River).']
            ]},
            { type: 'paragraph', content: [{ type: 'strong', content: 'Player 2 (Bounty Hunter):' }] },
            { type: 'list', items: [
                ["Choose any Setup Card to determine starting conditions."]
            ]}
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Bounty Deck Setup',
          content: [
            { type: 'list', items: [
              ["Remove all of Serenity's crew from the Bounty deck, ", { type: 'strong', content: 'excluding River Tam' }, "."],
              ["The Bounty deck is placed face up and all bounties are active."]
            ]}
          ]
        }
      }
    ])
  },
  {
    title: "Round the 'Verse in \"80 Days\"",
    intro: "Mr. Big Bucks, who lives next to the Tams in Sihnon, has two 19-year-old kids. They are finishing a semester of school at Osiris. Mr. Big Bucks wants the kids to experience the universe. He's looking for someone to show them around the universe and return them healthily. You can put the kids to work to some extent, but must return them healthy. He'll pay $20,000 when done.",
    requiredExpansion: "community",
    sourceUrl: "https://web.archive.org/web/20151227202622/http://notionnexus.com/index.php/ponderings-and-thoughts/247-playing-firefly"
  },
  {
    title: "Ruining It For Everyone",
    maxPlayerCount: 2,
    isPvP: true,
    intro: "During the war you watched your twin get cut down in a hail of shrapnel. You've lived an empty existence since that day making ends meet and trying to keep flying as best you can. Then you get a message from your Ma out on the Rim. \"Come home right away.\"\n\nSo you fly to St. Albans, Red Sun to see your Mother.\n\nOnce there, your twin (Who wasn't dead!) steals your ship and sets about ruining your life. Your twin has the exact same abilities as you do. Your twin may not discard any of your inactive jobs.",
    sourceUrl: "https://boardgamegeek.com/thread/1082965/story-card-ruining-it-for-everyone",
    setupDescription: "Start with only $2000 and 2 crew valuing no more than $500. You cannot take any crew with a $0 cost. If you have no wanted crew, take a Warrant instead. This becomes your Twin's ship. Draw a \"backup\" ship with 0 crew, no money, no jobs. This is your new ship. Both ships starts on St. Albans, Red Sun. Set 20 counters on this card as timing counters.",
    rules: createStoryRules("Ruining It For Everyone", [
      { type: 'setComponent', stepId: STEP_IDS.C3, component: 'RuiningItDraftStep' },
      { type: 'setComponent', stepId: STEP_IDS.C5, component: 'RuiningItResourcesStep' },
      { type: 'setComponent', stepId: STEP_IDS.C6, component: 'RuiningItJobsStep' },
      { type: 'setShipPlacement', location: { custom: 'St. Albans, Red Sun' } },
      { type: 'modifyResource', resource: 'credits', method: 'add', value: -1000, description: "Base funds adjusted for story." },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "Your twin stole your starting fuel." },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "Your twin stole your starting parts." },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Setup: A Tale of Two Twins',
          content: [
            "Start with only $2000 and 2 crew valuing no more than $500. You cannot take any crew with a $0 cost. If you have no wanted crew, take a Warrant instead. This becomes your Twin's ship. Draw a \"backup\" ship with 0 crew, no money, no jobs. This is your new ship. Both ships starts on St. Albans, Red Sun."
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'A Raw Deal',
          content: ["Draw a \"backup\" ship with 0 crew, no money, no jobs. This is your new ship."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "The Twin's Head Start",
          content: ["Set 20 counters on this card as timing counters."]
        }
      }
    ])
  },
  {
    title: "Save River Tam",
    intro: "River Tam is being held in secure, secret government facility. Beloved sister, daughter of the ridiculously wealthy, and super useful government secret weapon. Whatever your reasons, you are on a mission to break River out.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1066622/story-card-save-river-tam",
    setupDescription: "Remove River Tam from play.",
    rules: createStoryRules("Save River Tam", [
      { type: 'addFlag', flag: 'removeRiver' },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Missing Person",
          content: ["Remove ", { type: 'strong', content: "River Tam" }, " from play."]
        }
      }
    ]),
    rating: 1
  },
  {
    title: "Saving Pirate Ryan",
    intro: "You know, there's a certain motto. A creed among folks like us. You may have heard it: \"Leave no man behind.\" Wash - Firefy Episide 10 - War Stories",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1536695/article/22110859#22110859",
    rating: 1
  },
  {
    title: "Scavengers",
    intro: "This game only uses dice, cash, Leader cards, Supply decks, cargo, and contraband. Everything else stays in the box. A scavengers goal is simple, Find a Crew, Attack Another Crew, Keep Trying.",
    isPvP: true,
    setupDescription: "Radical setup change: Follow the 'Scavenger Draft Rules' and other overrides.",
    sourceUrl: "https://boardgamegeek.com/thread/3114859/scavenger-card-game-story-card",
    requiredExpansion: "community",
    rating: 1,
    rules: createStoryRules("Scavengers", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 10000, description: "Scavenger's Hoard" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No fuel used." },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No parts used." },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Starting Cargo',
          content: ['Each player begins with ', { type: 'strong', content: '10 Cargo' }, '.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Scavenger Draft Rules',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: 'No ships are used in this scenario.' }] },
            { type: 'list', items: [
              ["Roll for first player."],
              ["First player chooses a Leader card, then passes the Leader deck to the next player until each player has chosen one."]
            ]}
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'nav',
        rule: {
          title: 'Component Not Used',
          content: ['Nav Decks are not used in this scenario.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Component Not Used',
          content: ['Alliance Cruiser and Reaver ships are not used in this scenario.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Goal Override',
          content: ['The standard goal step is not used. The goal is described on the main Story Card intro.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Component Not Used',
          content: ['Job cards are not used in this scenario.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Setup Step Skipped',
          content: ['Do not "Prime the Pump". Shuffle all Supply Decks and place them face down near the bank.']
        }
      },
    ])
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/100497/shadows-over-duul-new-goal-reupload",
    setupDescription: "Remove jobs from Amnon Duul during Set Up. Start in the border of Murphy.",
    rules: createStoryRules("Shadows Over Duul", [
      { type: 'forbidContact', contact: CONTACT_NAMES.AMNON_DUUL },
      { type: 'setShipPlacement', location: { custom: 'border of Murphy' } },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'A Tense Start',
          content: ["Start in the border of Murphy."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Unsavory Business',
          content: ["Remove jobs from Amnon Duul during Set Up."]
        }
      }
    ]),
    rating: 2,
  },
  {
    title: "Shiny New Year 25 - Protect Or Plunder",
    intro: "An affluent governor from Osiris is hosting a grand New Year's celebration--a wedding for his daughter aboard the luxury linder, Shiny New Year. The event has drawn attention from both well-meaning guardians and those with darker intentions. Which one are you? Protector or plunderer?",
    additionalRequirements: [
      "pirates"
    ],
    setupDescription: "Follow the 'Deck Modification' override.",
    sourceUrl: "https://boardgamegeek.com/thread/3405568/article/45332549#45332549",
    requiredExpansion: "community",
    rules: createStoryRules("Shiny New Year 25 - Protect Or Plunder", [
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Deck Modification',
          content: ["After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks."]
        }
      }
    ])
  },
  {
    title: "Slaying The Dragon",
    playerCount: 2,
    isCoOp: true,
    intro: "Adelai Niska has been lord of the underworld for as long as anyone can remember. Shu-ki, the tong boss of Gonghe, has long suffered under Niska's yoke. After being publicly shamed by Niska at a meeting of crime-bosses, an enraged Shu-ki has decided to bring Niska down. He has a plan - Operation Dragon - but the job is so daunting that it requires two crews to have any hope of success. Can two Firefly captains bring down the most feared criminal boss in the 'Verse?",
    requiredExpansion: "community",
    setupDescription: "Niska is unavailable. 'Prime the Pump' discards 2 additional cards.",
    rules: createStoryRules("Slaying The Dragon", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      { type: 'modifyPrime', modifier: { add: 2 } },
      { 
        type: 'addSpecialRule', 
        category: 'prime',
        rule: {
          title: 'Priming Bonus',
          content: [{ type: 'strong', content: 'Shu-ki is greasing the rails:' }, ' Turn up ', { type: 'strong', content: '2 additional cards' }, ' from each deck when Priming the Pump.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Co-Op & Countdown',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: '2-Player Co-Op:' }, " Both players win or lose together."] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Countdown:' }, " Stack ", { type: 'strong', content: '16 Disgruntled Tokens' }, ". At the start of each player's turn, discard one token. The game ends when the last token is discarded."] },
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/1049020/article/13686225#13686225"
  },
];