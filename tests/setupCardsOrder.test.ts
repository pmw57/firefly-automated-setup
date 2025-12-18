import { describe, it, expect } from 'vitest';
import { SETUP_CARDS } from '../data/setupCards';

describe('Setup Cards Step Regression', () => {
  const expectedSteps: Record<string, string[]> = {
    Standard: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C_PRIME'],
    AllianceHighAlert: ['D_ALLIANCE_ALERT', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C_PRIME'],
    AwfulCrowdedInMySky: ['C1', 'C3', 'C2', 'C4', 'C5', 'C6', 'C_PRIME'],
    TheRimsTheThing: ['D_RIM_JOBS', 'C1', 'C3', 'C2', 'C4', 'C5', 'C6', 'C_PRIME'],
    TimesNotOnOurSide: ['D_TIME_LIMIT', 'C1', 'C3', 'C2', 'C4', 'C5', 'C6', 'C_PRIME'],
    TheBrowncoatWay: ['D_FIRST_GOAL', 'C1', 'C2', 'D_BC_CAPITOL', 'C3', 'C6', 'C_PRIME'],
    TheBlitz: ['D_FIRST_GOAL', 'C1', 'C2', 'C3', 'D_STRIP_MINING', 'C6', 'C_PRIME'],
    ClearerSkiesBetterDays: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C_PRIME'],
    FlyingSolo: ['D_FIRST_GOAL', 'C1', 'C2', 'C3', 'C5', 'C6', 'C_PRIME', 'D_GAME_LENGTH_TOKENS'],
    AintAllButtonsAndCharts: ['D_FIRST_GOAL', 'C1', 'C2', 'C3', 'D_SHUTTLE', 'C5', 'C6', 'C_PRIME'],
    HomeSweetHaven: ['D_FIRST_GOAL', 'C1', 'C2', 'D_HAVEN_DRAFT', 'C5', 'C6', 'C_PRIME', 'D_LOCAL_HEROES'],
    TheHeatIsOn: ['D_PRESSURES_HIGH', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C_PRIME'],
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