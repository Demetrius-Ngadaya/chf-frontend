"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DonateWidget() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Link
      href="/donate"
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-clay px-5 py-3 font-body text-sm font-semibold text-sand shadow-lg transition-transform hover:scale-105"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      Donate Now
    </Link>
  );
}
