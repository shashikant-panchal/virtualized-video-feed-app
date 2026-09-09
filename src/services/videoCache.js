import { AppState } from "react-native";
import {
  clearVideoCacheAsync,
  setVideoCacheSizeAsync,
  getCurrentVideoCacheSize,
} from "expo-video";

const MAX_CACHE_SIZE = 1024 * 1024 * 1024; // 1 GB disk cache
let isInitialized = false;

export const VideoCacheService = {
  /**
   * Initializes video cache on app startup:
   * 1. Clears previous session cache for fresh, smooth scrolling
   * 2. Sets persistent disk cache size to 1GB
   * 3. Listens for app exit/backgrounding to manage cache
   */
  async initVideoCache() {
    if (isInitialized) return;
    isInitialized = true;

    try {
      // Clear stale cache from previous sessions before players mount
      await clearVideoCacheAsync().catch(() => {});
      // Allocate 1GB for video caching so all viewed videos are cached
      await setVideoCacheSizeAsync(MAX_CACHE_SIZE).catch(() => {});
    } catch {}

    // Listen for app exit / background state
    AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        // App is exiting or put in background
        clearVideoCacheAsync().catch(() => {});
      }
    });
  },

  /**
   * Clears the video cache on demand
   */
  async clearCache() {
    try {
      await clearVideoCacheAsync();
    } catch {}
  },

  /**
   * Returns current cache size in bytes
   */
  getCacheSize() {
    try {
      return getCurrentVideoCacheSize();
    } catch {
      return 0;
    }
  },

  /**
   * Preloads/preheats video URLs on start so videos load instantly during scrolling.
   * Downloads initial MP4 headers (moov atom + first frames) via HTTP Range requests.
   */
  preloadUrls(items = []) {
    if (!items || !items.length) return;

    // Prefetch videos with a staggered delay to prevent network congestion
    items.forEach((item, index) => {
      if (item.type !== "video") return;
      const url = item.standardUrl || item.upscaledUrl;
      if (!url) return;

      setTimeout(() => {
        // Fetch first 512 KB of the video (MP4 moov metadata + initial audio/video packets)
        fetch(url, {
          method: "GET",
          headers: {
            Range: "bytes=0-524288",
          },
        }).catch(() => {});
      }, index * 200); // 200ms stagger between requests
    });
  },
};
