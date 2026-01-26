import { PreviewAudio } from "@/components/PreviewAudio";
import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioComponentProps,
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  VideoMetadata,
} from "@/types";

import styles from "./SlackCard.module.css";

interface SlackCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
  AudioComponent?: React.ComponentType<AudioComponentProps>;
}

export function SlackCard({
  url,
  title,
  description,
  image,
  video,
  audio,
  className,
  ImageComponent,
  AudioComponent,
}: SlackCardProps) {
  const hostname = getHostname(url);

  const renderMedia = () => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={1200}
          height={675}
          placeholderClassName={styles.placeholder}
          ImageComponent={ImageComponent}
          inline={false}
        />
      );
    }

    return (
      <PreviewImage
        src={image}
        width={1200}
        height={675}
        placeholderClassName={styles.placeholder}
        ImageComponent={ImageComponent}
      />
    );
  };

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.border} />
      <div className={styles.hostname}>{hostname}</div>
      <div className={styles.title}>{title || hostname}</div>
      {description && <div className={styles.description}>{description}</div>}
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>{renderMedia()}</div>
      </div>
      {audio && (
        <div className={styles.audioContainer}>
          <PreviewAudio audio={audio} AudioComponent={AudioComponent} />
        </div>
      )}
    </div>
  );
}
