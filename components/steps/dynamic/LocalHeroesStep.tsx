import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const LocalHeroesStep = (): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headerColor = isDark ? 'text-emerald-400' : 'text-emerald-800';

  return (
    <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
        <h4 className={cls("font-bold text-lg mb-2", headerColor)}>Local Heroes Bonuses</h4>
        <ul className={cls("list-disc list-inside space-y-2", textColor)}>
            <li>
                <strong>Shore Leave:</strong> At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.
            </li>
            <li>
                <strong>Home Field Advantage:</strong> When you proceed while Misbehaving in the same System as your Haven, take <strong>$100</strong>.
            </li>
        </ul>
    </div>
  );
};