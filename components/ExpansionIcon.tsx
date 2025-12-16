
import React, { useState } from 'react';
import { ExpansionDef, ThemeColor } from '../types';
import { EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../data/expansions';

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
  community: 'CC',
  base: 'BG'
};

const THEME_COLOR_CLASSES: Record<ThemeColor, string> = {
    orangeRed: 'bg-[#FF4500] border-orange-600',
    steelBlue: 'bg-[#4682B4] border-sky-600',
    black: 'bg-black border-zinc-700',
    darkSlateBlue: 'bg-[#483D8B] border-indigo-700',
    deepBrown: 'bg-[#231709] border-[#3E2910]',
    rebeccaPurple: 'bg-[#663399] border-purple-700',
    cordovan: 'bg-[#893f45] border-red-800',
    darkOliveGreen: 'bg-[#556b2f] border-lime-800',
    saddleBrown: 'bg-[#8b4513] border-orange-800',
    teal: 'bg-teal-600 border-teal-700',
    dark: 'bg-gray-800 border-gray-600',
};

const getMeta = (id: string): ExpansionDef | undefined => EXPANSIONS_METADATA.find(e => e.id === id);

export const ExpansionIcon = ({ id, className = "w-full h-full" }: ExpansionIconProps): React.ReactElement => {
  const [imgError, setImgError] = useState(false);
  const meta = getMeta(id);

  if (!meta) {
      return (
        <div className={`rounded-md flex items-center justify-center border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 font-bold text-xs ${className}`}>
            —
        </div>
      );
  }

  const themeClasses = THEME_COLOR_CLASSES[meta.themeColor] || 'bg-gray-700 border-gray-500';

  if (id === 'base') {
    return (
      <div className={`rounded-md flex items-center justify-center border ${themeClasses} ${className}`} title={meta.label}>
          <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="none">
             <path d="M12 3L3 8l9 5 9-5-9-5z" fill="currentColor" fillOpacity="0.5"/>
             <path d="M3 8v8l9 5V13L3 8z" fill="currentColor" fillOpacity="0.8"/>
             <path d="M12 13v8l9-5V8l-9 5z" fill="currentColor" fillOpacity="1.0"/>
          </svg>
      </div>
    );
  }

  if (meta.icon.type === 'sprite' && !imgError) {
      return (
        <div className={`relative rounded-md overflow-hidden border ${themeClasses} ${className}`} title={meta.label}>
            <div 
              style={{ 
                backgroundImage: `url("${SPRITE_SHEET_URL}")`,
                backgroundSize: '500% 500%', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: meta.icon.value,
                width: '100%', height: '100%',
                transform: 'scale(1.5)',
              }} 
            />
            <img src={SPRITE_SHEET_URL} alt="" style={{ display: 'none' }} onError={() => setImgError(true)} />
        </div>
      );
  }

  if (meta.icon.type === 'svg') {
       return (
        <div className={`rounded-md flex items-center justify-center border ${themeClasses} ${className}`} title={meta.label}>
            <svg viewBox="0 0 24 24" className="w-4/5 h-4/5 text-white" fill="currentColor">
                <path d={meta.icon.value} />
            </svg>
        </div>
      );
  }

  const textValue = meta.icon.type === 'text' ? meta.icon.value : (ABBREVIATIONS[id] || id.substring(0, 2).toUpperCase());
  
  return (
    <div className={`rounded-md flex items-center justify-center border ${themeClasses} ${className}`} title={meta.label}>
        <span className="text-white font-bold text-xs">{textValue}</span>
    </div>
  );
};
