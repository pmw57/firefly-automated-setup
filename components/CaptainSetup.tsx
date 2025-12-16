import React from 'react';
import { Expansions } from '../types';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CARD_IDS } from '../data/ids';
import { Button } from './Button';
import { ExpansionToggle } from './ExpansionToggle';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';

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
  
  const totalParts = gameState.expansions.tenth || isFlyingSolo ? 3 : 2;

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
  const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
  const inputBg = isDark ? 'bg-black' : 'bg-[#faf8ef]';
  const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const partBadgeBg = isDark ? 'bg-yellow-900/40' : 'bg-[#fef3c7]';
  const partBadgeText = isDark ? 'text-yellow-100' : 'text-[#92400e]';

  return (
    <div className={`bg-metal rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in relative overflow-hidden transition-all duration-300`}>
      
      <div className={`flex justify-between items-center mb-6 border-b-2 ${inputBorder} pb-2 relative z-10`}>
         <h2 className={`text-2xl font-bold font-western drop-shadow-sm ${textColor}`}>Mission Configuration</h2>
         <span className={`text-xs font-bold ${partBadgeBg} ${partBadgeText} border ${isDark ? 'border-yellow-700/50' : 'border-[#d4af37]'} px-3 py-1 rounded-full shadow-sm`}>Part 1 of {totalParts}</span>
      </div>
      
      {/* Player Count */}
      <div className="mb-8 relative z-10">
        <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Number of Captains</label>
        <div className="flex items-center space-x-4 mb-4 select-none">
          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount - 1)}
            disabled={gameState.playerCount <= 1}
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
          >
            -
          </button>
          <div className={`w-16 h-12 flex items-center justify-center text-4xl font-bold font-western drop-shadow-md ${textColor}`}>
            {gameState.playerCount}
          </div>
          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount + 1)}
            disabled={gameState.playerCount >= 9}
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
          >
            +
          </button>
          <span className={`italic ml-2 font-serif ${isDark ? 'text-zinc-500' : 'text-[#a8a29e]'}`}>
            {isSolo ? '(Solo Mode)' : 'Crew Manifests'}
          </span>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isDark ? 'bg-black/30' : 'bg-[#e7e5e4]/30'} p-4 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-[#d6cbb0]'} shadow-inner`}>
          {gameState.playerNames.map((name, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`player-${index}`} className={`text-xs font-bold w-6 mr-1 font-mono ${isDark ? 'text-zinc-500' : 'text-[#a8a29e]'}`}>{index + 1}.</label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Captain ${index + 1}`}
                className={`w-full p-2 border ${inputBorder} rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none ${inputBg} shadow-sm font-medium ${inputText} ${isDark ? 'placeholder-zinc-600' : 'placeholder-[#a8a29e]'} transition-colors`}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Campaign Mode Section */}
      {isSolo && (
          <div className="mb-8 relative z-10">
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Campaign Mode</label>
            <div className={`${isDark ? 'bg-black/30' : 'bg-white/50'} p-4 rounded-lg border ${containerBorder} shadow-inner`}>
                <div 
                    onClick={handleCampaignToggle}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <label htmlFor="campaign-toggle" className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Continuing a Solo Campaign?
                    </label>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${gameState.isCampaign ? 'bg-green-600' : (isDark ? 'bg-zinc-600' : 'bg-gray-300')}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${gameState.isCampaign ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                {gameState.isCampaign && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-zinc-700 animate-fade-in">
                        <label className={`block text-sm font-medium mb-2 text-center ${labelColor}`}>
                            Stories Completed in Campaign
                        </label>
                        <div className="flex items-center justify-center space-x-4">
                          <button
                            type="button"
                            onClick={() => updateCampaignStories(gameState.campaignStoriesCompleted - 1)}
                            disabled={gameState.campaignStoriesCompleted <= 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                            aria-label="Decrease stories completed"
                          >
                            -
                          </button>
                          <div className={`w-14 h-10 flex items-center justify-center text-3xl font-bold font-western drop-shadow-md ${textColor}`}>
                              {gameState.campaignStoriesCompleted}
                          </div>
                          <button
                              type="button"
                              onClick={() => updateCampaignStories(gameState.campaignStoriesCompleted + 1)}
                              disabled={gameState.campaignStoriesCompleted >= 50}
                              className={`w-10 h-10 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                              aria-label="Increase stories completed"
                          >
                              +
                          </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Expansions */}
      <div className="mb-8 relative z-10">
        <label className={`block font-bold mb-3 uppercase tracking-wide text-xs ${labelColor}`}>Active Expansions</label>
        <div className="grid grid-cols-1 gap-4">
          {EXPANSIONS_METADATA.filter(e => e.id !== 'base').map((expansion) => (
            <ExpansionToggle 
              key={expansion.id}
              id={expansion.id as keyof Expansions} 
              label={expansion.label} 
              active={gameState.expansions[expansion.id as keyof Expansions]} 
              themeColor={expansion.themeColor}
              description={expansion.description}
              onToggle={handleExpansionChange}
            />
          ))}
        </div>
      </div>

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
