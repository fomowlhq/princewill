/**
 * Persistent cache for home page data using localStorage.
 * Prevents loading flashes during navigation and page refreshes.
 */

const CACHE_KEY = 'princewill_home_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface CacheData {
  banners: any[] | null;
  bestSellers: any[] | null;
  newArrivals: any[] | null;
  unisex: any[] | null;
  timestamp: number;
}

// In-memory cache for instant access
let memoryCache: CacheData = {
  banners: null,
  bestSellers: null,
  newArrivals: null,
  unisex: null,
  timestamp: 0
};

// Load from localStorage on init (client-side only)
const loadFromStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed: CacheData = JSON.parse(stored);
      const isExpired = Date.now() - parsed.timestamp > CACHE_DURATION;

      if (!isExpired) {
        memoryCache = parsed;
      } else {
        // Clear expired cache
        localStorage.removeItem(CACHE_KEY);
      }
    }
  } catch (e) {
    console.error('Failed to load home cache:', e);
  }
};

// Save to localStorage
const saveToStorage = (): void => {
  if (typeof window === 'undefined') return;

  try {
    memoryCache.timestamp = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
  } catch (e) {
    console.error('Failed to save home cache:', e);
  }
};

// Initialize cache from storage
loadFromStorage();

// Proxy to handle get/set with automatic persistence
export const homeCache = {
  get banners() {
    return memoryCache.banners;
  },
  set banners(value: any[] | null) {
    memoryCache.banners = value;
    saveToStorage();
  },

  get bestSellers() {
    return memoryCache.bestSellers;
  },
  set bestSellers(value: any[] | null) {
    memoryCache.bestSellers = value;
    saveToStorage();
  },

  get newArrivals() {
    return memoryCache.newArrivals;
  },
  set newArrivals(value: any[] | null) {
    memoryCache.newArrivals = value;
    saveToStorage();
  },

  get unisex() {
    return memoryCache.unisex;
  },
  set unisex(value: any[] | null) {
    memoryCache.unisex = value;
    saveToStorage();
  },

  // Check if cache is still valid
  isValid(): boolean {
    return Date.now() - memoryCache.timestamp < CACHE_DURATION;
  },

  // Force refresh cache
  clear(): void {
    memoryCache = {
      banners: null,
      bestSellers: null,
      newArrivals: null,
      unisex: null,
      timestamp: 0
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
  }
};
