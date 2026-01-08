import { useContext } from 'react';
import { WizardStateContext, WizardStateContextType } from './useGameState';

export const useWizardState = (): WizardStateContextType => {
  const context = useContext(WizardStateContext);
  if (context === undefined) {
    throw new Error('useWizardState must be used within a GameStateProvider');
  }
  return context;
};
