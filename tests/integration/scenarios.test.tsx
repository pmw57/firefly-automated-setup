
/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import { render } from '../test-utils';
import App from '../../App';
import { getDefaultGameState } from '../../state/reducer';
import { GameState } from '../../types';

describe('Integration Scenarios', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("'The Browncoat Way' scenario", () => {
    // Helper to robustly find and click the "Next" button, accounting for
    // separate mobile/desktop buttons present in the JSDOM environment.
    const clickNext = async () => {
      const nextButtons = await screen.findAllByRole('button', { name: /Next Step/i });
      expect(nextButtons.length).toBeGreaterThan(0);
      fireEvent.click(nextButtons[0]);
    };

    beforeEach(async () => {
      render(<App />);

      // --- Step 1: Captain Setup ---
      await screen.findByText('Number of Captains');
      fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

      // --- Step 2: Setup Card Selection ---
      await screen.findByRole('heading', { name: /Select Setup Card/i });
      fireEvent.click(screen.getByRole('button', { name: /The Browncoat Way.*A harder economy/i }));
      fireEvent.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

      // --- Step 3: Optional Rules ---
      await screen.findByRole('heading', { name: /Optional Rules/i });
      fireEvent.click(screen.getByRole('button', { name: /Begin Setup Sequence/i }));
      
      // --- Navigate to first "real" step to select a story ---
      await screen.findByRole('heading', { name: /Goal of the Game/i });
      fireEvent.click(await screen.findByRole('button', { name: /Harken's Folly/i }));
      await clickNext();
      
      // Wait for the final navigation in the setup to complete before any tests run.
      await screen.findByRole('heading', { name: /Nav Decks/i });
    });

    it('shows the browncoat nav rules', async () => {
      expect(await screen.findByText('Forced Reshuffle')).toBeInTheDocument();
    });
    
    it('shows the correct starting capitol', async () => {
      await clickNext();
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i });

      await clickNext();
      await screen.findByRole('heading', { name: /Starting Capitol/i });

      expect(await screen.findByText('$12,000')).toBeInTheDocument();
    });
    
    it('shows the special Browncoat draft rules', async () => {
      await clickNext();
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i });
      
      await clickNext();
      await screen.findByRole('heading', { name: /Starting Capitol/i });

      await clickNext();
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i });

      expect(await screen.findByText('Browncoat Market')).toBeInTheDocument();
    });

    it('shows the "no jobs" rule', async () => {
      await clickNext();
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i });

      await clickNext();
      await screen.findByRole('heading', { name: /Starting Capitol/i });

      await clickNext();
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i });

      await clickNext();
      await screen.findByRole('heading', { name: /Starting Jobs/i });

      expect(await screen.findByText('No Starting Jobs.')).toBeInTheDocument();
    });

    it('shows the correct final summary', async () => {
      await clickNext(); // Nav -> A&R
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i });
      
      await clickNext(); // A&R -> Capitol
      await screen.findByRole('heading', { name: /Starting Capitol/i });
      
      await clickNext(); // Capitol -> Draft
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i });
      
      await clickNext(); // Draft -> Jobs
      await screen.findByRole('heading', { name: /Starting Jobs/i });
      
      await clickNext(); // Jobs -> Prime
      await screen.findByRole('heading', { name: /Priming The Pump/i });
      
      await clickNext(); // Prime -> Final
      await screen.findByRole('heading', { name: /You are ready to fly!/i });
      
      const flightManifest = screen.getByRole('heading', { name: /Flight Manifest/i });
      const summaryContainer = flightManifest.parentElement;
      // FIX: Add a null check for summaryContainer to satisfy TypeScript.
      // The `parentElement` can be null, which `within()` does not accept.
      expect(summaryContainer).not.toBeNull();

      expect(within(summaryContainer!).getByText(/The Browncoat Way/i)).toBeInTheDocument();
      expect(within(summaryContainer!).getByText(/Harken's Folly/i)).toBeInTheDocument();
    });
  });

  it('correctly displays rules for "Smuggler\'s Blues" based on expansions', async () => {
    const initialState: GameState = getDefaultGameState();
    initialState.expansions.kalidasa = false;
    initialState.selectedStoryCard = "Smuggler's Blues";
    
    // Set wizard to step index 4 ("Alliance & Reaver Ships")
    localStorage.setItem('firefly_wizardStep_v3', JSON.stringify(4));
    
    // The GameStateProvider is inside App.tsx, so we must inject the initial state
    // via localStorage for it to be picked up. Passing it to render() would only
    // affect an outer provider from test-utils that App doesn't use.
    localStorage.setItem('firefly_gameState_v3', JSON.stringify(initialState));
    render(<App />);

    // "Smuggler's Blues" can create two "Story Override" blocks. We need to find all of them
    // and then identify the correct one by its content.
    const allStoryOverrideBlocks = await screen.findAllByRole('region', { name: /Story Override/i });

    // Find the specific block that talks about Contraband.
    const contrabandRuleBlock = allStoryOverrideBlocks.find(block => 
      block.textContent?.includes('Contraband')
    );
    
    // Assert that we found the block and it has the correct full text.
    expect(contrabandRuleBlock).toBeInTheDocument();
    expect(contrabandRuleBlock).toHaveTextContent(
      'Place 3 Contraband on each Planetary Sector in Alliance Space.'
    );
  });
});
