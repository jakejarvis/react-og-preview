import { useEffect, useState } from "react";
import { BrokenImageIcon } from "@/components/BrokenImageIcon";
import type { ImageComponentProps, ImageMetadata } from "@/types";

import styles from "./PreviewImage.module.css";

interface PreviewImageProps {
  src: ImageMetadata | string | null | undefined;
  width: number;
  height: number;
  placeholderClassName?: string;
  ImageComponent?: React.ComponentType<ImageComponentProps>;
}

function DefaultImage({ alt, ...props }: ImageComponentProps) {
  return <img alt={alt} {...props} />;
}

function normalizeImage(src: ImageMetadata | string | null | undefined): {
  url: string | null;
  alt: string;
} {
  if (!src) return { url: null, alt: "Preview image" };
  if (typeof src === "string") return { url: src, alt: "Preview image" };
  return { url: src.url, alt: src.alt ?? "Preview image" };
}

export function PreviewImage({
  src,
  width,
  height,
  placeholderClassName,
  ImageComponent = DefaultImage,
}: PreviewImageProps) {
  const [hasError, setHasError] = useState(false);
  const { url, alt } = normalizeImage(src);

  // Reset error state when the URL changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reset on url change
  useEffect(() => {
    setHasError(false);
  }, [url]);

  if (url && !hasError) {
    return (
      <ImageComponent
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={styles.image}
        draggable={false}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={`${styles.placeholder} ${placeholderClassName ?? ""}`}>
      <BrokenImageIcon className={styles.icon} />
      <span className={styles.srOnly}>No image</span>
    </div>
  );
}
