
import { StoryCardDef } from '../../../types';
import { CONTACT_NAMES } from '../../ids';

export const STORIES_A_D: StoryCardDef[] = [
  {
    title: "A New Leaf",
    intro: "You're a Captain who's tired of the smuggling life. Also, recent inflation spikes in the 'Verse are making ship maintenance costs too ruttin' expensive. You're considering a government land grab program that helps people get settled on planets in Alliance Space. The program has only one slot left to claim a free piece of land.",
    additionalRequirements: [
      "blue",
      "kalidasa",
      "pirates"
    ],
    setupDescription: "When placing ships, each player also places a Haven token on any non-supply planet within Alliance Space, except for Londinium. Only one Haven per planet. Start with $10,000. Strart with a small ship (less than 10 cargo hold). With your $10,000 pay for the small ship. Buy parts/fuel  at listed price. No Starting Jobs from Niska.",
    sourceUrl: "https://boardgamegeek.com/thread/3092841/a-new-leaf-story-card-using-fan-made-ships",
    requiredExpansion: "community",
    rating: 1,
    tags: ['community', 'character'],
    rules: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 10000, description: "Story Funds", source: 'story', sourceName: "A New Leaf" },
      {
        type: 'setDraftMode',
        mode: 'standard',
        selectShipDescription: "The player with the highest die roll chooses a Leader & Ship first. Pass to Left.",
        placementTitle: "Haven Placement",
        placementDescription: "The last player to choose a Leader places their Haven first. Remaining players in reverse order.",
        source: 'story',
        sourceName: "A New Leaf"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'The Boneyard Special',
          content: ["Place a Haven token on any non-supply planet within Alliance Space, except for Londinium. Only one Haven per planet. Start with a small ship (less than 10 cargo hold) and pay for it and your Starting Supplies when you gain your money."],
          flags: ['isHavenPlacement']
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_ships',
        rule: {
          content: ["Select small ships, less than 10 cargo hold."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          content: ["Place Haven in any non-supply planet within Alliance Space, except for Londinium. Only one Haven per planet."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Retirement funds',
          content: [
            "Start with $10,000 anda small ship (less than 10 cargo hold) and pay for it and your Starting Supplies when you gain your money."
          ]
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Payment Required',
          content: ["Pay for your ship, fuel, and parts from your Starting Capitol."],
          flags: ['showInResourceList', 'hideFromTop']
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA, source: 'story', sourceName: "A New Leaf" },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: "Proving your worth",
          content: ["No Starting Jobs from Niska."]
        },
        source: 'story', 
        sourceName: "A New Leaf"
      },
    ]
  },
  {
    title: "Absolutely. What's 'Sanguine' Mean?",
    intro: " ",
    sourceUrl: "https://boardgamegeek.com/thread/3655131/three-homebrew-scenarios",
    requiredExpansion: "community",
    rating: 1
  },
  {
    title: "Aimin' To Misbehave",
    intro: "A big time crime boss has retired to a life of ease and comfort, leaving behind a nice little power vacuum. If you want to take his place you'll need money and business parthers. Shady business partners to be exact. The shadier the better.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3077380/aimin-to-misbehave",
    setupDescription: "Remove all legal job cards from play.",
    tags: ['community', 'criminal_enterprise'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'A Shady Line of Work',
          content: ["Remove all legal jobs from play."]
        },
        source: 'story', 
        sourceName: "Aimin' To Misbehave"
      },
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
            title: 'Deck Modification',
            content: ['Remove all Legal Jobs from the Contact Decks.']
        },
        source: 'info',
        sourceName: "Aimin' To Misbehave"
      }
    ]
  },
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/103321/firefly-goal-bank-job-jpeg-and-psd",
    rating: 3,
    tags: ['community', 'classic_heist'],
  },
  {
    title: "The Battle of Serenity Valley (PvP)",
    isPvP: true,
    playerCount: [2, 4, 6],
    intro: "Serenity Valley was a valley located on Hera; it was mainly sparse and rocky with little vegetation. The valley was famous for being the location of the Battle of Serenity Valley—one of the bloodiest battles of the entire Unification War. Due to Hera's strategic positioning, taking the planet was a key to winning the war, and Serenity Valley became the turning point of the entire conflict.",
    setupDescription: "For 2 or 4 or 6 Players. Take all Crew cards with \"Fight\" skill and all gear cards with \"Fight\" skill, add crew compartment ship upgrades and put them all in one deck; Shuffle. Take all Misbehave cards with \"Fight\" skill checks; Shuffle. Remove half \"Keep Flying\" cards from Alliance and Border decks. Other cards won't be used. Players evenly pick Alliance or Independents (Browncoats). Deal 3 crew/gear to each player (disregard warrants). Place ships in appropriate space. Alliance to inner planets, Browncoats to Border Planets.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1099553/story-card-the-battle-of-serenity-valley-pvp",
    rating: 0,
    tags: ['community', 'pvp'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'nav',
        rule: {
          title: 'Tougher Times',
          content: ["Remove half \"Keep Flying\" cards from Alliance and Border decks. Other cards won't be used."]
        },
        source: 'story', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      },
      {
        type: 'addSpecialRule',
        category: 'nav',
        rule: {
          title: 'Component Cleanup',
          content: ["Remove half of the \"Keep Flying\" cards out of the game."]
        },
        source: 'info', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Picking Sides',
          content: ["Players evenly pick Alliance or Independents (Browncoats). Place ships in appropriate space. Alliance to inner planets, Browncoats to Border Planets."]
        },
        source: 'story', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_ships',
        rule: {
          title: 'Picking Sides',
          content: ["Players evenly pick Alliance or Independents (Browncoats)."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'Picking Sides',
          content: ["Place Alliance ships to inner planets, Browncoats to Border Planets."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'War Materiel Setup',
          content: ["Take all Crew cards with \"Fight\" skill and all gear cards with \"Fight\" skill, add crew compartment ship upgrades and put them all in one deck; Shuffle. Take all Misbehave cards with \"Fight\" skill checks; Shuffle. Deal 3 crew/gear to each player (disregard warrants)."]
        },
        source: 'story', 
        sourceName: "The Battle of Serenity Valley (PvP)"
      }
    ]
  },
  {
    title: "Black Market Beagles",
    intro: "One too many loads of smuggled cargo (of the live variety) has really started to stink up the place so the crew has opted to transport something smaller, more specifically with smaller droppings.",
    setupDescription: "Beagles are the contraband. If you lose 'em you can get more at Jiangyin, Red Sun, for $1000 each! Start out with 1 Cry Baby on the ship to use as you liken'",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1098646/article/14445829#14445829",
    rating: 1,
    tags: ['community', 'character'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Starting Gear',
          content: ["Each player begins the game with 1 Cry Baby on their ship."]
        },
        source: 'story', 
        sourceName: "Black Market Beagles"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_ships',
        rule: {
          title: 'Starting Gear',
          content: ["Each player's ship starts with 1 Cry Baby."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Black Market Beagles"
      }
    ]
  },
  {
    title: "Cupid's Little Helpers",
    intro: "Sometimes romance needs a little helping hand in the 'Verse. Here are three Jobs that let your Crew give love a fighting chance. The Jobs may be attempted in any order, and the Crew with the most money when the last Job is completed is the winner. Each Job may only be completed once per game.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1122149/story-card-cupids-little-helpers",
    rating: 0,
    tags: ['community', 'character'],
  },
  {
    title: "Doing Good Works",
    intro: "A plague has broken out on the border worlds. A natural disease? Leftover bioweapons from the Unification War? Or an attempt by the Alliance to exterminate those who resist its rule? No one knows. But word's gotten out that the Alliance has a cure for it--and they're not sharing. Plucky heroes must steal the medicine from the Alliance, deliver it to those in need, and do what they can to stem the plague before worlds become graveyards.",
    setupDescription: "A player placing his ship on a supply world may choose three cards from that world's deck. Crew are hired for free. Other cards must be paid for at half price from the player's starting cash. Corbin and Marco's half-price abilities apply—round the price of each item up to the nearest $100. More than one player may start on the same world. Additional players must wait until the previous player has selected three cards before taking their selections.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1240655/doing-good-works-soloco-op-scenario",
    rating: 0,
    tags: ['community', 'against_the_black'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Starting Procedure',
          content: ["More than one player may start on the same world."]
        },
        source: 'story', 
        sourceName: "Doing Good Works"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'Special Starting Procedure',
          content: ["More than one player may start on the same world."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Doing Good Works"
      },
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Special Starting Procedure',
          content: ["Players starting on a Supply world may choose three cards from that Supply deck. Crew are hired for free. Other cards must be paid for at half price from the player's starting cash. Corbin and Marco's half-price abilities apply (round up to nearest $100). Additional players must wait for the previous player to finish before selecting their cards."]
        },
        source: 'story', 
        sourceName: "Doing Good Works"
      }
    ]
  },
  {
    title: "Double Duty",
    intro: "Sometimes, It's best to work under the radar and quiet-like. Fanty and Mingo have goods and folks in need of moving throughout the 'Verse. Use your connections with others to keep the twins' names out of the picture. Do a good enough job, and you might become their new favorite captain.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/6067255",
    rating: 3,
    tags: ['community', 'criminal_enterprise'],
  },
];
