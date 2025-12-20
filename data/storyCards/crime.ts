import { StoryCardDef, SetupRule } from '../../types';

// Helper to avoid repeating source info
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
    return rules.map(rule => ({
        ...rule,
        source: 'story',
        sourceName,
    })) as SetupRule[];
};

export const CRIME_STORIES: StoryCardDef[] = [
  {
    title: "Smuggler's Blues",
    intro: "Bringin' goods to folk who want 'em is an old-fashioned way to make a living... 'cept, sometimes, a law or two gets in the way.",
    setupDescription: "Place 3 Contraband in Alliance sectors. Place $2000 under specified decks. No Starting Jobs. Start at Londinium. Start with Alert Card.",
    requiredExpansion: "crime",
    rules: createStoryRules("Smuggler's Blues", [
      { type: 'addFlag', flag: 'smugglersBluesSetup' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'setShipPlacement', location: 'londinium' },
      { type: 'setJobMode', mode: 'no_jobs' }
    ])
  },
  {
    title: "Wanted Men",
    intro: "Infamy's a funny thing. Bucking the law, while a might stressful day-to-day, leads to being known. The more you're known, the more your name's worth. Trick of it is, you got to sock away a lifetime of credits before you find yourself retiring early, in an Alliance lockup...",
    setupDescription: "Start with 1 Warrant. Start Outside Alliance Space. Start with Alert Card. Limited Starting Job Contacts.",
    requiredExpansion: "crime",
    rules: createStoryRules("Wanted Men", [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Start with 1 Warrant." },
      { type: 'addFlag', flag: 'startOutsideAllianceSpace' },
      { type: 'addFlag', flag: 'startWithAlertCard' },
      { type: 'allowContacts', contacts: ["Patience", "Badger", "Niska", "Mr. Universe", "Fanty & Mingo"] }
    ])
  },
];