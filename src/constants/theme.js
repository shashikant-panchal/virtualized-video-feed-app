import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

export const COLORS = {
  background: "#0A0A0E",
  card: "#14141B",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  cardGlass: "rgba(255, 255, 255, 0.06)",
  primary: "#8B5CF6",
  secondary: "#06B6D4",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
};

export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
};
