import React, { useMemo } from 'react';
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
    specialRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride
  } = useAllianceReaverDetails();

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const allSortedOverrides = useMemo(() => {
    const rules: SpecialRule[] = [...specialRules];
    
    // The alliance/reaver overrides are rendered inline, so the notification blocks
    // for them are for extra context in detailed mode only.
    if (setupMode === 'detailed') {
      if (allianceOverride) {
        rules.push(allianceOverride);
      }
      if (reaverOverride) {
        rules.push(reaverOverride);
      }
    }
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1,
        setupCard: 2,
        story: 3,
        warning: 3,
        info: 4,
    };
    
    const sorted = rules.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

    if (setupMode === 'quick') {
      return sorted.filter(r => r.source !== 'story');
    }

    return sorted;
  }, [specialRules, allianceOverride, reaverOverride, setupMode]);

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
      {allSortedOverrides.map((rule, index) => (
          <OverrideNotificationBlock key={`rule-${index}`} {...rule} />
      ))}

      <div className={`${standardContainerBg} p-4 rounded-lg border ${standardContainerBorder} shadow-sm mt-4 transition-colors duration-300`}>
        <h3 className={`text-lg font-bold ${headerColor} mb-3 font-western tracking-wide border-b-2 ${headerBorder} pb-1`}>Ship Placement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cls('p-3 rounded border', allianceBoxBg)}>
            <strong className={cls('block text-sm uppercase mb-1', allianceTitle)}>{allianceOverride?.title || 'Alliance Cruiser'}</strong>
            <p className={cls('text-sm', allianceText)}>
              {allianceOverride ? renderContent(allianceOverride.content) : standardAlliancePlacement}
            </p>
          </div>
          
          <div className={cls('p-3 rounded border', reaverBoxBg)}>
            <strong className={cls('block text-sm uppercase mb-1', reaverTitle)}>{reaverOverride?.title || 'Reaver Cutter'}</strong>
            <p className={cls('text-sm', reaverText)}>
              {reaverOverride ? renderContent(reaverOverride.content) : standardReaverPlacement}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};