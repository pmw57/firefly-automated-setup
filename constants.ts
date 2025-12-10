
import { ContentMap, ScenarioDef, StoryCardDef, ExpansionDef } from './types';

export const SPRITE_SHEET_URL = "https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg";

export const EXPANSIONS_METADATA: ExpansionDef[] = [
  // 1. Base Game (Implicit, but listed for order/color if needed)
  
  // 2. 10th Anniversary
  {
    id: 'tenth',
    label: "10th Anniversary",
    description: "Adds 50 extra cards, Drifters, and 'Big Money' mechanics.",
    themeColor: 'yellow',
    icon: { type: 'text', value: '10' }
  },
  // 3. Still Flying
  {
    id: 'still_flying',
    label: "Still Flying",
    description: "Adds the R-Class ship, new story cards, and new contacts.",
    themeColor: 'cyan',
    icon: { type: 'text', value: 'SF' }
  },
  // 4. Blue Sun
  {
    id: 'blue',
    label: "Blue Sun",
    description: "Expands the 'Verse with the Western Rim (Lord Harrow, Mr. Universe) and Reaver mechanics.",
    themeColor: 'cornflower',
    icon: { type: 'sprite', value: '36% 6%' }
  },
  // 5. Kalidasa
  {
    id: 'kalidasa',
    label: "Kalidasa",
    description: "Expands the 'Verse with the Eastern Rim (Fanty & Mingo, Magistrate Higgins) and the Operative.",
    themeColor: 'khaki',
    icon: { type: 'sprite', value: '61% 6%' }
  },
  // 6. Pirates & Bounty Hunters
  {
    id: 'pirates',
    label: "Pirates & Bounty Hunters",
    description: "Introduces piracy, bounties, and direct player conflict.",
    themeColor: 'brown',
    icon: { type: 'sprite', value: '11% 6%' }
  },
  // 7. Crime & Punishment
  {
    id: 'crime',
    label: "Crime & Punishment",
    description: "Increases the risks of misbehaving with new Alliance Alert cards and severe penalties.",
    themeColor: 'firebrick',
    icon: { type: 'sprite', value: '86% 7%' }
  },
  // 8. Jetwash
  {
    id: 'jetwash',
    label: "Jetwash",
    description: "Adds the Jetwash ship and new setup cards.",
    themeColor: 'paleGreen',
    icon: { type: 'text', value: 'JW' }
  },
  // 9. Esmerelda
  {
    id: 'esmerelda',
    label: "Esmerelda",
    description: "Adds the Esmerelda ship and new setup cards.",
    themeColor: 'purple',
    icon: { type: 'text', value: 'ES' }
  },
  // 10. Black Market
  {
    id: 'black_market',
    label: "Black Market",
    description: "Adds the Black Market deck and high-risk illegal goods.",
    themeColor: 'dark',
    icon: { type: 'sprite', value: '36% 29%' }
  },
  // 11. Community Content
  {
    id: 'community',
    label: "Community Content",
    description: "Unofficial Story Cards and Scenarios created by the Firefly community.",
    themeColor: 'teal',
    icon: { type: 'text', value: 'CC' }
  }
];

