import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import EventRegisterForm from "@/components/EventRegisterForm";
import { apiGet } from "@/lib/api";

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
  ticket_price: number | null;
  currency: string | null;
  description: string;
  capacity: number | null;
  organizer: string | null;
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

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await apiGet<Event>(`/events/${slug}`);

  const facts = [
    event.venue && { label: "Venue", value: event.venue },
    event.organizer && { label: "Organizer", value: event.organizer },
    event.capacity && {
      label: "Capacity",
      value: event.capacity.toLocaleString(),
    },
    event.start_date && { label: "Start", value: event.start_date.slice(0, 10) },
    event.end_date && { label: "End", value: event.end_date.slice(0, 10) },
    event.is_booking_enabled &&
      event.ticket_price && {
        label: "Ticket Price",
        value: `${event.ticket_price.toLocaleString()} ${event.currency ?? ""}`.trim(),
      },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <SiteHeader />
      <main className="bg-sand">
        {event.poster_path ? (
          <div className="h-[50vh] w-full overflow-hidden bg-ink/5 md:h-[60vh]">
            <img
              src={imageUrl(event.poster_path)}
              alt={event.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-[30vh] w-full items-center justify-center bg-baobab/10">
            <span className="font-display text-6xl text-baobab/40">
              {event.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
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

          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {event.name}
          </h1>

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-ink/10 py-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-body text-sm text-ink/80">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="rich-content mt-8">
            <p>{event.description}</p>
          </div>

          {event.is_booking_enabled && event.status === "upcoming" && (
            <EventRegisterForm
              eventSlug={event.slug}
              ticketPrice={event.ticket_price}
              currency={event.currency}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
