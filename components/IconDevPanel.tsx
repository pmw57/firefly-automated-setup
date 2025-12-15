
import React from 'react';
import { useTheme } from './ThemeContext';

export const IconDevPanel: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const icons = [
    {
      id: 'network',
      label: 'The Cortex',
      desc: 'Abstract network nodes representing community connection.',
      path: (
        <>
          <circle cx="12" cy="6" r="3" fill="currentColor" opacity="0.8"/>
          <circle cx="6" cy="18" r="3" fill="currentColor" opacity="0.8"/>
          <circle cx="18" cy="18" r="3" fill="currentColor" opacity="0.8"/>
          <path d="M10 8L7 16 M14 8L17 16 M9 18L15 18" stroke="currentColor" strokeWidth="2"/>
        </>
      )
    },
    {
      id: 'group',
      label: 'The Crew',
      desc: 'Standard representation of a group of people.',
      path: (
        <>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'book',
      label: 'The Chronicles',
      desc: 'An open book symbolizing fan stories and lore.',
      path: (
        <>
          <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="currentColor" opacity="0.3"/>
          <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.805 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'signal',
      label: 'The Signal',
      desc: 'Broadcasting to the black. A radio tower emitting waves.',
      path: (
        <>
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'quill',
      label: 'The Quill',
      desc: 'Represents fan-authored content.',
      path: (
        <>
           <path d="M12.5 3a.5.5 0 0 1 .5.5v3.626l-1-1V3.5a.5.5 0 0 1 .5-.5zm-4 4v2.626l1 1V7.5a.5.5 0 0 0-1 0zm-2 5a.5.5 0 0 1 .5.5v2.626l-1-1V12.5a.5.5 0 0 1 .5-.5z" fill="currentColor"/>
           <path d="M19.04 4.93a.5.5 0 0 0-.58-.08l-5.94 3.42a.5.5 0 0 0-.21.22l-2.48 6.2a.5.5 0 0 0 .15.56l2.12 2.12a.5.5 0 0 0 .56.15l6.21-2.48a.5.5 0 0 0 .22-.21l3.42-5.94a.5.5 0 0 0-.08-.58l-3.39-3.4zM16 13l-3-3 3.5-3.5 3 3L16 13z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'handshake',
      label: 'The Deal',
      desc: 'A handshake representing community trade and agreement.',
      path: (
        <>
           <path d="M14.5,12c-0.83,0-1.5-0.67-1.5-1.5S13.67,9,14.5,9S16,9.67,16,10.5S15.33,12,14.5,12z M8.5,12C7.67,12,7,11.33,7,10.5S7.67,9,8.5,9S10,9.67,10,10.5S9.33,12,8.5,12z M10.5,15c-0.83,0-1.5-0.67-1.5-1.5S9.67,12,10.5,12S12,12.67,12,13.5S11.33,15,10.5,15z" fill="currentColor" opacity="0.3"/>
           <path d="M21.5,14c-0.83,0-1.5-0.67-1.5-1.5S20.67,11,21.5,11S23,11.67,23,12.5S22.33,14,21.5,14z M3.5,14C2.67,14,2,13.33,2,12.5S2.67,11,3.5,11S5,11.67,5,12.5S4.33,14,3.5,14z M17,17.5c-0.28,0-0.5-0.22-0.5-0.5v-5c0-1.65-1.35-3-3-3h-2c-1.65,0-3,1.35-3,3v5c0,0.28-0.22,0.5-0.5,0.5s-0.5-0.22-0.5-0.5v-5c0-2.21,1.79-4,4-4h2c2.21,0,4,1.79,4,4v5C17.5,17.28,17.28,17.5,17,17.5z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'puzzle',
      label: 'The Piece',
      desc: 'A puzzle piece symbolizing community contribution.',
      path: (
        <>
           <path d="M19.5 12c0-1.1-.9-2-2-2V6c0-1.1-.9-2-2-2h-4c0 1.1-.9 2-2 2s-2-.9-2-2H3.5c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h4c0-1.1.9-2 2-2s2 .9 2 2h4c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'chat',
      label: 'The Wave',
      desc: 'Communication bubbles.',
      path: (
         <>
           <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor"/>
         </>
      )
    },
    {
      id: 'globe',
      label: 'The Verse',
      desc: 'A wireframe planet representing the global community.',
      path: (
        <>
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </>
      )
    },
    {
      id: 'star-badge',
      label: 'The Sheriff',
      desc: 'A star badge, reminiscent of western law but also quality.',
      path: (
        <>
           <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
        </>
      )
    }
  ];

  // Colors mimicking the Teal theme of Community Content
  const containerClass = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200';
  const headerClass = isDark ? 'text-teal-400' : 'text-teal-700';
  
  // Icon Container Styles (mimicking ExpansionToggle active state for teal)
  const iconBoxClass = isDark ? 'bg-teal-900 text-teal-100 border-teal-700' : 'bg-teal-600 text-white border-teal-500';

  return (
    <div className={`mt-12 p-8 border-t-4 border-teal-500 ${containerClass}`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-western font-bold ${headerClass} mb-2`}>Icon Development Panel</h2>
        <p className="text-gray-500">Proposed concepts for the "Community Content" expansion icon.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {icons.map((icon) => (
          <div key={icon.id} className="flex flex-col items-center group p-4 rounded-xl border border-transparent hover:border-teal-500/30 hover:bg-teal-50/50 dark:hover:bg-teal-900/20 transition-all">
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
