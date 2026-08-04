import Link from "next/link";
import { apiGet } from "@/lib/api";

type Event = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  venue: string | null;
  start_date: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  poster_path: string | null;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default async function EventsSection() {
  const events = await apiGet<Event[]>(
    "/events?status=upcoming&order=asc&limit=3"
  );

  if (events.length === 0) return null;

  return (
    <section className="bg-white px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Get Involved
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Upcoming Events
            </h2>
          </div>
          <Link
            href="/events"
            className="font-body text-sm text-baobab underline"
          >
            View all events
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-sand transition-shadow hover:shadow-lg"
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
                {event.category && (
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                    {event.category}
                  </span>
                )}
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
      </div>
    </section>
  );
}
