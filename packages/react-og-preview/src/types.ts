/**
 * Supported social media platforms for preview cards.
 *
 * Each provider renders a card that matches the visual style of that platform's
 * link preview appearance.
 */
export type SocialPreviewProvider =
  | "twitter"
  | "facebook"
  | "linkedin"
  | "slack"
  | "discord"
  | "bluesky"
  | "mastodon"
  | "whatsapp";

/**
 * Display variants for Twitter/X preview cards.
 *
 * - `"large"` - Shows a large image above the text content (summary_large_image)
 * - `"compact"` - Shows a small square image beside the text content (summary)
 *
 * @see https://developer.x.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 */
export type TwitterVariant = "compact" | "large";

/**
 * Display variants for Mastodon preview cards.
 *
 * - `"compact"` - Horizontal layout with square thumbnail on the left
 * - `"expanded"` - Vertical layout with full-width image on top
 */
export type MastodonVariant = "compact" | "expanded";

/**
 * Props passed to custom image components.
 *
 * Use this interface when providing a custom `ImageComponent` to the preview,
 * such as Next.js Image or a lazy-loading image component.
 *
 * @example
 * ```tsx
 * import Image from "next/image";
 *
 * const NextImage = ({ src, alt, width, height, ...props }: ImageComponentProps) => (
 *   <Image src={src} alt={alt} width={width} height={height} {...props} />
 * );
 *
 * <SocialPreview ImageComponent={NextImage} ... />
 * ```
 */
export interface ImageComponentProps {
  /** The image URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Intrinsic width of the image in pixels */
  width?: number;
  /** Intrinsic height of the image in pixels */
  height?: number;
  /** CSS class name(s) to apply to the image */
  className?: string;
  /** Inline styles to apply to the image */
  style?: React.CSSProperties;
  /** Callback fired when the image fails to load */
  onError?: () => void;
  /** Loading strategy for the image */
  loading?: "lazy" | "eager";
  /** Whether the image can be dragged */
  draggable?: boolean;
}

/**
 * Metadata for an Open Graph image.
 *
 * Corresponds to the `og:image` meta tags. You can pass either this object
 * or a simple URL string to the `image` prop.
 *
 * @see https://ogp.me/#structured
 */
export interface ImageMetadata {
  /** The image URL (corresponds to `og:image`) */
  url: string;
  /** HTTPS URL for the image (corresponds to `og:image:secure_url`) */
  secureUrl?: string;
  /** MIME type of the image, e.g. `"image/jpeg"` (corresponds to `og:image:type`) */
  type?: string;
  /** Width of the image in pixels (corresponds to `og:image:width`) */
  width?: number;
  /** Height of the image in pixels (corresponds to `og:image:height`) */
  height?: number;
  /** Alt text for the image (corresponds to `og:image:alt`) */
  alt?: string;
}

/**
 * Metadata for an Open Graph video.
 *
 * Corresponds to the `og:video` meta tags. You can pass either this object
 * or a simple URL string to the `video` prop.
 *
 * @see https://ogp.me/#structured
 */
export interface VideoMetadata {
  /** The video URL (corresponds to `og:video`) */
  url: string;
  /** HTTPS URL for the video (corresponds to `og:video:secure_url`) */
  secureUrl?: string;
  /** MIME type of the video, e.g. `"video/mp4"` (corresponds to `og:video:type`) */
  type?: string;
  /** Width of the video in pixels (corresponds to `og:video:width`) */
  width?: number;
  /** Height of the video in pixels (corresponds to `og:video:height`) */
  height?: number;
}

/**
 * Metadata for an Open Graph audio file.
 *
 * Corresponds to the `og:audio` meta tags. You can pass either this object
 * or a simple URL string to the `audio` prop.
 *
 * @see https://ogp.me/#structured
 */
export interface AudioMetadata {
  /** The audio URL (corresponds to `og:audio`) */
  url: string;
  /** HTTPS URL for the audio (corresponds to `og:audio:secure_url`) */
  secureUrl?: string;
  /** MIME type of the audio, e.g. `"audio/mpeg"` (corresponds to `og:audio:type`) */
  type?: string;
}

/**
 * Props passed to custom video components.
 *
 * Use this interface when providing a custom `VideoComponent` to the preview,
 * such as a custom video player or streaming component.
 *
 * @example
 * ```tsx
 * const CustomPlayer = ({ src, poster, controls, ...props }: VideoComponentProps) => (
 *   <video src={src} poster={poster} controls={controls} {...props} />
 * );
 *
 * <SocialPreview VideoComponent={CustomPlayer} ... />
 * ```
 */
export interface VideoComponentProps {
  /** The video URL */
  src: string;
  /** URL of the poster image to show before playback */
  poster?: string;
  /** Width of the video player in pixels */
  width?: number;
  /** Height of the video player in pixels */
  height?: number;
  /** CSS class name(s) to apply to the video element */
  className?: string;
  /** Whether to show playback controls */
  controls?: boolean;
  /** Whether to start playing automatically */
  autoPlay?: boolean;
  /** Whether to mute the audio */
  muted?: boolean;
  /** Whether to play inline on mobile devices (vs fullscreen) */
  playsInline?: boolean;
  /** Callback fired when the video fails to load */
  onError?: () => void;
}

/**
 * Props passed to custom audio components.
 *
 * Use this interface when providing a custom `AudioComponent` to the preview,
 * such as a custom audio player.
 *
 * @example
 * ```tsx
 * const CustomAudioPlayer = ({ src, controls, ...props }: AudioComponentProps) => (
 *   <audio src={src} controls={controls} {...props} />
 * );
 *
 * <SocialPreview AudioComponent={CustomAudioPlayer} ... />
 * ```
 */
