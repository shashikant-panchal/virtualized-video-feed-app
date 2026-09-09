import React, { useRef, useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Share } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, LAYOUT } from "../../constants/theme";
import { StorageService } from "../../services/storage";
import { HeartBurst } from "./HeartBurst";
import { VideoControls } from "./VideoControls";

export const VideoCard = ({
  item,
  isActive,
  isMuted,
  onToggleMute,
  onTriggerToast,
  height = LAYOUT.screenHeight,
  width = LAYOUT.screenWidth,
}) => {
  const heartBurstRef = useRef(null);

  const [isLiked, setIsLiked] = useState(() => StorageService.isLiked(item.id));
  const [likeDelta, setLikeDelta] = useState(() =>
    StorageService.getLikeDelta(item.id)
  );
  const [isUpscaled, setIsUpscaled] = useState(() =>
    StorageService.isUpscaleEnabled()
  );

  const videoSource = item.upscaledUrl || item.standardUrl;

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
    p.muted = isMuted;
    if (isActive) {
      p.play();
    }
  });

  useEventListener(player, "statusChange", ({ status }) => {
    if (status === "readyToPlay" && isActive) {
      player.play();
    }
  });

  useEffect(() => {
    if (!player) return;
    if (isActive) {
      player.play();
    } else {
      player.pause();
    }
  }, [isActive, player]);

  useEffect(() => {
    if (!player) return;
    player.muted = isMuted;
  }, [isMuted, player]);

  const handleToggleLike = useCallback(() => {
    const nextState = !isLiked;
    const nextDelta = nextState ? likeDelta + 1 : Math.max(0, likeDelta - 1);
    setIsLiked(nextState);
    setLikeDelta(nextDelta);
    StorageService.setLiked(item.id, nextState);
    StorageService.setLikeDelta(item.id, nextDelta);
  }, [isLiked, likeDelta, item.id]);

  const handleDoubleTap = useCallback(
    (x, y) => {
      heartBurstRef.current?.trigger(x, y);

      if (!isLiked) {
        const nextDelta = likeDelta + 1;
        setIsLiked(true);
        setLikeDelta(nextDelta);
        StorageService.setLiked(item.id, true);
        StorageService.setLikeDelta(item.id, nextDelta);
      }
    },
    [isLiked, likeDelta, item.id]
  );

  const handleSingleTap = useCallback(() => {
    if (!player) return;
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  const handleToggleUpscale = useCallback(() => {
    const nextUpscaled = !isUpscaled;
    setIsUpscaled(nextUpscaled);
    StorageService.setUpscaleEnabled(nextUpscaled);

    if (onTriggerToast) {
      onTriggerToast(nextUpscaled ? "Upscaled 1080p" : "Standard Quality");
    }
  }, [isUpscaled, onTriggerToast]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Watch ${item.handle} on LinkSphere: ${item.standardUrl}`,
      });
    } catch {}
  }, [item]);

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd((e) => {
      handleDoubleTap(e.x, e.y);
    })
    .runOnJS(true);

  const singleTapGesture = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      handleSingleTap();
    })
    .runOnJS(true);

  const composedGesture = Gesture.Exclusive(doubleTapGesture, singleTapGesture);

  return (
    <View style={[styles.container, { width, height }]}>
      <GestureDetector gesture={composedGesture}>
        <View style={StyleSheet.absoluteFill}>
          {player ? (
            <VideoView
              player={player}
              style={[StyleSheet.absoluteFill, { width, height }]}
              contentFit="cover"
              nativeControls={false}
            />
          ) : null}

          {!isUpscaled && (
            <>
              <BlurView
                intensity={28}
                tint="default"
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View
                pointerEvents="none"
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(10, 10, 14, 0.08)" },
                ]}
              />
            </>
          )}

          {isUpscaled && (
            <View pointerEvents="none" style={styles.clarityFilter} />
          )}

          <LinearGradient
            pointerEvents="none"
            colors={["rgba(10,10,14,0.3)", "transparent", "rgba(10,10,14,0.7)"]}
            locations={[0, 0.3, 1]}
            style={StyleSheet.absoluteFill}
          />
        </View>
      </GestureDetector>

      <HeartBurst ref={heartBurstRef} />

      <VideoControls
        item={item}
        height={height}
        width={width}
        isLiked={isLiked}
        likeCount={item.likes + likeDelta}
        isMuted={isMuted}
        isUpscaled={isUpscaled}
        onToggleLike={handleToggleLike}
        onToggleMute={onToggleMute}
        onToggleUpscale={handleToggleUpscale}
        onShare={handleShare}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  clarityFilter: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(6, 182, 212, 0.04)",
    borderWidth: 0.5,
    borderColor: "rgba(6, 182, 212, 0.2)",
  },
});
