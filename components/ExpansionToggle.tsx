import React from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { Expansions, ThemeColor } from '../types/index';
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
  cyan:            { light: { border: 'border-cyan-500', bg: 'bg-expansion-cyan/10', badge: 'bg-expansion-cyan/20 text-cyan-900', toggle: 'bg-expansion-cyan', icon: 'bg-expansion-cyan text-white' }, dark: { border: 'border-cyan-600', bg: 'bg-expansion-cyan/20', badge: 'bg-expansion-cyan/40 text-white', toggle: 'bg-expansion-cyan', icon: 'bg-expansion-cyan text-white' } },
  tan:             { light: { border: 'border-yellow-700', bg: 'bg-expansion-tan/10', badge: 'bg-expansion-tan/20 text-yellow-900', toggle: 'bg-expansion-tan', icon: 'bg-expansion-tan text-white' }, dark: { border: 'border-yellow-800', bg: 'bg-expansion-tan/20', badge: 'bg-expansion-tan/40 text-yellow-100', toggle: 'bg-expansion-tan', icon: 'bg-expansion-tan text-white' } },
  mediumPurple:    { light: { border: 'border-purple-500', bg: 'bg-expansion-mediumPurple/10', badge: 'bg-expansion-mediumPurple/20 text-purple-900', toggle: 'bg-expansion-mediumPurple', icon: 'bg-expansion-mediumPurple text-white' }, dark: { border: 'border-purple-600', bg: 'bg-expansion-mediumPurple/20', badge: 'bg-expansion-mediumPurple/40 text-white', toggle: 'bg-expansion-mediumPurple', icon: 'bg-expansion-mediumPurple text-white' } },
  gamblingGreen:   { light: { border: 'border-emerald-600', bg: 'bg-expansion-gamblingGreen/10', badge: 'bg-expansion-gamblingGreen/20 text-emerald-900', toggle: 'bg-expansion-gamblingGreen', icon: 'bg-expansion-gamblingGreen text-white' }, dark: { border: 'border-emerald-700', bg: 'bg-expansion-gamblingGreen/20', badge: 'bg-expansion-gamblingGreen/40 text-white', toggle: 'bg-expansion-gamblingGreen', icon: 'bg-expansion-gamblingGreen text-white' } },
  steelBlue:     { light: { border: 'border-sky-500', bg: 'bg-expansion-steelBlue/10', badge: 'bg-expansion-steelBlue/20 text-sky-900', toggle: 'bg-expansion-steelBlue', icon: 'bg-expansion-steelBlue text-white' }, dark: { border: 'border-sky-600', bg: 'bg-expansion-steelBlue/20', badge: 'bg-expansion-steelBlue/40 text-sky-100', toggle: 'bg-expansion-steelBlue', icon: 'bg-expansion-steelBlue text-white' } },
  black:           { light: { border: 'border-gray-800', bg: 'bg-gray-100', badge: 'bg-black text-white', toggle: 'bg-black', icon: 'bg-black text-white' }, dark: { border: 'border-zinc-700', bg: 'bg-black/60', badge: 'bg-zinc-800 text-white', toggle: 'bg-black', icon: 'bg-black text-white border border-zinc-700' } },
  darkSlateBlue: { light: { border: 'border-indigo-600', bg: 'bg-expansion-darkSlateBlue/10', badge: 'bg-expansion-darkSlateBlue/20 text-indigo-900', toggle: 'bg-expansion-darkSlateBlue', icon: 'bg-expansion-darkSlateBlue text-white' }, dark: { border: 'border-indigo-800', bg: 'bg-expansion-darkSlateBlue/30', badge: 'bg-expansion-darkSlateBlue/50 text-indigo-100', toggle: 'bg-expansion-darkSlateBlue', icon: 'bg-expansion-darkSlateBlue text-white' } },
  deepBrown:       { light: { border: 'border-stone-800', bg: 'bg-expansion-deepBrown/10', badge: 'bg-expansion-deepBrown/20 text-black', toggle: 'bg-expansion-deepBrown', icon: 'bg-expansion-deepBrown text-white' }, dark: { border: 'border-stone-900', bg: 'bg-expansion-deepBrown/60', badge: 'bg-expansion-deepBrown text-amber-100', toggle: 'bg-expansion-deepBrown', icon: 'bg-expansion-deepBrown text-white' } },
  rebeccaPurple: { light: { border: 'border-purple-600', bg: 'bg-expansion-rebeccaPurple/10', badge: 'bg-expansion-rebeccaPurple/20 text-purple-900', toggle: 'bg-expansion-rebeccaPurple', icon: 'bg-expansion-rebeccaPurple text-white' }, dark: { border: 'border-purple-800', bg: 'bg-expansion-rebeccaPurple/30', badge: 'bg-expansion-rebeccaPurple/50 text-purple-100', toggle: 'bg-expansion-rebeccaPurple', icon: 'bg-expansion-rebeccaPurple text-white' } },
  cordovan:        { light: { border: 'border-red-800', bg: 'bg-expansion-cordovan/10', badge: 'bg-expansion-cordovan/20 text-red-900', toggle: 'bg-expansion-cordovan', icon: 'bg-expansion-cordovan text-white' }, dark: { border: 'border-red-900', bg: 'bg-expansion-cordovan/30', badge: 'bg-expansion-cordovan/50 text-rose-100', toggle: 'bg-expansion-cordovan', icon: 'bg-expansion-cordovan text-white' } },
  darkOliveGreen:  { light: { border: 'border-lime-700', bg: 'bg-expansion-darkOliveGreen/10', badge: 'bg-expansion-darkOliveGreen/20 text-lime-900', toggle: 'bg-expansion-darkOliveGreen', icon: 'bg-expansion-darkOliveGreen text-white' }, dark: { border: 'border-lime-900', bg: 'bg-expansion-darkOliveGreen/30', badge: 'bg-expansion-darkOliveGreen/50 text-lime-100', toggle: 'bg-expansion-darkOliveGreen', icon: 'bg-expansion-darkOliveGreen text-white' } },
  saddleBrown:     { light: { border: 'border-orange-800', bg: 'bg-firefly-saddleBrown/10', badge: 'bg-firefly-saddleBrown/20 text-orange-900', toggle: 'bg-firefly-saddleBrown', icon: 'bg-firefly-saddleBrown text-white' }, dark: { border: 'border-orange-900', bg: 'bg-firefly-saddleBrown/30', badge: 'bg-firefly-saddleBrown/50 text-orange-100', toggle: 'bg-firefly-saddleBrown', icon: 'bg-firefly-saddleBrown text-white' } },
  teal:            { light: { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-expansion-teal', icon: 'bg-expansion-teal text-white' }, dark: { border: 'border-teal-900', bg: 'bg-teal-950/40', badge: 'bg-teal-900/60 text-teal-100', toggle: 'bg-expansion-teal', icon: 'bg-expansion-teal text-teal-100' } },
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
        "relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500",
        "md:grid md:grid-cols-[20%_1fr_max-content] md:items-center md:gap-x-6",
        active 
          ? cls(currentTheme.border, currentTheme.bg, "shadow-md")
          : cls(inactiveBorder, inactiveBg, inactiveHover)
      )}
    >
      {/* Col 1: Icon & Title */}
      <div className="flex items-center md:flex-col">
        <div className={cls(
          "w-12 h-12 rounded-lg mr-4 md:mr-0 md:mb-2 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hidden shrink-0",
          !active && "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500"
        )}>
          <ExpansionIcon id={id} />
        </div>
        
        <div className="flex-1 min-w-0 mr-4 md:mr-0 md:text-center">
          <h3 className={cls("font-bold text-lg leading-tight transition-colors duration-300", titleColor)}>
            {label}
          </h3>
          {has10th && page_10th && (
            <PageReference page={page_10th} manual="10th AE" className="mt-1" />
          )}
        </div>
      </div>
      
      {/* Col 2: Description */}
      <div className="mt-3 md:mt-0">
        <p className={cls("text-sm leading-relaxed", descColor)}>
           {description}
        </p>
      </div>
      
      {/* Col 3: Badge & Toggle */}
      <div className={cls(
        "flex items-center justify-between mt-3", 
        "md:mt-0 md:flex-col md:items-end md:justify-center md:gap-2"
      )}>
        <span className={cls(
          "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors duration-300",
          active ? currentTheme.badge : inactiveBadge
        )}>
          {active ? 'Active' : 'Inactive'}
        </span>
        <div className={cls(
          "w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0",
          active ? currentTheme.toggle : inactiveToggle
        )}>
          <div className={cls(
            toggleKnob, 
            "w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
            active ? 'translate-x-6' : 'translate-x-0'
          )}></div>
        </div>
      </div>
    </div>
  );
};