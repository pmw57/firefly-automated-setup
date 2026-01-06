import React, { useMemo } from 'react';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { getAllianceReaverDetails } from '../utils/alliance';
import { StepComponentProps } from './StepContent';
import { SpecialRule } from '../types';

export const AllianceReaverStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const { overrides = {} } = step;
  const { setupMode } = gameState;

  const {
    specialRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride
  } = React.useMemo(() => 
    getAllianceReaverDetails(gameState, overrides), 
    [gameState, overrides]
  );

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const showAllianceOverride = allianceOverride && (setupMode === 'detailed' || allianceOverride.source !== 'expansion');
  const showReaverOverride = reaverOverride && (setupMode === 'detailed' || reaverOverride.source !== 'expansion');
  
  const showStandardSection = !showAllianceOverride || !showReaverOverride;

  const allSortedOverrides = useMemo(() => {
    const rules: SpecialRule[] = [...specialRules];
    if (showAllianceOverride && allianceOverride) {
        rules.push(allianceOverride);
    }
    if (showReaverOverride && reaverOverride) {
        rules.push(reaverOverride);
    }
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1,
        setupCard: 2,
        story: 3,
        warning: 3,
        info: 4,
    };
    
    return rules.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
  }, [specialRules, allianceOverride, reaverOverride, showAllianceOverride, showReaverOverride]);

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

  return (
    <div className="space-y-4">
      {allSortedOverrides
        .filter(rule => setupMode === 'detailed' || rule.source !== 'expansion')
        .map((rule, index) => (
          <SpecialRuleBlock key={`rule-${index}`} {...rule} />
      ))}

      {showStandardSection && (
        <div className={`${standardContainerBg} p-4 rounded-lg border ${standardContainerBorder} shadow-sm mt-4 transition-colors duration-300`}>
          <h3 className={`text-lg font-bold ${headerColor} mb-3 font-western tracking-wide border-b-2 ${headerBorder} pb-1`}>Standard Ship Placement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!showAllianceOverride && (
              <div className={`p-3 rounded border ${allianceBoxBg}`}>
                <strong className={`block text-sm uppercase mb-1 ${allianceTitle}`}>Alliance Cruiser</strong>
                <p className={`text-sm ${allianceText}`}>{standardAlliancePlacement}</p>
              </div>
            )}
            {!showReaverOverride && (
              <div className={`p-3 rounded border ${reaverBoxBg}`}>
                <strong className={`block text-sm uppercase mb-1 ${reaverTitle}`}>Reaver Cutter</strong>
                <p className={`text-sm ${reaverText}`}>{standardReaverPlacement}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};