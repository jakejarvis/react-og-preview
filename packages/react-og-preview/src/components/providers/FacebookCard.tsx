import { PreviewAudio } from "@/components/PreviewAudio";
import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioComponentProps,
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  VideoComponentProps,
  VideoMetadata,
} from "@/types";

import styles from "./FacebookCard.module.css";

interface FacebookCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
  VideoComponent?: React.ComponentType<VideoComponentProps>;
  AudioComponent?: React.ComponentType<AudioComponentProps>;
}

export function FacebookCard({
  url,
  title,
  description,
  image,
  video,
  audio,
  className,
  ImageComponent,
  VideoComponent,
  AudioComponent,
}: FacebookCardProps) {
  const hostname = getHostname(url);

  const renderMedia = () => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={1200}
          height={628}
          placeholderClassName={styles.placeholder}
          ImageComponent={ImageComponent}
          VideoComponent={VideoComponent}
          inline
        />
      );
    }

    return (
      <PreviewImage
        src={image}
        width={1200}
        height={628}
        placeholderClassName={styles.placeholder}
        ImageComponent={ImageComponent}
      />
    );
  };

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>{renderMedia()}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.hostname}>{hostname}</div>
        <div className={styles.title}>{title || hostname}</div>
        {description && <div className={styles.description}>{description}</div>}
        {audio && (
          <div className={styles.audioContainer}>
            <PreviewAudio audio={audio} AudioComponent={AudioComponent} />
          </div>
        )}
      </div>
    </div>
  );
}
