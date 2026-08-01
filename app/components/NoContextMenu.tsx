"use client";

import { useEffect } from "react";

/* Site-wide right-click disable (per request) — blocks the context menu on
   every element, including images/video. Mounted once in the root layout;
   renders nothing. */
export default function NoContextMenu() {
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);
  return null;
}
