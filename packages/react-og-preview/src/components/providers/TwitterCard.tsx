import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  TwitterVariant,
  VideoMetadata,
} from "@/types";

import styles from "./TwitterCard.module.css";

interface TwitterCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  variant?: TwitterVariant;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

export function TwitterCard({
  url,
  title,
  description,
  image,
  video,
  variant = "compact",
  className,
  ImageComponent,
}: TwitterCardProps) {
  const hostname = getHostname(url);

  const renderMedia = (width: number, height: number) => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={width}
          height={height}
          placeholderClassName={styles.placeholderLight}
          ImageComponent={ImageComponent}
          inline={false}
        />
      );
    }

    return (
      <PreviewImage
        src={image}
        width={width}
        height={height}
        placeholderClassName={styles.placeholderLight}
        ImageComponent={ImageComponent}
      />
    );
  };

  if (variant === "compact") {
    return (
      <div className={`${styles.card} ${className ?? ""}`}>
        <div className={styles.compactLayout}>
          <div className={styles.compactImageContainer}>
            {renderMedia(240, 240)}
          </div>
          <div className={styles.compactContent}>
            <div className={styles.hostname}>{hostname}</div>
            <div className={`${styles.title} ${styles.titleCompact}`}>
              {title || hostname}
            </div>
            {description && (
              <div className={styles.description}>{description}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      <div className={styles.largeImageContainer}>
        <div className={styles.largeImageWrapper}>{renderMedia(1200, 675)}</div>
      </div>
      <div className={styles.largeContent}>
        <div className={styles.hostname}>{hostname}</div>
        <div className={`${styles.title} ${styles.titleLarge}`}>
          {title || hostname}
        </div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
}
