
import React from 'react';
import { useTheme } from './ThemeContext';

export const IconDevPanel: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const icons = [
    {
      id: 'iso-standard',
      label: 'Standard Iso',
      desc: 'Classic isometric line art.',
      path: (
        <>
           <path d="M12 4L4 9l8 5 8-5-8-5zM4 9v6l8 5 8-5V9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
           <path d="M12 14v6" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    },
    {
      id: 'iso-filled',
      label: 'Solid Fill',
      desc: 'Uses opacity to create depth.',
      path: (
        <>
           <path d="M12 3L3 8l9 5 9-5-9-5z" fill="currentColor" fillOpacity="0.5"/>
           <path d="M3 8v8l9 5V13L3 8z" fill="currentColor" fillOpacity="0.8"/>
           <path d="M12 13v8l9-5V8l-9 5z" fill="currentColor" fillOpacity="1.0"/>
        </>
      )
    },
    {
      id: 'iso-open',
      label: 'Open Lid',
      desc: 'Box bottom with lid floating above.',
      path: (
        <>
           {/* Lid */}
           <path d="M12 2L4 6l8 4 8-4-8-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M4 6v2l8 4 8-4V6" fill="none" stroke="currentColor" strokeWidth="1"/>
           {/* Base */}
           <path d="M12 12l-8 4v5l8 4 8-4v-5l-8-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 16v9" stroke="currentColor" strokeWidth="1.5"/>
        </>
      )
    },
    {
      id: 'iso-logo',
      label: 'Box + Ship',
      desc: 'Iso box with a simple ship curve on top.',
      path: (
        <>
           <path d="M12 4L4 9l8 5 8-5-8-5zM4 9v6l8 5 8-5V9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
           <path d="M12 14v6" stroke="currentColor" strokeWidth="2"/>
           {/* Ship Curve */}
           <path d="M7 10c1-2 4-3 5-3s4 1 5 3" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-15 12 9)"/>
        </>
      )
    },
    {
      id: 'iso-star',
      label: 'Box + Star',
      desc: 'Iso box with the Independent Star.',
      path: (
        <>
           <path d="M12 4L4 9l8 5 8-5-8-5zM4 9v6l8 5 8-5V9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
           <path d="M12 14v6" stroke="currentColor" strokeWidth="2"/>
           {/* Star */}
           <path d="M12 11l-1.5-4h3L12 11z" fill="currentColor" transform="scale(0.8) translate(3 6)"/>
        </>
      )
    },
    {
      id: 'iso-thick',
      label: 'Big Box',
      desc: 'Taller vertical dimension.',
      path: (
        <>
           <path d="M12 2L3 7l9 5 9-5-9-5z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M3 7v10l9 5 9-5V7" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 12v10" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    },
    {
      id: 'iso-stack',
      label: 'Stack',
      desc: 'Two boxes stacked together.',
      path: (
        <>
           {/* Bottom Box */}
           <path d="M12 13l-8 4v4l8 4 8-4v-4l-8-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 17v4" stroke="currentColor" strokeWidth="2"/>
           {/* Top Box */}
           <path d="M12 3L4 7l8 4 8-4-8-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M4 7v4l8 4 8-4V7" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 11v4" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    },
    {
      id: 'iso-cards',
      label: 'Components',
      desc: 'Box with a card sticking out.',
      path: (
        <>
           {/* Card Back */}
           <path d="M14 6l-6 3v4l6-3V6z" fill="currentColor" opacity="0.6"/>
           {/* Box Fronts */}
           <path d="M20 9l-8 5-8-5v6l8 5 8-5V9z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 14v6" stroke="currentColor" strokeWidth="2"/>
           {/* Box Top Rim Back */}
           <path d="M4 9l8-5 8 5" fill="none" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    },
    {
      id: 'iso-minimal',
      label: 'Minimal',
      desc: 'Geometric abstraction.',
      path: (
        <>
           <path d="M12 12v10M12 12L3 7M12 12l9-5" stroke="currentColor" strokeWidth="2"/>
           <path d="M3 7l9-5 9 5v10l-9 5-9-5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        </>
      )
    },
    {
      id: 'iso-wide',
      label: 'Wide Flat',
      desc: 'Flattened perspective.',
      path: (
        <>
           <path d="M12 6L2 10l10 4 10-4-10-4z" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M2 10v5l10 4 10-4v-5" fill="none" stroke="currentColor" strokeWidth="2"/>
           <path d="M12 14v5" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    }
  ];

  // Neutral / Slate Gray Theme for Base Game
  const containerClass = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200';
  const headerClass = isDark ? 'text-gray-200' : 'text-gray-700';
  
  // Icon Container Styles
  const iconBoxClass = isDark ? 'bg-zinc-800 text-gray-300 border-zinc-600' : 'bg-gray-100 text-gray-600 border-gray-300';

  return (
    <div className={`mt-12 p-8 border-t-4 border-gray-400 dark:border-zinc-600 ${containerClass}`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-western font-bold ${headerClass} mb-2`}>Icon Development Panel</h2>
        <p className="text-gray-500">Proposed concepts for the "Base Game" icon (Isometric Variations).</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {icons.map((icon) => (
          <div key={icon.id} className="flex flex-col items-center group p-4 rounded-xl border border-transparent hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer">
             <div className={`w-16 h-16 rounded-lg flex items-center justify-center shadow-md mb-4 border-2 transition-transform group-hover:scale-110 ${iconBoxClass}`}>
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {icon.path}
                </svg>
             </div>
             <h3 className="font-bold text-sm text-center mb-1 dark:text-gray-200">{icon.label}</h3>
             <p className="text-xs text-gray-500 text-center leading-tight">{icon.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
