"use client";

import { useSyncExternalStore } from "react";
import {
  getThemePreference,
  setThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "Système" },
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
];

export function ThemeSwitch() {
  const current = useSyncExternalStore(subscribeToThemePreference, getThemePreference, () => null);

  return (
    <div role="group" aria-label="Thème" className="inline-flex gap-1 rounded-pill bg-surface p-1 shadow-carte">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={current === option.value}
          onClick={() => setThemePreference(option.value)}
          className="label q-pressable min-h-11 rounded-pill px-4 text-encre-douce aria-pressed:bg-action aria-pressed:text-sur-action"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
