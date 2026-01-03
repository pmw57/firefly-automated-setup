import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './components/ThemeProvider';
import { GameStateProvider } from './components/GameStateContext';
import './index.css';

declare global {
  interface Window {
    fallbackTimeout?: number;
  }
}

// Failsafe Clear: If the main JS bundle loads and executes, clear the
// timeout that was set in index.html. This prevents the "Hard Reset" button
// from appearing on a successful load.
if (window.fallbackTimeout) {
  clearTimeout(window.fallbackTimeout);
  delete window.fallbackTimeout;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <GameStateProvider>
          <App />
        </GameStateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
