import { createServerFn } from "@tanstack/react-start";
import { decode } from "html-entities";
import type {
  AudioMetadata,
  ImageMetadata,
  VideoMetadata,
} from "react-og-preview";

export const fetchPreview = createServerFn({ method: "GET" })
  .inputValidator((data: string) => data)
  .handler(async ({ data: url }) => {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
      },
    });

    const metadata: Partial<{
      url: string;
      title: string;
      description: string | null;
      image: ImageMetadata | null;
      video: VideoMetadata | null;
      audio: AudioMetadata | null;
      twitterCard: string | null;
    }> = { url };

    const imageMeta: Partial<ImageMetadata> = {};
    const videoMeta: Partial<VideoMetadata> = {};
    const audioMeta: Partial<AudioMetadata> = {};

    const rewriter = new HTMLRewriter()
      // Extract Open Graph meta tags
      .on('meta[property^="og:"]', {
        element(el) {
          const property = el.getAttribute("property");
          const content = el.getAttribute("content");
          if (property && content) {
            const key = property.replace("og:", "");
            if (key === "title") metadata.title = content;
            if (key === "description") metadata.description = content;
            // Image metadata
            if (key === "image" || key === "image:url") imageMeta.url = content;
            if (key === "image:secure_url") imageMeta.secureUrl = content;
            if (key === "image:type") imageMeta.type = content;
            if (key === "image:width")
              imageMeta.width = Number.parseInt(content, 10);
            if (key === "image:height")
              imageMeta.height = Number.parseInt(content, 10);
            if (key === "image:alt") imageMeta.alt = content;
            // Video metadata
            if (key === "video" || key === "video:url") videoMeta.url = content;
            if (key === "video:secure_url") videoMeta.secureUrl = content;
            if (key === "video:type") videoMeta.type = content;
            if (key === "video:width")
              videoMeta.width = Number.parseInt(content, 10);
            if (key === "video:height")
              videoMeta.height = Number.parseInt(content, 10);
            // Audio metadata
            if (key === "audio" || key === "audio:url") audioMeta.url = content;
            if (key === "audio:secure_url") audioMeta.secureUrl = content;
            if (key === "audio:type") audioMeta.type = content;
          }
        },
      })
      // Extract Twitter Card meta tags as fallback
      .on('meta[name^="twitter:"]', {
        element(el) {
          const name = el.getAttribute("name");
          const content = el.getAttribute("content");
          if (name && content) {
            const key = name.replace("twitter:", "");
            if (key === "card") metadata.twitterCard = content;
            if (key === "title" && !metadata.title) metadata.title = content;
            if (key === "description" && !metadata.description)
              metadata.description = content;
            if (key === "image" && !imageMeta.url) imageMeta.url = content;
            if (key === "image:alt" && !imageMeta.alt) imageMeta.alt = content;
            // Twitter player (video) metadata
            if (key === "player" && !videoMeta.url) videoMeta.url = content;
            if (key === "player:width" && !videoMeta.width)
              videoMeta.width = Number.parseInt(content, 10);
            if (key === "player:height" && !videoMeta.height)
              videoMeta.height = Number.parseInt(content, 10);
          }
        },
      })
      // Fallback to regular meta description
      .on('meta[name="description"]', {
        element(el) {
          const content = el.getAttribute("content");
          if (content && !metadata.description) {
            metadata.description = content;
          }
        },
      })
      // Fallback to title tag
      .on("title", {
        text(text) {
          if (!metadata.title && text.text.trim()) {
            metadata.title = (metadata.title ?? "") + text.text;
          }
        },
      });

    // Process the response
    await rewriter.transform(response).blob();

    // Resolve relative URLs
    const resolveUrl = (
      urlToResolve: string | undefined,
    ): string | undefined => {
      if (!urlToResolve) return undefined;
      if (urlToResolve.startsWith("http")) return urlToResolve;
      try {
        return new URL(urlToResolve, url).href;
      } catch {
        return urlToResolve;
      }
    };

    // Build image metadata if URL exists
    if (imageMeta.url) {
      imageMeta.url = resolveUrl(imageMeta.url);
      if (imageMeta.secureUrl) {
        imageMeta.secureUrl = resolveUrl(imageMeta.secureUrl);
      }
      metadata.image = imageMeta as ImageMetadata;
    }

    // Build video metadata if URL exists
    if (videoMeta.url) {
      videoMeta.url = resolveUrl(videoMeta.url);
      if (videoMeta.secureUrl) {
        videoMeta.secureUrl = resolveUrl(videoMeta.secureUrl);
      }
      metadata.video = videoMeta as VideoMetadata;
    }

    // Build audio metadata if URL exists
    if (audioMeta.url) {
      audioMeta.url = resolveUrl(audioMeta.url);
      if (audioMeta.secureUrl) {
        audioMeta.secureUrl = resolveUrl(audioMeta.secureUrl);
      }
      metadata.audio = audioMeta as AudioMetadata;
    }

    return {
      url,
      title: decode(metadata.title ?? new URL(url).hostname),
      description: metadata.description ? decode(metadata.description) : null,
      image: metadata.image ?? null,
      video: metadata.video ?? null,
      audio: metadata.audio ?? null,
      twitterCard: metadata.twitterCard ?? null,
    };
  });
