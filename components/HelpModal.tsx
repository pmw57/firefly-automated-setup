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

        <div className="p-6 space-y-4 text-sm leading-relaxed">
          <p>
            Welcome, Captain! This tool is a dynamic, offline-first setup guide for the board game{' '}
            <strong className={isDark ? 'text-white' : 'text-black'}>Firefly: The Game</strong>. Its goal is to automate the complex setup process, ensuring you never miss a rule, no matter which combination of expansions, setup cards, or story cards you use.
          </p>

          <div>
            <h3 className={`font-bold text-base font-western mt-4 mb-2 ${isDark ? 'text-amber-500' : 'text-firefly-saddleBrown'}`}>How It Works</h3>
            <p>
              The guide works like a step-by-step wizard. Simply follow the prompts:
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2 pl-2">
              <li><strong>Configure Your Game:</strong> Select your player count and the expansions you're playing with.</li>
              <li><strong>Choose Your Setup:</strong> Pick a Setup Card (e.g., "The Browncoat Way") to define the overall rules.</li>
              <li><strong>Follow the Steps:</strong> The guide will generate a precise sequence of setup steps. It automatically applies all rules from your chosen cards and expansions, resolving any conflicts.</li>
            </ol>
          </div>

          <div>
            <h3 className={`font-bold text-base font-western mt-4 mb-2 ${isDark ? 'text-amber-500' : 'text-firefly-saddleBrown'}`}>Key Features</h3>
            <ul className="list-disc list-inside space-y-2 mt-2 pl-2">
              <li><strong>Comprehensive Rule Engine:</strong> Automatically calculates starting resources, determines active mechanics (like "The Blitz"), and resolves conflicting rules.</li>
              <li><strong>Full Content Support:</strong> Includes all official expansions, setup cards, and story cards (including popular community content).</li>
              <li><strong>Advanced Solo & Campaign Modes:</strong> Full support for both "Classic Solo" and the 10th Anniversary "Flying Solo" variant.</li>
              <li><strong>Offline First (PWA):</strong> Can be installed on your device's home screen and works perfectly without an internet connection.</li>
            </ul>
          </div>

          <p className="pt-4 border-t border-dashed border-gray-300 dark:border-zinc-700">
            This guide is designed to get you into the 'Verse and flying as quickly as possible. Stay shiny!
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
