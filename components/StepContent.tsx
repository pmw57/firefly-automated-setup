
import React, { useState } from 'react';
import { GameState, Step, StoryCardConfig, DraftState, DiceResult, ExpansionId, StoryCardDef } from '../types';
import { Button } from './Button';
import { STORY_CARDS, EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../constants';
import { determineJobMode, calculateStartingResources, calculateDraftOutcome } from '../utils';
import { QuotePanel } from './QuotePanel';
import { DiceControls } from './DiceControls';
import { StoryCardGridItem } from './StoryCardGridItem';
import { InlineExpansionIcon } from './InlineExpansionIcon';

interface StepContentProps {
  step: Step;
  stepIndex: number;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
  onPrev: () => void;
}

export const StepContent: React.FC<StepContentProps> = ({ step, stepIndex, gameState, setGameState, onNext, onPrev }) => {
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string>('all');
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);

  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  // --- LOGIC HANDLERS ---

  const handleDetermineOrder = () => {
    const rolls: DiceResult[] = [];
    const takenRolls = new Set<number>();

    for (let i = 0; i < gameState.playerCount; i++) {
      let roll;
      do {
        roll = Math.floor(Math.random() * 20) + 1;
      } while (takenRolls.has(roll));
      takenRolls.add(roll);
      
      const playerName = gameState.playerNames[i] || `Captain ${i + 1}`;
      rolls.push({ player: playerName, roll });
    }

    const newState = calculateDraftOutcome(rolls, gameState.playerCount);
    setDraftState(newState);
  };

  const handleRollChange = (index: number, newValue: string) => {
    if (!draftState) return;
    const val = parseInt(newValue) || 0;
    const newRolls = [...draftState.rolls];
    newRolls[index] = { ...newRolls[index], roll: val };
    const newState = calculateDraftOutcome(newRolls, gameState.playerCount);
    setDraftState(newState);
  };

  const handleStoryCardSelect = (title: string) => {
    setGameState(prev => ({ ...prev, selectedStoryCard: title }));
  };

  // --- RENDER HELPERS ---
  const renderAction = (text: string) => <span className="font-bold text-amber-700">{text}</span>;
  const renderSectionHeader = (title: string) => <h3 className="text-lg font-bold text-gray-800 mb-2 font-western tracking-wide border-b border-gray-100 pb-1">{title}</h3>;
  const renderDynamicBlock = (content: React.ReactNode) => <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg shadow-sm my-4 overflow-hidden">{content}</div>;

  // --- CORE STEPS LOGIC ---

  const renderCoreStep = () => {
    const id = step.data?.id;

    switch (id) {
      case 'core-1': // Nav Decks
        const isRimMode = overrides.rimNavMode;
        const isBrowncoatNav = overrides.browncoatNavMode;
        const isForceReshuffle = overrides.forceReshuffle;
        const isClearerSkies = overrides.clearerSkiesNavMode;
        const isHighPlayerCount = gameState.playerCount >= 3;
        
        // Group "Rim Mode" and "Force Reshuffle" as scenarios that mandate Reshuffle cards at the start
        const hasForcedReshuffle = isRimMode || isForceReshuffle;

        return (
          <>
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
              <ul className="list-disc ml-5 space-y-3 text-gray-700">
                {isBrowncoatNav ? (
                  <li>{renderAction("Shuffle the Alliance Cruiser, and Reaver Cutter cards into the Nav Decks")}, regardless of player count.</li>
                ) : hasForcedReshuffle ? (
                  <>
                    <li>Place the {renderAction("\"RESHUFFLE\"")} cards in the Nav Decks at the start of the game, regardless of the number of players.</li>
                    <li>{renderAction("Shuffle each of the Alliance and Border Nav Decks")}.</li>
                    {(gameState.expansions.blue || gameState.expansions.kalidasa) && (
                        <li className="text-sm italic text-gray-600">Note: This applies to all active decks (including the Rim Space deck).</li>
                    )}
                  </>
                ) : (
                  <li>{renderAction("Shuffle Alliance & Border Nav Cards")}.</li>
                )}

                {isClearerSkies && (
                  <li>
                    <strong>Full Burn Rule:</strong> When initiating a Full Burn, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
                    <br/><span className="text-xs italic text-gray-500">Note: You may not move farther than your Drive Core's range, regardless of the die roll.</span>
                  </li>
                )}
              </ul>
            </div>
            
            {/* Standard Reshuffle Panel - Only show if NO overrides exist that change deck composition/shuffling */}
            {!hasForcedReshuffle && !isBrowncoatNav && (
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Reshuffle Card Rules (Player Count: {gameState.playerCount})
                </div>
                <div className={`p-4 border-l-4 transition-all duration-300 ${!isHighPlayerCount ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <div className={`font-bold ${!isHighPlayerCount ? 'text-green-900' : 'text-gray-500'}`}>1-2 Players</div>
                        {!isHighPlayerCount && <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase tracking-wide">Active</span>}
                    </div>
                    <div className={`text-sm ${!isHighPlayerCount ? 'text-green-800' : 'text-gray-500'}`}>Shuffle the "RESHUFFLE" cards into the deck.</div>
                </div>
                <div className={`p-4 border-l-4 border-t border-t-gray-200 transition-all duration-300 ${isHighPlayerCount ? 'bg-green-50 border-green-600' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <div className={`font-bold ${isHighPlayerCount ? 'text-green-900' : 'text-gray-500'}`}>3+ Players</div>
                        {isHighPlayerCount && <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase tracking-wide">Active</span>}
                    </div>
                    <div className={`text-sm ${isHighPlayerCount ? 'text-green-800' : 'text-gray-500'}`}>Place the "RESHUFFLE" card in the Discard Pile of <em>each</em> Nav Deck.</div>
                </div>
              </div>
            )}
          </>
        );

      case 'core-2': { // Alliance & Reaver
        const { placeAllianceAlertsInAllianceSpace, placeMixedAlertTokens, smugglersBluesSetup, startWithAlertCard, createAlertTokenStackMultiplier } = activeStoryCard.setupConfig || {};
        const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
        const alertStackCount = createAlertTokenStackMultiplier ? createAlertTokenStackMultiplier * gameState.playerCount : 0;

        return (
          <div className="space-y-6">
            {overrides.noAlertTokens ? (
               <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center"><p className="text-green-900 font-bold">Do not use Reaver or Alliance Alert Tokens.</p></div>
            ) : overrides.awfulCrowdedAllianceMode && (
               <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 overflow-hidden shadow-sm">
                  {renderSectionHeader("Special Rule: Alert Tokens")}
                  <ul className="list-disc ml-5 space-y-2 text-gray-800 text-sm">
                     <li>Place an {renderAction("Alert Token")} in <strong>every planetary sector</strong>.</li>
                     <li><strong>Alliance Space:</strong> Place Alliance Alert Tokens.</li>
                     <li><strong>Border & Rim Space:</strong> Place Reaver Alert Tokens.</li>
                     <li className="text-red-700 italic">Do not place Alert Tokens on players' starting locations.</li>
                     <li><strong>Alliance Ship movement</strong> does not generate new Alert Tokens.</li>
                     <li><strong>Reaver Ship movement</strong> generates new Alert Tokens.</li>
                  </ul>
               </div>
            )}
            
            {placeAllianceAlertsInAllianceSpace && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 overflow-hidden shadow-sm">
                   {renderSectionHeader(`Special Rule: ${activeStoryCard.title}`)}
                   <p className="text-gray-800">Place an {renderAction("Alliance Alert Token")} on <strong>every planetary sector in Alliance Space</strong>.</p>
                </div>
            )}

            {placeMixedAlertTokens && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 overflow-hidden shadow-sm">
                   {renderSectionHeader(`Special Rule: ${activeStoryCard.title}`)}
                   <p className="text-gray-800">Place <strong>3 Alliance Alert Tokens</strong> in the 'Verse:</p>
                   <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-800 text-sm">
                      <li>1 in <strong>Alliance Space</strong></li>
                      <li>1 in <strong>Border Space</strong></li>
                      <li>1 in <strong>Rim Space</strong></li>
                   </ul>
                </div>
            )}

            {alertStackCount > 0 && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 overflow-hidden shadow-sm">
                   {renderSectionHeader(`Special Rule: ${activeStoryCard.title}`)}
                   <p className="text-gray-800 mb-2">Create a stack of <strong>{alertStackCount} Alliance Alert Tokens</strong>.</p>
                   <p className="text-xs text-gray-500 italic">(3 x {gameState.playerCount} Players)</p>
                   <p className="text-xs text-gray-500 mt-2">For a longer game, you can add more tokens to the stack.</p>
                </div>
            )}

            {smugglersBluesSetup && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 overflow-hidden shadow-sm">
                   {renderSectionHeader(`Special Rule: ${activeStoryCard.title}`)}
                   {useSmugglersRimRule ? (
                       <p className="text-gray-800">Place <strong>2 Contraband</strong> on each Planetary Sector in <strong>Rim Space</strong>.</p>
                   ) : (
                       <p className="text-gray-800">Place <strong>3 Contraband</strong> on each Planetary Sector in <strong>Alliance Space</strong>.</p>
                   )}
                </div>
            )}

            {startWithAlertCard && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                    <p className="text-purple-900 font-bold">Begin the game with one random Alliance Alert Card in play.</p>
                </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 overflow-hidden">
              {renderSectionHeader("Alliance Cruisers")}
              <p>{overrides.extraCruisers ? <span>{renderAction("Place an Alliance Cruiser")} in the <strong>Regulus</strong> sector <em>and</em> in the <strong>Persephone</strong> sector.</span> : <span>{renderAction("Place the Alliance Cruiser")} in the <strong>Londinium</strong> sector.</span>}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 overflow-hidden">
              {renderSectionHeader("Reaver Cutters")}
              <p>{gameState.expansions.blue ? <span>{renderAction("Place 3 Reaver Cutter models")} in the three border space sectors closest to the <strong>Miranda</strong> planet icon.</span> : <span>{renderAction("Place the 1 Reaver Cutter model")} in the sector with the <strong>Firefly logo</strong> (Regina/Osiris).</span>}</p>
            </div>
          </div>
        );
      }

      case 'core-3': { // Draft
        const isPersephoneStart = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone';
        const isLondiniumStart = activeStoryCard.setupConfig?.startAtLondinium;
        const startOutsideAlliance = activeStoryCard.setupConfig?.startOutsideAllianceSpace;
        const startAtSector = activeStoryCard.setupConfig?.startAtSector;
        const allianceSpaceOffLimits = activeStoryCard.setupConfig?.allianceSpaceOffLimits;

        const isBrowncoatDraft = overrides.browncoatDraftMode;
        const isWantedLeaderMode = overrides.wantedLeaderMode;
        const addBorderHavens = activeStoryCard.setupConfig?.addBorderSpaceHavens;

        return (
          <>
            <p className="mb-4 text-gray-600 italic">Determine who drafts first, then follow the seating order to draft and place ships.</p>
            {!draftState ? (
              <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="mb-4">🎲 Roll for Command</Button>
            ) : (
              <div className="animate-fade-in space-y-6">
                <DiceControls draftState={draftState} onRollChange={handleRollChange} />
                
                {isWantedLeaderMode && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                    <p className="text-red-900 font-bold flex items-center"><span className="text-xl mr-2">⚠️</span>Special Setup Rule: The Heat Is On</p>
                    <p className="text-gray-800 mt-1">Choose Ships & Leaders normally, but <strong>each Leader begins play with a Wanted token</strong>.</p>
                  </div>
                )}
                
                {addBorderHavens && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
                    <p className="text-blue-900 font-bold flex items-center"><span className="text-xl mr-2">ℹ️</span>Special Setup Rule: {activeStoryCard.title}</p>
                    <p className="text-gray-800 mt-1"><strong>Choose Havens:</strong> Each player chooses a Haven token. Havens <strong>must be in Border Space</strong>.</p>
                  </div>
                )}

                {startOutsideAlliance && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                     <p className="text-amber-900 font-bold">⚠️ Placement Restriction</p>
                     <p className="text-gray-800 mt-1">Players' starting locations <strong>may not be within Alliance Space</strong>.</p>
                  </div>
                )}
                
                {allianceSpaceOffLimits && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                     <p className="text-red-900 font-bold">🚫 Restricted Airspace</p>
                     <p className="text-gray-800 mt-1"><strong>Alliance Space is Off Limits</strong> until Goal 3.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Draft Order */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-200 text-blue-800 text-xs font-bold px-2 py-1 rounded-bl">Step 1</div>
                    <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Draft Phase</h4>
                    <p className="text-xs text-blue-800 mb-3 italic">
                      {isBrowncoatDraft 
                        ? "Winner selects Leader OR buys Ship. Pass to Left."
                        : "Winner selects Leader & Ship. Pass to Left."}
                    </p>
                    <ul className="space-y-2">
                      {draftState.draftOrder.map((player, i) => (
                        <li key={i} className="flex items-center bg-white p-2 rounded shadow-sm">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center mr-2">{i + 1}</span>
                          <span className="text-sm font-medium">{player}</span>
                          {i === 0 && <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">First Pick</span>}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Placement Order */}
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-bl">Step 2</div>
                    <h4 className="font-bold text-amber-900 mb-2 border-b border-amber-200 pb-1">Placement Phase</h4>
                    
                    {isPersephoneStart || isLondiniumStart || startAtSector ? (
                      <div className="bg-white p-3 rounded text-center border border-amber-300">
                        <p className="font-bold text-amber-800 mb-1">Special Story Rule</p>
                        <p className="text-sm text-gray-700">All ships start at <strong>{startAtSector || (isPersephoneStart ? 'Persephone' : 'Londinium')}</strong>.</p>
                        <p className="text-xs text-gray-500 italic mt-1">(Do not place in separate sectors)</p>
                      </div>
                    ) : (
                      <>
                         <p className="text-xs text-amber-800 mb-3 italic">
                          {isBrowncoatDraft 
                            ? "Pass back to Right. Make remaining choice. Buy Fuel ($100)."
                            : "Pass to Right (Anti-Clockwise). Place Ship in Sector."}
                        </p>
                        <ul className="space-y-2">
                          {draftState.placementOrder.map((player, i) => (
                            <li key={i} className="flex items-center bg-white p-2 rounded shadow-sm">
                              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center mr-2">{i + 1}</span>
                              <span className="text-sm font-medium">{player}</span>
                              {i === 0 && <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">First Place</span>}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
                {isBrowncoatDraft && (
                   <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 border-l-4 border-gray-500 mt-4">
                      <strong>Market Phase:</strong> Once all players have purchased a ship and chosen a leader, everyone may buy fuel ($100) and parts ($300).
                      <br/><span className="text-xs italic">Reminder: Free starting fuel/parts are disabled in this mode.</span>
                   </div>
                )}
              </div>
            )}
          </>
        );
      }

      case 'core-4': // Goal
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
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
               <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                  <h3 className="font-bold text-lg font-western tracking-wider">Mission Dossier</h3>
                  <span className="text-xs uppercase tracking-widest bg-gray-700 px-2 py-1 rounded text-gray-300">Active Goal</span>
               </div>
               <div className="p-6 bg-paper-texture">
                  <div className="flex items-center mb-4">
                     {activeStoryCard.requiredExpansion ? (
                        <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-10 h-10 mr-3" />
                     ) : (
                        <div className="w-10 h-10 mr-3 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500 font-bold">BG</div>
                     )}
                     <h4 className="text-2xl font-bold text-gray-900 font-western">{activeStoryCard.title}</h4>
                  </div>
                  <p className="text-gray-700 italic font-serif text-lg leading-relaxed border-l-4 border-gray-300 pl-4 mb-4">"{activeStoryCard.intro}"</p>
                  
                  {/* Detailed Setup Description Block */}
                  {activeStoryCard.setupDescription && (
                      <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded text-amber-900 shadow-sm">
                          <h5 className="font-bold text-sm uppercase tracking-wide mb-1 flex items-center">
                             <span className="mr-2">⚡</span> Setup Changes
                          </h5>
                          <p className="text-sm">{activeStoryCard.setupDescription}</p>
                      </div>
                  )}

                  {setupNote && !activeStoryCard.setupDescription && (
                      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-sm text-amber-900 font-bold animate-pulse mt-4">
                          {setupNote}
                      </div>
                  )}
               </div>
            </div>

            {/* Randomization Toolbar */}
            <div className="flex gap-3 mb-2">
                <Button onClick={handleRandomPick} variant="secondary" className="flex-1 text-sm py-2">
                    🎰 Randomly Select 1
                </Button>
                <Button onClick={handleGenerateShortList} className="flex-1 text-sm py-2 bg-blue-600 hover:bg-blue-700 border-blue-800">
                    🃏 Draft 3 Options
                </Button>
            </div>

            {/* Short List View */}
            {shortList.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-blue-900">Short-Listed Missions</h4>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-bold">Pick one below or roll</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                        {shortList.map((card, idx) => (
                             <StoryCardGridItem 
                                key={idx}
                                card={card}
                                isSelected={gameState.selectedStoryCard === card.title}
                                onClick={() => handleStoryCardSelect(card.title)}
                                isShortList={true}
                             />
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <Button onClick={handlePickFromShortList} className="flex-1 py-2 text-sm bg-green-600">
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
                      className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        value={filterExpansion} 
                        onChange={(e) => setFilterExpansion(e.target.value)}
                        className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none bg-white"
                    >
                        <option value="all">All Expansions</option>
                        <option value="base">Base Game</option>
                        {EXPANSIONS_METADATA.filter(e => gameState.expansions[e.id]).map(e => (
                            <option key={e.id} value={e.id}>{e.label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="h-[500px] overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-2 custom-scrollbar">
                    {filteredStories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredStories.map((card, idx) => (
                                <StoryCardGridItem 
                                    key={idx}
                                    card={card}
                                    isSelected={gameState.selectedStoryCard === card.title}
                                    onClick={() => handleStoryCardSelect(card.title)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                            <span className="text-4xl mb-2">🕵️</span>
                            <p>No missions found.</p>
                            <Button onClick={() => {setSearchTerm(''); setFilterExpansion('all');}} variant="secondary" className="mt-4 text-sm">Clear Filters</Button>
                        </div>
                    )}
                </div>
                <div className="text-right text-xs text-gray-400">
                    Showing {filteredStories.length} of {validStories.length} available missions
                </div>
            </div>
          </div>
        );

      case 'core-5': { // Resources
        const { totalCredits, bonusCredits, noFuelParts, customFuel } = calculateStartingResources(activeStoryCard, overrides);
        const { startWithWarrant, startingWarrantCount, removeRiver, nandiCrewDiscount } = activeStoryCard.setupConfig || {};

        return (
          <div className="space-y-4">
             <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-700">Credits</h4>
                    {bonusCredits > 0 ? (
                        <p className="text-sm text-gray-500">Base ${overrides.startingCredits || 3000} + Bonus ${bonusCredits}</p>
                    ) : (
                        <p className="text-sm text-gray-500">Standard Allocation</p>
                    )}
                </div>
                <div className="text-3xl font-bold text-green-700 font-western">${totalCredits}</div>
             </div>

             <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between ${noFuelParts ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                <div>
                    <h4 className={`font-bold ${noFuelParts ? 'text-red-800' : 'text-gray-700'}`}>Fuel & Parts</h4>
                    {noFuelParts && <p className="text-xs text-red-600 font-bold">DISABLED BY STORY CARD / SCENARIO</p>}
                </div>
                <div className="text-right">
                    {noFuelParts ? (
                        <span className="text-xl font-bold text-red-800">None</span>
                    ) : (
                        <div className="text-sm font-bold text-gray-800">
                           <div className="bg-yellow-100 px-2 py-1 rounded mb-1">{customFuel ?? 6} Fuel Tokens</div>
                           <div className="bg-gray-200 px-2 py-1 rounded">2 Part Tokens</div>
                        </div>
                    )}
                </div>
             </div>
             
             {/* Special Rule for Running On Empty or similar */}
             {noFuelParts && (
                 <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 text-sm text-yellow-900">
                    <strong>Market Update:</strong> Fuel costs $300 each (unless purchased from Harken for $100).
                 </div>
             )}
             
             {removeRiver && (
                 <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded shadow-sm">
                    <strong className="text-purple-900 block">Remove Character</strong>
                    <span className="text-purple-800 text-sm">Remove <strong>River Tam</strong> from play.</span>
                 </div>
             )}
             
             {nandiCrewDiscount && (
                 <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
                    <strong className="text-blue-900 block">Hiring Bonus</strong>
                    <span className="text-blue-800 text-sm">Nandi pays half price (rounded up) when hiring crew.</span>
                 </div>
             )}

             {/* Warrant Token Rule */}
             {(startWithWarrant || (startingWarrantCount && startingWarrantCount > 0)) && (
                 <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded shadow-sm flex items-center">
                    <span className="text-2xl mr-3">👮</span>
                    <div>
                        <strong className="text-red-900 block">Warrant Issued</strong>
                        <span className="text-red-800 text-sm">Each player begins the game with <strong>{startingWarrantCount || 1} Warrant Token{startingWarrantCount !== 1 ? 's' : ''}</strong>.</span>
                    </div>
                 </div>
             )}
          </div>
        );
      }

      case 'core-6': // Starting Jobs
        const jobMode = determineJobMode(activeStoryCard, overrides);
        const { forbiddenStartingContact, allowedStartingContacts, removePiracyJobs, smugglersBluesSetup, removeJobDecks, sharedHandSetup } = activeStoryCard.setupConfig || {};

        const renderJobInstructions = () => {
             // 1. Story Card Modes (Highest Priority)
             if (removeJobDecks) {
                 return (
                     <div className="bg-red-50 p-4 rounded border border-red-200">
                         <h4 className="font-bold text-red-900 mb-2">Setup Restriction</h4>
                         <p><strong>Remove all Job Card decks from the game.</strong></p>
                         <p className="text-sm mt-1">There's no time for working other Jobs.</p>
                     </div>
                 );
             }

             if (jobMode === 'caper_start') {
                 return (
                     <div className="bg-purple-50 p-4 rounded border border-purple-200">
                         <h4 className="font-bold text-purple-900 mb-2">Special Story Setup</h4>
                         <p><strong>Do not deal Starting Jobs.</strong></p>
                         <p>Each player begins the game with <strong>one Caper Card</strong> instead.</p>
                     </div>
                 );
             }
             if (jobMode === 'no_jobs') {
                 return <div className="p-4 bg-gray-100 rounded text-center font-bold text-gray-600">Do not take Starting Jobs.</div>;
             }
             if (jobMode === 'wind_takes_us') {
                 return (
                     <div className="bg-blue-50 p-4 rounded border border-blue-200">
                         <h4 className="font-bold text-blue-900 mb-2">Where The Wind Takes Us</h4>
                         {overrides.rimJobMode ? (
                            <p className="mb-2 text-sm">Each player chooses one <strong>Blue Sun or Kalidasa</strong> Contact Deck:</p>
                         ) : (
                            <p className="mb-2 text-sm">Each player chooses <strong>one Contact Deck</strong> of their choice:</p>
                         )}
                         <ul className="list-disc ml-5 mb-3 text-sm">
                             <li>Draw <strong>{gameState.playerCount <= 3 ? '4' : '3'} Jobs</strong> from that deck.</li>
                             <li>Place a <strong>Goal Token</strong> at the drop-off/destination sector of each Job.</li>
                             <li>Return all Jobs to the deck and reshuffle.</li>
                         </ul>
                         <p className="font-bold text-red-700">Do not deal Starting Jobs.</p>
                         
                         {overrides.rimJobMode && (
                             <div className="mt-3 pt-3 border-t border-blue-200">
                                 <p className="text-xs font-bold text-blue-800 uppercase mb-1">Valid Decks (Rim Setup):</p>
                                 <div className="flex flex-wrap gap-2">
                                     {['Fanty & Mingo', 'Lord Harrow', 'Mr. Universe', 'Magistrate Higgins'].map(c => (
                                         <span key={c} className="text-xs bg-white px-2 py-1 rounded border border-blue-100">{c}</span>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 );
             }
             if (jobMode === 'draft_choice') {
                 return (
                     <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                         <h4 className="font-bold text-indigo-900 mb-2">Draft Choice</h4>
                         <p className="mb-2">In reverse player order, each player chooses <strong>3 different Contact Decks</strong>.</p>
                         <p className="mb-2">Draw the top Job Card from each chosen deck.</p>
                         {forbiddenStartingContact === 'Niska' && <p className="text-red-600 text-sm font-bold">Note: Mr. Universe is excluded.</p>}
                         <p className="text-xs text-gray-500 mt-2">Players may discard any starting jobs they do not want.</p>
                     </div>
                 );
             }
             
             // 2. Scenario Overrides

             if (jobMode === 'times_jobs') {
                 return (
                     <div className="bg-amber-50 p-4 rounded border border-amber-200">
                         <h4 className="font-bold text-amber-900 mb-2">Time's Not On Our Side</h4>
                         <p>Each player draws <strong>3 jobs</strong> from <strong>one Contact Deck</strong> of their choice.</p>
                         <p className="text-sm italic text-gray-600 mt-1">Players may draw from the same Contact.</p>
                         <p className="text-xs text-gray-500 mt-2">Players may discard any starting jobs they do not want.</p>
                     </div>
                 );
             }

             // Contact List Logic for Standard / Specific Lists
             let contacts: string[] = [];
             
             if (jobMode === 'rim_jobs') {
                 // The Rim's The Thing logic
                 if (gameState.expansions.blue) contacts.push('Fanty & Mingo', 'Lord Harrow');
                 if (gameState.expansions.kalidasa) contacts.push('Magistrate Higgins', 'Mr. Universe');
             } else if (jobMode === 'buttons_jobs') {
                 contacts = ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'];
             } else if (jobMode === 'awful_jobs') {
                 contacts = ['Harken', 'Amnon Duul', 'Patience'];
             } else if (jobMode === 'high_alert_jobs') {
                 // Any contact EXCEPT Harken
                 return (
                     <div className="bg-red-50 p-4 rounded border border-red-200">
                         <h4 className="font-bold text-red-900 mb-2">Alliance High Alert</h4>
                         <p className="mb-2"><strong>Do not use Harken.</strong></p>
                         <p>Draw <strong>3 starting jobs</strong> from <strong>any combination</strong> of other Contacts.</p>
                         <p className="text-xs text-gray-500 mt-2">Players may discard any starting jobs they do not want.</p>
                     </div>
                 );
             } else {
                 // Standard Logic
                 contacts = ['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska'];
             }

             // Apply Filters (Forbidden / Allowed)
             if (forbiddenStartingContact) {
                 contacts = contacts.filter(c => c !== forbiddenStartingContact);
             }
             if (allowedStartingContacts && allowedStartingContacts.length > 0) {
                 contacts = contacts.filter(c => allowedStartingContacts.includes(c));
             }

             return (
                 <div className="bg-white p-4 rounded border border-gray-200">
                     <p className="mb-3 font-bold text-gray-700">Draw 1 Job Card from each:</p>
                     <div className="flex flex-wrap gap-2 mb-4">
                         {contacts.map(contact => (
                             <span key={contact} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-300 shadow-sm font-medium">
                                 {contact}
                             </span>
                         ))}
                     </div>
                     
                     {/* Specific Extra Instruction for Buttons */}
                     {jobMode === 'buttons_jobs' && <p className="mb-2 text-sm font-bold text-purple-700">+ Draw 1 Caper Card</p>}

                     <p className="text-sm text-gray-600 border-t pt-2 mt-2">
                        Discard any unwanted jobs. Keep a hand of <strong>up to three</strong> Job Cards.
                     </p>
                 </div>
             );
        };

        return (
            <div className="space-y-4">
                {sharedHandSetup && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm mb-4">
                         <h4 className="font-bold text-blue-900 mb-1">Setup: Shared Hand</h4>
                         <p className="text-sm text-blue-800">
                             Place <strong>one Job from each Contact</strong> face up on top of its deck. 
                             These face up Jobs form a shared hand of Inactive Jobs that everyone may use.
                         </p>
                    </div>
                )}

                {renderJobInstructions()}
                
                {smugglersBluesSetup && (
                     <div className="bg-green-50 p-4 rounded border border-green-200 text-sm text-green-800 font-bold shadow-sm">
                        Place a $2000 bill under Amnon Duul, Patience, Badger, and Niska's Contact Decks.
                     </div>
                )}

                {removePiracyJobs && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-900 mt-4">
                        <strong>Cleanup:</strong> Pull all remaining Piracy Jobs from the Contact Decks and discard them. Reshuffle.
                    </div>
                )}
            </div>
        );

      case 'core-prime': // Priming the Pump
         const multiplier = activeStoryCard.setupConfig?.primingMultiplier || 1;
         const isBlitz = overrides.blitzPrimeMode;
         
         // Base Discard Count Logic
         let baseDiscard = 3;
         if (gameState.expansions.blue || gameState.expansions.kalidasa || gameState.expansions.pirates) {
             baseDiscard = 4;
         }
         
         // Blitz Override ("Double Dip" logic is roughly x2 but explicitly "top 6")
         let finalCount = baseDiscard * multiplier;
         let title = "Priming The Pump";
         
         if (isBlitz) {
             title = "Priming The Pump: Double Dip";
             finalCount = 6;
         }

        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
             <h4 className="font-bold text-xl text-gray-800 font-western mb-4">{title}</h4>
             <div className="text-5xl font-bold text-gray-300 mb-4">🃏</div>
             <p className="text-lg text-gray-700">
                Shuffle all Supply Decks.
             </p>
             <div className="my-6 bg-green-50 p-4 rounded-lg inline-block border border-green-200">
                <span className="block text-4xl font-bold text-green-700 mb-1">{finalCount}</span>
                <span className="text-sm font-bold text-green-800 uppercase tracking-wide">Cards Discarded</span>
             </div>
             <p className="text-sm text-gray-500 italic">
                (From the top of each Supply Deck)
             </p>
          </div>
        );

      default:
        return null;
    }
  };

  // --- DYNAMIC STEPS LOGIC ---

  const renderDynamicStep = () => {
    const id = step.id; // e.g. 'D_RIM_JOBS', 'step-dynamic-D_RIM_JOBS'

    if (id.includes('D_RIM_JOBS')) {
       return renderDynamicBlock(
           <p className="text-lg text-gray-800 leading-relaxed">
             Separate the Job Cards from the <InlineExpansionIcon type="blue" /> and <InlineExpansionIcon type="kalidasa" /> expansions. 
             These are marked with a specific icon. Use <strong>only these cards</strong> as your Contact Decks. 
             The Job Cards from the core game will not be used.
           </p>
       );
    }
    if (id.includes('D_TIME_LIMIT')) {
        return renderDynamicBlock(
            <div className="space-y-3">
                <p>Give a pile of <strong>20 Disgruntled Tokens</strong> to the player taking the first turn. These tokens will be used as Game Length Tokens.</p>
                <p>Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.</p>
                <p className="font-bold text-red-700">If time runs out before the Story Card is completed, the player with the most credits wins.</p>
            </div>
        );
    }
    if (id.includes('D_SHUTTLE')) {
        return renderDynamicBlock(
             <div className="space-y-3">
                 <p className="font-bold text-purple-900 border-b border-purple-200 pb-2">Draft Shuttles from Supply</p>
                 <ul className="list-decimal ml-5 space-y-2">
                     <li>Pull all <strong>Shuttles</strong> from the Supply Decks.</li>
                     <li>Starting with the winner of the Ship Roll, each player takes <strong>1 Shuttle</strong> for free.</li>
                     <li>Selection passes to the <strong>left</strong>.</li>
                     <li>Place remaining Shuttles in their respective discard piles.</li>
                 </ul>
             </div>
        );
    }
    if (id.includes('D_HAVEN_DRAFT')) {
        return (
            <div className="space-y-4">
                 <p className="mb-4 text-gray-600 italic">Roll to determine Draft Order. Ships start at Havens.</p>
                 {!draftState ? (
                    <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="mb-4">🎲 Roll for Haven Draft</Button>
                 ) : (
                    <div className="animate-fade-in space-y-6">
                        <DiceControls draftState={draftState} onRollChange={handleRollChange} />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Draft Phase (Standard Order)</h4>
                                <p className="text-xs text-blue-800 mb-3 italic">Winner chooses Leader & Ship first.</p>
                                <ul className="space-y-1 text-sm">
                                    {draftState.draftOrder.map((p, i) => <li key={i}>{i+1}. {p}</li>)}
                                </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="font-bold text-green-900 mb-2 border-b border-green-200 pb-1">Haven Placement (Reverse Order)</h4>
                                <p className="text-xs text-green-800 mb-3 italic">Last player places Haven first.</p>
                                <ul className="space-y-1 text-sm">
                                    {draftState.placementOrder.map((p, i) => <li key={i}>{i+1}. {p}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200 text-sm text-yellow-900">
                             <strong>Placement Rules:</strong>
                             <ul className="list-disc ml-5 mt-1 space-y-1">
                                 <li>Unoccupied Planetary Sector adjacent to a Supply Planet.</li>
                                 <li>Cannot be placed in a Sector with a Contact.</li>
                                 <li><strong>Important:</strong> Ships start at their Havens.</li>
                             </ul>
                             {/* Warning if Mad Verse is active */}
                             {activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' && (
                                 <div className="mt-3 bg-red-100 p-2 rounded text-red-800 font-bold border border-red-300">
                                     ⚠️ CONFLICT: Story Card override active. Ships must start at Persephone despite Haven rules!
                                 </div>
                             )}
                        </div>
                    </div>
                 )}
            </div>
        );
    }
    if (id.includes('D_BC_CAPITOL')) {
        const { totalCredits, bonusCredits } = calculateStartingResources(activeStoryCard, overrides);
        return renderDynamicBlock(
            <div className="text-center">
                <p className="text-lg text-gray-800 mb-2">Each player receives:</p>
                <div className="text-4xl font-bold text-green-800 font-western my-3">${totalCredits}</div>
                {bonusCredits > 0 && <p className="text-sm text-gray-500">(Includes ${bonusCredits} Story Bonus)</p>}
            </div>
        );
    }
    if (id.includes('D_LOCAL_HEROES')) {
        return renderDynamicBlock(
            <div className="space-y-3">
                <h4 className="font-bold text-gray-900 border-b pb-1">Local Heroes Bonuses</h4>
                <ul className="list-disc ml-5 space-y-2">
                    <li><strong>Shore Leave:</strong> At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.</li>
                    <li><strong>Home Field Advantage:</strong> When you proceed with Misbehaving in the same System as your Haven, take <strong>$100</strong>.</li>
                </ul>
            </div>
        );
    }
    if (id.includes('D_ALLIANCE_ALERT')) {
        return renderDynamicBlock(
            <div className="space-y-3">
                <p>Begin the game with <strong>one random Alliance Alert Card</strong> in play.</p>
                <p className="text-sm italic">Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck.</p>
            </div>
        );
    }
    if (id.includes('D_PRESSURES_HIGH')) {
        return renderDynamicBlock(
            <div className="space-y-4">
                 <div>
                    <strong className="block text-red-800 mb-1">Alliance Alert</strong>
                    <p>Begin the game with one random Alliance Alert Card in play.</p>
                 </div>
                 <div className="border-t border-green-400 pt-3">
                    <strong className="block text-red-800 mb-1">Wanted Accumulation</strong>
                    <ul className="list-disc ml-5 text-sm">
                        <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
                        <li><strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.</li>
                    </ul>
                 </div>
            </div>
        );
    }
    if (id.includes('D_STRIP_MINING')) {
        return renderDynamicBlock(
            <div className="space-y-3">
                <h4 className="font-bold text-purple-900">The Dinosaur Draft</h4>
                <ol className="list-decimal ml-5 space-y-2 text-sm">
                    <li>Choose 1 Supply Deck to be "Strip Mined".</li>
                    <li>The winner of the Ship Roll claims the <strong>Dinosaur</strong>.</li>
                    <li>Reveal <strong>{gameState.playerCount} cards</strong> from the top of the chosen deck.</li>
                    <li>Starting at the Dinosaur and going left, draft one card for free.</li>
                    <li>Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.</li>
                </ol>
            </div>
        );
    }
    
    return <div className="p-4 text-red-500">Content for {id} not found.</div>;
  };


  // --- MAIN RENDER ---
  const isCore = step.type === 'core';
  const stepId = step.data?.id || step.id || '';

  return (
    <div className="animate-fade-in-up">
        {/* Floating Quote Panel - Top Right */}
        <QuotePanel stepId={stepId} />

        <div className="clear-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-western border-b-2 border-green-800 pb-2 inline-block pr-10">
                <span className="text-green-700 mr-2">{stepIndex}.</span>
                {step.data?.title || step.id}
            </h2>

            {/* Main Content Area */}
            <div className="relative">
                 {isCore ? renderCoreStep() : renderDynamicStep()}
            </div>
        </div>

        <div className="mt-8 flex justify-between clear-both pt-6 border-t border-gray-200">
            <Button onClick={onPrev} variant="secondary" className="shadow-sm">
                ← Previous
            </Button>
            <Button onClick={onNext} className="shadow-lg hover:translate-y-[-2px] transition-transform">
                Next Step →
            </Button>
        </div>
    </div>
  );
};
