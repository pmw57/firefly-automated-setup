
import React, { useState, useMemo, useCallback } from 'react';
import { StoryCardDef, AdvancedRuleDef } from '../types';
import { useGameState } from '../hooks/useGameState';
import { STORY_CARDS, SETUP_CARD_IDS } from '../constants';
import { MissionSelectionContext } from '../hooks/useMissionSelection';
// FIX: Changed import path to point to the utils directory index.
import { isStoryCompatible } from '../utils/index';

export const MissionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gameState, setGameState } = useGameState();
  
  // Local UI State for this step
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);
  const [subStep, setSubStep] = useState(1);

  // Memoized derived data
  const activeStoryCard = useMemo(() => 
    STORY_CARDS.find(c => c.title === gameState.selectedStoryCard),
    [gameState.selectedStoryCard]
  );

  const isClassicSolo = useMemo(() => 
    gameState.gameMode === 'solo' && gameState.setupCardId !== SETUP_CARD_IDS.FLYING_SOLO,
    [gameState.gameMode, gameState.setupCardId]
  );

  const validStories = useMemo(() => 
    STORY_CARDS.filter(card => isStoryCompatible(card, gameState)),
    [gameState]
  );

  const filteredStories = useMemo(() => validStories.filter(card => {
    const matchesSearch = searchTerm === '' || 
       card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.intro.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpansion = filterExpansion === 'all' || card.requiredExpansion === filterExpansion || (!card.requiredExpansion && filterExpansion === 'base');
    return matchesSearch && matchesExpansion;
  }), [validStories, searchTerm, filterExpansion]);

  const availableAdvancedRules: AdvancedRuleDef[] = useMemo(() => {
    const rules: AdvancedRuleDef[] = [];
    if (gameState.gameMode === 'solo' && gameState.expansions.tenth && activeStoryCard) {
      STORY_CARDS.forEach(card => {
        if (card.advancedRule && card.title !== activeStoryCard.title) {
          const hasReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
          if (hasReq) rules.push(card.advancedRule);
        }
      });
      rules.sort((a, b) => a.title.localeCompare(b.title));
    }
    return rules;
  }, [gameState.gameMode, gameState.expansions, activeStoryCard]);

  const enablePart2 = useMemo(() => 
    gameState.gameMode === 'solo' && gameState.expansions.tenth,
    [gameState.gameMode, gameState.expansions.tenth]
  );

  // Actions wrapped in useCallback for performance
  const handleStoryCardSelect = useCallback((title: string) => {
    const card = STORY_CARDS.find(c => c.title === title);
    setGameState(prev => ({ 
      ...prev, 
      selectedStoryCard: title,
      selectedGoal: card?.goals?.[0]?.title,
      challengeOptions: {} 
    }));
  }, [setGameState]);

  const handleRandomPick = useCallback(() => {
    if (validStories.length === 0) return;
    const r = Math.floor(Math.random() * validStories.length);
    handleStoryCardSelect(validStories[r].title);
    setShortList([]);
  }, [validStories, handleStoryCardSelect]);

  const handleGenerateShortList = useCallback(() => {
    if (validStories.length === 0) return;
    const shuffled = [...validStories].sort(() => 0.5 - Math.random());
    setShortList(shuffled.slice(0, 3));
  }, [validStories]);

  const handlePickFromShortList = useCallback(() => {
    if (shortList.length === 0) return;
    const r = Math.floor(Math.random() * shortList.length);
    handleStoryCardSelect(shortList[r].title);
  }, [shortList, handleStoryCardSelect]);

  const handleCancelShortList = useCallback(() => setShortList([]), []);

  const value = {
    searchTerm,
    filterExpansion,
    shortList,
    subStep,
    activeStoryCard,
    validStories,
    filteredStories,
    availableAdvancedRules,
    isClassicSolo,
    enablePart2,
    setSearchTerm,
    setFilterExpansion,
    setSubStep,
    handleStoryCardSelect,
    handleRandomPick,
    handleGenerateShortList,
    handlePickFromShortList,
    handleCancelShortList,
  };

  return (
    <MissionSelectionContext.Provider value={value}>
      {children}
    </MissionSelectionContext.Provider>
  );
}