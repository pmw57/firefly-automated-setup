import React from 'react';
import { useTheme } from '../ThemeContext';
import { SetupMode } from '../../types';

interface PlayerConfigSectionProps {
  playerCount: number;
  playerNames: string[];
  isSolo: boolean;
  setupMode: SetupMode;
  onCountChange: (count: number) => void;
  onNameChange: (index: number, name: string) => void;
}

export const PlayerConfigSection: React.FC<PlayerConfigSectionProps> = ({ 
    playerCount, 
    playerNames, 
    isSolo, 
    setupMode,
    onCountChange, 
    onNameChange 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
    const inputBg = isDark ? 'bg-black' : 'bg-[#faf8ef]';
    const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
    const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
    const textColor = isDark ? 'text-amber-500' : 'text-[#292524]';

    return (
        <div className="mb-8 relative z-10">
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Number of Captains</label>
            <div className="flex items-center space-x-4 mb-4 select-none">
                <button 
                    type="button"
                    onClick={() => onCountChange(playerCount - 1)}
                    disabled={playerCount <= 1}
                    aria-label="Decrease player count"
                    className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                >
                    -
                </button>
                <div className={`w-16 h-12 flex items-center justify-center text-4xl font-bold font-western drop-shadow-md ${textColor}`}>
                    {playerCount}
                </div>
                <button 
                    type="button"
                    onClick={() => onCountChange(playerCount + 1)}
                    disabled={playerCount >= 9}
                    aria-label="Increase player count"
                    className={`w-12 h-12 flex items-center justify-center rounded-lg ${inputBg} border-2 ${inputBorder} font-bold text-2xl ${inputText} disabled:opacity-50 transition-all shadow-sm active:translate-y-0.5 hover:bg-opacity-80`}
                >
                    +
                </button>
                <span className={`italic ml-2 font-serif ${isDark ? 'text-zinc-500' : 'text-[#a8a29e]'}`}>
                    {isSolo ? '(Solo Mode)' : 'Crew Manifests'}
                </span>
            </div>
            
            {setupMode === 'detailed' && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${isDark ? 'bg-black/30' : 'bg-[#e7e5e4]/30'} p-4 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-[#d6cbb0]'} shadow-inner`}>
                  {playerNames.slice(0, playerCount).map((name, index) => (
                      <div key={index} className="flex items-center">
                          <label htmlFor={`player-${index}`} className={`text-xs font-bold w-6 mr-1 font-mono ${isDark ? 'text-zinc-500' : 'text-[#a8a29e]'}`}>{index + 1}.</label>
                          <div className="relative flex-1">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <svg className={`h-5 w-5 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                              </div>
                              <input
                                  id={`player-${index}`}
                                  type="text"
                                  value={name}
                                  onChange={(e) => onNameChange(index, e.target.value)}
                                  placeholder={`Captain ${index + 1}`}
                                  className={`w-full p-2 pl-10 border ${inputBorder} rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none ${inputBg} shadow-sm font-medium ${inputText} ${isDark ? 'placeholder-zinc-600' : 'placeholder-[#a8a29e]'} transition-colors`}
                              />
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
    );
};