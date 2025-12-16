

import React, { useState } from 'react';
import { ExpansionId } from '../types';
import { EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../data/expansions';
import { useTheme } from './ThemeContext';

interface InlineExpansionIconProps {
  type: ExpansionId | 'base';
  className?: string;
}

const ABBREVIATIONS: Record<string, string> = {
  breakin_atmo: 'BA',
  big_damn_heroes: 'BD',
  pirates: 'PB',
  blue: 'BS',
  kalidasa: 'KA',
  coachworks: 'CW',
  crime: 'CP',
  still_flying: 'SF',
  tenth: '10',
  black_market: 'BM',
  community: 'CC',
  base: 'BG'
};

export const InlineExpansionIcon: React.FC<InlineExpansionIconProps> = ({ type, className = "mx-1 align-bottom" }) => {
  const [imgError, setImgError] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const meta = EXPANSIONS_METADATA.find(e => e.id === type);
  if (!meta) return null;

  const borderClass = isDark ? 'border-zinc-700' : 'border-gray-300';

  // Helper for text colors
  const getBgColor = () => {
    if (meta.themeColor === 'orangeRed') return 'bg-[#FF4500]';
    if (meta.themeColor === 'steelBlue') return 'bg-[#4682B4]';
    if (meta.themeColor === 'black') return 'bg-black';
    if (meta.themeColor === 'darkSlateBlue') return 'bg-[#483D8B]';
    if (meta.themeColor === 'deepBrown') return 'bg-[#231709]';
    if (meta.themeColor === 'rebeccaPurple') return 'bg-[#663399]';
    if (meta.themeColor === 'cordovan') return 'bg-[#893f45]';
    if (meta.themeColor === 'darkOliveGreen') return 'bg-[#556b2f]';
    if (meta.themeColor === 'saddleBrown') return 'bg-[#8b4513]';
    if (meta.themeColor === 'teal') return 'bg-teal-600';
    if (meta.themeColor === 'dark') return 'bg-gray-800';
    return 'bg-gray-700';
  };

  if (type === 'base') {
      return (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded shadow-sm border ${borderClass} shrink-0 ${getBgColor()} ${className}`} title={meta.label}>
             <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none">
                 <path d="M12 3L3 8l9 5 9-5-9-5z" fill="currentColor" fillOpacity="0.5"/>
                 <path d="M3 8v8l9 5V13L3 8z" fill="currentColor" fillOpacity="0.8"/>
                 <path d="M12 13v8l9-5V8l-9 5z" fill="currentColor" fillOpacity="1.0"/>
             </svg>
        </span>
      );
  }

  if (meta.icon.type === 'sprite' && !imgError) {
    return (
      <span 
        className={`inline-block w-8 h-8 rounded shadow-sm border ${borderClass} ${getBgColor()} shrink-0 ${className} relative overflow-hidden`}
        title={meta.label}
      >
        <span 
            className="absolute inset-0"
            style={{ 
                backgroundImage: `url("${SPRITE_SHEET_URL}")`,
                backgroundSize: '500% 500%',
                backgroundPosition: meta.icon.value,
                backgroundRepeat: 'no-repeat',
                transform: 'scale(1.5)',
            }}
        />
        <img 
            src={SPRITE_SHEET_URL} 
            alt="" 
            style={{ display: 'none' }} 
            onError={() => setImgError(true)} 
        />
      </span>
    );
  } 
  
  if (meta.icon.type === 'svg') {
     return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded shadow-sm border ${borderClass} shrink-0 ${getBgColor()} ${className}`} title={meta.label}>
         <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
             <path d={meta.icon.value} />
         </svg>
      </span>
     );
  }

  // Text Icon Fallback (Used for 'text' type OR if sprite fails)
  const textValue = meta.icon.type === 'text' ? meta.icon.value : (ABBREVIATIONS[type] || type.substring(0, 2).toUpperCase());
    
  return (
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded shadow-sm border ${borderClass} text-white font-bold text-xs shrink-0 ${getBgColor()} ${className}`} title={meta.label}>
        {textValue}
      </span>
  );
};