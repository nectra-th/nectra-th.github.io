"use client";

/* Desktop: open in a new tab (people expect their existing tab to stay put).
   Mobile: navigate in the same tab — that's what lets the OS intercept this
   as a universal/app link straight into the native Google Maps app with
   turn-by-turn directions; spawning a blank tab first can break that handoff
   in some mobile browsers/in-app webviews. 1024px matches the site's lg
   breakpoint used everywhere else to mean "desktop". */
export default function LaunchNavigationButton({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth >= 1024) {
      e.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
