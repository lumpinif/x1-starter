"use client";

import { Icons } from "@x1-starter/ui/components/icons";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export function CopyText({ value }: { value: string }) {
  const [_, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(value);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="flex items-center gap-2 rounded-full border border-border bg-background p-4 font-mono text-[#878787] text-xs transition-colors md:text-sm"
    >
      <span>{value}</span>
      {copied ? (
        <Icons.Check className="size-3.5" />
      ) : (
        <Icons.Copy className="size-3.5" />
      )}
    </button>
  );
}
