import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const DEFAULT_THEME_VALUES = {
  // Light Theme
  gridLinesOpacity: 0.02,
  waterStainOpacity: 0.2,
  vignetteOpacity: 0.1,
  gridSize: 15,
  // Dark Theme
  nebula1Opacity: 0.2,
  nebula2Opacity: 0.2,
  starsTinyOpacity: 0.4,
  starsMediumOpacity: 0.25,
  starsLargeOpacity: 0.15,
  animationSpeed1: 60,
  animationSpeed2: 60,
};

const CSS_VARS = {
  gridLinesOpacity: '--grid-line-opacity',
  waterStainOpacity: '--water-stain-opacity',
  vignetteOpacity: '--vignette-opacity',
  gridSize: '--grid-size',
  nebula1Opacity: '--nebula-1-opacity',
  nebula2Opacity: '--nebula-2-opacity',
  starsTinyOpacity: '--stars-tiny-opacity',
  starsMediumOpacity: '--stars-medium-opacity',
  starsLargeOpacity: '--stars-large-opacity',
  animationSpeed1: '--starfield-animation-duration-1',
  animationSpeed2: '--starfield-animation-duration-2',
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

interface DevThemeEditorProps {
    onClose: () => void;
}

export const DevThemeEditor: React.FC<DevThemeEditorProps> = ({ onClose }) => {
    const [themeValues, setThemeValues] = useState(DEFAULT_THEME_VALUES);
    const { theme } = useTheme();

    useEffect(() => {
        const root = document.documentElement;
        Object.entries(themeValues).forEach(([key, value]) => {
            const cssVar = CSS_VARS[key as keyof typeof CSS_VARS];
            if (cssVar) {
                let cssValue = value.toString();
                if (key === 'gridSize') {
                    cssValue += 'px';
                } else if (key.startsWith('animationSpeed')) {
                    cssValue += 's';
                }
                root.style.setProperty(cssVar, cssValue);
            }
        });
    }, [themeValues]);

    const handleChange = (key: keyof typeof DEFAULT_THEME_VALUES) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setThemeValues(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
    };

    const handleReset = () => {
        setThemeValues(DEFAULT_THEME_VALUES);
    };

    return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-gray-800/95 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl w-80 border border-gray-600 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-800/95 pb-2 z-10">
                <h3 className="font-bold text-lg">Theme Editor</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white p-2 -mr-2 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-6">
                <div className={`p-3 rounded border ${theme === 'light' ? 'bg-gray-700 border-yellow-500/50' : 'border-gray-700 opacity-60'}`}>
                    <h4 className="text-sm font-bold mb-3 text-yellow-400 flex items-center gap-2">
                        <span>📜</span> Light Theme (Parchment)
                    </h4>
                    <div className="space-y-3">
                        <Slider label="Grid Size (px)" value={themeValues.gridSize} onChange={handleChange('gridSize')} min={5} max={50} step={1} />
                        <Slider label="Grid Lines Opacity" value={themeValues.gridLinesOpacity} onChange={handleChange('gridLinesOpacity')} />
                        <Slider label="Water Stain Opacity" value={themeValues.waterStainOpacity} onChange={handleChange('waterStainOpacity')} />
                        <Slider label="Vignette Opacity" value={themeValues.vignetteOpacity} onChange={handleChange('vignetteOpacity')} />
                    </div>
                </div>
                
                <div className={`p-3 rounded border ${theme === 'dark' ? 'bg-gray-700 border-cyan-500/50' : 'border-gray-700 opacity-60'}`}>
                    <h4 className="text-sm font-bold mb-3 text-cyan-400 flex items-center gap-2">
                        <span>✨</span> Dark Theme (Starfield)
                    </h4>
                    <div className="space-y-3">
                        <Slider label="Animation 1 Speed (s)" value={themeValues.animationSpeed1} onChange={handleChange('animationSpeed1')} min={5} max={200} step={1} />
                        <Slider label="Animation 2 Speed (s)" value={themeValues.animationSpeed2} onChange={handleChange('animationSpeed2')} min={5} max={200} step={1} />
                        <Slider label="Nebula 1 Opacity" value={themeValues.nebula1Opacity} onChange={handleChange('nebula1Opacity')} />
                        <Slider label="Nebula 2 Opacity" value={themeValues.nebula2Opacity} onChange={handleChange('nebula2Opacity')} />
                        <Slider label="Tiny Stars Opacity" value={themeValues.starsTinyOpacity} onChange={handleChange('starsTinyOpacity')} />
                        <Slider label="Medium Stars Opacity" value={themeValues.starsMediumOpacity} onChange={handleChange('starsMediumOpacity')} />
                        <Slider label="Large Stars Opacity" value={themeValues.starsLargeOpacity} onChange={handleChange('starsLargeOpacity')} />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
                <button
                    onClick={handleReset}
                    className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2 rounded transition-colors"
                >
                    Reset Defaults
                </button>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold py-2 rounded transition-colors"
                >
                    Back to Dev Panel
                </button>
            </div>
        </div>
    );
};
