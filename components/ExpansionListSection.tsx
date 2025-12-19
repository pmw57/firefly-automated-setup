import React from 'react';
import { Expansions } from '../types';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { ExpansionToggle } from './ExpansionToggle';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';

interface ExpansionListSectionProps {
    expansions: Expansions;
    onToggle: (key: keyof Expansions) => void;
    has10th: boolean;
}

export const ExpansionListSection: React.FC<ExpansionListSectionProps> = ({ expansions, onToggle, has10th }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';

    const group1_core = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.category === 'core_mechanics');
    const group2_map = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.category === 'map');
    const group3_variants = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.category === 'variants');
    const group4_promo = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.category === 'promo');

    const handleToggleGroup = (group: typeof group1_core, enable: boolean) => {
        group.forEach(exp => {
            const id = exp.id as keyof Expansions;
            // Only toggle if the state is different from the target state
            if (expansions[id] !== enable) {
                onToggle(id);
            }
        });
    };

    const GroupHeader: React.FC<{ title: string, expansions: typeof group1_core }> = ({ title, expansions: group }) => {
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

    const renderGroup = (title: string, group: typeof group1_core) => (
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
        <div className="mb-8 relative z-10 space-y-6">
            {renderGroup("Core Content & Mechanics", group1_core)}
            {renderGroup("Map Expansions", group2_map)}
            {renderGroup("Game Variants & Anniversary", group3_variants)}
            {renderGroup("Promo & Community Content", group4_promo)}
        </div>
    );
};
