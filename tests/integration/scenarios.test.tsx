/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
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
    fireEvent.click(screen.getByRole('button', { name: /The Browncoat Way.*A harder economy/i }));
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
      expect(screen.getByRole('heading', { name: /Goal of the Game/i })).toBeInTheDocument();
    });
    // Select a story to proceed
    fireEvent.click(await screen.findByRole('button', { name: /Harken's Folly/i }));
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
    const finalScreen = screen.getByRole('heading', { name: /You are ready to fly!/i });
    const summaryContainer = finalScreen.closest('div[class*="animate-fade-in-up"]');
    expect(summaryContainer).toBeInTheDocument();
    // FIX: The `within` function expects an HTMLElement, but `closest` returns a more generic `Element`.
    // We cast `summaryContainer` to `HTMLElement` to satisfy the type checker.
    expect(within(summaryContainer as HTMLElement).getByText(/The Browncoat Way/i)).toBeInTheDocument();
    expect(within(summaryContainer as HTMLElement).getByText(/Harken's Folly/i)).toBeInTheDocument();
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
    // Select standard setup to enable the next button
    fireEvent.click(screen.getByRole('button', { name: /Standard Game Setup/i }));
    // Because 10th Anniversary is on by default, we have to go through the Optional Rules screen.
    fireEvent.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

    // --- Step 3: Optional Rules ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Optional Rules/i })).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /Begin Setup Sequence/i }));

    // --- Step C1: Nav Decks ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Nav Decks/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // --- Step C2: Alliance & Reaver Ships ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Alliance & Reaver Ships/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    
    // --- Step C3: Choose Ships & Leaders ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Choose Ships & Leaders/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

    // --- Step C4: Goal of the Game (Mission Dossier) ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Goal of the Game/i })).toBeInTheDocument();
    });
    // Select the "Smuggler's Blues" story to update the game state
    const storyButton = await screen.findByRole('button', { name: /Smuggler's Blues/i });
    fireEvent.click(storyButton);
    
    // Wait for the dossier to render with the new story's details before jumping
    await waitFor(() => {
      // When the story is selected, the StoryDossier renders a SpecialRuleBlock
      // with the title "Story Override" and the card's setupDescription.
      const storyOverrideHeader = screen.getByRole('heading', { name: /Story Override/i });
      
      // Find the container of this specific rule block.
      const ruleBlockContainer = storyOverrideHeader.closest('div[class*="border-l-4"]');
      expect(ruleBlockContainer).toBeInTheDocument();
    
      // Verify that the setup text is within this block, which confirms the dossier
      // has rendered and disambiguates from the same text in the StoryCardGridItem.
      const ruleText = within(ruleBlockContainer as HTMLElement).getByText(/Place 3 Contraband in Alliance sectors/i);
      expect(ruleText).toBeInTheDocument();
    });
    
    // --- Jump back to Step C2 to verify rules are applied ---
    const shipsProgressBarButton = screen.getByRole('button', { name: /Jump to Ships step/i });
    fireEvent.click(shipsProgressBarButton);
    
    // --- Step C2: Alliance & Reaver Ships (revisited) ---
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Alliance & Reaver Ships/i })).toBeInTheDocument();
    });

    // Assert that the correct "Alliance Space" contraband rule is displayed because Kalidasa is off
    // The text is split by a <strong> tag, so we need a custom matcher function.
    const allianceSpaceRule = await screen.findByText((content, element) => {
        const hasText = (node: Element | null) => 
            /Place 3 Contraband on each Planetary Sector in Alliance Space/i.test(node?.textContent || '');
        
        const elementHasText = hasText(element);
        const childrenDontHaveText = Array.from(element?.children || []).every(
            child => !hasText(child)
        );

        return elementHasText && childrenDontHaveText;
    });
    expect(allianceSpaceRule).toBeInTheDocument();

    // Assert that the rule for starting with an Alert Card is also present
    const alertCardRule = await screen.findByText(/Begin the game with one random Alliance Alert Card in play/i);
    expect(alertCardRule).toBeInTheDocument();
  });
});