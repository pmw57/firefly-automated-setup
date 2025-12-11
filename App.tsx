import React from 'react';
import SetupWizard from './components/SetupWizard';
import { InstallPWA } from './components/InstallPWA';

// Global variable injected by Vite at build time
declare const __APP_VERSION__: string;

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-gradient-to-b from-red-900 to-red-800 text-white py-8 shadow-lg mb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-600 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 font-western tracking-wider drop-shadow-md">
            Firefly: The Game
          </h1>
          <div className="inline-block border-t border-red-400 pt-1">
            <p className="text-red-100 font-medium tracking-widest uppercase text-sm md:text-base">Automated Setup</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <SetupWizard />
      </main>

      {/* Install Prompt */}
      <InstallPWA />

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-400 text-xs py-8 px-4 border-t border-gray-200">
        <p className="mb-2">Keep flying. Stay shiny.</p>
        <p className="max-w-2xl mx-auto opacity-75">
          This is an unofficial fan-made application. 
          Firefly: The Game, its expansions, artwork, and associated trademarks are copyright © Gale Force Nine and 20th Century Fox.
          This tool is not affiliated with or endorsed by the copyright holders.
        </p>
        <p className="mt-4 opacity-50 font-mono">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'DEV'}</p>
      </footer>
    </div>
  );
};

export default App;