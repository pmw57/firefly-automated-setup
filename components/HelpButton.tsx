import React from 'react';

interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton: React.FC<HelpButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto bg-black/60 hover:bg-black/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 backdrop-blur-md text-yellow-400 border-2 border-yellow-600/50 rounded-full p-3 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
      aria-label="Open Help Guide"
      title="About This Guide"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </button>
  );
};
