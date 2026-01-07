import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';

interface HeaderActionsProps {
  onOpenHelp: () => void;
  onOpenQr: () => void;
}

// Simple SVG icons for the menu items
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1zM4.343 4.343a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414L4.343 5.757a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
);

const QrIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);


export const HeaderActions: React.FC<HeaderActionsProps> = ({ onOpenHelp, onOpenQr }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const buttonClass = "bg-black/60 hover:bg-black/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 backdrop-blur-md text-yellow-400 border-2 border-yellow-600/50";
  const menuBg = isDark ? 'bg-zinc-800/95 border-zinc-700' : 'bg-white/95 border-gray-200';
  const menuItemHover = isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-100';
  const menuItemText = isDark ? 'text-gray-200' : 'text-gray-800';
  const menuItemIcon = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div ref={menuRef} className="relative pointer-events-auto">
      <button
        onClick={handleToggle}
        className={cls(
            buttonClass,
            "rounded-full p-3 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open Actions Menu"
        title="Actions Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={cls(
            "absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in z-50",
            menuBg
          )} 
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            <button role="menuitem" onClick={() => handleAction(toggleTheme)} className={cls("w-full text-left flex items-center gap-3 px-4 py-2 text-sm", menuItemHover, menuItemText)}>
                <span className={menuItemIcon}>{isDark ? <SunIcon /> : <MoonIcon />}</span>
                <span>Change to {isDark ? 'Light' : 'Dark'} Mode</span>
            </button>
            <button role="menuitem" onClick={() => handleAction(onOpenQr)} className={cls("w-full text-left flex items-center gap-3 px-4 py-2 text-sm", menuItemHover, menuItemText)}>
                <span className={menuItemIcon}><QrIcon /></span>
                <span>Mobile Access (QR)</span>
            </button>
            <button role="menuitem" onClick={() => handleAction(onOpenHelp)} className={cls("w-full text-left flex items-center gap-3 px-4 py-2 text-sm", menuItemHover, menuItemText)}>
                <span className={menuItemIcon}><HelpIcon /></span>
                <span>Help & About</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};