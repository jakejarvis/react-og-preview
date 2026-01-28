import { createFileRoute } from "@tanstack/react-router";
import {
  AudioLinesIcon,
  BookAIcon,
  CloudDownloadIcon,
  FilmIcon,
  GlobeIcon,
  ImageIcon,
  LinkIcon,
  MoonIcon,
  ProportionsIcon,
  Share2Icon,
  SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentType, SVGProps } from "react";
import { useCallback, useState } from "react";
import {
  type AudioMetadata,
  type ImageMetadata,
  type MastodonVariant,
  SocialPreview,
  type SocialPreviewProvider,
  type TwitterVariant,
  type VideoMetadata,
} from "react-og-preview";
import { CodeBlock } from "@/components/code-block";
import { CodeBlockCommand } from "@/components/code-block-command";
import { SocialIcons } from "@/components/social-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { fetchPreview } from "@/lib/fetch-preview";

import { version } from "../../../../packages/react-og-preview/package.json" with {
  type: "json",
};

import "react-og-preview/styles.css";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const providers: {
  label: string;
  value: SocialPreviewProvider;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { label: "Twitter / X", value: "twitter", icon: SocialIcons.twitter },
  { label: "Facebook", value: "facebook", icon: SocialIcons.facebook },
  { label: "LinkedIn", value: "linkedin", icon: SocialIcons.linkedin },
  { label: "Slack", value: "slack", icon: SocialIcons.slack },
  { label: "Discord", value: "discord", icon: SocialIcons.discord },
  { label: "Bluesky", value: "bluesky", icon: SocialIcons.bluesky },
  { label: "Mastodon", value: "mastodon", icon: SocialIcons.mastodon },
  { label: "WhatsApp", value: "whatsapp", icon: SocialIcons.whatsapp },
];

function ProviderIcon({
  provider,
  className,
}: {
  provider: (typeof providers)[number];
  className?: string;
}) {
  return <provider.icon className={className} />;
}

const twitterVariants: { label: string; value: TwitterVariant }[] = [
  { label: "Large", value: "large" },
  { label: "Compact", value: "compact" },
];

const mastodonVariants: { label: string; value: MastodonVariant }[] = [
  { label: "Compact", value: "compact" },
  { label: "Expanded", value: "expanded" },
];

