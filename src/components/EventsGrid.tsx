"use client";

import { useState } from "react";
import Link from "next/link";

type Event = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  venue: string | null;
  start_date: string | null;
  end_date: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  is_booking_enabled: boolean;
  poster_path: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

function ViewToggle({
  view,
  setView,
}: {
  view: "card" | "list";
  setView: (v: "card" | "list") => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-ink/15 bg-white p-1">
      <button
        onClick={() => setView("card")}
        className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors ${
          view === "card" ? "bg-baobab text-sand" : "text-ink/60"
        }`}
      >
        Cards
      </button>
      <button
        onClick={() => setView("list")}
        className={`rounded-full px-4 py-1.5 font-body text-sm transition-colors ${
          view === "list" ? "bg-baobab text-sand" : "text-ink/60"
        }`}
      >
        List
      </button>
    </div>
  );
}

export default function EventsGrid({ events }: { events: Event[] }) {
  const [view, setView] = useState<"card" | "list">("card");

  return (
    <>
      <div className="mt-8 flex justify-end">
        <ViewToggle view={view} setView={setView} />
      </div>

      {view === "card" ? (
        <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden bg-ink/5">
                {event.poster_path ? (
                  <img
                    src={imageUrl(event.poster_path)}
                    alt={event.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-4xl text-ink/20">
                    {event.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {event.category && (
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                      {event.category}
                    </span>
                  )}
                  <span className="rounded-full bg-baobab/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-baobab">
                    {STATUS_LABELS[event.status]}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl text-ink">
                  {event.name}
                </h3>
                <p className="mt-1 font-body text-sm text-ink/50">
                  {event.start_date?.slice(0, 10) ?? ""}
                  {event.venue ? ` · ${event.venue}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-sand/60"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded bg-ink/5">
                {event.poster_path ? (
                  <img
                    src={imageUrl(event.poster_path)}
                    alt={event.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-lg text-ink/20">
                    {event.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {event.category && (
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                      {event.category}
                    </span>
                  )}
                  <span className="rounded-full bg-baobab/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-baobab">
                    {STATUS_LABELS[event.status]}
                  </span>
                </div>
                <h3 className="mt-1 truncate font-display text-lg text-ink">
                  {event.name}
                </h3>
              </div>
              <p className="shrink-0 font-body text-sm text-ink/50">
                {event.start_date?.slice(0, 10) ?? ""}
                {event.venue ? ` · ${event.venue}` : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
