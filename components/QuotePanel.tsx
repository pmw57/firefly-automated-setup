
import React from 'react';
import { STEP_QUOTES } from '../constants';

interface QuotePanelProps {
  stepId: string;
}

export const QuotePanel: React.FC<QuotePanelProps> = ({ stepId }) => {
  const quote = STEP_QUOTES[stepId] || { text: "We're just happy to be doing good works.", author: "Shepherd Book" };

  return (
    <div className="w-full lg:w-1/3 mb-6 lg:ml-8 lg:float-right">
       <div className="bg-gray-900 p-5 rounded-xl shadow-lg relative overflow-hidden text-center lg:text-left">
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="text-6xl text-white font-western">"</span>
           </div>
           
           <div className="relative z-10">
             <p className="text-gray-300 italic font-serif text-sm leading-relaxed mb-2">
               "{quote.text}"
             </p>
             <p className="text-green-500 font-bold font-western tracking-wider text-xs uppercase">
               — {quote.author}
             </p>
           </div>
       </div>
    </div>
  );
};
