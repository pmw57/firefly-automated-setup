import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// By using `beforeEach` in the global setup file, we ensure that all mocks
// are reset before every single test runs. This makes tests more isolated
// and prevents issues where `vi.restoreAllMocks()` in one test file could
// break mocks for another.

beforeEach(() => {
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
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: vi.fn(),
  });

  // Mock Element.prototype.scrollIntoView as it is not implemented in jsdom
  Element.prototype.scrollIntoView = vi.fn();

  // Mock localStorage globally for all tests
  // This creates a fresh, empty store for each test.
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
      // Use a getter for length so it's dynamic.
      get length() {
        return Object.keys(store).length;
      },
    };
  })();

  // Use Object.defineProperty to overwrite the read-only localStorage property in JSDOM
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});