export const STORY_CARDS: StoryCardDef[] = [
  // --- Base Game ---
  {
    title: "Desperadoes",
    intro: "Your checkered past is catching up with you and the Alliance is hot on your tail! It's time to make a final cash grab and head out to the Rim to retire before the Alliance makes other arrangements.",
    setupDescription: "Start with 1 Warrant. Harken jobs unavailable.",
    setupConfig: {
      startWithWarrant: true,
      forbiddenStartingContact: 'Harken'
    }
  },
  {
    title: "First Time in the Captain's Chair",
    intro: "So you finally took the plunge and borrowed enough credits fora  ship to call your own. You're in debt up to your eyeballs with a creditor that's not the sort of man to be trifled with.",
    setupDescription: "Starting Jobs drawn only from Harken and Amnon Duul.",
    setupConfig: {
      allowedStartingContacts: ['Harken', 'Amnon Duul']
    }
  },
  {
    title: "Harken's Folly",
    intro: "Commander Harken has been entrusted by the Alliance to provide security for a gathering of Alliance VIPs and Pariiament Officials. Lead Harken off on a wild goose chase and infiltrate the venue. Inside, plant bugs and hack secure servers to gather sensitive intel that'll make you rich."
  },
  {
    title: "Niska's Holiday",
    intro: "Adelia Niska is taking a holiday and has left his operations in the incompetent hands of one of his wife's many nephews. This presents an opportunity for an ambitious Captain to prove himself during his absence. Insure the continuing profitability of Niska's criminal enterprice and ensure his nephew's failure."
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
    intro: "The New Cardiff Museum is about to play host to a grand exhibit of \"Earth That Was\" artifacts, the centerpiece of which is the Crown Jewels of old England. Endeavor to swap a quality counterfiet for the \"Shiny Hat\" and make off with the real one leaving no one the wiser."
  },

  // --- 10th Anniversary Expansion ---
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
      forbiddenStartingContact: 'Niska'
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

  // --- Still Flying Expansion ---
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

  // --- Blue Sun Expansion ---
  {
    title: "Any Port In A Storm",
    intro: "The Alliance has got a burr in their collective britches: patrols have been tripled and strict enforcement of penel codes is in effect. Times such as these can make for strange bedfellows and safe harbor is where you can find it. Any port in a storm...",
    requiredExpansion: 'blue'
  },
  {
    title: "The Great Recession",
    intro: "Life on the raggedy edge can be a hard slog. Paying work is previous enough in the good times, but when things get lean the competition for jobs can get downright unsavory. Make hay while the sun shines or get left in the dust, beggin' for scraps.",
    requiredExpansion: 'blue'
  },

  // --- Kalidasa Expansion ---
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

  // --- Pirates & Bounty Hunters Expansion ---
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

  // --- Crime & Punishment Expansion ---
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
      allowedStartingContacts: ['Patience', 'Badger', 'Niska', 'Mr. Universe', 'Fanty & Mingo']
    }
  },

  // --- Jetwash Expansion ---
  {
    title: "Down And Out",
    intro: "Once your reputation's been blemished, it's hard to get right with the right people. Compete with the other riffraff for what scraps your employers are willing to risk on the likes of you. Nothing to do but suck it up and try to prove yourself worthy.",
    setupDescription: "Create shared hand of Inactive Jobs. Start with Warrant Token.",
    requiredExpansion: 'jetwash',
    setupConfig: {
      sharedHandSetup: true,
      startWithWarrant: true
    }
  },

  // --- Esmerelda Expansion ---
  {
    title: "Where The Wind Takes Us",
    intro: "The winds of fate can be fickle, blowing this way and that with no regard whatsoever for a captain's plans... Now, you might could rage through the storm and buck those headwinds, trying to hold true to your intended course. The wise captain knows to ride the currents and take opportunities as they come. After the storm, will you be the broken ginkgo tree or the leaf blown to new and greener pastures?",
    setupDescription: "Place Goal Tokens at destination sectors instead of keeping starting jobs.",
    requiredExpansion: 'esmerelda',
    setupConfig: {
      jobDrawMode: 'wind_takes_us'
    }
  },

  // --- Black Market Expansion ---
  {
    title: "The Old Man And The Dragons",
    intro: "The Seven Dragon Kings are preparing to go to war with Adelai Niska, but their war would be bad for your business. Figure out where the Tong leaders are meeting, and maybe you can convince both sides to come to an arrangement.",
    requiredExpansion: 'black_market'
  },

  // --- Community Content ---
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: 'community'
  },
  {
    title: "Double Duty",
    intro: "Sometimes, It's best to work under the radar and quiet-like. Fanty and Mingo have goods and folks in need of moving throughout the 'Verse. Use your connections with others to keep the twins' names out of the picture. Do a good enough job, and you might become their new favorite captain.",
    requiredExpansion: 'community'
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    setupDescription: "Remove River Tam from play.",
    requiredExpansion: 'community',
    setupConfig: {
      removeRiver: true
    }
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derilict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
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
      forbiddenStartingContact: 'Harken'
    }
  },
  {
    title: "Reap The Whirlwind",
    intro: "Word is, the Alliance has been hiding all manner of dirty secrets out Himinbjorg way. Convince the Dust Devils you're dangerous -- or desperate -- enough for them to come out of hiding and join forces. But hurry: the upcoming Unification Day Summit seems like the perfect time to let the truth out.",
    requiredExpansion: 'community'
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    setupDescription: "Remove Amnon Duul Jobs. Start in border of Murphy.",
    requiredExpansion: 'community',
    setupConfig: {
      forbiddenStartingContact: 'Amnon Duul',
      startAtSector: 'Border of Murphy'
    }
  },
  {
    title: "The Ghost Rock Run",
    intro: 'On Anson\'s World the Sweetrock Mining Co. has discovered a rare mineral called "Ghost Rock". Will you handle the run, or sell it to the highest bidder?',
    requiredExpansion: 'community'
  },
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmits.",
    setupDescription: "Remove all Job Decks. High-value cargo sales.",
    requiredExpansion: 'community',
    setupConfig: {
      jobDrawMode: 'no_jobs',
      removeJobDecks: true
    }
  },
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Allaice a black eye?",
    setupDescription: "Requires Blue Sun Expansion.",
    requiredExpansion: 'community',
    additionalRequirements: ['blue']
  },
  {
    title: "Trash Part Deux",
    intro: "Have MRP (Mrs Reynolds persona) steal and sell the latest Firefly story.",
    requiredExpansion: 'community'
  }
];

