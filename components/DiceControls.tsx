






import React from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { DraftState } from '../types/index';
import { useTheme } from './ThemeContext';

interface DiceControlsProps {
  draftState: DraftState | null;
  onRollChange: (index: number, newValue: string) => void;
  onSetWinner: (index: number) => void;
  allowManualOverride?: boolean;
}

export const DiceControls = ({ draftState, onRollChange, onSetWinner, allowManualOverride = false }: DiceControlsProps): React.ReactElement | null => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!draftState) return null;

  // Find the highest roll to identify potential ties visually
  const maxRoll = Math.max(...draftState.rolls.map(r => r.roll));

  const wrapperBg = isDark ? 'bg-black/30' : 'bg-gray-50';
  const wrapperBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
  const hintColor = isDark ? 'text-gray-500' : 'text-gray-600';

  return (
    <div className={`flex flex-wrap gap-4 mb-6 justify-center p-4 rounded-lg border transition-colors ${wrapperBg} ${wrapperBorder}`}>
      {draftState.rolls.map((r, i) => {
        const isMax = r.roll === maxRoll;
        const isWinner = r.isWinner;
        
        let containerStyle = isDark 
            ? "bg-zinc-800 border-zinc-600" 
            : "bg-white border-gray-300";
        let labelStyle = isDark ? "text-gray-400" : "text-gray-600";
        let inputStyle = isDark 
            ? "text-gray-200 border-zinc-500 bg-zinc-700 focus:ring-blue-500" 
            : "text-gray-800 border-gray-300 bg-white focus:ring-blue-500";
        let arrowColor = isDark ? 'text-gray-400' : 'text-gray-700';
        
        if (isWinner) {
            containerStyle = isDark 
                ? "bg-green-900/30 border-green-600 ring-1 ring-green-900" 
                : "bg-green-50 border-green-500 shadow-sm ring-1 ring-green-200";
            labelStyle = isDark ? "text-green-300 font-bold" : "text-green-800 font-bold";
            inputStyle = isDark
                ? "text-green-100 border-green-600 bg-zinc-700 focus:ring-green-500"
                : "text-green-900 border-green-400 bg-white focus:ring-green-500";
            arrowColor = isDark ? 'text-green-300' : 'text-green-800';
        } else if (isMax) {
            // Highlight players who tied for first but aren't currently the winner
            containerStyle = isDark
                ? "bg-amber-900/20 border-amber-700 ring-1 ring-amber-900/30"
                : "bg-amber-50 border-amber-300 ring-1 ring-amber-100";
            labelStyle = isDark ? "text-amber-400 font-semibold" : "text-amber-800 font-semibold";
            arrowColor = isDark ? 'text-amber-400' : 'text-amber-800';
        }

        const tieBreakerBtnClass = isDark
            ? "text-amber-200 bg-amber-900/60 hover:bg-amber-800"
            : "text-amber-700 bg-amber-200 hover:bg-amber-300";

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
            <select 
              id={`draft-roll-${i}`}
              value={r.roll} 
              onChange={(e) => onRollChange(i, e.target.value)}
              aria-label={`Dice roll for ${r.player}`}
              className={`w-16 font-bold text-lg rounded border focus:outline-none focus:ring-2 transition-colors appearance-none pl-5 ${inputStyle}`}
            >
                {[1,2,3,4,5,6].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${arrowColor}`}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          {/* Tie Breaker Action - Only show if Manual Mode is active */}
          {!isWinner && isMax && allowManualOverride && (
              <button 
                type="button"
                onClick={() => onSetWinner(i)}
                className={`mt-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${tieBreakerBtnClass}`}
              >
                Set Winner
              </button>
          )}
        </div>
      )})}
      <div className="w-full text-center mt-2">
         <span className={`text-xs italic ${hintColor}`}>Adjust values to match physical dice. Tap a player's name to resolve ties.</span>
      </div>
    </div>
  );
};