import { StoryCardDef } from '../types';

export const STORY_CARDS: StoryCardDef[] = [
  // Base Game
  {
    title: "Desperadoes",
    intro: "Your checkered past is catching up with you and the Alliance is hot on your tail! It's time to make a final cash grab and head out to the Rim to retire before the Alliance makes other arrangements.",
    setupDescription: "Start with 1 Warrant. Harken jobs unavailable.",
    setupConfig: {
      startWithWarrant: true,
      forbiddenStartingContact: "Harken"
    }
  },
  {
    title: "First Time in the Captain's Chair",
    intro: "So you finally took the plunge and borrowed enough credits for a ship to call your own. You're in debt up to your eyeballs with a creditor that's not the sort of man to be trifled with.",
    setupDescription: "Starting Jobs drawn only from Harken and Amnon Duul.",
    setupConfig: {
      allowedStartingContacts: ["Harken", "Amnon Duul"]
    }
  },
  {
    title: "Harken's Folly",
    intro: "Commander Harken has been entrusted by the Alliance to provide security for a gathering of Alliance VIPs and Parliament Officials. Lead Harken off on a wild goose chase and infiltrate the venue. Inside, plant bugs and hack secure servers to gather sensitive intel that'll make you rich."
  },
  {
    title: "Niska's Holiday",
    intro: "Adelai Niska is taking a holiday and has left his operations in the incompetent hands of one of his wife's many nephews. This presents an opportunity for an ambitious Captain to prove himself during his absence. Insure the continuing profitability of Niska's criminal enterprise and ensure his nephew's failure."
  },
  {
    title: "Patience's War",
    intro: "Patience has gotten herself embroiled in an all out Range War. She is paying hard cash to any crew smart enough to use a gun and dumb enough to put themselves in harm's way... and you know just the right crew for the job!"
  },
  {
    title: "\"Respectable\" Persons Of Business",
    intro: "There's a heap of trouble waiting out in the 'Verse. The Big Black is full of derelict ships, drifting proof of their Captain's missteps. Keeping you and yours in bullets and chow can be challenge enough. Not everyone has the mettle to keep their boat in the air. Prove you've got what it takes."
  },
  {
    title: "The King Of All Londinium",
    intro: "The New Cardiff Museum is about to play host to a grand exhibit of \"Earth That Was\" artifacts, the centerpiece of which is the Crown Jewels of old England. Endeavor to swap a quality counterfeit for the \"Shiny Hat\" and make off with the real one leaving no one the wiser."
  },
  // 10th Anniversary
  {
    title: "A Friend In Every Port",
    intro: "High places, low places... When you sail the Black for a living, best to have friends in ALL places.",
    setupDescription: "Draft 3 specific contact decks for starting jobs. Priming the Pump discards 2x cards. Requires Blue Sun & Kalidasa.",
    requiredExpansion: 'tenth',
    additionalRequirements: ['blue', 'kalidasa'],
    setupConfig: {
      jobDrawMode: 'draft_choice',
      primingMultiplier: 2
    }
  },
  {
    title: "Aces Up Your Sleeve",
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
    requiredExpansion: 'tenth'
  },
  {
    title: "Dead Man's Hand",
    intro: "The tale of the Dead Man's Hand followed mankind from Earth-That-Was out to the Black. Honor the legends of the outlaws of old with a series of adventures across the 'Verse.",
    requiredExpansion: 'tenth',
    additionalRequirements: ['blue']
  },
  {
    title: "It's a Mad, Mad, Mad, Mad 'Verse!",
    intro: "A mishap at Eavesdown Docks seriously injures a renowned swindler. Before passing, he shares clues that will lead to a hidden fortune. News spreads fast, igniting a frenzied race.",
    setupDescription: "All ships start at Persephone. Requires Kalidasa.",
    requiredExpansion: 'tenth',
    additionalRequirements: ['kalidasa'],
    setupConfig: {
      shipPlacementMode: 'persephone'
    }
  },
  {
    title: "Let's Be Bad Guys",
    intro: "It takes a particular kind of sinner to build lasting bridges with Adelai Niska. Are you that brand of renegade?",
    setupDescription: "Niska is forbidden for Starting Jobs.",
    requiredExpansion: 'tenth',
    setupConfig: {
      forbiddenStartingContact: "Niska"
    }
  },
  {
    title: "Red Skies Over Ransom",
    intro: "Reavers are pushing out more and more, making delivery runs almost impossible. Keelhauler Transport & Trading Co. is hiring skilled pilots, madcap mercs, and crafty smugglers to haul needed goods to their Rim distributors.",
    requiredExpansion: 'tenth',
    additionalRequirements: ['blue']
  },
  {
    title: "Running On Empty",
    intro: "Dust Devil attacks on refineries have spiked fuel prices. Higher costs and shortages are squeezing the entire 'Verse, causing worlds of hurt. The perpetrators must be found!",
    setupDescription: "Receive +$1200 Starting Credits. No Starting Fuel/Parts. Requires Blue Sun & Kalidasa.",
    requiredExpansion: 'tenth',
    additionalRequirements: ['blue', 'kalidasa'],
    setupConfig: {
      startingCreditsBonus: 1200,
      noStartingFuelParts: true
    }
  },
  {
    title: "The Wobbly Headed Doll Caper",
    intro: "Dolls with big heads that wobble! What could go wrong!",
    requiredExpansion: 'tenth',
    additionalRequirements: ['blue', 'kalidasa']
  },
  // Still Flying
  {
    title: "A Rare Specimen Indeed",
    intro: "Saffron's at it again. This time, she's convinced Badger that she's from a respectable family, and now the sad little king has his eye on a psychotic blushing bride. Whoever collects the most presents gets to give the toast... before it turns into a shotgun wedding.",
    setupDescription: "Players start with a Caper Card. No Starting Jobs dealt.",
    requiredExpansion: 'still_flying',
    setupConfig: {
      jobDrawMode: 'caper_start'
    }
  },
  {
    title: "The Rumrunner's Seasonal",
    intro: "An eccentric billionaire arranges a very special race every year to pick his most favorite captain. Win and you're set for life... or at least until someone breaks your record next time around.",
    requiredExpansion: 'still_flying',
    additionalRequirements: ['blue', 'kalidasa']
  },
  {
    title: "The Smuggly Bustle",
    intro: "The Alliance is cracking down. May come a day when there won't be room for naughty men and women to slip about, but for now, the right set of connections could help make you a smuggler extraordinaire.",
    setupDescription: "Place an Alliance Alert Token in every planetary Sector in Alliance Space. Requires Blue Sun & Kalidasa.",
    requiredExpansion: 'still_flying',
    additionalRequirements: ['blue', 'kalidasa'],
    setupConfig: {
      placeAllianceAlertsInAllianceSpace: true
    }
  },
  // Blue Sun
  {
    title: "Any Port In A Storm",
    intro: "The Alliance has got a burr in their collective britches: patrols have been tripled and strict enforcement of penal codes is in effect. Times such as these can make for strange bedfellows and safe harbor is where you can find it. Any port in a storm...",
    requiredExpansion: 'blue'
  },
  {
    title: "The Great Recession",
    intro: "Life on the raggedy edge can be a hard slog. Paying work is precious enough in the good times, but when things get lean the competition for jobs can get downright unsavory. Make hay while the sun shines or get left in the dust, beggin' for scraps.",
    requiredExpansion: 'blue'
  },
  // Kalidasa
  {
    title: "It's All In Who You Know",
    intro: "Credits are all well and good, but a strong network of contacts will pay greater dividends in the future. That's a lesson every captain gets to learn early, or they're likely not to be around long enough to learn it at all.",
    setupDescription: "Create a stack of Alliance Alert Tokens (3x Players). No Starting Jobs.",
    requiredExpansion: 'kalidasa',
    setupConfig: {
      createAlertTokenStackMultiplier: 3,
      jobDrawMode: 'no_jobs'
    }
  },
  {
    title: "The Scavenger's 'Verse",
    intro: "Scour the 'Verse high and low, to the Rim and back you may go.",
    requiredExpansion: 'kalidasa'
  },
  {
    title: "The Well's Run Dry",
    intro: "Increased Alliance oversight has made gettin' paid hard. Folks are limited to whatever cash they've got stashed under their bedrolls; even the movers and shakers are findin' the spigot's run dry.",
    requiredExpansion: 'kalidasa'
  },
  // Pirates
  {
    title: "...Another Man's Treasure",
    intro: "Wealth can be measured in many ways. In some parts of the 'Verse Alliance credits ain't worth the paper they're printed on. For those regions, a more practical measure of wealth is required. Hoard a mountain of trade goods and spare parts, through any means necessary. Break contracts, steal from your rivals or just pick the bones. Anything goes!",
    setupDescription: "Choose Havens in Border Space. Remove all Piracy Jobs from decks after setup.",
    requiredExpansion: 'pirates',
    setupConfig: {
      addBorderSpaceHavens: true,
      removePiracyJobs: true
    }
  },
  {
    title: "Jail Break",
    intro: "Your friend has been pinched by the Alliance and you don't intend to let 'em twist. Bad plan's better than no plan...",
    requiredExpansion: 'pirates'
  },
  {
    title: "The Choices We Make",
    intro: "The 'Verse is full of people trying to carve themselves a little slice, however they can. Even a good man can get turned about from time to time. The straight and narrow can get a might twisted when walkin' the raggedy edge. In the end, the mark a person leaves all comes down to the choices they make.",
    requiredExpansion: 'pirates'
  },
  // Crime
  {
    title: "Smuggler's Blues",
    intro: "Bringin' goods to folk who want 'em is an old-fashioned way to make a living... 'cept, sometimes, a law or two gets in the way.",
    setupDescription: "Place 3 Contraband in Alliance sectors. Place $2000 under specified decks. No Starting Jobs. Start at Londinium. Start with Alert Card.",
    requiredExpansion: 'crime',
    setupConfig: {
      smugglersBluesSetup: true,
      startWithAlertCard: true,
      jobDrawMode: 'no_jobs',
      startAtLondinium: true
    }
  },
  {
    title: "Wanted Men",
    intro: "Infamy's a funny thing. Bucking the law, while a might stressful day-to-day, leads to being known. The more you're known, the more your name's worth. Trick of it is, you got to sock away a lifetime of credits before you find yourself retiring early, in an Alliance lockup...",
    setupDescription: "Start with 1 Warrant. Start Outside Alliance Space. Start with Alert Card. Limited Starting Job Contacts.",
    requiredExpansion: 'crime',
    setupConfig: {
      startWithWarrant: true,
      startOutsideAllianceSpace: true,
      startWithAlertCard: true,
      allowedStartingContacts: ["Patience", "Badger", "Niska", "Mr. Universe", "Fanty & Mingo"]
    }
  },
  // Coachworks (Jetwash/Esmerelda)
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    setupDescription: "Create shared hand of Inactive Jobs. Start with Warrant Token.",
    requiredExpansion: 'coachworks',
    setupConfig: {
      sharedHandSetup: true,
      startWithWarrant: true
    }
  },
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    setupDescription: "Place Goal Tokens at destination sectors instead of keeping starting jobs.",
    requiredExpansion: 'coachworks',
    setupConfig: {
      jobDrawMode: 'wind_takes_us'
    }
  },
  // Black Market
  {
    title: "The Old Man And The Dragons",
    intro: "The Seven Dragon Kings are preparing to go to war with Adelai Niska, but their war would be bad for your business. Figure out where the Tong leaders are meeting, and maybe you can convince both sides to come to an arrangement.",
    requiredExpansion: 'black_market'
  },
  // Community
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: 'community',
    sourceUrl: 'https://boardgamegeek.com/thread/2104020/article/30675070#30675070'
  },
  {
    title: "Double Duty",
    intro: "Sometimes, It's best to work under the radar and quiet-like. Fanty and Mingo have goods and folks in need of moving throughout the 'Verse. Use your connections with others to keep the twins' names out of the picture. Do a good enough job, and you might become their new favorite captain.",
    requiredExpansion: 'community',
    sourceUrl: 'https://boardgamegeek.com/thread/2444019/article/37316409#37316409'
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    setupDescription: "Remove River Tam from play.",
    requiredExpansion: 'community',
    setupConfig: {
      removeRiver: true
    },
    sourceUrl: 'https://boardgamegeek.com/thread/2104020/article/30617384'
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    setupDescription: "Start with $500, 2 Fuel, 2 Parts. Nandi discounts.",
    requiredExpansion: 'community',
    setupConfig: {
      startingCreditsOverride: 500,
      customStartingFuel: 2,
      nandiCrewDiscount: true
    }
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    setupDescription: "Start with 2 Warrants. Alliance Space off limits. No Harken.",
    requiredExpansion: 'community',
    setupConfig: {
      startingWarrantCount: 2,
      allianceSpaceOffLimits: true,
      forbiddenStartingContact: "Harken"
    },
    sourceUrl: 'https://boardgamegeek.com/filepage/104447/fan-made-goal-card-it-aint-easy-goin-legit'
  },
  {
    title: "Reap The Whirlwind",
    intro: "Word is, the Alliance has been hiding all manner of dirty secrets out Himinbjorg way. Convince the Dust Devils you're dangerous -- or desperate -- enough for them to come out of hiding and join forces. But hurry: the upcoming Unification Day Summit seems like the perfect time to let the truth out.",
    requiredExpansion: 'community',
    sourceUrl: 'https://boardgamegeek.com/filepage/107073/firefly-goalset-up-card-templates'
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    setupDescription: "Remove Amnon Duul Jobs. Start in border of Murphy.",
    requiredExpansion: 'community',
    setupConfig: {
      forbiddenStartingContact: "Amnon Duul",
      startAtSector: "Border of Murphy"
    },
    sourceUrl: 'https://boardgamegeek.com/thread/2104020/article/30620123#30620123'
  },
  {
    title: "The Ghost Rock Run",
    intro: `On Anson's World the Sweetrock Mining Co. has discovered a rare mineral called "Ghost Rock". Will you handle the run, or sell it to the highest bidder?`,
    requiredExpansion: 'community',
    sourceUrl: 'https://boardgamegeek.com/thread/1199652/custom-story-card-the-ghost-rock-run'
  },
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    setupDescription: "Remove all Job Decks. High-value cargo sales.",
    requiredExpansion: 'community',
    setupConfig: {
      jobDrawMode: 'no_jobs',
      removeJobDecks: true
    },
    sourceUrl: 'https://boardgamegeek.com/image/2277037/upstarter'
  },
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Alliance a black eye?",
    setupDescription: "Requires Blue Sun Expansion.",
    requiredExpansion: 'community',
    additionalRequirements: ['blue'],
    sourceUrl: 'https://boardgamegeek.com/filepage/113602/the-truth-will-out'
  },
  {
    title: "Trash Part Deux",
    intro: "Have MRP (Mrs Reynolds persona) steal and sell the latest Firefly story.",
    requiredExpansion: 'community',
    sourceUrl: 'https://boardgamegeek.com/filepage/164355/story-card-trash-part-deux'
  }
];
