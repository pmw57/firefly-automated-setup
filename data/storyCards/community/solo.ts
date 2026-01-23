
import { StoryCardDef } from '../../../types';

export const SOLO_COMMUNITY_STORIES: StoryCardDef[] = [
  {
    title: "And That Makes Us Mighty",
    intro: "Feeling disrespected, broke, and in a bad mood, you finally decide to do something about it. But how many of your problems can you solve at once?",
    isSolo: true,
    goals: [
      {
        title: "Earn Their Respect",
        description: "End the game with at least 5 different Contacts."
      },
      {
        title: "Flush with Cash",
        description: "End the game with at least $15,000."
      },
      {
        title: "Let Off Some Steam",
        description: "Successfully Proceed past 20 more Misbehave cards by the end of the game."
      }
    ],
    tags: ['community', 'reputation', 'against_the_black', 'solo'],
    setupDescription: "After randomly selecting a Leader, you may select up to 4 Crew cards revealed when Priming the Pump - up to a total value of $1000.",
    rules: [
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          badge: 'Story Action',
          title: 'Post-Priming Draft',
          content: ["After Priming the Pump, you may select up to 4 Crew cards that were revealed, up to a total value of $1000."]
        },
        source: 'story',
        sourceName: "And That Makes Us Mighty"
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Multiple Goals',
          content: ["In addition to selecting one Goal, you must try to complete as many Goals as possible by the end of the game."]
        },
        source: 'story',
        sourceName: "And That Makes Us Mighty"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/253651/solo-story-card-and-that-makes-us-mighty",
    requiredExpansion: "community"
  },
  {
    title: "Beholden to Niska",
    intro: "You have gotten a loan from Niska to buy your first ship. Niska will expect favors and to be paid back (with interest) in a timely manner. Failure to do so will result in legal confiscation of your ship, and illegal confiscation of your life!",
    isSolo: true,
    tags: ['community', 'criminal_enterprise', 'against_the_black', 'solo'],
    setupDescription: "This game lasts for 30 turns (plus a final \"No Fly Action\" turn. Start at the Osiris ShipWorks with $3000, a Leader and a Ship.",
    rules: [
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Game lasts for 30 turns (plus a final \"No Fly Action\" turn)."]
        },
        source: 'story',
        sourceName: "Beholden to Niska"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Start Location',
          content: ["Start at the Osiris ShipWorks with a Leader and a Ship."]
        },
        source: 'story',
        sourceName: "Beholden to Niska"
      },
      { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: "Beholden to Niska" },
      { type: 'addFlag', flag: 'disablePriming', source: 'story', sourceName: "Beholden to Niska" },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Priming Skipped',
          badge: 'Story Override',
          content: ["The 'Prime the Pump' step is skipped for this story. Do not discard any cards from the Supply Decks."]
        },
        source: 'story',
        sourceName: "Beholden to Niska"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/129108/beholden-to-niska-firefly-solitaire-story-card-by",
    requiredExpansion: "community"
  },
  {
    title: "Christmas Delivery",
    intro: "The 'Verse is just too big for one man to provide joy for all of the good little boys and girls. He needs your help and you'd better not misbehave!",
    requiredExpansion: "community",
    isSolo: true,
    setupDescription: "Same as Awful Lonely in the Big Black",
    tags: ['community', 'character', 'against_the_black', 'solo'],
    rules: [
      { type: 'addFlag', flag: 'soloCrewDraft', source: 'story', sourceName: "Christmas Delivery" },
      { type: 'addFlag', flag: 'soloGameTimer', source: 'story', sourceName: "Christmas Delivery" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Assembling a Rag-Tag Crew',
          content: ["In addition to selecting your Leader, you may also select up to 4 Crew cards from any deck, up to a total value of $1000."]
        },
        source: 'story',
        sourceName: "Christmas Delivery"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/thread/1076227/christmas-delivery-a-solo-story-card-for-the-holid"
  },
  {
    title: "The Hero of Canton",
    intro: "You can't do that to my people. Can't crush them under your heel. I'll strap on my hat, and in 20 rounds flat, steal every Mudder Boss Higgins has to steal.",
    isSolo: true,
    tags: ['community', 'classic_heist', 'character', 'against_the_black', 'solo'],
    setupDescription: "Start play with Cap'n Jayne as your Leader, Jayne's Cunning Hat, and Vera. Subtract the cost of Vera from your Starting Cash.",
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Hero Assignment',
          content: ["Start play with Cap'n Jayne as your Leader, Jayne's Cunning Hat, and Vera."]
        },
        source: 'story',
        sourceName: "The Hero of Canton"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Starting Gear Cost',
          content: ["Subtract the cost of Vera from your Starting Cash."]
        },
        source: 'story',
        sourceName: "The Hero of Canton"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Mudder Deck',
          content: ["Pull all Mudders and Stitch from the Supply decks. Shuffle them all together and place them face up as the Mudder deck. If the Foreman or Stitch is the top card after a shuffle, reshuffle the deck."]
        },
        source: 'story',
        sourceName: "The Hero of Canton"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Game Timer',
          content: ["Use 20 Disgruntle tokens as the game length timer."]
        },
        source: 'story',
        sourceName: "The Hero of Canton"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/288785/the-hero-of-canton-solo-story-card",
    requiredExpansion: "community"
  },
  {
    title: "Hunt For The Arc",
    intro: "The Joan of Arc, one of the great colony ships that left Earth-That-Was hundreds of years ago, never arrived at its destination. Filled with priceless Earth artifacts, the huge vessel has long been rumored to be floating out beyond Alliance space, just waiting to make some lucky crew filthy rich. It's haunted you, become an obsession, but you pored over star charts and history books for years, and now you might just have a notion where she 'bides. Find the Arc and successfully deliver her to the Alliance for a hefty sum, or fence her to a criminal boss to become financially set for life...",
    requiredExpansion: "community",
    isSolo: true,
    sourceUrl: "https://boardgamegeek.com/thread/1049419/hunt-for-the-arc-a-solo-adventure",
    setupDescription: "Place 1 Reaver ship and the Alliance Cruiser in the Border Space sector below Valentine. If Blue Sun is active, place 2 more Cutters near Miranda.",
    tags: ['community', 'mystery', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'setReaverPlacement',
        placement: "Place 1 Cutter in the Border Space sector directly below Valentine. Place the remaining 2 Cutters in the border sectors closest to Miranda.",
        criteria: { requireExpansion: 'blue' },
        source: 'story',
        sourceName: "Hunt For The Arc"
      },
      {
        type: 'setReaverPlacement',
        placement: "Place 1 Cutter in the Border Space sector directly below Valentine.",
        criteria: { excludeExpansion: 'blue' },
        source: 'story',
        sourceName: "Hunt For The Arc"
      }
    ]
  },
  {
    title: "Jubal's Early Years",
    intro: "Not much is know about Jubal's past.",
    isSolo: true,
    goals: [
      {
        "title": "Hunt the Verse's Most Wanted",
        "description": "During Setup, mark 3 random bounties (not Cortex Alerts). Deliver the 3 marked bounties."
      }
    ],
    tags: ['community', 'character', 'against_the_black', 'solo'],
    setupDescription: "Start play with Jubal Early as your leader. Remove Serenity's crew from the Bounty and Supply Decks. The Bounty deck is placed face up. All bounties are active.",
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Leader Assignment',
          content: ["Start play with Jubal Early as your Leader. Remove Serenity's crew from the Bounty and Supply Decks."]
        },
        source: 'story',
        sourceName: "Jubal's Early Years"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Active Bounties',
          content: ["The Bounty deck is placed face up. All bounties are active."]
        },
        source: 'story',
        sourceName: "Jubal's Early Years"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/289736/jubals-story-solo-cards",
    requiredExpansion: "community"
  },
  {
    title: "Jubal's Mighty Roar",
    intro: "Bounty Hunting's been 'round since long before you was born and it'll be 'round long after you're gone. So, why not cash in some of them high priced Bounties. I hear there's a young girl that'll fetch a nice price.",
    isSolo: true,
    requiredExpansion: "community",
    rating: 3,
    tags: ['community', 'doing_the_job', 'character', 'against_the_black', 'solo'],
    setupDescription: "Start play with Jubal Early as your Leader, Early's Pistol, Early's Combat Armor, and the Interceptor. Subtract the cost of Early's Pistol and Armor from your Starting Cash. Place Serenity on a non-planetary sector in the Georgia system. Collect Serenity's crew and set them to the side. The Bounty deck is placed face up. All bounties are active.",
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Fixed Assignment',
          content: ["Start play with the following fixed assignment: Leader: Jubal Early Ship: The Interceptor Gear: Early's Pistol & Early's Combat Armor"]
        },
        source: 'story',
        sourceName: "Jubal's Mighty Roar"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Token Placement',
          content: ["Place the Serenity ship token on any non-planetary sector within the Georgia system."]
        },
        source: 'story',
        sourceName: "Jubal's Mighty Roar"
      },
      {
        type: 'modifyResource',
        resource: 'credits',
        method: 'add',
        value: -1600,
        description: "Cost of Starting Gear",
        source: 'story',
        sourceName: "Jubal's Mighty Roar"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Deck Preparation Overrides',
          content: ["Find and remove all of Serenity's crew cards from the various Supply Decks and set them aside. The Bounty Deck is placed face up, and all Bounties are considered active from the start of the game."]
        },
        source: 'story',
        sourceName: "Jubal's Mighty Roar"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/thread/3399878/jubals-mighty-roar"
  }
];
