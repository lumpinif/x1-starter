import GithubIcon from "@x1-starter/ui/components/icons/github-icon";
import { buttonVariants } from "@x1-starter/ui/components/ui/button";
import { cn } from "@x1-starter/ui/lib/utils";
import Link from "next/link";

export function GithubLink() {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href="https://github.com/lumpinif/x1-starter"
      className={cn(
        "border-none outline-none",
        buttonVariants({
          size: "icon",
          variant: "outline",
        }),
      )}
    >
      <GithubIcon />
    </Link>
  );
}
