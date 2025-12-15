
import React from 'react';
import { GameState, Expansions } from '../types';
import { EXPANSIONS_METADATA, SETUP_CARDS } from '../constants';
import { Button } from './Button';
import { ExpansionToggle } from './ExpansionToggle';
import { useTheme } from './ThemeContext';

interface CaptainSetupProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
  onBack?: () => void;
}

export const CaptainSetup: React.FC<CaptainSetupProps> = ({ gameState, setGameState, onNext, onBack }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Is currently solo based on mode (which is synced with count)
  const isSolo = gameState.gameMode === 'solo';

  const updatePlayerCount = (newCount: number) => {
    const safeCount = Math.max(1, Math.min(9, newCount));
    
    setGameState(prev => {
      const newMode = safeCount === 1 ? 'solo' : 'multiplayer';
      
      // Update names array
      const newNames = [...prev.playerNames];
      if (safeCount > newNames.length) {
        for (let i = newNames.length; i < safeCount; i++) {
          newNames.push(`Captain ${i + 1}`);
        }
      } else {
        newNames.length = safeCount;
      }
      
      // Logic to reset setup card if switching modes makes the current one invalid
      let nextSetupCardId = prev.setupCardId;
      let nextSetupCardName = prev.setupCardName;
      let nextSecondary = prev.secondarySetupId;

      // If switching to Multiplayer, reset 'FlyingSolo' (which is solo only)
      if (newMode === 'multiplayer' && prev.setupCardId === 'FlyingSolo') {
          nextSetupCardId = 'Standard';
          nextSetupCardName = 'Standard Game Setup';
          nextSecondary = undefined;
      }
      
      // Note: We don't force reset when switching TO Solo, because Standard setup is valid for Solo (Classic Solo).
      // However, if we wanted to be helpful, we could default to Awful Lonely, but let's stick to valid-check.

      return { 
          ...prev, 
          playerCount: safeCount, 
          playerNames: newNames,
          gameMode: newMode,
          setupCardId: nextSetupCardId,
          setupCardName: nextSetupCardName,
          secondarySetupId: nextSecondary
      };
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setGameState(prev => {
      const newNames = [...prev.playerNames];
      newNames[index] = value;
      return { ...prev, playerNames: newNames };
    });
  };

  const handleExpansionChange = (key: keyof Expansions) => {
    setGameState(prev => {
      const nextExpansions = {
        ...prev.expansions,
        [key]: !prev.expansions[key]
      };

      // Synchronize gameEdition with the 10th Anniversary expansion toggle
      let nextEdition = prev.gameEdition;
      if (key === 'tenth') {
        nextEdition = nextExpansions.tenth ? 'tenth' : 'original';
      }

      // Reset setup card if requirements aren't met or if mode logic changes
      const currentSetup = SETUP_CARDS.find(s => s.id === prev.setupCardId);
      let nextSetupCardId = prev.setupCardId;
      let nextSetupCardName = prev.setupCardName;
      let nextSecondary = prev.secondarySetupId;

      // If current setup requires an expansion that was just disabled
      if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
          nextSetupCardId = 'Standard';
          nextSetupCardName = 'Standard Game Setup';
          nextSecondary = undefined; // Reset secondary if main reset
      }
      
      // If disabling 10th, and we were in Flying Solo mode (which is 10th only), reset.
      if (key === 'tenth' && !nextExpansions.tenth && prev.setupCardId === 'FlyingSolo') {
          nextSetupCardId = 'Standard';
          nextSetupCardName = 'Standard Game Setup';
          nextSecondary = undefined;
      }

      return {
        ...prev,
        expansions: nextExpansions,
        gameEdition: nextEdition,
        setupCardId: nextSetupCardId,
        setupCardName: nextSetupCardName,
        secondarySetupId: nextSecondary
      };
    });
  };

  // Theme Variables
  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const textColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
  const subLabelColor = isDark ? 'text-zinc-500' : 'text-[#a8a29e]';
  const inputBg = isDark ? 'bg-black' : 'bg-[#faf8ef]';
  const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const inputHover = isDark ? 'hover:bg-zinc-900' : 'hover:bg-[#f5f5f4]';
  const inputPlaceholder = isDark ? 'placeholder-zinc-600' : 'placeholder-[#a8a29e]';
  const cardBg = isDark ? 'bg-black/30' : 'bg-[#e7e5e4]/30';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const partBadgeBorder = isDark ? 'border-yellow-700/50' : 'border-[#d4af37]';
  const partBadgeBg = isDark ? 'bg-yellow-900/40' : 'bg-[#fef3c7]';
  const partBadgeText = isDark ? 'text-yellow-100' : 'text-[#92400e]';

  // Filter available expansions to show (hide 'base')
  const visibleExpansions = EXPANSIONS_METADATA.filter(e => e.id !== 'base');

  return (
    <div className={`bg-metal rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in relative overflow-hidden transition-all duration-300`}>
      {/* Decorative bolts */}
      {!isDark && (
        <>
          <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-stone-300 shadow-inner border border-stone-400"></div>
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-stone-300 shadow-inner border border-stone-400"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-stone-300 shadow-inner border border-stone-400"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-stone-300 shadow-inner border border-stone-400"></div>
        </>
      )}

      <div className={`flex justify-between items-center mb-6 border-b-2 ${inputBorder} pb-2 relative z-10`}>
         <h2 className={`text-2xl font-bold font-western drop-shadow-sm ${textColor}`}>Mission Configuration</h2>
         <span className={`text-xs font-bold ${partBadgeBg} ${partBadgeText} border ${partBadgeBorder} px-3 py-1 rounded-full shadow-sm`}>Part 1 of 2</span>
      </div>
      
      {/* Player Count & Names */}
      <div className="mb-8 relative z-10">
        <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Number of Captains</label>
        <div className="flex items-center space-x-4 mb-4 select-none">
          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount - 1)}
            disabled={gameState.playerCount <= 1}
            aria-label="Decrease player count"
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} ${gameState.playerCount <= 1 ? 'opacity-50 cursor-not-allowed' : inputHover} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:translate-y-0.5`}
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
            aria-label="Increase player count"
            className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} ${gameState.playerCount >= 9 ? 'opacity-50 cursor-not-allowed' : inputHover} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:translate-y-0.5`}
          >
            +
          </button>
          <span className={`italic ml-2 font-serif ${subLabelColor}`}>
            {isSolo ? '(Solo Mode)' : 'Crew Manifests'}
          </span>
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${cardBg} p-4 rounded-lg border ${cardBorder} shadow-inner`}>
          {gameState.playerNames.map((name, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`player-${index}`} className={`text-xs font-bold w-6 mr-1 font-mono ${subLabelColor}`}>{index + 1}.</label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Captain ${index + 1}`}
                className={`w-full p-2 border ${inputBorder} rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none ${inputBg} shadow-sm font-medium ${inputText} ${inputPlaceholder} transition-colors`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expansions */}
      <div className="mb-8 relative z-10">
        <label className={`block font-bold mb-3 uppercase tracking-wide text-xs ${labelColor}`}>Active Expansions</label>
        <div className="grid grid-cols-1 gap-4">
          {visibleExpansions.map((expansion) => (
            <ExpansionToggle 
              key={expansion.id}
              id={expansion.id} 
              label={expansion.label} 
              active={gameState.expansions[expansion.id]} 
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
        <Button onClick={onNext} fullWidth className={`${onBack ? 'w-2/3' : 'w-full'} text-lg py-4 border-b-4 border-[#450a0a]`}>
          Next: Choose Setup Card →
        </Button>
      </div>
    </div>
  );
};
