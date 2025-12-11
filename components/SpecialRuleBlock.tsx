import React from 'react';

interface SpecialRuleBlockProps {
  source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
}

export const SpecialRuleBlock: React.FC<SpecialRuleBlockProps> = ({ source, title, children }) => {
  const styles = {
    story: {
      border: 'border-amber-500 dark:border-amber-700',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-900 dark:text-amber-200/90',
      icon: '📜',
      label: 'Story Override'
    },
    setupCard: {
      border: 'border-blue-500 dark:border-blue-800',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-900 dark:text-blue-200/90',
      icon: '⚙️',
      label: 'Setup Card Override'
    },
    expansion: {
      border: 'border-purple-500 dark:border-purple-800',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-900 dark:text-purple-200/90',
      icon: '🧩',
      label: 'Expansion Rule'
    },
    warning: {
      border: 'border-red-500 dark:border-red-800',
      bg: 'bg-red-50 dark:bg-red-900/20',
      text: 'text-red-900 dark:text-red-200/90',
      icon: '⚠️',
      label: 'Restriction'
    },
    info: {
      border: 'border-gray-400 dark:border-zinc-600',
      bg: 'bg-gray-50 dark:bg-zinc-800/40',
      text: 'text-gray-800 dark:text-gray-300',
      icon: 'ℹ️',
      label: 'Information'
    }
  };

  const s = styles[source];

  return (
    <div className={`border-l-4 ${s.border} ${s.bg} p-4 rounded-r-lg shadow-sm mb-4 transition-all hover:shadow-md backdrop-blur-sm`}>
      <div className="flex items-start mb-2">
        <span className="text-xl mr-3 mt-0.5 select-none opacity-80">{s.icon}</span>
        <div className="flex-1">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${s.text} opacity-60 block mb-0.5`}>
             {s.label}
           </span>
           {title && <h4 className={`font-bold ${s.text} text-base leading-tight`}>{title}</h4>}
        </div>
      </div>
      <div className={`${s.text} text-sm leading-relaxedQX pl-1 opacity-90`}>
        {children}
      </div>
    </div>
  );
};