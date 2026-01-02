import React, { useMemo } from 'react';
import { Expansions } from '../types';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { PlayerConfigSection } from './setup/PlayerConfigSection';
import { CampaignConfigSection } from './setup/CampaignConfigSection';
import { ExpansionListSection } from './setup/ExpansionListSection';
import { getSetupCardSelectionInfo } from '../utils/ui';

interface CaptainSetupProps {
  onNext: () => void;
  isDevMode?: boolean;
}

export const CaptainSetup = ({ onNext, isDevMode }: CaptainSetupProps): React.ReactElement => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;
  
  const { totalParts } = useMemo(() => getSetupCardSelectionInfo(gameState), [gameState]);

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

  // Styles
  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const textColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const partBadgeBg = isDark ? 'bg-yellow-900/40' : 'bg-[#fef3c7]';
  const partBadgeText = isDark ? 'text-yellow-100' : 'text-[#92400e]';

  return (
    <div className={`bg-metal rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in relative overflow-hidden transition-all duration-300`}>
      
      <div className={`flex justify-between items-center mb-6 border-b-2 ${inputBorder} pb-2 relative z-10`}>
         <h2 className={`text-2xl font-bold font-western drop-shadow-sm ${textColor}`}>Config</h2>
         <span className={`text-xs font-bold ${partBadgeBg} ${partBadgeText} border ${isDark ? 'border-yellow-700/50' : 'border-[#d4af37]'} px-3 py-1 rounded-full shadow-sm`}>Part 1 of {totalParts}</span>
      </div>
      
      <PlayerConfigSection 
        playerCount={gameState.playerCount}
        playerNames={gameState.playerNames}
        isSolo={isSolo}
        onCountChange={updatePlayerCount}
        onNameChange={handleNameChange}
      />
      
      {isSolo && has10th && (
        <CampaignConfigSection 
            isCampaign={gameState.isCampaign}
            storiesCompleted={gameState.campaignStoriesCompleted}
            onToggle={handleCampaignToggle}
            onStoriesChange={updateCampaignStories}
        />
      )}

      <ExpansionListSection 
        expansions={gameState.expansions}
        onToggle={handleExpansionChange}
        has10th={has10th}
        isDevMode={isDevMode}
      />

      <div className="flex gap-4 relative z-10">
        <Button onClick={onNext} fullWidth className={'w-full text-lg py-4 border-b-4 border-[#450a0a]'}>
          Next: Choose Setup →
        </Button>
      </div>
    </div>
  );
};