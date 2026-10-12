"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";

type Stats = {
  faqs: number;
  projects: number;
  events: number;
  blogs: number;
  team: number;
  partners: number;
  testimonials: number;
  videos: number;
  galleries: number;
  volunteers_pending: number;
  volunteers_total: number;
  contacts_unread: number;
  contacts_total: number;
  partner_applications_pending: number;
  partner_applications_total: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminFetch<Stats>("/dashboard/stats").then(setStats);
  }, []);

  const contentCards = stats
    ? [
        { label: "Projects", value: stats.projects, href: "/admin/projects" },
        { label: "Events", value: stats.events, href: "/admin/events" },
        { label: "Blog Posts", value: stats.blogs, href: "/admin/blogs" },
        { label: "Team Members", value: stats.team, href: "/admin/team" },
        { label: "Partners", value: stats.partners, href: "/admin/partners" },
        {
          label: "Testimonials",
          value: stats.testimonials,
          href: "/admin/testimonials",
        },
        { label: "Videos", value: stats.videos, href: "/admin/videos" },
        {
          label: "Gallery Albums",
          value: stats.galleries,
          href: "/admin/galleries",
        },
        { label: "FAQs", value: stats.faqs, href: "/admin/faqs" },
      ]
    : [];

  const applicationCards = stats
    ? [
        {
          label: "Volunteer Applications",
          value: stats.volunteers_total,
          highlight: stats.volunteers_pending,
          highlightLabel: "pending",
          href: "/admin/volunteers",
        },
        {
          label: "Partner Applications",
          value: stats.partner_applications_total,
          highlight: stats.partner_applications_pending,
          highlightLabel: "pending",
          href: "/admin/partner-applications",
        },
        {
          label: "Contact Messages",
          value: stats.contacts_total,
          highlight: stats.contacts_unread,
          highlightLabel: "unread",
          href: "/admin/contacts",
        },
      ]
    : [];

  return (
    <main className="px-6 py-8 md:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
        Overview
      </p>
      <h1 className="mt-1 font-display text-2xl text-ink">Dashboard</h1>

      {!stats ? (
        <p className="mt-8 font-body text-sm text-ink/50">Loading stats...</p>
      ) : (
        <>
          <h2 className="mt-8 font-body text-sm font-semibold text-ink/60">
            Content
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {contentCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-lg border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <p className="font-display text-3xl text-ink">
                  {card.value}
                </p>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {card.label}
                </p>
              </Link>
            ))}
          </div>

          <h2 className="mt-10 font-body text-sm font-semibold text-ink/60">
            Applications & Messages
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {applicationCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-lg border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-3xl text-ink">
                    {card.value}
                  </p>
                  {card.highlight > 0 && (
                    <span className="rounded-full bg-clay/10 px-2 py-0.5 font-mono text-xs text-clay">
                      {card.highlight} {card.highlightLabel}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {card.label}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
