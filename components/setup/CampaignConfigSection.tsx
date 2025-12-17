import React from 'react';
import { useTheme } from '../ThemeContext';

interface CampaignConfigSectionProps {
    isCampaign: boolean;
    storiesCompleted: number;
    onToggle: () => void;
    onStoriesChange: (count: number) => void;
}

export const CampaignConfigSection: React.FC<CampaignConfigSectionProps> = ({
    isCampaign,
    storiesCompleted,
    onToggle,
    onStoriesChange
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
    const inputBg = isDark ? 'bg-black' : 'bg-[#faf8ef]';
    const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
    const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
    const textColor = isDark ? 'text-amber-500' : 'text-[#292524]';

    return (
        <div className="mb-8 relative z-10">
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Campaign Mode</label>
            <div className={`${isDark ? 'bg-black/30' : 'bg-white/50'} p-4 rounded-lg border ${containerBorder} shadow-inner`}>
                <div 
                    onClick={onToggle}
                    className="flex justify-between items-center cursor-pointer"
                >
                    <label htmlFor="campaign-toggle" className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Continuing a Solo Campaign?
                    </label>
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${isCampaign ? 'bg-green-600' : (isDark ? 'bg-zinc-600' : 'bg-gray-300')}`}>
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isCampaign ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                {isCampaign && (
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-zinc-700 animate-fade-in">
                        <label className={`block text-sm font-medium mb-2 text-center ${labelColor}`}>
                            Stories Completed in Campaign
                        </label>
                        <div className="flex items-center justify-center space-x-4">
                            <button
                            type="button"
                            onClick={() => onStoriesChange(storiesCompleted - 1)}
                            disabled={storiesCompleted <= 0}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                            aria-label="Decrease stories completed"
                            >
                            -
                            </button>
                            <div className={`w-14 h-10 flex items-center justify-center text-3xl font-bold font-western drop-shadow-md ${textColor}`}>
                                {storiesCompleted}
                            </div>
                            <button
                                type="button"
                                onClick={() => onStoriesChange(storiesCompleted + 1)}
                                disabled={storiesCompleted >= 50}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                                aria-label="Increase stories completed"
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
