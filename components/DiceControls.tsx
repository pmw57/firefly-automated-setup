import React from 'react';
import { DraftState } from '../types';

interface DiceControlsProps {
  draftState: DraftState | null;
  onRollChange: (index: number, newValue: string) => void;
  onSetWinner: (index: number) => void;
  allowManualOverride?: boolean;
}

export const DiceControls: React.FC<DiceControlsProps> = ({ draftState, onRollChange, onSetWinner, allowManualOverride = false }) => {
  if (!draftState) return null;

  // Find the highest roll to identify potential ties visually
  const maxRoll = Math.max(...draftState.rolls.map(r => r.roll));

  return (
    <div className="flex flex-wrap gap-4 mb-6 justify-center bg-gray-50 dark:bg-black/30 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
      {draftState.rolls.map((r, i) => {
        const isMax = r.roll === maxRoll;
        const isWinner = r.isWinner;
        
        let containerStyle = "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600";
        let labelStyle = "text-gray-600 dark:text-gray-400";
        
        if (isWinner) {
            containerStyle = "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 shadow-sm ring-1 ring-green-200 dark:ring-green-900";
            labelStyle = "text-green-800 dark:text-green-300 font-bold";
        } else if (isMax) {
            // Highlight players who tied for first but aren't currently the winner
            containerStyle = "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 ring-1 ring-amber-100 dark:ring-amber-900/30";
            labelStyle = "text-amber-800 dark:text-amber-400 font-semibold";
        }

        return (
        <div 
          key={i} 
          className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${containerStyle}`}
        >
          <button
             type="button"
             onClick={() => allowManualOverride && onSetWinner(i)}
             disabled={!allowManualOverride}
             className={`text-xs mb-2 focus:outline-none ${labelStyle} ${allowManualOverride ? 'cursor-pointer hover:underline' : 'cursor-default'}`}
             title={isWinner ? "Current Winner" : allowManualOverride ? "Click to declare Winner" : "Auto-determined"}
          >
            {r.player} {isWinner && '👑'}
          </button>
          
          <div className="relative">
            <input 
              id={`draft-roll-${i}`}
              type="number" 
              min="1" 
              max="6"
              value={r.roll} 
              onChange={(e) => onRollChange(i, e.target.value)}
              className={`w-16 text-center font-bold text-lg rounded border focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 transition-colors ${isWinner ? 'text-green-900 dark:text-green-100 border-green-400 dark:border-green-600 focus:ring-green-500' : 'text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-500 focus:ring-blue-500'}`}
            />
          </div>
          
          {/* Tie Breaker Action - Only show if Manual Mode is active */}
          {!isWinner && isMax && allowManualOverride && (
              <button 
                type="button"
                onClick={() => onSetWinner(i)}
                className="mt-2 text-[10px] uppercase font-bold text-amber-700 dark:text-amber-200 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded hover:bg-amber-300 dark:hover:bg-amber-800 transition-colors"
              >
                Set Winner
              </button>
          )}
        </div>
      )})}
      <div className="w-full text-center mt-2">
         <span className="text-xs text-gray-400 dark:text-gray-500 italic">Adjust values to match physical dice. Tap a player's name to resolve ties.</span>
      </div>
    </div>
  );
};