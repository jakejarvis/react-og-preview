# [react-og-preview](https://react-og-preview.vercel.app)

[![npm version](https://img.shields.io/npm/v/react-og-preview.svg)](https://www.npmjs.com/package/react-og-preview)
[![license](https://img.shields.io/npm/l/react-og-preview.svg)](https://github.com/jakejarvis/react-og-preview/blob/main/LICENSE)

> A library of pixel-perfect React components for previewing Open Graph links shared to social media platforms.

**[Live Demo](https://react-og-preview.vercel.app)**

## Supported Platforms

- **Twitter/X** — both compact and large variants
- **Facebook**
- **LinkedIn**
- **Slack**
- **Discord**
- more soon...

## Installation

```bash
pnpm install react-og-preview
```

## Setup

Import the styles once in your app's entry point:

```tsx
import "react-og-preview/styles.css";
```

## Quick Start

```tsx
import { SocialPreview } from "react-og-preview";

function App() {
  return (
    <SocialPreview
      provider="twitter"
      variant="large"
      url="https://example.com/article"
      title="Amazing Article Title"
      description="This is a preview of what your link will look like when shared."
      image="https://example.com/og-image.jpg"
    />
  );
}
```

## API Reference

### `<SocialPreview />`

The main component that renders a preview card for the specified social platform.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `provider` | `"twitter"` \| `"facebook"` \| `"linkedin"` \| `"slack"` \| `"discord"` | — | **Required.** The social platform to preview. |
| `url` | `string` | — | **Required.** The canonical URL being previewed. |
| `title` | `string \| null` | — | **Required.** The page title (`og:title`). |
| `description` | `string \| null` | — | Optional description text (`og:description`). |
| `image` | `string \| ImageMetadata \| null` | — | Image URL or metadata object (`og:image`). |
| `video` | `string \| VideoMetadata \| null` | — | Video URL or metadata object (`og:video`). |
| `audio` | `string \| AudioMetadata \| null` | — | Audio URL or metadata object (`og:audio`). |
| `variant` | `"compact"` \| `"large"` | `"large"` | Twitter only. Card style (`summary` vs `summary_large_image`). |
| `className` | `string` | — | Additional CSS classes for the card container. |
| `disableLink` | `boolean` | `false` | Renders without an anchor wrapper for non-interactive use. |
| `ImageComponent` | `React.ComponentType` | — | Custom component for rendering images. |
| `VideoComponent` | `React.ComponentType` | — | Custom component for rendering videos. |
| `AudioComponent` | `React.ComponentType` | — | Custom component for rendering audio. |

### Metadata Types

For structured Open Graph metadata, you can pass objects instead of URL strings:

```tsx
interface ImageMetadata {
  url: string;
  secureUrl?: string;
  type?: string;      // e.g., "image/jpeg"
  width?: number;
  height?: number;
  alt?: string;
}

interface VideoMetadata {
  url: string;
  secureUrl?: string;
  type?: string;      // e.g., "video/mp4"
  width?: number;
  height?: number;
}

interface AudioMetadata {
  url: string;
  secureUrl?: string;
  type?: string;      // e.g., "audio/mpeg"
}
```

## Dark Mode

Add a `dark` class to any parent element to enable dark mode styles:

```tsx
<div className="dark">
  <SocialPreview provider="twitter" ... />
</div>
```

## Custom Components

### Custom Image Component

Integrate with image optimization libraries like Next.js Image:

```tsx
import Image from "next/image";
import { SocialPreview } from "react-og-preview";

<SocialPreview
  provider="facebook"
  url="https://example.com"
  title="My Article"
  ImageComponent={({ src, alt, width, height, className, onError }) => (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 630}
      className={className}
      onError={onError}
    />
  )}
/>
```

### Custom Video Component

Replace the default [react-player](https://github.com/cookpete/react-player) with your own video player:

```tsx
<SocialPreview
  provider="discord"
  url="https://example.com"
  title="Video Post"
  video="https://example.com/video.mp4"
  VideoComponent={({ src, poster, controls, className }) => (
    <video
      src={src}
      poster={poster}
      controls={controls}
      className={className}
    />
  )}
/>
```

### Custom Audio Component

```tsx
<SocialPreview
  provider="slack"
  url="https://example.com"
  title="Podcast Episode"
  audio="https://example.com/episode.mp3"
  AudioComponent={({ src, controls, className }) => (
    <audio src={src} controls={controls} className={className} />
  )}
/>
```

## Individual Provider Components

For better tree-shaking, import individual provider cards directly:

```tsx
import {
  TwitterCard,
  FacebookCard,
  LinkedInCard,
  SlackCard,
  DiscordCard,
} from "react-og-preview";

<TwitterCard
  url="https://example.com"
  title="My Tweet"
  variant="large"
/>
```

## License

[MIT](LICENSE)
