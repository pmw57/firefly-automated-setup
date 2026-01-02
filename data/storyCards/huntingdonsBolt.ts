import { StoryCardDef } from '../../types';
import { createStoryRules } from './utils';

export const HUNTINGDONS_BOLT_STORIES: StoryCardDef[] = [
    {
        title: "Under The Radar",
        intro: "Legend holds that a priceless Earth-That-Was artifact is sealed away in a high-security vault on Albion. The usual suspects might draw too much attention. best keep the crew small this time.",
        sourceUrl: "https://boardgamegeek.com/thread/3281169/article/47098185#47098185",
        requiredExpansion: "huntingdons_bolt",
        additionalRequirements: [
            "blue"
        ],
        rules: [
            {
                type: "addSpecialRule",
                category: "goal",
                rule: {
                    title: "Discretion Required",
                    content: [
                        "When you Work a Goal, you must first proceed past a Misbehave for each Max Crew over 4."
                    ]
                },
                source: "story",
                sourceName: "Under The Radar"
            }
        ]
    }
];