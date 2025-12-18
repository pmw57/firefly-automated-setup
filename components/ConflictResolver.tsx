import React from 'react';
import { useTheme } from './ThemeContext';

interface ConflictOptionDetails {
  value: number | string;
  label: string;
}

export interface Conflict {
  story: ConflictOptionDetails;
  setupCard: ConflictOptionDetails;
}

interface ConflictResolverProps {
  title: string;
  conflict: Conflict;
  selection: 'story' | 'setupCard';
  onSelect: (selection: 'story' | 'setupCard') => void;
}

export const ConflictResolver: React.FC<ConflictResolverProps> = ({ title, conflict, selection, onSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const containerBg = isDark ? 'bg-amber-950/40' : 'bg-amber-50';
  const containerBorder = isDark ? 'border-amber-800' : 'border-amber-200';
  const headerText = isDark ? 'text-amber-300' : 'text-amber-800';

  const buttonBase = 'flex-1 p-3 rounded-lg border-2 text-left transition-all shadow-sm';
  const selectedClass = isDark ? 'bg-green-900/30 border-green-600' : 'bg-green-50 border-green-500';
  const unselectedClass = isDark ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700' : 'bg-white/50 border-gray-300 hover:bg-gray-50';
  
  const sourceLabelClass = `text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const valueClass = `font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`;
  const checkClass = isDark ? 'text-green-400' : 'text-green-600';

  return (
    <div className={`p-4 rounded-lg border-l-4 ${containerBg} ${containerBorder} mb-6 animate-fade-in`}>
      <h4 className={`font-bold text-base mb-3 ${headerText}`}>{title}</h4>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Story Card Option */}
        <button onClick={() => onSelect('story')} className={`${buttonBase} ${selection === 'story' ? selectedClass : unselectedClass}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={sourceLabelClass}>Story Card Rule</div>
              <div className={valueClass}>{conflict.story.value}</div>
            </div>
            {selection === 'story' && <div className={`text-2xl font-bold ${checkClass}`}>✓</div>}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{conflict.story.label}</div>
        </button>

        {/* Setup Card Option */}
        <button onClick={() => onSelect('setupCard')} className={`${buttonBase} ${selection === 'setupCard' ? selectedClass : unselectedClass}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className={sourceLabelClass}>Setup Card Rule</div>
              <div className={valueClass}>{conflict.setupCard.value}</div>
            </div>
            {selection === 'setupCard' && <div className={`text-2xl font-bold ${checkClass}`}>✓</div>}
          </div>
          <div className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{conflict.setupCard.label}</div>
        </button>
      </div>
    </div>
  );
};