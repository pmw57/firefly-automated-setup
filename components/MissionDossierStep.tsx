
import React, { useState, useEffect, useRef } from 'react';
import { GameState, StoryCardDef, Step, AdvancedRuleDef } from '../types';
import { STORY_CARDS } from '../constants';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

// Refactored Components
import { StoryDossier } from './story/StoryDossier';
import { StoryRandomizer } from './story/StoryRandomizer';
import { StoryCardGrid } from './story/StoryCardGrid';
import { SoloOptionsPart } from './story/SoloOptionsPart';

interface MissionDossierStepProps {
  step: Step;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
  onPrev: () => void;
}

const SOLO_EXCLUDED_STORIES = [
  "The Great Recession",
  "The Well's Run Dry",
  "It's All In Who You Know",
  "The Scavenger's 'Verse",
  "Smuggler's Blues",
  "Aces Up Your Sleeve"
];

export const MissionDossierStep: React.FC<MissionDossierStepProps> = ({ gameState, setGameState, onNext, onPrev }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);
  const [subStep, setSubStep] = useState(1);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const dossierTopRef = useRef<HTMLDivElement>(null);

  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const handleStoryCardSelect = (title: string) => {
    const card = STORY_CARDS.find(c => c.title === title);
    setGameState(prev => ({ 
      ...prev, 
      selectedStoryCard: title,
      selectedGoal: card?.goals?.[0]?.title,
      challengeOptions: {} 
    }));
    
    if (dossierTopRef.current) {
      setTimeout(() => {
        dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  useEffect(() => {
    if (activeStoryCard.goals && activeStoryCard.goals.length > 0 && !gameState.selectedGoal) {
      setGameState(prev => ({ ...prev, selectedGoal: activeStoryCard.goals![0].title }));
    }
  }, [activeStoryCard, gameState.selectedGoal, setGameState]);

  const isClassicSolo = gameState.gameMode === 'solo' && gameState.setupCardId !== 'FlyingSolo';
  
  const validStories = STORY_CARDS.filter(card => {
    if (isClassicSolo) {
      return card.title === "Awful Lonely In The Big Black";
    }
    if (gameState.gameMode === 'multiplayer' && card.isSolo) return false;
    if (gameState.gameMode === 'solo' && SOLO_EXCLUDED_STORIES.includes(card.title)) return false;
    if (card.title === "Slaying The Dragon" && gameState.playerCount !== 2) return false;
    
    const mainReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
    const addReq = !card.additionalRequirements || card.additionalRequirements.every(req => gameState.expansions[req]);
    
    return mainReq && addReq;
  });

  const filteredStories = validStories.filter(card => {
    const matchesSearch = searchTerm === '' || 
       card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.intro.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExpansion = filterExpansion === 'all' || card.requiredExpansion === filterExpansion || (!card.requiredExpansion && filterExpansion === 'base');

    return matchesSearch && matchesExpansion;
  });

  const availableAdvancedRules: AdvancedRuleDef[] = [];
  if (gameState.gameMode === 'solo' && gameState.expansions.tenth) {
    STORY_CARDS.forEach(card => {
      if (card.advancedRule && card.title !== activeStoryCard.title) {
        const hasReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
        if (hasReq) {
          availableAdvancedRules.push(card.advancedRule);
        }
      }
    });
    availableAdvancedRules.sort((a, b) => a.title.localeCompare(b.title));
  }

  const handleRandomPick = () => {
    if (validStories.length === 0) return;
    const r = Math.floor(Math.random() * validStories.length);
    handleStoryCardSelect(validStories[r].title);
    setShortList([]);
  };

  const handleGenerateShortList = () => {
    if (validStories.length === 0) return;
    const shuffled = [...validStories].sort(() => 0.5 - Math.random());
    setShortList(shuffled.slice(0, 3));
  };

  const handlePickFromShortList = () => {
    if (shortList.length === 0) return;
    const r = Math.floor(Math.random() * shortList.length);
    handleStoryCardSelect(shortList[r].title);
  };

  const enablePart2 = gameState.gameMode === 'solo' && gameState.expansions.tenth;

  const handleNextStep = () => {
    if (subStep === 1 && enablePart2) {
      setSubStep(2);
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNext();
    }
  };

  const handlePrevStep = () => {
    if (subStep === 2) {
      setSubStep(1);
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onPrev();
    }
  };

  const containerBg = isDark ? 'bg-zinc-900' : 'bg-[#faf8ef]';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerBarBg = isDark ? 'bg-black/40' : 'bg-[#5e1916]';
  const headerBarBorder = isDark ? 'border-zinc-800' : 'border-[#450a0a]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#fef3c7]';
  const badgeBg = isDark ? 'bg-zinc-800' : 'bg-[#991b1b]';
  const badgeText = isDark ? 'text-gray-400' : 'text-[#fef3c7]';
  const badgeBorder = isDark ? 'border-0' : 'border border-[#450a0a]';
  const navBorderTop = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';

  return (
    <div className="space-y-6">
      <div 
        ref={dossierTopRef}
        className={`${containerBg} backdrop-blur-md rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300 scroll-mt-24`}
      >
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
            {subStep === 1 ? 'Story Selection' : 'Story Options'}
          </h3>
          {enablePart2 && <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part {subStep} of 2</span>}
        </div>
        
        {subStep === 1 ? (
          <div className="animate-fade-in">
            <StoryDossier activeStoryCard={activeStoryCard} gameState={gameState} setGameState={setGameState} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <SoloOptionsPart 
              activeStoryCard={activeStoryCard}
              gameState={gameState}
              setGameState={setGameState}
              availableAdvancedRules={availableAdvancedRules}
            />
          </div>
        )}
      </div>

      {subStep === 1 && (
        <div className="animate-fade-in space-y-4">
          <StoryRandomizer 
            validStories={validStories}
            shortList={shortList}
            selectedStoryCard={gameState.selectedStoryCard}
            onRandomPick={handleRandomPick}
            onGenerateShortList={handleGenerateShortList}
            onPickFromShortList={handlePickFromShortList}
            onCancelShortList={() => setShortList([])}
            onSelect={handleStoryCardSelect}
          />

          <StoryCardGrid 
            filteredStories={filteredStories}
            validStories={validStories}
            selectedStoryCard={gameState.selectedStoryCard}
            onSelect={handleStoryCardSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterExpansion={filterExpansion}
            setFilterExpansion={setFilterExpansion}
            isClassicSolo={isClassicSolo}
          />
        </div>
      )}

      <div className={`mt-8 flex justify-between clear-both pt-6 border-t ${navBorderTop}`}>
        <Button onClick={handlePrevStep} variant="secondary" className="shadow-sm">
          {subStep === 1 ? '← Previous' : '← Back to Story'}
        </Button>
        <Button 
          onClick={handleNextStep} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
        >
          {subStep === 1 && enablePart2 ? 'Next: Options →' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
};
