import React, { useState, useEffect } from 'react';
import { cls } from '../utils/style';
import { useTheme } from './ThemeContext';

const ONBOARDING_TOOLTIP_KEY = 'firefly_onboarding_tooltip_seen_v1';

export const OnboardingTooltip: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        // Prevent showing on server-side rendering or test environments
        if (typeof window === 'undefined') return;

        const hasSeen = localStorage.getItem(ONBOARDING_TOOLTIP_KEY);
        if (hasSeen !== 'true') {
            // Delay showing the tooltip slightly to not be overwhelming on first load
            const timer = setTimeout(() => setIsVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(ONBOARDING_TOOLTIP_KEY, 'true');
    };

    if (!isVisible) {
        return null;
    }

    const isDark = theme === 'dark';

    return (
        <div className={cls(
            "fixed top-16 right-4 z-[9998] w-64 p-4 rounded-lg shadow-2xl animate-fade-in-up",
            isDark ? "bg-blue-900 border border-blue-700 text-blue-100" : "bg-blue-50 border border-blue-200 text-blue-900"
        )}>
            <div className="absolute -top-2 right-12 w-4 h-4 transform rotate-45 -z-10 bg-inherit border-l border-t border-inherit"></div>
            <h4 className="font-bold text-base mb-2">Pro Tip!</h4>
            <p className="text-sm mb-4">
                Switch between a <strong className="font-semibold">Quick</strong> or <strong className="font-semibold">Detailed</strong> setup guide at any time using this switch.
            </p>
            <button
                onClick={handleDismiss}
                className={cls(
                    "w-full text-center text-xs font-bold py-2 rounded",
                    isDark ? "bg-blue-800 hover:bg-blue-700 text-white" : "bg-blue-200 hover:bg-blue-300 text-blue-900"
                )}
            >
                Got it
            </button>
        </div>
    );
};