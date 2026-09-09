import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, LAYOUT } from "../../constants/theme";

export const GlassCard = ({
  children,
  style,
  intensity = 30,
  tint = "dark",
  borderRadius = LAYOUT.borderRadius.lg,
}) => {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <View style={{ borderRadius }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardGlass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: "hidden",
  },
});
