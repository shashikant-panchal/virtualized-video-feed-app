# Virtualized Video Feed with Gestures & Simulated Upscaling

A smooth, vertically scrolling video feed balancing UI-thread performance (60+ FPS), aggressive memory recycling, gesture physics, and local state persistence without Cumulative Layout Shift (CLS).

---

## Tech Stack & Design Tokens

| Area | Specification / Library | Configuration & Tokens |
| :--- | :--- | :--- |
| **Framework** | Expo 57|
| **Feed Virtualization** | `@shopify/flash-list` | Configured with `pagingEnabled` |
| **Gestures & Animations** | `react-native-gesture-handler` + `react-native-reanimated` v3 | Native UI thread execution via Reanimated Worklets |
| **Video Playback** | `expo-video` | Lifecycle-managed stream switching |
| **Local Persistence** | `react-native-mmkv` | Synchronous, zero UI-latency caching |
| **UI Theme & Tokens** | Target App Theme | Deep dark `#0A0A0E`, Card `#14141B`<br/>Accents: `#8B5CF6` (Purple) & `#06B6D4` (Cyan)<br/>Glassmorphic cards: `rgba(255, 255, 255, 0.06)` with 1px border `rgba(255, 255, 255, 0.12)` |
| **Icons** | `lucide-react-native` | Heart, MessageCircle, Share2, Volume2, VolumeX, Sparkles, Sliders |

---

## Core Tasks

### Task 1: Virtualized Infinite Feed (`@shopify/flash-list`)
- Vertical scrolling feed using `@shopify/flash-list` configured with `pagingEnabled`.
- Explicit `estimatedItemSize` matching the window height to prevent blank areas.
- Viewability listener (`onViewableItemsChanged`) autoplays only the focused video cell in the viewport.
- Immediately pauses and releases decoding memory for off-screen items.

### Task 2: 60 FPS Double-Tap Gesture (Reanimated v3 Worklets)
- Double-tap gesture attached to video cards via `react-native-gesture-handler`.
- Floating Heart icon animation running purely on the native UI thread via Reanimated worklets (spring-scale up, vertical translation, and fade out).
- Optimistically writes the "Liked" count and state to `react-native-mmkv` with zero UI latency.

### Task 3: Dynamic Resolution & Simulated Upscaling Layer
- Floating glassmorphic toggle button utilizing the Sparkles icon labeled "AI Upscale / HD".
- Toggling ON dynamically switches playback to a higher-bitrate stream URL and applies native dynamic sharpness/contrast clarity filter layer.
- **Continuous Playback**: Preserves `currentTime` across quality switches without resetting video progress to 0:00.
- Animated HUD toast ("Upscaled 1080p") that automatically fades out after 2 seconds.

### Task 4: Ad Placement Without Layout Shifts (Zero CLS)
- Mock sponsored card injected at every 5th feed index.
- Fixed-dimension skeleton containers so the feed never stutters, recalculates height, or triggers Cumulative Layout Shift (CLS) when items mount.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run on Android
```bash
npm run android
# or
npx expo start --android
```

### 3. Run on iOS
```bash
npm run ios
# or
npx expo start --ios
```

---

## Demo Recording
A 40-second screen recording demonstrating smooth paging, 60 FPS double-tap animation, dynamic resolution toggling with continuous playback, and zero-CLS sponsored cards is included in [`assets/demo.mp4`](./assets/demo.mp4).

