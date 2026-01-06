import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { InstallPWA } from './components/InstallPWA';
import { UpdatePrompt } from './components/UpdatePrompt';
import { HelpModal } from './components/HelpModal';
import { QrModal } from './components/QrModal';
import { DevPanel } from './components/DevPanel';
import { HeaderActions } from './components/HeaderActions';
import { FooterQrCode } from './components/FooterQrCode';
import { SHOW_FOOTER_QR_KEY } from './data/constants';
import SetupWizard from './components/SetupWizard';
import { useGameState } from './hooks/useGameState';
import { SetupModeToggle } from './components/SetupModeToggle';
import { OnboardingTooltip } from './components/OnboardingTooltip';

// Global variable injected by Vite at build time
declare const __APP_VERSION__: string;

const App = (): React.ReactElement => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { isStateInitialized, isWizardInitialized } = useGameState();
  
  const [showFooterQr, setShowFooterQr] = useState(() => {
    if (typeof window === 'undefined') return true;
    // Default to showing the QR code unless explicitly dismissed
    return localStorage.getItem(SHOW_FOOTER_QR_KEY) !== 'false';
  });

  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<((reloadPage?: boolean) => Promise<void>) | undefined>();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      import('virtual:pwa-register')
        .then(mod => {
          if (mod && mod.registerSW) {
            const ONE_HOUR_IN_MS = 60 * 60 * 1000;
            const updateSW = mod.registerSW({
              onRegisteredSW(swUrl, r) {
                console.log(`Service Worker at: ${swUrl}`);
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
                }, ONE_HOUR_IN_MS)
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

  const handleForceUpdate = () => {
    if ('serviceWorker' in navigator) {
      // Use promise chaining to ensure unregistration completes before reloading.
      // This prevents a race condition where the document becomes invalid.
      navigator.serviceWorker.getRegistrations()
        .then(registrations => {
          return Promise.all(registrations.map(r => r.unregister()));
        })
        .then(() => {
          console.log('All service workers unregistered for force update.');
          window.location.reload();
        })
        .catch(error => {
          console.error('Error during force update:', error);
          window.location.reload(); // Still reload on error
        });
    } else {
      window.location.reload();
    }
  };

  const handleDismissFooterQr = () => {
    localStorage.setItem(SHOW_FOOTER_QR_KEY, 'false');
    setShowFooterQr(false);
  };

  const isPreview = typeof import.meta.env === 'undefined';
  const isDevMode = !isPreview && import.meta.env.DEV;
  // "Production" is defined as not dev, not a static preview, and not running on localhost.
  const isProdDeployment = !isDevMode && !isPreview && (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname));
  const isAnyModalOpen = isHelpModalOpen || isQrModalOpen;
  const showWizard = isStateInitialized && isWizardInitialized;

  // FIX: Define `baseUrl` to resolve the path for the header image.
  const baseUrl = !isPreview ? import.meta.env.BASE_URL : '/';
  const headerImageUrl = isPreview
    ? 'https://cf.geekdo-images.com/FtTleN6TrwDz378_TQ2NFw__imagepage/img/kytwle1zmoWYFCYtr1cq6EPnRHc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7565930.jpg'
    : `${baseUrl}assets/images/game/firefly-cover.png`;

  return (
    <div className="min-h-screen font-sans pb-12 transition-colors duration-500 relative">
      <header className="relative bg-black text-white shadow-2xl mb-8 overflow-hidden border-b-4 border-yellow-600 dark:border-yellow-700/50 w-full max-w-screen-lg mx-auto">
        <div 
          className="absolute inset-0 z-0 bg-center pointer-events-none bg-no-repeat bg-zoom-mobile sm:bg-cover transform-gpu animate-ken-burns-mobile sm:animate-ken-burns-desktop"
          style={{ 
            backgroundImage: `url('${headerImageUrl}')`,
          }}
        ></div>

        <div className="container mx-auto px-2 sm:px-4 pt-24 pb-4 relative z-20 flex flex-col justify-end items-center">
            {/* Accessible heading, as the visual "Firefly: The Game" is in the background image */}
            <h1 className="sr-only">Firefly: The Game</h1>
            <p className="text-yellow-100/90 dark:text-gray-300 font-medium tracking-[0.3em] uppercase text-sm md:text-base [text-shadow:0_2px_6px_rgba(0,0,0,0.9)]">
                Automated Setup Guide
            </p>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 relative z-10">
        <SetupWizard isDevMode={isDevMode} />
      </main>

      {isProdDeployment && <OnboardingTooltip />}
      
      {isDevMode && <DevPanel />}

      <InstallPWA isModalOpen={isAnyModalOpen} />

      <UpdatePrompt
        offlineReady={offlineReady}
        needRefresh={needRefresh}
        onUpdate={() => updateServiceWorker && updateServiceWorker(true)}
        onClose={() => {
          setOfflineReady(false);
          setNeedRefresh(false);
        }}
      />

      <footer className="mt-16 text-center text-gray-500 dark:text-gray-500 text-sm py-8 px-2 sm:px-4 border-t border-gray-300 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm transition-colors duration-300">
        <p className="mb-2 font-western text-firefly-brown dark:text-amber-700/80 text-lg">Keep flying. Stay shiny.</p>
        <p className="max-w-2xl mx-auto opacity-80 dark:opacity-60 leading-relaxed">
          This is an unofficial fan-made application. 
          Firefly: The Game, its expansions, artwork, and associated trademarks are copyright © Gale Force Nine and 20th Century Fox.
          Authorized use of assets for fan utility.
        </p>
        
        {showFooterQr && <FooterQrCode onDismiss={handleDismissFooterQr} />}
        
        <div className="mt-4 flex justify-center flex-wrap gap-x-4 gap-y-2 opacity-80 dark:opacity-60 text-xs">
           <a href="https://github.com/pmw57/firefly-automated-setup" target="_blank" rel="noreferrer" className="hover:text-firefly-brown dark:hover:text-amber-500 transition-colors underline">GitHub Project</a>
           <span>•</span>
           <a href="https://boardgamegeek.com/thread/3627152/firefly-automated-setup" target="_blank" rel="noreferrer" className="hover:text-firefly-brown dark:hover:text-amber-500 transition-colors underline">BGG Thread</a>
        </div>

        <div className="mt-4 flex justify-center items-center gap-3 opacity-80 dark:opacity-60 text-xs">
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

      {createPortal(
        <div className="fixed top-2 right-2 z-[9999] pointer-events-auto flex flex-col items-end gap-2">
           {showWizard && <SetupModeToggle />}
           <HeaderActions 
             onOpenHelp={() => setIsHelpModalOpen(true)}
             onOpenQr={() => setIsQrModalOpen(true)}
           />
        </div>,
        document.body
      )}

      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <QrModal 
        isOpen={isQrModalOpen} 
        onClose={() => {
          setIsQrModalOpen(false);
          // Re-check preference when modal closes, in case it was changed
          setShowFooterQr(localStorage.getItem(SHOW_FOOTER_QR_KEY) !== 'false');
        }}
      />
    </div>
  );
};

export default App;