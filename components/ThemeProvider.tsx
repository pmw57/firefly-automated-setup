import React, { useEffect, useState } from 'react';
import { Theme, ThemeContext } from './ThemeContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state based on storage or system preference immediately to avoid flash of incorrect theme
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return 'dark';

    // 1. Check Local Storage
    const saved = localStorage.getItem('firefly-theme') as Theme;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // 2. Check System Preference (Default to system)
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    // 3. Default fallback
    return 'dark';
  });

  // Apply theme to document and save to storage
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('firefly-theme', theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // If the device changes its preference, update the theme to match
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Modern event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};