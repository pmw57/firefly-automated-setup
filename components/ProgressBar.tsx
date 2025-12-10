import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  // Ensure we don't divide by zero and clamp percentage
  const percentage = Math.min(100, Math.max(0, total > 0 ? Math.round(((current - 1) / (total - 1)) * 100) : 0));

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold text-green-900">Setup Progress</span>
        <span className="text-sm font-semibold text-green-800">{percentage}% Complete</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner overflow-hidden">
        <div 
          className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="w-full h-full bg-white opacity-20 transform -skew-x-12 origin-left scale-x-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};