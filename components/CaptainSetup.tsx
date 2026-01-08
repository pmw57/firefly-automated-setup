import React, { useMemo } from 'react';
import { Expansions } from '../types/index';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
// FIX: Import `useGameDispatch` to correctly dispatch actions to the game state reducer.
import { useGameDispatch } from '../hooks/useGameDispatch';
import { PlayerConfigSection } from './setup/PlayerConfigSection';
import { CampaignConfigSection } from './setup/CampaignConfigSection';
import { ExpansionListSection } from './setup/ExpansionListSection';
import { isFlyingSoloEligible } from '../utils/ui';
import { calculateSetupFlow } from '../utils/flow';

interface CaptainSetupProps {
  isDevMode?: boolean;
}

export const CaptainSetup = ({ isDevMode }: CaptainSetupProps): React.ReactElement => {
  // FIX: Destructure only the relevant state properties from `useGameState`.
  const { state: gameState } = useGameState();
  // FIX: Get the dispatch function and action creators from `useGameDispatch`.
  const {
    setPlayerCount,
    setPlayerName,
    toggleExpansion,
    setCampaignMode,
    setCampaignStories,
  } = useGameDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;
  
  const totalParts = useMemo(() => calculateSetupFlow(gameState).filter(s => s.type === 'setup').length, [gameState]);

  // Handlers - Dispatch actions
  const updatePlayerCount = (newCount: number) => {
    setPlayerCount(newCount);
  };

  const handleNameChange = (index: number, value: string) => {
    setPlayerName(index, value);
  };

  const handleExpansionChange = (key: keyof Expansions) => {
    toggleExpansion(key);
  };

  const handleCampaignToggle = () => {
    setCampaignMode(!gameState.isCampaign);
  };

  const updateCampaignStories = (newCount: number) => {
    setCampaignStories(newCount);
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
        setupMode={gameState.setupMode}
        onCountChange={updatePlayerCount}
        onNameChange={handleNameChange}
      />
      
      {isFlyingSoloEligible(gameState) && (
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
    </div>
  );
};