function normalizeUrl(input: string): string {
  const url = input.trim();
  if (!url) return "";
  // Add https:// if no protocol specified
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function HomePage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [provider, setProvider] = useState<SocialPreviewProvider>("twitter");
  const [twitterVariant, setTwitterVariant] = useState<TwitterVariant>("large");
  const [mastodonVariant, setMastodonVariant] =
    useState<MastodonVariant>("compact");
  const [url, setUrl] = useState("https://react.dev");
  const [title, setTitle] = useState("React");
  const [description, setDescription] = useState(
    "React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.",
  );
  const [image, setImage] = useState<ImageMetadata | string | null>(
    "https://react.dev/images/og-home.png",
  );
  const [imageUrl, setImageUrl] = useState(
    "https://react.dev/images/og-home.png",
  );
  const [video, setVideo] = useState<VideoMetadata | null>(null);
  const [audio, setAudio] = useState<AudioMetadata | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  // Fetch preview state
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetchPreview() {
    if (!inputUrl) return;
    const normalizedUrl = normalizeUrl(inputUrl);
    setInputUrl(normalizedUrl);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPreview({ data: normalizedUrl });
      setUrl(data.url);
      setTitle(data.title);
      setDescription(data.description ?? "");
      setImage(data.image);
      setImageUrl(
        typeof data.image === "string" ? data.image : (data.image?.url ?? ""),
      );
      setVideo(data.video);
      setAudio(data.audio);
      setVideoUrl(data.video?.url ?? "");
      setAudioUrl(data.audio?.url ?? "");
      // Set Twitter variant based on the fetched twitter:card meta tag
      if (data.twitterCard) {
        setTwitterVariant(
          data.twitterCard === "summary_large_image" ? "large" : "compact",
        );
      }
    } catch (_e) {
      setError("Failed to fetch preview. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  // Debounced callbacks for media URL changes
  const debouncedSetImage = useDebouncedCallback((url: string) => {
    const normalized = normalizeUrl(url);
    if (normalized) {
      setImageUrl(normalized);
      setImage(normalized);
    } else {
      setImage(null);
    }
  }, 500);

  const debouncedSetVideo = useDebouncedCallback((url: string) => {
    const normalized = normalizeUrl(url);
    if (normalized) {
      setVideoUrl(normalized);
      setVideo({ url: normalized });
    } else {
      setVideo(null);
    }
  }, 500);

  const debouncedSetAudio = useDebouncedCallback((url: string) => {
    const normalized = normalizeUrl(url);
    if (normalized) {
      setAudioUrl(normalized);
      setAudio({ url: normalized });
    } else {
      setAudio(null);
    }
  }, 500);

  // Handle image URL input change with debounce
  const handleImageUrlChange = useCallback(
    (newUrl: string) => {
      setImageUrl(newUrl);
      setError(null);
      debouncedSetImage(newUrl);
    },
    [debouncedSetImage],
  );

  // Handle video URL input change with debounce
  const handleVideoUrlChange = useCallback(
    (newUrl: string) => {
      setVideoUrl(newUrl);
      setError(null);
      debouncedSetVideo(newUrl);
    },
    [debouncedSetVideo],
  );

  // Handle audio URL input change with debounce
  const handleAudioUrlChange = useCallback(
    (newUrl: string) => {
      setAudioUrl(newUrl);
      setError(null);
      debouncedSetAudio(newUrl);
    },
    [debouncedSetAudio],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-border/50 border-b bg-background/80 backdrop-blur-lg backdrop-saturate-150 supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg tracking-tight">
              <a href="/" className="flex items-center gap-2">
                <Share2Icon className="size-4 text-muted-foreground" />
                react-og-preview
              </a>
            </h1>
            <a
              href="https://www.npmjs.com/package/react-og-preview"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Badge
                variant="secondary"
                className="translate-y-[-1px] font-mono text-xs"
              >
                v{version}
              </Badge>
            </a>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon-lg"
              render={
                <a
                  href="https://www.npmjs.com/package/react-og-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <title>NPM</title>
                    <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019l-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
                  </svg>
                </a>
              }
            />
            <Button
              variant="ghost"
              size="icon-lg"
              render={
                <a
                  href="https://github.com/jakejarvis/react-og-preview"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <title>GitHub</title>
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                </a>
              }
            />
            <Button
              variant="ghost"
              size="icon-lg"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-12 px-6 py-8">
        {/* Installation */}
        <section>
          <h2 className="mb-4 font-semibold text-lg tracking-tight">
            Installation
          </h2>
          <CodeBlockCommand
            __pnpm__="pnpm add react-og-preview"
            __npm__="npm install react-og-preview"
            __yarn__="yarn add react-og-preview"
            __bun__="bun add react-og-preview"
          />
        </section>

        {/* Interactive Demo */}
        <section>
          <h2 className="mb-6 font-semibold text-lg tracking-tight">
            Interactive Demo
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configure</CardTitle>
                <CardDescription>
                  Adjust the props to see how your link will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  {/* Fetch from URL */}
                  <Field>
                    <FieldLabel htmlFor="fetch-url">Fetch from URL</FieldLabel>
                    <div className="flex gap-2">
                      <InputGroup>
                        <InputGroupInput
                          id="fetch-url"
                          value={inputUrl}
                          onChange={(e) => setInputUrl(e.target.value)}
                          placeholder="https://react.dev"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleFetchPreview();
                          }}
                        />
                        <InputGroupAddon align="inline-start">
                          <GlobeIcon className="text-muted-foreground" />
                        </InputGroupAddon>
                      </InputGroup>
                      <Button
                        onClick={handleFetchPreview}
                        disabled={loading || !inputUrl}
                      >
                        {loading ? (
                          <Spinner data-icon="inline-start" />
                        ) : (
                          <CloudDownloadIcon data-icon="inline-start" />
                        )}
                        Fetch
                      </Button>
                    </div>
                    {error && (
                      <p className="text-destructive text-xs">{error}</p>
                    )}
                  </Field>

                  <Separator className="my-1" />

                  <Field>
                    <FieldLabel htmlFor="url">URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                      />
                      <InputGroupAddon align="inline-start">
                        <LinkIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Page title"
                      />
                      <InputGroupAddon align="inline-start">
                        <BookAIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Page description"
                      rows={3}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="image">Image URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="image"
                        value={imageUrl}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://example.com/og-image.jpg"
                      />
                      <InputGroupAddon align="inline-start">
                        <ImageIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="video">Video URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="video"
                        value={videoUrl}
                        onChange={(e) => handleVideoUrlChange(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                      />
                      <InputGroupAddon align="inline-start">
                        <FilmIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="audio">Audio URL</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="audio"
                        value={audioUrl}
                        onChange={(e) => handleAudioUrlChange(e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                      />
                      <InputGroupAddon align="inline-start">
                        <AudioLinesIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="flex lg:sticky lg:top-20 lg:self-start">
              <CardHeader>
                <CardTitle className="text-base">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-row gap-2">
                  <Select
                    items={providers}
                    value={provider}
                    onValueChange={(v) =>
                      setProvider(v as SocialPreviewProvider)
                    }
                  >
                    <SelectTrigger>
                      <ProviderIcon
                        provider={
                          // biome-ignore lint/style/noNonNullAssertion: this is safe
                          providers.find((p) => p.value === provider)!
                        }
                        className="mx-0.5 size-3 text-muted-foreground"
                      />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="start" alignItemWithTrigger={false}>
                      <SelectGroup>
                        {providers.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            <span className="flex items-center gap-2">
                              <ProviderIcon
                                provider={p}
                                className="text-muted-foreground"
                              />
                              <span className="truncate">{p.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {provider === "twitter" && (
                    <Select
                      items={twitterVariants}
                      value={twitterVariant}
                      onValueChange={(v) =>
                        setTwitterVariant(v as TwitterVariant)
                      }
                    >
                      <SelectTrigger>
                        <ProportionsIcon className="mx-0.5 size-3 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start" alignItemWithTrigger={false}>
                        <SelectGroup>
                          {twitterVariants.map((v) => (
                            <SelectItem key={v.value} value={v.value}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                  {provider === "mastodon" && (
                    <Select
                      items={mastodonVariants}
                      value={mastodonVariant}
                      onValueChange={(v) =>
                        setMastodonVariant(v as MastodonVariant)
                      }
                    >
                      <SelectTrigger>
                        <ProportionsIcon className="mx-0.5 size-3 text-muted-foreground" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start" alignItemWithTrigger={false}>
                        <SelectGroup>
                          {mastodonVariants.map((v) => (
                            <SelectItem key={v.value} value={v.value}>
                              {v.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="mx-auto max-w-[520px]">
                  <SocialPreview
                    provider={provider}
                    variant={
                      provider === "twitter"
                        ? twitterVariant
                        : provider === "mastodon"
                          ? mastodonVariant
                          : undefined
                    }
                    url={url}
                    title={title}
                    description={description}
                    image={image}
                    video={video}
                    audio={audio}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Providers */}
          <div className="mt-12">
            <h3 className="mb-6 font-medium text-base tracking-tight">
              All Providers
            </h3>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((p) => (
                <div key={p.value} className="space-y-3">
                  <h4 className="flex items-center gap-2 font-medium text-[13px] text-foreground/90">
                    <ProviderIcon provider={p} className="size-3.5" />
                    {p.label}
                  </h4>
                  <SocialPreview
                    provider={p.value}
                    variant={
                      p.value === "twitter"
                        ? "compact"
                        : p.value === "mastodon"
                          ? "compact"
                          : undefined
                    }
                    url={url}
                    title={title}
                    description={description}
                    image={image}
                    video={video}
                    audio={audio}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section>
          <h2 className="mb-4 font-semibold text-lg tracking-tight">
            Quick Start
          </h2>
          <CodeBlock
            code={`import { SocialPreview } from "react-og-preview";

// Import once in your app
import "react-og-preview/styles.css";

function App() {
  return (
    <SocialPreview
      provider="twitter"
      variant="compact"
      url="https://example.com"
      title="My Article Title"
      description="A brief description..."
      image="https://example.com/og-image.jpg"
    />
  );
}`}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border/50 border-t">
        <div className="mx-auto max-w-5xl space-y-2 px-6 py-8 text-center text-muted-foreground text-sm">
          <p>
            react-og-preview is not affiliated with any of the platforms listed.
          </p>
          <p>
            <a
              href="https://github.com/jakejarvis/react-og-preview/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground/80"
            >
              Licensed under MIT.
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
