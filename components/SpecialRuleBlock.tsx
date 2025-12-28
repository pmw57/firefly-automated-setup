
import React from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { StructuredContent, StructuredContentPart } from '../types/index';

interface SpecialRuleBlockProps {
  source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
  title?: string;
  content: StructuredContent;
  page?: string | number;
  manual?: string;
}

const renderContent = (content: StructuredContent): React.ReactNode => {
  return content.map((part: StructuredContentPart, index: number) => {
    if (typeof part === 'string') {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }

    switch (part.type) {
      case 'strong':
        return <strong key={index}>{part.content}</strong>;
      case 'action':
        return <strong key={index}>{part.content}</strong>;
      case 'br':
        return <br key={index} />;
      case 'paragraph':
        return <p key={index} className="my-1">{renderContent(part.content)}</p>;
      case 'list':
        return <ul key={index} className="list-disc ml-5 space-y-2 mt-1">{part.items.map((item, i) => <li key={i}>{renderContent(item)}</li>)}</ul>;
      case 'numbered-list':
        return <ol key={index} className="list-decimal ml-5 space-y-2 mt-1">{part.items.map((item, i) => <li key={i}>{renderContent(item)}</li>)}</ol>;
      case 'warning-box':
        return <div key={index} className="text-red-700 dark:text-red-400 italic font-bold text-xs mt-1 border-l-2 border-red-500 pl-2 py-1 bg-red-500/5">{renderContent(part.content)}</div>;
      case 'sub-list':
        return <ul key={index} className="list-disc ml-5 grid grid-cols-2 gap-x-4 text-sm font-medium my-2">{part.items.map(item => <li key={item.ship}><strong>{item.ship}</strong></li>)}</ul>
      default:
        return null;
    }
  });
};

export const SpecialRuleBlock: React.FC<SpecialRuleBlockProps> = ({ source, title, content, page, manual }) => {
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
      switch(source) {
        case 'story': return { border: 'border-[#b45309]', bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
        case 'setupCard': return { border: 'border-[#1e40af]', bg: 'bg-[#eff6ff]', text: 'text-[#1e3a8a]' };
        case 'expansion': return { border: 'border-[#7e22ce]', bg: 'bg-[#faf5ff]', text: 'text-[#6b21a8]' };
        case 'warning': return { border: 'border-[#b91c1c]', bg: 'bg-[#fef2f2]', text: 'text-[#991b1b]' };
        case 'info': return { border: 'border-[#78716c]', bg: 'bg-[#f5f5f4]', text: 'text-[#44403c]' };
      }
    }
    return { border: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  const icons = { story: '📜', setupCard: '⚙️', expansion: '🧩', warning: '⚠️', info: 'ℹ️' };
  const labels = { story: 'Story Override', setupCard: 'Setup Card Override', expansion: 'Expansion Rule', warning: 'Restriction', info: 'Information' };
  const s = getStyles();

  return (
    <div className={cls("border-l-4 p-4 rounded-r-xl shadow-sm mb-4 transition-all hover:shadow-md backdrop-blur-sm animate-fade-in-up", s.border, s.bg)}>
      <div className="flex items-start mb-2">
        <span className="text-xl mr-3 mt-0.5 select-none opacity-80">{icons[source]}</span>
        <div className="flex-1">
          <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
              <div>
                <span className={cls("text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-0.5", s.text)}>
                  {labels[source]}
                </span>
                {title && <h4 className={cls("font-bold text-base leading-tight", s.text)}>{title}</h4>}
              </div>
            </div>
            {page && <PageReference page={page} manual={manual} />}
          </div>
        </div>
      </div>
      <div className={cls("text-sm leading-loose tracking-wide pl-1 opacity-90", s.text)}>
        {renderContent(content)}
      </div>
    </div>
  );
};