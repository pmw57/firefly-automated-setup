
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { SetupContentTemplate } from '../types/index';

export const SETUP_CONTENT: Record<string, SetupContentTemplate> = {
  // Core Steps
  C1: { type: 'core' },
  C2: { type: 'core' },
  C3: { type: 'core' },
  C4: { type: 'core' },
  C5: { type: 'core' },
  C6: { type: 'core' },
  C_PRIME: { type: 'core' },

  // Distinct Dynamic Steps
  D_FIRST_GOAL: { type: 'dynamic' },
  D_RIM_JOBS: { type: 'dynamic' },
  D_TIME_LIMIT: { type: 'dynamic' },
  D_SHUTTLE: { type: 'dynamic' },
  D_HAVEN_DRAFT: { type: 'dynamic' },
  D_BC_CAPITOL: { type: 'dynamic' },
  D_LOCAL_HEROES: { type: 'dynamic' },
  D_ALLIANCE_ALERT: { type: 'dynamic' },
  D_PRESSURES_HIGH: { type: 'dynamic' },
  D_STRIP_MINING: { type: 'dynamic' },
  D_GAME_LENGTH_TOKENS: { type: 'dynamic' },
};

export const STEP_QUOTES: { [key: string]: { text: string; author: string } } = {
  'C1': { text: "Burn the land and boil the sea, you can't take the sky from me.", author: "Ballad of Serenity" },
  'C2': { text: "If they take the ship, they'll rape us to death, eat our flesh, and sew our skins into their clothing. And if we're very, very lucky, they'll do it in that order.", author: "Zoë Washburne" },
  'C3': { text: "Love. You can learn all the math in the 'Verse, but you take a boat in the air that you don't love, she'll shake you off just as sure as the turn of the worlds.", author: "Mal Reynolds" },
  'C4': { text: "We have done the impossible, and that makes us mighty.", author: "Mal Reynolds" },
  'C5': { text: "Ten percent of nothin' is... let me do the math here... nothin' into nothin', carry the nothin'...", author: "Jayne Cobb" },
  'C6': { text: "I do the job, and then I get paid.", author: "Mal Reynolds" },
  'C_PRIME': { text: "Everything's shiny, Cap'n. Not to fret.", author: "Kaylee Frye" },
  'D_FIRST_GOAL': { text: "We have done the impossible, and that makes us mighty.", author: "Mal Reynolds" },
  'D_RIM_JOBS': { text: "We're in the raggedy edge. Don't push me, and I won't push you.", author: "Mal Reynolds" },
  'D_TIME_LIMIT': { text: "Time for some thrilling heroics.", author: "Jayne Cobb" },
  'D_SHUTTLE': { text: "It's a short range transport.", author: "Manual" },
  'D_HAVEN_DRAFT': { text: "Safe haven. That's a myth.", author: "Book" },
  'D_BC_CAPITOL': { text: "Money tells.", author: "Niska" },
  'D_LOCAL_HEROES': { text: "Big damn heroes, sir.", author: "Zoë Washburne" },
  'D_ALLIANCE_ALERT': { text: "Surely there must be some Alliance rule.", author: "Simon Tam" },
  'D_PRESSURES_HIGH': { text: "Things go wrong.", author: "Mal Reynolds" },
  'D_STRIP_MINING': { text: "You want a slanging match, we can have a slanging match.", author: "Badger" },
  'D_GAME_LENGTH_TOKENS': { text: "Here's to the sunny side of the truth.", author: "Mal Reynolds" },
};
