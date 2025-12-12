
import React from 'react';
import { Expansions, ThemeColor } from '../types';
import { getExpansionIcon } from './iconHelpers';
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
    if (isDark) {
      // Dark Mode Definitions
      switch (color) {
        case 'blue': return { border: 'border-blue-900', bg: 'bg-blue-950/40', badge: 'bg-blue-900/60 text-blue-100', toggle: 'bg-blue-700', icon: 'bg-blue-900 text-blue-100' };
        case 'amber': return { border: 'border-amber-900', bg: 'bg-amber-950/40', badge: 'bg-amber-900/60 text-amber-100', toggle: 'bg-amber-700', icon: 'bg-amber-900 text-amber-100' };
        case 'red': return { border: 'border-red-900', bg: 'bg-red-950/40', badge: 'bg-red-900/60 text-red-100', toggle: 'bg-red-700', icon: 'bg-red-900 text-red-100' };
        case 'purple': return { border: 'border-purple-900', bg: 'bg-purple-950/40', badge: 'bg-purple-900/60 text-purple-100', toggle: 'bg-purple-700', icon: 'bg-purple-900 text-purple-100' };
        case 'yellow': return { border: 'border-yellow-900', bg: 'bg-yellow-950/40', badge: 'bg-yellow-900/60 text-yellow-100', toggle: 'bg-yellow-700', icon: 'bg-yellow-900 text-yellow-100' };
        case 'dark': return { border: 'border-zinc-700', bg: 'bg-black/40', badge: 'bg-zinc-800 text-gray-300', toggle: 'bg-zinc-700', icon: 'bg-zinc-900 text-gray-400' };
        case 'cyan': return { border: 'border-cyan-900', bg: 'bg-cyan-950/40', badge: 'bg-cyan-900/60 text-cyan-100', toggle: 'bg-cyan-700', icon: 'bg-cyan-900 text-cyan-100' };
        case 'paleGreen': return { border: 'border-emerald-900', bg: 'bg-emerald-950/40', badge: 'bg-emerald-900/60 text-emerald-100', toggle: 'bg-emerald-700', icon: 'bg-emerald-900 text-emerald-100' };
        case 'firebrick': return { border: 'border-red-950', bg: 'bg-red-950/30', badge: 'bg-red-950/60 text-red-100', toggle: 'bg-red-900', icon: 'bg-red-950 text-red-200' };
        case 'khaki': return { border: 'border-amber-900', bg: 'bg-amber-950/30', badge: 'bg-amber-900/60 text-amber-100', toggle: 'bg-amber-700', icon: 'bg-amber-900 text-amber-100' };
        case 'cornflower': return { border: 'border-indigo-900', bg: 'bg-indigo-950/40', badge: 'bg-indigo-900/60 text-indigo-100', toggle: 'bg-indigo-700', icon: 'bg-indigo-900 text-indigo-100' };
        case 'brown': return { border: 'border-orange-950', bg: 'bg-orange-950/30', badge: 'bg-orange-900/60 text-orange-100', toggle: 'bg-orange-900', icon: 'bg-orange-950 text-orange-200' };
        case 'teal': return { border: 'border-teal-900', bg: 'bg-teal-950/40', badge: 'bg-teal-900/60 text-teal-100', toggle: 'bg-teal-700', icon: 'bg-teal-900 text-teal-100' };
        default: return { border: 'border-zinc-700', bg: 'bg-zinc-900/60', badge: 'bg-zinc-800 text-gray-200', toggle: 'bg-zinc-600', icon: 'bg-zinc-800 text-gray-300' };
      }
    } else {
      // Light Mode Definitions
      switch (color) {
        case 'blue': return { border: 'border-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', toggle: 'bg-blue-600', icon: 'bg-blue-600 text-white' };
        case 'amber': return { border: 'border-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', toggle: 'bg-amber-600', icon: 'bg-amber-600 text-white' };
        case 'red': return { border: 'border-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', toggle: 'bg-red-600', icon: 'bg-red-600 text-white' };
        case 'purple': return { border: 'border-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', toggle: 'bg-purple-600', icon: 'bg-purple-600 text-white' };
        case 'yellow': return { border: 'border-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', toggle: 'bg-yellow-600', icon: 'bg-yellow-600 text-white' };
        case 'dark': return { border: 'border-gray-800', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-900', toggle: 'bg-gray-900', icon: 'bg-gray-900 text-white' };
        case 'cyan': return { border: 'border-cyan-500', bg: 'bg-cyan-50', badge: 'bg-cyan-100 text-cyan-800', toggle: 'bg-cyan-600', icon: 'bg-cyan-600 text-white' };
        case 'paleGreen': return { border: 'border-green-400', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', toggle: 'bg-green-400', icon: 'bg-green-400 text-white' };
        case 'firebrick': return { border: 'border-red-800', bg: 'bg-red-50', badge: 'bg-red-100 text-red-900', toggle: 'bg-red-800', icon: 'bg-red-800 text-white' };
        case 'khaki': return { border: 'border-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-900', toggle: 'bg-amber-400', icon: 'bg-amber-400 text-white' };
        case 'cornflower': return { border: 'border-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-800', toggle: 'bg-indigo-400', icon: 'bg-indigo-400 text-white' };
        case 'brown': return { border: 'border-orange-800', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-900', toggle: 'bg-orange-800', icon: 'bg-orange-800 text-white' };
        case 'teal': return { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-teal-600', icon: 'bg-teal-600 text-white' };
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
  const inactiveIcon = isDark ? 'bg-zinc-800 text-gray-500' : 'bg-gray-100 text-gray-500';
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
          ${active ? currentTheme.icon : inactiveIcon}
        `}>
          {getExpansionIcon(id) || label.charAt(0)}
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
