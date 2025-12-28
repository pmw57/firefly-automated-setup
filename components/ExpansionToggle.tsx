import React from 'react';
import { Expansions, ThemeColor } from '../types/index';
import { ExpansionIcon } from './ExpansionIcon';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';
import { expansionColorConfig, specialColorConfig } from '../data/themeColors';

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

export const ExpansionToggle: React.FC<ExpansionToggleProps> = ({ 
  id, label, active, themeColor, description, onToggle, has10th, page_10th
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const styles = (themeColor in specialColorConfig)
    ? specialColorConfig[themeColor as keyof typeof specialColorConfig]
    : expansionColorConfig[themeColor as keyof typeof expansionColorConfig];

  const currentTheme = styles ? (isDark ? styles.dark : styles.light) : null;
  
  if (!currentTheme) {
      // Fallback for an unknown themeColor to prevent crashes
      return <div>Error: Unknown theme color '{themeColor}'</div>;
  }

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
