import { lazy, Suspense, useEffect, useState } from "react";
import type { AudioComponentProps, AudioMetadata } from "@/types";

import styles from "./PreviewAudio.module.css";

const ReactPlayer = lazy(() => import("react-player"));

interface PreviewAudioProps {
  audio: AudioMetadata | string;
  className?: string;
  AudioComponent?: React.ComponentType<AudioComponentProps>;
}

function DefaultAudio({
  src,
  className,
  controls = true,
  onError,
}: AudioComponentProps) {
  return (
    <Suspense
      fallback={<div className={styles.loading}>Loading player...</div>}
    >
      <ReactPlayer
        src={src}
        controls={controls}
        width="100%"
        height="100%"
        className={className}
        onError={onError}
      />
    </Suspense>
  );
}

export function PreviewAudio({
  audio,
  className,
  AudioComponent = DefaultAudio,
}: PreviewAudioProps) {
  const [hasError, setHasError] = useState(false);

  const audioUrl = typeof audio === "string" ? audio : audio.url;

  // Reset error state when the URL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on audioUrl change
  useEffect(() => {
    setHasError(false);
  }, [audioUrl]);

  if (hasError) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className ?? ""}`}>
      <AudioComponent
        src={audioUrl}
        className={styles.audio}
        controls
        onError={() => setHasError(true)}
      />
    </div>
  );
}
