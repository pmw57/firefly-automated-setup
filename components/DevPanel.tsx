import React, { useState } from 'react';
import { DevStoryAudit } from './DevStoryAudit';
import { DevSetupAudit } from './DevSetupAudit';
import { StoryCardEditor } from './StoryCardEditor';
import { DevTestingMatrix } from './DevTestingMatrix';
import { DevThemeEditor } from './DevThemeEditor';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { getAvailableStoryCards } from '../utils/selectors/story';
import { useData } from '../hooks/useData';
import { isStoryOverride, isActiveSetupRule } from '../utils/overrides';
import { SetupRule } from '../types';

import { loadStoryData } from '../utils/storyLoader';
import { ActionType } from '../state/actions';

export const DevPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showStoryAudit, setShowStoryAudit] = useState(false);
    const [showSetupAudit, setShowSetupAudit] = useState(false);
    const [showAddStory, setShowAddStory] = useState(false);
    const [showThemeEditor, setShowThemeEditor] = useState(false);

    const [addStoryInitialTitle, setAddStoryInitialTitle] = useState<string | undefined>();
    const [showTestingMatrix, setShowTestingMatrix] = useState(false);

    const { state: gameState } = useGameState();
    const { dispatch } = useGameDispatch();
    const { stories } = useData();
    
    const currentStory = gameState.selectedStoryCardIndex !== null ? stories[gameState.selectedStoryCardIndex] : null;
    const needsUpdate = React.useMemo(() => {
        if (!currentStory) return false;
        const hasSetupDescription = !!currentStory.setupDescription;
        const rules = (currentStory.rules || []) as Partial<SetupRule>[];
        const hasStoryOverride = rules.some(isStoryOverride);
        const isActiveSetup = rules.some(isActiveSetupRule);

        return (hasSetupDescription && (!hasStoryOverride || !isActiveSetup)) ||
               (hasStoryOverride && !isActiveSetup) ||
               (isActiveSetup && (!hasStoryOverride || !hasSetupDescription));
    }, [currentStory]);

    const handleNavigateStory = async (direction: 'prev' | 'next') => {
        const availableStories = getAvailableStoryCards(gameState, stories);
        if (availableStories.length === 0) return;

        let currentIndex = -1;
        if (gameState.selectedStoryCardIndex !== null) {
             const currentStory = stories[gameState.selectedStoryCardIndex];
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
            const originalIndex = stories.findIndex(s => s.title === nextStory.title);
            
            if (originalIndex !== -1) {
                 try {
                     const fullStory = await loadStoryData(originalIndex, stories);
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
    
    if (showSetupAudit) {
        return <DevSetupAudit 
            onClose={() => setShowSetupAudit(false)} 
            onEditStory={(title) => {
                setShowSetupAudit(false);
                setAddStoryInitialTitle(title);
                setShowAddStory(true);
            }} 
        />;
    }
    
    if (showAddStory) {
        return <StoryCardEditor 
            onClose={() => {
                setShowAddStory(false);
                setAddStoryInitialTitle(undefined);
            }} 
            initialStoryTitle={addStoryInitialTitle}
        />;
    }

    if (showTestingMatrix) {
        return <DevTestingMatrix onClose={() => setShowTestingMatrix(false)} />;
    }

    if (showThemeEditor) {
        return <DevThemeEditor onClose={() => setShowThemeEditor(false)} />;
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2">
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
                {currentStory && (
                    <button
                        onClick={() => {
                            setAddStoryInitialTitle(currentStory.title);
                            setShowAddStory(true);
                        }}
                        className={`relative p-2 rounded-full shadow-lg transition-colors ${needsUpdate ? 'bg-amber-600 hover:bg-amber-500 animate-pulse' : 'bg-green-700 hover:bg-green-600'}`}
                        title={needsUpdate ? "Edit Story (Audit Warning)" : "Edit Story"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        {needsUpdate && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                )}
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
        <div className="fixed bottom-4 left-4 z-[9999] bg-gray-800/90 backdrop-blur-md text-white p-4 rounded-lg shadow-2xl w-80 border border-gray-600">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg leading-tight">Dev Panel</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white p-2 -mr-2 transition-colors" title="Close Dev Panel">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Content Management</div>
                <button
                    onClick={() => setShowAddStory(true)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-bold py-2 rounded flex items-center justify-center gap-2"
                >
                    <span>📝</span> Story Card Editor
                </button>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setShowStoryAudit(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-2 rounded"
                    >
                        Audit Links
                    </button>
                    <button
                        onClick={() => setShowSetupAudit(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-2 rounded"
                    >
                        Audit Cards
                    </button>
                </div>

                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-4 mb-1">Visuals & Testing</div>
                <button
                    onClick={() => setShowThemeEditor(true)}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold py-2 rounded flex items-center justify-center gap-2"
                >
                    <span>🎨</span> Theme Editor
                </button>
                <button
                    onClick={() => setShowTestingMatrix(true)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold py-2 rounded flex items-center justify-center gap-2"
                >
                    <span>📊</span> Testing Matrix
                </button>
            </div>
        </div>
    );
};
