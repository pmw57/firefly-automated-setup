
import { ContentMap } from '../types';

export const SETUP_CONTENT: ContentMap = {
  // Core Steps
  C1: { type: 'core', id: 'core-1', title: "Nav Decks" },
  C2: { type: 'core', id: 'core-2', title: "Alliance & Reaver Ships" },
  C3: { type: 'core', id: 'core-3', title: "Choose Ships & Leaders" },
  C4: { type: 'core', id: 'core-4', title: "Goal of the Game" },
  C5: { type: 'core', id: 'core-5', title: "Starting Supplies" },
  C6: { type: 'core', id: 'core-6', title: "Starting Jobs" },
  C_PRIME: { type: 'core', id: 'core-prime', title: "Priming The Pump" },

  // Distinct Dynamic Steps (Cannot be merged easily)
  D_RIM_JOBS: { type: 'dynamic', elementId: 'D_RIM_JOBS', title: "Rim Space Jobs" },
  D_TIME_LIMIT: { type: 'dynamic', elementId: 'D_TIME_LIMIT', title: "Only So Much Time" },
  D_SHUTTLE: { type: 'dynamic', elementId: 'D_SHUTTLE', title: "Choose Shuttles" },
  D_HAVEN_DRAFT: { type: 'dynamic', elementId: 'D_HAVEN_DRAFT', title: "Choose Leaders, Havens & Ships" },
  D_BC_CAPITOL: { type: 'dynamic', elementId: 'D_BC_CAPITOL', title: "Starting Capitol" },
  D_LOCAL_HEROES: { type: 'dynamic', elementId: 'D_LOCAL_HEROES', title: "Local Heroes" },
  D_ALLIANCE_ALERT: { type: 'dynamic', elementId: 'D_ALLIANCE_ALERT', title: "Alliance Alert Cards" },
  D_PRESSURES_HIGH: { type: 'dynamic', elementId: 'D_PRESSURES_HIGH', title: "The Pressure's High" },
  D_STRIP_MINING: { type: 'dynamic', elementId: 'D_STRIP_MINING', title: "Strip Mining: Starting Cards" },
  
  // Flying Solo Specifics
  D_FLYING_SOLO_SETUP: { type: 'dynamic', elementId: 'D_FLYING_SOLO_SETUP', title: "Select Paired Setup Card" },
  D_SOLO_OPTIONAL_RULES: { type: 'dynamic', elementId: 'D_SOLO_OPTIONAL_RULES', title: "Optional Solo Rules" },
  D_GAME_LENGTH_TOKENS: { type: 'dynamic', elementId: 'D_GAME_LENGTH_TOKENS', title: "Game Length Tokens" },
};

export const STEP_QUOTES: { [key: string]: { text: string; author: string } } = {
  'core-1': { text: "Burn the land and boil the sea, you can't take the sky from me.", author: "Ballad of Serenity" },
  'core-2': { text: "If they take the ship, they'll rape us to death, eat our flesh, and sew our skins into their clothing. And if we're very, very lucky, they'll do it in that order.", author: "Zoë Washburne" },
  'core-3': { text: "Love. You can learn all the math in the 'Verse, but you take a boat in the air that you don't love, she'll shake you off just as sure as the turn of the worlds.", author: "Mal Reynolds" },
  'core-4': { text: "We have done the impossible, and that makes us mighty.", author: "Mal Reynolds" },
  'core-5': { text: "Ten percent of nothin' is... let me do the math here... nothin' into nothin', carry the nothin'...", author: "Jayne Cobb" },
  'core-6': { text: "I do the job, and then I get paid.", author: "Mal Reynolds" },
  'core-prime': { text: "Everything's shiny, Cap'n. Not to fret.", author: "Kaylee Frye" },
  'D_RIM_JOBS': { text: "We're in the raggedy edge. Don't push me, and I won't push you.", author: "Mal Reynolds" },
  'D_TIME_LIMIT': { text: "Time for some thrilling heroics.", author: "Jayne Cobb" },
  'D_SHUTTLE': { text: "It's a short range transport.", author: "Manual" },
  'D_HAVEN_DRAFT': { text: "Safe haven. That's a myth.", author: "Book" },
  'D_BC_CAPITOL': { text: "Money tells.", author: "Niska" },
  'D_LOCAL_HEROES': { text: "Big damn heroes, sir.", author: "Zoë Washburne" },
  'D_ALLIANCE_ALERT': { text: "Surely there must be some Alliance rule.", author: "Simon Tam" },
  'D_PRESSURES_HIGH': { text: "Things go wrong.", author: "Mal Reynolds" },
  'D_STRIP_MINING': { text: "You want a slanging match, we can have a slanging match.", author: "Badger" },
  'D_FLYING_SOLO_SETUP': { text: "I aim to misbehave.", author: "Mal Reynolds" },
  'D_SOLO_OPTIONAL_RULES': { text: "Half of writing history is hiding the truth.", author: "Mal Reynolds" },
  'D_GAME_LENGTH_TOKENS': { text: "Here's to the sunny side of the truth.", author: "Mal Reynolds" },
};
