import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { render } from '../test-utils';
import SetupWizard from '../../components/SetupWizard';

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
    render(<SetupWizard />);
    
    // Navigate to step 2
    const nextButton = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton);
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();

    // Trigger restart flow
    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    const confirmButton = await screen.findByRole('button', { name: /Confirm Restart?/i });
    fireEvent.click(confirmButton);

    // Verify reset by checking if we are back at the first step
    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
    expect(screen.queryByText('Select Setup Card')).not.toBeInTheDocument();
  });

  it('interacts correctly with the Optional Rules step', async () => {
    render(<SetupWizard />);
    
    // Go to Solo mode to enable all options.
    // We must re-query for the button after each click because the component re-renders
    // and the old button reference becomes stale. We also wait for the text to update.
    fireEvent.click(await screen.findByRole('button', { name: /Decrease player count/i }));
    await screen.findByText('3'); // Wait for re-render
    
    fireEvent.click(await screen.findByRole('button', { name: /Decrease player count/i }));
    await screen.findByText('2'); // Wait for re-render
    
    fireEvent.click(await screen.findByRole('button', { name: /Decrease player count/i }));
    await screen.findByText('1'); // Wait for re-render

    // Use a robust regex matcher to wait for the final state update to render.
    expect(await screen.findByText(/\(Solo Mode\)/)).toBeInTheDocument();

    // Navigate to Optional Rules step
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));
    });
    await act(async () => {
      // It's flying solo by default in solo mode with 10th
      fireEvent.click(await screen.findByRole('button', { name: /Next: Optional Rules/i }));
    });
    
    expect(await screen.findByRole('heading', { name: /Optional Rules/i })).toBeInTheDocument();
    
    // Verify 10th anniversary rules are present (default state)
    expect(screen.getByRole('heading', { name: /10th Anniversary Rules/i })).toBeInTheDocument();
    // Verify Solo rules are present
    expect(screen.getByRole('heading', { name: /Solo Rules/i })).toBeInTheDocument();

    // Interact with a checkbox and check its state
    const shipUpgradesContainer = screen.getByText('Optional Ship Upgrades').closest('div[role="checkbox"]');
    expect(shipUpgradesContainer?.querySelector('svg')).toBeNull(); // Not checked
    fireEvent.click(shipUpgradesContainer!);
    await screen.findByText('Optional Ship Upgrades'); // wait for re-render
    expect(shipUpgradesContainer?.querySelector('svg')).toBeInTheDocument(); // Checked

    // Interact with a solo checkbox
    const noSureThingsContainer = screen.getByText('No Sure Things In Life').closest('div[role="checkbox"]');
    expect(noSureThingsContainer?.querySelector('svg')).toBeNull();
    fireEvent.click(noSureThingsContainer!);
    await screen.findByText('No Sure Things In Life');
    expect(noSureThingsContainer?.querySelector('svg')).toBeInTheDocument(); // Checked
  });

  it('reaches the final summary screen', async () => {
    render(<SetupWizard />);

    await act(async () => {
      let nextButton;
      let i = 0;
      // Use a more specific query for the next button to avoid matching other buttons.
      while ((nextButton = screen.queryByRole('button', { name: /Next|Launch Setup|Begin Setup/i }))) {
        if (i++ > 20) break; // safety break
        fireEvent.click(nextButton);
        await new Promise(r => setTimeout(r, 5)); // small delay for state updates
      }
    });

    expect(await screen.findByText('You are ready to fly!')).toBeInTheDocument();
    expect(screen.getByText('Flight Manifest')).toBeInTheDocument();
  });
});