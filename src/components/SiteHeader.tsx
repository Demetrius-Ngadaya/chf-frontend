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

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header
      className={
        overlay
          ? "absolute left-0 right-0 top-0 z-20 bg-baobab-dark/70 px-6 py-5 backdrop-blur-md md:px-12"
          : "relative bg-baobab-dark px-6 py-5 md:px-12"
      }
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-sand"
        >
          <Image
            src="/images/logo.jpg"
            alt="Caring Heart Foundation logo"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          Caring Heart Foundation
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-sand/80 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button className="flex items-center gap-1 font-body text-sm text-sand/80 transition-colors hover:text-gold">
              More
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {moreOpen && (
              <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3">
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-sand/10 bg-baobab-dark p-3 shadow-xl">
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2 font-body text-xs text-sand/80 transition-colors hover:bg-sand/5 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/donate"
            className="hidden rounded-full bg-clay px-5 py-2 font-body text-sm font-semibold text-sand transition-transform hover:scale-105 sm:block"
          >
            Donate Now
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sand md:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mt-4 flex flex-col gap-1 border-t border-sand/10 pt-4 md:hidden">
          {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 font-body text-sm text-sand/80 transition-colors hover:bg-sand/5 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-clay px-5 py-3 text-center font-body text-sm font-semibold text-sand sm:hidden"
          >
            Donate Now
          </Link>
        </nav>
      )}
    </header>
  );
}
