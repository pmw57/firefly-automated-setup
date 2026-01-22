import { StoryCardDef } from '../../../types';

export const STORIES_H_L: StoryCardDef[] = [
  {
    title: "Honorably Dishonorable Men",
    intro: "Care to press your luck? All them shiny things in the core sure could be of some use to folks out on the Rim.",
    setupDescription: "Place 8 contraband tokens on each of the following sectors in Alliance Space: Londonium, Bernadette, Liann Jiun, Sihnon, Gonghe, and Bellerophon. Use 20 Disgruntled tokens as the game length timer.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3602682/honorably-dishonorable-men",
    tags: ['community', 'smugglers_run'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Pressing Your Luck',
          content: ["Place 8 contraband tokens on each of the following sectors in Alliance Space: Londonium, Bernadette, Liann Jiun, Sihnon, Gonghe, and Bellerophon. Use 20 Disgruntled tokens as the game length timer."]
        },
        source: 'story', 
        sourceName: "Honorably Dishonorable Men"
      },
      {
        type: 'addBoardComponent',
        component: 'contraband',
        count: 8,
        locations: ['Londinium', 'Bernadette', 'Liann Jiun', 'Sihnon', 'Gonghe', 'Bellerophon'],
        title: 'Mass Contraband Stash',
        icon: '💰',
        locationTitle: '8 on each of 6 sectors:',
        locationSubtitle: 'Londinium, Bernadette, Liann Jiun, Sihnon, Gonghe, Bellerophon',
        source: 'story', 
        sourceName: "Honorably Dishonorable Men"
      },
      {
        type: 'createAlertTokenStack',
        fixedValue: 20,
        tokenName: 'Disgruntled Tokens',
        title: 'Game Length Timer',
        description: "The player in first position discards 1 token at the start of each round. After the last token is discarded, all players take one final turn.",
        source: 'story', 
        sourceName: "Honorably Dishonorable Men"
      }
    ]
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/103582/goal-hospital-rescue",
    setupDescription: "Remove River from play.",
    tags: ['community', 'jailbreak'],
    rules: [
      { type: 'addFlag', flag: 'removeRiver', source: 'story', sourceName: "Hospital Rescue" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Missing Person",
          content: ["Remove River Tam from play."]
        },
        source: 'story', 
        sourceName: "Hospital Rescue"
      }
    ],
    rating: 2,
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    requiredExpansion: "community",
    setupDescription: "Everyone starts with 2 parts, 2 fuel, and $500. Nandi pays half price, rounded up, when hiring crew.",
    tags: ['community', 'classic_heist'],
    rules: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, description: "Scraping By", source: 'story', sourceName: "How It All Started" },
      { type: 'modifyResource', resource: 'fuel', method: 'set', value: 2, description: "Scraping By", source: 'story', sourceName: "How It All Started" },
      { type: 'addFlag', flag: 'disablePriming', source: 'story', sourceName: "How It All Started" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Scraping By",
          content: [
            "Start with $500, 2 Fuel, and 2 Parts. ",
            "Nandi pays half price (rounded up) when hiring crew."
          ]
        },
        source: 'story', 
        sourceName: "How It All Started"
      },
      {
        type: 'addSpecialRule',
        category: 'prime_panel',
        rule: {
          title: 'Priming Skipped',
          badge: 'Story Override',
          content: ["The 'Prime the Pump' step is skipped for this story. Do not discard any cards from the Supply Decks."]
        },
        source: 'story', 
        sourceName: "How It All Started"
      }
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/186593/where-it-all-started-story-card"
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4434522/pmw57",
    setupDescription: "All players start with 2 Warrant Token! Alliance Space is off limits until Goal 3. Players may not deal with Harken.",
    tags: ['community', 'classic_heist'],
    rules: [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, description: "Start with 2 Warrants.", source: 'story', sourceName: "It Ain't Easy Goin' Legit" },
      { 
        type: 'addSpecialRule', 
        category: 'nav', 
        rule: { 
            title: 'Restricted Airspace', 
            content: [{ type: 'strong', content: `Alliance Space is Off Limits` }, ` until Goal 3.`] 
        },
        source: 'story', 
        sourceName: "It Ain't Easy Goin' Legit"
      },
      { type: 'forbidContact', contact: 'Harken', source: 'story', sourceName: "It Ain't Easy Goin' Legit" }
    ],
    rating: 2,
  },
  {
    title: "Laying Down the Law",
    intro: "Alliance brass has handed down some flush to the local magistrates to round up some old warrants and they're hiring new law men who can prove they can get the job done.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1093761/article/14404723#14404723",
    rating: 1,
    tags: ['community', 'character'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Laying Low',
          content: ["Wanted crew may not be hired."]
        },
        source: 'story', 
        sourceName: "Laying Down the Law"
      }
    ]
  },
  {
    title: "The Long Haul",
    intro: "Anson's looking for a top notch crew for a really big job. He doesn't just hand out jobs to anyone though. Can you prove yourself capable, secure the job, and make a fortune?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1107085/the-long-haul-idea-for-an-unofficial-story-card",
    rating: 1,
    tags: ['community', 'reputation'],
  }
];
