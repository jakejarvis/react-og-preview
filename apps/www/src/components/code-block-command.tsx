"use client";

import { CheckIcon, CopyIcon, TerminalIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export interface CodeBlockCommandProps {
  __pnpm__?: string;
  __npm__?: string;
  __yarn__?: string;
  __bun__?: string;
}

export function CodeBlockCommand({
  __pnpm__,
  __npm__,
  __yarn__,
  __bun__,
}: CodeBlockCommandProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const tabs = useMemo(() => {
    const entries: Partial<Record<PackageManager, string>> = {};
    if (__pnpm__) entries.pnpm = __pnpm__;
    if (__npm__) entries.npm = __npm__;
    if (__yarn__) entries.yarn = __yarn__;
    if (__bun__) entries.bun = __bun__;
    return entries;
  }, [__pnpm__, __npm__, __yarn__, __bun__]);

  const tabKeys = Object.keys(tabs) as PackageManager[];

  // Ensure packageManager is valid for available tabs
  const activeTab = tabKeys.includes(packageManager)
    ? packageManager
    : tabKeys[0];

  const handleTabChange = useCallback(
    (value: string | number | null) => {
      if (value && tabKeys.includes(value as PackageManager)) {
        const pm = value as PackageManager;
        setPackageManager(pm);
      }
    },
    [tabKeys],
  );

  const copyCommand = useCallback(() => {
    const command = tabs[activeTab];
    if (!command) return;

    navigator.clipboard.writeText(command);
    setHasCopied(true);
  }, [activeTab, tabs]);

  if (tabKeys.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/10">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-0">
        <div className="flex items-center gap-2 border-border/50 border-b bg-muted px-3 py-1">
          <div className="flex size-4 translate-y-[1px] items-center justify-center rounded-[2px] bg-foreground opacity-70">
            <TerminalIcon className="size-3 text-background" />
          </div>
          <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
            {tabKeys.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="h-7 rounded-md border border-transparent px-2 pt-0.5 text-muted-foreground data-active:border-input data-active:bg-accent data-active:text-accent-foreground data-active:shadow-none"
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="overflow-x-auto">
          {tabKeys.map((key) => (
            <TabsContent key={key} value={key} className="mt-0 px-4 py-3.5">
              <pre>
                <code className="font-mono text-foreground text-sm leading-none dark:text-foreground/90">
                  {tabs[key]}
                </code>
              </pre>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              data-slot="copy-button"
              size="icon"
              variant="ghost"
              className="absolute top-1.5 right-2 z-10 size-7 opacity-70 hover:text-foreground hover:opacity-100 focus-visible:opacity-100"
              onClick={copyCommand}
            />
          }
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          {hasCopied ? "Copied" : "Copy to clipboard"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
