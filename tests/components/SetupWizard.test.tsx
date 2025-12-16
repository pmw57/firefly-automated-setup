
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// FIX: Split imports to resolve module export errors. screen, fireEvent, and act are now imported from @testing-library/react.
import { screen, fireEvent, act } from '@testing-library/react';
import { render } from '../test-utils';
import SetupWizard from '../../components/SetupWizard';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('components/SetupWizard', () => {

  beforeEach(() => {
    localStorage.clear();
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('renders the initial CaptainSetup step', async () => {
    render(<SetupWizard />);
    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
    expect(screen.getByText('Number of Captains')).toBeInTheDocument();
  });

  it('progresses to the next step when "Next" is clicked', async () => {
    render(<SetupWizard />);
    
    // Step 1: CaptainSetup
    const nextButton1 = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton1);

    // Step 2: SetupCardSelection
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();
    
    // Because 10th anniversary is on by default, we go to optional rules
    const nextButton2 = await screen.findByRole('button', { name: /Next: Optional Rules/i });
    fireEvent.click(nextButton2);

    // Step 3: OptionalRulesSelection
    // FIX: Make query more specific to avoid finding multiple elements.
    expect(await screen.findByRole('heading', { level: 2, name: /Optional Rules/i })).toBeInTheDocument();
    const nextButton3 = screen.getByRole('button', { name: /Begin Setup Sequence/i });
    fireEvent.click(nextButton3);
    
    // Step 4: Core step
    // FIX: Use findByRole to correctly query the heading. The text "1. Nav Decks" is split across a <span> and a text node, which `findByText` cannot match as a single string.
    expect(await screen.findByRole('heading', { name: /1\.\s*Nav Decks/i })).toBeInTheDocument();
  });

  it('can navigate back to a previous step', async () => {
    render(<SetupWizard />);
    
    const nextButton1 = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton1);

    const backButton = await screen.findByRole('button', { name: /← Back/i });
    fireEvent.click(backButton);

    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
  });
  
  it('resets the game state when "Restart" is clicked and confirmed', async () => {
    render(<SetupWizard />);
    
    // Progress a step
    const nextButton = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton);
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();

    // Click restart once to show confirm
    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    // Click again to confirm
    const confirmButton = await screen.findByRole('button', { name: /Confirm Restart?/i });
    fireEvent.click(confirmButton);

    // Should be back at the first step
    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
    // Check that player count is reset to default 4
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('reaches the final summary screen', async () => {
    render(<SetupWizard />);

    // Fast-forward through the steps using a robust while loop
    await act(async () => {
      let nextButton;
      let i = 0;
      // FIX: Use queryByRole to avoid matching non-button elements and prevent infinite loops.
      while ((nextButton = screen.queryByRole('button', { name: /Next|Launch Setup|Begin Setup/i }))) {
        // Safety break for tests to prevent true infinite loops
        if (i++ > 20) {
            break;
        }
        fireEvent.click(nextButton);
        // A small delay to allow state updates between steps, especially for async operations.
        // Reduced from 10ms to 0ms to speed up the test significantly while still yielding to the event loop.
        await new Promise(r => setTimeout(r, 0));
      }
    });

    expect(await screen.findByText('You are ready to fly!')).toBeInTheDocument();
    expect(screen.getByText('Flight Manifest')).toBeInTheDocument();
  });
});
