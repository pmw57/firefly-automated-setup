
import React, { useState, useEffect, useRef } from 'react';
import { GameState, StoryCardDef, Step } from '../types';
import { STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { Button } from './Button';
import { StoryCardGridItem } from './StoryCardGridItem';
import { InlineExpansionIcon } from './InlineExpansionIcon';
import { ExpansionIcon } from './ExpansionIcon';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';

interface MissionDossierStepProps {
  step: Step;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const MissionDossierStep: React.FC<MissionDossierStepProps> = ({ gameState, setGameState }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const dossierTopRef = useRef<HTMLDivElement>(null);

  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const handleStoryCardSelect = (title: string) => {
    const card = STORY_CARDS.find(c => c.title === title);
    // Reset challenge options when changing story
    setGameState(prev => ({ 
        ...prev, 
        selectedStoryCard: title,
        selectedGoal: card?.goals?.[0]?.title, // Auto-select first goal if available
        challengeOptions: {} 
    }));
    
    // Scroll back up to the dossier details so the user sees specific rules/setup info
    if (dossierTopRef.current) {
        // Use a small timeout to allow state to update and render the new content before scrolling
        setTimeout(() => {
            dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }
  };

  const handleGoalSelect = (goalTitle: string) => {
      setGameState(prev => ({ ...prev, selectedGoal: goalTitle }));
  };

  const toggleChallengeOption = (id: string) => {
      setGameState(prev => ({
          ...prev,
          challengeOptions: {
              ...prev.challengeOptions,
              [id]: !prev.challengeOptions[id]
          }
      }));
  };

  // Ensure a goal is selected if the card has goals (e.g. from legacy state or weird navigation)
  useEffect(() => {
    if (activeStoryCard.goals && activeStoryCard.goals.length > 0 && !gameState.selectedGoal) {
        setGameState(prev => ({ ...prev, selectedGoal: activeStoryCard.goals![0].title }));
    }
  }, [activeStoryCard, gameState.selectedGoal, setGameState]);

  // Logic for filtering valid stories
  const validStories = STORY_CARDS.filter(card => {
       // Classic Solo (Awful Lonely) Override: 
       // If Game Mode is Solo AND we are NOT using the Flying Solo setup card...
       // Then we must play Awful Lonely in the Big Black.
       if (gameState.gameMode === 'solo' && gameState.setupCardId !== 'FlyingSolo') {
           return card.title === "Awful Lonely In The Big Black";
       }

       // Multiplayer Check: Hide Solo-only cards
       if (gameState.gameMode === 'multiplayer' && card.isSolo) {
           return false;
       }

       // Specific Story Restrictions
       if (card.title === "Slaying The Dragon" && gameState.playerCount !== 2) {
           return false;
       }
       
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

  const headerColor = isDark ? 'text-amber-500' : 'text-[#fef3c7]';
  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const italicTextColor = isDark ? 'text-gray-300' : 'text-[#57534e]';
  const containerBg = isDark ? 'bg-zinc-900' : 'bg-[#faf8ef]';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  
  const headerBarBg = isDark ? 'bg-black/40' : 'bg-[#5e1916]'; // Burgundy header bar
  const headerBarBorder = isDark ? 'border-zinc-800' : 'border-[#450a0a]';
  
  const badgeBg = isDark ? 'bg-zinc-800' : 'bg-[#991b1b]';
  const badgeText = isDark ? 'text-gray-400' : 'text-[#fef3c7]';
  const badgeBorder = isDark ? 'border-0' : 'border border-[#450a0a]';

  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-transparent';
  const bgIconBg = isDark ? 'bg-zinc-800' : 'bg-[#e5e5e5]';
  const bgIconBorder = isDark ? 'border-zinc-700' : 'border-[#d4d4d4]';
  const quoteBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';

  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const inputBg = isDark ? 'bg-zinc-900/50' : 'bg-[#faf8ef]';
  const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
  const inputPlaceholder = isDark ? 'placeholder-zinc-500' : 'placeholder-[#a8a29e]';

  const listContainerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const listContainerBg = isDark ? 'bg-black/20' : 'bg-[#f5f5f4]';
  const emptyStateText = isDark ? 'text-zinc-500' : 'text-[#78716c]';
  const countText = isDark ? 'text-zinc-500' : 'text-[#78350f]';

  // Filter available expansions for dropdown (excluding 'base')
  const availableExpansionsForFilter = EXPANSIONS_METADATA.filter(e => {
      if (e.id === 'base') return false;
      // Must be active
      if (!gameState.expansions[e.id]) return false;
      // Must not be Community Content if in Classic Solo (Awful Lonely)
      if (e.id === 'community' && gameState.gameMode === 'solo' && gameState.setupCardId !== 'FlyingSolo') return false;
      return true;
  });

  const showRandomOption = validStories.length > 1;
  const showDraftOption = validStories.length > 3;

  return (
    <div className="space-y-6">
      <div 
        ref={dossierTopRef}
        className={`${containerBg} backdrop-blur-md rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300 scroll-mt-24`}
      >
         <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
            <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>Mission Dossier</h3>
            <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Active Goal</span>
         </div>
         
         <div className={`p-6 ${bodyBg} transition-colors`}>
            <div className="flex items-center mb-4">
               {activeStoryCard.requiredExpansion ? (
                  <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-10 h-10 mr-3" />
               ) : (
                  <div className={`w-10 h-10 mr-3 rounded border overflow-hidden ${bgIconBg} ${bgIconBorder}`}>
                      <ExpansionIcon id="base" />
                  </div>
               )}
               <h4 className={`text-2xl font-bold font-western ${mainTitleColor}`}>{activeStoryCard.title}</h4>
            </div>
            <p className={`${italicTextColor} italic font-serif text-lg leading-relaxed border-l-4 ${quoteBorder} pl-4 mb-4`}>"{activeStoryCard.intro}"</p>
            
            {/* Multi-Goal Display */}
            {activeStoryCard.goals && activeStoryCard.goals.length > 0 && (
                <div className={`mb-6`}>
                    <div className={`flex items-center gap-2 mb-2`}>
                        <span className="text-xl">🎯</span>
                        <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Select Victory Condition
                        </h5>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {activeStoryCard.goals.map((goal, idx) => {
                            const isSelected = gameState.selectedGoal === goal.title;
                            const activeBorder = isDark ? 'border-green-500' : 'border-green-600';
                            const activeBg = isDark ? 'bg-green-900/20' : 'bg-green-50';
                            const inactiveBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
                            const inactiveBg = isDark ? 'bg-zinc-800/40 hover:bg-zinc-800/80' : 'bg-white hover:bg-gray-50';
                            
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => handleGoalSelect(goal.title)}
                                    className={`
                                        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 shadow-sm hover:shadow-md
                                        ${isSelected ? `${activeBorder} ${activeBg}` : `${inactiveBorder} ${inactiveBg}`}
                                    `}
                                    role="radio"
                                    aria-checked={isSelected}
                                    tabIndex={0}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleGoalSelect(goal.title)}
                                >
                                     <div className={`
                                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                                        ${isSelected ? 'border-green-500' : (isDark ? 'border-gray-500' : 'border-gray-400')}
                                     `}>
                                         {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />}
                                     </div>
                                     <div>
                                        <div className={`font-bold text-sm mb-1 ${isSelected ? (isDark ? 'text-green-300' : 'text-green-900') : (isDark ? 'text-amber-400' : 'text-amber-800')}`}>{goal.title}</div>
                                        <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{goal.description}</div>
                                     </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Challenge Options ("Further Adventures") */}
            {activeStoryCard.challengeOptions && activeStoryCard.challengeOptions.length > 0 && (
                <div className={`mb-6`}>
                    <div className={`flex items-center gap-2 mb-2`}>
                        <span className="text-xl">🚀</span>
                        <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Further Adventures (Optional Challenges)
                        </h5>
                    </div>
                    <div className={`border rounded-lg ${isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-gray-300 bg-white/50'}`}>
                        {activeStoryCard.challengeOptions.map((option) => {
                            const isChecked = !!gameState.challengeOptions[option.id];
                            return (
                                <label 
                                    key={option.id}
                                    className={`flex items-start p-3 border-b last:border-b-0 cursor-pointer hover:bg-black/5 transition-colors ${isDark ? 'border-zinc-700 hover:bg-white/5' : 'border-gray-200'}`}
                                >
                                    <div className="relative flex items-center mt-0.5">
                                        <input 
                                            type="checkbox" 
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            checked={isChecked}
                                            onChange={() => toggleChallengeOption(option.id)}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <span className={`font-medium ${isChecked ? (isDark ? 'text-green-300' : 'text-green-800') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                                            {option.label}
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Detailed Setup Description Block */}
            {activeStoryCard.setupDescription && (
                <SpecialRuleBlock source="story" title="Story Override">
                    {activeStoryCard.setupDescription}
                </SpecialRuleBlock>
            )}

            {/* Solo Mode Information Block */}
            {gameState.setupCardId === 'FlyingSolo' && (
                <SpecialRuleBlock source="expansion" title="10th AE Solo Rules">
                    <p>You may play any Story Card in Expanded Solo Mode. Automated NPC movement and Variable Timer rules apply.</p>
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

            {activeStoryCard.sourceUrl && (
                <div className={`mt-4 pt-2 border-t border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}>
                    <a 
                        href={activeStoryCard.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`inline-flex items-center text-xs font-bold uppercase tracking-wider underline hover:opacity-80 transition-opacity ${isDark ? 'text-blue-400' : 'text-blue-800'}`}
                    >
                        <span>View Community Source</span>
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>
            )}
         </div>
      </div>

      {/* Randomization Toolbar */}
      {(showRandomOption || showDraftOption) && (
          <div className="flex gap-3 mb-2">
              {showRandomOption && (
                  <Button onClick={handleRandomPick} variant="secondary" className="flex-1 text-sm py-2">
                      🎰 Randomly Select 1
                  </Button>
              )}
              {showDraftOption && (
                  <Button onClick={handleGenerateShortList} className={`flex-1 text-sm py-2 ${isDark ? 'bg-blue-900/50 border-blue-800 hover:bg-blue-800/60 text-blue-100' : 'bg-[#1e3a8a] border-[#172554] text-white hover:bg-[#1e40af]'}`}>
                      🃏 Draft 3 Options
                  </Button>
              )}
          </div>
      )}

      {/* Short List View */}
      {shortList.length > 0 && (
          <div className={`${isDark ? 'bg-blue-950/30 border-blue-900/50' : 'bg-blue-50 border-blue-200'} border p-4 rounded-lg mb-4 animate-fade-in`}>
              <div className="flex justify-between items-center mb-3">
                  <h4 className={`font-bold ${isDark ? 'text-blue-200' : 'text-blue-900'}`}>Short-Listed Missions</h4>
                  <span className={`text-xs ${isDark ? 'text-blue-300 bg-blue-900/50' : 'text-blue-600 bg-blue-100'} px-2 py-1 rounded-full font-bold`}>Pick one below or roll</span>
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
                  <Button onClick={handlePickFromShortList} className="flex-1 py-2 text-sm bg-green-700 dark:bg-green-800">
                      🎲 Select Random from Hand
                  </Button>
                  <Button onClick={handleCancelShortList} variant="danger" className="py-2 text-sm px-4">
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
                className={`flex-1 p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-[#d4af37] focus:outline-none ${inputBg} ${inputText} ${inputPlaceholder} transition-colors`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select 
                  value={filterExpansion} 
                  onChange={(e) => setFilterExpansion(e.target.value)}
                  className={`p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-[#d4af37] focus:outline-none ${inputBg} ${inputText} transition-colors`}
              >
                  <option value="all">All Expansions</option>
                  <option value="base">Base Game</option>
                  {availableExpansionsForFilter.map(e => (
                      <option key={e.id} value={e.id}>{e.label}</option>
                  ))}
              </select>
          </div>
          
          <div className={`h-[500px] overflow-y-auto border ${listContainerBorder} rounded-lg ${listContainerBg} p-2 custom-scrollbar`}>
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
                  <div className={`flex flex-col items-center justify-center h-full ${emptyStateText} italic`}>
                      <span className="text-4xl mb-2">🕵️</span>
                      <p>No missions found.</p>
                      {gameState.gameMode === 'solo' && gameState.setupCardId !== 'FlyingSolo' && (
                        <p className="text-xs mt-2 text-red-500">Classic Solo is restricted to 'Awful Lonely in the Big Black'.</p>
                      )}
                      <Button onClick={() => {setSearchTerm(''); setFilterExpansion('all');}} variant="secondary" className="mt-4 text-sm">Clear Filters</Button>
                  </div>
              )}
          </div>
          <div className={`text-right text-xs ${countText}`}>
              Showing {filteredStories.length} of {validStories.length} available missions
          </div>
      </div>
    </div>
  );
};
