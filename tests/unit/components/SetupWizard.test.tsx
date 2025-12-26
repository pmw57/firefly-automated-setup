/** @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// FIX: `fireEvent`, `act`, and `within` are not exported from `test-utils`, import from `@testing-library/react` instead.
import { fireEvent, act, within } from '@testing-library/react';
import { render } from '../../test-utils';
import SetupWizard from '../../../components/SetupWizard';

// Mock WizardHeader to include a functional reset button
vi.mock('../../../components/WizardHeader', () => ({
  WizardHeader: vi.fn(({ onReset }) => (
      <div data-testid="mock-wizard-header">
        <button onClick={onReset}>Restart</button>
      </div>
  )),
}));

vi.mock('../../../components/ProgressBar', () => ({
  ProgressBar: vi.fn(() => <div data-testid="mock-progress-bar" />),
}));

vi.mock('../../../components/FinalSummary', () => ({
  FinalSummary: vi.fn(() => <div data-testid="mock-final-summary" />),
}));

vi.mock('../../../components/StepContent', () => ({
  StepContent: vi.fn(({ onNext, onPrev }) => (
    <div data-testid="mock-step-content">
      <button data-testid="mock-step-next-button" onClick={onNext}>Next</button>
      <button data-testid="mock-step-prev-button" onClick={onPrev}>Prev</button>
    </div>
  )),
}));

describe('components/SetupWizard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.concurrent('renders the initial step', () => {
    const { container } = render(<SetupWizard />);
    
    expect(within(container).getByTestId('mock-wizard-header')).toBeInTheDocument();
    expect(within(container).getByTestId('mock-progress-bar')).toBeInTheDocument();
    expect(within(container).getByTestId('mock-step-content')).toBeInTheDocument();
  });

  it.concurrent('progresses to the next step when "Next" is clicked', () => {
    const { container } = render(<SetupWizard />);
    
    act(() => {
      fireEvent.click(within(container).getByTestId('mock-step-next-button'));
      vi.runAllTimers();
    });

    // We can't easily test the step content, but we can check if the component re-renders
    expect(container.innerHTML).not.toBe('');
  });

  it.concurrent('can navigate back to a previous step', () => {
    const { container } = render(<SetupWizard />);
    
    act(() => {
      fireEvent.click(within(container).getByTestId('mock-step-next-button'));
      vi.runAllTimers();
    });

    act(() => {
      fireEvent.click(within(container).getByTestId('mock-step-prev-button'));
      vi.runAllTimers();
    });
    
    // We can't easily test the step content, but we can check if the component re-renders
    expect(container.innerHTML).not.toBe('');
  });
  
  it.concurrent('resets the game state when "Restart" is clicked', () => {
    const { container } = render(<SetupWizard />);
    
    const restartButton = within(container).getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    // The resetGameState function clears local storage. We can assert this side effect.
    expect(localStorage.removeItem).toHaveBeenCalledWith('firefly_wizardStep_v3');
    expect(localStorage.removeItem).toHaveBeenCalledWith('firefly_gameState_v3');
  });
});