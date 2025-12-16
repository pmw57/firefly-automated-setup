import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for jsdom environment (used by Vitest)
// https://vitest.dev/guide/mocking.html#mocking-globals
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false, // Default to dark mode for tests.
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo as it is not implemented in jsdom
window.scrollTo = vi.fn();

// Mock Element.prototype.scrollIntoView as it is not implemented in jsdom
Element.prototype.scrollIntoView = vi.fn();
