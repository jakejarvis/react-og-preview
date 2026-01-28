import {
  BlueskyCard,
  DiscordCard,
  FacebookCard,
  LinkedInCard,
  MastodonCard,
  SlackCard,
  TwitterCard,
  WhatsAppCard,
} from "@/components/providers";
import type { SocialPreviewProps } from "@/types";

export function SocialPreview(props: SocialPreviewProps) {
  const {
    provider,
    url,
    title,
    description,
    image,
    video,
    audio,
    className,
    disableLink,
    ImageComponent,
    VideoComponent,
    AudioComponent,
  } = props;

  let card: React.ReactNode = null;

  switch (provider) {
    case "twitter":
      card = (
        <TwitterCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          variant={props.variant}
          className={className}
          ImageComponent={ImageComponent}
        />
      );
      break;
    case "facebook":
      card = (
        <FacebookCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
          VideoComponent={VideoComponent}
          AudioComponent={AudioComponent}
        />
      );
      break;
    case "linkedin":
      card = (
        <LinkedInCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
        />
      );
      break;
    case "slack":
      card = (
        <SlackCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
          AudioComponent={AudioComponent}
        />
      );
      break;
    case "discord":
      card = (
        <DiscordCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
          VideoComponent={VideoComponent}
          AudioComponent={AudioComponent}
        />
      );
      break;
    case "bluesky":
      card = (
        <BlueskyCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
        />
      );
      break;
    case "mastodon":
      card = (
        <MastodonCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          variant={props.variant}
          className={className}
          ImageComponent={ImageComponent}
        />
      );
      break;
    case "whatsapp":
      card = (
        <WhatsAppCard
          url={url}
          title={title}
          description={description}
          image={image}
          video={video}
          audio={audio}
          className={className}
          ImageComponent={ImageComponent}
        />
      );
      break;
  }

  if (!card) {
    return (
      <div
        data-slot="social-preview"
        data-provider={provider}
        style={{
          display: "flex",
          height: "12rem",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0.375rem",
          border: "1px solid currentColor",
          opacity: 0.5,
          fontSize: "12px",
        }}
      >
        No preview available.
      </div>
    );
  }

  const getVariant = () => {
    if (provider === "twitter" || provider === "mastodon") {
      return props.variant;
    }
    return undefined;
  };

  if (disableLink) {
    return (
      <div
        data-slot="social-preview"
        data-provider={provider}
        data-variant={getVariant()}
        style={{
          display: "block",
          width: "100%",
        }}
      >
        {card}
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open link in a new tab"
      data-slot="social-preview"
      data-provider={provider}
      data-variant={getVariant()}
      style={{
        display: "block",
        width: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {card}
    </a>
  );
}
