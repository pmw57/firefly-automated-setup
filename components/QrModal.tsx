import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from './ThemeContext';
import { Button } from './Button';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { SHOW_FOOTER_QR_KEY, ONLINE_BASE_URL } from '../data/constants';

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

/**
 * Returns manual installation instructions for mobile platforms if applicable.
 */
const getManualInstallGuide = (): string | null => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return null;

    const ua = navigator.userAgent;
    const isStandalone = 'standalone' in (window.navigator as NavigatorWithStandalone) && (window.navigator as NavigatorWithStandalone).standalone === true;

    if (isStandalone) return null; // Don't show if already in standalone mode.

    const isIOS = /iPad|iPhone|iPod/.test(ua);
    if (isIOS) {
        return "To install on an iPhone or iPad, tap the Share button and then 'Add to Home Screen'.";
    }

    // A broader check for other mobile devices (like Android on Firefox)
    const isMobile = /Mobi|Android/i.test(ua);
    if (isMobile) {
         return "To install, look for an 'Add to Home Screen' or 'Install' option in your browser's menu.";
    }
    
    return null;
};

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  const { canInstall, install } = usePwaInstall();
  const [manualInstallGuide, setManualInstallGuide] = useState<string | null>(null);

  const [showInFooter, setShowInFooter] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(SHOW_FOOTER_QR_KEY) !== 'false';
  });

  useEffect(() => {
    if (isOpen) {
        setManualInstallGuide(getManualInstallGuide());
    }
  }, [isOpen]);

  const handleToggleShowInFooter = () => {
    const newValue = !showInFooter;
    setShowInFooter(newValue);
    localStorage.setItem(SHOW_FOOTER_QR_KEY, String(newValue));
  };

  const isPreview = typeof import.meta.env === 'undefined';
  const baseUrl = !isPreview ? import.meta.env.BASE_URL : ONLINE_BASE_URL;
  const qrCodeUrl = `${baseUrl}images/branding/qrcode.png`;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy Link'), 2000);
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      setCopyButtonText('Copy Failed');
      setTimeout(() => setCopyButtonText('Copy Link'), 2000);
    });
  };

  const handleInstallClick = async () => {
    await install();
    // Close the modal after triggering the install prompt for a smoother UX
    onClose();
  };

  if (!isOpen) {
    return null;
  }
  
  const showInstallSection = canInstall || manualInstallGuide;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-sm rounded-xl shadow-2xl border transition-colors duration-300 animate-fade-in-up ${isDark ? 'bg-zinc-900 border-zinc-700 text-gray-300' : 'bg-firefly-parchment-bg border-firefly-parchment-border text-firefly-parchment-text'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'}`}>
          <h2 id="qr-modal-title" className={`text-2xl font-bold font-western text-center ${isDark ? 'text-amber-400' : 'text-firefly-brown'}`}>
            Mobile Access
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

        <div className="p-6 text-center">
          <p className="mb-4">Scan this QR code with your mobile device to open this guide.</p>
          <div className="bg-white p-2 rounded-lg inline-block shadow-md">
            <img src={qrCodeUrl} alt="QR Code" width="256" height="256" />
          </div>
          <p className="text-xs mt-4 opacity-70">Useful for playing at the table!</p>
        </div>

        {showInstallSection && (
          <div className={`px-6 pb-6 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'}`}>
              <div className="flex items-center gap-3 mt-4 mb-2">
                  <span className="text-xl">🚀</span>
                  <h3 className={`font-bold text-base ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Install App</h3>
              </div>
              <p className="text-sm opacity-80 mb-4">
                {canInstall 
                  ? "Add to home screen for offline access and a native experience."
                  : manualInstallGuide
                }
              </p>
              {canInstall && (
                <Button onClick={handleInstallClick} fullWidth>
                    Install Firefly Setup
                </Button>
              )}
          </div>
        )}
        
        <div className={`px-6 py-4 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'}`}>
          <label htmlFor="show-in-footer-toggle" className="flex justify-between items-center cursor-pointer group">
              <span className="text-sm font-medium">Show QR code in footer</span>
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${showInFooter ? 'bg-green-600' : (isDark ? 'bg-zinc-700' : 'bg-gray-200')} group-hover:ring-2 ${isDark ? 'group-hover:ring-zinc-600' : 'group-hover:ring-gray-300'}`}>
                  <span
                      className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out absolute top-1 ${showInFooter ? 'translate-x-6' : 'translate-x-1'}`}
                  />
              </div>
              <input id="show-in-footer-toggle" type="checkbox" className="sr-only" checked={showInFooter} onChange={handleToggleShowInFooter} />
          </label>
        </div>

        <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'} flex justify-between`}>
          <Button onClick={handleCopyLink} variant="secondary">
            {copyButtonText}
          </Button>
           <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};