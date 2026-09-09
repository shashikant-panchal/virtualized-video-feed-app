let storage;

try {
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV({ id: "feed-storage" });
} catch {
  const cache = new Map();
  storage = {
    getBoolean: (key) => cache.get(key),
    getNumber: (key) => cache.get(key),
    set: (key, value) => cache.set(key, value),
  };
}

export const StorageService = {
  isLiked: (id) => Boolean(storage.getBoolean(`like_${id}`)),
  setLiked: (id, val) => storage.set(`like_${id}`, Boolean(val)),
  getLikeDelta: (id) => storage.getNumber(`like_delta_${id}`) ?? 0,
  setLikeDelta: (id, delta) => storage.set(`like_delta_${id}`, delta),
  isMuted: () => Boolean(storage.getBoolean("global_mute")),
  setMuted: (val) => storage.set("global_mute", Boolean(val)),
  isUpscaleEnabled: () => Boolean(storage.getBoolean("ai_upscale")),
  setUpscaleEnabled: (val) => storage.set("ai_upscale", Boolean(val)),
};
