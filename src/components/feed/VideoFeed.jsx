import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { INITIAL_FEED_ITEMS } from "../../constants/mockData";
import { LAYOUT, COLORS } from "../../constants/theme";
import { StorageService } from "../../services/storage";
import { VideoCacheService } from "../../services/videoCache";
import { VideoCard } from "./VideoCard";
import { SponsoredCard } from "./SponsoredCard";
import { SkeletonPlaceholder } from "./SkeletonPlaceholder";
import { UpscaleToast } from "./UpscaleToast";

export const VideoFeed = () => {
  const [feedData, setFeedData] = useState(INITIAL_FEED_ITEMS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    VideoCacheService.preloadUrls(INITIAL_FEED_ITEMS);
  }, []);
  const [isMuted, setIsMuted] = useState(() => StorageService.isMuted());
  const [feedDimensions, setFeedDimensions] = useState({
    width: LAYOUT.screenWidth,
    height: LAYOUT.screenHeight,
  });

  const upscaleToastRef = useRef(null);
  const loopCountRef = useRef(1);

  const handleLayout = useCallback((e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setFeedDimensions((prev) => {
        if (
          Math.abs(prev.height - height) > 1 ||
          Math.abs(prev.width - width) > 1
        ) {
          return { width, height };
        }
        return prev;
      });
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      StorageService.setMuted(next);
      return next;
    });
  }, []);

  const handleTriggerToast = useCallback((text) => {
    upscaleToastRef.current?.show(text);
  }, []);

  const handleEndReached = useCallback(() => {
    const nextBatch = INITIAL_FEED_ITEMS.map((item) => ({
      ...item,
      id: `${item.id}_loop_${loopCountRef.current}`,
    }));
    loopCountRef.current += 1;
    setFeedData((prev) => [...prev, ...nextBatch]);
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const topItem = viewableItems[0];
      if (topItem && typeof topItem.index === "number") {
        setActiveIndex(topItem.index);
      }
    }
  });

  const renderItem = useCallback(
    ({ item, index }) => {
      if (item.type === "sponsored") {
        return (
          <SponsoredCard
            item={item}
            height={feedDimensions.height}
            width={feedDimensions.width}
          />
        );
      }

      if (Math.abs(index - activeIndex) > 1) {
        return (
          <SkeletonPlaceholder
            height={feedDimensions.height}
            width={feedDimensions.width}
          />
        );
      }

      return (
        <VideoCard
          item={item}
          isActive={index === activeIndex}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onTriggerToast={handleTriggerToast}
          height={feedDimensions.height}
          width={feedDimensions.width}
        />
      );
    },
    [feedDimensions, activeIndex, isMuted, handleToggleMute, handleTriggerToast]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <FlashList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={feedDimensions.height}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        drawDistance={feedDimensions.height * 2}
        disableAutoLayout
      />

      <UpscaleToast ref={upscaleToastRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
