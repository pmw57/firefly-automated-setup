
import { StoryCardDef } from '../../../types';
import { STORIES_A_D } from './a-d';
import { STORIES_F_G } from './f-g';
import { STORIES_H_L } from './h-l';
import { STORIES_M_O } from './m-o';
import { STORIES_R_S } from './r-s';
import { STORIES_T_X } from './t-x';
import { SOLO_COMMUNITY_STORIES } from './solo';
import { SOLITAIRE_FIREFLY_STORIES } from './solitaireFirefly';

export const COMMUNITY_STORIES: StoryCardDef[] = [
  ...STORIES_A_D,
  ...STORIES_F_G,
  ...STORIES_H_L,
  ...STORIES_M_O,
  ...STORIES_R_S,
  ...STORIES_T_X,
  ...SOLO_COMMUNITY_STORIES,
  ...SOLITAIRE_FIREFLY_STORIES,
];
