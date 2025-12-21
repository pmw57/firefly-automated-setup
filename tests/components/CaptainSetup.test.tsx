/** @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import { CaptainSetup } from '../../components/CaptainSetup';

describe('components/CaptainSetup', () => {
  const mockOnNext = vi.fn();

  it('renders with default 4 players', () => {
    // We rely on the default state provided by AllTheProviders in test-utils
    render(<CaptainSetup onNext={mockOnNext} />);
    
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(4);
    expect(screen.getByDisplayValue('Captain 1')).toBeInTheDocument();
  });

  it('updates player count and inputs when buttons are clicked', () => {
    render(<CaptainSetup onNext={mockOnNext} />);

    // Initial check
    expect(screen.getByText('4')).toBeInTheDocument();

    // Click Increase
    const increaseButton = screen.getByRole('button', { name: /Increase player count/i });
    fireEvent.click(increaseButton);

    // Verify UI update (Integration test)
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(5);
    expect(screen.getByPlaceholderText('Captain 5')).toBeInTheDocument();
    
    // Click Decrease
    const decreaseButton = screen.getByRole('button', { name: /Decrease player count/i });
    fireEvent.click(decreaseButton);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('updates player name on input change', () => {
    render(<CaptainSetup onNext={mockOnNext} />);
    
    const player1Input = screen.getByDisplayValue('Captain 1');
    fireEvent.change(player1Input, { target: { value: 'Mal Reynolds' } });
    
    expect(screen.getByDisplayValue('Mal Reynolds')).toBeInTheDocument();
  });

  it('toggles expansions', () => {
    render(<CaptainSetup onNext={mockOnNext} />);
    
    // Find the toggle for Blue Sun (initially active by default in test state)
    const blueSunToggle = screen.getByText("Blue Sun").closest('div[role="switch"]');
    expect(blueSunToggle).toBeInTheDocument();
    
    // Check initial state (should be active based on default game state)
    expect(blueSunToggle).toHaveAttribute('aria-checked', 'true');
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);

    // Click to toggle off
    fireEvent.click(blueSunToggle!);
    
    // Check updated state
    expect(blueSunToggle).toHaveAttribute('aria-checked', 'false');
  });

  it('triggers onNext callback when Next button is clicked', () => {
    render(<CaptainSetup onNext={mockOnNext} />);
    
    const nextButton = screen.getByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton);
    
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('shows campaign options when player count is reduced to 1', () => {
    render(<CaptainSetup onNext={mockOnNext} />);
    
    // Reduce players to 1
    const decreaseButton = screen.getByRole('button', { name: /Decrease player count/i });
    // Default is 4, click 3 times
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Check for Campaign UI
    expect(screen.getByText('Continuing a Solo Campaign?')).toBeInTheDocument();
  });
});