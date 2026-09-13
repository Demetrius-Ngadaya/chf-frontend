"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const PHONE = "+255683199460";
const PHONE_DIGITS = "255683199460";
const EMAIL = "info@thechf.or.tz";

const OPTIONS = [
  {
    label: "WhatsApp",
    href: `https://wa.me/${PHONE_DIGITS}`,
    external: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.07-1.36A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-1.02.08-1.65-.1-.38-.11-.87-.28-1.5-.55-2.64-1.14-4.36-3.8-4.5-3.98-.13-.18-1.08-1.43-1.08-2.73s.68-1.93.92-2.2c.24-.26.53-.33.7-.33h.5c.16 0 .38-.06.6.45s.72 1.78.78 1.91c.06.13.1.28.02.45-.08.18-.13.29-.26.44-.13.16-.27.35-.39.47-.13.13-.26.27-.11.53.15.26.66 1.09 1.42 1.77.98.87 1.8 1.14 2.06 1.27.26.13.41.11.56-.07.16-.18.66-.77.84-1.03.18-.26.36-.22.6-.13.24.09 1.52.72 1.78.85.26.13.44.2.5.31.06.11.06.65-.16 1.27z" />
      </svg>
    ),
  },
  {
    label: "Call",
    href: `tel:${PHONE}`,
    external: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "SMS",
    href: `sms:${PHONE}`,
    external: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    external: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ContactWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-3 shadow-2xl">
          {OPTIONS.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target={option.external ? "_blank" : undefined}
              rel={option.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3 rounded-xl px-3 py-2 font-body text-sm text-ink transition-colors hover:bg-sand"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-baobab/10 text-baobab">
                {option.icon}
              </span>
              {option.label}
            </a>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-baobab-dark text-sand shadow-lg transition-transform hover:scale-105"
        aria-label="Contact us"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
