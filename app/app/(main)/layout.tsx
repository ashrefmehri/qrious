import { AppNav } from "@/components/ui/AppNav";

// App pages with navigation (docs/04-routes-and-navigation.md): 240 px sidebar
// from 1024 px, 80 px icon rail from 640 px, bottom bar below. The three are
// rendered and shown by CSS, so the right one is there from the first paint.
// Access (session + profile) is decided by proxy.ts and re-checked by each page.
export default function MainLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="min-h-dvh sm:flex">
      <div className="sticky top-0 hidden h-dvh shrink-0 lg:block">
        <AppNav variant="sidebar" />
      </div>
      <div className="sticky top-0 hidden h-dvh shrink-0 sm:block lg:hidden">
        <AppNav variant="rail" />
      </div>

      {/* The bottom bar must not cover the content on phone. */}
      <div className="min-w-0 flex-1 pb-[calc(68px+env(safe-area-inset-bottom))] sm:pb-0">{children}</div>

      <div className="sm:hidden">
        <AppNav variant="bar" />
      </div>
    </div>
  );
}
