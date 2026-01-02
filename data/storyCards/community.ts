import { StoryCardDef, SetupRule } from '../../types/index';
import { CONTACT_NAMES, SETUP_CARD_IDS } from '../ids';

// Helper to avoid repeating source info
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
  return rules.map(rule => ({
    ...rule,
    source: 'story',
    sourceName,
  })) as SetupRule[];
};

export const COMMUNITY_STORIES: StoryCardDef[] = [
  {
    title: "A New Leaf",
    intro: "You're a Captain who's tire dof the smuggling life. Also, recent inflation spikes in the 'Verse are making ship maintenance costs too ruttin' expensive. You're considering a government land grab program that helps people get settled on planets in Alliance Space. The program has only one slot left to claim a free piece of land.",
    additionalRequirements: [
      "blue",
      "kalidasa",
      "pirates"
    ],
    setupDescription: "When placing ships, each player also places a Haven token on any non-supply planet within Alliance Space, except for Londinium. Only one Haven per planet. Start with $10,000. Buy a small ship (less than 10 cargo hold). Buy parts/fuel at listed price. ",
    sourceUrl: "https://boardgamegeek.com/thread/3092841/a-new-leaf-story-card-using-fan-made-ships",
    requiredExpansion: "community",
    rating: 1
  },
  {
    title: "Aimin' To Misbehave",
    intro: "A big time crime boss has retired to a life of ease and comfort, leaving behind a nice little power vacuum. If you want to take his place you'll need money and business parthers. Shady business oartners to be exact. The shadier the better.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3077380/aimin-to-misbehave",
    setupDescription: "Remove all legal jobs from play.",
    rules: createStoryRules("Aimin' To Misbehave", [
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Deck Modification',
          content: ["Remove all legal jobs from play."]
        }
      }
    ])
  },
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/103321/firefly-goal-bank-job-jpeg-and-psd",
    rating: 3,
  },
  {
    title: "The Battle of Serenity Valley (PvP)",
    isPvP: true,
    intro: "Serenity Valley was a valley located on Hera; it was mainly sparse and rocky with little vegetation. The valley was famous for being the location of the Battle of Serenity Valley—one of the bloodiest battles of the entire Unification War. Due to Hera's strategic positioning, taking the planet was a key to winning the war, and Serenity Valley became the turning point of the entire conflict.",
    setupDescription: "Take all Crew cards with \"Fight\" skill and all gear cards with \"Fight\" skill, add crew compartment ship upgrades and put them all in one deck; Shuffle. Take all Misbehave cards with \"Fight\" skill checks; Shuffle. Remove half \"Keep Flying\" cards from Alliance and Border decks. Other cards won't be used. Players evenly pick Alliance or Independents (Browncoats). Deal 3 crew/gear to each player (disregard warrants). Place ships in appropriate space. Alliance to inner planets, Browncoats to Border Planets.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1099553/story-card-the-battle-of-serenity-valley-pvp",
    rating: 0,
  },
  {
    title: "Black Market Beagles",
    intro: "One too many loads of smuggled cargo (of the live variety) has really started to stink up the place so the crew has opted to transport something smaller, more specifically with smaller droppings.",
    setupDescription: "Start out with 1 Cry Baby on the ship",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1098646/article/14445829#14445829",
    rating: 1,
    rules: createStoryRules("Black Market Beagles", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Starting Gear',
          content: ["Each player begins the game with 1 ", { type: 'strong', content: 'Cry Baby' }, " on their ship."]
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
  },
  {
    title: "Doing Good Works",
    intro: "A plague has broken out on the border worlds. A natural disease? Leftover bioweapons from the Unification War? Or an attempt by the Alliance to exterminate those whoresist its rule? No one knows. But word's gotten out that the Alliance has a cure for it--and they're not sharing.",
    setupDescription: "Players starting on a Supply world may choose three cards from that Supply deck. Crew are hired for free. Other cards must be paid for at half price from the player's starting cash. Corbin and Marco's half-price abilities apply--round the price of each item up to the nearest $100. More than one player may start on the same world. Additional players must wait until the previous player has selected three cards before taking their selections.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1240655/doing-good-works-soloco-op-scenario",
    rating: 0,
    rules: createStoryRules("Doing Good Works", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Starting Procedure',
          content: [
            { type: 'list', items: [
              ["Players starting on a Supply world may choose three cards from that Supply deck."],
              ["Crew are hired for free. Other cards must be paid for at half price from the player's starting cash."],
              ["Corbin and Marco's half-price abilities apply (round up to nearest $100)."],
              ["More than one player may start on the same world."],
              ["Additional players must wait for the previous player to finish before selecting their cards."]
            ]}
          ]
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
  },
  {
    title: "Fruity Oat Bar",
    intro: "One of your crew was once used in an experiment by the Alliance. After escaping and joining your crew, they are now wanted. Before you are caught, you decide to get to the bottom of things, and discover the secret that the Alliance wants kept secret.",
    setupDescription: "After choosing your Leader, search for any Wanted crew from any deck and add them to your crew. You must start in Alliance Space.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1045716/article/13603393#13603393",
    rating: 1,
    rules: createStoryRules("Fruity Oat Bar", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Special Crew & Placement',
          content: [
            { type: 'list', items: [
              ["After choosing your Leader, search for any ", { type: 'strong', content: 'Wanted crew' }, " from any deck and add them to your crew."],
              ["You must start in Alliance Space."]
            ]}
          ]
        }
      }
    ])
  },
  {
    title: "Gentleman's Agreement",
    intro: "Until now, the big players in the 'verse have agreed to keep to their own back yards, but that's about to change. Badger has received word that Adelai Niska has grown too big for his Skyplex around Ezra, and is branching out. The rumor is that Niska is setting up shop in Badger's territory. This doesn't sit well with Badger.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1101220/story-card-gentlemans-agreement",
    rating: 0,
  },
  {
    title: "The Ghost Rock Run",
    intro: "On Anson's World the Sweetrock Mining Co. has discovered a rare mineral called \"Ghost Rock\". Will you handle the run, or sell it to the highest bidder?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/105342/custom-story-card-the-ghost-rock-run",
    rating: 2,
  },
  {
    title: "Going Legit",
    intro: "With the strong arm of the Alliance growing ever string, there's gettin' to be less and less room for naughty men like us to slip about... I head Blue Sun's in need of a legitimate transport company that can get government goods to the people what need 'em.",
    setupDescription: "A PORT OF OPERATION: While choosing starting positions, players must choose a planetary sector within the Blue Sun system that is not a Contact od Supply sector. Mark the sector with a Haven token. Leave unused ships out of the box as a \"For Sale\" pile.",
    sourceUrl: "https://boardgamegeek.com/thread/3560944/going-legit-story-card",
    requiredExpansion: "community"
  },
  {
    title: "The Good Guys",
    intro: " ",
    setupDescription: "Only MORAL leaders can be chosen. Exclude Niska from Starting Jobs. Immoral Jobs cannot be accepted. Remove Crow from the game.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1624739/story-card-the-good-guys",
    rules: createStoryRules("The Good Guys", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA }
    ]),
    rating: 1
  },
  {
    title: "The Good, The Bad, and The Ugly",
    intro: "To survive the 'Verse, you must walk among saints, trade with devils, and strike a deal with the depraved. Prove you can master every side of the law.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/2688034/the-good-the-bad-and-the-ugly-story-card",
    rating: 2
  },
  {
    title: "The Great Escape",
    intro: "The Alliance has been busy. Rounded up a few of our nearest and dearest. We aim to right that wrong, and see about ending that incarceration.",
    requiredExpansion: "community",
    isCoOp: true,
    sourceUrl: "https://boardgamegeek.com/thread/2717955/article/38380038#38380038"
  },
  {
    title: "Honorably Dishonorable Men",
    intro: "Care to press your luck? All them shiny things in the core sure could be of some use to folks out on the Rim.",
    setupDescription: "Place 8 contraband tokens on each of the following sectors in Alliance Space: Londonium, Bernadette, Liann Jiun, Sihnon, Gonghe, and Bellerophon. Use 20 Disgruntled tokens as the game length timer. The player in first position discards 1 Disgruntled token at the start of each round. After the last timer token is discarded, all players take their final turn.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/3602682/honorably-dishonorable-men"
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/103582/goal-hospital-rescue",
    rules: createStoryRules("Hospital Rescue", [
      { type: 'addFlag', flag: 'removeRiver' }
    ]),
    rating: 2,
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    requiredExpansion: "community",
    rules: createStoryRules("How It All Started", [
      { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, description: "Story Override" },
      { type: 'modifyResource', resource: 'fuel', method: 'set', value: 2, description: "Story Override" },
      { type: 'modifyResource', resource: 'parts', method: 'set', value: 2, description: "Story Override" },
      { type: 'addFlag', flag: 'nandiCrewDiscount' }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/186593/where-it-all-started-story-card"
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4434522",
    rules: createStoryRules("It Ain't Easy Goin' Legit", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, description: "Start with 2 Warrants." },
      { type: 'addFlag', flag: 'allianceSpaceOffLimits' },
      { type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }
    ]),
    rating: 2,
  },
  {
    title: "A Jubilant Victory",
    intro: "10,000 Credits will put a mighty fine jungle in anyone's pocket. If that pocket belongs to you, best keep a watchful eye out for Jubal Early and his intentions.",
    requiredExpansion: "aces_eights",
    additionalRequirements: ["local_color"],
    rating: 1,
    sourceUrl: "https://boardgamegeek.com/filepage/235439/storycard-a-jubilant-victory",
    setupDescription: "Just anther day in the 'Verse: Players use Firefly-class ships equipped with standard core drives and begin at their Havens with one Warrant. Jubal Early uses the Interceptor, and uses a D8 die for movement, starting from Meridian.",
    rules: createStoryRules("A Jubilant Victory", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Story Override" }
    ])
  },
  {
    title: "Laying Down the Law",
    intro: "Alliance brass has handed down some flush to the local magistrates to round up some old warrants and they're hiring new law men who can prove they can get the job done.",
    setupDescription: "Laying Low: Wanted crew may not be hired.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1093761/article/14404723#14404723",
    rating: 1
  },
  {
    title: "The Long Haul",
    intro: "Anson's looking for a top notch crew for a really big job. He doesn't just hand out jobs to anyone though. Can you prove yourself capable, secure the job, and make a fortune?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1107085/the-long-haul-idea-for-an-unofficial-story-card",
    rating: 1
  },
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/2277037/upstarter",
    rules: createStoryRules("The Magnificent Crew", [
      { type: 'setJobMode', mode: 'no_jobs' },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Gameplay Note',
          content: ['This story features special high-value cargo sales rules that apply during gameplay.']
        }
      }
    ]),
    rating: 2
  },
  {
    title: "Mark Of A Great Captain",
    intro: "If you don't much care for the wellbeing of your crew, your crew won't care much for you. Do what you can to keep your chosen family together. Without them, who's gonna keep you company when you're floating in the black?",
    setupDescription: "Each player chooses a Moral Leader. After all players collect their Starting Supplies, each player pays for an Expanded Crew Quarters ($600) and can now hold 3 more crew. Hiring Crew: Starting with 1st player, each player searches for and hires a crew card from any supply deck of their choice. Continue rounds of hiring crew until all player ships have a full set of crew on their ship. Remove all other crew cards from play. You may only use the crew you start with. 7 Disgruntled tokens will be used as a timer that triggers the arrest of 4 crew members from each ship. First player will discard 1 token at the start of each round of play.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/286230/mark-of-a-great-captain-story-card",
    rating: 2
  },
  {
    title: "Master Of All",
    intro: "The 'Verse is a profitable place for a crew that can rise to any occasion. Be the first to prove their crew is ready for anything... without attracting the law.",
    setupDescription: "In turn order, choose an empty planet with a Contact as a starting point. Draw only 3 of that contact's jobs for your Starting Jobs. Start with an Alliance Alert in play and replace it whenever a Goal Token is won or when any RESHUFFLE card is drawn.",
    sourceUrl: "https://boardgamegeek.com/thread/2941994/master-of-all-story-card",
    requiredExpansion: "community",
    rules: createStoryRules("Master Of All", [
      { type: 'addFlag', flag: 'startWithAlertCard' }
    ])
  },
  {
    title: "Miranda",
    intro: "You suspect that there is a hidden message in the Fruity Oaty Bars advertisement recently broadcast by the Alliance network. Decoding it may reveal something of value or maybe it's just a new form of subliminal advertising.",
    setupDescription: "Place your Firefly on a supply world to begin the game. Draw 1 starting crew from any deck by flipping the draw pile and taking the first named character that is revealed.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1135128/article/1512332#1512332",
    rating: 2
  },
  {
    title: "Miranda's Secret",
    intro: "So you have heard of Miranda. The forgotton planet deep inside the Reaver space. There is some secret it holds that can change the Alliance position in the Verse. Are you bold enough to ventur there and try to find it?",
    additionalRequirements: [
      "blue",
      "pirates"
    ],
    sourceUrl: "https://boardgamegeek.com/filepage/110153/story-card-mirandas-secret",
    requiredExpansion: "community",
    rating: 2
  },
  {
    title: "My Fellow Browncoats",
    isCoOp: true,
    intro: "The crew of Serenity needs your help. They've been captured by the Alliance and sent to unknown prison camps all over the 'Verse. For a price, Badger might let you in on a little secret.",
    rules: createStoryRules("My Fellow Browncoats", [
      { 
        type: 'addSpecialRule', 
        category: 'goal',
        rule: {
          title: 'Rescue Mission Setup',
          content: [
            { type: 'list', items: [
              ['Place ', { type: 'strong', content: 'Serenity' }, ' on Shadow, Murphy as the drop-off point for rescued crew.'],
              ['Shuffle Malcolm, Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River together.'],
              ['Place them face down as the ', { type: 'strong', content: '"Prisoner Deck"' }, '. They are your goals for this game.']
            ]}
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/3282832/my-fellow-browncoats-remastered-into-a-solo-and-co",
    requiredExpansion: "community"
  },
  {
    title: "My Number One Guy",
    intro: " ",
    isPvP: true,
    sourceUrl: "https://boardgamegeek.com/thread/1076645/story-card-my-number-one-guy-player-vs-player",
    setupDescription: "Draw three starting jobs from a single contact, and two other jobs from any other contacts. You may only keep 3 jobs.",
    rating: 0,
    requiredExpansion: "community",
    rules: createStoryRules("My Number One Guy", [
      { type: 'addFlag', flag: 'customJobDraw' }
    ])
  },
  {
    title: "New Heroes of Canton",
    intro: "Them Mudders got the shortest end of a stick ever been offered. How's about we offer 'em a better stick.",
    additionalRequirements: [
      "kalidasa"
    ],    isCoOp: true,
    goals: [
      {
        title: "Easy",
        description: "Use 26 Disgruntled tokens as the game timer."
      },
      {
        title: "Medium",
        description: "Use 21 Disgruntled tokens as the game timer."
      },
      {
        title: "Hard",
        description: "Use 17 Disgruntled tokens as the game timer."
      }
    ],
    setupDescription: "Pull all Mudders from Supply decks. Shuffle together the Foreman plus 3 Mudders per player. Place them face up. If the Foreman is on top after a shuffle, reshuffle. ",
    sourceUrl: "https://boardgamegeek.com/filepage/294565/new-heroes-of-canton-co-op-story-card",
    requiredExpansion: "community"
  },
  {
    title: "Old Friends And New",
    intro: "You thought he was dead, but now you know your old War buddy is being held in a max-security prison on Valentine. You'll need the help of some new friends to unlock the Cortex master identity files, then mingle with the high and mighty to get the prison plans, and finally it's off to the rescue!",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1119976/story-card-old-friends-and-new",
    rating: 2
  },
  {
    title: "Rags To Riches",
    intro: " ",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/108288/rags-to-riches",
    rating: 0
  },
  {
    title: "Return to Sturges",
    intro: "The Barrle of Sturges was the shortest and bloodiest battle of the Unification War. Badger has broadcast news that there is a hoard of Alliance treasure left in the wreckage of this space battle to a few \"trusted friends\". The race is on to get the information, equipment and speed to get there first, find the goods and get clear before the Alliance shows up to claim its property!",
    setupDescription: "Captains Nandi and Atherton may not be used by any player.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/125866/return-to-sturges-a-firefly-mission",
    rules: createStoryRules("Return to Sturges", [
      { 
        type: 'addSpecialRule', 
        category: 'draft',
        rule: {
          title: 'Leader Restriction',
          content: ["Captains Nandi and Atherton may not be used by any player."]
        }
      }
    ])
  },
  {
    title: "River's Run 1v1",
    intro: "The Alliance had her in that institution for a purpose, whatever it was, and they will want her back.",
    isPvP: true,
    additionalRequirements: [
      "blue"
    ],
    setupDescription: "Player 1 will be the Captain of Serenity with Malcolm, Zoë, Wash, Kaylee, Jayne, Inara, Book, Simon, and River. Serenity starts with the Xùnsù Whisper X1 from Meridian, an Expanded Crew Quarters from Osiris, and an EVA Suit from Space Bazaar for River. No Starting Jobs. Player 2 is a Bounty Hunter and chooses the Setup card. No Starting Jobs. Remove all Serenity's crew from the Bounty deck, excluding River Tam. The Bounty deck is placed face up and all bounties are active.",
    sourceUrl: "https://boardgamegeek.com/thread/3454248/rivers-run-1v1",
    requiredExpansion: "community"
  },
  {
    title: "Round the 'Verse in \"80 Days\"",
    intro: "Mr. Big Bucks, who lives next to the Tams in Sihnon, has two 19-year-old kids. They are finishing a semester of school at Osiris. Mr. Big Bucks wants the kids to experience the universe. He's looking for someone to show them around the universe and return them healthily. You can put the kids to work to some extent, but must return them healthy. He'll pay $20,000 when done.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/9306408/pmw57"
  },
  {
    title: "Save River Tam",
    intro: "River Tam is being held in secure, secret government facility. Beloved sister, daughter of the ridiculously wealthy, and super useful government secret weapon. Whatever your reasons, you are on a mission to break River out.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1066622/story-card-save-river-tam",
    rules: createStoryRules("Save River Tam", [
      {
        type: 'addSpecialRule',
        category: 'prime',
        rule: {
          title: 'Missing Person',
          content: ['Remove ', { type: 'strong', content: 'River Tam' }, ' from play before shuffling the Supply Decks.']
        }
      }
    ]),
    rating: 1
  },
  {
    title: "Saving Pirate Ryan",
    intro: "You know, there's a certain motto. A creed among folks like us. You may have heard it: \"Leave no man behind.\" Wash - Firefy Episide 10 - War Stories",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1536695/article/22110859#22110859",
    rating: 1
  },
  {
    title: "Scavengers",
    intro: "This game only uses dice, cash, Leader cards, Supply decks, cargo, and contraband. Everything else stays in the box. A scavengers goal is simple, Find a Crew, Attack Another Crew, Keep Trying.",
    isPvP: true,
    setupDescription: "Shuffle all Supply decks and lay them face down in the middle of thet able with the banks cash. All players start with $10,000 and 10 cargo. Roll for first player. First player chooses a Leader card then passes the Leader deck to the next player until each player has a Leader card.",
    sourceUrl: "https://boardgamegeek.com/thread/3114859/scavenger-card-game-story-card",
    requiredExpansion: "community",
    rating: 1
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/100497/shadows-over-duul-new-goal-reupload",
    rules: createStoryRules("Shadows Over Duul", [
      { type: 'forbidContact', contact: CONTACT_NAMES.AMNON_DUUL },
      { type: 'setShipPlacement', location: 'border_of_murphy' }
    ]),
    rating: 2,
  },
  {
    title: "Shiny New Year 25 - Protect Or Plunder",
    intro: "An affluent governor from Osiris is hosting a grand New Year's celebration--a wedding for his daughter aboard the luxury linder, Shiny New Year. The event has drawn attention from both well-meaning guardians and those with darker intentions. Which one are you? Protector or plunderer?",
    additionalRequirements: [
      "pirates"
    ],
    setupDescription: "After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks.",
    sourceUrl: "https://boardgamegeek.com/thread/3405568/article/45332549#45332549",
    requiredExpansion: "community",
    rules: createStoryRules("Shiny New Year 25 - Protect Or Plunder", [
      {
        type: 'addSpecialRule',
        category: 'jobs',
        rule: {
          title: 'Deck Modification',
          content: ["After taking starting jobs, pull all remaining Piracy Jobs from the Contact Decks and place them in their discard piles. Reshuffle the Contact Decks."]
        }
      }
    ])
  },
  {
    title: "Slaying The Dragon",
    playerCount: 2,
    isCoOp: true,
    intro: "Adelai Niska has been lord of the underworld for as long as anyone can remember. Shu-ki, the tong boss of Gonghe, has long suffered under Niska's yoke. After being publicly shamed by Niska at a meeting of crime-bosses, an enraged Shu-ki has decided to bring Niska down. He has a plan - Operation Dragon - but the job is so daunting that it requires two crews to have any hope of success. Can two Firefly captains bring down the most feared criminal boss in the 'Verse?",
    requiredExpansion: "community",
    rules: createStoryRules("Slaying The Dragon", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      { type: 'modifyPrime', modifier: { add: 2 } },
      { 
        type: 'addSpecialRule', 
        category: 'prime',
        rule: {
          title: 'Priming Bonus',
          content: [{ type: 'strong', content: 'Shu-ki is greasing the rails:' }, ' Turn up ', { type: 'strong', content: '2 additional cards' }, ' from each deck when Priming the Pump.']
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Co-Op & Countdown',
          content: [
            { type: 'paragraph', content: [{ type: 'strong', content: '2-Player Co-Op:' }, " Both players win or lose together."] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Countdown:' }, " Stack ", { type: 'strong', content: '16 Disgruntled Tokens' }, ". At the start of each player's turn, discard one token. The game ends when the last token is discarded."] },
          ]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/1049020/article/13686225#13686225"
  },
  {
    title: "They're Part Of My Crew",
    intro: "Mal's last job went south in a bad way. As a result, some of the crew was captured by the Alliance and sent to unknown prison camps all over the 'Verse. For a price, Badger might let you in on a little secret.",
    isSolo: true,
    setupDescription: "Use the Standard Set Up card with Malcolm as your Leader and Serenity as your ship. Take Jayne, Kaylee, and River as your starting crew and an Expanded Crew Quarters from Osiris for your ship. Shuffle Zoe, Wash, Inara, Book, and Simon, together. Place them face down as the \"Prisoner Deck\". They are your goals for this game.",
    sourceUrl: "https://boardgamegeek.com/thread/3282832/my-fellow-browncoats-remastered-into-a-solo-and-co",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD
  },
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Alliance a black eye?",
    setupDescription: "Requires Blue Sun Expansion.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4894306/pmw57",
    additionalRequirements: ["blue"]
  },
  {
    title: "Trash Part Deux",
    intro: "Have MRP (Mrs Reynolds persona) steal and sell the latest Firefly story.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/164355/story-card-trash-part-deux"
  },
  {
    title: "Unification Day",
    intro: "Unification Day is fast approaching and you have plans to cause all sorts of mischief, but what better way to do it than right under the nose of the Alliance? You just might get more than a little pay back out of it.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1083899/unification-day-alliance-oriented-story-card",
    rating: 1
  },
  {
    title: "Wild Cards",
    intro: "Prove you're the best - r luckiest - crew around by collecting tales of your exploits.",
    requiredExpansion: "aces_eights",
    sourceUrl: "https://boardgamegeek.com/thread/3281169/article/47090467#47090467",
    rating: 3
  },
  {
    title: "X Marks The Spot",
    intro: "Pirate Captain Medina's legendary buried treasure was forever lost when he split his treasure map ensuring none could find it. Who will be first to unearth his fabled booty?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/2954291/article/41076542#41076542",
    rating: 2,
    incompatibleSetupCardIds: [SETUP_CARD_IDS.CLEARER_SKIES_BETTER_DAYS]
  },
];