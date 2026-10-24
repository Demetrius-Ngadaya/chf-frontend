"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "/about-us" },
  { label: "Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Giving Back", href: "/giving-back" },
  { label: "Blog", href: "/blog" },
  { label: "Get Involved", href: "/volunteer" },
];

const MORE_LINKS = [
  { label: "Our Team", href: "/team" },
  { label: "Our Partners", href: "/partners" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Photo Gallery", href: "/gallery" },
  { label: "Video Gallery", href: "/videos" },
  { label: "Achievements", href: "/achievements" },
  { label: "Research & Publications", href: "/research" },
  { label: "Resources", href: "/resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Contact Us", href: "/contact-us" },
];

// `overlay` is kept so existing callers still compile; the new design is always a solid sticky header.
export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  void overlay;
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-sand/90 backdrop-blur-[10px]">
        <div className="mx-auto flex w-[min(1180px,92%)] items-center justify-between gap-6 py-[0.9rem]">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Caring Heart Foundation logo"
              width={42}
              height={42}
              className="h-[42px] w-[42px] rounded-xl border-2 border-clay object-cover"
            />
            <span className="min-w-0">
              <strong className="block truncate text-[0.72rem] font-extrabold tracking-wide text-ink sm:text-[0.95rem]">
                CARING HEART FOUNDATION
              </strong>
              <small className="mt-0.5 block truncate text-[0.5rem] font-semibold tracking-[0.12em] text-clay sm:text-[0.62rem]">
                IMPROVED LIFE &amp; SOCIAL INCLUSION
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-5 text-[0.9rem] font-medium text-ink md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-clay">
                {link.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className="flex items-center gap-1 font-medium transition-colors hover:text-clay">
                More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 w-72 pt-3">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-3 shadow-card">
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-rose hover:text-clay"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/donate"
              className="hidden items-center justify-center rounded-full bg-gradient-to-br from-clay to-red-dark px-6 py-[0.7rem] text-[0.9rem] font-semibold text-white shadow-cta transition duration-[250ms] hover:-translate-y-0.5 sm:inline-flex"
            >
              Donate Now ↗
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center rounded-full border border-line bg-white px-4 py-2 text-sm text-ink md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"} Menu
            </button>
          </div>
        </div>

        {open && (
          <nav className="max-h-[75vh] overflow-y-auto border-t border-line bg-white px-5 pb-4 pt-2 shadow-card md:hidden">
            {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 text-sm font-medium text-ink transition-colors hover:bg-rose hover:text-clay"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-full bg-gradient-to-br from-clay to-red-dark px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Donate Now ↗
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
