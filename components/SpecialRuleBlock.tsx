import React from 'react';

interface SpecialRuleBlockProps {
  source: 'story' | 'scenario' | 'expansion' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
}

export const SpecialRuleBlock: React.FC<SpecialRuleBlockProps> = ({ source, title, children }) => {
  const styles = {
    story: {
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      icon: '📜',
      label: 'Story Override'
    },
    scenario: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      icon: '⚙️',
      label: 'Setup Override'
    },
    expansion: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      text: 'text-purple-900',
      icon: '🧩',
      label: 'Expansion Rule'
    },
    warning: {
      border: 'border-red-500',
      bg: 'bg-red-50',
      text: 'text-red-900',
      icon: '⚠️',
      label: 'Restriction'
    },
    info: {
      border: 'border-gray-400',
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      icon: 'ℹ️',
      label: 'Information'
    }
  };

  const s = styles[source];

  return (
    <div className={`border-l-4 ${s.border} ${s.bg} p-4 rounded-r-lg shadow-sm mb-4 transition-all hover:shadow-md`}>
      <div className="flex items-start mb-2">
        <span className="text-xl mr-3 mt-0.5 select-none">{s.icon}</span>
        <div className="flex-1">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text} opacity-70 block mb-0.5`}>
             {s.label}
           </span>
           {title && <h4 className={`font-bold ${s.text} text-base leading-tight`}>{title}</h4>}
        </div>
      </div>
      <div className={`${s.text} text-sm leading-relaxed pl-1`}>
        {children}
      </div>
    </div>
  );
};