export const SETUP_CONTENT: ContentMap = {
  // Core Steps
  C1: { type: 'core', id: 'core-1', title: "Nav Decks" },
  C2: { type: 'core', id: 'core-2', title: "Alliance & Reaver Ships" },
  C3: { type: 'core', id: 'core-3', title: "Choose Ships & Leaders" },
  C4: { type: 'core', id: 'core-4', title: "Goal of the Game" },
  C5: { type: 'core', id: 'core-5', title: "Starting Supplies" },
  C6: { type: 'core', id: 'core-6', title: "Starting Jobs" },
  C_PRIME: { type: 'core', id: 'core-prime', title: "Priming The Pump" },

  // Distinct Dynamic Steps (Cannot be merged easily)
  D_RIM_JOBS: { type: 'dynamic', elementId: 'D_RIM_JOBS', title: "Rim Space Jobs" },
  D_TIME_LIMIT: { type: 'dynamic', elementId: 'D_TIME_LIMIT', title: "Only So Much Time" },
  D_SHUTTLE: { type: 'dynamic', elementId: 'D_SHUTTLE', title: "Choose Shuttles" },
  D_HAVEN_DRAFT: { type: 'dynamic', elementId: 'D_HAVEN_DRAFT', title: "Choose Leaders, Havens & Ships" },
  D_BC_CAPITOL: { type: 'dynamic', elementId: 'D_BC_CAPITOL', title: "Starting Capitol" },
  D_LOCAL_HEROES: { type: 'dynamic', elementId: 'D_LOCAL_HEROES', title: "Local Heroes" },
  D_ALLIANCE_ALERT: { type: 'dynamic', elementId: 'D_ALLIANCE_ALERT', title: "Alliance Alert Cards" },
  D_PRESSURES_HIGH: { type: 'dynamic', elementId: 'D_PRESSURES_HIGH', title: "The Pressure's High" },
  D_STRIP_MINING: { type: 'dynamic', elementId: 'D_STRIP_MINING', title: "Strip Mining: Starting Cards" },
};

export const STEP_QUOTES: { [key: string]: { text: string; author: string } } = {
  'core-1': { text: "Burn the land and boil the sea, you can't take the sky from me.", author: "Ballad of Serenity" },
  'core-2': { text: "If they take the ship, they'll rape us to death, eat our flesh, and sew our skins into their clothing. And if we're very, very lucky, they'll do it in that order.", author: "Zoë Washburne" },
  'core-3': { text: "Love. You can learn all the math in the 'Verse, but you take a boat in the air that you don't love, she'll shake you off just as sure as the turn of the worlds.", author: "Mal Reynolds" },
  'core-4': { text: "We have done the impossible, and that makes us mighty.", author: "Mal Reynolds" },
  'core-5': { text: "Ten percent of nothin' is... let me do the math here... nothin' into nothin', carry the nothin'...", author: "Jayne Cobb" },
  'core-6': { text: "I do the job, and then I get paid.", author: "Mal Reynolds" },
  'core-prime': { text: "Everything's shiny, Cap'n. Not to fret.", author: "Kaylee Frye" },
  'D_RIM_JOBS': { text: "We're in the raggedy edge. Don't push me, and I won't push you.", author: "Mal Reynolds" },
  'D_TIME_LIMIT': { text: "Time for some thrilling heroics.", author: "Jayne Cobb" },
  'D_SHUTTLE': { text: "It's a short range transport.", author: "Manual" },
  'D_HAVEN_DRAFT': { text: "Safe haven. That's a myth.", author: "Book" },
  'D_BC_CAPITOL': { text: "Money tells.", author: "Niska" },
  'D_LOCAL_HEROES': { text: "Big damn heroes, sir.", author: "Zoë Washburne" },
  'D_ALLIANCE_ALERT': { text: "Surely there must be some Alliance rule.", author: "Simon Tam" },
  'D_PRESSURES_HIGH': { text: "Things go wrong.", author: "Mal Reynolds" },
  'D_STRIP_MINING': { text: "You want a slanging match, we can have a slanging match.", author: "Badger" },
};

