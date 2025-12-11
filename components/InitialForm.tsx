import React, { useState } from 'react';
import { GameState, Expansions, ThemeColor } from '../types';
import { SCENARIOS, EXPANSIONS_METADATA } from '../constants';
import { Button } from './Button';
import { getExpansionIcon } from './iconHelpers';

// --- Shared Types & Helpers ---
interface ThemeStyles {
  border: string;
  bg: string;
  badge: string;
  toggle: string;
  icon: string;
}

interface ExpansionToggleProps {
  id: keyof Expansions;
  label: string;
  active: boolean;
  themeColor: ThemeColor;
  description: string;
  onToggle: (id: keyof Expansions) => void;
}

const ExpansionToggle: React.FC<ExpansionToggleProps> = ({ 
  id, label, active, themeColor, description, onToggle
}) => {
  const themes: Record<ThemeColor, ThemeStyles> = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', toggle: 'bg-blue-600', icon: 'bg-blue-600' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', toggle: 'bg-amber-600', icon: 'bg-amber-600' },
    red: { border: 'border-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', toggle: 'bg-red-600', icon: 'bg-red-600' },
    gray: { border: 'border-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-200 text-gray-800', toggle: 'bg-gray-600', icon: 'bg-gray-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', toggle: 'bg-purple-600', icon: 'bg-purple-600' },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', toggle: 'bg-yellow-600', icon: 'bg-yellow-600' },
    dark: { border: 'border-gray-800', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-900', toggle: 'bg-gray-900', icon: 'bg-gray-900' },
    cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50', badge: 'bg-cyan-100 text-cyan-800', toggle: 'bg-cyan-600', icon: 'bg-cyan-600' },
    paleGreen: { border: 'border-green-400', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', toggle: 'bg-green-400', icon: 'bg-green-400' },
    firebrick: { border: 'border-red-800', bg: 'bg-red-50', badge: 'bg-red-100 text-red-900', toggle: 'bg-red-800', icon: 'bg-red-800' },
    khaki: { border: 'border-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-900', toggle: 'bg-amber-400', icon: 'bg-amber-400' },
    cornflower: { border: 'border-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-800', toggle: 'bg-indigo-400', icon: 'bg-indigo-400' },
    brown: { border: 'border-orange-800', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-900', toggle: 'bg-orange-800', icon: 'bg-orange-800' },
    teal: { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-teal-600', icon: 'bg-teal-600' }
  };

  const currentTheme = themes[themeColor] || themes['gray'];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  return (
    <div 
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      className={`
        relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        ${active 
          ? `${currentTheme.border} ${currentTheme.bg} shadow-md` 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center flex-1">
        <div className={`
          w-12 h-12 rounded-lg mr-4 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hidden shrink-0
          ${active ? currentTheme.icon : 'bg-gray-100 text-gray-400'}
        `}>
          {getExpansionIcon(id) || label.charAt(0)}
        </div>
        
        <div className="flex-1 mr-4">
          <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${active ? 'text-gray-900' : 'text-gray-500'}`}>
            {label}
          </h3>
          <p className={`text-xs mt-1 leading-snug ${active ? 'text-gray-600' : 'text-gray-400'}`}>
             {description}
          </p>
          <span className={`
            inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 transition-colors duration-300
            ${active ? currentTheme.badge : 'bg-gray-100 text-gray-400'}
          `}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className={`
        w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0 ml-2
        ${active ? currentTheme.toggle : 'bg-gray-300'}
      `}>
        <div className={`
          bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
          ${active ? 'translate-x-6' : 'translate-x-0'}
        `}></div>
      </div>
    </div>
  );
};

// --- Sub-Component 1: Captain & Expansion Setup ---
interface CaptainSetupProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
}

const CaptainSetup: React.FC<CaptainSetupProps> = ({ gameState, setGameState, onNext }) => {
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
      // Reset scenario if requirements aren't met
      const currentScenario = SCENARIOS.find(s => s.id === prev.scenarioValue);
      let nextScenarioValue = prev.scenarioValue;
      let nextScenarioName = prev.scenarioName;

      if (currentScenario?.requiredExpansion && !nextExpansions[currentScenario.requiredExpansion]) {
          nextScenarioValue = 'Standard';
          nextScenarioName = 'Standard Game Setup';
      }

      return {
        ...prev,
        expansions: nextExpansions,
        scenarioValue: nextScenarioValue,
        scenarioName: nextScenarioName
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
        Next: Choose Scenario →
      </Button>
    </div>
  );
};

// --- Sub-Component 2: Scenario Selection ---
interface ScenarioSelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onStart: () => void;
}

const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({ gameState, setGameState, onBack, onStart }) => {
  const availableScenarios = SCENARIOS.filter(scenario => {
    if (!scenario.requiredExpansion) return true;
    return gameState.expansions[scenario.requiredExpansion];
  });

  const handleScenarioSelect = (id: string, label: string) => {
    setGameState(prev => ({
      ...prev,
      scenarioValue: id,
      scenarioName: label
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 animate-fade-in">
       <div className="flex justify-between items-center mb-6 border-b pb-2">
           <h2 className="text-2xl font-bold text-gray-800 font-western">Select Setup Card</h2>
           <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Part 2 of 2</span>
        </div>

       <div className="mb-8 relative">
        <label className="block font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Available Scenarios</label>
        
        <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden flex flex-col">
          {availableScenarios.map(opt => {
            const isSelected = gameState.scenarioValue === opt.id;
            return (
              <button 
                key={opt.id}
                type="button"
                onClick={() => handleScenarioSelect(opt.id, opt.label)}
                className={`flex items-stretch text-left cursor-pointer border-b border-gray-100 last:border-0 transition-colors focus:outline-none focus:bg-green-50 focus:z-10 focus:ring-inset focus:ring-2 focus:ring-green-500 ${isSelected ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                aria-pressed={isSelected}
              >
                 <div className={`w-16 flex items-center justify-center border-r border-gray-100 p-2 shrink-0 ${isSelected ? 'bg-green-100/50' : 'bg-gray-50/50'}`}>
                    {(opt.iconOverride || opt.requiredExpansion) ? (
                       <div className="w-10 h-10 rounded overflow-hidden shadow-sm border border-gray-300">
                         {getExpansionIcon(opt.iconOverride || opt.requiredExpansion)}
                       </div>
                    ) : (
                       <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-gray-300 text-gray-400 font-bold text-sm">
                         —
                       </div>
                    )}
                 </div>

                 <div className="flex-1 p-4 flex flex-col justify-center relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-lg ${isSelected ? 'font-bold text-green-900' : 'font-medium text-gray-800'}`}>
                          {opt.label}
                      </span>
                      {isSelected && <span className="text-green-600 font-bold text-xl">✓</span>}
                    </div>
                    {opt.description && (
                      <p className={`text-sm ${isSelected ? 'text-green-800' : 'text-gray-500'} line-clamp-2`}>
                        {opt.description}
                      </p>
                    )}
                 </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" className="w-1/3">
          ← Back
        </Button>
        <Button onClick={onStart} fullWidth className="w-2/3 text-xl py-4 shadow-xl border-b-4 border-green-900 hover:translate-y-[-2px]">
          Launch Setup Sequence
        </Button>
      </div>
    </div>
  );
};

// --- Main Component Orchestrator ---
export const InitialForm: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
}> = (props) => {
  const [internalStep, setInternalStep] = useState<1 | 2>(1);

  if (internalStep === 1) {
    return <CaptainSetup {...props} onNext={() => setInternalStep(2)} />;
  }
  return <ScenarioSelection {...props} onBack={() => setInternalStep(1)} />;
};