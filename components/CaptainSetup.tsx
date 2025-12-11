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
      // Reset scenario/setup card if requirements aren't met
      const currentSetup = SETUP_CARDS.find(s => s.id === prev.scenarioValue);
      let nextSetupCardId = prev.scenarioValue;
      let nextSetupCardName = prev.scenarioName;

      if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
          nextSetupCardId = 'Standard';
          nextSetupCardName = 'Standard Game Setup';
      }

      return {
        ...prev,
        expansions: nextExpansions,
        scenarioValue: nextSetupCardId,
        scenarioName: nextSetupCardName
      };
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
         <h2 className="text-2xl font-bold text-gray-800 font-western">Mission Configuration</h2>
         <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">Part 1 of 2</span>
      </div>
      
      {/* Player Count & Names */}
      <div className="mb-8">
        <label className="block font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Number of Captains</label>
        <div className="flex items-center space-x-4 mb-4 select-none">
          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount - 1)}
            disabled={gameState.playerCount <= 1}
            aria-label="Decrease player count"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold text-2xl text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            -
          </button>
          
          <div className="w-16 h-12 flex items-center justify-center text-3xl font-bold text-green-900 font-western">
            {gameState.playerCount}
          </div>

          <button 
            type="button"
            onClick={() => updatePlayerCount(gameState.playerCount + 1)}
            disabled={gameState.playerCount >= 9}
            aria-label="Increase player count"
            className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 font-bold text-2xl text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            +
          </button>
          <span className="text-gray-500 italic ml-2">Players</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
          {gameState.playerNames.map((name, index) => (
            <div key={index} className="flex items-center">
              <label htmlFor={`player-${index}`} className="text-xs font-bold text-gray-400 w-6 mr-1">{index + 1}.</label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Captain ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Expansions */}
      <div className="mb-8">
        <label className="block font-bold text-gray-700 mb-3 uppercase tracking-wide text-xs">Active Expansions</label>
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

      <Button onClick={onNext} fullWidth className="text-lg py-3 shadow-md hover:translate-y-[-1px]">
        Next: Choose Setup Card →
      </Button>
    </div>
  );
};