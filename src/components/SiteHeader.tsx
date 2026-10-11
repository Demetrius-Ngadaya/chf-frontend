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
      <div className="flex flex-wrap justify-between gap-x-3 bg-baobab px-[4vw] py-2 text-[0.72rem] text-[#e7eef5] sm:text-[0.78rem]">
        <span>CARING HEART FOUNDATION · TANZANIA</span>
        <span className="hidden sm:inline">Improved Life &amp; Social Inclusion</span>
      </div>

      <header className="sticky top-0 z-50 border-b border-[#e2e8f0] bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/images/logo.jpg"
              alt="Caring Heart Foundation logo"
              width={45}
              height={45}
              className="h-[45px] w-[45px] rounded-xl border-2 border-clay object-cover"
            />
            <span className="min-w-0">
              <strong className="block truncate text-[0.7rem] font-bold tracking-wide text-baobab sm:text-[0.82rem]">
                CARING HEART FOUNDATION
              </strong>
              <small className="mt-1 block truncate text-[0.5rem] tracking-[0.12em] text-clay sm:text-[0.61rem]">
                IMPROVED LIFE &amp; SOCIAL INCLUSION
              </small>
            </span>
          </Link>

          <nav className="hidden items-center gap-[18px] text-[0.82rem] font-semibold text-ink md:flex">
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
              <button className="flex items-center gap-1 font-semibold transition-colors hover:text-clay">
                More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 w-72 pt-3">
                  <div className="grid grid-cols-2 gap-1 rounded-[14px] border border-[#e2e8f0] bg-white p-3 shadow-[0_12px_32px_#142b4318]">
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-[#fff0f1] hover:text-clay"
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
              className="hidden items-center justify-center rounded-lg border border-clay bg-clay px-4 py-[11px] text-[0.82rem] font-bold text-white transition hover:-translate-y-px hover:bg-[#a91f2b] sm:inline-flex"
            >
              Donate Now ↗
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-ink md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? "✕" : "☰"} Menu
            </button>
          </div>
        </div>

        {open && (
          <nav className="max-h-[75vh] overflow-y-auto border-t border-[#e2e8f0] bg-white px-5 pb-4 pt-2 md:hidden">
            {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-3 text-sm font-semibold text-ink transition-colors hover:bg-[#fff0f1] hover:text-clay"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-lg bg-clay px-5 py-3 text-center text-sm font-bold text-white"
            >
              Donate Now ↗
            </Link>
          </nav>
        )}
      </header>
    </>
  );
}
