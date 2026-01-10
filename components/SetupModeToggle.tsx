

import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { cls } from '../utils/style';
import { useRockerSwitchSound } from '../hooks/useRockerSwitchSound';

export const SetupModeToggle: React.FC = () => {
    const { state } = useGameState();
    const { setSetupMode } = useGameDispatch();
    const isDetailed = state.setupMode === 'detailed';
    const { playSound } = useRockerSwitchSound();

    // Local state for the switch's visual appearance, allowing for immediate animation.
    const [visualChecked, setVisualChecked] = useState(isDetailed);
    const [isSwitching, setIsSwitching] = useState(false);
    const [labelsVisible, setLabelsVisible] = useState(true);
    const timerRef = useRef<number | null>(null);

    // Sync local visual state if global state changes (e.g., on initial load)
    useEffect(() => {
        setVisualChecked(isDetailed);
    }, [isDetailed]);

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
        if (isSwitching) return;

        setIsSwitching(true);
        const nextIsDetailed = !visualChecked;

        // 1. Animate the switch immediately by updating local state.
        setVisualChecked(nextIsDetailed);

        // 2. After a 400ms delay, play the sound and update the global state.
        // The label styles will update automatically when the global state changes.
        setTimeout(() => {
            playSound(nextIsDetailed ? 'on' : 'off');
            setSetupMode(nextIsDetailed ? 'detailed' : 'quick');
            handleMouseEnter(); // Reset the label visibility timer
            setIsSwitching(false);
        }, 400);
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
                {/* The labels are driven by the global 'isDetailed' state, so they will update after the delay. */}
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
                    // The switch's animation is driven by the local 'visualChecked' state for an immediate effect.
                    checked={visualChecked}
                    onChange={handleToggle}
                    disabled={isSwitching}
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