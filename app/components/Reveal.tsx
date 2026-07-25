"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Default "div". Use "li"/"span" inside lists. */
  as?: ElementType;
  /** Stagger delay in ms. */
  delay?: number;
  /** Travel distance in px. Default 24. */
  y?: number;
  /** Re-hide when scrolled out of view. Default false (animate once). */
  repeat?: boolean;
  className?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  y = 24,
  repeat = false,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: show immediately, skip the observer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (!repeat) io.disconnect();
          } else if (repeat) {
            setShown(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [repeat]);

  return (
    <Tag
      ref={ref}
      data-reveal
      data-shown={shown ? "true" : "false"}
      style={
        { "--reveal-delay": `${delay}ms`, "--reveal-y": `${y}px` } as CSSProperties
      }
      className={className}
    >
      {children}
    </Tag>
  );
}
