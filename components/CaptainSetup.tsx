import React from 'react';
import { GameState, Expansions } from '../types';
import { EXPANSIONS_METADATA, SETUP_CARDS } from '../constants';
import { Button } from './Button';
import { ExpansionToggle } from './ExpansionToggle';

interface CaptainSetupProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
}

export const CaptainSetup: React.FC<CaptainSetupProps> = ({ gameState, setGameState, onNext }) => {
  const updatePlayerCount = (newCount: number) => {
    const safeCount = Math.max(1, Math.min(9, newCount));
    setGameState(prev => {
      const newNames = [...prev.playerNames];
      if (safeCount > newNames.length) {
        for (let i = newNames.length; i < safeCount; i++) {
          newNames.push(`Captain ${i + 1}`);
        }
      } else {
        newNames.length = safeCount;
      }
      return { ...prev, playerCount: safeCount, playerNames: newNames };
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
      // Reset setup card if requirements aren't met
      const currentSetup = SETUP_CARDS.find(s => s.id === prev.setupCardId);
      let nextSetupCardId = prev.setupCardId;
      let nextSetupCardName = prev.setupCardName;

      if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
          nextSetupCardId = 'Standard';
          nextSetupCardName = 'Standard Game Setup';
      }

      return {
        ...prev,
        expansions: nextExpansions,
        setupCardId: nextSetupCardId,
        setupCardName: nextSetupCardName
      };
    });
  };

  return (
    <div className="bg-metal dark:bg-slate-900/90 rounded-xl shadow-2xl p-6 md:p-8 border-2 border-gray-400/50 dark:border-slate-700 animate-fade-in relative overflow-hidden transition-colors duration-300">
      {/* Decorative bolts - Dark mode adjusts opacity */}
      <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gray-400 dark:bg-slate-600 shadow-inner border border-gray-500 dark:border-slate-700"></div>
      <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gray-400 dark:bg-slate-600 shadow-inner border border-gray-500 dark:border-slate-700"></div>
      <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gray-400 dark:bg-slate-600 shadow-inner border border-gray-500 dark:border-slate-700"></div>
      <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gray-400 dark:bg-slate-600 shadow-inner border border-gray-500 dark:border-slate-700"></div>

      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-300 dark:border-slate-700 pb-2 relative z-10">
         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 font-western drop-shadow-sm">Mission Configuration</h2>
         <span className="text-xs font-bold bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 rounded-full border shadow-sm">Part 1 of 2</span>
      </div>
      
      {/* Player Count & Names */}
      <div className="mb-8 relative z-10">
        <label className="block font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide text-xs">Number of Captains</label>
        <div className="flex items-center space-x-4 mb-4 select-none">
          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount - 1)}
            disabled={gameState.playerCount <= 1}
            aria-label="Decrease player count"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 font-bold text-2xl text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowedQl transition-all shadow-sm active:translate-y-0.5"
          >
            -
          </button>
          
          <div className="w-16 h-12 flex items-center justify-center text-4xl font-bold text-gray-800 dark:text-white font-western drop-shadow-md">
            {gameState.playerCount}
          </div>

          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount + 1)}
            disabled={gameState.playerCount >= 9}
            aria-label="Increase player count"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 font-bold text-2xl text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowedQl transition-all shadow-sm active:translate-y-0.5"
          >
            +
          </button>
          <span className="text-gray-500 dark:text-gray-400 italic ml-2 font-serif">Crew Manifests</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/50 dark:bg-black/30 p-4 rounded-lg border border-gray-300 dark:border-slate-700 shadow-inner">
          {gameState.playerNames.map((name, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`player-${index}`} className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6 mr-1 font-mono">{index + 1}.</label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Captain ${index + 1}`}
                className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none bg-white dark:bg-slate-800 shadow-sm font-medium text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expansions */}
      <div className="mb-8 relative z-10">
        <label className="block font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide text-xs">Active Expansions</label>
        <div className="grid grid-cols-1 gap-4">
          {EXPANSIONS_METADATA.map((expansion) => (
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

      <div className="relative z-10">
        <Button onClick={onNext} fullWidth className="text-lg py-4 shadow-xl border-b-4 border-green-900/50 hover:translate-y-[-2px] bg-gradient-to-b from-green-700 to-green-800">
          Next: Choose Setup Card →
        </Button>
      </div>
    </div>
  );
};