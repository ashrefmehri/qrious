"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/screens/ErrorScreen";
import { applyThemePreference } from "@/lib/theme";
import { fontVariables } from "./fonts";
import "./globals.css";

// Last resort, when even the root layout fails: it replaces the whole document,
// so it brings its own <html>, styles, fonts and theme.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
    applyThemePreference();
  }, [error]);

  return (
    <html lang="fr" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <title>Erreur · Qrious</title>
        <ErrorScreen onRetry={retry} />
      </body>
    </html>
  );
}
