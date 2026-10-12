import { notFound } from "next/navigation";

// Developer pages (/dev/...) are never shipped to students.
export default function DevLayout({ children }: LayoutProps<"/dev">) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
