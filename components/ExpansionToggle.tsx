import React from 'react';
import { Expansions, ThemeColor } from '../types';
import { ExpansionIcon } from './ExpansionIcon';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';

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
  has10th: boolean;
  page_10th?: number;
}

const THEME_COLOR_STYLES: Record<ThemeColor, { light: ThemeStyles, dark: ThemeStyles }> = {
  orangeRed:       { light: { border: 'border-orange-500', bg: 'bg-[#FF4500]/10', badge: 'bg-[#FF4500]/20 text-orange-900', toggle: 'bg-[#FF4500]', icon: 'bg-[#FF4500] text-white' }, dark: { border: 'border-orange-600', bg: 'bg-[#FF4500]/20', badge: 'bg-[#FF4500]/40 text-white', toggle: 'bg-[#FF4500]', icon: 'bg-[#FF4500] text-white' } },
  steelBlue:     { light: { border: 'border-sky-500', bg: 'bg-[#4682B4]/10', badge: 'bg-[#4682B4]/20 text-sky-900', toggle: 'bg-[#4682B4]', icon: 'bg-[#4682B4] text-white' }, dark: { border: 'border-sky-600', bg: 'bg-[#4682B4]/20', badge: 'bg-[#4682B4]/40 text-sky-100', toggle: 'bg-[#4682B4]', icon: 'bg-[#4682B4] text-white' } },
  black:           { light: { border: 'border-gray-800', bg: 'bg-gray-100', badge: 'bg-black text-white', toggle: 'bg-black', icon: 'bg-black text-white' }, dark: { border: 'border-zinc-700', bg: 'bg-black/60', badge: 'bg-zinc-800 text-white', toggle: 'bg-black', icon: 'bg-black text-white border border-zinc-700' } },
  darkSlateBlue: { light: { border: 'border-indigo-600', bg: 'bg-[#483D8B]/10', badge: 'bg-[#483D8B]/20 text-indigo-900', toggle: 'bg-[#483D8B]', icon: 'bg-[#483D8B] text-white' }, dark: { border: 'border-indigo-800', bg: 'bg-[#483D8B]/30', badge: 'bg-[#483D8B]/50 text-indigo-100', toggle: 'bg-[#483D8B]', icon: 'bg-[#483D8B] text-white' } },
  deepBrown:       { light: { border: 'border-[#5C4033]', bg: 'bg-[#231709]/10', badge: 'bg-[#231709]/20 text-black', toggle: 'bg-[#231709]', icon: 'bg-[#231709] text-white' }, dark: { border: 'border-[#3E2910]', bg: 'bg-[#231709]/60', badge: 'bg-[#231709] text-amber-100', toggle: 'bg-[#231709]', icon: 'bg-[#231709] text-white' } },
  rebeccaPurple: { light: { border: 'border-purple-600', bg: 'bg-[#663399]/10', badge: 'bg-[#663399]/20 text-purple-900', toggle: 'bg-[#663399]', icon: 'bg-[#663399] text-white' }, dark: { border: 'border-purple-800', bg: 'bg-[#663399]/30', badge: 'bg-[#663399]/50 text-purple-100', toggle: 'bg-[#663399]', icon: 'bg-[#663399] text-white' } },
  cordovan:        { light: { border: 'border-red-800', bg: 'bg-[#893f45]/10', badge: 'bg-[#893f45]/20 text-red-900', toggle: 'bg-[#893f45]', icon: 'bg-[#893f45] text-white' }, dark: { border: 'border-red-900', bg: 'bg-[#893f45]/30', badge: 'bg-[#893f45]/50 text-rose-100', toggle: 'bg-[#893f45]', icon: 'bg-[#893f45] text-white' } },
  darkOliveGreen:  { light: { border: 'border-lime-700', bg: 'bg-[#556b2f]/10', badge: 'bg-[#556b2f]/20 text-lime-900', toggle: 'bg-[#556b2f]', icon: 'bg-[#556b2f] text-white' }, dark: { border: 'border-lime-900', bg: 'bg-[#556b2f]/30', badge: 'bg-[#556b2f]/50 text-lime-100', toggle: 'bg-[#556b2f]', icon: 'bg-[#556b2f] text-white' } },
  saddleBrown:     { light: { border: 'border-orange-800', bg: 'bg-[#8b4513]/10', badge: 'bg-[#8b4513]/20 text-orange-900', toggle: 'bg-[#8b4513]', icon: 'bg-[#8b4513] text-white' }, dark: { border: 'border-orange-900', bg: 'bg-[#8b4513]/30', badge: 'bg-[#8b4513]/50 text-orange-100', toggle: 'bg-[#8b4513]', icon: 'bg-[#8b4513] text-white' } },
  teal:            { light: { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-teal-600', icon: 'bg-teal-600 text-white' }, dark: { border: 'border-teal-900', bg: 'bg-teal-950/40', badge: 'bg-teal-900/60 text-teal-100', toggle: 'bg-teal-700', icon: 'bg-teal-900 text-teal-100' } },
  dark:            { light: { border: 'border-gray-800', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-900', toggle: 'bg-gray-900', icon: 'bg-gray-900 text-white' }, dark: { border: 'border-zinc-700', bg: 'bg-black/40', badge: 'bg-zinc-800 text-gray-300', toggle: 'bg-zinc-700', icon: 'bg-zinc-900 text-gray-400' } },
};

export const ExpansionToggle: React.FC<ExpansionToggleProps> = ({ 
  id, label, active, themeColor, description, onToggle, has10th, page_10th
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const styles = THEME_COLOR_STYLES[themeColor] || THEME_COLOR_STYLES.dark;
  const currentTheme = isDark ? styles.dark : styles.light;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

  const titleColor = active 
    ? (isDark ? 'text-white' : 'text-gray-900') 
    : (isDark ? 'text-gray-300' : 'text-gray-600');
    
  const descColor = active
    ? (isDark ? 'text-gray-300' : 'text-gray-700')
    : (isDark ? 'text-zinc-400' : 'text-gray-500');

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
      className={cls(
        "relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 backdrop-blur-sm",
        active 
          ? cls(currentTheme.border, currentTheme.bg, "shadow-md")
          : cls(inactiveBorder, inactiveBg, inactiveHover)
      )}
    >
      <div className="flex items-center flex-1">
        <div className={cls(
          "w-12 h-12 rounded-lg mr-4 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hidden shrink-0",
          !active && "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500"
        )}>
          <ExpansionIcon id={id} />
        </div>
        
        <div className="flex-1 mr-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <h3 className={cls("font-bold text-lg leading-tight transition-colors duration-300", titleColor)}>
              {label}
            </h3>
            {has10th && page_10th && (
              <PageReference page={page_10th} manual="10th AE" />
            )}
          </div>
          <p className={cls("text-xs mt-1 leading-snug", descColor)}>
             {description}
          </p>
          <span className={cls(
            "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 transition-colors duration-300",
            active ? currentTheme.badge : inactiveBadge
          )}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className={cls(
        "w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0 ml-2",
        active ? currentTheme.toggle : inactiveToggle
      )}>
        <div className={cls(
          toggleKnob, 
          "w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
          active ? 'translate-x-6' : 'translate-x-0'
        )}></div>
      </div>
    </div>
  );
};