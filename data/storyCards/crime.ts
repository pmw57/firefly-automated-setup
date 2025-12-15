
import { StoryCardDef } from '../../types';

export const CRIME_STORIES: StoryCardDef[] = [
  {
    title: "Smuggler's Blues",
    intro: "Bringin' goods to folk who want 'em is an old-fashioned way to make a living... 'cept, sometimes, a law or two gets in the way.",
    setupDescription: "Place 3 Contraband in Alliance sectors. Place $2000 under specified decks. No Starting Jobs. Start at Londinium. Start with Alert Card.",
    requiredExpansion: "crime",
    setupConfig: {
      smugglersBluesSetup: true,
      startWithAlertCard: true,
      jobDrawMode: "no_jobs",
      startAtLondinium: true
    }
  },
  {
    title: "Wanted Men",
    intro: "Infamy's a funny thing. Bucking the law, while a might stressful day-to-day, leads to being known. The more you're known, the more your name's worth. Trick of it is, you got to sock away a lifetime of credits before you find yourself retiring early, in an Alliance lockup...",
    setupDescription: "Start with 1 Warrant. Start Outside Alliance Space. Start with Alert Card. Limited Starting Job Contacts.",
    requiredExpansion: "crime",
    setupConfig: {
      startWithWarrant: true,
      startOutsideAllianceSpace: true,
      startWithAlertCard: true,
      allowedStartingContacts: ["Patience", "Badger", "Niska", "Mr. Universe", "Fanty & Mingo"]
    }
  },
];
