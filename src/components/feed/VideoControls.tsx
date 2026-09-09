import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
} from "lucide-react-native";
import { COLORS, LAYOUT } from "../../constants/theme";
import { VideoFeedItem } from "../../types/feed";

const formatCount = (num: number): string => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return String(num);
};

interface VideoControlsProps {
  item: VideoFeedItem;
  height: number;
  width: number;
  isLiked: boolean;
  likeCount: number;
  isUpscaled: boolean;
  isMuted: boolean;
  onToggleLike: () => void;
  onToggleUpscale: () => void;
  onToggleMute: () => void;
  onShare: () => void;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  item,
  height,
  width,
  isLiked,
  likeCount,
  isUpscaled,
  isMuted,
  onToggleLike,
  onToggleUpscale,
  onToggleMute,
  onShare,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlayContainer, { width, height }]}
    >
      <LinearGradient
        colors={["rgba(10,10,14,0.5)", "transparent"]}
        style={[styles.topGradient, { height: insets.top + 60 }]}
        pointerEvents="none"
      />

      <LinearGradient
        colors={["transparent", "rgba(10,10,14,0.85)"]}
        style={[styles.bottomGradient, { height: 200 + insets.bottom }]}
        pointerEvents="none"
      />

      <View
        pointerEvents="box-none"
        style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 16) }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleUpscale}
          style={[
            styles.upscaleButton,
            isUpscaled && styles.upscaleButtonActive,
          ]}
        >
          <Sparkles
            size={16}
            color={isUpscaled ? COLORS.secondary : COLORS.textPrimary}
          />
          <Text
            style={[
              styles.upscaleText,
              isUpscaled && styles.upscaleTextActive,
            ]}
          >
            {isUpscaled ? "AI HD ON" : "AI Upscale / HD"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onToggleMute}
          style={styles.soundButton}
        >
          {isMuted ? (
            <VolumeX size={18} color={COLORS.textPrimary} />
          ) : (
            <Volume2 size={18} color={COLORS.textPrimary} />
          )}
        </TouchableOpacity>
      </View>

      <View
        pointerEvents="box-none"
        style={[
          styles.bottomSection,
          { paddingBottom: Math.max(insets.bottom + 16, 28) },
        ]}
      >
        <View pointerEvents="box-none" style={styles.metaContainer}>
          <Text style={styles.handle}>{item.handle}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.actionsRail}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggleLike}
            style={styles.actionItem}
          >
            <View style={styles.iconCircle}>
              <Heart
                size={22}
                color={isLiked ? COLORS.primary : COLORS.textPrimary}
                fill={isLiked ? COLORS.primary : "transparent"}
              />
            </View>
            <Text style={styles.actionLabel}>{formatCount(likeCount)}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.actionItem}>
            <View style={styles.iconCircle}>
              <MessageCircle size={22} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>{formatCount(item.comments)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onShare}
            style={styles.actionItem}
          >
            <View style={styles.iconCircle}>
              <Share2 size={22} color={COLORS.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>{formatCount(item.shares)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "space-between",
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  upscaleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardGlass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: LAYOUT.borderRadius.pill,
    gap: 6,
  },
  upscaleButtonActive: {
    borderColor: COLORS.secondary,
    backgroundColor: "rgba(6, 182, 212, 0.12)",
  },
  upscaleText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  upscaleTextActive: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
  soundButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cardGlass,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  metaContainer: {
    flex: 1,
    marginRight: 16,
    gap: 6,
  },
  handle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  actionsRail: {
    alignItems: "center",
    gap: 16,
  },
  actionItem: {
    alignItems: "center",
    gap: 4,
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
  actionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
});
