import React from 'react';
import { vi } from 'vitest';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState, Step } from '../types/index';
import { STEP_IDS } from '../data/ids';
import { getDefaultGameState } from '../state/reducer';

// Mock WizardHeader
vi.mock('../components/WizardHeader', () => ({
  WizardHeader: ({ onReset }: { onReset: () => void }) => {
    const [showConfirm, setShowConfirm] = React.useState(false);
    return (
      <div data-testid="mock-wizard-header">
        <button
          onClick={() => {
            if (showConfirm) {
              onReset();
            } else {
              setShowConfirm(true);
            }
          }}
        >
          {showConfirm ? 'Confirm Restart?' : 'Restart'}
        </button>
      </div>
    );
  },
}));

// Mock ProgressBar
vi.mock('../components/ProgressBar', () => ({
  ProgressBar: () => <div data-testid="mock-progress-bar" />,
}));

// Mock StepContent
export const mockStepContent = vi.fn(({ step, onNext, onPrev }) => (
  <div data-testid={`mock-step-content-${step.id}`}>
    <button data-testid="mock-step-next-button" onClick={onNext}>Next</button>
    <button data-testid="mock-step-prev-button" onClick={onPrev}>Prev</button>
  </div>
));
vi.mock('../components/StepContent', () => ({ StepContent: mockStepContent }));

// Mock useGameState hook
export const mockResetGameState = vi.fn();
export const mockUseGameState = vi.fn(() => ({
  state: {
    ...getDefaultGameState(),
    playerCount: 1,
    playerNames: ['Player 1'],
    gameMode: 'solo',
  } as GameState,
  isStateInitialized: true,
  resetGameState: mockResetGameState,
}));
vi.mock('../hooks/useGameState', () => ({
  useGameState: mockUseGameState,
}));

// Mock useSetupFlow hook
export const mockFlow: Step[] = [
  { id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS, type: 'setup', data: { type: 'setup', title: 'Mission Configuration' } },
  { id: STEP_IDS.SETUP_CARD_SELECTION, type: 'setup', data: { type: 'setup', title: 'Select Setup Card' } },
  { id: STEP_IDS.SETUP_OPTIONAL_RULES, type: 'setup', data: { type: 'setup', title: 'Optional Rules' } },
  { id: STEP_IDS.C1, type: 'core', data: { type: 'core', title: 'Nav Decks' } },
];
export const mockUseSetupFlow = vi.fn(() => ({
  flow: mockFlow,
}));
vi.mock('../hooks/useSetupFlow', () => ({
  useSetupFlow: mockUseSetupFlow,
}));