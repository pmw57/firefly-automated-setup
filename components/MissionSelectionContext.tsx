
import React, { useState, useMemo, useCallback } from 'react';
import { StoryCardDef, AdvancedRuleDef } from '../types';
import { useGameState } from '../hooks/useGameState';
import { STORY_CARDS } from '../data/storyCards';
import { MissionSelectionContext } from '../hooks/useMissionSelection';
import { SETUP_CARD_IDS, STORY_TITLES } from '../constants';

const SOLO_EXCLUDED_STORIES = [
  "The Great Recession",
  "The Well's Run Dry",
  "It's All In Who You Know",
  "The Scavenger's 'Verse",
  "Smuggler's Blues",
  "Aces Up Your Sleeve"
];

export function MissionSelectionProvider({ children }: { children: React.ReactNode }) {
  const { gameState, setGameState } = useGameState();
  
  // Local UI State for this step
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);
  const [subStep, setSubStep] = useState(1);

  // Memoized derived data
  const activeStoryCard = useMemo(() => 
    STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0],
    [gameState.selectedStoryCard]
  );

  const isClassicSolo = useMemo(() => 
    gameState.gameMode === 'solo' && gameState.setupCardId !== SETUP_CARD_IDS.FLYING_SOLO,
    [gameState.gameMode, gameState.setupCardId]
  );

  const validStories = useMemo(() => STORY_CARDS.filter(card => {
    if (isClassicSolo) return card.title === STORY_TITLES.AWFUL_LONELY;
    if (gameState.gameMode === 'multiplayer' && card.isSolo) return false;
    if (gameState.gameMode === 'solo' && SOLO_EXCLUDED_STORIES.includes(card.title)) return false;
    if (card.title === STORY_TITLES.SLAYING_THE_DRAGON && gameState.playerCount !== 2) return false;
    
    const mainReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
    const addReq = !card.additionalRequirements || card.additionalRequirements.every(req => gameState.expansions[req]);
    
    return mainReq && addReq;
  }), [isClassicSolo, gameState.gameMode, gameState.playerCount, gameState.expansions]);

  const filteredStories = useMemo(() => validStories.filter(card => {
    const matchesSearch = searchTerm === '' || 
       card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.intro.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpansion = filterExpansion === 'all' || card.requiredExpansion === filterExpansion || (!card.requiredExpansion && filterExpansion === 'base');
    return matchesSearch && matchesExpansion;
  }), [validStories, searchTerm, filterExpansion]);

  const availableAdvancedRules: AdvancedRuleDef[] = useMemo(() => {
    const rules: AdvancedRuleDef[] = [];
    if (gameState.gameMode === 'solo' && gameState.expansions.tenth) {
      STORY_CARDS.forEach(card => {
        if (card.advancedRule && card.title !== activeStoryCard.title) {
          const hasReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
          if (hasReq) rules.push(card.advancedRule);
        }
      });
      rules.sort((a, b) => a.title.localeCompare(b.title));
    }
    return rules;
  }, [gameState.gameMode, gameState.expansions, activeStoryCard.title]);

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
