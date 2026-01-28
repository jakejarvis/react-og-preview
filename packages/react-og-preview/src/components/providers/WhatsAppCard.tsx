import { PreviewImage } from "@/components/PreviewImage";
import { PreviewVideo } from "@/components/PreviewVideo";
import { getHostname } from "@/lib/utils";
import type {
  AudioMetadata,
  ImageComponentProps,
  ImageMetadata,
  VideoMetadata,
} from "@/types";

import styles from "./WhatsAppCard.module.css";

interface WhatsAppCardProps {
  url: string;
  title: string | null;
  description?: string | null;
  image?: ImageMetadata | string | null;
  video?: VideoMetadata | string | null;
  audio?: AudioMetadata | string | null;
  className?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

export function WhatsAppCard({
  url,
  title,
  description,
  image,
  video,
  className,
  ImageComponent,
}: WhatsAppCardProps) {
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
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {description && <div className={styles.description}>{description}</div>}
        <div className={styles.domain}>{hostname}</div>
      </div>
    </div>
  );
}
