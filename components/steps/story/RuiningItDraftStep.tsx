import React, { useMemo } from 'react';
import { useTheme } from '../../ThemeContext';
import { useDraftDetails } from '../../../hooks/useDraftDetails';
import { cls } from '../../../utils/style';
import { StepComponentProps } from '../../StepContent';
import { OverrideNotificationBlock } from '../../SpecialRuleBlock';
import { useGameState } from '../../../hooks/useGameState';
import { SpecialRule } from '../../../types';

// This component was moved from DraftStep.tsx
const RuiningItSetupPanel = ({ stepBadgeClass }: { stepBadgeClass: string }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const strongColor = isDark ? 'text-amber-400' : 'text-amber-700';

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 1</div>
            <h4 className={cls("font-bold mb-3 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                Asymmetric Setup: A Tale of Two Twins
            </h4>
            <ol className={cls("list-decimal list-inside space-y-4 text-sm", textColor)}>
                <li>
                    <strong className={strongColor}>Player 2 (You): Prepare the "Stolen" Ship</strong>
                    <ul className={cls("list-disc list-inside ml-4 text-xs mt-1 space-y-1", subTextColor)}>
                        <li>Choose one Ship and one Leader.</li>
                        <li>Then, hire two Crew members.</li>
                        <li className="italic">Refer to the 'Special Setup' override for details on crew cost, warrants, and starting money.</li>
                    </ul>
                </li>
                <li>
                    <strong className={strongColor}>Player 1 (The Twin): Steal the Ship</strong>
                    <p className={cls("text-xs mt-1 pl-4", subTextColor)}>
                        Player 1 takes the completed setup (Ship, Leader, and Crew) prepared by Player 2.
                    </p>
                </li>
                <li>
                    <strong className={strongColor}>Player 2 (You): Get a "Backup" Ship</strong>
                    <p className={cls("text-xs mt-1 pl-4", subTextColor)}>
                        Choose a new Ship and a Leader for yourself. You will start with no crew or money.
                    </p>
                </li>
            </ol>
        </div>
    );
};

// This component was moved from DraftStep.tsx
const PlacementOrderPanel = ({
    specialStartSector,
    stepBadgeClass,
}: {
    specialStartSector: string | null;
    stepBadgeClass: string;
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    
    const specialPlacementBg = isDark ? 'bg-amber-950/40 border-amber-800' : 'bg-amber-50 border-amber-200';
    const specialPlacementTitle = isDark ? 'text-amber-100' : 'text-amber-900';
    const specialPlacementText = isDark ? 'text-amber-300' : 'text-amber-800';
    const specialPlacementSub = isDark ? 'text-amber-400' : 'text-amber-700';

    const placementTitle = 'Special Placement';
    const content = (
        <div className={cls("p-4 rounded text-center border", specialPlacementBg)}>
            <p className={cls("font-bold mb-1", specialPlacementTitle)}>Starting Location</p>
            <p className={cls("text-sm", specialPlacementText)}>Both ships start at <strong>{specialStartSector}</strong>.</p>
            <p className={cls("text-xs italic mt-2", specialPlacementSub)}>
                Player 2 (You) places their new ship first, followed by Player 1 (The Twin) with the stolen ship.
            </p>
        </div>
    );

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 2</div>
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                {placementTitle}
            </h4>
            {content}
        </div>
    );
};

export const RuiningItDraftStep = ({ step }: StepComponentProps): React.ReactElement => {
    const { theme } = useTheme();
    const { state: gameState } = useGameState();
    const {
        specialStartSector,
        specialRules,
    } = useDraftDetails(step);
    
    const allInfoBlocks = useMemo(() => {
        const allRules: SpecialRule[] = [...specialRules];
        
        const sortedRules = allRules.sort((a, b) => {
            const order: Record<SpecialRule['source'], number> = {
                expansion: 1,
                setupCard: 2,
                story: 3,
                warning: 3,
                info: 4,
            };
            return (order[a.source] || 99) - (order[b.source] || 99);
        });

        return sortedRules
            .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
            .map((rule, i) => <OverrideNotificationBlock key={`rule-${i}`} {...rule} />);
    }, [specialRules, gameState.setupMode]);

    const isDark = theme === 'dark';
    
    const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
    const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';
    
    return (
        <div className="space-y-6">
            {allInfoBlocks.length > 0 && (
                <div className="space-y-4">
                    {allInfoBlocks}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RuiningItSetupPanel stepBadgeClass={stepBadgeBlueBg} />
                <PlacementOrderPanel 
                    specialStartSector={specialStartSector}
                    stepBadgeClass={stepBadgeAmberBg}
                />
            </div>
        </div>
    );
};
