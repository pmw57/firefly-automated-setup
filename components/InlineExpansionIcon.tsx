
import React, { useState } from 'react';
import { ExpansionId } from '../types/index';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { useTheme } from './ThemeContext';
import { SPRITE_SHEET_URL } from '../data/constants';

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
  aces_eights: 'AE',
  white_lightning: 'WL',
  cantankerous: 'CN',
  huntingdons_bolt: 'HB',
  black_market: 'BM',
  community: 'CC',
  base: 'BG'
};

export const InlineExpansionIcon = ({ type, className = "mx-1 align-bottom" }: InlineExpansionIconProps): React.ReactElement | null => {
  const [imgError, setImgError] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const meta = EXPANSIONS_METADATA.find(e => e.id === type);
  if (!meta) return null;

  const borderClass = isDark ? 'border-zinc-700' : 'border-gray-300';

  const getBgColor = () => {
    switch (meta.themeColor) {
      case 'cyan': return 'bg-expansion-cyan';
      case 'tan': return 'bg-expansion-tan';
      case 'mediumPurple': return 'bg-expansion-mediumPurple';
      case 'gamblingGreen': return 'bg-expansion-gamblingGreen';
      case 'steelBlue': return 'bg-expansion-steelBlue';
      case 'black': return 'bg-black';
      case 'darkSlateBlue': return 'bg-expansion-darkSlateBlue';
      case 'deepBrown': return 'bg-expansion-deepBrown';
      case 'rebeccaPurple': return 'bg-expansion-rebeccaPurple';
      case 'cordovan': return 'bg-expansion-cordovan';
      case 'darkOliveGreen': return 'bg-expansion-darkOliveGreen';
      case 'saddleBrown': return 'bg-firefly-saddleBrown';
      case 'teal': return 'bg-expansion-teal';
      case 'dark': return 'bg-gray-800';
      default: return 'bg-gray-700';
    }
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