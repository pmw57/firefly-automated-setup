

import { StoryCardDef } from '../../../types';
import { SETUP_CARD_IDS, CONTACT_NAMES } from '../../ids';
import { createStoryRules } from '../utils';

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
    rules: createStoryRules("And That Makes Us Mighty", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Post-Priming Draft',
          content: ["After Priming the Pump, you may select up to 4 Crew cards that were revealed, up to a total value of $1000."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Multiple Goals',
          content: ["In addition to selecting one Goal, you must try to complete as many Goals as possible by the end of the game."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community"
  },
  {
    title: "Beholden to Niska",
    intro: "You have gotten a loan from Niska to buy your first ship. Niska will expect favors and to be paid back (with interest) in a timely manner. Failure to do so will result in legal confiscation of your ship, and illegal confiscation of your life!",
    isSolo: true,
    rules: createStoryRules("Beholden to Niska", [
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Game Timer',
          content: ["Game lasts for 30 turns (plus a final \"No Fly Action\" turn)."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Start Location',
          content: ["Start at the Osiris ShipWorks with a Leader and a Ship."]
        }
      },
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'No Priming',
          content: ["Do not \"Prime the Pump\" during setup."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/129108/beholden-to-niska-firefly-solitaire-story-card-by",
    requiredExpansion: "community"
  },
  {
    title: "Christmas Delivery",
    intro: "The 'Verse is just too big for one man to provide joy for all of the good little boys and girls. He needs your help and you'd better not misbehave!",
    requiredExpansion: "community",
    isSolo: true,
    setupDescription: "Same as Awful Lonely in the Big Black",
    rules: createStoryRules("Christmas Delivery", [
      { type: 'addFlag', flag: 'soloCrewDraft' },
      { type: 'addFlag', flag: 'soloGameTimer' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Assembling a Rag-Tag Crew',
          content: ["In addition to selecting your Leader, you may also select up to 4 Crew cards from any deck, up to a total value of $1000."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/1076227/article/14229639#14229639"
  },
  {
    title: "The Hero of Canton",
    intro: "You can't do that to my people. Can't crush them under your heel. I'll strap on my hat, and in 20 rounds flat, steal every Mudder Boss Higgins has to steal.",
    isSolo: true,
    rules: createStoryRules("The Hero of Canton", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Hero Assignment',
          content: ["Start play with Cap'n Jayne as your Leader, Jayne's Cunning Hat, and Vera."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Starting Gear Cost',
          content: ["Subtract the cost of Vera from your Starting Cash."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Mudder Deck',
          content: ["Pull all Mudders and Stitch from the Supply decks. Shuffle them all together and place them face up as the Mudder deck. If the Foreman or Stitch is the top card after a shuffle, reshuffle the deck."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Game Timer',
          content: ["Use 20 Disgruntle tokens as the game length timer."]
        }
      }
    ]),
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
    rules: createStoryRules("Hunt For The Arc", [
      { type: 'addFlag', flag: 'huntForTheArcReaverPlacement', reaverShipCount: 1 }
    ])
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
    rules: createStoryRules("Jubal's Early Years", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Leader Assignment',
          content: ["Start play with Jubal Early as your Leader. Remove Serenity's crew from the Bounty and Supply Decks."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Active Bounties',
          content: ["The Bounty deck is placed face up. All bounties are active."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/289736/jubals-story-solo-cards",
    requiredExpansion: "community"
  },
  {
    title: "Jubal's Mighty Roar",
    intro: "Bounty Hunting's been 'round since long before you was born and it'll be 'round long after you're gone. So, why not cash in some of them high priced Bounties. I hear there's a young girl that'll fetch a nice price.",
    isSolo: true,
    requiredExpansion: "community",
    rating: 3,
    rules: createStoryRules("Jubal's Mighty Roar", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Fixed Assignment',
          content: ["Start play with the following fixed assignment: Leader: Jubal Early Ship: The Interceptor Gear: Early's Pistol & Early's Combat Armor"]
        }
      },
      {
        type: 'modifyResource',
        resource: 'credits',
        method: 'add',
        value: -1600,
        description: "Cost of Starting Gear"
      },
      {
        type: 'addSpecialRule',
        category: 'allianceReaver',
        rule: {
          title: 'Special Token Placement',
          content: ["Place the Serenity ship token on any non-planetary sector within the Georgia system."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Deck Preparation Overrides',
          content: ["Find and remove all of Serenity's crew cards from the various Supply Decks and set them aside. The Bounty Deck is placed face up, and all Bounties are considered active from the start of the game."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/3399878/jubals-mighty-roar"
  },
  {
    title: "They're Part Of My Crew",
    intro: "We all know Mal's got a good aim when it comes to misnehavin'. We also know Mal's stepped on quite a few tows with his misbehavin'. There's more than a few folk like to see him and his crew behind bars or six feet under. Regardless of who or what comes at Serenity, Mal's gonna do what he's always done. Protect his crew.",
    isSolo: true,
    goals: [
      {
        title: "Free Your Crew",
        description: "Once the 7-turn timer is up, you must immediately fly to Londinium and proceed past 5 negotiation skill checks to free your crew from the Alliance prison. If you are successful, you have won the game."
      }
    ],
    rules: createStoryRules("They're Part Of My Crew", [
      { 
        type: 'modifyResource', 
        resource: 'credits', 
        method: 'set', 
        value: 1000, 
        description: "Story Funds" 
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Story Setup",
          content: ["Use Malcolm as your Leader and Serenity as your ship. Your starting crew is: Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River. Take 1 Expanded Crew Quarters from the Osiris Supply Deck."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Disgruntled Timer",
          content: ["Collect 7 Disgruntled tokens. These will be used as a special game timer. Discard 1 token at the start of each of your turns."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD,
  },
  {
    title: "War Stories",
    intro: "Remember when Malcolm put Niska's man through an engine? Well, Niska remembers and now he's lookin' to kill some folk.",
    isSolo: true,
    setupDescription: "Fixed assignment: Serenity's original crew. $0 starting cash. Game timer is 15 turns. Niska is unavailable.",
    sourceUrl: "https://boardgamegeek.com/thread/3019475/war-stories-and-oh-captain-my-captain-story-cards",
    requiredExpansion: "community",
    rules: createStoryRules("War Stories", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 0, description: "Story Funds" },
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Fixed Assignment: Serenity's Crew",
          content: ["Your assignment for this story is fixed. You do not perform the standard draft. Ship: Serenity Leader: Malcolm Reynolds Ship Upgrade: Equip one Expanded Crew Quarters from the Osiris Supply Deck. Crew: Start play with the 9 original Serenity crew members."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Game Timer',
          content: ["Use 15 Disgruntled tokens as the game length timer. Discard one at the start of your turn."]
        }
      }
    ]),
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD
  }
];