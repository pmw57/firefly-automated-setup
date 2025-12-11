import { Expansions } from '../types';
import { EXPANSIONS_METADATA, SPRITE_SHEET_URL } from '../constants';

export const getExpansionIcon = (id?: keyof Expansions | string) => {
  if (!id) return null;
  const meta = EXPANSIONS_METADATA.find(e => e.id === id);
  if (!meta) return null;

  if (meta.icon.type === 'sprite') {
      return (
        <div 
          style={{ 
            backgroundImage: `url("${SPRITE_SHEET_URL}")`,
            backgroundSize: '600% auto', 
            backgroundRepeat: 'no-repeat',
            backgroundPosition: meta.icon.value,
            width: '100%',
            height: '100%'
          }} 
          className="rounded-md" 
          title={meta.label} 
        />
      );
  } else {
      let bgColor = 'bg-gray-700 border-gray-500';
      if (meta.themeColor === 'purple') bgColor = 'bg-purple-700 border-purple-500';
      if (meta.themeColor === 'yellow') bgColor = 'bg-yellow-600 border-yellow-500';
      if (meta.themeColor === 'dark') bgColor = 'bg-gray-900 border-gray-700';
      if (meta.themeColor === 'paleGreen') bgColor = 'bg-green-500 border-green-600';
      if (meta.themeColor === 'firebrick') bgColor = 'bg-red-800 border-red-900';
      if (meta.themeColor === 'khaki') bgColor = 'bg-amber-400 border-amber-500';
      if (meta.themeColor === 'cornflower') bgColor = 'bg-indigo-400 border-indigo-500';
      if (meta.themeColor === 'brown') bgColor = 'bg-orange-800 border-orange-900';
      if (meta.themeColor === 'teal') bgColor = 'bg-teal-600 border-teal-700';
      if (meta.themeColor === 'cyan') bgColor = 'bg-cyan-500 border-cyan-600';

      return (
        <div className={`w-full h-full rounded-md flex items-center justify-center border ${bgColor}`} title={meta.label}>
            <span className="text-white font-bold text-xs">{meta.icon.value}</span>
        </div>
      );
  }
};