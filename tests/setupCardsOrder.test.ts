import { describe, it, expect } from 'vitest';
import { SETUP_CARDS } from '../data/setupCards';
import { STEP_IDS } from '../data/ids';

describe('Setup Cards Step Regression', () => {
  const expectedSteps: Record<string, string[]> = {
    Standard: [STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    AllianceHighAlert: [STEP_IDS.D_ALLIANCE_ALERT, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    AwfulCrowdedInMySky: [STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    TheRimsTheThing: [STEP_IDS.D_RIM_JOBS, STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    TimesNotOnOurSide: [STEP_IDS.D_TIME_LIMIT, STEP_IDS.C1, STEP_IDS.C3, STEP_IDS.C2, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    TheBrowncoatWay: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.D_BC_CAPITOL, STEP_IDS.C3, STEP_IDS.C6, STEP_IDS.C_PRIME],
    TheBlitz: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.D_STRIP_MINING, STEP_IDS.C6, STEP_IDS.C_PRIME],
    ClearerSkiesBetterDays: [STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    FlyingSolo: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME, STEP_IDS.D_GAME_LENGTH_TOKENS],
    AintAllButtonsAndCharts: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.D_SHUTTLE, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
    HomeSweetHaven: [STEP_IDS.D_FIRST_GOAL, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.D_HAVEN_DRAFT, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME, STEP_IDS.D_LOCAL_HEROES],
    TheHeatIsOn: [STEP_IDS.D_PRESSURES_HIGH, STEP_IDS.C1, STEP_IDS.C2, STEP_IDS.C3, STEP_IDS.C4, STEP_IDS.C5, STEP_IDS.C6, STEP_IDS.C_PRIME],
  };

  it('all defined setup cards should have regression expectations', () => {
    const cardIds = SETUP_CARDS.map(c => c.id);
    const regressionIds = Object.keys(expectedSteps);
    
    // Ensure we aren't missing any new cards in our tests
    cardIds.forEach(id => {
      expect(regressionIds, `Setup card "${id}" is missing from regression test baseline`).toContain(id);
    });
  });

  SETUP_CARDS.forEach(card => {
    it(`should have the correct step sequence for ${card.id}`, () => {
      const actualStepIds = card.steps.map(s => s.id);
      const expectedStepIds = expectedSteps[card.id as keyof typeof expectedSteps];
      
      expect(actualStepIds, `Step order mismatch for ${card.id}`).toEqual(expectedStepIds);
    });
  });
});