import React, { useEffect, useMemo, useState } from 'react';
import { getResourceDetails } from '../utils/resources';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { SpecialRule, StructuredContent, StructuredContentPart, RuleSourceType } from '../types';

const renderSimpleContent = (content: StructuredContent): React.ReactNode => {
  return content.map((part: StructuredContentPart, index: number) => {
    if (typeof part === 'string') {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }
    switch (part.type) {
      case 'strong':
      case 'action':
        return <strong key={index}>{part.content}</strong>;
      default:
        return null;
    }
  });
};

// FIX: Added a helper function to safely map the broader RuleSourceType
// to the narrower source type expected by SpecialRuleBlock. This resolves the
// TypeScript error by explicitly handling 'challenge', 'optionalRule', and 'combinableSetupCard' cases.
const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') {
    return 'warning';
  }
  if (source === 'optionalRule') {
    return 'info';
  }
  if (source === 'combinableSetupCard') {
    return 'setupCard';
  }
  return source;
};


export const ResourcesStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );

  const resourceDetails = React.useMemo(() => 
    getResourceDetails(gameState),
    [gameState]
  );
  
  const { 
    credits, fuel, parts, warrants, goalTokens,
    isFuelDisabled, isPartsDisabled, creditModifications, specialRules,
    boardSetupRules, componentAdjustmentRules,
    smugglersBluesVariantAvailable,
    creditModificationDescription, creditModificationSource,
    fuelModificationDescription, partsModificationDescription,
    alertTokenStackCount, alertTokenStackRule
  } = resourceDetails;

  useEffect(() => {
    if (credits !== gameState.finalStartingCredits) {
        dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: credits });
    }
  }, [credits, dispatch, gameState.finalStartingCredits]);
  
  const hasComplexCreditCalculation = creditModifications.length > 1;
  const hasCreditModification = creditModificationDescription && creditModificationDescription !== 'Standard Allocation';
  
  const allInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [];

    blocks.push(...campaignNotes.map(note => ({
      source: 'story' as const, title: 'Campaign Setup Note', content: note.content
    })));

    blocks.push(...specialRules);

    // If there's a simple credit modification (not a complex calculation),
    // and it's not the default, add it as a special rule block.
    if (hasCreditModification && !hasComplexCreditCalculation && creditModificationSource) {
        blocks.push({
            source: mapRuleSourceToBlockSource(creditModificationSource),
            title: 'Starting Funds Override',
            content: [creditModificationDescription || ''],
        });
    }
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
    };
    
    const sortedBlocks = blocks.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
    
    // Filter out duplicates.
    const uniqueBlocks = sortedBlocks.filter((block, index, self) => 
        index === self.findIndex((b) => (b.title === block.title && JSON.stringify(b.content) === JSON.stringify(b.content)))
    );

    return uniqueBlocks
        .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
        .map((rule, i) => <SpecialRuleBlock key={`rule-${i}`} {...rule} />);
  }, [
      hasCreditModification, hasComplexCreditCalculation, creditModificationSource,
      creditModificationDescription, campaignNotes, specialRules, gameState.setupMode
  ]);

  const useRimVariant = !!gameState.challengeOptions.smugglers_blues_rim_variant;

  const handleVariantChange = (useRim: boolean) => {
      if (useRim !== useRimVariant) {
          dispatch({ type: ActionType.TOGGLE_CHALLENGE_OPTION, payload: 'smugglers_blues_rim_variant' });
      }
  };
  
  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const sectionHeaderColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const sectionHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-700';
  const creditColor = isDark ? 'text-green-400' : 'text-green-700';
  const modsBorder = isDark ? 'border-zinc-700/50' : 'border-gray-200';
  const modsText = isDark ? 'text-gray-400' : 'text-gray-600';
  const disabledBg = isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';
  const disabledTitle = isDark ? 'text-red-300' : 'text-red-800';
  const disabledSub = isDark ? 'text-red-400' : 'text-red-600';
  const disabledValue = isDark ? 'text-red-400' : 'text-red-800';
  const fuelBadgeBg = isDark ? 'bg-yellow-900/40 text-yellow-200 border-yellow-800' : 'bg-yellow-100 text-yellow-900 border-yellow-200';
  const partsBadgeBg = isDark ? 'bg-zinc-800 text-gray-200 border-zinc-700' : 'bg-gray-200 text-gray-800 border-gray-300';
  
  const boardRuleMappings: Record<string, { tokenName: string, locationLine1: string, locationLine2: string, icon: string }> = {
    'Alliance Space Lockdown': {
        tokenName: 'Alliance Alert Tokens',
        locationLine1: 'Planetary Sectors',
        locationLine2: 'Alliance Space',
        icon: '🗺️'
    },
    "Lonely Smuggler's Stash": {
        tokenName: 'Contraband Tokens',
        locationLine1: '3 on each Supply Planet',
        locationLine2: '(except Persephone/Bazaar)',
        icon: '📦'
    }
  };


  return (
    <div className="space-y-6">
      {allInfoBlocks}
      
      {smugglersBluesVariantAvailable && (
        <div className={`${cardBg} rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300 overflow-hidden animate-fade-in-up`}>
          <div className="p-4 md:p-6">
              <h4 className={`font-bold text-lg mb-3 pb-2 border-b ${sectionHeaderColor} ${sectionHeaderBorder}`}>
                  Board Setup: Seeding the 'Verse
              </h4>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Because the <strong>Blue Sun</strong> and <strong>Kalidasa</strong> expansions are active, an optional contraband placement rule is available. Please choose which rule to use:
              </p>
              <div className="space-y-3">
                  <label 
                      onClick={() => handleVariantChange(false)}
                      className={cls("flex items-start p-3 rounded-lg border cursor-pointer transition-colors", !useRimVariant ? (isDark ? 'border-green-600 bg-green-900/20' : 'border-green-600 bg-green-50') : (isDark ? 'border-zinc-700 hover:bg-zinc-800/80' : 'border-gray-200 hover:bg-gray-100'))}
                  >
                      <input type="radio" name="smugglers-variant" checked={!useRimVariant} readOnly className="mt-1 mr-3 accent-green-600"/>
                      <div>
                          <span className="font-bold">Standard Rule</span>
                          <p className="text-xs">Place <strong>3 Contraband</strong> on each Planetary Sector in <strong>Alliance Space</strong>.</p>
                      </div>
                  </label>
                  <label 
                      onClick={() => handleVariantChange(true)}
                      className={cls("flex items-start p-3 rounded-lg border cursor-pointer transition-colors", useRimVariant ? (isDark ? 'border-green-600 bg-green-900/20' : 'border-green-600 bg-green-50') : (isDark ? 'border-zinc-700 hover:bg-zinc-800/80' : 'border-gray-200 hover:bg-gray-100'))}
                  >
                      <input type="radio" name="smugglers-variant" checked={useRimVariant} readOnly className="mt-1 mr-3 accent-green-600"/>
                      <div>
                          <span className="font-bold">Optional Variant</span>
                          <p className="text-xs">Place <strong>2 Contraband</strong> on each Planetary Sector in <strong>Rim Space</strong>.</p>
                      </div>
                  </label>
              </div>
          </div>
        </div>
      )}

      {/* Main container for all resource sections */}
      <div className={`${cardBg} rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300 overflow-hidden`}>
        
        {/* Credits section */}
        <div className={cls("p-4 md:p-6")}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h4 className={`font-bold text-lg ${textColor}`}>Starting Capitol</h4>
              {hasComplexCreditCalculation && gameState.setupMode === 'detailed' ? (
                <button
                  onClick={() => setShowBreakdown(s => !s)}
                  className={`text-xs mt-1 ${modsText} flex items-center gap-1.5 p-1 -ml-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
                  aria-expanded={showBreakdown}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>{showBreakdown ? 'Hide' : 'Show'} Calculation Breakdown</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <p className={`text-xs mt-1 ${modsText} italic`}>
                  {hasCreditModification ? creditModifications[0].description : 'Standard Allocation'}
                </p>
              )}

              {showBreakdown && hasComplexCreditCalculation && (
                <div className={`grid grid-cols-1 xs:grid-cols-[1fr_auto] gap-x-4 text-xs mt-2 border-t ${modsBorder} pt-2 ${modsText} animate-fade-in`}>
                  {creditModifications.map((mod, i) => (
                    <React.Fragment key={i}>
                      <span className="truncate">{mod.description}</span>
                      <span className="font-mono text-left xs:text-right">{mod.value}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className={`text-3xl font-bold font-western drop-shadow-sm ${creditColor} flex-shrink-0`}>${credits.toLocaleString()}</div>
          </div>
        </div>
        
        {/* Fuel & Parts section */}
        <div className={cls("p-4 md:p-6 border-t", cardBorder, isFuelDisabled || isPartsDisabled ? disabledBg : '')}>
          <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-bold text-lg ${isFuelDisabled || isPartsDisabled ? disabledTitle : textColor}`}>Fuel & Parts</h4>
                {(isFuelDisabled || isPartsDisabled) && <p className={`text-xs font-bold mt-1 ${disabledSub}`}>DISABLED</p>}
              </div>
              <div className="text-right">
                {(isFuelDisabled || isPartsDisabled) ? (
                  <span className={`text-xl font-bold ${disabledValue}`}>None</span>
                ) : (
                  <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    <div className={cls("px-2 py-1 rounded mb-1 border", fuel > 6 ? 'font-black' : '', fuelBadgeBg)}>{fuel} Fuel Tokens</div>
                    <div className={cls("px-2 py-1 rounded border", parts > 2 ? 'font-black' : '', partsBadgeBg)}>{parts} Part Tokens</div>
                  </div>
                )}
              </div>
          </div>
          
          {(fuelModificationDescription || partsModificationDescription) ? (
            <div className={cls(
                "text-xs pt-2 border-t space-y-1 mt-2",
                isFuelDisabled || isPartsDisabled 
                    ? `${isDark ? 'border-red-800/50' : 'border-red-200'} ${disabledSub}` 
                    : `${modsBorder} ${modsText}`
            )}>
              {fuelModificationDescription && <p><strong>Fuel:</strong> {fuelModificationDescription}</p>}
              {partsModificationDescription && <p><strong>Parts:</strong> {partsModificationDescription}</p>}
            </div>
          ) : null}
        </div>

        {/* Individual section for Alliance Alert Token Stack */}
        {typeof alertTokenStackCount === 'number' && alertTokenStackCount > 0 && (
          <div className={cls("p-4 md:p-6 border-t", cardBorder)}>
              <div className="flex justify-between items-center">
                  <h4 className={`font-bold text-lg ${textColor}`}>Alliance Alert Tokens</h4>
                  <div className={`text-right text-sm ${modsText} ml-4`}>
                      Stack of <strong>{alertTokenStackCount}</strong>
                      {alertTokenStackRule && <span className="text-xs block">({alertTokenStackRule.multiplier} per player)</span>}
                  </div>
              </div>
          </div>
        )}

        {/* Board Setup Sections - Render one for each rule */}
        {boardSetupRules.map((rule, i) => {
            const mapping = boardRuleMappings[rule.title || ''];
            if (!mapping) return null;

            return (
                <div key={`board-rule-${i}`} className={cls("p-4 md:p-6 border-t", cardBorder)}>
                    <div className="flex justify-between items-center">
                        <h4 className={`font-bold text-lg ${textColor}`}>{mapping.tokenName}</h4>
                        <div className={`text-right text-sm ${modsText} ml-4`}>
                            <div>{mapping.locationLine1}</div>
                            <div className="text-xs">{mapping.locationLine2}</div>
                        </div>
                    </div>
                </div>
            );
        })}
        
        {/* Individual section for Warrants */}
        {warrants > 0 && (
          <div className={cls("p-4 md:p-6 border-t", cardBorder)}>
              <div className="flex justify-between items-center">
                  <h4 className={`font-bold text-lg ${textColor}`}>Warrant Tokens</h4>
                  <div className={`text-right text-sm ${modsText} ml-4`}>
                      Each player begins with <strong>{warrants}</strong>
                  </div>
              </div>
          </div>
        )}

        {/* Individual section for Goal Tokens */}
        {goalTokens > 0 && (
          <div className={cls("p-4 md:p-6 border-t", cardBorder)}>
              <div className="flex justify-between items-center">
                  <h4 className={`font-bold text-lg ${textColor}`}>Goal Tokens</h4>
                  <div className={`text-right text-sm ${modsText} ml-4`}>
                      Begin play with <strong>{goalTokens}</strong>
                  </div>
              </div>
          </div>
        )}
        
        {/* Individual sections for each Component Adjustment */}
        {componentAdjustmentRules.map((rule, i) => (
            <div key={`comp-rule-${i}`} className={cls("p-4 md:p-6 border-t", cardBorder)}>
                <div className="flex justify-between items-center">
                    <h4 className={`font-bold text-lg ${textColor}`}>{rule.title || 'Component Adjustment'}</h4>
                    <div className={`text-right text-sm ${modsText} ml-4`}>
                        {renderSimpleContent(rule.content)}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};