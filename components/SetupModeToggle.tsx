

import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
// FIX: Import `useGameDispatch` to correctly dispatch actions to the game state reducer.
import { useGameDispatch } from '../hooks/useGameDispatch';
import { cls } from '../utils/style';
import { useRockerSwitchSound } from '../hooks/useRockerSwitchSound';

export const SetupModeToggle: React.FC = () => {
    // FIX: Destructure only the relevant state properties from `useGameState`.
    const { state } = useGameState();
    // FIX: Get the dispatch function and action creators from `useGameDispatch`.
    const { setSetupMode } = useGameDispatch();
    const isDetailed = state.setupMode === 'detailed';
    const { playSound } = useRockerSwitchSound();

    const [labelsVisible, setLabelsVisible] = useState(true);
    const timerRef = useRef<number | null>(null);

    const startTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(() => {
            setLabelsVisible(false);
        }, 5000);
    };

    const handleMouseEnter = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setLabelsVisible(true);
    };
    
    const handleMouseLeave = () => {
        startTimer();
    };

    const handleToggle = () => {
        playSound(isDetailed ? 'off' : 'on');
        setSetupMode(isDetailed ? 'quick' : 'detailed');
        handleMouseEnter(); 
    };

    // Set initial timer on mount
    useEffect(() => {
        startTimer();
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const titleText = isDetailed 
        ? "A comprehensive checklist including all optional rules and details for enthusiasts."
        : "A streamlined guide to get you playing faster.";

    return (
        <div 
            className="flex items-center gap-2 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={titleText}
        >
            <div className={cls(
                "flex flex-col items-end space-y-0.5 transition-opacity duration-500",
                labelsVisible ? 'opacity-100' : 'opacity-0'
            )}>
                <span className={cls(
                    "font-bold uppercase text-xs tracking-wider transition-all duration-200 px-2 py-0.5 rounded bg-black/25 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
                    isDetailed
                        ? "text-white"
                        : "text-gray-400"
                )}>
                    Detailed
                </span>
                <span className={cls(
                    "font-bold uppercase text-xs tracking-wider transition-all duration-200 px-2 py-0.5 rounded bg-black/25 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]",
                    !isDetailed
                        ? "text-white"
                        : "text-gray-400"
                )}>
                    Quick
                </span>
            </div>
            <label className="rocker-switch">
                <input
                    type="checkbox"
                    checked={isDetailed}
                    onChange={handleToggle}
                    aria-label={`Current mode: ${isDetailed ? 'Detailed' : 'Quick'}. Click to switch.`}
                />
                <div className="button">
                    <div className="light"></div>
                    <div className="dots"></div>
                    <div className="characters"></div>
                    <div className="shine"></div>
                    <div className="shadow"></div>
                </div>
            </label>
        </div>
    );
};