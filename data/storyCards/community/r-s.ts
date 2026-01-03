
import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES } from '../../ids';
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
    setupDescription: "Captains Nandi and Atherton may not be used by any player.",
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
    setupDescription: "Player 1 will be the Captain of Serenity with Malcolm, Zoë, Wash, Kaylee, Jayne, Inara, Book, Simon, and River. Serenity starts with the Xùnsù Whisper X1 from Meridian, an Expanded Crew Quarters from Osiris, and an EVA Suit from Space Bazaar for River. No Starting Jobs. Player 2 is a Bounty Hunter and chooses the Setup card. No Starting Jobs. Remove all Serenity's crew from the Bounty deck, excluding River Tam. The Bounty deck is placed face up and all bounties are active.",
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
    sourceUrl: "https://boardgamegeek.com/image/9306408/pmw57"
  },
  {
    title: "Ruining It For Everyone",
    maxPlayerCount: 2,
    isPvP: true,
    intro: "During the war you watched your twin get cut down in a hail of shrapnel. You've lived an empty existence since that day making ends meet and trying to keep flying as best you can. Then you get a message from your Ma out on the Rim. \"Come home right away.\"\n\nSo you fly to St. Albans, Red Sun to see your Mother.\n\nOnce there, your twin (Who wasn't dead!) steals your ship and sets about ruining your life. Your twin has the exact same abilities as you do. Your twin may not discard any of your inactive jobs.",
    sourceUrl: "https://boardgamegeek.com/thread/1082965/story-card-ruining-it-for-everyone",
    setupDescription: "Start with only $2000 and 2 crew valuing no more than $500. You cannot take any crew with a $0 cost. If you have no wanted crew, take a Warrant instead. This becomes your Twin's ship.",
    rules: createStoryRules("Ruining It For Everyone", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 2000, description: "Story Funds" }
    ])
  },
  {
    title: "Save River Tam",
    intro: "River Tam is being held in secure, secret government facility. Beloved sister, daughter of the ridiculously wealthy, and super useful government secret weapon. Whatever your reasons, you are on a mission to break River out.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1066622/story-card-save-river-tam",
    rules: createStoryRules("Save River Tam", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Missing Person',
          content: ['Remove ', { type: 'strong', content: 'River Tam' }, ' from play before shuffling the Supply Decks.']
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
    setupDescription: "Shuffle all Supply decks and lay them face down in the middle of thet able with the banks cash. All players start with $10,000 and 10 cargo. Roll for first player. First player chooses a Leader card then passes the Leader deck to the next player until each player has a Leader card.",
    sourceUrl: "https://boardgamegeek.com/thread/3114859/scavenger-card-game-story-card",
    requiredExpansion: "community",
    rating: 1
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/100497/shadows-over-duul-new-goal-reupload",
    rules: createStoryRules("Shadows Over Duul", [
      { type: 'forbidContact', contact: CONTACT_NAMES.AMNON_DUUL },
      { type: 'setShipPlacement', location: 'border_of_murphy' }
    ]),
    rating: 2,
  },
  {
    title: "Shiny New Year 25 - Protect Or Plunder",
    intro: "An affluent governor from Osiris is hosting a grand New Year's celebration--a wedding for his daughter aboard the luxury linder, Shiny New Year. The event has drawn attention from both well-meaning guardians and those with darker intentions. Which one are you? Protector or plunderer?",
    additionalRequirements: [
      "pirates"
    ],
    setupDescription: "After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks.",
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
