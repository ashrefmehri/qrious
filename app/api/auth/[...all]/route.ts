import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Better Auth's endpoints (/api/auth/*): sessions, and Google sign-in later.
export const { GET, POST } = toNextJsHandler(auth);
