import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SetupWizard from './components/SetupWizard';
import { InstallPWA } from './components/InstallPWA';
import { useTheme } from './components/ThemeContext';
import { GameStateProvider } from './components/GameStateContext';
import { UpdatePrompt } from './components/UpdatePrompt';
import { HelpButton } from './components/HelpButton';
import { HelpModal } from './components/HelpModal';

// Global variable injected by Vite at build time
declare const __APP_VERSION__: string;

const App = (): React.ReactElement => {
  const { theme, toggleTheme } = useTheme();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<((reloadPage?: boolean) => Promise<void>) | undefined>();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      import('virtual:pwa-register')
        .then(mod => {
          if (mod && mod.registerSW) {
            const updateSW = mod.registerSW({
              onRegisteredSW(swUrl, r) {
                console.log(`Service Worker at: ${swUrl}`);
                // check for new version every hour
                r && setInterval(async() => {
                  if (!(!r.installing && navigator))
                    return;
          
                  if (('connection' in navigator) && !navigator.onLine)
                    return;
                  
                  const resp = await fetch(swUrl, {
                    cache: 'no-store',
                    headers: {
                      'cache': 'no-store',
                      'cache-control': 'no-cache',
                    },
                  });
          
                  if (resp?.status === 200)
                    await r.update();
                }, 60 * 60 * 1000 /* 1 hour */)
              },
              onNeedRefresh() {
                setNeedRefresh(true);
              },
              onOfflineReady() {
                setOfflineReady(true);
              },
              onRegisterError(error) {
                console.log('SW registration error', error);
              },
            });
            setUpdateServiceWorker(() => updateSW);
          }
        })
        .catch(e => {
          // PWA virtual module doesn't exist in all environments (e.g. preview), this is not critical.
          console.log('PWA registration failed. This is expected in some environments:', e.message);
        });
    }
  }, []);

  const handleForceUpdate = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen font-sans pb-12 transition-colors duration-500 relative">
      {/* Thematic Header */}
      <header className="relative bg-black dark:bg-[#1a1a1a] text-white shadow-2xl mb-8 overflow-hidden border-b-4 border-yellow-600 dark:border-yellow-700/50 transition-colors">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-60 bg-cover bg-center pointer-events-none"
          style={{ 
            backgroundImage: `url('https://cf.geekdo-images.com/Dskyq7T2nAeLSEPqF8FtIw__original/img/iIP5ebitvrm4XfAqdomztVuvxag=/0x0/filters:format(jpeg)/pic6421209.jpg')`,
            filter: 'blur(2px) brightness(0.6)'
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent dark:from-[#1a1a1a]/95 pointer-events-none"></div>

        {/* Content */}
        {/* Added pt-16 to push text down on mobile, clearing the top-right button area */}
        <div className="container mx-auto px-4 pt-16 pb-8 md:py-12 relative z-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-2 font-western tracking-wider drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-yellow-500 dark:text-amber-500">
              Firefly: The Game
            </h1>
            <div className="inline-block border-t-2 border-yellow-700/50 pt-2 px-8">
              <p className="text-yellow-100/90 dark:text-gray-300 font-medium tracking-[0.3em] uppercase text-sm md:text-base">
                Automated Setup Guide
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 relative z-10">
        <GameStateProvider>
          <SetupWizard />
        </GameStateProvider>
      </main>

      {/* Install Prompt */}
      <InstallPWA />

      {/* PWA Updater Prompt */}
      <UpdatePrompt
        offlineReady={offlineReady}
        needRefresh={needRefresh}
        onUpdate={() => updateServiceWorker && updateServiceWorker(true)}
        onClose={() => {
          setOfflineReady(false);
          setNeedRefresh(false);
        }}
      />

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 dark:text-gray-500 text-xs py-8 px-4 border-t border-gray-300 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
        <p className="mb-2 font-western text-firefly-brown dark:text-amber-700/80 text-lg">Keep flying. Stay shiny.</p>
        <p className="max-w-2xl mx-auto opacity-80 dark:opacity-60">
          This is an unofficial fan-made application. 
          Firefly: The Game, its expansions, artwork, and associated trademarks are copyright © Gale Force Nine and 20th Century Fox.
          Authorized use of assets for fan utility.
        </p>
        
        <div className="mt-4 flex justify-center gap-4 opacity-80 dark:opacity-60">
           <a href="https://github.com/pmw57/firefly-automated-setup" target="_blank" rel="noreferrer" className="hover:text-firefly-brown dark:hover:text-amber-500 transition-colors underline">GitHub Project</a>
           <span>•</span>
           <a href="https://boardgamegeek.com/thread/3627152/firefly-automated-setup" target="_blank" rel="noreferrer" className="hover:text-firefly-brown dark:hover:text-amber-500 transition-colors underline">BGG Thread</a>
        </div>

        <div className="mt-4 flex justify-center items-center gap-3 opacity-80 dark:opacity-60">
            <span className="font-mono">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'DEV'}</span>
            <span className="opacity-40">•</span>
            <button 
                onClick={handleForceUpdate} 
                className="underline hover:text-firefly-brown dark:hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                title="Unregister Service Worker and Reload"
            >
                Force Update
            </button>
        </div>
      </footer>

      {/* Portaled UI Elements */}
      {createPortal(
        <div className="fixed top-2 right-2 z-[9999] pointer-events-none flex items-center gap-2">
           <HelpButton onClick={() => setIsHelpModalOpen(true)} />
           <button 
             onClick={toggleTheme}
             className="pointer-events-auto bg-black/60 hover:bg-black/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 backdrop-blur-md text-yellow-400 border-2 border-yellow-600/50 rounded-full p-3 transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer touch-manipulation"
             aria-label="Toggle Theme"
             title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
           >
              {theme === 'dark' ? '☀️' : '🌙'}
           </button>
        </div>,
        document.body
      )}

      {/* Help Modal */}
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;
