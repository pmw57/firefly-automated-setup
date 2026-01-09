import { StoryCardDef } from '../../../types';
import { SETUP_CARD_IDS } from '../../ids';
import { createStoryRules } from '../utils';

export const STORIES_T_X: StoryCardDef[] = [
  {
    title: "They're Part Of My Crew",
    intro: "We all know Mal's got a good aim when it comes to misnehavin'. We also know Mal's stepped on quite a few tows with his misbehavin'. There's more than a few folk like to see him and his crew behind bars or six feet under. Regardless of who or what comes at Serenity, Mal's gonna do what he's always done. Protect his crew.",
    isSolo: true,
    goals: [
      {
        title: "Free Your Crew",
        description: "Once the 7-turn timer is up, you must immediately fly to Londinium and proceed past 5 negotiation skill checks to free your crew from the Alliance prison. If you are successful, you have won the game."
      }
    ],
    rules: createStoryRules("They're Part Of My Crew", [
      { 
        type: 'modifyResource', 
        resource: 'credits', 
        method: 'set', 
        value: 1000, 
        description: "Story Funds" 
      },
      {
        type: 'addSpecialRule',
        category: 'draft',
        rule: {
          title: "Story Setup",
          content: ["Use Malcolm as your Leader and Serenity as your ship. Your starting crew is: Zoë, Wash, Jayne, Kaylee, Inara, Book, Simon, and River. Take 1 Expanded Crew Quarters from the Osiris Supply Deck."]
        }
      },
      {
        type: 'addSpecialRule',
        category: 'resources',
        rule: {
          title: "Disgruntled Timer",
          content: ["Collect 7 Disgruntled tokens. These will be used as a special game timer. Discard 1 token at the start of each of your turns."]
        }
      }
    ]),
    sourceUrl: "https://boardgamegeek.com/filepage/278719/solo-and-co-op-story-cards-focusing-on-the-crew-of",
    requiredExpansion: "community",
    requiredSetupCardId: SETUP_CARD_IDS.STANDARD,
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
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
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