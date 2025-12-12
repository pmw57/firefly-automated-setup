
import React from 'react';
import { ExpansionId } from '../types';
import { EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../constants';
import { useTheme } from './ThemeContext';

interface InlineExpansionIconProps {
  type: ExpansionId;
  className?: string;
}

export const InlineExpansionIcon: React.FC<InlineExpansionIconProps> = ({ type, className = "mx-1 align-bottom" }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const meta = EXPANSIONS_METADATA.find(e => e.id === type);
  if (!meta) return null;

  const borderClass = isDark ? 'border-zinc-700' : 'border-gray-300';
  const bgClass = isDark ? 'bg-zinc-800' : 'bg-white';

  if (meta.icon.type === 'sprite') {
    return (
      <span 
        className={`inline-block w-8 h-8 rounded shadow-sm border ${borderClass} ${bgClass} shrink-0 ${className}`}
        style={{ 
          backgroundImage: `url("${SPRITE_SHEET_URL}")`,
          backgroundSize: '600% auto',
          backgroundPosition: meta.icon.value,
          backgroundRepeat: 'no-repeat'
        }}
        title={meta.label}
      />
    );
  } else {
    // Text Icon Fallback
    let bgColor = 'bg-gray-700';
    if (meta.themeColor === 'paleGreen') bgColor = 'bg-green-500';
    if (meta.themeColor === 'purple') bgColor = 'bg-purple-700';
    if (meta.themeColor === 'yellow') bgColor = 'bg-yellow-600';
    if (meta.themeColor === 'khaki') bgColor = 'bg-amber-400 text-amber-900';
    if (meta.themeColor === 'cornflower') bgColor = 'bg-indigo-400 text-indigo-900';
    if (meta.themeColor === 'brown') bgColor = 'bg-orange-800';
    if (meta.themeColor === 'firebrick') bgColor = 'bg-red-800';
    if (meta.themeColor === 'cyan') bgColor = 'bg-cyan-500 text-white';
    if (meta.themeColor === 'teal') bgColor = 'bg-teal-600 text-white';
    
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded shadow-sm border ${borderClass} text-white font-bold text-xs shrink-0 ${bgColor} ${className}`} title={meta.label}>
        {meta.icon.value}
      </span>
    );
  }
};
