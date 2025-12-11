import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:bottom-4 animate-fade-in-up">
      <div className="bg-white p-4 rounded-xl shadow-2xl border border-gray-200 border-l-4 border-l-green-600 flex flex-col md:flex-row items-center gap-4 max-w-md ml-auto">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">Install App</h4>
          <p className="text-xs text-gray-600 mt-1">Add to home screen for offline access.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={() => setIsVisible(false)}
                className="px-3 py-2 text-xs text-gray-500 hover:text-gray-800 font-bold uppercase tracking-wider"
            >
                Dismiss
            </button>
            <Button onClick={handleInstallClick} className="py-2 px-4 text-xs shadow-none">
                Install
            </Button>
        </div>
      </div>
    </div>
  );
};