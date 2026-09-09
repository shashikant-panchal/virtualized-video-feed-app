interface StorageInterface {
  getBoolean(key: string): boolean | undefined;
  getNumber(key: string): number | undefined;
  set(key: string, value: boolean | number): void;
}

let storage: StorageInterface;

try {
  const { MMKV } = require("react-native-mmkv");
  storage = new MMKV({ id: "feed-storage" });
} catch {
  const cache = new Map<string, boolean | number>();
  storage = {
    getBoolean: (key: string) => cache.get(key) as boolean | undefined,
    getNumber: (key: string) => cache.get(key) as number | undefined,
    set: (key: string, value: boolean | number) => cache.set(key, value),
  };
}

export const StorageService = {
  isLiked: (id: string): boolean => Boolean(storage.getBoolean(`like_${id}`)),
  setLiked: (id: string, val: boolean): void => storage.set(`like_${id}`, Boolean(val)),
  getLikeDelta: (id: string): number => storage.getNumber(`like_delta_${id}`) ?? 0,
  setLikeDelta: (id: string, delta: number): void => storage.set(`like_delta_${id}`, delta),
  isMuted: (): boolean => Boolean(storage.getBoolean("global_mute")),
  setMuted: (val: boolean): void => storage.set("global_mute", Boolean(val)),
  isUpscaleEnabled: (): boolean => Boolean(storage.getBoolean("ai_upscale")),
  setUpscaleEnabled: (val: boolean): void => storage.set("ai_upscale", Boolean(val)),
};
