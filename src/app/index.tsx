import React from "react";
import { StyleSheet, View } from "react-native";
import { VideoFeed } from "../components/feed/VideoFeed";
import { COLORS } from "../constants/theme";

export default function FeedScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <VideoFeed />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
