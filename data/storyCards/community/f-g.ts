import { StoryCardDef } from '../../../types';
import { createStoryRules } from '../utils';

export const STORIES_F_G: StoryCardDef[] = [
  {
    title: "Fruity Oat Bar",
    intro: "One of your crew was once used in an experiment by the Alliance. After escaping and joining your crew, they are now wanted. Before you are caught, you decide to get to the bottom of things, and discover the secret that the Alliance wants kept secret.",
    setupDescription: "Follow the 'Special Crew & Placement' override.",
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
    setupDescription: "A Port of Operation: While choosing starting positions, players must choose a planetary sector within Blue Sun system that is not a Contact or Supply sector. Mark the sector with a Haven Token. Leave unused ships out of the box as a \"For Sale\" pile.",
    sourceUrl: "https://boardgamegeek.com/thread/3560944/going-legit-story-card",
    requiredExpansion: "community",
    rules: createStoryRules("Going Legit", [
      { type: 'addFlag', flag: 'isGoingLegit' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'A Port of Operation',
          content: [
            "While choosing starting positions, players must choose a planetary sector within Blue Sun system that is not a Contact or Supply sector. Mark the sector with a Haven Token. Leave unused ships out of the box as a \"For Sale\" pile."
          ]
        }
      }
    ])
  },
  {
    title: "The Good Guys",
    intro: " ",
    setupDescription: "Follow the 'Moral Compass' override. Exclude Niska from Starting Jobs.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1624739/story-card-the-good-guys",
    rules: createStoryRules("The Good Guys", [
      { type: 'forbidContact', contact: 'Niska' },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Moral Compass',
          content: [
            {
              type: 'list',
              // FIX: Each item in a list must be an array (StructuredContent) to satisfy the type definition.
              items: [
                ["Only MORAL leaders can be chosen."],
                ["Immoral Jobs cannot be accepted."],
                ["Remove Crow from the game."]
              ]
            }
          ]
        }
      }
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
];