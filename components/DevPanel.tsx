import React, { useState, useEffect } from 'react';
import { DevStoryAudit } from './DevStoryAudit';
import { DevSetupAudit } from './DevSetupAudit';
import { StoryCardEditor } from './StoryCardEditor';
import { DevTestingMatrix } from './DevTestingMatrix';
import { DevThemeEditor } from './DevThemeEditor';
import { DevMigrationTools } from './DevMigrationTools';
import { useGameState } from '../hooks/useGameState';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { getAvailableStoryCards } from '../utils/selectors/story';
import { useData } from '../hooks/useData';

import { loadStoryData } from '../utils/storyLoader';
import { ActionType } from '../state/actions';

export const DevPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showStoryAudit, setShowStoryAudit] = useState(false);
    const [showSetupAudit, setShowSetupAudit] = useState(false);
    const [showAddStory, setShowAddStory] = useState(false);
    const [showThemeEditor, setShowThemeEditor] = useState(false);
    const [showMigrationTools, setShowMigrationTools] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, new GoogleAuthProvider());
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const [addStoryInitialTitle, setAddStoryInitialTitle] = useState<string | undefined>();
    const [showTestingMatrix, setShowTestingMatrix] = useState(false);

    const { state: gameState } = useGameState();
    const { dispatch } = useGameDispatch();
    const { stories } = useData();

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

    if (showMigrationTools) {
        return <DevMigrationTools user={user} onClose={() => setShowMigrationTools(false)} />;
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
                    {user ? (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-green-400 font-mono truncate max-w-[120px]">{user.email}</span>
                            <button onClick={handleLogout} className="text-[10px] text-gray-400 hover:text-white underline">Logout</button>
                        </div>
                    ) : (
                        <button onClick={handleLogin} className="text-[10px] text-blue-400 hover:text-blue-300 underline mt-1 text-left">Login to Save/Migrate</button>
                    )}
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

                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-4 mb-1">System</div>
                <button
                    onClick={() => setShowMigrationTools(true)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white text-[11px] font-bold py-2 rounded flex items-center justify-center gap-2"
                >
                    <span>⚙️</span> Migration Tools
                </button>
            </div>
        </div>
    );
};
