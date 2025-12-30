
import { StoryCardDef, SetupRule } from '../../types/index';

// FIX: Using a distributive Omit to correctly type the 'rules' parameter, which is an array of a discriminated union.
// This ensures that properties like 'category' are correctly recognized on members of the SetupRule union.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

const createStoryRules = (sourceName: string, rules: DistributiveOmit<SetupRule, 'source' | 'sourceName'>[]): SetupRule[] => {
  return rules.map(rule => ({
    ...rule,
    source: 'story',
    sourceName,
  })) as SetupRule[];
};

export const HUNTINGDONS_BOLT_STORIES: StoryCardDef[] = [
    {
        "title": "Under The Radar",
        "intro": "There's a client who'll pay good coin if you can crack the protected ICE server at Boros... but the usual suspects may draw to much attention. Best keep the crew small.",
        "sourceUrl": "https://boardgamegeek.com/image/8455024/gwek",
        "requiredExpansion": "huntingdons_bolt",
        "additionalRequirements": ["blue"],
        "rules": createStoryRules("Under The Radar", [
            {
                type: 'addSpecialRule',
                category: 'goal',
                rule: {
                    title: "Discretion Required",
                    content: [ "When you Work a Goal, you must first proceed past a Misbehave for each Max Crew over 4." ]
                }
            }
        ]),
    }
];
