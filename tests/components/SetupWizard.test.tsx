import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
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
    expect(await screen.findByRole('heading', { level: 2, name: /Optional Rules/i })).toBeInTheDocument();
    const nextButton3 = screen.getByRole('button', { name: /Begin Setup Sequence/i });
    fireEvent.click(nextButton3);
    
    // Step 4: Core step
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
    // Mock window.location.reload
    const { reload } = window.location;
    Object.defineProperty(window, 'location', {
      value: { reload: vi.fn() },
      writable: true,
    });

    render(<SetupWizard />);
    
    const nextButton = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton);
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();

    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    const confirmButton = await screen.findByRole('button', { name: /Confirm Restart?/i });
    fireEvent.click(confirmButton);

    expect(window.location.reload).toHaveBeenCalled();

    // Restore original window.location
    Object.defineProperty(window, 'location', {
      value: { reload },
      writable: true,
    });
  });

  it('reaches the final summary screen', async () => {
    render(<SetupWizard />);

    await act(async () => {
      let nextButton;
      let i = 0;
      while ((nextButton = screen.queryByRole('button', { name: /Next|Launch Setup|Begin Setup/i }))) {
        if (i++ > 20) break;
        fireEvent.click(nextButton);
        await new Promise(r => setTimeout(r, 0));
      }
    });

    expect(await screen.findByText('You are ready to fly!')).toBeInTheDocument();
    expect(screen.getByText('Flight Manifest')).toBeInTheDocument();
  });
});
