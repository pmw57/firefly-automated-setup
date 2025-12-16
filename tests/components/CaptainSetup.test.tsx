
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaptainSetup } from '../../components/CaptainSetup';
import { GameStateContext } from '../../hooks/useGameState';
import { GameState } from '../../types';
import { getDefaultGameState } from '../../utils/state';
import React from 'react';

// Mock the useGameState to provide a controllable state
const mockSetGameState = vi.fn();
const mockOnNext = vi.fn();

const renderWithState = (initialState: GameState) => {
  return render(
    <GameStateContext.Provider value={{
      gameState: initialState,
      setGameState: mockSetGameState,
      isStateInitialized: true,
      resetGameState: vi.fn(),
    }}>
      <CaptainSetup onNext={mockOnNext} />
    </GameStateContext.Provider>
  );
};

describe('components/CaptainSetup', () => {
  beforeEach(() => {
    mockSetGameState.mockClear();
    mockOnNext.mockClear();
  });

  it('renders with default 4 players', () => {
    renderWithState(getDefaultGameState());
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(4);
    expect(screen.getByDisplayValue('Captain 1')).toBeInTheDocument();
  });

  it('calls setGameState to increase player count when "+" is clicked', () => {
    renderWithState(getDefaultGameState());
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    // We expect setGameState to be called with a function
    expect(mockSetGameState).toHaveBeenCalledOnce();
    const updaterFn = mockSetGameState.mock.calls[0][0];
    const newState = updaterFn(getDefaultGameState());
    expect(newState.playerCount).toBe(5);
  });

  it('calls setGameState to decrease player count when "-" is clicked', () => {
    renderWithState(getDefaultGameState());
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);
    
    const updaterFn = mockSetGameState.mock.calls[0][0];
    const newState = updaterFn(getDefaultGameState());
    expect(newState.playerCount).toBe(3);
  });

  it('updates a player name on input change', () => {
    renderWithState(getDefaultGameState());
    const player1Input = screen.getByDisplayValue('Captain 1');
    fireEvent.change(player1Input, { target: { value: 'Mal' } });

    const updaterFn = mockSetGameState.mock.calls[0][0];
    const newState = updaterFn(getDefaultGameState());
    expect(newState.playerNames[0]).toBe('Mal');
  });

  it('toggles an expansion when clicked', () => {
    renderWithState(getDefaultGameState());
    const blueSunToggle = screen.getByText("Blue Sun").closest('div[role="switch"]');
    expect(blueSunToggle).not.toBeNull();
    fireEvent.click(blueSunToggle!);

    const updaterFn = mockSetGameState.mock.calls[0][0];
    const newState = updaterFn(getDefaultGameState());
    expect(newState.expansions.blue).toBe(true);
  });

  it('calls onNext when the next button is clicked', () => {
    renderWithState(getDefaultGameState());
    const nextButton = screen.getByText(/Next: Choose Setup Card/);
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledOnce();
  });

  it('shows campaign mode options only for solo games', () => {
    const multiState = getDefaultGameState();
    const { rerender } = renderWithState(multiState);
    expect(screen.queryByText('Continuing a Solo Campaign?')).not.toBeInTheDocument();
    
    const soloState: GameState = { ...getDefaultGameState(), gameMode: 'solo', playerCount: 1 };
    rerender(
      <GameStateContext.Provider value={{ gameState: soloState, setGameState: mockSetGameState, isStateInitialized: true, resetGameState: vi.fn() }}>
        <CaptainSetup onNext={mockOnNext} />
      </GameStateContext.Provider>
    );
    expect(screen.getByText('Continuing a Solo Campaign?')).toBeInTheDocument();
  });
});