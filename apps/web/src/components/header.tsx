"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@x1-starter/ui/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";

export function Header() {
  return (
    <header className="absolute top-0 z-10 flex w-full items-center justify-between p-4">
      <span className="hidden font-medium text-sm md:block">
        x1-starter.run
      </span>

      <Link href="/">
        <Image
          src="/logo.png"
          alt="x1-starter logo"
          width={60}
          quality={100}
          height={60}
          className="md:-translate-x-1/2 md:absolute md:top-5 md:left-1/2"
        />
      </Link>

      <nav className="md:mt-2">
        <ul className="flex items-center gap-4">
          <li>
            <a
              href="https://github.com/lumpinif/x1-starter"
              className="rounded-full bg-primary px-4 py-2 font-medium text-secondary text-sm"
            >
              Github
            </a>
          </li>
          <li>
            <Dialog>
              <DialogTrigger
                className="cursor-pointer rounded-full bg-secondary px-4 py-2 font-medium text-primary text-sm"
                asChild
              >
                <span>Get updates</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Stay updated</DialogTitle>
                  <DialogDescription>
                    Subscribe to our newsletter to get the latest news and
                    updates.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                  <SubscribeForm
                    group="x1-starter-newsletter"
                    placeholder="Email address"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </header>
  );
}
