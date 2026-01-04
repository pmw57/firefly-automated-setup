
import { StoryCardDef } from '../../../types';
import { SETUP_CARD_IDS } from '../../ids';
import { createStoryRules } from '../utils';

export const STORIES_T_X: StoryCardDef[] = [
  {
    title: "They're Part Of My Crew",
    intro: "Mal's last job went south in a bad way. As a result, some of the crew was captured by the Alliance and sent to unknown prison camps all over the 'Verse. For a price, Badger might let you in on a little secret.",
    isSolo: true,
    setupDescription: "Follow the 'Fixed Assignment' and 'Rescue Mission' overrides.",
    sourceUrl: "https://boardgamegeek.com/thread/3282832/my-fellow-browncoats-remastered-into-a-solo-and-co",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD,
    rules: createStoryRules("They're Part Of My Crew", [
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: 'Fixed Assignment',
          content: [
            {
              type: 'list',
              items: [
                ["Use Malcolm as your Leader and Serenity as your ship."],
                ["Take Jayne, Kaylee, and River as your starting crew."],
                ["Take an Expanded Crew Quarters from Osiris for your ship."],
              ]
            }
          ]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'goal',
        rule: {
          title: 'Rescue Mission',
          content: ["Shuffle Zoe, Wash, Inara, Book, and Simon, together. Place them face down as the \"Prisoner Deck\". They are your goals for this game."]
        }
      }
    ])
  },
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Alliance a black eye?",
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