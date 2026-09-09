export interface VideoFeedItem {
  id: string;
  type: "video";
  handle: string;
  description: string;
  standardUrl: string;
  upscaledUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface SponsoredFeedItem {
  id: string;
  type: "sponsored";
  brand: string;
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
}

export type FeedItem = VideoFeedItem | SponsoredFeedItem;

export interface UpscaleToastRef {
  show: (text?: string) => void;
}
