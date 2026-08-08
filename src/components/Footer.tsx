import Link from "next/link";

const COLUMNS = [
  {
    title: "Organization",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Our Team", href: "/team" },
      { label: "Our Projects", href: "/projects" },
      { label: "Our Partners", href: "/partners" },
      { label: "Achievements", href: "/achievements" },
      { label: "Giving Back", href: "/giving-back" },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Donate", href: "/donate" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Become a Partner", href: "/become-a-partner" },
      { label: "Events", href: "/events" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Research & Publications", href: "/research" },
      { label: "Annual Reports", href: "/resources" },
      { label: "Photo Gallery", href: "/gallery" },
      { label: "Video Gallery", href: "/videos" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-baobab-dark px-6 pb-10 pt-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="font-display text-lg font-semibold text-sand">
              Caring Heart Foundation
            </p>
            <p className="mt-3 max-w-xs font-body text-sm text-sand/60">
              A registered Tanzanian NGO promoting quality health, social
              welfare, and sustainable community development.
            </p>
            <p className="mt-4 font-mono text-xs text-sand/40">
              Reg. No. 00NGO/R/7471
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-gold">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-sand/70 transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-sand/10 pt-6 text-center font-body text-xs text-sand/40">
          © {new Date().getFullYear()} Caring Heart Foundation. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
