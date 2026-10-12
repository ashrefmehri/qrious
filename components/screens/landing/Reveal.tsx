"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  /** Layout classes of the block. */
  className?: string;
  children: ReactNode;
};

/**
 * Plays the entrance of its `.reveal-item` children once, when the block
 * scrolls into view (styles in landing.css). Only blocks still below the
 * screen get hidden, so nothing stays invisible if JavaScript is slow, and
 * nothing moves under « Réduire les animations ».
 */
export function Reveal({ className = "", children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = ref.current;
    if (!block) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (block.getBoundingClientRect().top < window.innerHeight) return;

    block.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        block.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(block);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