// Standard Flow Template
const STANDARD_STEPS = [
  { id: 'C1' }, { id: 'C2' }, { id: 'C3' }, { id: 'C4' }, { id: 'C5' }, { id: 'C6' }, { id: 'C_PRIME' }
];

export const SCENARIOS: ScenarioDef[] = [
  // 1. Standard (Base Game)
  {
    id: "Standard",
    label: "Standard Game Setup",
    description: "The classic Firefly experience. Standard deck building, starting resources, and job allocation.",
    steps: STANDARD_STEPS
  },

  // 2. 10th Anniversary
  {
    id: "AintAllButtonsAndCharts",
    label: "Ain't All Buttons & Charts",
    description: "Players draft Shuttles from the supply deck. Specific starting jobs from Amnon Duul, Lord Harrow, and Magistrate Higgins.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'D_SHUTTLE' }, // 5. Shuttles
      { id: 'C5' }, // 6. Supplies
      { id: 'C6', overrides: { buttonsJobMode: true } }, // 7. Jobs (Specific Contacts)
      { id: 'C_PRIME' } // 8. Prime
    ]
  },
  {
    id: "HomeSweetHaven",
    label: "Home Sweet Haven",
    description: "Draft Haven tokens to establish a home base. Ships start at Havens. Includes 'Local Heroes' bonuses.",
    requiredExpansion: 'tenth',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Uses Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'D_HAVEN_DRAFT' }, // 4. Leaders, Havens & Ships
      { id: 'C5' }, // 5. Supplies
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME' }, // 7. Prime
      { id: 'D_LOCAL_HEROES' } // 8. Local Heroes
    ]
  },

  // 3. Blue Sun Expansion
  { 
    id: "AwfulCrowdedInMySky", 
    label: "Awful Crowded In My Sky", 
    description: "Alert Tokens are placed in every sector. Reshuffle cards are active. Specific starting jobs.",
    requiredExpansion: 'blue', 
    steps: [
      { id: 'C1', overrides: { forceReshuffle: true } }, // 1. Nav (Force Reshuffle)
      { id: 'C3' }, // 2. Ships & Leaders (Order Swapped)
      { id: 'C2', overrides: { awfulCrowdedAllianceMode: true } }, // 3. Alliance & Reaver (Alert Tokens rule)
      { id: 'C4' }, // 4. Goal
      { id: 'C5' }, // 5. Supplies
      { id: 'C6', overrides: { awfulJobMode: true } }, // 6. Jobs
      { id: 'C_PRIME' } // 7. Prime
    ]
  },

  // 4. Kalidasa Expansion
  {
    id: "TheRimsTheThing",
    label: "The Rim's The Thing",
    description: "Focuses on the outer planets. Uses only Border Nav cards and restricts jobs to Blue Sun and Kalidasa contacts.",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_RIM_JOBS' },
      { id: 'C1', overrides: { rimNavMode: true } }, // Replaces D_RIM_NAV
      { id: 'C2' }, { id: 'C3' }, { id: 'C4' }, { id: 'C5' },
      { id: 'C6', overrides: { rimJobMode: true } },
      { id: 'C_PRIME' }
    ]
  },
  {
    id: "TimesNotOnOurSide",
    label: "Time's Not On Our Side",
    description: "A race against time. Uses Disgruntled tokens as a game timer. Nav decks are harder (Reshuffle included).",
    requiredExpansion: 'kalidasa',
    steps: [
      { id: 'D_TIME_LIMIT' },
      { id: 'C1', overrides: { forceReshuffle: true } }, // Enforce Reshuffle rules
      { id: 'C3' }, // Choose Ships & Leaders (Swapped with C2)
      { id: 'C2' }, // Alliance & Reaver (Swapped with C3)
      { id: 'C4' }, { id: 'C5' }, 
      { id: 'C6', overrides: { timesJobMode: true } }, 
      { id: 'C_PRIME' }
    ]
  },

  // 5. Pirates & Bounty Hunters
  {
    id: "AllianceHighAlert",
    label: "Alliance High Alert",
    description: "Starts with an Alliance Alert card in play. Harken is unavailable for starting jobs.",
    requiredExpansion: 'pirates',
    iconOverride: 'crime',
    steps: [
      { id: 'D_ALLIANCE_ALERT' }, // 1. Alert Cards
      { id: 'C1' }, // 2. Nav
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'C4' }, // 5. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6', overrides: { allianceHighAlertJobMode: true } }, // 7. Jobs (No Harken)
      { id: 'C_PRIME' } // 8. Prime
    ]
  },

  // 6. Crime & Punishment
  { 
    id: "ClearerSkiesBetterDays", 
    label: "Clearer Skies, Better Days", 
    description: "Features 'Full Burn' mechanic for risky travel. No Alert Tokens are used.",
    requiredExpansion: 'crime',
    steps: [
      { id: 'C1', overrides: { forceReshuffle: true, clearerSkiesNavMode: true } }, // 1. Nav (Full Burn Rule)
      { id: 'C2', overrides: { noAlertTokens: true } }, // 2. Alliance (No Alert Tokens)
      { id: 'C3' }, // 3. Ships
      { id: 'C4' }, // 4. Goal
      { id: 'C5' }, // 5. Supplies
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME' } // 7. Prime
    ]
  },

  // 7. Jetwash
  {
    id: "TheBrowncoatWay",
    label: "The Browncoat Way",
    description: "A harder economy. Ships must be purchased with starting cash. No free fuel/parts. No starting jobs.",
    requiredExpansion: 'jetwash',
    steps: [
      { id: 'C4' }, // 1. Goal (First!)
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (With overrides)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'D_BC_CAPITOL', overrides: { startingCredits: 12000 } }, // 4. Starting Capitol (Override base credits)
      { id: 'C3', overrides: { browncoatDraftMode: true } }, // 5. Ships
      { id: 'C6', overrides: { browncoatJobMode: true } }, // 6. Jobs (With overrides)
      { id: 'C_PRIME' } // 7. Priming
    ]
  },

  // 8. Esmerelda
  {
    id: "TheBlitz",
    label: "The Blitz",
    description: "Standard supplies are replaced by 'Strip Mining' (drafting cards). Priming the Pump discards double the cards.",
    requiredExpansion: 'esmerelda',
    steps: [
      { id: 'C4' }, // 1. Goal
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3' }, // 4. Ships
      { id: 'D_STRIP_MINING' }, // 5. Strip Mining (Replaces Supplies)
      { id: 'C6' }, // 6. Jobs
      { id: 'C_PRIME', overrides: { blitzPrimeMode: true } } // 7. Prime (Double Dip)
    ]
  },

  // 9. Still Flying (No scenarios defined)

  // 10. Black Market
  { 
    id: "TheHeatIsOn", 
    label: "The Heat Is On", 
    description: "Starts with an Alliance Alert card. Leaders begin play with a Wanted Token. Wanted tokens accumulate on leaders.",
    requiredExpansion: 'black_market',
    steps: [
      { id: 'D_PRESSURES_HIGH' }, // 1. The Pressure's High
      { id: 'C1', overrides: { browncoatNavMode: true } }, // 2. Nav (Shuffle Ships rule)
      { id: 'C2' }, // 3. Alliance & Reaver
      { id: 'C3', overrides: { wantedLeaderMode: true } }, // 4. Ships & Leaders (Wanted Tokens)
      { id: 'C4' }, // 5. Goal
      { id: 'C5' }, // 6. Supplies
      { id: 'C6' }, // 7. Jobs
      { id: 'C_PRIME' } // 8. Prime
    ] 
  }
];
