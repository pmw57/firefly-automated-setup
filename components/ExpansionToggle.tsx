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
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', toggle: 'bg-blue-600', icon: 'bg-blue-600' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', toggle: 'bg-amber-600', icon: 'bg-amber-600' },
    red: { border: 'border-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-800', toggle: 'bg-red-600', icon: 'bg-red-600' },
    gray: { border: 'border-gray-500', bg: 'bg-gray-100', badge: 'bg-gray-200 text-gray-800', toggle: 'bg-gray-600', icon: 'bg-gray-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', toggle: 'bg-purple-600', icon: 'bg-purple-600' },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800', toggle: 'bg-yellow-600', icon: 'bg-yellow-600' },
    dark: { border: 'border-gray-800', bg: 'bg-gray-50', badge: 'bg-gray-200 text-gray-900', toggle: 'bg-gray-900', icon: 'bg-gray-900' },
    cyan: { border: 'border-cyan-500', bg: 'bg-cyan-50', badge: 'bg-cyan-100 text-cyan-800', toggle: 'bg-cyan-600', icon: 'bg-cyan-600' },
    paleGreen: { border: 'border-green-400', bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', toggle: 'bg-green-400', icon: 'bg-green-400' },
    firebrick: { border: 'border-red-800', bg: 'bg-red-50', badge: 'bg-red-100 text-red-900', toggle: 'bg-red-800', icon: 'bg-red-800' },
    khaki: { border: 'border-amber-400', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-900', toggle: 'bg-amber-400', icon: 'bg-amber-400' },
    cornflower: { border: 'border-indigo-400', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-800', toggle: 'bg-indigo-400', icon: 'bg-indigo-400' },
    brown: { border: 'border-orange-800', bg: 'bg-orange-50', badge: 'bg-orange-100 text-orange-900', toggle: 'bg-orange-800', icon: 'bg-orange-800' },
    teal: { border: 'border-teal-500', bg: 'bg-teal-50', badge: 'bg-teal-100 text-teal-800', toggle: 'bg-teal-600', icon: 'bg-teal-600' }
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
        relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-300 ease-in-out flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        ${active 
          ? `${currentTheme.border} ${currentTheme.bg} shadow-md` 
          : 'border-gray-200 bg-white hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center flex-1">
        <div className={`
          w-12 h-12 rounded-lg mr-4 flex items-center justify-center font-bold text-xl shadow-sm transition-colors duration-300 overflow-hidden shrink-0
          ${active ? currentTheme.icon : 'bg-gray-100 text-gray-400'}
        `}>
          {getExpansionIcon(id) || label.charAt(0)}
        </div>
        
        <div className="flex-1 mr-4">
          <h3 className={`font-bold text-lg leading-tight transition-colors duration-300 ${active ? 'text-gray-900' : 'text-gray-500'}`}>
            {label}
          </h3>
          <p className={`text-xs mt-1 leading-snug ${active ? 'text-gray-600' : 'text-gray-400'}`}>
             {description}
          </p>
          <span className={`
            inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-2 transition-colors duration-300
            ${active ? currentTheme.badge : 'bg-gray-100 text-gray-400'}
          `}>
            {active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className={`
        w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center shrink-0 ml-2
        ${active ? currentTheme.toggle : 'bg-gray-300'}
      `}>
        <div className={`
          bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out
          ${active ? 'translate-x-6' : 'translate-x-0'}
        `}></div>
      </div>
    </div>
  );
};