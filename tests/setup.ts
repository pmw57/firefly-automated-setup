import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for jsdom environment (used by Vitest)
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

// Mock localStorage globally for all tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    length: 0,
  };
})();

// Use Object.defineProperty to overwrite the read-only localStorage property in JSDOM
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});
