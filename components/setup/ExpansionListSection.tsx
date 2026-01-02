import React, { useMemo } from 'react';
import { Expansions } from '../../types';
import { ExpansionToggle } from '../ExpansionToggle';
import { useTheme } from '../ThemeContext';
import { cls } from '../../utils/style';
import { getCategorizedExpansions } from '../../utils/selectors/story';
import { useGameState } from '../../hooks/useGameState';
import { ActionType } from '../../state/actions';

interface ExpansionListSectionProps {
    expansions: Expansions;
    onToggle: (key: keyof Expansions) => void;
    has10th: boolean;
    isDevMode?: boolean;
}

export const ExpansionListSection: React.FC<ExpansionListSectionProps> = ({ expansions, onToggle, has10th, isDevMode }) => {
    const { state, dispatch } = useGameState();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';

    const {
        core_mechanics,
        map,
        variants,
        independent
    } = useMemo(() => getCategorizedExpansions(state.showHiddenContent), [state.showHiddenContent]);

    const handleToggleGroup = (group: typeof core_mechanics, enable: boolean) => {
        group.forEach(exp => {
            const id = exp.id as keyof Expansions;
            // Only toggle if the state is different from the target state.
            // This also ensures 'id' is a valid key before access.
            if (id in expansions && expansions[id] !== enable) {
                onToggle(id);
            }
        });
    };

    const GroupHeader: React.FC<{ title: string, expansions: typeof core_mechanics }> = ({ title, expansions: group }) => {
        const areAllSelected = group.every(exp => expansions[exp.id as keyof Expansions]);
        
        const buttonLabel = areAllSelected ? "Deselect All" : "Select All";
        const buttonAction = () => handleToggleGroup(group, !areAllSelected);
        const ariaLabel = areAllSelected ? `Deselect all ${title}` : `Select all ${title}`;

        const buttonStyle = isDark
            ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-black';

        return (
            <div className="flex justify-between items-center mb-3">
                <label className={`block font-bold uppercase tracking-wide text-xs ${labelColor}`}>{title}</label>
                <button
                    onClick={buttonAction}
                    className={cls('py-1 px-3 rounded-md border shadow-sm text-[10px] font-bold transition-colors', buttonStyle)}
                    aria-label={ariaLabel}
                >
                    {buttonLabel}
                </button>
            </div>
        );
    };

    const groupContainerClasses = isDark 
        ? 'bg-black/30 border-zinc-800' 
        : 'bg-black/5 border-gray-200';

    const renderGroup = (title: string, group: typeof core_mechanics) => (
        <div className={cls('p-4 rounded-lg border shadow-inner', groupContainerClasses)}>
            <GroupHeader title={title} expansions={group} />
            <div className="grid grid-cols-1 gap-4">
                {group.map((expansion) => (
                    <ExpansionToggle 
                        key={expansion.id}
                        id={expansion.id as keyof Expansions} 
                        label={expansion.label} 
                        active={expansions[expansion.id as keyof Expansions]} 
                        themeColor={expansion.themeColor}
                        description={expansion.description}
                        onToggle={onToggle}
                        has10th={has10th}
                        page_10th={expansion.page_10th}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="mb-8">
            <div className="space-y-8 relative z-10">
                {core_mechanics.length > 0 && renderGroup('Core Mechanics', core_mechanics)}
                {map.length > 0 && renderGroup('Map Expansions', map)}
                {variants.length > 0 && renderGroup('Game Variants', variants)}
                {independent.length > 0 && renderGroup('Independent Content', independent)}
            </div>
            {isDevMode && (
                <div className="mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
                    <div 
                        role="switch"
                        aria-checked={state.showHiddenContent}
                        tabIndex={0}
                        onClick={() => dispatch({ type: ActionType.TOGGLE_SHOW_HIDDEN_CONTENT })}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dispatch({ type: ActionType.TOGGLE_SHOW_HIDDEN_CONTENT }); } }}
                        className="flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                    >
                        <div>
                            <h3 className="font-bold text-base text-gray-900 dark:text-gray-200">Show Unreleased Content</h3>
                            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">Includes fan-made expansions and promotional content.</p>
                        </div>
                        <div className={cls(
                            "w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0",
                            state.showHiddenContent ? 'bg-green-600' : (isDark ? 'bg-zinc-600' : 'bg-gray-300')
                        )}>
                            <div className={cls(
                                "bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
                                { 'translate-x-6': state.showHiddenContent, 'translate-x-0': !state.showHiddenContent }
                            )}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};