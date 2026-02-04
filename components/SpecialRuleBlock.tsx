
import React, { useMemo } from 'react';
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
  const getStyles = () => {
    // Mapping sources to Semantic Tokens
    switch(source) {
      case 'story': 
        // Story Overrides -> Warning/Amber-ish tone (using 'warning' semantics or custom override)
        return { 
          border: 'border-amber-600 dark:border-amber-700', 
          bg: 'bg-amber-50 dark:bg-amber-950/30', 
          text: 'text-amber-900 dark:text-amber-200/90' 
        };
      case 'setupCard': 
        // Setup Rules -> Info/Blue tone
        return { 
          border: 'border-blue-600 dark:border-blue-700', 
          bg: 'bg-blue-50 dark:bg-blue-950/30', 
          text: 'text-blue-900 dark:text-blue-200/90' 
        };
      case 'expansion': 
        // Expansion Rules -> Purple tone (Custom semantic)
        return { 
          border: 'border-purple-600 dark:border-purple-700', 
          bg: 'bg-purple-50 dark:bg-purple-950/30', 
          text: 'text-purple-900 dark:text-purple-200/90' 
        };
      case 'warning': 
        // Restrictions -> Error/Red tone
        return { 
            border: 'border-border-error', 
            bg: 'bg-surface-error', 
            text: 'text-content-error' 
        };
      case 'info': 
        // General Info -> Subtle/Gray tone
        return { 
            border: 'border-border-subtle', 
            bg: 'bg-surface-subtle', 
            text: 'text-content-secondary' 
        };
      default:
        return { 
            border: 'border-border-separator', 
            bg: 'bg-surface-card', 
            text: 'text-content-primary' 
        };
    }
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
            {page && <PageReference page={page} manual={manual} className={s.text} />}
          </div>
        </div>
      </div>
      <div className={cls("text-sm leading-loose tracking-wide pl-1 opacity-90", s.text)}>
        <StructuredContentRenderer content={content} />
      </div>
    </section>
  );
};
