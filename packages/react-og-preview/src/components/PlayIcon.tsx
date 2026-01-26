interface PlayIconProps {
  className?: string;
}

export function PlayIcon({ className }: PlayIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="rgba(0, 0, 0, 0.6)" />
      <path d="M10 8l6 4-6 4V8z" fill="white" />
    </svg>
  );
}
