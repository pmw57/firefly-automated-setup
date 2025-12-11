import React from 'react';
import { Expansions, ThemeColor } from '../types';
import { getExpansionIcon } from './iconHelpers';

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
  const themes: Record<ThemeColor, ThemeStyles> = {
    blue: { 
      border: 'border-blue-500 dark:border-blue-900', 
      bg: 'bg-blue-50 dark:bg-blue-950/40', 
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200/80', 
      toggle: 'bg-blue-600 dark:bg-blue-700', 
      icon: 'bg-blue-600 dark:bg-blue-900 dark:text-blue-100' 
    },
    amber: { 
      border: 'border-amber-500 dark:border-amber-900', 
      bg: 'bg-amber-50 dark:bg-amber-950/40', 
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200/80', 
      toggle: 'bg-amber-600 dark:bg-amber-700', 
      icon: 'bg-amber-600 dark:bg-amber-900 dark:text-amber-100' 
    },
    red: { 
      border: 'border-red-500 dark:border-red-900', 
      bg: 'bg-red-50 dark:bg-red-950/40', 
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200/80', 
      toggle: 'bg-red-600 dark:bg-red-700', 
      icon: 'bg-red-600 dark:bg-red-900 dark:text-red-100' 
    },
    gray: { 
      border: 'border-gray-500 dark:border-zinc-700', 
      bg: 'bg-gray-100 dark:bg-zinc-900/60', 
      badge: 'bg-gray-200 text-gray-800 dark:bg-zinc-800 dark:text-gray-300', 
      toggle: 'bg-gray-600 dark:bg-zinc-600', 
      icon: 'bg-gray-600 dark:bg-zinc-800 dark:text-gray-300' 
    },
    purple: { 
      border: 'border-purple-500 dark:border-purple-900', 
      bg: 'bg-purple-50 dark:bg-purple-950/40', 
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200/80', 
      toggle: 'bg-purple-600 dark:bg-purple-700', 
      icon: 'bg-purple-600 dark:bg-purple-900 dark:text-purple-100' 
    },
    yellow: { 
      border: 'border-yellow-500 dark:border-yellow-900', 
      bg: 'bg-yellow-50 dark:bg-yellow-950/40', 
      badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200/80', 
      toggle: 'bg-yellow-600 dark:bg-yellow-700', 
      icon: 'bg-yellow-600 dark:bg-yellow-900 dark:text-yellow-100' 
    },
    dark: { 
      border: 'border-gray-800 dark:border-zinc-700', 
      bg: 'bg-gray-50 dark:bg-black/40', 
      badge: 'bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:text-gray-400', 
      toggle: 'bg-gray-900 dark:bg-zinc-700', 
      icon: 'bg-gray-900 dark:bg-zinc-900 dark:text-gray-400' 
    },
    cyan: { 
      border: 'border-cyan-500 dark:border-cyan-900', 
      bg: 'bg-cyan-50 dark:bg-cyan-950/40', 
      badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200/80', 
      toggle: 'bg-cyan-600 dark:bg-cyan-700', 
      icon: 'bg-cyan-600 dark:bg-cyan-900 dark:text-cyan-100' 
    },
    paleGreen: { 
      border: 'border-green-400 dark:border-emerald-900', 
      bg: 'bg-green-50 dark:bg-emerald-950/40', 
      badge: 'bg-green-100 text-green-800 dark:bg-emerald-900/60 dark:text-emerald-200/80', 
      toggle: 'bg-green-400 dark:bg-emerald-700', 
      icon: 'bg-green-400 dark:bg-emerald-900 dark:text-emerald-100' 
    },
    firebrick: { 
      border: 'border-red-800 dark:border-red-950', 
      bg: 'bg-red-50 dark:bg-red-950/30', 
      badge: 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200/80', 
      toggle: 'bg-red-800 dark:bg-red-900', 
      icon: 'bg-red-800 dark:bg-red-950 dark:text-red-200' 
    },
    khaki: { 
      border: 'border-amber-400 dark:border-amber-900', 
      bg: 'bg-amber-50 dark:bg-amber-950/30', 
      badge: 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200/80', 
      toggle: 'bg-amber-400 dark:bg-amber-700', 
      icon: 'bg-amber-400 dark:bg-amber-900 dark:text-amber-100' 
    },
    cornflower: { 
      border: 'border-indigo-400 dark:border-indigo-900', 
      bg: 'bg-indigo-50 dark:bg-indigo-950/40', 
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200/80', 
      toggle: 'bg-indigo-400 dark:bg-indigo-700', 
      icon: 'bg-indigo-400 dark:bg-indigo-900 dark:text-indigo-100' 
    },
    brown: { 
      border: 'border-orange-800 dark:border-orange-950', 
      bg: 'bg-orange-50 dark:bg-orange-950/30', 
      badge: 'bg-orange-100 text-orange-900 dark:bg-orange-900/60 dark:text-orange-200/80', 
      toggle: 'bg-orange-800 dark:bg-orange-900', 
      icon: 'bg-orange-800 dark:bg-orange-950 dark:text-orange-200' 
    },
    teal: { 
      border: 'border-teal-500 dark:border-teal-900', 
      bg: 'bg-teal-50 dark:bg-teal-950/40', 
      badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200/80', 
      toggle: 'bg-teal-600 dark:bg-teal-700', 
      icon: 'bg-teal-600 dark:bg-teal-900 dark:text-teal-100' 
    }
  };

  const currentTheme = themes[themeColor] || themes['gray'];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(id);
    }
  };

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
          : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-gray-300 dark:hover:border-zinc-600'
        }
      `}
    >
      <div className="flex items-center flex-1">
        <div className={`
          w-12 h-12 rounded-lg mr-4 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hiddenHS shrink-0
          ${active ? currentTheme.icon : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500'}
        `}>
          {getExpansionIcon(id) || label.charAt(0)}
        </div>
        
        <div className="flex-1 mr-4">
          <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${active ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
            {label}
          </h3>
          <p className={`text-xs mt-1 leading-snug ${active ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-zinc-600'}`}>
             {description}
          </p>
          <span className={`
            inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 transition-colors duration-300
            ${active ? currentTheme.badge : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'}
          `}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className={`
        w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0 ml-2
        ${active ? currentTheme.toggle : 'bg-gray-300 dark:bg-zinc-700'}
      `}>
        <div className={`
          bg-white dark:bg-zinc-200 w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
          ${active ? 'translate-x-6' : 'translate-x-0'}
        `}></div>
      </div>
    </div>
  );
};