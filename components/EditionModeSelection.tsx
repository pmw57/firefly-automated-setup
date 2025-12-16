
import React from 'react';
import { GameState, GameMode } from '../types';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

interface EditionModeSelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
}

export const EditionModeSelection = ({ gameState, setGameState, onNext }: EditionModeSelectionProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleModeSelect = (mode: GameMode) => {
    setGameState(prev => {
        let playerCount = prev.playerCount;
        let playerNames = [...prev.playerNames];
        let setupCardId = prev.setupCardId;
        let setupCardName = prev.setupCardName;

        if (mode === 'multiplayer') {
            // Restore default if coming back from solo
            if (playerCount === 1) {
                playerCount = 4;
                // Expand names array if needed
                while (playerNames.length < 4) {
                    playerNames.push(`Captain ${playerNames.length + 1}`);
                }
            }
            // Default Setup
            setupCardId = 'Standard';
            setupCardName = 'Standard Game Setup';
        } else if (mode === 'solo') {
            playerCount = 1;
            // Trim names array to 1
            if (playerNames.length > 1) {
                playerNames = [playerNames[0]];
            }
            // Default to Awful Lonely as a safe baseline
            setupCardId = 'AwfulLonely';
            setupCardName = 'Awful Lonely In The Big Black';
        }

        return { ...prev, gameMode: mode, playerCount, playerNames, setupCardId, setupCardName };
    });
  };

  // Styles
  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#7f1d1d]';
  const subHeaderColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBgBase = isDark ? 'bg-zinc-800' : 'bg-white';
  const cardBorderBase = isDark ? 'border-zinc-600' : 'border-gray-300';
  const cardHover = isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-50';
  const cardSelectedBorder = isDark ? 'border-green-500' : 'border-[#7f1d1d]';
  const cardSelectedBg = isDark ? 'bg-green-900/20' : 'bg-[#fff1f2]';
  const cardText = isDark ? 'text-gray-200' : 'text-gray-800';
  const cardDesc = isDark ? 'text-gray-400' : 'text-gray-600';
  const checkMarkColor = isDark ? 'text-green-400' : 'text-[#7f1d1d]';

  const OptionCard = ({ 
    selected, 
    onClick, 
    title, 
    description,
    icon 
  }: { selected: boolean; onClick: () => void; title: string; description: string; icon: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative text-left p-4 rounded-lg border-2 transition-all duration-200 flex flex-col h-full w-full
        ${selected ? `${cardSelectedBorder} ${cardSelectedBg} shadow-md` : `${cardBorderBase} ${cardBgBase} ${cardHover}`}
      `}
    >
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className={`font-bold text-lg ${cardText}`}>{title}</h3>
        {selected && <span className={`ml-auto font-bold ${checkMarkColor} text-xl`}>✓</span>}
      </div>
      <p className={`text-sm ${cardDesc}`}>{description}</p>
    </button>
  );

  return (
    <div className={`bg-metal rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in`}>
       <div className={`flex justify-between items-center mb-8 border-b-2 ${containerBorder} pb-2`}>
         <h2 className={`text-2xl font-bold font-western drop-shadow-sm ${headerColor}`}>Game Configuration</h2>
         <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 px-3 py-1 rounded-full shadow-sm">Part 1 of 3</span>
      </div>

      {/* Mode Selection */}
      <section className="mb-8">
        <h3 className={`font-bold uppercase tracking-wide text-sm mb-4 ${subHeaderColor}`}>Select Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <OptionCard
            selected={gameState.gameMode === 'multiplayer'}
            onClick={() => handleModeSelect('multiplayer')}
            title="Multiplayer"
            description="2+ Players. Compete to complete goals first."
            icon="👥"
          />
          <OptionCard
            selected={gameState.gameMode === 'solo'}
            onClick={() => handleModeSelect('solo')}
            title="Solo"
            description="1 Player. Fly alone in the black."
            icon="👤"
          />
        </div>
      </section>
      
      <div className="mt-8">
        <Button onClick={onNext} fullWidth className="text-lg py-4 border-b-4 border-[#450a0a]">
          Next: Captain Setup →
        </Button>
      </div>

    </div>
  );
};
