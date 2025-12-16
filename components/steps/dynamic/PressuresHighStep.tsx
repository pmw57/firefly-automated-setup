
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';
import { useTheme } from '../../ThemeContext';

export const PressuresHighStep: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const dangerTitle = isDark ? 'text-red-300' : 'text-red-800';
  const dangerBorder = isDark ? 'border-red-800' : 'border-red-200';

  return (
    <SpecialRuleBlock source="setupCard" title="The Pressure's High">
      <div className="space-y-4 mt-1">
        <div>
          <strong className={`block mb-1 ${dangerTitle}`}>Alliance Alert</strong>
          <p>Begin the game with one random Alliance Alert Card in play.</p>
        </div>
        <div className={`border-t pt-3 ${dangerBorder}`}>
          <strong className={`block mb-1 ${dangerTitle}`}>Wanted Accumulation</strong>
          <ul className="list-disc ml-5 text-sm">
            <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
            <li><strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.</li>
          </ul>
        </div>
      </div>
    </SpecialRuleBlock>
  );
};
