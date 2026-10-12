// Light/dark theme: the preference lives in a cookie, and data-theme on <html>
// switches the tokens. Paramètres offers Système / Clair / Sombre.

export type ThemePreference = "system" | "light" | "dark";

export const THEME_COOKIE = "qrious-theme";
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const THEME_CHANGE_EVENT = "qrious-theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const COOKIE_PATTERN = `(?:^|; )${THEME_COOKIE}=(light|dark|system)`;

/**
 * Blocking script for <head>: sets data-theme before first paint (no flash)
 * and follows the device setting while the preference is "system".
 */
export const themeScript = `(() => {
  const root = document.documentElement;
  const dark = window.matchMedia("${DARK_QUERY}");
  const apply = () => {
    const match = document.cookie.match(new RegExp("${COOKIE_PATTERN}"));
    const preference = match ? match[1] : "system";
    root.dataset.theme = preference === "system" ? (dark.matches ? "dark" : "light") : preference;
  };
  apply();
  dark.addEventListener("change", apply);
})();`;

export function getThemePreference(): ThemePreference {
  const match = document.cookie.match(new RegExp(COOKIE_PATTERN));
  return (match?.[1] as ThemePreference | undefined) ?? "system";
}

export function setThemePreference(preference: ThemePreference): void {
  document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  const prefersDark = window.matchMedia(DARK_QUERY).matches;
  document.documentElement.dataset.theme =
    preference === "system" ? (prefersDark ? "dark" : "light") : preference;
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** For useSyncExternalStore: notifies when setThemePreference runs. */
export function subscribeToThemePreference(onChange: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
}
