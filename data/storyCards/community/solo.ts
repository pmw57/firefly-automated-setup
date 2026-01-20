import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES, SETUP_CARD_IDS } from '../../ids';

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
    setupDescription: "Place 1 Reaver ship below Valentine. If Blue Sun is active, place 2 more Cutters near Miranda.",
    tags: ['community', 'mystery', 'against_the_black', 'solo'],
    rules: [
      {
        type: 'setReaverPlacement',
        placement: "Place 1 Reaver ship in the Border Space sector directly below Valentine. If Blue Sun is active, place the remaining 2 Cutters in the border sectors closest to Miranda.",
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
        category: 'allianceReaver',
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
        category: 'allianceReaver',
        rule: {
          title: 'Special Token Placement',
          content: ["Place the Serenity ship token on any non-planetary sector within the Georgia system."]
        },
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
  },
  {
    title: "War Stories",
    intro: "Remember when Malcolm put Niska's man through an engine? Well, Niska remembers and now he's lookin' to kill some folk.",
    isSolo: true,
    setupDescription: "Use Standard Setup Up card. No starting cash. use Serenity as your ship. Equip an exapanded crew Quarters from Osiris. Start play with  original Serenity crew members. Niska: Do not prime his deck. No Jobs given. Use 15 Disgruntle tokens as a game timer.",
    sourceUrl: "https://boardgamegeek.com/thread/3019475/war-stories-and-oh-captain-my-captain-story-cards",
    requiredExpansion: "community",
    tags: ['community', 'survival', 'character', 'against_the_black', 'solo'],
    rules: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 0, description: "Story Funds", source: 'story', sourceName: "War Stories" },
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA, source: 'story', sourceName: "War Stories" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Fixed Assignment: Serenity's Crew",
          content: ["Your assignment for this story is fixed. You do not perform the standard draft. Ship: Serenity Leader: Malcolm Reynolds Ship Upgrade: Equip one Expanded Crew Quarters from the Osiris Supply Deck. Crew: Start play with the 9 original Serenity crew members."]
        },
        source: 'story',
        sourceName: "War Stories"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Game Timer',
          content: ["Use 15 Disgruntled tokens as the game length timer. Discard one at the start of your turn."]
        },
        source: 'story',
        sourceName: "War Stories"
      }
    ],
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD
  },
  {
    title: "They're Part Of My Crew",
    intro: "We all know Mal's got a good aim when it comes to misbehavin'. We also know Mal's stepped on quite a few toes with his misbehavin'. There's more than a few folk like to see him and his crew behind bars or six feet under. Regardless of who or what comes at Serenity, Mal's gonna do what he's always done. Protect his crew.",
    isSolo: true,
    goals: [
      {
        title: "Free Your Crew",
        description: "Once the 7-turn timer is up, you must immediately fly to Londinium and proceed past 5 negotiation skill checks to free your crew from the Alliance prison. If you are successful, you have won the game."
      }
    ],
    tags: ['community', 'jailbreak', 'character', 'survival', 'against_the_black', 'solo'],
    setupDescription: "Use the Standard Set Up card with Malcolm as your Leader and Serenity as your ship. Take only $1000 in starting cash. Take Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River. Take 1 Expanded Crew Quarthers from Osiris. Collect 7 disgruntle tokens.",
    rules: [
      { 
        type: 'modifyResource', 
        resource: 'credits', 
        method: 'set', 
        value: 1000, 
        description: "Story Funds",
        source: 'story',
        sourceName: "They're Part Of My Crew"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Story Setup",
          content: ["Use Malcolm as your Leader and Serenity as your ship. Your starting crew is: Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River. Take 1 Expanded Crew Quarters from the Osiris Supply Deck."]
        },
        source: 'story',
        sourceName: "They're Part Of My Crew"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Disgruntled Timer",
          content: ["Collect 7 Disgruntled tokens. These will be used as a special game timer. Discard 1 token at the start of each of your turns."]
        },
        source: 'story',
        sourceName: "They're Part Of My Crew"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD,
  }
];