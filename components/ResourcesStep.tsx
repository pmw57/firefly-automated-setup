import React, { useEffect, useMemo } from 'react';
import { getResourceDetails } from '../utils/resources';
import { hasRuleFlag, getResolvedRules } from '../utils/selectors/rules';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';

export const ResourcesStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState, dispatch } = useGameState();
  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );

  const resourceDetails = React.useMemo(() => 
    getResourceDetails(gameState),
    [gameState]
  );
  
  const { credits, fuel, parts, warrants, goalTokens, isFuelDisabled, isPartsDisabled, creditModifications, specialRules, smugglersBluesVariantAvailable } = resourceDetails;

  const useRimVariant = !!gameState.challengeOptions.smugglers_blues_rim_variant;

  const handleVariantChange = (useRim: boolean) => {
      if (useRim !== useRimVariant) {
          dispatch({ type: ActionType.TOGGLE_CHALLENGE_OPTION, payload: 'smugglers_blues_rim_variant' });
      }
  };

  useEffect(() => {
    if (credits !== gameState.finalStartingCredits) {
        dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: credits });
    }
  }, [credits, dispatch, gameState.finalStartingCredits]);
  
  const removeRiver = hasRuleFlag(allRules, 'removeRiver');
  
  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
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

  return (
    <div className="space-y-4">
      {campaignNotes.map((note, i) => (
        <SpecialRuleBlock 
          key={i}
          source="story" 
          title="Campaign Setup Note" 
          content={note.content} 
        />
      ))}

      {smugglersBluesVariantAvailable && (
        <section className={cls("border-l-4 p-4 rounded-r-xl shadow-sm mb-4 transition-all hover:shadow-md backdrop-blur-sm animate-fade-in-up", isDark ? 'border-amber-700 bg-amber-900/20' : 'border-[#b45309] bg-[#fffbeb]')}>
          <div className="flex items-start mb-2">
            <span className="text-xl mr-3 mt-0.5 select-none opacity-80" aria-hidden="true">📜</span>
            <div className="flex-1">
              <span className={cls("text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-0.5", isDark ? 'text-amber-200/90' : 'text-[#92400e]')}>
                Story Override
              </span>
              <h4 className={cls("font-bold text-base leading-tight", isDark ? 'text-amber-200/90' : 'text-[#92400e]')}>Seeding the 'Verse</h4>
            </div>
          </div>
          <div className={cls("text-sm leading-relaxed tracking-wide pl-1 opacity-90", isDark ? 'text-amber-200/90' : 'text-[#92400e]')}>
            <p className="mb-3">Because the <strong>Blue Sun</strong> and <strong>Kalidasa</strong> expansions are active, an optional placement rule is available. Please choose which rule to use:</p>
            <div className="space-y-2">
              <label 
                onClick={() => handleVariantChange(false)}
                className={cls("flex items-start p-3 rounded-lg border cursor-pointer transition-colors", !useRimVariant ? (isDark ? 'border-green-500 bg-green-900/20' : 'border-green-600 bg-green-50') : (isDark ? 'border-zinc-700 hover:bg-zinc-800/80' : 'border-gray-300 hover:bg-gray-50'))}
              >
                <input type="radio" name="smugglers-variant" checked={!useRimVariant} readOnly className="mt-1 mr-3 accent-green-600"/>
                <div>
                  <span className="font-bold">Standard Rule</span>
                  <p className="text-xs">Place <strong>3 Contraband</strong> on each Planetary Sector in <strong>Alliance Space</strong>.</p>
                </div>
              </label>
              <label 
                onClick={() => handleVariantChange(true)}
                className={cls("flex items-start p-3 rounded-lg border cursor-pointer transition-colors", useRimVariant ? (isDark ? 'border-green-500 bg-green-900/20' : 'border-green-600 bg-green-50') : (isDark ? 'border-zinc-700 hover:bg-zinc-800/80' : 'border-gray-300 hover:bg-gray-50'))}
              >
                <input type="radio" name="smugglers-variant" checked={useRimVariant} readOnly className="mt-1 mr-3 accent-green-600"/>
                <div>
                  <span className="font-bold">Optional Variant</span>
                  <p className="text-xs">Place <strong>2 Contraband</strong> on each Planetary Sector in <strong>Rim Space</strong>.</p>
                </div>
              </label>
            </div>
          </div>
        </section>
      )}

      {specialRules.map((rule, i) => <SpecialRuleBlock key={`special-rule-${i}`} {...rule} />)}
      
      <div className={`${cardBg} p-4 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className={`font-bold ${textColor}`}>Starting Credits</h4>
            <div className={`grid grid-cols-1 xs:grid-cols-[1fr_auto] gap-x-4 text-xs mt-1 border-t ${modsBorder} pt-1 ${modsText}`}>
              {creditModifications.map((mod, i) => (
                <React.Fragment key={i}>
                  <span className="truncate">{mod.description}</span>
                  <span className="font-mono text-left xs:text-right">{mod.value}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className={`text-3xl font-bold font-western drop-shadow-sm ${creditColor} flex-shrink-0`}>${credits.toLocaleString()}</div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between transition-colors duration-300 ${isFuelDisabled || isPartsDisabled ? disabledBg : `${cardBg} ${cardBorder}`}`}>
        <div>
          <h4 className={`font-bold ${isFuelDisabled || isPartsDisabled ? disabledTitle : textColor}`}>Fuel & Parts</h4>
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
      
      {warrants > 0 && (
        <SpecialRuleBlock source="story" title="Warrant Issued" content={["Each player begins the game with ", { type: 'strong', content: `${warrants} Warrant Token${warrants > 1 ? 's' : ''}` }, "."]} />
      )}

      {goalTokens > 0 && (
        <SpecialRuleBlock source="story" title="Starting Goal Tokens" content={["Begin play with ", { type: 'strong', content: `${goalTokens} Goal Token${goalTokens > 1 ? 's' : ''}` }, "."]} />
      )}

      {removeRiver && (
        <SpecialRuleBlock source="story" title="Missing Person" content={["Remove ", { type: 'strong', content: "River Tam" }, " from play."]} />
      )}
    </div>
  );
};