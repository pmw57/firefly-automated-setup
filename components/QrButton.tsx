import React from 'react';

interface QrButtonProps {
  onClick: () => void;
}

export const QrButton: React.FC<QrButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto bg-black/60 hover:bg-black/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 backdrop-blur-md text-yellow-400 border-2 border-yellow-600/50 rounded-full p-3 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
      aria-label="Show QR Code for mobile access"
      title="Mobile Access"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    </button>
  );
};
