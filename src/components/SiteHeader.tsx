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

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between bg-baobab-dark px-6 py-5 md:px-12">
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
      </nav>

      <Link
        href="/donate"
        className="rounded-full bg-clay px-5 py-2 font-body text-sm font-semibold text-sand transition-transform hover:scale-105"
      >
        Donate Now
      </Link>
    </header>
  );
}
