import React from 'react';
import { useTheme } from '../ThemeContext';
import { useGameState } from '../../hooks/useGameState';
import { ActionType, ExpansionBundle } from '../../state/actions';
import { Expansions } from '../../types';

interface ExpansionBundlesProps {
    expansions: Expansions;
}

const BUNDLES = [
    { id: 'core_only', label: 'Core Game Only', description: "The classic Firefly experience, no expansions." },
    { id: 'rim_worlds', label: 'The Rim Worlds', description: "Adds the Blue Sun & Kalidasa map expansions." },
    { id: 'all_official', label: 'The \'Verse in Full', description: "Activates all official gameplay expansions." },
];

export const ExpansionBundles: React.FC<ExpansionBundlesProps> = ({ expansions }) => {
    const { dispatch } = useGameState();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getActiveBundle = (): ExpansionBundle => {
        const officialExpansions = ['breakin_atmo', 'big_damn_heroes', 'pirates', 'blue', 'kalidasa', 'coachworks', 'crime', 'still_flying', 'tenth'];
        
        const activeOfficialCount = officialExpansions.filter(id => expansions[id as keyof Expansions]).length;

        if (activeOfficialCount === officialExpansions.length) return 'all_official';
        if (activeOfficialCount === 2 && expansions.blue && expansions.kalidasa) return 'rim_worlds';
        if (activeOfficialCount === 0) return 'core_only';

        // If it's a custom mix, default to core_only visually but it's not truly active
        return 'core_only';
    };

    const activeBundle = getActiveBundle();

    const handleSelectBundle = (bundleId: ExpansionBundle) => {
        dispatch({ type: ActionType.SET_EXPANSIONS_BUNDLE, payload: bundleId });
    };

    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';

    return (
        <div className="mb-8">
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Game Bundles</label>
            <div className="space-y-4">
                {BUNDLES.map(bundle => {
                    const isSelected = activeBundle === bundle.id;
                    const activeBorder = isDark ? 'border-green-500' : 'border-green-600';
                    const activeBg = isDark ? 'bg-green-900/20' : 'bg-green-50';
                    const inactiveBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
                    const inactiveBg = isDark ? 'bg-zinc-800/40 hover:bg-zinc-800/80' : 'bg-white hover:bg-gray-50';
                    
                    return (
                        <div
                            key={bundle.id}
                            onClick={() => handleSelectBundle(bundle.id as ExpansionBundle)}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 shadow-sm ${isSelected ? `${activeBorder} ${activeBg}` : `${inactiveBorder} ${inactiveBg}`}`}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectBundle(bundle.id as ExpansionBundle)}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-green-500' : (isDark ? 'border-gray-500' : 'border-gray-400')}`}>
                                {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />}
                            </div>
                            <div>
                                <div className={`font-bold text-sm mb-1 ${isSelected ? (isDark ? 'text-green-300' : 'text-green-900') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{bundle.label}</div>
                                <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{bundle.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};