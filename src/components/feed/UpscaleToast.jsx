import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { Sparkles } from "lucide-react-native";
import { COLORS, LAYOUT } from "../../constants/theme";

export const UpscaleToast = forwardRef((props, ref) => {
  const [toastText, setToastText] = useState("Upscaled 1080p");
  const [visible, setVisible] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const scale = useSharedValue(0.95);

  const hide = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    show: (text = "Upscaled 1080p") => {
      setToastText(text);
      setVisible(true);

      opacity.value = 0;
      translateY.value = -20;
      scale.value = 0.95;

      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(
          2000,
          withTiming(0, { duration: 300 }, (finished) => {
            if (finished) {
              runOnJS(hide)();
            }
          })
        )
      );

      translateY.value = withSequence(
        withSpring(0, { damping: 14, stiffness: 180 }),
        withDelay(2000, withTiming(-15, { duration: 300 }))
      );

      scale.value = withSequence(
        withSpring(1, { damping: 14, stiffness: 180 }),
        withDelay(2000, withTiming(0.95, { duration: 300 }))
      );
    },
  }));

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (!visible) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.container, animatedStyle]}>
      <View style={styles.hudCard}>
        <Sparkles size={16} color={COLORS.secondary} />
        <Text style={styles.text}>{toastText}</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
  },
  hudCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: LAYOUT.borderRadius.pill,
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
