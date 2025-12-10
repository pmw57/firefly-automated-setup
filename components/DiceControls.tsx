
import React from 'react';
import { DraftState } from '../types';

interface DiceControlsProps {
  draftState: DraftState | null;
  onRollChange: (index: number, newValue: string) => void;
}

export const DiceControls: React.FC<DiceControlsProps> = ({ draftState, onRollChange }) => {
  if (!draftState) return null;

  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
      {draftState.rolls.map((r, i) => (
        <div 
          key={i} 
          className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 ${r.isWinner ? 'bg-green-100 border-green-500 shadow-md transform scale-105' : 'bg-white border-gray-300'}`}
        >
          <label className="text-xs font-bold text-gray-600 mb-1">{r.player}</label>
          <div className="relative">
            <input 
              type="number" 
              min="1" 
              max="20"
              value={r.roll} 
              onChange={(e) => onRollChange(i, e.target.value)}
              className={`w-16 text-center font-bold text-lg rounded border focus:outline-none focus:ring-2 ${r.isWinner ? 'text-green-900 border-green-400 focus:ring-green-500' : 'text-gray-800 border-gray-300 focus:ring-blue-500'}`}
            />
            {r.isWinner && (
              <div className="absolute -top-3 -right-3 text-lg drop-shadow-sm" title="Highest Roll">👑</div>
            )}
          </div>
        </div>
      ))}
      <div className="w-full text-center mt-2">
         <span className="text-xs text-gray-400 italic">Adjust values above to match physical dice rolls</span>
      </div>
    </div>
  );
};
