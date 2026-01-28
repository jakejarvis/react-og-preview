import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  MastodonVariant,
  VideoMetadata,
} from "@/types";

import styles from "./MastodonCard.module.css";

interface MastodonCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  variant?: MastodonVariant;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

export function MastodonCard({
  url,
  title,
  description,
  image,
  video,
  variant = "compact",
  className,
  ImageComponent,
}: MastodonCardProps) {
  const hostname = getHostname(url);
  const hasMedia = !!(image || video);

  const renderMedia = (width: number, height: number) => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={width}
          height={height}
          placeholderClassName={styles.placeholder}
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
        placeholderClassName={styles.placeholder}
        ImageComponent={ImageComponent}
      />
    );
  };

  if (variant === "expanded") {
    return (
      <div className={`${styles.card} ${styles.expanded} ${className ?? ""}`}>
        {hasMedia && (
          <div className={styles.expandedImageContainer}>
            <div className={styles.expandedImageWrapper}>
              {renderMedia(1200, 630)}
            </div>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.hostname}>{hostname}</div>
          <div className={`${styles.title} ${styles.titleExpanded}`}>
            {title || hostname}
          </div>
          {description && (
            <div className={styles.description}>{description}</div>
          )}
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div className={`${styles.card} ${styles.compact} ${className ?? ""}`}>
      {hasMedia && (
        <div className={styles.compactImageContainer}>
          {renderMedia(120, 120)}
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.hostname}>{hostname}</div>
        <div className={`${styles.title} ${styles.titleCompact}`}>
          {title || hostname}
        </div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
}
