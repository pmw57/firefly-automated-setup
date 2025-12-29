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

    it('should render the first step (CaptainSetup) and allow navigation to the next step and back', async () => {
        render(<App />);

        const initialHeaderText = await screen.findByText('Number of Captains', {}, { timeout: 5000 });
        expect(initialHeaderText).toBeInTheDocument();

        const nextButton = screen.getByRole('button', { name: /Next: Choose Setup Card/i });
        await user.click(nextButton);

        const setupCardHeading = await screen.findByRole('heading', { name: /Select Setup Card/i });
        expect(setupCardHeading).toBeInTheDocument();
        
        // Example of decoupling a test: Find the "Browncoat Way" card definition
        const browncoatCard = SETUP_CARDS.find(c => c.id === SETUP_CARD_IDS.THE_BROWNCOAT_WAY);
        expect(browncoatCard).toBeDefined();

        // Use the card's actual label and description to build a more robust selector
        const browncoatRegex = new RegExp(`${browncoatCard!.label}.*${browncoatCard!.description}`);
        const browncoatButton = await screen.findByRole('button', { name: browncoatRegex });
        expect(browncoatButton).toBeInTheDocument();

        const backButton = screen.getByRole('button', { name: /← Back/i });
        await user.click(backButton);

        const returnedHeaderText = await screen.findByText('Number of Captains');
        expect(returnedHeaderText).toBeInTheDocument();
    });
});