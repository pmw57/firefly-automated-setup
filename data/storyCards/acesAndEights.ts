import { StoryCardDef } from '../../types';

export const ACES_EIGHTS_STORIES: StoryCardDef[] = [
  {
    title: "A Jubilant Victory",
    intro: "10,000 Credits will put a mighty fine jingle in anyone's pocket. If that pocket belongs to you, best keep a watchful eye out for Jubal Early and his intentions.",
    requiredExpansion: "aces_eights",
    additionalRequirements: ["local_color"],
    rating: 1,
    sourceUrl: "https://boardgamegeek.com/filepage/235439/storycard-a-jubilant-victory",
    setupDescription: "Just another day in the 'Verse: Players use Firefly-class ships equipped with standard core drives and begin at their Havens with one Warrant. Jubal Early uses the Interceptor, starting from Meridian.",
    tags: ['community', 'survival'],
    rules: [
      { type: 'modifyResource', resource: 'warrants', method: 'add', value: 1, description: "Story-Specific Warrant", source: 'story', sourceName: "A Jubilant Victory" },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: 'Unwanted Attention',
          content: ["Players begin at their Havens with one Warrant."]
        },
        source: 'story', 
        sourceName: "A Jubilant Victory"
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'A High-Stakes Game: Haven Placement',
          content: ["Players begin at their Havens."],
          flags: ['isHavenPlacement']
        },
        source: 'story', 
        sourceName: "A Jubilant Victory"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
          title: 'Required Ships',
          badge: 'Ship Rules',
          content: [
            { type: 'paragraph', content: ["Players must use ", { type: 'strong', content: "Firefly-class ships" }, "."] },
            { type: 'paragraph-small-italic', content: ["All ships are equipped with standard core drives."] }
          ]
        },
        source: 'story', 
        sourceName: "A Jubilant Victory"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_panel',
        rule: {
          title: 'Jubal Early',
          badge: 'NPC Rules',
          flags: ['col-span-2'],
          content: [
            "Jubal Early is in play. He uses the ",
            { type: 'strong', content: "Interceptor" },
            " ship, starting from ",
            { type: 'strong', content: "Meridian" },
            "."
          ]
        },
        source: 'story', 
        sourceName: "A Jubilant Victory"
      },
      {
        type: 'addSpecialRule',
        category: 'draft_placement',
        rule: {
          content: ["⚠️ Reminder: Each player also begins with one ", { type: 'strong', content: "Warrant" }, "."],
          position: 'before'
        },
        source: 'story', 
        sourceName: "A Jubilant Victory"
      }
    ]
  }
];