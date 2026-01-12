import React from 'react';
import { Button } from '../Button';
import { StoryCardGridItem } from './StoryCardGridItem';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useTheme } from '../ThemeContext';
import { STORY_CARDS } from '../../data/storyCards';
import { useGameState } from '../../hooks/useGameState';

interface StoryRandomizerProps {
  onSelect: (index: number) => void;
}

export const StoryRandomizer: React.FC<StoryRandomizerProps> = ({ onSelect }) => {
  const { theme } = useTheme();
  const { state: gameState } = useGameState();
  const isDark = theme === 'dark';

  const {
    validStories,
    shortList,
    selectedStoryCardIndex,
    handleRandomPick,
    handleGenerateShortList,
    handlePickFromShortList,
    handleCancelShortList,
  } = useMissionSelection();

  const showRandomOption = validStories.length > 1;
  // The "Draft 3" option is an advanced feature only available in the detailed setup mode.
  const showDraftOption = validStories.length > 3 && gameState.setupMode === 'detailed';

  const draftButtonClass = isDark
    ? 'bg-blue-900/50 border-blue-800 hover:bg-blue-800/60 text-blue-100'
    : 'bg-[#1e3a8a] border-[#172554] text-white hover:bg-[#1e40af]';

  const shortListBgBorder = isDark ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-200';
  const shortListHeaderColor = isDark ? 'text-blue-200' : 'text-blue-900';
  const shortListBadgeColor = isDark ? 'text-blue-300 bg-blue-900/50' : 'text-blue-600 bg-blue-100';

  return (
    <>
      {(showRandomOption || showDraftOption) && (
        <div className="flex gap-3 mb-2">
          {showRandomOption && (
            <Button onClick={handleRandomPick} variant="secondary" className="flex-1 text-sm py-2">
              🎰 Randomly Select 1
            </Button>
          )}
          {showDraftOption && (
            <Button onClick={handleGenerateShortList} className={`flex-1 text-sm py-2 ${draftButtonClass}`}>
              🃏 Draft 3 Options
            </Button>
          )}
        </div>
      )}

      {shortList.length > 0 && (
        <div className={`${shortListBgBorder} border p-4 rounded-lg mb-4 animate-fade-in`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className={`font-bold ${shortListHeaderColor}`}>Short-Listed Stories</h4>
            <span className={`text-xs ${shortListBadgeColor} px-2 py-1 rounded-full font-bold`}>Pick one below or roll</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {shortList.map((card) => {
                const originalIndex = STORY_CARDS.indexOf(card);
                return (
                  <StoryCardGridItem 
                    key={`${card.title}-${originalIndex}`}
                    card={card}
                    isSelected={selectedStoryCardIndex === originalIndex}
                    onClick={() => onSelect(originalIndex)}
                    isShortList={true}
                  />
                )
            })}
          </div>
          <div className="flex gap-3">
            <Button onClick={handlePickFromShortList} className="flex-1 py-2 text-sm">
              🎲 Select Random from Hand
            </Button>
            <Button onClick={handleCancelShortList} variant="danger" className="py-2 text-sm px-4">
              Discard Hand
            </Button>
          </div>
        </div>
      )}
    </>
  );
};