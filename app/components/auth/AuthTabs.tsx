"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pill =
  "rounded-[2px] py-2.5 text-center text-[13px] font-semibold tracking-[0.06em] transition-colors duration-200";

export function AuthTabs() {
  const path = usePathname();
  const active = (href: string) =>
    path === href ? "bg-gold text-ink" : "text-body hover:text-ink-text";

  return (
    <nav className="mt-7 grid grid-cols-2 gap-1 rounded-[3px] border border-line bg-cream-card p-1">
      <Link href="/signup" className={`${pill} ${active("/signup")}`}>
        Create Account
      </Link>
      <Link href="/login" className={`${pill} ${active("/login")}`}>
        Sign In
      </Link>
    </nav>
  );
}
