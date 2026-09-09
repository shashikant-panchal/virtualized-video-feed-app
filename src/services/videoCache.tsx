import { AppState } from "react-native";
import {
  clearVideoCacheAsync,
  setVideoCacheSizeAsync,
  getCurrentVideoCacheSize,
} from "expo-video";
import { FeedItem } from "../types/feed";

const MAX_CACHE_SIZE = 1024 * 1024 * 1024;
let isInitialized = false;

export const VideoCacheService = {
  async initVideoCache(): Promise<void> {
    if (isInitialized) return;
    isInitialized = true;

    try {
      await clearVideoCacheAsync().catch(() => {});
      await setVideoCacheSizeAsync(MAX_CACHE_SIZE).catch(() => {});
    } catch {}

    AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        clearVideoCacheAsync().catch(() => {});
      }
    });
  },

  async clearCache(): Promise<void> {
    try {
      await clearVideoCacheAsync();
    } catch {}
  },

  getCacheSize(): number {
    try {
      return getCurrentVideoCacheSize();
    } catch {
      return 0;
    }
  },

  preloadUrls(items: FeedItem[] = []): void {
    if (!items || !items.length) return;

    items.forEach((item, index) => {
      if (item.type !== "video") return;
      const url = item.standardUrl || item.upscaledUrl;
      if (!url) return;

      setTimeout(() => {
        fetch(url, {
          method: "GET",
          headers: {
            Range: "bytes=0-524288",
          },
        }).catch(() => {});
      }, index * 100);
    });
  },
};
