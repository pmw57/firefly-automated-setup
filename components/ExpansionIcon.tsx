
import React, { useState } from 'react';
import { EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../constants';

interface ExpansionIconProps {
  id: string;
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
  community: 'CC'
};

export const ExpansionIcon: React.FC<ExpansionIconProps> = ({ id, className = "w-full h-full" }) => {
  const [imgError, setImgError] = useState(false);

  const meta = EXPANSIONS_METADATA.find(e => e.id === id);
  
  // Render a placeholder if ID is invalid
  if (!meta) {
      return (
        <div className={`rounded-md flex items-center justify-center border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 font-bold text-xs ${className}`}>
            —
        </div>
      );
  }

  // Helper to get background color class based on theme
  const getBgColorClass = () => {
      if (meta.themeColor === 'orangeRed') return 'bg-[#FF4500] border-orange-600';
      if (meta.themeColor === 'steelBlue') return 'bg-[#4682B4] border-sky-600';
      if (meta.themeColor === 'black') return 'bg-black border-zinc-700';
      if (meta.themeColor === 'darkSlateBlue') return 'bg-[#483D8B] border-indigo-700';
      if (meta.themeColor === 'deepBrown') return 'bg-[#231709] border-[#3E2910]';
      if (meta.themeColor === 'rebeccaPurple') return 'bg-[#663399] border-purple-700';
      if (meta.themeColor === 'cordovan') return 'bg-[#893f45] border-red-800';
      if (meta.themeColor === 'darkOliveGreen') return 'bg-[#556b2f] border-lime-800';
      if (meta.themeColor === 'saddleBrown') return 'bg-[#8b4513] border-orange-800';
      if (meta.themeColor === 'teal') return 'bg-teal-600 border-teal-700';
      if (meta.themeColor === 'dark') return 'bg-gray-800 border-gray-600';
      return 'bg-gray-700 border-gray-500';
  };

  const themeClasses = getBgColorClass();

  // 1. Sprite Mode (with fallback capability)
  if (meta.icon.type === 'sprite' && !imgError) {
      return (
        <div className={`relative rounded-md overflow-hidden border ${themeClasses} ${className}`} title={meta.label}>
            {/* The visible sprite div */}
            <div 
              style={{ 
                backgroundImage: `url("${SPRITE_SHEET_URL}")`,
                backgroundSize: '500% 500%', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: meta.icon.value,
                width: '100%',
                height: '100%',
                transform: 'scale(1.5)',
              }} 
            />
            {/* Hidden image to detect load errors */}
            <img 
                src={SPRITE_SHEET_URL} 
                alt="" 
                style={{ display: 'none' }} 
                onError={() => setImgError(true)} 
            />
        </div>
      );
  }

  // 2. Text/Fallback Mode
  const textValue = meta.icon.type === 'text' ? meta.icon.value : (ABBREVIATIONS[id] || id.substring(0, 2).toUpperCase());
  
  return (
    <div className={`rounded-md flex items-center justify-center border ${themeClasses} ${className}`} title={meta.label}>
        <span className="text-white font-bold text-xs">{textValue}</span>
    </div>
  );
};
