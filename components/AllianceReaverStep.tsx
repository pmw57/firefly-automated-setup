
import React, { useMemo, useCallback } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useAllianceReaverDetails } from '../hooks/useAllianceReaverDetails';
import { StepComponentProps } from './StepContent';
import { SpecialRule, StructuredContentPart } from '../types';
import { cls } from '../utils/style';

// Simple renderer for the override content to avoid duplicating the full OverrideNotificationBlock.
const renderContent = (content: StructuredContentPart[]): React.ReactNode => {
    return content.map((part, index) => {
      if (typeof part === 'string') {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
      if (part.type === 'strong' || part.type === 'action') {
        return <strong key={index}>{part.content}</strong>;
      }
      if (part.type === 'br') {
        return <br key={index} />;
      }
      return null;
    });
};

export const AllianceReaverStep: React.FC<StepComponentProps> = () => {
  const { state: gameState } = useGameState();
  const { setupMode } = gameState;

  const {
    infoRules,
    overrideRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride,
    isAllianceDisabled,
    isReaverDisabled
  } = useAllianceReaverDetails();

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const formatRules = useCallback((rules: SpecialRule[], includeShipOverrides = false) => {
      const combined = [...rules];

      // Add the ship-specific overrides to the list if requested.
      // We rely on the subsequent filter to hide them in Quick mode if they come from a Story.
      // Setup Card or Expansion overrides should be visible even in Quick mode.
      if (includeShipOverrides) {
          if (allianceOverride) combined.push(allianceOverride);
          if (reaverOverride) combined.push(reaverOverride);
      }
      
      const order: Record<SpecialRule['source'], number> = {
          expansion: 1, setupCard: 2, story: 3, warning: 0, info: 0,
      };
      
      let sorted = combined.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

      if (setupMode === 'quick') {
        // In Quick mode, we specifically hide Story overrides as they are considered "fluff" 
        // or redundant to the main card text in some contexts, but vital mechanics 
        // from Setup Cards/Expansions must remain.
        sorted = sorted.filter(r => r.source !== 'story');
      }

      return sorted;
  }, [setupMode, allianceOverride, reaverOverride]);
  
  const displayInfo = useMemo(() => formatRules(infoRules), [infoRules, formatRules]);
  const displayOverrides = useMemo(() => formatRules(overrideRules, true), [overrideRules, formatRules]);

  const standardContainerBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const standardContainerBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const headerColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const headerBorder = isDark ? 'border-zinc-800' : 'border-gray-100';

  const allianceBoxBg = isDark ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50 border-blue-100';
  const allianceTitle = isDark ? 'text-blue-300' : 'text-blue-900';
  const allianceText = isDark ? 'text-blue-200' : 'text-blue-800';

  const reaverBoxBg = isDark ? 'bg-red-900/20 border-red-900/50' : 'bg-red-50 border-red-100';
  const reaverTitle = isDark ? 'text-red-300' : 'text-red-900';
  const reaverText = isDark ? 'text-red-200' : 'text-red-800';
  
  const disabledBoxBg = isDark ? 'bg-zinc-800/40 border-zinc-700' : 'bg-gray-100 border-gray-200';
  const disabledTitle = isDark ? 'text-zinc-500 line-through' : 'text-gray-400 line-through';
  const disabledText = isDark ? 'text-zinc-500 italic' : 'text-gray-500 italic';

  return (
    <div className="space-y-4">
      {displayInfo.map((rule, index) => (
          <OverrideNotificationBlock key={`info-${index}`} {...rule} />
      ))}

      <div className={`${standardContainerBg} p-4 rounded-lg border ${standardContainerBorder} shadow-sm mt-4 transition-colors duration-300`}>
        <h3 className={`text-lg font-bold ${headerColor} mb-3 font-western tracking-wide border-b-2 ${headerBorder} pb-1`}>Ship Placement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Alliance Ship Panel */}
          <div className={cls('p-3 rounded border transition-colors', isAllianceDisabled ? disabledBoxBg : allianceBoxBg)}>
            <strong className={cls('block text-sm uppercase mb-1', isAllianceDisabled ? disabledTitle : allianceTitle)}>
              {allianceOverride?.title || 'Alliance Cruiser'}
            </strong>
            <p className={cls('text-sm', isAllianceDisabled ? disabledText : allianceText)}>
              {isAllianceDisabled 
                ? 'Not used in this scenario.' 
                : (allianceOverride ? renderContent(allianceOverride.content) : standardAlliancePlacement)
              }
            </p>
          </div>
          
          {/* Reaver Ship Panel */}
          <div className={cls('p-3 rounded border transition-colors', isReaverDisabled ? disabledBoxBg : reaverBoxBg)}>
            <strong className={cls('block text-sm uppercase mb-1', isReaverDisabled ? disabledTitle : reaverTitle)}>
              {reaverOverride?.title || 'Reaver Cutter'}
            </strong>
            <p className={cls('text-sm', isReaverDisabled ? disabledText : reaverText)}>
              {isReaverDisabled 
                ? 'Not used in this scenario.'
                : (reaverOverride ? renderContent(reaverOverride.content) : standardReaverPlacement)
              }
            </p>
          </div>

        </div>
      </div>

      {displayOverrides.map((rule, index) => (
          <OverrideNotificationBlock key={`override-${index}`} {...rule} />
      ))}
    </div>
  );
};
