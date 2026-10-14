// Client side: telling a lost connection apart from every other error when a
// server action is called. Redirects (NEXT_REDIRECT) and real bugs must be
// rethrown so Next.js and the error pages handle them.

export const OFFLINE_MESSAGE = "Connexion perdue. Vérifie ton internet et réessaie.";

/** True when the request never reached the server (no internet, network dropped). */
export function isNetworkError(error: unknown): boolean {
  // Chrome « Failed to fetch », Firefox « NetworkError… », Safari « Load failed ».
  return error instanceof TypeError && /fetch|network|load failed/i.test(error.message);
}
