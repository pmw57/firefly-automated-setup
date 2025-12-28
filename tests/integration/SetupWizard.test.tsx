/** @vitest-environment jsdom */
import { describe, it, expect, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../test-utils';
import App from '../../App';

describe('SetupWizard integration', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('should render the first step (CaptainSetup) and allow navigation to the next step and back', async () => {
        render(<App />);

        // Wait for the initial step (CaptainSetup) to load.
        // We look for a unique piece of text from that component.
        await waitFor(() => {
            expect(screen.getByText('Number of Captains')).toBeInTheDocument();
        });

        // Find the "Next" button within the CaptainSetup step.
        const nextButton = screen.getByRole('button', { name: /Next: Choose Setup Card/i });
        fireEvent.click(nextButton);

        // After clicking, we should be on the SetupCardSelection step.
        // We wait for its unique heading to appear.
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Select Setup Card/i })).toBeInTheDocument();
        });

        // Find the "Back" button within the SetupCardSelection step.
        const backButton = screen.getByRole('button', { name: /← Back/i });
        fireEvent.click(backButton);

        // After clicking back, we should be on the CaptainSetup step again.
        await waitFor(() => {
            expect(screen.getByText('Number of Captains')).toBeInTheDocument();
        });
    });
});
