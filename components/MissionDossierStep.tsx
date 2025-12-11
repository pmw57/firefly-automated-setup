import React, { useState } from 'react';
import { GameState, StoryCardDef, Step } from '../types';
import { STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { Button } from './Button';
import { StoryCardGridItem } from './StoryCardGridItem';
import { InlineExpansionIcon } from './InlineExpansionIcon';
import { SpecialRuleBlock } from './SpecialRuleBlock';

interface MissionDossierStepProps {
  step: Step;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const MissionDossierStep: React.FC<MissionDossierStepProps> = ({ gameState, setGameState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);

  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const handleStoryCardSelect = (title: string) => {
    setGameState(prev => ({ ...prev, selectedStoryCard: title }));
  };

  // Logic for filtering valid stories
  const validStories = STORY_CARDS.filter(card => {
       // Standard Check
       const mainReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
       // Additional Check (Handles multi-expansion requirements like Blue Sun AND Kalidasa)
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

  // Determine special setup note for current card
  const setupNote = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' 
      ? "⚠️ Change of setup: Players now begin at Persephone." 
      : activeStoryCard.setupConfig?.startAtLondinium
      ? "⚠️ Change of setup: Players now begin at Londinium."
      : null;

  // Randomization Handlers
  const handleRandomPick = () => {
       if (validStories.length === 0) return;
       const r = Math.floor(Math.random() * validStories.length);
       handleStoryCardSelect(validStories[r].title);
       setShortList([]);
  };

  const handleGenerateShortList = () => {
       if (validStories.length === 0) return;
       // Fisher-Yates shuffle
       const shuffled = [...validStories];
       for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
       }
       setShortList(shuffled.slice(0, 3));
  };

  const handlePickFromShortList = () => {
       if (shortList.length === 0) return;
       const r = Math.floor(Math.random() * shortList.length);
       handleStoryCardSelect(shortList[r].title);
  };

  const handleCancelShortList = () => {
      setShortList([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 backdrop-blur-md rounded-lg shadow-md border border-gray-200 dark:border-zinc-800 overflow-hidden transition-colors duration-300">
         <div className="bg-gray-800 dark:bg-black/40 text-white p-4 flex justify-between items-center border-b border-gray-700 dark:border-zinc-800">
            <h3 className="font-bold text-lg font-western tracking-wider">Mission Dossier</h3>
            <span className="text-xs uppercase tracking-widest bg-gray-700 dark:bg-zinc-800 px-2 py-1 rounded text-gray-300 dark:text-gray-400">Active Goal</span>
         </div>
         {/* 
            Important: The 'bg-paper-texture' class sets a background-color that might bleed through in dark mode.
            We use 'dark:bg-none' to remove the image, and 'dark:bg-slate-900/50' to set a new dark color. 
         */}
         <div className="p-6 bg-paper-texture dark:bg-none dark:bg-zinc-900/50 transition-colors">
            <div className="flex items-center mb-4">
               {activeStoryCard.requiredExpansion ? (
                  <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-10 h-10 mr-3" />
               ) : (
                  <div className="w-10 h-10 mr-3 bg-gray-200 dark:bg-zinc-800 rounded border border-gray-300 dark:border-zinc-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-bold">BG</div>
               )}
               <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-200 font-western">{activeStoryCard.title}</h4>
            </div>
            <p className="text-gray-700 dark:text-gray-300 italic font-serif text-lg leading-relaxed border-l-4 border-gray-300 dark:border-zinc-700 pl-4 mb-4">"{activeStoryCard.intro}"</p>
            
            {/* Detailed Setup Description Block */}
            {activeStoryCard.setupDescription && (
                <SpecialRuleBlock source="story" title="Story Override">
                    {activeStoryCard.setupDescription}
                </SpecialRuleBlock>
            )}

            {setupNote && !activeStoryCard.setupDescription && (
                <SpecialRuleBlock source="warning" title="Location Override">
                    {setupNote}
                </SpecialRuleBlock>
            )}

            {gameState.setupCardId === 'TheRimsTheThing' && (
                <SpecialRuleBlock source="setupCard" title="Setup Card Override">
                    <strong>The Rim's The Thing:</strong> Remember that only <strong>Border Space</strong> Nav Decks are used in this setup card. Choose a mission achievable with limited navigation options.
                </SpecialRuleBlock>
            )}
         </div>
      </div>

      {/* Randomization Toolbar */}
      <div className="flex gap-3 mb-2">
          <Button onClick={handleRandomPick} variant="secondary" className="flex-1 text-sm py-2 bg-amber-600 dark:bg-amber-900/50 dark:border-amber-800 hover:dark:bg-amber-800/60 dark:text-amber-100">
              🎰 Randomly Select 1
          </Button>
          <Button onClick={handleGenerateShortList} className="flex-1 text-sm py-2 bg-blue-600 dark:bg-blue-900/50 dark:border-blue-800 hover:dark:bg-blue-800/60 dark:text-blue-100">
              🃏 Draft 3 Options
          </Button>
      </div>

      {/* Short List View */}
      {shortList.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-4 rounded-lg mb-4 animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-blue-900 dark:text-blue-200">Short-Listed Missions</h4>
                  <span className="text-xs text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full font-bold">Pick one below or roll</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {shortList.map((card) => (
                       <StoryCardGridItem 
                          key={card.title}
                          card={card}
                          isSelected={gameState.selectedStoryCard === card.title}
                          onClick={() => handleStoryCardSelect(card.title)}
                          isShortList={true}
                       />
                  ))}
              </div>
              <div className="flex gap-3">
                  <Button onClick={handlePickFromShortList} className="flex-1 py-2 text-sm bg-green-600 dark:bg-green-900/60">
                      🎲 Select Random from Hand
                  </Button>
                  <Button onClick={handleCancelShortList} variant="danger" className="py-2 text-sm px-4 dark:bg-red-900/50">
                      Discard Hand
                  </Button>
              </div>
          </div>
      )}

      <div className="space-y-3">
          <div className="flex gap-3 flex-col sm:flex-row">
              <input 
                type="text" 
                placeholder="Search Title or Intro..." 
                className="flex-1 p-3 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-zinc-600 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                  value={filterExpansion} 
                  onChange={(e) => setFilterExpansion(e.target.value)}
                  className="p-3 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white dark:bg-zinc-900/50 text-gray-900 dark:text-gray-200KP transition-colors"
              >
                  <option value="all">All Expansions</option>
                  <option value="base">Base Game</option>
                  {EXPANSIONS_METADATA.filter(e => gameState.expansions[e.id]).map(e => (
                      <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
              </select>
          </div>
          
          <div className="h-[500px] overflow-y-auto border border-gray-200 dark:border-zinc-800 rounded-lg bg-gray-50 dark:bg-black/20 p-2 custom-scrollbar">
              {filteredStories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredStories.map((card) => (
                          <StoryCardGridItem 
                              key={card.title}
                              card={card}
                              isSelected={gameState.selectedStoryCard === card.title}
                              onClick={() => handleStoryCardSelect(card.title)}
                          />
                      ))}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-zinc-600 italic">
                      <span className="text-4xl mb-2">🕵️</span>
                      <p>No missions found.</p>
                      <Button onClick={() => {setSearchTerm(''); setFilterExpansion('all');}} variant="secondary" className="mt-4 text-sm">Clear Filters</Button>
                  </div>
              )}
          </div>
          <div className="text-right text-xs text-gray-400 dark:text-zinc-600">
              Showing {filteredStories.length} of {validStories.length} available missions
          </div>
      </div>
    </div>
  );
};