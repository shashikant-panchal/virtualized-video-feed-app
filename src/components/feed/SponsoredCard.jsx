import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Share2, Sparkles } from "lucide-react-native";
import { COLORS, LAYOUT } from "../../constants/theme";
import { GlassCard } from "../ui/GlassCard";

export const SponsoredCard = ({
  item,
  height = LAYOUT.screenHeight,
  width = LAYOUT.screenWidth,
}) => {
  const insets = useSafeAreaInsets();

  const handleOpenAd = () => {
    if (item.ctaUrl) {
      Linking.openURL(item.ctaUrl).catch(() => {});
    }
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: item.imageUrl }}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["rgba(10,10,14,0.3)", "transparent", "rgba(10,10,14,0.9)"]}
        locations={[0, 0.4, 0.9]}
        style={[StyleSheet.absoluteFill, { width, height }]}
      />

      <View
        style={[
          styles.topHeader,
          { paddingTop: Math.max(insets.top + 8, 48) },
        ]}
      >
        <View style={styles.badge}>
          <Sparkles size={12} color={COLORS.secondary} />
          <Text style={styles.badgeText}>SPONSORED</Text>
        </View>
      </View>

      <View style={styles.rightActions}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleOpenAd}
          style={styles.actionBtn}
        >
          <View style={styles.iconCircle}>
            <Share2 size={20} color={COLORS.textPrimary} />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.bottomContent,
          { paddingBottom: Math.max(insets.bottom + 16, 32) },
        ]}
      >
        <GlassCard style={styles.card}>
          <View style={styles.cardInner}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenAd}
              style={styles.ctaButton}
            >
              <Text style={styles.ctaText}>{item.ctaText || "Learn More"}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  topHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardGlass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: LAYOUT.borderRadius.pill,
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: 0.5,
  },
  rightActions: {
    position: "absolute",
    right: 14,
    bottom: 240,
    gap: 16,
    zIndex: 10,
  },
  actionBtn: {
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.cardGlass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
  },
  cardInner: {
    padding: 16,
    gap: 8,
  },
  brand: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: LAYOUT.borderRadius.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  ctaText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },
});
