import React from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { StructuredContent, StructuredContentPart } from '../types';
import { expansionColorConfig, specialColorConfig } from '../data/themeColors';

interface StructuredContentRendererProps {
  content: StructuredContent;
}

export const StructuredContentRenderer: React.FC<StructuredContentRendererProps> = ({ content }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderParts = (contentParts: StructuredContent): React.ReactNode => {
    return contentParts.map((part: StructuredContentPart, index: number) => {
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
          return <p key={index} className="my-1">{renderParts(part.content)}</p>;
        case 'list':
          return <ul key={index} className="list-disc ml-5 space-y-2 mt-1">{part.items.map((item, i) => <li key={i}>{renderParts(item)}</li>)}</ul>;
        case 'numbered-list':
          return <ol key={index} className="list-decimal ml-5 space-y-2 mt-1">{part.items.map((item, i) => <li key={i}>{renderParts(item)}</li>)}</ol>;
        case 'warning-box':
          return <div key={index} className="text-red-700 dark:text-red-400 italic font-bold text-xs mt-1 border-l-2 border-red-500 pl-2 py-1 bg-red-500/5">{renderParts(part.content)}</div>;
        case 'sub-list':
          return (
            <ul key={index} className="list-disc ml-5 grid grid-cols-2 gap-x-4 text-sm font-medium my-2">
              {part.items.map(item => {
                const styles = (item.color in specialColorConfig)
                    ? specialColorConfig[item.color as keyof typeof specialColorConfig]
                    : expansionColorConfig[item.color as keyof typeof expansionColorConfig];
                
                let colorClass = styles
                    ? (isDark ? styles.dark.badge : styles.light.badge).split(' ').find(c => c.startsWith('text-'))
                    : (isDark ? 'text-gray-300' : 'text-gray-800');

                if (item.color === 'black' && !isDark) {
                    colorClass = 'text-gray-700'; // Use a dark gray to represent dimGray on light backgrounds
                }

                return (
                    <li key={item.ship}>
                        <strong className={cls(colorClass)}>{item.ship}</strong>
                    </li>
                );
              })}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  return <>{renderParts(content)}</>;
};