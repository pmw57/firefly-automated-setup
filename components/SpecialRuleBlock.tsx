
import React, { useMemo } from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';
import { StructuredContent } from '../types';
import { StructuredContentRenderer } from './StructuredContentRenderer';

export interface OverrideNotificationBlockProps {
  source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
  title?: string;
  content: StructuredContent;
  page?: string | number;
  manual?: string;
  badge?: string;
  className?: string;
}

export const OverrideNotificationBlock: React.FC<OverrideNotificationBlockProps> = ({ source, title, content, page, manual, badge, className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStyles = () => {
    // Semantic mapping based on source type
    if (isDark) {
      switch(source) {
        case 'story': return { border: 'border-amber-700', bg: 'bg-amber-900/20', text: 'text-amber-200/90' };
        case 'setupCard': return { border: 'border-blue-800', bg: 'bg-blue-900/20', text: 'text-blue-200/90' };
        case 'expansion': return { border: 'border-purple-800', bg: 'bg-purple-900/20', text: 'text-purple-200/90' };
        case 'warning': return { border: 'border-red-800', bg: 'bg-red-900/20', text: 'text-red-200/90' };
        case 'info': return { border: 'border-zinc-600', bg: 'bg-zinc-800/40', text: 'text-gray-300' };
      }
    } else {
      switch(source) {
        case 'story': return { border: 'border-[#b45309]', bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
        case 'setupCard': return { border: 'border-[#1e40af]', bg: 'bg-[#eff6ff]', text: 'text-[#1e3a8a]' };
        case 'expansion': return { border: 'border-[#7e22ce]', bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]' };
        case 'warning': return { border: 'border-[#b91c1c]', bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]' };
        case 'info': return { border: 'border-border-separator', bg: 'bg-surface-overlay/50', text: 'text-content-secondary' };
      }
    }
    return { border: 'border-border-separator', bg: 'bg-surface-card', text: 'text-content-primary' };
  };

  const icons = { story: '📜', setupCard: '⚙️', expansion: '🧩', warning: '⚠️', info: 'ℹ️' };
  const labels = { story: 'Story Override', setupCard: 'Setup Card Rule', expansion: 'Expansion Rule', warning: 'Restriction', info: 'Information' };
  const s = getStyles();

  // Generate unique IDs for ARIA labelling
  const uniqueId = useMemo(() => `srb-${Math.random().toString(36).slice(2, 9)}`, []);
  const labelId = `${uniqueId}-label`;
  const titleId = `${uniqueId}-title`;
  const labelledby = [labelId, title ? titleId : undefined].filter(Boolean).join(' ');


  return (
    <section 
      className={cls("border-l-4 p-4 rounded-r-xl shadow-sm mb-4 transition-all hover:shadow-md backdrop-blur-sm animate-fade-in-up", s.border, s.bg, className)}
      aria-labelledby={labelledby}
    >
      <div className="flex items-start mb-2">
        <span className="text-xl mr-3 mt-0.5 select-none opacity-80" aria-hidden="true">{icons[source]}</span>
        <div className="flex-1">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <div>
                <span id={labelId} className={cls("text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-0.5", s.text)}>
                  {labels[source]}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                    {title && <h4 id={titleId} className={cls("font-bold text-base leading-tight", s.text)}>{title}</h4>}
                    {badge && (
                        <span className={cls("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-current opacity-70", s.text)}>
                            {badge}
                        </span>
                    )}
                </div>
              </div>
            </div>
            {page && <PageReference page={page} manual={manual} />}
          </div>
        </div>
      </div>
      <div className={cls("text-sm leading-loose tracking-wide pl-1 opacity-90", s.text)}>
        <StructuredContentRenderer content={content} />
      </div>
    </section>
  );
};
