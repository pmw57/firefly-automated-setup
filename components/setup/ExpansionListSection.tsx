import React from 'react';
import { Expansions } from '../../types';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { ExpansionToggle } from '../ExpansionToggle';
import { useTheme } from '../ThemeContext';

interface ExpansionListSectionProps {
    expansions: Expansions;
    onToggle: (key: keyof Expansions) => void;
    has10th: boolean;
}

export const ExpansionListSection: React.FC<ExpansionListSectionProps> = ({ expansions, onToggle, has10th }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';

    return (
        <div className="mb-8 relative z-10">
            <label className={`block font-bold mb-3 uppercase tracking-wide text-xs ${labelColor}`}>Active Expansions</label>
            <div className="grid grid-cols-1 gap-4">
                {EXPANSIONS_METADATA.filter(e => e.id !== 'base').map((expansion) => (
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
};