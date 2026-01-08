/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { screen, within } from '@testing-library/react';
import { render, user } from '../test-utils';
import App from '../../App';
import { getDefaultGameState } from '../../state/reducer';
import { GameState } from '../../types';
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
      // Use a more generic regex to find any 'Next' or 'Begin' button
      const nextButtons = await screen.findAllByRole('button', { name: /(^Next|Begin Setup)/i });
      expect(nextButtons.length).toBeGreaterThan(0);
      // Click the first one found, assuming it's the main progression button
      await user.click(nextButtons[0]);
    };

    beforeEach(async () => {
      render(<App />);

      // --- Step 1: Captain Setup ---
      await screen.findByRole('heading', { name: /Config/i });
      await clickNext();

      // --- Step 2: Setup Card Selection ---
      await screen.findByRole('heading', { name: /Select Setup Card/i });
      await user.click(await screen.findByRole('button', { name: new RegExp(browncoatCard.label) }));
      await clickNext();

      // --- Step 3: Optional Settings ---
      await screen.findByRole('heading', { name: /Options/i });
      await clickNext();
      
      // --- Navigate to first "real" step to select a story ---
      await screen.findByRole('heading', { name: /Goal of the Game/i, level: 2 });
      await user.click(await screen.findByRole('button', { name: new RegExp(harkensFollyCard.title) }));
      await clickNext();
      
      // --- Part 2: Advanced Rules (since 10th AE is on by default) ---
      await screen.findByRole('heading', { name: /^Advanced Rules$/i, level: 3 });
      await clickNext();

      await screen.findByRole('heading', { name: /Nav Decks/i, level: 2 });
    });

    it('shows the browncoat nav rules', async () => {
      expect(await screen.findByText('Forced Reshuffle')).toBeInTheDocument();
    });
    
    it('shows the correct starting capitol', async () => {
      await clickNext();
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i, level: 2 });

      await clickNext();
      await screen.findByRole('heading', { name: /Starting Capitol/i, level: 2 });

      expect(await screen.findByText('$12,000')).toBeInTheDocument();
    });
    
    it('shows the special Browncoat draft rules', async () => {
      await clickNext(); // Nav -> A&R
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i, level: 2 });
      
      await clickNext(); // A&R -> Capitol
      await screen.findByRole('heading', { name: /Starting Capitol/i, level: 2 });

      await clickNext(); // Capitol -> Draft
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i, level: 2 });

      expect(await screen.findByText('Browncoat Market')).toBeInTheDocument();
    });

    it('shows the "no jobs" rule', async () => {
      await clickNext(); // Nav -> A&R
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i, level: 2 });
      
      await clickNext(); // A&R -> Capitol
      await screen.findByRole('heading', { name: /Starting Capitol/i, level: 2 });
      
      await clickNext(); // Capitol -> Draft
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i, level: 2 });
      
      await clickNext(); // Draft -> Jobs
      await screen.findByRole('heading', { name: /Starting Jobs/i, level: 2 });

      expect(await screen.findByRole('heading', { name: 'No Starting Jobs' })).toBeInTheDocument();
    });

    it('shows the correct final summary', async () => {
      await clickNext(); // Nav -> A&R
      await screen.findByRole('heading', { name: /Alliance & Reaver Ships/i, level: 2 });
      
      await clickNext(); // A&R -> Capitol
      await screen.findByRole('heading', { name: /Starting Capitol/i, level: 2 });
      
      await clickNext(); // Capitol -> Draft
      await screen.findByRole('heading', { name: /Choose Ships & Leaders/i, level: 2 });
      
      await clickNext(); // Draft -> Jobs
      await screen.findByRole('heading', { name: /Starting Jobs/i, level: 2 });
      
      await clickNext(); // Jobs -> Prime
      await screen.findByRole('heading', { name: /Priming The Pump/i, level: 2 });
      
      await clickNext(); // Prime -> Final
      await screen.findByRole('heading', { name: /You are ready to fly!/i, level: 2 });
      
      const flightManifest = await screen.findByRole('heading', { name: /Flight Manifest/i });
      const summaryContainer = flightManifest.parentElement;
      expect(summaryContainer).not.toBeNull();

      expect(await within(summaryContainer!).findByText(new RegExp(browncoatCard.label))).toBeInTheDocument();
      expect(await within(summaryContainer!).findByText(new RegExp(harkensFollyCard.title))).toBeInTheDocument();
    });
  });

  it('correctly displays rules for "Smuggler\'s Blues" based on expansions', async () => {
    const smugglersBluesCard = getStory("Smuggler's Blues");
    const smugglersBluesIndex = STORY_CARDS.findIndex(c => c.title === smugglersBluesCard.title);
    const initialState: GameState = getDefaultGameState();
    initialState.expansions.kalidasa = false;
    initialState.selectedStoryCardIndex = smugglersBluesIndex;
    
    // The contraband rule for Smuggler's Blues is shown on the Resources step (C5), which is at index 7.
    localStorage.setItem('firefly_wizardStep_v3', JSON.stringify(7));
    localStorage.setItem('firefly_gameState_v3', JSON.stringify(initialState));
    render(<App />);

    const ruleBlock = await screen.findByRole('region', { name: "Story Override Smuggler's Blues Contraband" });
    expect(ruleBlock).toHaveTextContent(/Place 3 Contraband on each planetary sector in Alliance Space/i);
  });
});