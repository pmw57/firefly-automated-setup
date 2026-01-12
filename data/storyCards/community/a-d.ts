import { StoryCardDef } from '../../../types';
import { createStoryRules } from '../utils';

export const STORIES_A_D: StoryCardDef[] = [
  {
    title: "A New Leaf",
    intro: "You're a Captain who's tire dof the smuggling life. Also, recent inflation spikes in the 'Verse are making ship maintenance costs too ruttin' expensive. You're considering a government land grab program that helps people get settled on planets in Alliance Space. The program has only one slot left to claim a free piece of land.",
    additionalRequirements: [
      "blue",
      "kalidasa",
      "pirates"
    ],
    setupDescription: "Follow the 'Land Grant & Outfitting' override. Start with $10,000.",
    sourceUrl: "https://boardgamegeek.com/thread/3092841/a-new-leaf-story-card-using-fan-made-ships",
    requiredExpansion: "community",
    rating: 1,
    tags: ['community', 'character'],
    rules: createStoryRules("A New Leaf", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 10000, description: "Story Funds" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Land Grant & Outfitting',
          content: ["When placing ships, each player also places a Haven token on any non-supply planet within Alliance Space, except for Londinium. Only one Haven per planet. Players must buy a small ship (less than 10 cargo hold). Buy parts/fuel at listed price."],
          flags: ['isHavenPlacement']
        }
      }
    ])
  },
  {
    title: "Aimin' To Misbehave",
    intro: "A big time crime boss has retired to a life of ease and comfort, leaving behind a nice little power vacuum. If you want to take his place you'll need money and business parthers. Shady business oartners to be exact. The shadier the better.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3077380/aimin-to-misbehave",
    setupDescription: "Remove all legal job cards from play.",
    tags: ['community', 'criminal_enterprise'],
    rules: createStoryRules("Aimin' To Misbehave", [
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'A Shady Line of Work',
          content: ["Remove all legal jobs from play."]
        }
      },
      {
        type: 'setJobStepContent',
        position: 'before',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'strong', content: 'Deck Modification:' },
              ' Before drawing starting jobs, you must first remove all Legal Job Cards from all Contact Decks. The standard job draw below will then consist of only Illegal Jobs.'
            ]
          }
        ]
      }
    ])
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
    intro: "Serenity Valley was a valley located on Hera; it was mainly sparse and rocky with little vegetation. The valley was famous for being the location of the Battle of Serenity Valley—one of the bloodiest battles of the entire Unification War. Due to Hera's strategic positioning, taking the planet was a key to winning the war, and Serenity Valley became the turning point of the entire conflict.",
    setupDescription: "Follow the 'War Materiel Setup' override instructions.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1099553/story-card-the-battle-of-serenity-valley-pvp",
    rating: 0,
    tags: ['community', 'pvp'],
    rules: createStoryRules("The Battle of Serenity Valley (PvP)", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'War Materiel Setup',
          content: ["Take all Crew cards with \"Fight\" skill and all gear cards with \"Fight\" skill, add crew compartment ship upgrades and put them all in one deck; Shuffle. Take all Misbehave cards with \"Fight\" skill checks; Shuffle. Remove half \"Keep Flying\" cards from Alliance and Border decks. Other cards won't be used. Players evenly pick Alliance or Independents (Browncoats). Deal 3 crew/gear to each player (disregard warrants). Place ships in appropriate space. Alliance to inner planets, Browncoats to Border Planets."]
        }
      }
    ])
  },
  {
    title: "Black Market Beagles",
    intro: "One too many loads of smuggled cargo (of the live variety) has really started to stink up the place so the crew has opted to transport something smaller, more specifically with smaller droppings.",
    setupDescription: "Follow the 'Starting Gear' override.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1098646/article/14445829#14445829",
    rating: 1,
    tags: ['community', 'character'],
    rules: createStoryRules("Black Market Beagles", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Starting Gear',
          content: ["Each player begins the game with 1 Cry Baby on their ship."]
        }
      }
    ])
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
    intro: "A plague has broken out on the border worlds. A natural disease? Leftover bioweapons from the Unification War? Or an attempt by the Alliance to exterminate those whoresist its rule? No one knows. But word's gotten out that the Alliance has a cure for it--and they're not sharing.",
    setupDescription: "Follow the 'Special Starting Procedure' override.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1240655/doing-good-works-soloco-op-scenario",
    rating: 0,
    tags: ['community', 'against_the_black'],
    rules: createStoryRules("Doing Good Works", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Starting Procedure',
          content: ["Players starting on a Supply world may choose three cards from that Supply deck. Crew are hired for free. Other cards must be paid for at half price from the player's starting cash. Corbin and Marco's half-price abilities apply (round up to nearest $100). More than one player may start on the same world. Additional players must wait for the previous player to finish before selecting their cards."]
        }
      }
    ])
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
