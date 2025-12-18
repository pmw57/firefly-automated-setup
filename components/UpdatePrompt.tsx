import React from 'react';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';

interface UpdatePromptProps {
  offlineReady: boolean;
  needRefresh: boolean;
  onUpdate: () => void;
  onClose: () => void;
}

export const UpdatePrompt: React.FC<UpdatePromptProps> = ({ offlineReady, needRefresh, onUpdate, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!offlineReady && !needRefresh) {
    return null;
  }

  const bgClass = isDark ? 'bg-zinc-800' : 'bg-white';
  const borderClass = isDark ? 'border-zinc-700 border-l-blue-500' : 'border-gray-200 border-l-blue-600';
  const titleColor = isDark ? 'text-gray-100' : 'text-gray-800';
  const descColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const dismissColor = isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800';

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:bottom-24 animate-fade-in-up">
      <div className={cls(bgClass, "p-4 rounded-xl shadow-2xl border border-l-4 flex flex-col md:flex-row items-center gap-4 max-w-md ml-auto", borderClass)}>
        <div className="flex-1">
          {needRefresh ? (
            <>
              <h4 className={`font-bold ${titleColor}`}>Update Available</h4>
              <p className={`text-xs mt-1 ${descColor}`}>A new version of the guide is ready. Refresh to get the latest features.</p>
            </>
          ) : (
             <>
              <h4 className={`font-bold ${titleColor}`}>Ready for Offline Use</h4>
              <p className={`text-xs mt-1 ${descColor}`}>This app has been cached and is now available offline.</p>
            </>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {needRefresh && (
            <Button onClick={onUpdate} className="py-2 px-4 text-xs shadow-none">
              Refresh
            </Button>
          )}
          <button 
            onClick={onClose}
            className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${dismissColor}`}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};