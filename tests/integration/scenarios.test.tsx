/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { render, user } from '../test-utils';
import App from '../../App';
import { getDefaultGameState } from '../../state/reducer';
import { GameState } from '../../types';
// FIX: SETUP_CARDS is not exported from storyCards. It's in its own file.
import { STORY_CARDS } from '../../data/storyCards';
import { SETUP_CARDS } from '../../data/setupCards';
import { SETUP_CARD_IDS } from '../../data/ids';

// Helper to get card definitions robustly
const getStory = (title: string) => {
    const card = STORY_CARDS.find(c => c.title === title);
    if (!card) throw new Error(`Test setup failed: Story card "${title}" not found.`);
    return card;
};
const getSetup = (id: string) => {
    const card = SETUP_CARDS.find(c => c.id === id);
    if (!card) throw new Error(`Test setup failed: Setup card with id "${id}" not found.`);
    return card;
};

describe('Integration Scenarios', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("'The Browncoat Way' scenario", () => {
    // Decouple from hardcoded strings by using data definitions
    const browncoatCard = getSetup(SETUP_CARD_IDS.THE_BROWNCOAT_WAY);
    const harkensFollyCard = getStory("Harken's Folly");

    const clickNext = async () => {
      const nextButtons = await screen.findAllByRole('button', { name: /Next Step/i });
      expect(nextButtons.length).toBeGreaterThan(0);
      await user.click(nextButtons[0]);
    };

    beforeEach(async () => {
      render(<App />);

      // --- Step 1: Captain Setup ---
      await screen.findByText('Number of Captains');
      await user.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

      // --- Step 2: Setup Card Selection ---
      await screen.findByRole('heading', { name: /Select Setup Card/i });
      // Use a regex with the label from the card definition
      await user.click(screen.getByRole('button', { name: new RegExp(browncoatCard.label) }));
      await user.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

      // --- Step 3: Optional Rules ---
      await screen.findByRole('heading', { name: /Optional Rules/i });
      await user.click(screen.getByRole('button', { name: /Begin Setup Sequence/i }));
      
      // --- Navigate to first "real" step to select a story ---
      await screen.findByRole('heading', { name: /Goal of the Game/i });
      // Use a regex with the title from the card definition
      await user.click(await screen.findByRole('button', { name: new RegExp(harkensFollyCard.title) }));
      await clickNext();
      
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
      await clickNext(); // Nav -> A&R
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i });
      
      await clickNext(); // A&R -> Capitol
      await screen.findByRole('heading', { name: /Starting Capitol/i });
      
      await clickNext(); // Capitol -> Draft
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i });
      
      await clickNext(); // Draft -> Jobs
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
      expect(summaryContainer).not.toBeNull();

      // Use regex with card labels/titles for resilient assertions
      expect(within(summaryContainer!).getByText(new RegExp(browncoatCard.label))).toBeInTheDocument();
      expect(within(summaryContainer!).getByText(new RegExp(harkensFollyCard.title))).toBeInTheDocument();
    });
  });

  it('correctly displays rules for "Smuggler\'s Blues" based on expansions', async () => {
    const smugglersBluesCard = getStory("Smuggler's Blues");
    const initialState: GameState = getDefaultGameState();
    initialState.expansions.kalidasa = false;
    initialState.selectedStoryCard = smugglersBluesCard.title;
    
    localStorage.setItem('firefly_wizardStep_v3', JSON.stringify(4));
    localStorage.setItem('firefly_gameState_v3', JSON.stringify(initialState));
    render(<App />);

    const allStoryOverrideBlocks = await screen.findAllByRole('region', { name: /Story Override/i });
    const contrabandRuleBlock = allStoryOverrideBlocks.find(block => 
      block.textContent?.includes('Contraband')
    );
    
    expect(contrabandRuleBlock).toBeInTheDocument();
    expect(contrabandRuleBlock).toHaveTextContent(
      'Place 3 Contraband on each Planetary Sector in Alliance Space.'
    );
  });
});