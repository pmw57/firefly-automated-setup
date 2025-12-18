import React from 'react';
import { Expansions } from '../types';
import { SETUP_CARD_IDS } from '../data/ids';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { PlayerConfigSection } from './setup/PlayerConfigSection';
import { CampaignConfigSection } from './setup/CampaignConfigSection';
import { ExpansionListSection } from './setup/ExpansionListSection';

interface CaptainSetupProps {
  onNext: () => void;
  onBack?: () => void;
}

export const CaptainSetup = ({ onNext, onBack }: CaptainSetupProps): React.ReactElement => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isSolo = gameState.gameMode === 'solo';
  const isFlyingSolo = gameState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
  const has10th = gameState.expansions.tenth;
  
  const totalParts = has10th || isFlyingSolo ? 3 : 2;

  // Handlers - Dispatch actions
  const updatePlayerCount = (newCount: number) => {
    dispatch({ type: ActionType.SET_PLAYER_COUNT, payload: newCount });
  };

  const handleNameChange = (index: number, value: string) => {
    dispatch({ type: ActionType.SET_PLAYER_NAME, payload: { index, name: value } });
  };

  const handleExpansionChange = (key: keyof Expansions) => {
    dispatch({ type: ActionType.TOGGLE_EXPANSION, payload: key });
  };

  const handleCampaignToggle = () => {
    dispatch({ type: ActionType.SET_CAMPAIGN_MODE, payload: !gameState.isCampaign });
  };

  const updateCampaignStories = (newCount: number) => {
    dispatch({ type: ActionType.SET_CAMPAIGN_STORIES, payload: newCount });
  };

  const handleNextStep = () => {
    // This state update pre-configures the next step if conditions are met.
    dispatch({ type: ActionType.AUTO_SELECT_FLYING_SOLO });
    onNext();
  };

  // Styles
  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const textColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const partBadgeBg = isDark ? 'bg-yellow-900/40' : 'bg-[#fef3c7]';
  const partBadgeText = isDark ? 'text-yellow-100' : 'text-[#92400e]';

  return (
    <div className={`bg-metal rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in relative overflow-hidden transition-all duration-300`}>
      
      <div className={`flex justify-between items-center mb-6 border-b-2 ${inputBorder} pb-2 relative z-10`}>
         <h2 className={`text-2xl font-bold font-western drop-shadow-sm ${textColor}`}>Mission Configuration</h2>
         <span className={`text-xs font-bold ${partBadgeBg} ${partBadgeText} border ${isDark ? 'border-yellow-700/50' : 'border-[#d4af37]'} px-3 py-1 rounded-full shadow-sm`}>Part 1 of {totalParts}</span>
      </div>
      
      <PlayerConfigSection 
        playerCount={gameState.playerCount}
        playerNames={gameState.playerNames}
        isSolo={isSolo}
        onCountChange={updatePlayerCount}
        onNameChange={handleNameChange}
      />
      
      {isSolo && (
        <CampaignConfigSection 
            isCampaign={gameState.isCampaign}
            storiesCompleted={gameState.campaignStoriesCompleted}
            onToggle={handleCampaignToggle}
            onStoriesChange={updateCampaignStories}
            has10th={has10th}
        />
      )}

      <ExpansionListSection 
        expansions={gameState.expansions}
        onToggle={handleExpansionChange}
        has10th={has10th}
      />

      <div className="flex gap-4 relative z-10">
        {onBack && (
          <Button onClick={onBack} variant="secondary" className="w-1/3">
            ← Back
          </Button>
        )}
        <Button onClick={handleNextStep} fullWidth className={`${onBack ? 'w-2/3' : 'w-full'} text-lg py-4 border-b-4 border-[#450a0a]`}>
          Next: Choose Setup Card →
        </Button>
      </div>
    </div>
  );
};