export interface AudioComponentProps {
  /** The audio URL */
  src: string;
  /** CSS class name(s) to apply to the audio element */
  className?: string;
  /** Whether to show playback controls */
  controls?: boolean;
  /** Whether to start playing automatically */
  autoPlay?: boolean;
  /** Callback fired when the audio fails to load */
  onError?: () => void;
}

/**
 * Base props shared by all social preview components.
 *
 * These props correspond to standard Open Graph meta tags and are used
 * across all provider-specific preview cards.
 */
export interface SocialPreviewBaseProps {
  /**
   * The canonical URL of the page being previewed.
   * Corresponds to `og:url`.
   */
  url: string;

  /**
   * The title of the page.
   * Corresponds to `og:title`.
   */
  title: string | null;

  /**
   * A brief description of the page content.
   * Corresponds to `og:description`.
   */
  description?: string | null;

  /**
   * The preview image for the page.
   * Can be a URL string or an {@link ImageMetadata} object with additional properties.
   * Corresponds to `og:image`.
   */
  image?: ImageMetadata | string | null;

  /**
   * An optional video to display in the preview.
   * Can be a URL string or a {@link VideoMetadata} object with additional properties.
   * Corresponds to `og:video`.
   *
   * Note: Not all providers support video previews.
   */
  video?: VideoMetadata | string | null;

  /**
   * An optional audio file to display in the preview.
   * Can be a URL string or an {@link AudioMetadata} object with additional properties.
   * Corresponds to `og:audio`.
   *
   * Note: Not all providers support audio previews.
   */
  audio?: AudioMetadata | string | null;

  /**
   * Additional CSS class name(s) to apply to the preview card container.
   */
  className?: string;

  /**
   * When `true`, renders the preview card without an anchor link wrapper.
   * Useful when you want to handle click behavior yourself or display
   * the preview in a non-interactive context.
   *
   * @default false
   */
  disableLink?: boolean;

  /**
   * Custom component to use for rendering images.
   * Useful for integrating with image optimization libraries like Next.js Image.
   *
   * @see {@link ImageComponentProps} for the props a custom image component will receive
   */
  ImageComponent?: React.ComponentType<ImageComponentProps>;

  /**
   * Custom component to use for rendering videos.
   * Useful for integrating with custom video players.
   *
   * @default Uses [react-player](https://github.com/cookpete/react-player) which supports YouTube, Vimeo, and many other sources
   * @see {@link VideoComponentProps} for the props a custom video player will receive
   */
  VideoComponent?: React.ComponentType<VideoComponentProps>;

  /**
   * Custom component to use for rendering audio.
   * Useful for integrating with custom audio players.
   *
   * @default Uses [react-player](https://github.com/cookpete/react-player) which supports SoundCloud, Mixcloud, and direct audio files
   * @see {@link AudioComponentProps} for the props a custom audio player will receive
   */
  AudioComponent?: React.ComponentType<AudioComponentProps>;
}

/**
 * Props for Twitter/X preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="twitter"
 *   variant="large"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface TwitterPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Twitter/X provider */
  provider: "twitter";

  /**
   * The card variant to display.
   * - `"large"` - Large image card (summary_large_image)
   * - `"compact"` - Small image card (summary)
   *
   * @default "large"
   */
  variant?: TwitterVariant;
}

/**
 * Props for Facebook preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="facebook"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface FacebookPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Facebook provider */
  provider: "facebook";
}

/**
 * Props for LinkedIn preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="linkedin"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface LinkedInPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the LinkedIn provider */
  provider: "linkedin";
}

/**
 * Props for Slack preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="slack"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface SlackPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Slack provider */
  provider: "slack";
}

/**
 * Props for Discord preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="discord"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface DiscordPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Discord provider */
  provider: "discord";
}

/**
 * Props for Bluesky preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="bluesky"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface BlueskyPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Bluesky provider */
  provider: "bluesky";
}

/**
 * Props for Mastodon preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="mastodon"
 *   variant="expanded"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface MastodonPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the Mastodon provider */
  provider: "mastodon";

  /**
   * The card variant to display.
   * - `"compact"` - Horizontal layout with square thumbnail on the left
   * - `"expanded"` - Vertical layout with full-width image on top
   *
   * @default "compact"
   */
  variant?: MastodonVariant;
}

/**
 * Props for WhatsApp preview cards.
 *
 * @example
 * ```tsx
 * <SocialPreview
 *   provider="whatsapp"
 *   url="https://example.com"
 *   title="My Page Title"
 *   description="A description of my page"
 *   image="https://example.com/og-image.jpg"
 * />
 * ```
 */
export interface WhatsAppPreviewProps extends SocialPreviewBaseProps {
  /** Specifies the WhatsApp provider */
  provider: "whatsapp";
}

/**
 * Props for the `SocialPreview` component.
 *
 * This is a discriminated union type based on the `provider` prop.
 * TypeScript will narrow the available props based on which provider you specify.
 *
 * @example
 * ```tsx
 * // Twitter with variant
 * <SocialPreview provider="twitter" variant="large" ... />
 *
 * // Facebook (no variant option)
 * <SocialPreview provider="facebook" ... />
 * ```
 */
export type SocialPreviewProps =
  | TwitterPreviewProps
  | FacebookPreviewProps
  | LinkedInPreviewProps
  | SlackPreviewProps
  | DiscordPreviewProps
  | BlueskyPreviewProps
  | MastodonPreviewProps
  | WhatsAppPreviewProps;
