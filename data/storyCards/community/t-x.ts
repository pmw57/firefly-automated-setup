import { StoryCardDef } from '../../../types';
import { SETUP_CARD_IDS } from '../../ids';

export const STORIES_T_X: StoryCardDef[] = [
  {
    title: "The Truth Will Out",
    intro: "For too long the tragic fate of the Miranda colony has been covered up by the Alliance, and Mr. Universe would like to correct that, but lacks the manpower to do so on his own. Helping him is bound to be dangerous, but who wouldn't enjoy giving the Alliance a black eye?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/image/4894306/pmw57",
    additionalRequirements: ["blue"],
    tags: ['community', 'character'],
  },
  {
    title: "This Here's History",
    intro: "Legendary Captain Arien Grimbold, a legend of the Battle of Serenity Valley, disappeared after the Browncoats dissolved. She is said to have been buried with her priceless rifle, Flamespeaker. Can you find her tomb and uncover this lost relic of a nobler time?",
    sourceUrl: "https://boardgamegeek.com/thread/3655131/three-homebrew-scenarios",
    requiredExpansion: "community",
    rating: 2
  },
  {
    title: "Trash Part Deux",
    intro: "Have MRP (Mrs Reynolds persona) steal and sell the latest Firefly story.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/filepage/164355/story-card-trash-part-deux",
    tags: ['community', 'classic_heist'],
  },
  {
    title: "Unification Day",
    intro: "Unification Day is fast approaching and you have plans to cause all sorts of mischief, but what better way to do it than right under the nose of the Alliance? You just might get more than a little pay back out of it.",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/1083899/unification-day-alliance-oriented-story-card",
    rating: 1,
    tags: ['community', 'classic_heist'],
  },
  {
    title: "Wild Cards",
    intro: "Prove you're the best - or luckiest - crew around by collecting tales of your exploits.",
    requiredExpansion: "aces_eights",
    sourceUrl: "https://boardgamegeek.com/thread/3281169/article/47090467#47090467",
    rating: 3,
    tags: ['community', 'reputation'],
  },
  {
    title: "X Marks The Spot",
    intro: "Pirate Captain Medina's legendary buried treasure was forever lost when he split his treasure map ensuring none could find it. Who will be first to unearth his fabled booty?",
    requiredExpansion: "community",
    sourceUrl: "https://boardgamegeek.com/thread/2954291/article/41076542#41076542",
    rating: 2,
    incompatibleSetupCardIds: [SETUP_CARD_IDS.CLEARER_SKIES_BETTER_DAYS],
    tags: ['community', 'classic_heist', 'mystery'],
  },
];