/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import App from '../../App';

describe('Integration Scenarios', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('correctly guides the user through "The Browncoat Way" setup', async () => {
    render(<App />);

    // --- Step 1: Captain Setup ---
    await waitFor(() => {
      expect(screen.getByText('Number of Captains')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

    // --- Step 2: Setup Card Selection ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Select Setup Card/i })).toBeInTheDocument();
    });
    // Select "The Browncoat Way"
    fireEvent.click(screen.getByRole('button', { name: /The Browncoat Way/i }));
    // Navigate to next step (Optional Rules)
    fireEvent.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

    // --- Step 3: Optional Rules ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Optional Rules/i })).toBeInTheDocument();
    });
    // Start the main setup sequence
    fireEvent.click(screen.getByRole('button', { name: /Begin Setup Sequence/i }));

    // --- Browncoat Way Step 1: Goal of the Game (Mission Dossier) ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "Goal of the Game" })).toBeInTheDocument();
    });
    // Select a story to proceed
    fireEvent.click(screen.getByRole('button', { name: /Harken's Folly/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Browncoat Way Step 2: Nav Decks ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nav Decks/i })).toBeInTheDocument();
    });
    // Assert that the 'browncoat' nav mode rule is displayed
    expect(await screen.findByText('Forced Reshuffle')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // --- Browncoat Way Step 3: Alliance & Reaver Ships ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Alliance & Reaver Ships/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // --- Browncoat Way Step 4: Starting Capitol ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Starting Capitol/i })).toBeInTheDocument();
    });
    // Assert that the correct starting credits are displayed
    expect(await screen.findByText('$12,000')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Browncoat Way Step 5: Choose Ships & Leaders (Draft) ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Choose Ships & Leaders/i })).toBeInTheDocument();
    });
    // Assert that the special draft rule is displayed
    expect(await screen.findByText('Browncoat Market')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Browncoat Way Step 6: Starting Jobs ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Starting Jobs/i })).toBeInTheDocument();
    });
    // Assert that the "no jobs" rule is displayed
    expect(await screen.findByText('No Starting Jobs.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Browncoat Way Step 7: Priming The Pump ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Priming The Pump/i })).toBeInTheDocument();
    });
    expect(await screen.findByText('Cards Discarded')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Final Step: Summary ---
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /You are ready to fly!/i })).toBeInTheDocument();
    });
    // Check that summary reflects choices
    expect(await screen.findByText(/The Browncoat Way/i)).toBeInTheDocument();
    expect(await screen.findByText(/Harken's Folly/i)).toBeInTheDocument();
  });

  it('correctly displays rules for "Smuggler\'s Blues" based on expansions', async () => {
    render(<App />);

    // --- Step 1: Captain Setup ---
    // Turn off Kalidasa to test the "Alliance Space" contraband rule branch
    await waitFor(() => {
      expect(screen.getByText('Number of Captains')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('switch', { name: /Kalidasa/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

    // --- Step 2: Setup Card Selection ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Select Setup Card/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Begin Setup Sequence/i }));

    // --- Step 3: Mission Dossier ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "Goal of the Game" })).toBeInTheDocument();
    });
    // Select the "Smuggler's Blues" story
    fireEvent.click(screen.getByRole('button', { name: /Smuggler's Blues/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // --- Step 4: Nav Decks ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nav Decks/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Step 5: Alliance & Reaver Ships (The step we want to test) ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Alliance & Reaver Ships/i })).toBeInTheDocument();
    });

    // Assert that the correct "Alliance Space" contraband rule is displayed because Kalidasa is off
    const allianceSpaceRule = await screen.findByText(/Place 3 Contraband on each Planetary Sector in Alliance Space/i);
    expect(allianceSpaceRule).toBeInTheDocument();

    // Assert that the rule for starting with an Alert Card is also present
    const alertCardRule = await screen.findByText(/Begin the game with one random Alliance Alert Card in play/i);
    expect(alertCardRule).toBeInTheDocument();
  });
});
