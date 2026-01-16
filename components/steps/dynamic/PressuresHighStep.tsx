import React, { useMemo } from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';
import { useGameState } from '../../../hooks/useGameState';
import { getResolvedRules } from '../../../utils/selectors/rules';
import { OverrideNotificationBlock } from '../../SpecialRuleBlock';
import { AddSpecialRule, RuleSourceType, SpecialRule } from '../../../types';

const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') return 'warning';
  if (source === 'optionalRule') return 'info';
  if (source === 'combinableSetupCard') return 'setupCard';
  return source as SpecialRule['source'];
};

export const PressuresHighStep = (): React.ReactElement => {
    const { theme } = useTheme();
    const { state: gameState } = useGameState();
    const isDark = theme === 'dark';
  
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const headerColor = isDark ? 'text-red-400' : 'text-red-800';

    const specialRules = useMemo(() => {
        const rules = getResolvedRules(gameState)
            .filter((r): r is AddSpecialRule => r.type === 'addSpecialRule' && r.category === 'pressures_high')
            .map(r => ({
                ...r.rule,
                source: mapRuleSourceToBlockSource(r.source)
            }));
            
        const order: Record<SpecialRule['source'], number> = {
            expansion: 1,
            setupCard: 2,
            story: 3,
            warning: 3,
            info: 4,
        };
        
        return rules.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
    }, [gameState]);

    return (
        <div className="space-y-4">
            {specialRules.map((rule, i) => (
                <OverrideNotificationBlock key={i} {...rule} />
            ))}

            <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
                <h4 className={cls("font-bold text-lg mb-2", headerColor)}>The Pressure's High</h4>
                <div className={cls("space-y-4", textColor)}>
                    <p>
                        <strong>Alliance Alert:</strong> Begin the game with one random Alliance Alert Card in play.
                    </p>
                    <div>
                        <strong>Wanted Accumulation:</strong>
                        <ul className="list-disc list-inside ml-4 text-sm mt-1">
                            <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
                            <li>
                                <strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};