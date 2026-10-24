import Link from "next/link";
import Image from "next/image";
import FooterSocialLinks from "@/components/FooterSocialLinks";

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
  {
    title: "Staff",
    links: [
      { label: "Login", href: "/admin/login" },
      { label: "Staff Mail", href: "https://server14.tanzaniaservers.com/roundcube/" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-baobab px-6 pb-6 pt-14 text-[#cbd5e1] md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_repeat(5,1fr)]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.jpg"
                alt="Caring Heart Foundation logo"
                width={45}
                height={45}
                className="h-[45px] w-[45px] shrink-0 rounded-xl border-2 border-clay object-cover"
              />
              <div>
                <p className="text-[0.82rem] font-bold tracking-wide text-white">CARING HEART FOUNDATION</p>
                <p className="mt-1 text-[0.6rem] tracking-[0.12em] text-gold">IMPROVED LIFE &amp; SOCIAL INCLUSION</p>
              </div>
            </div>
            <p className="mt-3 max-w-xs font-body text-sm text-[#cbd5e1]">
              A registered Tanzanian NGO promoting quality health, social
              welfare, and sustainable community development.
            </p>
            <address className="mt-4 space-y-1 font-body text-xs not-italic leading-[1.9] text-[#cbd5e1]">
              <p>Reg. No. 00NGO/R/7471 · Registered 24 September 2024</p>
              <p>+255 683 199 460 · +255 652 007 437</p>
              <p>P.O. Box 73, Ifakara, Tanzania</p>
              <p>
                <a href="mailto:info@thechf.or.tz" className="hover:text-gold">
                  info@thechf.or.tz
                </a>
              </p>
            </address>
            <div className="mt-5">
              <FooterSocialLinks />
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="mb-4 font-body text-base font-semibold text-white">
                {column.title}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="font-body text-sm text-[#cbd5e1] transition-colors hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-white/15 pt-5 text-center font-body text-xs text-[#cbd5e1]">
          © {new Date().getFullYear()} Caring Heart Foundation. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}