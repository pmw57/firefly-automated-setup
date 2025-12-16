import React from 'react';
import { Button } from './Button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border-t-8 border-red-800">
        <div className="text-6xl mb-4">💥</div>
        <h1 className="text-2xl font-bold text-gray-800 font-western mb-2">Primary Buffer Panel Just Fell Off</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong with the setup guide. It might be a gorram glitch in the Cortex.
        </p>
        <div className="bg-gray-100 p-3 rounded text-left text-xs text-red-700 font-mono mb-6 overflow-auto max-h-32">
          {error.message}
        </div>
        <Button onClick={resetErrorBoundary} fullWidth>
          Reboot System
        </Button>
      </div>
    </div>
  );
};
