import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { PENDING_EMAIL_COOKIE } from "@/lib/pending-verification";
import { hasProfile } from "@/server/queries/student";

// Access rules (docs/04-routes-and-navigation.md), decided here, before any page
// renders, so the student never sees the wrong page flash by. Runs on Node.js.
// - /app/*: needs a session (else /connexion?next=…) and a profile; without one,
//   only /app/bienvenue opens, and with one, /app/bienvenue sends to /app.
// - / (landing), /connexion, /inscription, /verification: signed-in students go
//   to /app. Visitors without a session cookie pass straight through (no database).
// - /verification with no code waiting goes to /connexion.
// Pages still check for themselves (requireCompleteProfile): this is the fast path.
// If the database doesn't answer, the request goes on: pages check again and
// show « Ça n'a pas chargé. », so nothing is ever shown unchecked.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isApp = pathname === "/app" || pathname.startsWith("/app/");
  const redirectTo = (path: string) => NextResponse.redirect(new URL(path, request.url));

  const signIn = () => {
    const url = new URL("/connexion", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  };

  if (!getSessionCookie(request)) {
    if (isApp) return signIn();
    const noCodeWaiting = pathname === "/verification" && !request.cookies.has(PENDING_EMAIL_COOKIE);
    return noCodeWaiting ? redirectTo("/connexion") : NextResponse.next();
  }

  try {
    // Better Auth may refresh its cookies (longer session, or erasing a dead one):
    // pass them on, since pages can't set cookies themselves.
    const { headers: authHeaders, response: session } = await auth.api.getSession({
      headers: request.headers,
      returnHeaders: true,
    });
    const withAuthCookies = (response: NextResponse) => {
      for (const cookie of authHeaders.getSetCookie()) response.headers.append("set-cookie", cookie);
      return response;
    };

    if (!isApp) return withAuthCookies(session ? redirectTo("/app") : NextResponse.next());
    if (!session) return withAuthCookies(signIn());

    const onBienvenue = pathname === "/app/bienvenue";
    const profileDone = await hasProfile(session.user.id);
    if (!profileDone && !onBienvenue) return withAuthCookies(redirectTo("/app/bienvenue"));
    if (profileDone && onBienvenue) return withAuthCookies(redirectTo("/app"));
    return withAuthCookies(NextResponse.next());
  } catch (error) {
    console.error("proxy: session check failed", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/app/:path*", "/connexion", "/inscription", "/verification"],
};
