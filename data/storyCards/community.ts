
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { StoryCardDef, SetupRule } from '../../types/index';
import { CONTACT_NAMES } from '../ids';

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
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4452357",
  },
  {
    title: "Black Market Beagles",
    intro: "One too many loads of smuggled cargo (of the live variety) has really started to stink up the place so the crew has opted to transport something smaller, more specifically with smaller droppings.",
    setupDescription: "Beagles are the contraband. If you lose 'em you can get more at Jiangyin, Red Sun for $1000 each! Start out with 1 Cry Baby on the ship to use at you liken'",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1098646/article/14445829#14445829",
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
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/6067255"
  },
  {
    title: "Fruity Oat Bar",
    intro: "One of your crew was once used in an experiment by the Alliance. After escaping and joining your crew, they are now wanted. Before you are caught, you decide to get to the bottom of things, and discover the secret that the Alliance wants kept secret.",
    setupDescription: "After choosing your Leader, search for any Wanted crew from any deck and add them to your crew. You must start in Alliance Space.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1045716/article/13603393#13603393"
  },
  {
    title: "The Heist on Ariel (tv episode)",
    intro: "Ariel is the crowen jewel of the Core. To rob her, you'll need to play dead, steal the high-tech meds, and outrun the Hands of Blue.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1066007/article/47073551#47073551"
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    setupDescription: "Remove River Tam from play.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4434520",
    rules: createStoryRules("Hospital Rescue", [
      { type: 'addFlag', flag: 'removeRiver' }
    ])
  },
  {
    title: "How It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    setupDescription: "Start with $500, 2 Fuel, 2 Parts. Nandi discounts.",
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
    setupDescription: "Start with 2 Warrants. Alliance Space off limits. No Harken.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4434522",
    rules: createStoryRules("It Ain't Easy Goin' Legit", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, description: "Start with 2 Warrants." },
      { type: 'addFlag', flag: 'allianceSpaceOffLimits' },
      { type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }
    ])
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
    title: "Our Mrs. Reynolds (tv episode)",
    intro: "You find a stowaway on your ship. You're not happy about them being there, but you are too far from any planet to drop them off. At least they don't seem like bad company.",
    sourceUrl: "https://boardgamegeek.com/thread/1066007/article/47073551#47073551",
    requiredExpansion: "community"
  },
  {
    title: "Out of Gas (tv episode)",
    intro: "The compression coil blows on your ship and starts an explosion.",
    sourceUrl: "https://boardgamegeek.com/thread/1066007/article/47073551#47073551",
    requiredExpansion: "community"
  },
  {
    title: "Shadows Over Duul",
    intro: "The Silverhold-Hera route is usually a harmless uneventful run. Unless, of course, someone installs a beacon on the cargo which attracts a Reaver party.",
    setupDescription: "Remove Amnon Duul Jobs. Start in border of Murphy.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4437772",
    rules: createStoryRules("Shadows Over Duul", [
      { type: 'forbidContact', contact: CONTACT_NAMES.AMNON_DUUL },
      { type: 'setShipPlacement', location: 'border_of_murphy' }
    ])
  },
  {
    title: "Slaying The Dragon",
    intro: "Adelai Niska has been lord of the underworld for as long as anyone can remember. Shu-ki, the tong boss of Gonghe, has long suffered under Niska's yoke. After being publicly shamed by Niska at a meeting of crime-bosses, an enraged Shu-ki has decided to bring Niska down. He has a plan - Operation Dragon - but the job is so daunting that it requires two crews to have any hope of success. Can two Firefly captains bring down the most feared criminal boss in the 'Verse?",
    setupDescription: "2-Player Co-Op. Niska jobs forbidden. Remove Niska Deck. Prime +2 cards/deck. Stack 16 Disgruntled Tokens (Countdown).",
    requiredExpansion: "community",
    rules: createStoryRules("Slaying The Dragon", [
      { type: 'forbidContact', contact: CONTACT_NAMES.NISKA },
      { type: 'modifyPrime', modifier: { add: 2 } },
      { 
        type: 'addSpecialRule', 
        category: 'prime',
        rule: {
          title: 'Slaying The Dragon',
          content: [{ type: 'strong', content: 'Shu-ki is greasing the rails:' }, ' Turn up ', { type: 'strong', content: '2 additional cards' }, ' from each deck when Priming the Pump.']
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/thread/1049020/article/13686225#13686225"
  },
  {
    title: "The Ghost Rock Run",
    intro: "On Anson's World the Sweetrock Mining Co. has discovered a rare mineral called \"Ghost Rock\". Will you handle the run, or sell it to the highest bidder?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/2072290"
  },
  {
    title: "The Magnificent Crew",
    intro: "On a backwater planet, an old friend sends out a plea. Marauders are bleeding their town dry. Suss out the trouble, assemble a crew, and eliminate the pesky varmints.",
    setupDescription: "Remove all Job Decks. High-value cargo sales.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/2277037/upstarter",
    rules: createStoryRules("The Magnificent Crew", [
      { type: 'addFlag', flag: 'removeJobDecks' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ])
  },
  {
    title: "The Train Job (tv episode)",
    intro: "Niska has a job for you, and things won't turn out well if anything goes wrong.",
    sourceUrl: "https://boardgamegeek.com/thread/1066007/article/47073551#47073551",
    requiredExpansion: "community"
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
    title: "War Stories (tv episode)",
    intro: "Niska doesn't care for excuses or warrants. You failed him, and now he’s taken what’s yours. To him, they are assets; to you, they are family.",
    sourceUrl: "https://boardgamegeek.com/thread/1066007/article/47073551#47073551",
    requiredExpansion: "community"
  }
];