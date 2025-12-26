
import React from 'react';
import { useTheme } from './ThemeContext';

interface FooterQrCodeProps {
  onDismiss: () => void;
}

export const FooterQrCode: React.FC<FooterQrCodeProps> = ({ onDismiss }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isPreview = typeof import.meta.env === 'undefined';
  const baseUrl = !isPreview ? import.meta.env.BASE_URL : '/';
  const qrCodeUrl = `${baseUrl}assets/images/branding/qrcode.png`;

  const containerBg = isDark ? 'bg-zinc-800/50' : 'bg-white/50';
  const containerBorder = isDark ? 'border-zinc-700' : 'border-gray-300';

  return (
    <div className={`relative p-4 rounded-lg border ${containerBg} ${containerBorder} max-w-xs mx-auto my-8 animate-fade-in`}>
      <button
        onClick={onDismiss}
        className={`absolute -top-3 -right-3 p-1 rounded-full transition-colors ${isDark ? 'text-gray-400 bg-zinc-900 hover:bg-zinc-700' : 'text-gray-500 bg-white hover:bg-gray-200'} border ${containerBorder}`}
        aria-label="Dismiss QR Code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex items-center gap-4">
        <div className="bg-white p-1 rounded-md inline-block shadow-sm shrink-0">
          <img src={qrCodeUrl} alt="QR Code" width="80" height="80" />
        </div>
        <div>
          <h4 className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Mobile Access</h4>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Scan to open this guide on your phone or tablet.</p>
        </div>
      </div>
    </div>
  );
};
