import { Atkinson_Hyperlegible, Bricolage_Grotesque } from "next/font/google";

// Shared by the root layout and global-error.tsx (which replaces the layout).
export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: "600",
  subsets: ["latin"],
});

export const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const fontVariables = `${bricolage.variable} ${atkinson.variable}`;
