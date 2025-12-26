/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
// FIX: `fireEvent` and `within` are not exported from `test-utils`, import from `@testing-library/react` instead.
import { fireEvent, within } from '@testing-library/react';
import { render } from '../test-utils';
import { CaptainSetup } from '../../components/CaptainSetup';

vi.mock('../../components/setup/PlayerConfigSection', () => ({
  PlayerConfigSection: vi.fn(() => <div data-testid="mock-player-config-section" />),
}));

vi.mock('../../components/setup/CampaignConfigSection', () => ({
  CampaignConfigSection: vi.fn(() => <div data-testid="mock-campaign-config-section" />),
}));

vi.mock('../../components/setup/ExpansionListSection', () => ({
  ExpansionListSection: vi.fn(() => <div data-testid="mock-expansion-list-section" />),
}));

describe('components/CaptainSetup', () => {
  const mockOnNext = vi.fn();

  it.concurrent('renders without crashing', () => {
    const { container } = render(<CaptainSetup onNext={mockOnNext} />);
    expect(within(container).getByText('Config')).toBeInTheDocument();
    expect(within(container).getByTestId('mock-player-config-section')).toBeInTheDocument();
    expect(within(container).getByTestId('mock-expansion-list-section')).toBeInTheDocument();
  });

  it.concurrent('triggers onNext callback when Next button is clicked', () => {
    const { container } = render(<CaptainSetup onNext={mockOnNext} />);
    
    const nextButton = within(container).getByRole('button', { name: 'Next: Choose Setup Card →' });
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalled();
  });
});