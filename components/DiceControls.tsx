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
    <div className="flex flex-wrap gap-4 mb-6 justify-center bg-gray-50 p-4 rounded-lg border border-gray-200">
      {draftState.rolls.map((r, i) => {
        const isMax = r.roll === maxRoll;
        const isWinner = r.isWinner;
        
        let containerStyle = "bg-white border-gray-300";
        let labelStyle = "text-gray-600";
        
        if (isWinner) {
            containerStyle = "bg-green-50 border-green-500 shadow-sm ring-1 ring-green-200";
            labelStyle = "text-green-800 font-bold";
        } else if (isMax) {
            // Highlight players who tied for first but aren't currently the winner
            containerStyle = "bg-amber-50 border-amber-300 ring-1 ring-amber-100";
            labelStyle = "text-amber-800 font-semibold";
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
              className={`w-16 text-center font-bold text-lg rounded border focus:outline-none focus:ring-2 ${isWinner ? 'text-green-900 border-green-400 focus:ring-green-500' : 'text-gray-800 border-gray-300 focus:ring-blue-500'}`}
            />
          </div>
          
          {/* Tie Breaker Action - Only show if Manual Mode is active */}
          {!isWinner && isMax && allowManualOverride && (
              <button 
                type="button"
                onClick={() => onSetWinner(i)}
                className="mt-2 text-[10px] uppercase font-bold text-amber-700 bg-amber-200 px-2 py-0.5 rounded hover:bg-amber-300 transition-colors"
              >
                Set Winner
              </button>
          )}
        </div>
      )})}
      <div className="w-full text-center mt-2">
         <span className="text-xs text-gray-400 italic">Adjust values to match physical dice. Tap a player's name to resolve ties.</span>
      </div>
    </div>
  );
};