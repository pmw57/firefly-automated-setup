
import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// FIX: Use `import type` to only load the type definitions. This prevents the
// user-event module from executing its browser-specific setup code when
// imported in a Node.js test environment.
import type userEvent from '@testing-library/user-event';

// The type can be correctly inferred from the type-only import.
export let user: ReturnType<typeof userEvent.setup>;

// Run cleanup after each test to ensure a clean DOM environment.
afterEach(() => {
  if (typeof window !== 'undefined') {
    cleanup();
  }
  vi.restoreAllMocks();
});

// `beforeEach` runs before every test. We make it async to support dynamic import.
beforeEach(async () => {
  // Guard for Node.js environment where 'window' is not defined.
  if (typeof window !== 'undefined') {
    // FIX: Dynamically import the actual user-event library inside the JSDOM
    // environment guard. This ensures its code only runs when a DOM is present.
    const userEventActual = (await import('@testing-library/user-event')).default;
    user = userEventActual.setup();
    
    // Mock window.matchMedia for jsdom environment
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
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
    if (typeof Element !== 'undefined') {
      Element.prototype.scrollIntoView = vi.fn();
    }

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
        get length() {
          return Object.keys(store).length;
        },
      };
    })();

    // Overwrite the read-only localStorage property in JSDOM
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  }
});