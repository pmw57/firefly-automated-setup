import React from 'react';
import { STEP_QUOTES } from '../constants';

interface QuotePanelProps {
  stepId: string;
  className?: string;
}

export const QuotePanel: React.FC<QuotePanelProps> = ({ stepId, className = '' }) => {
  const quote = STEP_QUOTES[stepId] || { text: "We're just happy to be doing good works.", author: "Shepherd Book" };

  return (
     <div className={`bg-black/60 backdrop-blur-sm border border-white/20 p-5 rounded-xl shadow-lg relative overflow-hidden text-center lg:text-left relative z-20 ${className}`}>
         {/* Background decorative tint */}
         <div className="absolute inset-0 bg-yellow-900/10 pointer-events-none"></div>
         
         <div className="absolute top-0 right-0 p-2 opacity-10">
            <span className="text-6xl text-white font-western">"</span>
         </div>
         
         <div className="relative z-10">
           <p className="text-gray-200 italic font-serif text-sm leading-relaxed mb-2 drop-shadow-sm">
             "{quote.text}"
           </p>
           <p className="text-yellow-500 font-bold font-western tracking-wider text-xs uppercase border-t border-white/10 pt-1 inline-block">
             — {quote.author}
           </p>
         </div>
     </div>
  );
};