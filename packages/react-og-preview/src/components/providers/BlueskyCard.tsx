import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  VideoMetadata,
} from "@/types";

import styles from "./BlueskyCard.module.css";

interface BlueskyCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

export function BlueskyCard({
  url,
  title,
  description,
  image,
  video,
  className,
  ImageComponent,
}: BlueskyCardProps) {
  const hostname = getHostname(url);
  const hasMedia = !!(image || video);

  const renderMedia = () => {
    if (video) {
      return (
        <PreviewVideo
          video={video}
          poster={image}
          width={1200}
          height={630}
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
        height={630}
        placeholderClassName={styles.placeholder}
        ImageComponent={ImageComponent}
      />
    );
  };

  return (
    <div className={`${styles.card} ${className ?? ""}`}>
      {hasMedia && (
        <div className={styles.imageContainer}>
          <div className={styles.imageWrapper}>{renderMedia()}</div>
        </div>
      )}
      <div
        className={`${styles.content} ${hasMedia ? styles.contentWithMedia : ""}`}
      >
        <div className={styles.textWrapper}>
          <div className={styles.title}>{title || hostname}</div>
          {description && (
            <div
              className={`${styles.description} ${hasMedia ? styles.descriptionWithMedia : ""}`}
            >
              {description}
            </div>
          )}
        </div>
        <div className={styles.divider} />
        <div className={styles.urlRow}>
          <GlobeIcon className={styles.globeIcon} />
          <span className={styles.hostname}>{hostname}</span>
        </div>
      </div>
    </div>
  );
}
