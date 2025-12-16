

import React from 'react';
import { STEP_QUOTES } from '../data/steps';
import { useTheme } from './ThemeContext';

interface QuotePanelProps {
  stepId: string;
  className?: string;
}

export const QuotePanel: React.FC<QuotePanelProps> = ({ stepId, className = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const quote = STEP_QUOTES[stepId] || { text: "We're just happy to be doing good works.", author: "Shepherd Book" };

  const bgClass = isDark ? 'bg-black/60' : 'bg-amber-50/90';
  const borderClass = isDark ? 'border-white/20' : 'border-amber-900/10';
  const tintClass = isDark ? 'bg-yellow-900/10' : 'bg-yellow-500/5';
  const quoteIconColor = isDark ? 'text-white' : 'text-amber-900';
  const opacityClass = isDark ? 'opacity-10' : 'opacity-20';
  
  const textColor = isDark ? 'text-gray-200' : 'text-amber-900/90';
  const authorColor = isDark ? 'text-yellow-500' : 'text-amber-700';
  const separatorBorder = isDark ? 'border-white/10' : 'border-amber-900/10';

  return (
     <div className={`
        ${bgClass}
        backdrop-blur-sm 
        border ${borderClass}
        p-5 rounded-xl shadow-lg 
        relative overflow-hidden 
        text-center lg:text-left 
        relative z-20 
        transition-colors duration-300
        ${className}
     `}>
         {/* Background decorative tint */}
         <div className={`absolute inset-0 ${tintClass} pointer-events-none`}></div>
         
         <div className={`absolute top-0 right-0 p-2 ${opacityClass}`}>
            <span className={`text-6xl ${quoteIconColor} font-western`}>"</span>
         </div>
         
         <div className="relative z-10">
           <p className={`${textColor} italic font-serif text-sm leading-relaxed mb-2 drop-shadow-sm`}>
             "{quote.text}"
           </p>
           <p className={`${authorColor} font-bold font-western tracking-wider text-xs uppercase border-t ${separatorBorder} pt-1 inline-block`}>
             — {quote.author}
           </p>
         </div>
     </div>
  );
};