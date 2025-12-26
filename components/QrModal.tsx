import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from './ThemeContext';
import { Button } from './Button';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');

  const isPreview = typeof import.meta.env === 'undefined';
  const baseUrl = !isPreview ? import.meta.env.BASE_URL : '/';
  const qrCodeUrl = `${baseUrl}assets/images/branding/qrcode.png`;

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

  if (!isOpen) {
    return null;
  }

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

        <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'} text-right`}>
          <Button onClick={handleCopyLink} variant="secondary">
            {copyButtonText}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
