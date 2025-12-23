import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { DevStoryAudit } from './DevStoryAudit';

const DEFAULT_OPACITIES = {
  // Light Theme
  gridLines: 0.02,
  waterStain: 0.2,
  vignette: 0.1,
  // Dark Theme
  nebula1: 0.2,
  nebula2: 0.2,
  starsTiny: 0.4,
  starsMedium: 0.25,
  starsLarge: 0.15,
};

const CSS_VARS = {
  gridLines: '--grid-line-opacity',
  waterStain: '--water-stain-opacity',
  vignette: '--vignette-opacity',
  nebula1: '--nebula-1-opacity',
  nebula2: '--nebula-2-opacity',
  starsTiny: '--stars-tiny-opacity',
  starsMedium: '--stars-medium-opacity',
  starsLarge: '--stars-large-opacity',
};

const Slider = ({ label, value, onChange, min = 0, max = 1, step = 0.01 }: { label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min?: number, max?: number, step?: number }) => (
    <div className="flex flex-col">
        <label className="text-xs font-mono flex justify-between">
            <span>{label}</span>
            <span>{value.toFixed(4)}</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);

export const DevPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showStoryAudit, setShowStoryAudit] = useState(false);
    const [opacities, setOpacities] = useState(DEFAULT_OPACITIES);
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        Object.entries(opacities).forEach(([key, value]) => {
            root.style.setProperty(CSS_VARS[key as keyof typeof CSS_VARS], value.toString());
        });
    }, [opacities]);

    const handleChange = (key: keyof typeof DEFAULT_OPACITIES) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setOpacities(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
    };

    const handleReset = () => {
        setOpacities(DEFAULT_OPACITIES);
    };

    if (showStoryAudit) {
        return <DevStoryAudit onClose={() => setShowStoryAudit(false)} />;
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-[9999] bg-purple-800 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                title="Open Dev Panel"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-gray-800/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl w-80 border border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Dev Panel</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            
            <button
                onClick={() => setShowStoryAudit(true)}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded"
            >
                Audit Story Links
            </button>

            <div className="space-y-4">
                <div className={`p-2 rounded transition-colors ${theme === 'light' ? 'bg-gray-700' : 'bg-transparent opacity-50'}`}>
                    <h4 className="text-sm font-bold mb-2 text-yellow-400">Light Theme (Parchment)</h4>
                    <Slider label="Grid Lines" value={opacities.gridLines} onChange={handleChange('gridLines')} />
                    <Slider label="Water Stain" value={opacities.waterStain} onChange={handleChange('waterStain')} />
                    <Slider label="Vignette" value={opacities.vignette} onChange={handleChange('vignette')} />
                </div>
                
                <div className={`p-2 rounded transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-transparent opacity-50'}`}>
                    <h4 className="text-sm font-bold mb-2 text-cyan-400">Dark Theme (Starfield)</h4>
                    <Slider label="Nebula 1" value={opacities.nebula1} onChange={handleChange('nebula1')} />
                    <Slider label="Nebula 2" value={opacities.nebula2} onChange={handleChange('nebula2')} />
                    <Slider label="Tiny Stars" value={opacities.starsTiny} onChange={handleChange('starsTiny')} />
                    <Slider label="Medium Stars" value={opacities.starsMedium} onChange={handleChange('starsMedium')} />
                    <Slider label="Large Stars" value={opacities.starsLarge} onChange={handleChange('starsLarge')} />
                </div>
            </div>

            <button
                onClick={handleReset}
                className="w-full mt-4 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2 rounded"
            >
                Reset Theme Defaults
            </button>
        </div>
    );
};