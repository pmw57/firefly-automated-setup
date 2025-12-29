/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render, user } from '../test-utils';
import App from '../../App';
import { SETUP_CARDS } from '../../data/setupCards';
import { SETUP_CARD_IDS } from '../../data/ids';

describe('SetupWizard integration', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('when navigating through the wizard', () => {
    it('allows moving forward to the next step and back to the previous step', async () => {
      render(<App />);

      const initialHeading = await screen.findByRole('heading', { name: /Config/i }, { timeout: 5000 });
      expect(initialHeading).toBeInTheDocument();

      // FIX: Use async `findByRole` to prevent race conditions. This is a best
      // practice that makes tests more robust by waiting for elements to appear.
      const nextButton = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
      await user.click(nextButton);

      const setupCardHeading = await screen.findByRole('heading', { name: /Select Setup Card/i });
      expect(setupCardHeading).toBeInTheDocument();

      const browncoatCard = SETUP_CARDS.find(c => c.id === SETUP_CARD_IDS.THE_BROWNCOAT_WAY)!;
      const browncoatRegex = new RegExp(`${browncoatCard.label}.*${browncoatCard.description}`);
      const browncoatButton = await screen.findByRole('button', { name: browncoatRegex });
      expect(browncoatButton).toBeInTheDocument();

      // FIX: Use async `findByRole` to ensure the UI is stable before interaction.
      const backButton = await screen.findByRole('button', { name: /← Back/i });
      await user.click(backButton);

      // Verify returning to the first step
      const returnedHeading = await screen.findByRole('heading', { name: /Config/i });
      expect(returnedHeading).toBeInTheDocument();
    });
  });
});