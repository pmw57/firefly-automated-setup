import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CaptainSetup } from '../../components/CaptainSetup';
import { GameStateContext } from '../../hooks/useGameState';
import { GameState } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { ActionType } from '../../state/actions';
import React from 'react';

// Mock the useGameState to provide a controllable state
const mockDispatch = vi.fn();
const mockOnNext = vi.fn();

const renderWithState = (initialState: GameState) => {
  return render(
    <GameStateContext.Provider value={{
      state: initialState,
      dispatch: mockDispatch,
      isStateInitialized: true,
      resetGameState: vi.fn(),
    }}>
      <CaptainSetup onNext={mockOnNext} />
    </GameStateContext.Provider>
  );
};

describe('components/CaptainSetup', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    mockOnNext.mockClear();
  });

  it('renders with default 4 players', () => {
    renderWithState(getDefaultGameState());
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(4);
    expect(screen.getByDisplayValue('Captain 1')).toBeInTheDocument();
  });

  it('dispatches SET_PLAYER_COUNT to increase player count when "+" is clicked', () => {
    renderWithState(getDefaultGameState());
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ActionType.SET_PLAYER_COUNT,
      payload: 5
    });
  });

  it('dispatches SET_PLAYER_COUNT to decrease player count when "-" is clicked', () => {
    renderWithState(getDefaultGameState());
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: ActionType.SET_PLAYER_COUNT,
      payload: 3
    });
  });

  it('dispatches SET_PLAYER_NAME on input change', () => {
    renderWithState(getDefaultGameState());
    const player1Input = screen.getByDisplayValue('Captain 1');
    fireEvent.change(player1Input, { target: { value: 'Mal' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ActionType.SET_PLAYER_NAME,
      payload: { index: 0, name: 'Mal' }
    });
  });

  it('dispatches TOGGLE_EXPANSION when clicked', () => {
    renderWithState(getDefaultGameState());
    const blueSunToggle = screen.getByText("Blue Sun").closest('div[role="switch"]');
    expect(blueSunToggle).not.toBeNull();
    fireEvent.click(blueSunToggle!);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ActionType.TOGGLE_EXPANSION,
      payload: 'blue'
    });
  });

  it('calls onNext and dispatches auto-select when the next button is clicked', () => {
    renderWithState(getDefaultGameState());
    const nextButton = screen.getByText(/Next: Choose Setup Card/);
    fireEvent.click(nextButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: ActionType.AUTO_SELECT_FLYING_SOLO });
    expect(mockOnNext).toHaveBeenCalledOnce();
  });

  it('shows campaign mode options only for solo games', () => {
    const multiState = getDefaultGameState();
    const { rerender } = renderWithState(multiState);
    expect(screen.queryByText('Continuing a Solo Campaign?')).not.toBeInTheDocument();
    
    const soloState: GameState = { ...getDefaultGameState(), gameMode: 'solo', playerCount: 1 };
    rerender(
      <GameStateContext.Provider value={{ state: soloState, dispatch: mockDispatch, isStateInitialized: true, resetGameState: vi.fn() }}>
        <CaptainSetup onNext={mockOnNext} />
      </GameStateContext.Provider>
    );
    expect(screen.getByText('Continuing a Solo Campaign?')).toBeInTheDocument();
  });
});
