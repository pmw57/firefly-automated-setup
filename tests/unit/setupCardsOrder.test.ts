/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { SETUP_CARDS } from '../../data/setupCards';
import { STEP_IDS, SETUP_CARD_IDS } from '../../data/ids';

describe('Setup Cards Step Regression', () => {
  const expectedSteps: Record<string, string[]> = {
    [SETUP_CARD_IDS.STANDARD]: [STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.ALLIANCE_HIGH_ALERT]: [STEP_IDS.D_ALLIANCE_ALERT, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.AWFUL_CROWDED]: [STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.RIMS_THE_THING]: [STEP_IDS.D_RIM_JOBS, STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.TIMES_NOT_ON_OUR_SIDE]: [STEP_IDS.D_TIME_LIMIT, STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.THE_BROWNCOAT_WAY]: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.D_BC_CAPITOL, STEP_IDS.C3, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.THE_BLITZ]: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.D_STRIP_MINING, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.CLEARER_SKIES_BETTER_DAYS]: [STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.FLYING_SOLO]: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME, STEP_IDS.D_GAME_LENGTH_TOKENS],
    [SETUP_CARD_IDS.AINT_ALL_BUTTONS_AND_CHARTS]: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.D_SHUTTLE, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    [SETUP_CARD_IDS.HOME_SWEET_HAVEN]: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.D_HAVEN_DRAFT, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME, STEP_IDS.D_LOCAL_HEROES],
    [SETUP_CARD_IDS.THE_HEAT_IS_ON]: [STEP_IDS.D_PRESSURES_HIGH, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
  };

  it.concurrent('all defined setup cards should have regression expectations', () => {
    const cardIds = SETUP_CARDS.map(c => c.id);
    const regressionIds = Object.keys(expectedSteps);
    
    // Ensure we aren't missing any new cards in our tests
    cardIds.forEach(id => {
      expect(regressionIds, `Setup card "${id}" is missing from regression test baseline`).toContain(id);
    });
  });

  SETUP_CARDS.forEach(card => {
    it.concurrent(`should have the correct step sequence for ${card.id}`, () => {
      const actualStepIds = card.steps.map(s => s.id);
      const expectedStepIds = expectedSteps[card.id as keyof typeof expectedSteps];
      
      expect(actualStepIds, `Step order mismatch for ${card.id}`).toEqual(expectedStepIds);
    });
  });
});