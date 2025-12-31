import { CampaignSetupNote } from '../types';
import { STEP_IDS } from './ids';

export const SOLO_EXCLUDED_STORIES: string[] = [
  "Awful Lonely In The Big Black",
  "The Great Recession",
  "The Well's Run Dry",
  "It's All In Who You Know",
  "The Scavenger's 'Verse",
  "Smuggler's Blues",
  "Aces Up Your Sleeve"
];

/**
 * A centralized collection of reusable setup notes for the solo campaign.
 * This prevents duplicating rule content across multiple story card definitions.
 */
export const CAMPAIGN_SETUP_NOTES: Record<string, CampaignSetupNote> = {
  CONTINUE_FROM_PREVIOUS: {
    stepId: STEP_IDS.C3,
    content: ["Continue with the crew and items you acquired after completing the previous story."],
  },
  EXPLOSIVES_REQUIRED: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: 'Requires EXPLOSIVES.' }],
  },
  SUGGEST_BONNET_VERA: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: "Suggested:" }, " Mal's Pretty Floral Bonnet & Vera."],
  },
  FAKE_ID_REQUIRED: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: 'Requires FAKE ID.' }],
  },
  HACKING_RIG_REQUIRED: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: 'Requires HACKING RIG.' }],
  },
  SUGGEST_MED_BAY: {
    stepId: STEP_IDS.C5,
    content: ["If you have the credits, a ", { type: 'strong', content: 'Fully Equipped Med Bay' }, " might also come in handy."],
  },
  SUGGEST_MED_BAY_AND_HAT: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: "Suggested:" }, " Fully Equipped Med Bay. Take Jayne's \"Cunning\" Hat."],
  },
  ANY_SECTOR_PLACEMENT: {
    stepId: STEP_IDS.C3,
    content: ["This Story can take place in any empty sector."],
  },
  ANY_SECTOR_PLACEMENT_WITH_CREW_NOTE: {
    stepId: STEP_IDS.C3,
    content: ["This Story can take place in any sector. If a named Crew from the show is missing, choose another Crew."],
  },
  START_AT_SPACE_BAZAAR: {
    stepId: STEP_IDS.C3,
    content: ["Start the Story at the ", { type: 'strong', content: 'Space Bazaar' }, "."],
  },
  PICK_UP_SAFFRON: {
    stepId: STEP_IDS.C3,
    content: ["Before starting, pick up ", { type: 'strong', content: 'Saffron' }, " on ", { type: 'strong', content: 'Newhope' }, "."],
  },
  REMOVE_INARA_AND_BOOK: {
    stepId: STEP_IDS.C3,
    content: ["Remove ", { type: 'strong', content: 'Inara' }, " and ", { type: 'strong', content: 'Shepherd Book' }, " from the game."],
  },
  INARA_REJOINS: {
    stepId: STEP_IDS.C3,
    content: [{ type: 'strong', content: 'Inara rejoins' }, " the crew at this point."],
  },
  REMOVE_DISGRUNTLED: {
    stepId: STEP_IDS.C5,
    content: ["Remove ", { type: 'strong', content: 'Disgruntled Tokens' }, " from all crew."],
  },
  TRANSPORT_REQUIRED: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: 'Requires Transport.' }],
  },
  NO_MED_BAY_SUGGEST_KIT: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: 'Fully Equipped Med Bay' }, " may not be used. ", { type: 'strong', content: "Suggested:" }, " Simon's Surgical Kit."],
  },
  SUGGEST_FANCY_DUDS: {
    stepId: STEP_IDS.C5,
    content: [{ type: 'strong', content: "Suggested:" }, " Kaylee's Fluffy Pink Dress. ", { type: 'strong', content: "Required:" }, " Mal must wear FANCY DUDS throughout."],
  },
  SUGGEST_NEGOTIATION_GEAR: {
    stepId: STEP_IDS.C5,
    content: ["You may want to get ", { type: 'strong', content: 'Jayne' }, " some negotiation gear, or things could go badly."],
  },
};
