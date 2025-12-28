
/* eslint-disable react-refresh/only-export-components */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../components/ThemeProvider';
import { GameStateProvider } from '../components/GameStateContext';
import { GameState } from '../types';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: GameState;
}

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ThemeProvider>
      <GameStateProvider initialState={options?.initialState}>
        {children}
      </GameStateProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};


export * from '@testing-library/react';
export { customRender as render };
