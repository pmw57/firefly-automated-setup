import { StoryCardDef } from '../../../types';
import { createStoryRules } from '../utils';

export const STORIES_H_L: StoryCardDef[] = [
  {
    title: "Honorably Dishonorable Men",
    intro: "Care to press your luck? All them shiny things in the core sure could be of some use to folks out on the Rim.",
    setupDescription: "Place 8 contraband tokens on each of the following sectors in Alliance Space: Londonium, Bernadette, Liann Jiun, Sihnon, Gonghe, and Bellerophon. Use 20 Disgruntled tokens as the game length timer.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3602682/honorably-dishonorable-men",
    tags: ['community', 'smugglers_run'],
    rules: createStoryRules("Honorably Dishonorable Men", [
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Pressing Your Luck',
          content: ["Place 8 contraband tokens on each of the following sectors in Alliance Space: Londonium, Bernadette, Liann Jiun, Sihnon, Gonghe, and Bellerophon. Use 20 Disgruntled tokens as the game length timer."]
        }
      },
      {
        type: 'addBoardComponent',
        component: 'contraband',
        count: 8,
        locations: ['Londinium', 'Bernadette', 'Liann Jiun', 'Sihnon', 'Gonghe', 'Bellerophon'],
        title: 'Mass Contraband Stash'
      },
      {
        type: 'createAlertTokenStack',
        fixedValue: 20,
        tokenName: 'Disgruntled Tokens',
        title: 'Game Length Timer',
        description: "The player in first position discards 1 token at the start of each round. After the last token is discarded, all players take one final turn."
      }
    ])
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/103582/goal-hospital-rescue",
    setupDescription: "Remove River Tam from play.",
    tags: ['community', 'jailbreak'],
    rules: createStoryRules("Hospital Rescue", [
      { type: 'addFlag', flag: 'removeRiver' },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Missing Person",
          content: ["Remove River Tam from play."]
        }
      }
    ]),
    rating: 2,
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    requiredExpansion: "community",
    setupDescription: "Start with $500, 2 Fuel, and 2 Parts. Nandi pays half price, rounded up, when hiring crew.",
    tags: ['community', 'classic_heist'],
    rules: createStoryRules("How It All Started", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, description: "Scraping By" },
      { type: 'modifyResource', resource: 'fuel', method: 'set', value: 2, description: "Scraping By" },
      { type: 'addFlag', flag: 'disablePriming' },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Scraping By",
          content: [
            "Start with $500, 2 Fuel, and 2 Parts. ",
            "Nandi pays half price (rounded up) when hiring crew."
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Priming Skipped',
          badge: 'Story Override',
          content: ["The 'Prime the Pump' step is skipped for this story. Do not discard any cards from the Supply Decks."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/186593/where-it-all-started-story-card"
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4434522/pmw57",
    setupDescription: "Start with 2 Warrants. Alliance Space is off limits. Harken is unavailable for Jobs.",
    tags: ['community', 'classic_heist'],
    rules: createStoryRules("It Ain't Easy Goin' Legit", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, description: "Start with 2 Warrants." },
      { 
        type: 'addSpecialRule', 
        category: 'nav', 
        rule: { 
            title: 'Restricted Airspace', 
            content: [{ type: 'strong', content: `Alliance Space is Off Limits` }, ` until Goal 3.`] 
        } 
      },
      { type: 'forbidContact', contact: 'Harken' }
    ]),
    rating: 2,
  },
  {
    title: "A Jubilant Victory",
    intro: "10,000 Credits will put a mighty fine jingle in anyone's pocket. If that pocket belongs to you, best keep a watchful eye out for Jubal Early and his intentions.",
    requiredExpansion: "aces_eights",
    additionalRequirements: ["local_color"],
    rating: 1,
    sourceUrl: "https://boardgamegeek.com/filepage/235439/storycard-a-jubilant-victory",
    setupDescription: "Players use Firefly-class ships equipped with standard core drives and begin at their Havens with one Warrant. Jubal Early uses the Interceptor, starting from Meridian.",
    tags: ['community', 'survival'],
    rules: createStoryRules("A Jubilant Victory", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Story-Specific Warrant" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Unwanted Attention',
          content: ["Players begin at their Havens with one Warrant."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'A High-Stakes Game: Haven Placement',
          content: ["Players begin at their Havens."],
          flags: ['isHavenPlacement']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
          title: 'Required Ships',
          badge: 'Ship Rules',
          content: [
            { type: 'paragraph', content: ["Players must use ", { type: 'strong', content: "Firefly-class ships" }, "."] },
            { type: 'paragraph-small-italic', content: ["All ships are equipped with standard core drives."] }
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
          title: 'Jubal Early',
          badge: 'NPC Rules',
          flags: ['col-span-2'],
          content: [
            "Jubal Early is in play. He uses the ",
            { type: 'strong', content: "Interceptor" },
            " ship, starting from ",
            { type: 'strong', content: "Meridian" },
            "."
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement_extra',
        rule: {
          content: ["⚠️ Reminder: Each player also begins with one ", { type: 'strong', content: "Warrant" }, "."]
        }
      }
    ])
  },
  {
    title: "Laying Down the Law",
    intro: "Alliance brass has handed down some flush to the local magistrates to round up some old warrants and they're hiring new law men who can prove they can get the job done.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1093761/article/14404723#14404723",
    setupDescription: "Wanted crew may not be hired.",
    rating: 1,
    tags: ['community', 'character'],
    rules: createStoryRules("Laying Down the Law", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Laying Low',
          content: ["Wanted crew may not be hired."]
        }
      }
    ])
  },
  {
    title: "The Long Haul",
    intro: "Anson's looking for a top notch crew for a really big job. He doesn't just hand out jobs to anyone though. Can you prove yourself capable, secure the job, and make a fortune?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1107085/the-long-haul-idea-for-an-unofficial-story-card",
    rating: 1,
    tags: ['community', 'reputation'],
  },
];