"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import LayoutWrapper from "./layout-wrapper";

type ProviderProps = {
  children: ReactNode;
};

export function Providers({ children }: ProviderProps) {
  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <LayoutWrapper>{children}</LayoutWrapper>
    </ThemeProvider>
  );
}
