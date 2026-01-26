import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  VideoMetadata,
} from "@/types";

import styles from "./LinkedInCard.module.css";

interface LinkedInCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

export function LinkedInCard({
  url,
  title,
  image,
  video,
  className,
  ImageComponent,
}: LinkedInCardProps) {
  const hostname = getHostname(url);

  const renderMedia = () => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={1200}
          height={627}
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
        height={627}
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
        <div className={styles.title}>{title || hostname}</div>
        <div className={styles.hostname}>{hostname}</div>
      </div>
    </div>
  );
}
