
import React, { useMemo, useCallback } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { usePrimeDetails } from '../hooks/usePrimeDetails';
import { StepComponentProps } from './StepContent';
import { SpecialRule } from '../types';
import { cls } from '../utils/style';
import { StructuredContentRenderer } from './StructuredContentRenderer';
import { getCampaignNotesForStep } from '../utils/selectors/story';

interface CustomPrimePanelProps {
  rule: SpecialRule;
  badgeClass: string;
}

const CustomPrimePanel: React.FC<CustomPrimePanelProps> = ({ rule, badgeClass }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    
    const isWide = rule.flags?.includes('col-span-2');

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder, isWide && 'md:col-span-2')}>
            {rule.badge && <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", badgeClass)}>{rule.badge}</div>}
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                {rule.title}
            </h4>
            <div className={cls("text-sm", textColor)}>
                <StructuredContentRenderer content={rule.content} />
            </div>
        </div>
    );
};

export const PrimePumpStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    baseDiscard,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
    infoRules,
    overrideRules,
    primePanels,
    hasStartWithAlertCard,
    disablePriming,
  } = usePrimeDetails(overrides);

  const campaignNotes = useMemo(
      () => getCampaignNotesForStep(gameState, step.id),
      [gameState, step.id]
  );
  
  const formatRules = useCallback((rules: SpecialRule[], addNotes = false) => {
      let combined = [...rules];

      if (addNotes) {
          const notesAsRules: SpecialRule[] = campaignNotes.map(note => ({
              source: 'story',
              title: 'Campaign Setup Note',
              content: note.content
          }));
          combined = [...combined, ...notesAsRules];
      }
      
      const order: Record<SpecialRule['source'], number> = {
          expansion: 1, setupCard: 2, story: 3, warning: 0, info: 0,
      };

      let sorted = combined.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

      if (gameState.setupMode === 'quick') {
        sorted = sorted.filter(b => b.source !== 'story');
      }
      return sorted;
  }, [gameState.setupMode, campaignNotes]);
  
  // Inject calculated logic into the appropriate list for display
  const displayInfo = useMemo(() => {
    const list = [...infoRules];
    if (isHighSupplyVolume && gameState.optionalRules.highVolumeSupply) {
      list.push({ source: 'info', title: 'House Rule Active: High Volume Supply', content: [{ type: 'paragraph', content: ["Due to the number of large supply expansions, the base discard count for Priming the Pump is increased to 4 cards."] }] });
    }
    return formatRules(list);
  }, [infoRules, isHighSupplyVolume, gameState.optionalRules.highVolumeSupply, formatRules]);

  const displayOverrides = useMemo(() => {
    const list = [...overrideRules];
    // Check if a story already provides a custom 'prime' rule to avoid redundant messages.
    const hasStoryPrimeOverride = list.some(r => r.source === 'story');

    if (isBlitz && !hasStoryPrimeOverride) {
      list.push({ source: 'setupCard', title: 'The Blitz: Double Dip', page: 22, manual: 'Core', content: [{ type: 'paragraph', content: [`"Double Dip" rules are in effect. Discard the top ${baseDiscard * 2} cards (2x Base) from each deck.`] }] });
    }
    return formatRules(list, true);
  }, [overrideRules, isBlitz, baseDiscard, formatRules]);

  const stepBadgePurpleBg = isDark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800';

  return (
    <div className="space-y-4">
      
      {displayInfo.map((rule, i) => (
          <OverrideNotificationBlock key={`info-${i}`} {...rule} />
      ))}
      
      {!disablePriming && (
        <div className="bg-surface-card/60 backdrop-blur-sm p-6 rounded-lg border border-border-separator shadow-sm text-center transition-colors duration-300">
          <h4 className="font-bold text-xl font-western mb-4 text-content-primary">Priming The Pump</h4>
          <div className="text-5xl font-bold mb-4 text-content-subtle">🃏</div>
          <p className="text-lg text-content-secondary">
            Shuffle all Supply Decks.
          </p>
          <div className="my-6 p-4 rounded-lg inline-block border bg-surface-success border-border-success">
            <span className="block text-4xl font-bold mb-1 text-content-success">{finalCount}</span>
            <span className="text-sm font-bold uppercase tracking-wide text-green-700 dark:text-green-300">Cards Discarded</span>
          </div>
          <p className="text-sm italic text-content-subtle">
            (From the top of each Supply Deck)
          </p>

          {hasStartWithAlertCard && (
            <div className="mt-6 pt-4 border-t border-border-subtle">
              <h4 className="font-bold text-lg text-content-info">Alliance Alert</h4>
              <p className="text-sm mt-1 text-content-secondary">
                Reveal one <strong>Alliance Alert Card</strong> from the deck and put it into play.
              </p>
            </div>
          )}
        </div>
      )}

      {primePanels.map((panel, i) => (
          <CustomPrimePanel key={`panel-${i}`} rule={panel} badgeClass={stepBadgePurpleBg} />
      ))}

      {displayOverrides.map((rule, i) => (
          <OverrideNotificationBlock key={`override-${i}`} {...rule} />
      ))}
    </div>
  );
};
