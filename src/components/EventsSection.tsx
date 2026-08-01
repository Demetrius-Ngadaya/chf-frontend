import Link from "next/link";
import { apiGet } from "@/lib/api";

type Event = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  venue: string | null;
  start_date: string | null;
  is_booking_enabled: boolean;
  ticket_price: number | null;
  currency: string;
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EventsSection() {
  const events = await apiGet<Event[]>(
    "/events?status=upcoming&order=asc&limit=3"
  );

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-baobab-dark px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Get Involved
            </p>
            <h2 className="font-display text-3xl text-sand md:text-4xl">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden font-body text-sm text-sand/70 underline underline-offset-4 hover:text-gold md:block"
          >
            View all events
          </Link>
        </div>

        <div className="divide-y divide-sand/10">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group flex flex-col items-start justify-between gap-3 py-6 md:flex-row md:items-center"
            >
              <div>
                {event.category && (
                  <p className="mb-1 font-mono text-xs uppercase tracking-[0.15em] text-gold/80">
                    {event.category}
                  </p>
                )}
                <h3 className="font-display text-xl text-sand group-hover:text-gold">
                  {event.name}
                </h3>
                <p className="mt-1 font-body text-sm text-sand/60">
                  {formatDate(event.start_date)}
                  {event.venue ? ` \u00b7 ${event.venue}` : ""}
                </p>
              </div>

              {event.is_booking_enabled ? (
                <span className="shrink-0 rounded-full bg-clay px-5 py-2 font-body text-sm font-semibold text-sand transition-transform group-hover:scale-105">
                  Reserve a Spot
                </span>
              ) : (
                <span className="shrink-0 font-body text-sm text-sand/50">
                  Learn more &rarr;
                </span>
              )}
            </Link>
          ))}
        </div>

        <Link
          href="/events"
          className="mt-6 block text-center font-body text-sm text-sand/70 underline underline-offset-4 hover:text-gold md:hidden"
        >
          View all events
        </Link>
      </div>
    </section>
  );
}
