import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

interface OverrideModalProps {
  affectedStepLabels: string[];
  onContinue: () => void;
  onJump: () => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({ affectedStepLabels, onContinue, onJump }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onContinue(); // Default to continue on escape
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus(); // Focus the modal for accessibility
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onContinue]);
  
  const modalBg = isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-firefly-parchment-bg border-firefly-parchment-border';
  const modalText = isDark ? 'text-gray-300' : 'text-firefly-parchment-text';
  const modalHeader = isDark ? 'text-amber-400' : 'text-firefly-brown';
  const listBg = isDark ? 'bg-black/20' : 'bg-amber-50/50';

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="override-modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full max-w-lg rounded-xl shadow-2xl border transition-colors duration-300 animate-fade-in-up ${modalBg}`}
      >
        <div className={`p-6 text-center border-b ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'}`}>
            <div className="text-4xl mb-3" role="img" aria-label="Warning icon">⚠️</div>
            <h2 id="override-modal-title" className={`text-2xl font-bold font-western ${modalHeader}`}>
                Setup Changes Detected!
            </h2>
        </div>

        <div className={`p-6 ${modalText}`}>
            <p className="mb-4 text-center">The selected Story Card has rules that affect setup steps you've already passed:</p>
            <div className={`p-3 rounded-lg ${listBg}`}>
                <ul className="list-disc list-inside space-y-1 text-sm font-bold text-center">
                    {affectedStepLabels.map(label => (
                        <li key={label}>{label}</li>
                    ))}
                </ul>
            </div>
            <p className="text-xs text-center mt-4 opacity-70">
                Check the progress bar for <span className="text-yellow-500 font-bold">amber icons</span> to see all affected steps.
            </p>
        </div>
        
        <div className={`p-4 border-t ${isDark ? 'border-zinc-800' : 'border-firefly-parchment-border'} flex flex-col-reverse sm:flex-row gap-3 justify-end`}>
            <Button onClick={onJump} variant="secondary" fullWidth className="sm:w-auto">
                Go to First Change
            </Button>
            <Button onClick={onContinue} fullWidth className="sm:w-auto">
                Acknowledge & Continue
            </Button>
        </div>
      </div>
    </div>
  );
};