
import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES, STEP_IDS } from '../../ids';

export const STORIES_R_S: StoryCardDef[] = [
  {
    title: "Rags To Riches",
    intro: " ",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/108288/rags-to-riches",
    rating: 0,
    tags: ['community', 'reputation'],
  },
  {
    title: "Return to Sturges",
    intro: "The Barrle of Sturges was the shortest and bloodiest battle of the Unification War. Badger has broadcast news that there is a hoard of Alliance treasure left in the wreckage of this space battle to a few \"trusted friends\". The race is on to get the information, equipment and speed to get there first, find the goods and get clear before the Alliance shows up to claim its property!",
    setupDescription: "Captain Nandi and Atherton may not be used by any player.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/125866/return-to-sturges-a-firefly-mission",
    tags: ['community', 'classic_heist'],
    rules: [
      { 
        type: 'addSpecialRule', 
        category: 'draft',
        rule: {
          title: 'Leader Restriction',
          content: ["Captains Nandi and Atherton may not be used by any player."]
        },
        source: 'story', 
        sourceName: "Return to Sturges"
      }
    ]
  },
  {
    title: "River's Run 1v1",
    intro: "The Alliance had her in that institution for a purpose, whatever it was, and they will want her back.",
    isPvP: true,
    playerCount: 2,
    additionalRequirements: [
      "blue"
    ],
    setupDescription: "Roll for player position. Player 1 will be the Captain of Serenity with Malcolm, Zoë, Wash, Kaylee, Jayne, Inara, Book, Simon, and River. Serenity starts with the Xùnsù Whisper X1 from Meridian, Expanded Crew Quarters from Osiris, and an EVA Suit from Space Bazaar for River. Player 2 is a Bounty Hunter and chooses the Setup card. No Starting Jobs. Remove all Serenity's crew from the Bounty deck, excluding River Tam. The Bounty deck is placed face up and all bounties are active.",
    sourceUrl: "https://boardgamegeek.com/thread/3454248/rivers-run-1v1",
    requiredExpansion: "community",
    tags: ['community', 'pvp'],
    rules: [
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "River's Run 1v1" },
      { type: 'setPlayerBadges', badges: { 0: 'Assigned Serenity', 1: 'Assigned Bounty Hunter' }, source: 'story', sourceName: "River's Run 1v1" },
      { type: 'addFlag', flag: 'requiresSetupConfirmation', source: 'story', sourceName: "River's Run 1v1" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "A Different Kind of Work",
          content: [{ type: 'paragraph', content: ["No Starting Jobs."] }]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Asymmetric Setup',
          content: ["Player 1 (Serenity): Leader: Malcolm, Ship: Serenity. Crew: Zoë, Wash, Kaylee, Jayne, Inara, Book, Simon, and River. Upgrades: Xùnsù Whisper X1 (Meridian), Expanded Crew Quarters (Osiris), EVA Suit (Space Bazaar for River). Player 2 is a Bounty Hunter and chooses the Setup card."]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
            title: 'River\'s Run: Asymmetric Draft',
            badge: 'Story Setup',
            content: [
                { type: 'paragraph', content: ["This scenario has unique setup roles:"] },
                { 
                    type: 'list', 
                    items: [
                        [{ type: 'strong', content: 'Player 1 (Serenity):' }, " Is assigned Malcolm Reynolds, the Serenity ship (with Expanded Crew Quarters), the full original crew, and several upgrades."],
                        [{ type: 'strong', content: 'Player 2 (Bounty Hunter):' }, " Chooses their own Ship & Leader."]
                    ] 
                }
            ]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
            title: 'River\'s Run: Action Required',
            badge: 'Important',
            content: [
                { type: 'paragraph', content: ["Player 2 (the Bounty Hunter) must ", { type: 'strong', content: "choose the Setup Card for this game" }, "."] },
                { type: 'paragraph', content: ["If the 'Next' button is disabled, verify that you have selected a Setup Card in the previous step."] }
            ]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Bounty Deck Setup',
          badge: 'Story Setup',
          content: [
            { type: 'list', items: [
              ['Remove all Serenity\'s crew from the Bounty deck, ', { type: 'strong', content: 'excluding River Tam' }, '.'],
              ['Place the Bounty deck ', { type: 'strong', content: 'face up' }, '.'],
              ['All bounties are ', { type: 'strong', content: 'active' }, '.']
            ]}
          ]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Bounty Deck Setup',
          content: [
            {
              type: 'paragraph',
              content: [
                  "Remove all Serenity's crew from the Bounty deck, excluding River Tam. The Bounty deck is placed face up and all bounties are active."
              ]
            }
          ]
        },
        source: 'story', 
        sourceName: "River's Run 1v1"
      },
      {
        type: 'addSpecialRule',
        category: 'setup_selection',
        rule: {
          title: "River's Run 1v1: Player 2 Action",
          content: [{ type: 'paragraph', content: ["Player 2 (the Bounty Hunter) must now choose the Setup Card for this game."] }]
        },
        source: 'warning', 
        sourceName: "River's Run 1v1"
      }
    ]
  },
  {
    title: "Round the 'Verse in \"80 Days\"",
    intro: "Mr. Big Bucks, who lives next to the Tams in Sihnon, has two 19-year-old kids. They are finishing a semester of school at Osiris. Mr. Big Bucks wants the kids to experience the universe. He's looking for someone to show them around the universe and return them healthily. You can put the kids to work to some extent, but must return them healthy. He'll pay $20,000 when done.",
    requiredExpansion: "community",
    sourceUrl: "https://web.archive.org/web/20151227202622/http://notionnexus.com/index.php/ponderings-and-thoughts/247-playing-firefly",
    tags: ['community', 'character'],
  },
  {
    title: "Ruining It For Everyone",
    maxPlayerCount: 2,
    isPvP: true,
    intro: "During the war you watched your twin get cut down in a hail of shrapnel. You've lived an empty existence since that day making ends meet and trying to keep flying as best you can. Then you get a message from your Ma out on the Rim. \"Come home right away.\" So you fly to St. Albans, Red Sun to see your Mother. Once there, your twin (Who wasn't dead!) steals your ship and sets about ruining your life. Your twin has the exact same abilities as you do. Your twin may not discard any of your inactive jobs.",
    sourceUrl: "https://boardgamegeek.com/thread/1082965/story-card-ruining-it-for-everyone",
    setupDescription: "Start with only $2000 and 2 crew valuing no more than $500. You cannot take any crew with a $0 cost. If you have no wanted crew, take a Warrant instead. This becomes your Twin's ship. Draw a \"backup\" ship with 0 crew, no money, no jobs. This is your new ship. Both ships starts on St. Albans, Red Sun. Set 20 counters on this card as timing counters.",
    tags: ['community', 'character', 'pvp'],
    rules: [
      { type: 'setComponent', stepId: STEP_IDS.C3, component: 'RuiningItDraftStep', source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'setComponent', stepId: STEP_IDS.C5, component: 'RuiningItResourcesStep', source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'setComponent', stepId: STEP_IDS.C6, component: 'RuiningItJobsStep', source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'setShipPlacement', location: { sector: 'St. Albans, Red Sun' }, source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'modifyResource', resource: 'credits', method: 'add', value: -1000, description: "Base funds adjusted for story.", source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "Your twin stole your starting fuel.", source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "Your twin stole your starting parts.", source: 'story', sourceName: "Ruining It For Everyone" },
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "Ruining It For Everyone" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Nothin' Left But The Hurt",
          content: ["Start with 2 crew valuing no more than $500. You cannot take any crew with a $0 cost. If you have no wanted crew, take a Warrant instead. This becomes your Twin's ship. Draw a \"backup\" ship with 0 crew. This is your new ship. Both ships starts on St. Albans, Red Sun."]
        },
        source: 'story', 
        sourceName: "Ruining It For Everyone"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'A Raw Deal',
          content: ["Draw a \"backup\" ship with 0 crew, no money, no jobs. This is your new ship."]
        },
        source: 'story', 
        sourceName: "Ruining It For Everyone"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "The Twin's Head Start",
          content: ["Set 20 counters on this card as timing counters."]
        },
        source: 'story', 
        sourceName: "Ruining It For Everyone"
      }
    ]
  },
  {
    title: "Save River Tam",
    intro: "River Tam is being held in secure, secret government facility. Beloved sister, daughter of the ridiculously wealthy, and super useful government secret weapon. Whatever your reasons, you are on a mission to break River out.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1066622/story-card-save-river-tam",
    setupDescription: "Remove River Tam from play.",
    tags: ['community', 'jailbreak', 'character'],
    rules: [
      { type: 'addFlag', flag: 'removeRiver', source: 'story', sourceName: "Save River Tam" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Missing Person",
          content: ["Remove River Tam from play."]
        },
        source: 'story', 
        sourceName: "Save River Tam"
      }
    ],
    rating: 1
  },
  {
    title: "Saving Pirate Ryan",
    intro: "You know, there's a certain motto. A creed among folks like us. You may have heard it: \"Leave no man behind.\" Wash - Firefy Episide 10 - War Stories",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1536695/article/22110859#22110859",
    rating: 1,
    tags: ['community', 'jailbreak'],
  },
  {
    title: "Scavengers",
    intro: "This game only uses dice, cash, Leader cards, Supply decks, cargo, and contraband. Everything else stays in the box. A scavengers goal is simple, Find a Crew, Attack Another Crew, Keep Trying.",
    isPvP: true,
    setupDescription: "Shuffle all Supply decks and lay them face down in the middle of the table with the banks cash. All players start with $10,000 and 10 cargo. Roll for first player. First player chooses a Leader card then passes the Leader deck to the next player until each player has a Leader card.",
    sourceUrl: "https://boardgamegeek.com/thread/3114859/scavenger-card-game-story-card",
    requiredExpansion: "community",
    rating: 1,
    tags: ['community', 'pvp', 'verse_variant'],
    rules: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 10000, description: "Scavenger's Hoard", source: 'story', sourceName: "Scavengers" },
      { type: 'modifyResource', resource: 'fuel', method: 'disable', description: "No fuel used.", source: 'story', sourceName: "Scavengers" },
      { type: 'modifyResource', resource: 'parts', method: 'disable', description: "No parts used.", source: 'story', sourceName: "Scavengers" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Starting Cargo',
          content: ["Each player begins with 10 Cargo."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Scavenger Draft Rules',
          content: ["No ships are used in this scenario. Roll for first player. First player chooses a Leader card, then passes the Leader deck to the next player until each player has chosen one."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'nav',
        rule: {
          title: 'Component Not Used',
          content: ["Nav Decks are not used in this scenario."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Component Not Used',
          content: ["Alliance Cruiser and Reaver ships are not used in this scenario."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Goal Override',
          content: ["The standard goal step is not used. The goal is described on the main Story Card intro."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Component Not Used',
          content: ["Job cards are not used in this scenario."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Setup Step Skipped',
          content: ["Do not \"Prime the Pump\". Shuffle all Supply Decks and place them face down near the bank."]
        },
        source: 'story', 
        sourceName: "Scavengers"
      },
    ]
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/100497/shadows-over-duul-new-goal-reupload",
    setupDescription: "Remove jobs from Amnon Duul. Start in the border of Murphy.",
    tags: ['community', 'survival'],
    rules: [
      { type: 'forbidContact', contact: CONTACT_NAMES.AMNON_DUUL, source: 'story', sourceName: "Shadows Over Duul" },
      { type: 'setShipPlacement', location: { region: 'border of Murphy' }, source: 'story', sourceName: "Shadows Over Duul" },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'A Tense Start',
          content: ["Start in the border of Murphy."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Shadows Over Duul"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Unsavory Business',
          content: ["Remove jobs from Amnon Duul during Set Up."]
        },
        source: 'story', 
        sourceName: "Shadows Over Duul"
      }
    ],
    rating: 2,
  },
  {
    title: "Shiny New Year 25 - Protect Or Plunder",
    intro: "An affluent governor from Osiris is hosting a grand New Year's celebration--a wedding for his daughter aboard the luxury liner, Shiny New Year. The event has drawn attention from both well-meaning guardians and those with darker intentions. Which one are you? Protector or plunderer?",
    additionalRequirements: [
      "pirates"
    ],
    isPvP: true,
    setupDescription: "After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks.",
    sourceUrl: "https://boardgamegeek.com/thread/3405568/article/45332549#45332549",
    requiredExpansion: "community",
    tags: ['community', 'pvp'],
    rules: [
      { type: 'setJobDeck', operation: 'remove', jobType: 'piracy', source: 'story', sourceName: "Shiny New Year 25 - Protect Or Plunder" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Deck Modification',
          content: ["After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks."]
        },
        source: 'story', 
        sourceName: "Shiny New Year 25 - Protect Or Plunder"
      }
    ]
  },
];
