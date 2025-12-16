import React from 'react';
import { useTheme } from './ThemeContext';

interface SpecialRuleBlockProps {
  source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
  title?: string;
  children?: React.ReactNode;
}

export const SpecialRuleBlock: React.FC<SpecialRuleBlockProps> = ({ source, title, children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStyles = () => {
    if (isDark) {
      switch(source) {
        case 'story': return { border: 'border-amber-700', bg: 'bg-amber-900/20', text: 'text-amber-200/90' };
        case 'setupCard': return { border: 'border-blue-800', bg: 'bg-blue-900/20', text: 'text-blue-200/90' };
        case 'expansion': return { border: 'border-purple-800', bg: 'bg-purple-900/20', text: 'text-purple-200/90' };
        case 'warning': return { border: 'border-red-800', bg: 'bg-red-900/20', text: 'text-red-200/90' };
        case 'info': return { border: 'border-zinc-600', bg: 'bg-zinc-800/40', text: 'text-gray-300' };
      }
    } else {
      // Firefly Light Theme
      switch(source) {
        // Story: Amber/Brown
        case 'story': return { border: 'border-[#b45309]', bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
        // Setup Card: Deep Blue (Alliance)
        case 'setupCard': return { border: 'border-[#1e40af]', bg: 'bg-[#eff6ff]', text: 'text-[#1e3a8a]' };
        // Expansion: Purple
        case 'expansion': return { border: 'border-[#7e22ce]', bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]' };
        // Warning: Red
        case 'warning': return { border: 'border-[#b91c1c]', bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]' };
        // Info: Gray
        case 'info': return { border: 'border-[#78716c]', bg: 'bg-[#f5f5f4]', text: 'text-[#44403c]' };
      }
    }
    return { border: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const icons = {
    story: '📜',
    setupCard: '⚙️',
    expansion: '🧩',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const labels = {
    story: 'Story Override',
    setupCard: 'Setup Card Override',
    expansion: 'Expansion Rule',
    warning: 'Restriction',
    info: 'Information'
  };

  const s = getStyles();

  return (
    <div className={`border-l-4 p-4 rounded-r-lg shadow-sm mb-4 transition-all hover:shadow-md backdrop-blur-sm ${s.border} ${s.bg}`}>
      <div className="flex items-start mb-2">
        <span className="text-xl mr-3 mt-0.5 select-none opacity-80">{icons[source]}</span>
        <div className="flex-1">
           <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-0.5 ${s.text}`}>
             {labels[source]}
           </span>
           {title && <h4 className={`font-bold text-base leading-tight ${s.text}`}>{title}</h4>}
        </div>
      </div>
      <div className={`text-sm leading-relaxed pl-1 opacity-90 ${s.text}`}>
        {children}
      </div>
    </div>
  );
};