
/** @vitest-environment jsdom */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render, user } from '../test-utils';
import App from '../../App';

describe('SetupWizard integration', () => {
    afterEach(() => {
        localStorage.clear();
        // Add mock restoration for better test isolation, matching other integration tests.
        vi.restoreAllMocks();
    });

    it('should render the first step (CaptainSetup) and allow navigation to the next step and back', async () => {
        render(<App />);

        // Use `findBy` which includes `waitFor` functionality. Increase timeout to make
        // the test more robust in slower CI environments.
        const initialHeaderText = await screen.findByText('Number of Captains', {}, { timeout: 5000 });
        expect(initialHeaderText).toBeInTheDocument();

        // Find the "Next" button within the CaptainSetup step.
        const nextButton = screen.getByRole('button', { name: /Next: Choose Setup Card/i });
        await user.click(nextButton);

        // After clicking, we should be on the SetupCardSelection step.
        const setupCardHeading = await screen.findByRole('heading', { name: /Select Setup Card/i });
        expect(setupCardHeading).toBeInTheDocument();

        // Find the "Back" button within the SetupCardSelection step.
        const backButton = screen.getByRole('button', { name: /← Back/i });
        await user.click(backButton);

        // After clicking back, we should be on the CaptainSetup step again.
        const returnedHeaderText = await screen.findByText('Number of Captains');
        expect(returnedHeaderText).toBeInTheDocument();
    });
});
