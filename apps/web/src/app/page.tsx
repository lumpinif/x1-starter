import { AnimatedText } from "@/components/animated-text";
import { CopyText } from "@/components/copy-text";
import { Button } from "@x1-starter/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@x1-starter/ui/components/ui/tooltip";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <div className="-top-[118px] -z-10 pointer-events-none absolute inset-0 h-[80%] bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] [transform:perspective(1000px)_rotateX(-63deg)]" />
      <div className="-z-10 pointer-events-none absolute inset-0 bg-gradient-to-t from-background to-transparent" />

      <h1 className="relative z-10 h-[120px] text-center font-departure text-[40px] leading-tight md:h-auto md:text-[84px]">
        <AnimatedText text="Production ready code" />
      </h1>

      <p className="relative z-10 mt-0 max-w-[80%] text-center md:mt-4">
        <Button asChild className="mt-4">
          <Link
            href="https://x1-starter-app.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Go to demo
          </Link>
        </Button>
      </p>

      {/* In process */}
      {/* <span className="relative z-10 text-center text-[#878787] text-xs mt-2">
        Security verified by Kenshū.
      </span> */}

      <div className="mt-10 mb-8">
        <CopyText value="bunx degit midday-ai/x1-starter x1-starter" />
      </div>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href="https://news.ycombinator.com/item?id=41408929"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  fill="none"
                >
                  <g clipPath="url(#a)">
                    <path
                      fill="#F60"
                      d="M0 0v16h16V0H0Zm8.7 9.225v3.925H7.275V9.225L3.775 2.3h1.65L8 7.525 10.65 2.3h1.55L8.7 9.225Z"
                    />
                  </g>
                  <defs>
                    <clipPath id="a">
                      <path fill="#fff" d="M0 0h16v16H0z" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-sm">Live on Hacker News</span>
              </div>
            </a>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={15} className="text-xs">
            Show HN: x1-starter – An open-source starter kit for your next
            project
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="-bottom-[280px] -z-10 pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] [transform:perspective(560px)_rotateX(63deg)]" />
      <div className="-z-10 pointer-events-none absolute bottom-[100px] h-1/2 w-full bg-gradient-to-b from-background to-transparent" />
    </div>
  );
}
