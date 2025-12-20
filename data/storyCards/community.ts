import { StoryCardDef } from '../../types';

export const COMMUNITY_STORIES: StoryCardDef[] = [
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: "community"
  },
  {
    title: "Black Market Beagles",
    intro: "One too many loads of smuggled cargo (of the live variety) has really started to stink up the place so the crew has opted to transport something smaller, more specifically with smaller droppings.",
    setupDescription: "Beagles are the contraband. If you lose 'em you can get more at Jiangyin, Red Sun for $1000 each! Start out with 1 Cry Baby on the ship to use at you liken'",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1098646/story-card"
  },
  {
    title: "Cupid's Little Helpers",
    intro: "Sometimes romance needs a little helping hand in the 'Verse. Here are three Jobs that let your Crew give love a fighting chance. The Jobs may be attempted in any order, and the Crew with the most money when the last Job is completed is the winner. Each Job may only be completed once per game.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1122149/story-card-cupids-little-helpers"
  },
  {
    title: "Double Duty",
    intro: "Sometimes, It's best to work under the radar and quiet-like. Fanty and Mingo have goods and folks in need of moving throughout the 'Verse. Use your connections with others to keep the twins' names out of the picture. Do a good enough job, and you might become their new favorite captain.",
    requiredExpansion: "community"
  },
  {
    title: "Fruity Oat Bar",
    intro: "One of your crew was once used in an experiment by the Alliance. After escaping and joining your crew, they are now wanted. Before you are caught, you decide to get to the bottom of things, and discover the secret that the Alliance wants kept secret.",
    setupDescription: "After choosing your Leader, search for any Wanted crew from any deck and add them to your crew. You must start in Alliance Space.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1045716/article/13603393#13603393"
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    setupDescription: "Remove River Tam from play.",
    requiredExpansion: "community",
    setupConfig: {
      flags: ['removeRiver']
    }
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    setupDescription: "Start with $500, 2 Fuel, 2 Parts. Nandi discounts.",
    requiredExpansion: "community",
    effects: [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, source: { source: 'story', name: "How It All Started" }, description: "Story Override" },
      { type: 'modifyResource', resource: 'fuel', method: 'set', value: 2, source: { source: 'story', name: "How It All Started" }, description: "Story Override" },
      { type: 'modifyResource', resource: 'parts', method: 'set', value: 2, source: { source: 'story', name: "How It All Started" }, description: "Story Override" }
    ],
    setupConfig: {
      flags: ['nandiCrewDiscount']
    },
    sourceUrl: "https://boardgamegeek.com/filepage/186593/where-it-all-started-story-card"
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    setupDescription: "Start with 2 Warrants. Alliance Space off limits. No Harken.",
    requiredExpansion: "community",
    effects: [
        { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, source: { source: 'story', name: "It Ain't Easy Goin' Legit" }, description: "Start with 2 Warrants." }
    ],
    setupConfig: {
      flags: ['allianceSpaceOffLimits'],
      forbiddenStartingContact: "Harken"
    }
  },
  {
    title: "Miranda",
    intro: "You suspect that there is a hidden message in the Fruity Oaty Bars advertisement recently broadcast by the Alliance network. Decoding it may reveal something of value or maybe it's just a new form of subliminal advertising.",
    setupDescription: "Place your Firefly on a supply world to begin the game. Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1135128/article/15123932#15123932"
  },
  {
    title: "Old Friends And New",
    intro: "You thought he was dead, but now you know your old War buddy is being held in a max-security prison on Valentine. You'll need the help of some new friends to unlock the Cortex master identity files, then mingle with the high and mighty to get the prison plans, and finally it's off to the rescue!",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1119976/story-card-old-friends-and-new"
  },
  {
    title: "Reap The Whirlwind",
    intro: "Word is, the Alliance has been hiding all manner of dirty secrets out Himinbjorg way. Convince the Dust Devils you're dangerous -- or desperate -- enough for them to come out of hiding and join forces. But hurry: the upcoming Unification Day Summit seems like the perfect time to let the truth out.",
    requiredExpansion: "community"
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    setupDescription: "Remove Amnon Duul Jobs. Start in border of Murphy.",
    requiredExpansion: "community",
    setupConfig: {
      forbiddenStartingContact: "Amnon Duul",
      startAtSector: "Border of Murphy"
    }
  },
  {
    title: "Slaying The Dragon",
    intro: "Adelai Niska has been lord of the underworld for as long as anyone can remember. Shu-ki, the tong boss of Gonghe, has long suffered under Niska's yoke. After being publicly shamed by Niska at a meeting of crime-bosses, an enraged Shu-ki has decided to bring Niska down. He has a plan - Operation Dragon - but the job is so daunting that it requires two crews to have any hope of success. Can two Firefly captains bring down the most feared criminal boss in the 'Verse?",
    setupDescription: "2-Player Co-Op. Niska jobs forbidden. Remove Niska Deck. Prime +2 cards/deck. Stack 16 Disgruntled Tokens (Countdown).",
    requiredExpansion: "community",
    rules: [
      { type: 'forbidContact', contact: 'Niska', source: 'story', sourceName: "Slaying The Dragon" },
      { type: 'modifyPrime', modifier: { add: 2 }, source: 'story', sourceName: "Slaying The Dragon" },
    ],
    sourceUrl: "https://boardgamegeek.com/thread/1049020/article/13686225#13686225"
  },
  {
    title: "The Ghost Rock Run",
    intro: "On Anson's World the Sweetrock Mining Co. has discovered a rare mineral called \"Ghost Rock\". Will you handle the run, or sell it to the highest bidder?",
    requiredExpansion: "community"
  },
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    setupDescription: "Remove all Job Decks. High-value cargo sales.",
    requiredExpansion: "community",
    setupConfig: {
      flags: ['removeJobDecks'],
      jobDrawMode: "no_jobs"
    }
  },
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Alliance a black eye?",
    setupDescription: "Requires Blue Sun Expansion.",
    requiredExpansion: "community",
    additionalRequirements: ["blue"]
  },
  {
    title: "Trash Part Deux",
    intro: "Have MRP (Mrs Reynolds persona) steal and sell the latest Firefly story.",
    requiredExpansion: "community"
  }
];