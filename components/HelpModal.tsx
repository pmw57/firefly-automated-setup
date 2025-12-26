import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus management
      modalRef.current?.focus();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border transition-colors duration-300 animate-fade-in-up custom-scrollbar ${isDark ? 'bg-zinc-900 border-zinc-700 text-gray-300' : 'bg-firefly-parchment-bg border-firefly-parchment-border text-firefly-parchment-text'}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
      >
        <div className={`sticky top-0 p-6 border-b z-10 ${isDark ? 'bg-zinc-900/80 border-zinc-800 backdrop-blur-sm' : 'bg-firefly-parchment-bg/80 border-firefly-parchment-border backdrop-blur-sm'}`}>
          <h2 id="help-modal-title" className={`text-2xl font-bold font-western ${isDark ? 'text-amber-400' : 'text-firefly-brown'}`}>
            About This Guide
          </h2>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'text-gray-400 hover:bg-zinc-700' : 'text-gray-500 hover:bg-gray-200'}`}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 text-lg leading-loose tracking-wide">
          <p>This guide helps you set up the board game <strong className={isDark ? 'text-white' : 'text-black'}>Firefly: The Game</strong>.</p>
          <p>It creates a simple checklist for you to follow. The list changes based on the expansions and cards you choose, so you always have the right rules.</p>
          
          <div>
            <h3 className={`font-bold text-xl font-western mt-8 mb-4 ${isDark ? 'text-amber-500' : 'text-firefly-saddleBrown'}`}>Main Features</h3>
            <ul className="list-disc list-inside space-y-8 mt-2 pl-2">
              <li>
                <strong>Smart Rules</strong>
                <span className="block mt-1 opacity-90">
                  The guide does the math for you. It calculates your <strong>starting money, jobs, and gear</strong>. It also fixes rule conflicts, so you can focus on playing.
                </span>
              </li>
              <li>
                <strong>Thematic Interface</strong>
                <span className="block mt-1 opacity-90">
                  Choose your look. Switch between a <strong>light parchment theme</strong> and a <strong>dark starfield theme</strong> using the button at the top-right.
                </span>
              </li>
              <li>
                <strong>All Content Included</strong>
                <span className="block mt-1 opacity-90">
                  Supports <strong>all official expansions</strong> and story cards, including community content.
                </span>
              </li>
              <li>
                <strong>Solo and Campaign</strong>
                <span className="block mt-1 opacity-90">
                  Play by yourself. Full support for <strong>solo modes</strong> and the <strong>10th Anniversary campaign rules</strong>.
                </span>
              </li>
              <li>
                <strong>Works Offline</strong>
                <span className="block mt-1 opacity-90">
                  Use it anywhere. You can <strong>save this app</strong> to your device and it will work perfectly <strong>without an internet connection</strong>.
                </span>
              </li>
            </ul>
          </div>

          <p className="pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
            This guide helps you start playing faster.
            <br />
            Stay shiny!
          </p>
        </div>

        <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'} text-right`}>
          <Button onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};