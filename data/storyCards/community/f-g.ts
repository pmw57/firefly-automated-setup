import { StoryCardDef } from '../../../types';

export const STORIES_F_G: StoryCardDef[] = [
  {
    title: "Fruity Oat Bar",
    intro: "One of your crew was once used in an experiment by the Alliance. After escaping and joining your crew, they are now wanted. Before you are caught, you decide to get to the bottom of things, and discover the secret that the Alliance wants kept secret.",
    setupDescription: "After choosing your Leader, search for any Wanted crew from any deck and add them to your crew. You must start in Alliance space.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1045716/article/13603393#13603393",
    rating: 1,
    tags: ['community', 'mystery'],
    rules: [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Crew',
          content: ["After choosing your Leader, search for any Wanted crew from any deck and add them to your crew."]
        },
        source: 'story', 
        sourceName: "Fruity Oat Bar"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_ships',
        rule: {
          title: 'Special Crew',
          content: ["Search for any Wanted crew from any deck and add them to your crew."],
          position: 'after'
        },
        source: 'story', 
        sourceName: "Fruity Oat Bar"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          title: 'Special Placement',
          content: ["You must start in Alliance Space."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "Fruity Oat Bar"
      },
      { type: 'setShipPlacement', location: { region: 'Alliance Space' }, source: 'story', sourceName: "Fruity Oat Bar" }
    ]
  },
  {
    title: "Gentleman's Agreement",
    intro: "Until now, the big players in the 'verse have agreed to keep to their own back yards, but that's about to change. Badger has received word that Adelai Niska has grown too big for his Skyplex around Ezra, and is branching out. The rumor is that Niska is setting up shop in Badger's territory. This doesn't sit well with Badger.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1101220/story-card-gentlemans-agreement",
    rating: 0,
    tags: ['community', 'faction_war'],
  },
  {
    title: "The Ghost Rock Run",
    intro: "On Anson's World the Sweetrock Mining Co. has discovered a rare mineral called \"Ghost Rock\". Will you handle the run, or sell it to the highest bidder?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/105342/custom-story-card-the-ghost-rock-run",
    rating: 2,
    tags: ['community', 'smugglers_run'],
  },
  {
    title: "Going Legit",
    intro: "With the strong arm of the Alliance growing ever string, there's gettin' to be less and less room for naughty men and women to slip about... I hear Blue Sun's in need of a legitimate transport company that can get government goods to the people what need 'em.",
    setupDescription: "A Port of Operation: While choosing starting positions, players must choose a planetary sector within Blue Sun system that is not a Contact or Supply sector. Mark the sector with a Haven Token. Leave unused ships out of the box as a \"For Sale\" pile.",
    sourceUrl: "https://boardgamegeek.com/thread/3560944/going-legit-story-card",
    requiredExpansion: "community",
    tags: ['community', 'character'],
    rules: [
      { type: 'addFlag', flag: 'isGoingLegit', source: 'story', sourceName: "Going Legit" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'A Port of Operation',
          content: ["While choosing starting positions, players must choose a planetary sector within Blue Sun system that is not a Contact or Supply sector. Mark the sector with a Haven Token. Leave unused ships out of the box as a \"For Sale\" pile."],
          flags: ['isHavenPlacement']
        },
        source: 'story', 
        sourceName: "Going Legit"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          content: ["Haven can be different from your stating location. Haven must be a non-contact and non-supply Blue Sun planetary sector."],
          position: 'before',
          flags: ['isHavenPlacement']
        },
        source: 'story', 
        sourceName: "Going Legit"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
            title: 'For Sale Pile',
            content: ["Leave unused ships out of the box as a \"For Sale\" pile."],
        },
        source: 'info', 
        sourceName: "Going Legit"
      }
    ]
  },
  {
    title: "The Good Guys",
    intro: " ",
    setupDescription: "Only MORAL leaders can be chosen. Immoral jobs cannot be accepted. EZRA is off limits until Goal 3 and working for Niska is not allowed. Crow is removed from the Game.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1624739/story-card-the-good-guys",
    tags: ['community', 'against_the_black'],
    rules: [
      { type: 'forbidContact', contact: 'Niska', source: 'story', sourceName: "The Good Guys" },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Moral Compass',
          content: ["Only MORAL leaders can be chosen. Immoral Jobs cannot be accepted. Remove Crow from the game."]
        },
        source: 'story', 
        sourceName: "The Good Guys"
      }
    ],
    rating: 1
  },
  {
    title: "The Good, The Bad, and The Ugly",
    intro: "To survive the 'Verse, you must walk among saints, trade with devils, and strike a deal with the depraved. Prove you can master every side of the law.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/2688034/the-good-the-bad-and-the-ugly-story-card",
    rating: 2,
    tags: ['community', 'reputation'],
    setupDescription: "Only take Starting Jobs from Harken, Lord Harrow, Mr. Universe and Amnon Duul. These jobs may be discardsed, as normal. Follow the Standard Game Set-Up Card otherwise."
  },
  {
    title: "The Great Escape",
    intro: "The Alliance has been busy. Rounded up a few of our nearest and dearest. We aim to right that wrong, and see about ending that incarceration.",
    requiredExpansion: "community",
    isCoOp: true,
    sourceUrl: "https://boardgamegeek.com/thread/2717955/article/38380038#38380038",
    tags: ['community', 'jailbreak', 'against_the_black', 'coop'],
    setupDescription: "During Leader selection, players also choose 2 cards from the Bounty Deck. Pair each chosen Bounty with its associated Wanted Crew card and place the two cards at Miranda, Burnham. Captains can trade crew, items, money, goods, passengers, and jobs from hand when on the same space."
  },
];