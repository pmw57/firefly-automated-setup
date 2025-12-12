
import React from 'react';
import { useTheme } from './ThemeContext';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Ensure we don't divide by zero and clamp percentage
  const percentage = Math.min(100, Math.max(0, total > 0 ? Math.round(((current - 1) / (total - 1)) * 100) : 0));

  const labelColor = isDark ? 'text-gray-400' : 'text-gray-700';
  const percentColor = isDark ? 'text-green-400' : 'text-green-700';
  const trackBg = isDark ? 'bg-gray-700/50' : 'bg-gray-300';
  const trackBorder = isDark ? 'border-white/10' : 'border-gray-400';

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-bold uppercase tracking-wider text-[10px] ${labelColor}`}>Setup Progress</span>
        <span className={`text-sm font-semibold font-mono ${percentColor}`}>{percentage}% Complete</span>
      </div>
      <div className={`w-full rounded-full h-4 shadow-inner overflow-hidden border ${trackBg} ${trackBorder}`}>
        <div 
          className="bg-gradient-to-r from-green-700 to-green-500 h-full rounded-full transition-all duration-500 ease-out relative" 
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-white opacity-20 transform -skew-x-12 origin-left scale-x-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
