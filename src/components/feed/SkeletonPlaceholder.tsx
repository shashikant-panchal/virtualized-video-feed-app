import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { COLORS, LAYOUT } from "../../constants/theme";

interface SkeletonPlaceholderProps {
  height?: number;
  width?: number;
}

export const SkeletonPlaceholder: React.FC<SkeletonPlaceholderProps> = ({
  height = LAYOUT.screenHeight,
  width = LAYOUT.screenWidth,
}) => {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.65, {
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backgroundFill, animatedStyle]}
      />

      <View
        style={[
          styles.rightActions,
          { bottom: Math.max(insets.bottom + 48, 64) },
        ]}
      >
        <View style={styles.avatarSkeleton} />
        <View style={styles.iconSkeleton} />
        <View style={styles.iconSkeleton} />
        <View style={styles.iconSkeleton} />
        <View style={styles.iconSkeleton} />
      </View>

      <View
        style={[
          styles.bottomMeta,
          { paddingBottom: Math.max(insets.bottom + 14, 24) },
        ]}
      >
        <View style={styles.titleBarSkeleton} />
        <View style={styles.captionBarSkeleton} />
        <View style={styles.shortBarSkeleton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  backgroundFill: {
    backgroundColor: COLORS.card,
  },
  rightActions: {
    position: "absolute",
    right: 12,
    alignItems: "center",
    gap: 16,
  },
  avatarSkeleton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 4,
  },
  iconSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  bottomMeta: {
    paddingHorizontal: 16,
    gap: 10,
    maxWidth: "75%",
  },
  titleBarSkeleton: {
    width: 140,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  captionBarSkeleton: {
    width: 240,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  shortBarSkeleton: {
    width: 160,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
});
