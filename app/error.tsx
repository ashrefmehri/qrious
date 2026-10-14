"use client";

import { useEffect } from "react";
import { ErrorScreen } from "@/components/screens/ErrorScreen";

// Shown when a page fails to load (e.g. the database doesn't answer).
// `retry` re-fetches and re-renders the failed part (Next.js 16.3+).
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorScreen onRetry={retry} />;
}
