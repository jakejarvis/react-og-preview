"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => setCopied(false), 2000);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
  };

  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 font-mono text-foreground text-sm dark:text-foreground/85">
        <code>{code}</code>
      </pre>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-70"
              onClick={handleCopy}
            />
          }
        >
          <span className="sr-only">Copy</span>
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {copied ? "Copied" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
