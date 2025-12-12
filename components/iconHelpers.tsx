
import React from 'react';
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
      if (meta.themeColor === 'orangeRed') bgColor = 'bg-[#FF4500] border-orange-600';
      if (meta.themeColor === 'steelBlue') bgColor = 'bg-[#4682B4] border-sky-600';
      if (meta.themeColor === 'black') bgColor = 'bg-black border-gray-700';
      if (meta.themeColor === 'darkSlateBlue') bgColor = 'bg-[#483D8B] border-indigo-700';
      if (meta.themeColor === 'deepBrown') bgColor = 'bg-[#231709] border-[#3E2910]';
      if (meta.themeColor === 'rebeccaPurple') bgColor = 'bg-[#663399] border-purple-700';
      if (meta.themeColor === 'cordovan') bgColor = 'bg-[#893f45] border-red-800';
      if (meta.themeColor === 'darkOliveGreen') bgColor = 'bg-[#556b2f] border-lime-800';
      if (meta.themeColor === 'saddleBrown') bgColor = 'bg-[#8b4513] border-orange-800';
      if (meta.themeColor === 'teal') bgColor = 'bg-teal-600 border-teal-700';
      if (meta.themeColor === 'dark') bgColor = 'bg-gray-900 border-gray-700';

      return (
        <div className={`w-full h-full rounded-md flex items-center justify-center border ${bgColor}`} title={meta.label}>
            <span className="text-white font-bold text-xs">{meta.icon.value}</span>
        </div>
      );
  }
};
