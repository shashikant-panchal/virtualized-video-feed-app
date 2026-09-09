import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View, LayoutChangeEvent, ViewToken } from "react-native";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { INITIAL_FEED_ITEMS } from "../../constants/mockData";
import { LAYOUT, COLORS } from "../../constants/theme";
import { StorageService } from "../../services/storage";
import { VideoCacheService } from "../../services/videoCache";
import { VideoCard } from "./VideoCard";
import { SponsoredCard } from "./SponsoredCard";
import { SkeletonPlaceholder } from "./SkeletonPlaceholder";
import { UpscaleToast } from "./UpscaleToast";
import { FeedItem, UpscaleToastRef } from "../../types/feed";

export const VideoFeed: React.FC = () => {
  const [feedData, setFeedData] = useState<FeedItem[]>(
    INITIAL_FEED_ITEMS as FeedItem[]
  );
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    VideoCacheService.preloadUrls(INITIAL_FEED_ITEMS);
  }, []);

  const [isMuted, setIsMuted] = useState<boolean>(() => StorageService.isMuted());
  const [feedDimensions, setFeedDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: LAYOUT.screenWidth,
    height: LAYOUT.screenHeight,
  });

  const upscaleToastRef = useRef<UpscaleToastRef | null>(null);
  const loopCountRef = useRef<number>(1);

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
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

  const handleTriggerToast = useCallback((text: string) => {
    upscaleToastRef.current?.show(text);
  }, []);

  const handleEndReached = useCallback(() => {
    const nextBatch = (INITIAL_FEED_ITEMS as FeedItem[]).map((item) => ({
      ...item,
      id: `${item.id}_loop_${loopCountRef.current}`,
    }));
    loopCountRef.current += 1;
    setFeedData((prev) => [...prev, ...nextBatch]);
  }, []);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const topItem = viewableItems[0];
        if (topItem && typeof topItem.index === "number") {
          setActiveIndex(topItem.index);
        }
      }
    }
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<FeedItem>) => {
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

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <FlashList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        drawDistance={feedDimensions.height * 2}
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
