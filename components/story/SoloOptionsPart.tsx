import React from 'react';
import { useTheme } from '../ThemeContext';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionIcon } from '../ExpansionIcon';
import { useMissionSelection } from '../../hooks/useMissionSelection';

export const SoloOptionsPart: React.FC = () => {
  const { activeStoryCard } = useMissionSelection();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!activeStoryCard) return null;

  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-paper-texture';
  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const bgIconBg = isDark ? 'bg-zinc-800' : 'bg-[#e5e5e5]';
  const bgIconBorder = isDark ? 'border-zinc-700' : 'border-[#d4d4d4]';

  return (
    <div className={`p-6 ${bodyBg} transition-colors`}>
      {/* Summary of Selected Story */}
      <div className={`mb-6 flex items-center p-3 rounded border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-amber-50 border-amber-200'}`}>
        {activeStoryCard.requiredExpansion ? (
          <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-8 h-8 mr-3" />
        ) : (
          <div className={`w-8 h-8 mr-3 rounded border overflow-hidden ${bgIconBg} ${bgIconBorder}`}>
            <ExpansionIcon id="base" />
          </div>
        )}
        <div>
          <div className={`text-xs uppercase font-bold tracking-wide opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Selected Story</div>
          <div className={`font-bold font-western ${mainTitleColor}`}>{activeStoryCard.title}</div>
        </div>
      </div>
      
      {/* NOTE: Advanced Rules have been moved to StoryDossier.tsx as they are not solo-exclusive */}
    </div>
  );
};