import { StoryCardDef } from '../../types';

export const HUNTINGDONS_BOLT_STORIES: StoryCardDef[] = [
    {
        title: "Under The Radar",
        intro: "There's a client who'll pay good coin if you can crack the protected ICE server at Boros... but the usual suspects may draw to much attention. Best keep the crew small.",
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