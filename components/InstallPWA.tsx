
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  const bgClass = isDark ? 'bg-zinc-800' : 'bg-white';
  const borderClass = isDark ? 'border-zinc-700 border-l-green-500' : 'border-gray-200 border-l-green-600';
  const titleColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const descColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const dismissColor = isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800';

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:bottom-4 animate-fade-in-up">
      <div className={`${bgClass} p-4 rounded-xl shadow-2xl border ${borderClass} border-l-4 flex flex-col md:flex-row items-center gap-4 max-w-md ml-auto`}>
        <div className="flex-1">
          <h4 className={`font-bold ${titleColor}`}>Install App</h4>
          <p className={`text-xs mt-1 ${descColor}`}>Add to home screen for offline access.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <button 
                onClick={() => setIsVisible(false)}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${dismissColor}`}
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
