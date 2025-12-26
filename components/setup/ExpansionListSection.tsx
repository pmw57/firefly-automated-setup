
import React, { useMemo } from 'react';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { Expansions } from '../../types/index';
import { ExpansionToggle } from '../ExpansionToggle';
import { useTheme } from '../ThemeContext';
import { cls } from '../../utils/style';
import { getCategorizedExpansions } from '../../utils/selectors/story';

interface ExpansionListSectionProps {
    expansions: Expansions;
    onToggle: (key: keyof Expansions) => void;
    has10th: boolean;
}

export const ExpansionListSection: React.FC<ExpansionListSectionProps> = ({ expansions, onToggle, has10th }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';

    const {
        core_mechanics,
        map,
        variants,
        promo
    } = useMemo(() => getCategorizedExpansions(), []);

    const handleToggleGroup = (group: typeof core_mechanics, enable: boolean) => {
        group.forEach(exp => {
            const id = exp.id as keyof Expansions;
            // Only toggle if the state is different from the target state
            // FIX: Ensure 'id' is a valid key before accessing expansions[id]
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
                {renderGroup('Core Mechanics', core_mechanics)}
                {renderGroup('Map Expansions', map)}
                {renderGroup('Game Variants', variants)}
                {renderGroup('Independent Content', promo)}
            </div>
        </div>
    );
};