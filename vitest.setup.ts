import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock Capacitor core
vi.mock('@capacitor/core', () => ({
    Capacitor: { getPlatform: vi.fn().mockReturnValue('android') },
}));

// Mock LocalNotifications with named export
vi.mock('@capacitor/local-notifications', () => ({
    LocalNotifications: {
        checkPermissions: vi.fn(),
        requestPermissions: vi.fn(),
        schedule: vi.fn(),
        cancel: vi.fn(),
    },
}));

const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => (key in store ? store[key] : null),
        setItem: (key: string, value: string) => {
            store[key] = String(value);
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    configurable: true,
});

beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});
