import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { DevStoryAudit } from './DevStoryAudit';
import { DevAddStoryCard } from './DevAddStoryCard';
import { DevTestingMatrix } from './DevTestingMatrix';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { getAvailableStoryCards } from '../utils/selectors/story';
import { STORY_CARDS } from '../data/storyCards';

import { loadStoryData } from '../utils/storyLoader';
import { ActionType } from '../state/actions';

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

export const DevPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showStoryAudit, setShowStoryAudit] = useState(false);
    const [showAddStory, setShowAddStory] = useState(false);
    const [showTestingMatrix, setShowTestingMatrix] = useState(false);
    const [themeValues, setThemeValues] = useState(DEFAULT_THEME_VALUES);
    const { theme } = useTheme();

    const { state: gameState } = useGameState();
    const { dispatch } = useGameDispatch();

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

    const handleNavigateStory = async (direction: 'prev' | 'next') => {
        const availableStories = getAvailableStoryCards(gameState);
        if (availableStories.length === 0) return;

        let currentIndex = -1;
        if (gameState.selectedStoryCardIndex !== null) {
             const currentStory = STORY_CARDS[gameState.selectedStoryCardIndex];
             // Find by title to ensure we match the correct object reference or equivalent in filtered list
             currentIndex = availableStories.findIndex(s => s.title === currentStory.title);
        }
        
        let nextIndex = currentIndex;

        if (currentIndex === -1) {
            nextIndex = 0;
        } else {
            if (direction === 'next') {
                if (currentIndex < availableStories.length - 1) {
                    nextIndex = currentIndex + 1;
                }
            } else {
                if (currentIndex > 0) {
                    nextIndex = currentIndex - 1;
                }
            }
        }
        
        if (nextIndex !== currentIndex) {
            const nextStory = availableStories[nextIndex];
            // Find original index in master list to dispatch
            const originalIndex = STORY_CARDS.findIndex(s => s.title === nextStory.title);
            
            if (originalIndex !== -1) {
                 try {
                     const fullStory = await loadStoryData(originalIndex);
                     dispatch({ 
                        type: ActionType.SET_ACTIVE_STORY, 
                        payload: { 
                            story: fullStory, 
                            index: originalIndex, 
                            goal: fullStory.goals?.[0]?.title 
                        } 
                     });
                 } catch (e) {
                     console.error("Failed to load story via DevPanel", e);
                 }
            }
        }
    };

    if (showStoryAudit) {
        return <DevStoryAudit onClose={() => setShowStoryAudit(false)} />;
    }
    
    if (showAddStory) {
        return <DevAddStoryCard onClose={() => setShowAddStory(false)} />;
    }

    if (showTestingMatrix) {
        return <DevTestingMatrix onClose={() => setShowTestingMatrix(false)} />;
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2">
                <button
                    onClick={() => handleNavigateStory('prev')}
                    className="bg-purple-800 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                    title="Previous Story"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    onClick={() => handleNavigateStory('next')}
                    className="bg-purple-800 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                    title="Next Story"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-purple-800 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                    title="Open Dev Panel"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-gray-800/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl w-80 border border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Dev Panel</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
                <button
                    onClick={() => setShowStoryAudit(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded"
                >
                    Audit Story Links
                </button>
                <button
                    onClick={() => setShowAddStory(true)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 rounded"
                >
                    Add Story Card
                </button>
                <button
                    onClick={() => setShowTestingMatrix(true)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-2 rounded"
                >
                    Generate Testing Matrix
                </button>
            </div>

            <div className="space-y-4">
                <div className={`p-2 rounded transition-colors ${theme === 'light' ? 'bg-gray-700' : 'bg-transparent opacity-50'}`}>
                    <h4 className="text-sm font-bold mb-2 text-yellow-400">Light Theme (Parchment)</h4>
                    <Slider label="Grid Size (px)" value={themeValues.gridSize} onChange={handleChange('gridSize')} min={5} max={50} step={1} />
                    <Slider label="Grid Lines Opacity" value={themeValues.gridLinesOpacity} onChange={handleChange('gridLinesOpacity')} />
                    <Slider label="Water Stain Opacity" value={themeValues.waterStainOpacity} onChange={handleChange('waterStainOpacity')} />
                    <Slider label="Vignette Opacity" value={themeValues.vignetteOpacity} onChange={handleChange('vignetteOpacity')} />
                </div>
                
                <div className={`p-2 rounded transition-colors ${theme === 'dark' ? 'bg-gray-700' : 'bg-transparent opacity-50'}`}>
                    <h4 className="text-sm font-bold mb-2 text-cyan-400">Dark Theme (Starfield)</h4>
                    <Slider label="Animation 1 Speed (s)" value={themeValues.animationSpeed1} onChange={handleChange('animationSpeed1')} min={5} max={200} step={1} />
                    <Slider label="Animation 2 Speed (s)" value={themeValues.animationSpeed2} onChange={handleChange('animationSpeed2')} min={5} max={200} step={1} />
                    <Slider label="Nebula 1 Opacity" value={themeValues.nebula1Opacity} onChange={handleChange('nebula1Opacity')} />
                    <Slider label="Nebula 2 Opacity" value={themeValues.nebula2Opacity} onChange={handleChange('nebula2Opacity')} />
                    <Slider label="Tiny Stars Opacity" value={themeValues.starsTinyOpacity} onChange={handleChange('starsTinyOpacity')} />
                    <Slider label="Medium Stars Opacity" value={themeValues.starsMediumOpacity} onChange={handleChange('starsMediumOpacity')} />
                    <Slider label="Large Stars Opacity" value={themeValues.starsLargeOpacity} onChange={handleChange('starsLargeOpacity')} />
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