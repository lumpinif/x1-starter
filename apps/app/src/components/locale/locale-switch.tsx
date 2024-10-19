"use client";

import { useChangeLocale, useCurrentLocale } from "@/locales/client";
import { Button } from "@x1-starter/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@x1-starter/ui/components/ui/dropdown-menu";
import { Icons } from "@x1-starter/ui/icons";
import { Suspense } from "react";

const locales = ["en", "cn", "fr"];

function LocaleSwitchContent() {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Icons.Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLocale(locale as "en" | "cn" | "fr")}
          >
            {locale.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LocaleSwitch() {
  return (
    <Suspense
      fallback={
        <Button variant="ghost" size="icon">
          <Icons.Globe className="h-4 w-4" />
        </Button>
      }
    >
      <LocaleSwitchContent />
    </Suspense>
  );
}
