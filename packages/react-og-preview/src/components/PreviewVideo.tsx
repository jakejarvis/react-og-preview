import { lazy, Suspense, useEffect, useState } from "react";
import { PlayIcon } from "@/components/PlayIcon";
import { PreviewImage } from "@/components/PreviewImage";
import type {
  ImageComponentProps,
  ImageMetadata,
  VideoComponentProps,
  VideoMetadata,
} from "@/types";

import styles from "./PreviewVideo.module.css";

const ReactPlayer = lazy(() => import("react-player"));

interface PreviewVideoProps {
  video: VideoMetadata | string;
  poster?: ImageMetadata | string | null;
  width: number;
  height: number;
  placeholderClassName?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
  VideoComponent?: React.ComponentType<VideoComponentProps>;
  inline?: boolean;
}

function DefaultVideo({
  src,
  className,
  controls = true,
  muted = false,
  playsInline = true,
  onError,
}: VideoComponentProps) {
  return (
    <Suspense
      fallback={<div className={styles.loading}>Loading player...</div>}
    >
      <ReactPlayer
        src={src}
        controls={controls}
        muted={muted}
        playsInline={playsInline}
        width="100%"
        height="100%"
        className={className}
        onError={onError}
      />
    </Suspense>
  );
}

export function PreviewVideo({
  video,
  poster,
  width,
  height,
  placeholderClassName,
  ImageComponent,
  VideoComponent = DefaultVideo,
  inline = true,
}: PreviewVideoProps) {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = typeof video === "string" ? video : video.url;
  const posterUrl = typeof poster === "string" ? poster : poster?.url;

  // Reset error and playing state when the URL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on videoUrl change
  useEffect(() => {
    setHasError(false);
    setIsPlaying(false);
  }, [videoUrl]);

  if (hasError) {
    return (
      <PreviewImage
        src={poster}
        width={width}
        height={height}
        placeholderClassName={placeholderClassName}
        ImageComponent={ImageComponent}
      />
    );
  }

  if (!inline) {
    return (
      <div className={styles.container}>
        <PreviewImage
          src={poster}
          width={width}
          height={height}
          placeholderClassName={placeholderClassName}
          ImageComponent={ImageComponent}
        />
        <div className={styles.overlay}>
          <PlayIcon className={styles.playIcon} />
        </div>
      </div>
    );
  }

  if (!isPlaying && posterUrl) {
    return (
      <div className={styles.container}>
        <PreviewImage
          src={poster}
          width={width}
          height={height}
          placeholderClassName={placeholderClassName}
          ImageComponent={ImageComponent}
        />
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setIsPlaying(true)}
          aria-label="Play video"
        >
          <PlayIcon className={styles.playIcon} />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.videoWrapper}>
      <VideoComponent
        src={videoUrl}
        poster={posterUrl}
        width={width}
        height={height}
        className={styles.video}
        controls
        autoPlay={isPlaying}
        muted={false}
        playsInline
        onError={() => setHasError(true)}
      />
    </div>
  );
}
