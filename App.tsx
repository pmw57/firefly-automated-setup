import React from 'react';
import SetupWizard from './components/SetupWizard';
import { InstallPWA } from './components/InstallPWA';

// Global variable injected by Vite at build time
declare const __APP_VERSION__: string;

const App: React.FC = () => {
  return (
    <div className="min-h-screen text-gray-800 font-sans pb-12">
      {/* Thematic Header */}
      <header className="relative bg-black text-white shadow-2xl mb-8 overflow-hidden border-b-4 border-yellow-600">
        {/* Background Image Layer (Placeholder for Ship Art) */}
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg')`,
            filter: 'blur(2px) brightness(0.6)'
          }}
        ></div>
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="container mx-auto px-4 py-12 text-center relative z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 font-western tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-yellow-500">
            Firefly: The Game
          </h1>
          <div className="inline-block border-t-2 border-yellow-700/50 pt-2 px-8">
            <p className="text-yellow-100/90 font-medium tracking-[0.3em] uppercase text-sm md:text-base">
              Automated Setup Assistant
            </p>
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
      <footer className="mt-16 text-center text-gray-400 text-xs py-8 px-4 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <p className="mb-2 font-western text-yellow-600/80 text-lg">Keep flying. Stay shiny.</p>
        <p className="max-w-2xl mx-auto opacity-60">
          This is an unofficial fan-made application. 
          Firefly: The Game, its expansions, artwork, and associated trademarks are copyright © Gale Force Nine and 20th Century Fox.
          Authorized use of assets for fan utility.
        </p>
        <p className="mt-4 opacity-40 font-mono">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'DEV'}</p>
      </footer>
    </div>
  );
};

export default App;