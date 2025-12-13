
import React from 'react';
import { Expansions, ThemeColor } from '../types';
import { ExpansionIcon } from './ExpansionIcon';
import { useTheme } from './ThemeContext';

interface ThemeStyles {
  border: string;
  bg: string;
  badge: string;
  toggle: string;
  icon: string;
}

interface ExpansionToggleProps {
  id: keyof Expansions;
  label: string;
  active: boolean;
  themeColor: ThemeColor;
  description: string;
  onToggle: (id: keyof Expansions) => void;
}

export const ExpansionToggle: React.FC<ExpansionToggleProps> = ({ 
  id, label, active, themeColor, description, onToggle
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getThemeStyles = (color: ThemeColor): ThemeStyles => {
    // Note: Using arbitrary values for specific requested colors
    if (isDark) {
      switch (color) {
        case 'orangeRed': return { border: 'border-orange-600', bg: 'bg-[#FF4500]/20', badge: 'bg-[#FF4500]/40 text-white', toggle: 'bg-[#FF4500]', icon: 'bg-[#FF4500] text-white' };
        case 'steelBlue': return { border: 'border-sky-600', bg: 'bg-[#4682B4]/20', badge: 'bg-[#4682B4]/40 text-sky-100', toggle: 'bg-[#4682B4]', icon: 'bg-[#4682B4] text-white' };
        case 'black': return { border: 'border-zinc-700', bg: 'bg-black/60', badge: 'bg-zinc-800 text-white', toggle: 'bg-black', icon: 'bg-black text-white border border-zinc-700' };
        case 'darkSlateBlue': return { border: 'border-indigo-800', bg: 'bg-[#483D8B]/30', badge: 'bg-[#483D8B]/50 text-indigo-100', toggle: 'bg-[#483D8B]', icon: 'bg-[#483D8B] text-white' };
        case 'deepBrown': return { border: 'border-[#3E2910]', bg: 'bg-[#231709]/60', badge: 'bg-[#231709] text-amber-100', toggle: 'bg-[#231709]', icon: 'bg-[#231709] text-white' };
        case 'rebeccaPurple': return { border: 'border-purple-800', bg: 'bg-[#663399]/30', badge: 'bg-[#663399]/50 text-purple-100', toggle: 'bg-[#663399]', icon: 'bg-[#663399] text-white' };
        case 'cordovan': return { border: 'border-red-900', bg: 'bg-[#893f45]/30', badge: 'bg-[#893f45]/50 text-rose-100', toggle: 'bg-[#893f45]', icon: 'bg-[#893f45] text-white' };
        case 'darkOliveGreen': return { border: 'border-lime-900', bg: 'bg-[#556b2f]/30', badge: 'bg-[#556b2f]/50 text-lime-100', toggle: 'bg-[#556b2f]', icon: 'bg-[#556b2f] text-white' };
        case 'saddleBrown': return { border: 'border-orange-900', bg: 'bg-[#8b4513]/30', badge: 'bg-[#8b4513]/50 text-orange-100', toggle: 'bg-[#8b4513]', icon: 'bg-[#8b4513] text-white' };
        case 'teal': return { border: 'border-teal-900', bg: 'bg-teal-950/40', badge: 'bg-teal-900/60 text-teal-100', toggle: 'bg-teal-700', icon: 'bg-teal-900 text-teal-100' };
        case 'dark': return { border: 'border-zinc-700', bg: 'bg-black/40', badge: 'bg-zinc-800 text-gray-300', toggle: 'bg-zinc-700', icon: 'bg-zinc-900 text-gray-400' };
        default: return { border: 'border-zinc-700', bg: 'bg-zinc-900/60', badge: 'bg-zinc-800 text-gray-200', toggle: 'bg-zinc-600', icon: 'bg-zinc-800 text-gray-300' };
      }
    } else {
      // Light Mode (Slightly brighter backgrounds)
      switch (color) {
        case 'orangeRed': return { border: 'border-orange-500', bg: 'bg-[#FF4500]/10', badge: 'bg-[#FF4500]/20 text-orange-900', toggle: 'bg-[#FF4500]', icon: 'bg-[#FF4500] text-white' };
        case 'steelBlue': return { border: 'border-sky-500', bg: 'bg-[#4682B4]/10', badge: 'bg-[#4682B4]/20 text-sky-900', toggle: 'bg-[#4682B4]', icon: 'bg-[#4682B4] text-white' };
        case 'black': return { border: 'border-gray-800', bg: 'bg-gray-100', badge: 'bg-black text-white', toggle: 'bg-black', icon: 'bg-black text-white' };
        case 'darkSlateBlue': return { border: 'border-indigo-600', bg: 'bg-[#483D8B]/10', badge: 'bg-[#483D8B]/20 text-indigo-900', toggle: 'bg-[#483D8B]', icon: 'bg-[#483D8B] text-white' };
        case 'deepBrown': return { border: 'border-[#5C4033]', bg: 'bg-[#231709]/10', badge: 'bg-[#231709]/20 text-black', toggle: 'bg-[#231709]', icon: 'bg-[#231709] text-white' };
        case 'rebeccaPurple': return { border: 'border-purple-600', bg: 'bg-[#663399]/10', badge: 'bg-[#663399]/20 text-purple-900', toggle: 'bg-[#663399]', icon: 'bg-[#663399] text-white' };
        case 'cordovan': return { border: 'border-red-800', bg: 'bg-[#893f45]/10', badge: 'bg-[#893f45]/20 text-red-900', toggle: 'bg-[#893f45]', icon: 'bg-[#893f45] text-white' };
        case 'darkOliveGreen': return { border: 'border-lime-700', bg: 'bg-[#556b2f]/10', badge: 'bg-[#556b2f]/20 text-lime-900', toggle: 'bg-[#556b2f]', icon: 'bg-[#556b2f] text-white' };
        case 'saddleBrown': return { border: 'border-orange-800', bg: 'bg-[#8b4513]/10', badge: 'bg-[#8b4513]/20 text-orange-900', toggle: 'bg-[#8b4513]', icon: 'bg-[#8b4513] text-white' };
        case 'teal': return { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-teal-600', icon: 'bg-teal-600 text-white' };
        case 'dark': return { border: 'border-gray-800', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-900', toggle: 'bg-gray-900', icon: 'bg-gray-900 text-white' };
        default: return { border: 'border-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-200 text-gray-800', toggle: 'bg-gray-600', icon: 'bg-gray-600 text-white' };
      }
    }
  };

  const currentTheme = getThemeStyles(themeColor);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  // Explicit text colors based on state
  const titleColor = active 
    ? (isDark ? 'text-white' : 'text-gray-900') 
    : (isDark ? 'text-gray-300' : 'text-gray-600');
    
  const descColor = active
    ? (isDark ? 'text-gray-300' : 'text-gray-700')
    : (isDark ? 'text-zinc-400' : 'text-gray-500');

  // Inactive states
  const inactiveBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const inactiveBg = isDark ? 'bg-black/60' : 'bg-white';
  const inactiveHover = isDark ? 'hover:border-zinc-600' : 'hover:border-gray-300';
  
  const inactiveBadge = isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600';
  const inactiveToggle = isDark ? 'bg-zinc-700' : 'bg-gray-300';
  const toggleKnob = isDark ? 'bg-zinc-200' : 'bg-white';

  return (
    <div 
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onClick={() => onToggle(id)}
      onKeyDown={handleKeyDown}
      className={`
        relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 backdrop-blur-sm
        ${active 
          ? `${currentTheme.border} ${currentTheme.bg} shadow-md` 
          : `${inactiveBorder} ${inactiveBg} ${inactiveHover}`
        }
      `}
    >
      <div className="flex items-center flex-1">
        <div className={`
          w-12 h-12 rounded-lg mr-4 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hidden shrink-0
          ${active ? '' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500'}
        `}>
          <ExpansionIcon id={id} />
        </div>
        
        <div className="flex-1 mr-4">
          <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${titleColor}`}>
            {label}
          </h3>
          <p className={`text-xs mt-1 leading-snug ${descColor}`}>
             {description}
          </p>
          <span className={`
            inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 transition-colors duration-300
            ${active ? currentTheme.badge : inactiveBadge}
          `}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className={`
        w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0 ml-2
        ${active ? currentTheme.toggle : inactiveToggle}
      `}>
        <div className={`
          ${toggleKnob} w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
          ${active ? 'translate-x-6' : 'translate-x-0'}
        `}></div>
      </div>
    </div>
  );
};
