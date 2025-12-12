
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
    if (meta.themeColor === 'orangeRed') bgColor = 'bg-[#FF4500]';
    if (meta.themeColor === 'steelBlue') bgColor = 'bg-[#4682B4]';
    if (meta.themeColor === 'black') bgColor = 'bg-black';
    if (meta.themeColor === 'darkSlateBlue') bgColor = 'bg-[#483D8B]';
    if (meta.themeColor === 'deepBrown') bgColor = 'bg-[#231709]';
    if (meta.themeColor === 'rebeccaPurple') bgColor = 'bg-[#663399]';
    if (meta.themeColor === 'cordovan') bgColor = 'bg-[#893f45]';
    if (meta.themeColor === 'darkOliveGreen') bgColor = 'bg-[#556b2f]';
    if (meta.themeColor === 'saddleBrown') bgColor = 'bg-[#8b4513]';
    if (meta.themeColor === 'teal') bgColor = 'bg-teal-600 text-white';
    if (meta.themeColor === 'dark') bgColor = 'bg-gray-800 text-white';
    
    return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded shadow-sm border ${borderClass} text-white font-bold text-xs shrink-0 ${bgColor} ${className}`} title={meta.label}>
        {meta.icon.value}
      </span>
    );
  }
};
