"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard" }],
  },
  {
    label: "Content",
    items: [
      { label: "Projects", href: "/admin/projects" },
      { label: "Events", href: "/admin/events" },
      { label: "Blog", href: "/admin/blogs" },
      { label: "Team", href: "/admin/team" },
      { label: "Partners", href: "/admin/partners" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "Videos", href: "/admin/videos" },
      { label: "Gallery", href: "/admin/galleries" },
      { label: "FAQs", href: "/admin/faqs" },
      { label: "Giving Back", href: "/admin/giving-back" },
      { label: "Event Registrations", href: "/admin/event-registrations" },
    ],
  },
  {
    label: "Applications",
    items: [
      { label: "Volunteers", href: "/admin/volunteers" },
      { label: "Partner Applications", href: "/admin/partner-applications" },
      { label: "Contact Messages", href: "/admin/contacts" },
      { label: "Live Chat", href: "/admin/chat" },
    ],
  },
  {
    label: "Administration",
    items: [{ label: "Admin Users", href: "/admin/users" }],
  },
];

export default function AdminSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      for (const group of NAV_GROUPS) {
        initial[group.label] = group.items.some((item) =>
          pathname?.startsWith(item.href)
        );
      }
      initial["Overview"] = true;
      return initial;
    }
  );

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <nav className="flex h-full flex-col gap-4 overflow-y-auto bg-baobab-dark px-4 py-6">
      <Link
        href="/admin/dashboard"
        onClick={onNavigate}
        className="flex flex-col items-center gap-2 px-2 py-2"
      >
        <Image
          src="/images/logo.jpg"
          alt="Caring Heart Foundation"
          width={72}
          height={72}
          className="h-16 w-16 rounded-full object-cover"
        />
      </Link>

      {NAV_GROUPS.map((group) => {
        const isOpen = openGroups[group.label];
        return (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggleGroup(group.label)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-sand/40 hover:text-sand/70"
            >
              {group.label}
              <span
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="mt-1 flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`rounded px-2 py-2 font-body text-sm transition-colors ${
                        isActive
                          ? "bg-sand/10 font-semibold text-sand"
                          : "text-sand/70 hover:bg-sand/5 hover:text-sand"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
