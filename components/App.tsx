
import React from 'react';
import { createPortal } from 'react-dom';
import SetupWizard from './SetupWizard';
import { InstallPWA } from './InstallPWA';
import { useTheme } from './ThemeContext';

// Global variable injected by Vite at build time
declare const __APP_VERSION__: string;

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Firefly Thematic Colors
  const headerBg = isDark ? 'bg-black border-amber-700/50' : 'bg-[#5e1916] border-[#d4af37]';
  const headerTitleColor = isDark ? 'text-amber-500' : 'text-[#f0e6d2]';
  const headerSubtitleColor = isDark ? 'text-zinc-400' : 'text-[#fcd34d]';
  const headerSubtitleBorder = isDark ? 'border-amber-700/50' : 'border-[#d4af37]/50';
  
  const footerBg = isDark ? 'bg-black/40 border-zinc-800' : 'bg-[#e6ddc5] border-[#d6cbb0]';
  const footerText = isDark ? 'text-zinc-500' : 'text-[#5e1916]/80';
  const footerTitle = isDark ? 'text-amber-700/80' : 'text-[#7f1d1d]';

  const toggleBtnBg = isDark ? 'bg-zinc-800/80 hover:bg-zinc-700' : 'bg-[#f0e6d2]/90 hover:bg-white';
  const toggleBtnText = isDark ? 'text-yellow-400' : 'text-[#7f1d1d]';
  const toggleBtnBorder = isDark ? 'border-yellow-600/50' : 'border-[#7f1d1d]/30';

  return (
    <div className="min-h-screen font-sans pb-12 transition-colors duration-500 relative">
      {/* Thematic Header */}
      <header className={`relative shadow-2xl mb-8 overflow-hidden border-b-4 transition-all duration-500 ${headerBg}`}>
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center pointer-events-none transition-opacity duration-500"
          style={{ 
            backgroundImage: `url('https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg')`,
            filter: 'blur(2px) brightness(0.6)',
            opacity: isDark ? 0.6 : 0.4
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 z-10 pointer-events-none transition-all duration-500 ${isDark ? 'bg-gradient-to-t from-black via-black/60 to-transparent' : 'bg-gradient-to-t from-[#5e1916]/90 via-[#5e1916]/70 to-transparent'}`}></div>

        {/* Content */}
        <div className="container mx-auto px-4 pt-16 pb-8 md:py-12 relative z-20">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-2 font-western tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] transition-colors duration-300 ${headerTitleColor}`}>
              Firefly: The Game
            </h1>
            <div className={`inline-block border-t-2 pt-2 px-8 transition-colors duration-300 ${headerSubtitleBorder}`}>
              <p className={`font-medium tracking-[0.3em] uppercase text-sm md:text-base transition-colors duration-300 ${headerSubtitleColor}`}>
                Automated Setup Assistant
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10">
        <SetupWizard />
      </main>

      {/* Install Prompt */}
      <InstallPWA />

      {/* Footer */}
      <footer className={`mt-16 text-center text-xs py-8 px-4 border-t transition-colors duration-300 ${footerBg} ${footerText}`}>
        <p className={`mb-2 font-western text-lg ${footerTitle}`}>Keep flying. Stay shiny.</p>
        <p className="max-w-2xl mx-auto font-medium opacity-80">
          This is an unofficial fan-made application. 
          Firefly: The Game, its expansions, artwork, and associated trademarks are copyright © Gale Force Nine and 20th Century Fox.
          Authorized use of assets for fan utility.
        </p>
        <p className="mt-4 font-mono opacity-60">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'DEV'}</p>
      </footer>

      {/* Theme Toggle */}
      {createPortal(
        <div className="fixed top-2 right-2 z-[9999] pointer-events-none">
           <button 
             onClick={toggleTheme}
             className={`pointer-events-auto backdrop-blur-md border-2 rounded-full p-3 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer touch-manipulation ${toggleBtnBg} ${toggleBtnText} ${toggleBtnBorder}`}
             aria-label="Toggle Theme"
             title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
           >
              {isDark ? '☀️' : '🌙'}
           </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default App;
