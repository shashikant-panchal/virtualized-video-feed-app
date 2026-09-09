import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { Heart } from "lucide-react-native";
import { COLORS } from "../../constants/theme";

export interface HeartBurstRef {
  trigger: (x: number, y: number) => void;
}

interface HeartBurstProps {
  size?: number;
}

export const HeartBurst = forwardRef<HeartBurstRef, HeartBurstProps>(
  ({ size = 96 }, ref) => {
    const [coords, setCoords] = useState<{ x: number; y: number }>({
      x: 0,
      y: 0,
    });
    const [visible, setVisible] = useState<boolean>(false);

    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const rotate = useSharedValue(0);

    const resetVisibility = () => {
      setVisible(false);
    };

    useImperativeHandle(ref, () => ({
      trigger: (x: number, y: number) => {
        setCoords({ x, y });
        setVisible(true);

        scale.value = 0;
        translateY.value = 0;
        opacity.value = 1;
        rotate.value = (Math.random() - 0.5) * 30;

        scale.value = withSequence(
          withSpring(1.25, { damping: 7, stiffness: 220 }),
          withTiming(1, { duration: 150 })
        );

        translateY.value = withTiming(-70, { duration: 750 });

        opacity.value = withSequence(
          withTiming(1, { duration: 250 }),
          withTiming(0, { duration: 500 }, (finished) => {
            if (finished) {
              runOnJS(resetVisibility)();
            }
          })
        );
      },
    }));

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { scale: scale.value },
          { translateY: translateY.value },
          { rotate: `${rotate.value}deg` },
        ],
        opacity: opacity.value,
      };
    });

    if (!visible) return null;

    return (
      <View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            left: coords.x ? coords.x - size / 2 : "50%",
            top: coords.y ? coords.y - size / 2 : "50%",
            marginLeft: coords.x ? 0 : -size / 2,
            marginTop: coords.y ? 0 : -size / 2,
          },
        ]}
      >
        <Animated.View style={[styles.heartContainer, animatedStyle]}>
          <Heart size={size} color={COLORS.primary} fill={COLORS.primary} />
        </Animated.View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
