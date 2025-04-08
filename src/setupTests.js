import '@testing-library/jest-dom';

// You can add other global setup here if needed
// For example, mocking `matchMedia` which might be needed by some UI libraries or hooks

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but sometimes used
    removeListener: vi.fn(), // Deprecated but sometimes used
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock AOS library as it relies on browser APIs not fully available in jsdom and can cause issues/warnings
vi.mock('aos', () => ({
  default: {
    init: vi.fn(),
    refresh: vi.fn(),
  },
})); 