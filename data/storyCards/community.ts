
import { StoryCardDef } from '../../types';

export const COMMUNITY_STORIES: StoryCardDef[] = [
  {
    title: "Bank Job",
    intro: "There's wages belonging to no-one (Alliance don't count). Find out where, and get the tools you'll need, then pull off the heist.",
    requiredExpansion: "community"
  },
  {
    title: "Double Duty",
    intro: "Sometimes, It's best to work under the radar and quiet-like. Fanty and Mingo have goods and folks in need of moving throughout the 'Verse. Use your connections with others to keep the twins' names out of the picture. Do a good enough job, and you might become their new favorite captain.",
    requiredExpansion: "community"
  },
  {
    title: "Hospital Rescue",
    intro: "River is prisoner in a secure hospital at Londinium, and needs rescuing.",
    setupDescription: "Remove River Tam from play.",
    requiredExpansion: "community",
    setupConfig: {
      removeRiver: true
    }
  },
  {
    title: "Where It All Started",
    intro: "You're low on funds, and need to get a job. Badger's hired you to scavenge a derelict ship dangerously close to an Alliance cruiser. Get the cargo, evade the Alliance, and sell it.",
    setupDescription: "Start with $500, 2 Fuel, 2 Parts. Nandi discounts.",
    requiredExpansion: "community",
    setupConfig: {
      startingCreditsOverride: 500,
      customStartingFuel: 2,
      nandiCrewDiscount: true
    },
    sourceUrl: "https://boardgamegeek.com/filepage/186593/where-it-all-started-story-card"
  },
  {
    title: "It Ain't Easy Goin' Legit",
    intro: "Your last run in with Harken turned South and you've got a boatload of warrants trailin' ya. Time to clean your ledger and get dirt on Harken instead.",
    setupDescription: "Start with 2 Warrants. Alliance Space off limits. No Harken.",
    requiredExpansion: "community",
    setupConfig: {
      startingWarrantCount: 2,
      allianceSpaceOffLimits: true,
      forbiddenStartingContact: "Harken"
    }
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
      jobDrawMode: "no_jobs",
      removeJobDecks: true
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
