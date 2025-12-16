
import React from 'react';
import { StoryCardDef } from '../../types';
import { Button } from '../Button';
import { StoryCardGridItem } from '../StoryCardGridItem';
import { useTheme } from '../ThemeContext';

interface StoryRandomizerProps {
  validStories: StoryCardDef[];
  shortList: StoryCardDef[];
  selectedStoryCard: string;
  onRandomPick: () => void;
  onGenerateShortList: () => void;
  onPickFromShortList: () => void;
  onCancelShortList: () => void;
  onSelect: (title: string) => void;
}

export const StoryRandomizer: React.FC<StoryRandomizerProps> = ({
  validStories,
  shortList,
  selectedStoryCard,
  onRandomPick,
  onGenerateShortList,
  onPickFromShortList,
  onCancelShortList,
  onSelect
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const showRandomOption = validStories.length > 1;
  const showDraftOption = validStories.length > 3;

  return (
    <>
      {(showRandomOption || showDraftOption) && (
        <div className="flex gap-3 mb-2">
          {showRandomOption && (
            <Button onClick={onRandomPick} variant="secondary" className="flex-1 text-sm py-2">
              🎰 Randomly Select 1
            </Button>
          )}
          {showDraftOption && (
            <Button onClick={onGenerateShortList} className={`flex-1 text-sm py-2 ${isDark ? 'bg-blue-900/50 border-blue-800 hover:bg-blue-800/60 text-blue-100' : 'bg-[#1e3a8a] border-[#172554] text-white hover:bg-[#1e40af]'}`}>
              🃏 Draft 3 Options
            </Button>
          )}
        </div>
      )}

      {shortList.length > 0 && (
        <div className={`${isDark ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-200'} border p-4 rounded-lg mb-4 animate-fade-in`}>
          <div className="flex justify-between items-center mb-3">
            <h4 className={`font-bold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>Short-Listed Stories</h4>
            <span className={`text-xs ${isDark ? 'text-blue-300 bg-blue-900/50' : 'text-blue-600 bg-blue-100'} px-2 py-1 rounded-full font-bold`}>Pick one below or roll</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {shortList.map((card) => (
              <StoryCardGridItem 
                key={card.title}
                card={card}
                isSelected={selectedStoryCard === card.title}
                onClick={() => onSelect(card.title)}
                isShortList={true}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <Button onClick={onPickFromShortList} className="flex-1 py-2 text-sm bg-green-700 dark:bg-green-800">
              🎲 Select Random from Hand
            </Button>
            <Button onClick={onCancelShortList} variant="danger" className="py-2 text-sm px-4">
              Discard Hand
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
