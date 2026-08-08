import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import EventRegisterForm from "@/components/EventRegisterForm";
import CountdownTimer from "@/components/CountdownTimer";
import { apiGet } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thechf.or.tz";

type GalleryImage = {
  id: number;
  image_path: string;
  caption: string | null;
};

type Event = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  venue: string | null;
  map_lat: number | null;
  map_lng: number | null;
  start_date: string;
  end_date: string;
  registration_deadline: string | null;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  is_booking_enabled: boolean;
  ticket_price: number | null;
  currency: string | null;
  description: string;
  capacity: number | null;
  organizer: string | null;
  poster_path: string | null;
  agenda: string | null;
  guest_speakers: string | null;
  sponsors: string | null;
  gallery: GalleryImage[];
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

function linesToList(text: string | null) {
  return (text ?? "").split("\n").filter((l) => l.trim());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await apiGet<Event>(`/events/${slug}`);
  const description = event.description.slice(0, 160);

  return {
    title: event.name,
    description,
    openGraph: {
      title: event.name,
      description,
      url: `${siteUrl}/events/${event.slug}`,
      images: event.poster_path ? [imageUrl(event.poster_path)] : undefined,
    },
    twitter: {
      title: event.name,
      description,
      images: event.poster_path ? [imageUrl(event.poster_path)] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await apiGet<Event>(`/events/${slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description.slice(0, 300),
    startDate: event.start_date,
    endDate: event.end_date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: event.venue
      ? {
          "@type": "Place",
          name: event.venue,
        }
      : undefined,
    image: event.poster_path ? [imageUrl(event.poster_path)] : undefined,
    organizer: {
      "@type": "NGO",
      name: "Caring Heart Foundation",
      url: siteUrl,
    },
    offers:
      event.is_booking_enabled
        ? {
            "@type": "Offer",
            price: event.ticket_price ?? 0,
            priceCurrency: event.currency ?? "TZS",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/events/${event.slug}`,
          }
        : undefined,
  };

  const facts = [
    event.venue && { label: "Venue", value: event.venue },
    event.organizer && { label: "Organizer", value: event.organizer },
    event.capacity && {
      label: "Capacity",
      value: event.capacity.toLocaleString(),
    },
    event.start_date && { label: "Start", value: event.start_date.slice(0, 10) },
    event.end_date && { label: "End", value: event.end_date.slice(0, 10) },
    event.registration_deadline && {
      label: "Registration Deadline",
      value: event.registration_deadline.slice(0, 10),
    },
    event.is_booking_enabled &&
      event.ticket_price && {
        label: "Ticket Price",
        value: `${event.ticket_price.toLocaleString()} ${event.currency ?? ""}`.trim(),
      },
  ].filter(Boolean) as { label: string; value: string }[];

  const agendaItems = linesToList(event.agenda);
  const speakerItems = linesToList(event.guest_speakers);
  const sponsorItems = linesToList(event.sponsors);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

          {event.status === "upcoming" && (
            <div className="mt-6">
              <CountdownTimer
                target={event.start_date}
                label="Event Starts In"
              />
            </div>
          )}

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

          {agendaItems.length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Agenda</h2>
              <ul className="mt-3 space-y-2">
                {agendaItems.map((item, i) => (
                  <li
                    key={i}
                    className="font-body text-sm text-ink/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {speakerItems.length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">
                Guest Speakers
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 font-body text-sm text-ink/70">
                {speakerItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {sponsorItems.length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Sponsors</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 font-body text-sm text-ink/70">
                {sponsorItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {event.map_lat && event.map_lng && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Location</h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-ink/10">
                <iframe
                  title="Event location map"
                  width="100%"
                  height="320"
                  loading="lazy"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${event.map_lat},${event.map_lng}&z=15&output=embed`}
                />
              </div>
            </div>
          )}

          {event.gallery.length > 0 && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Gallery</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {event.gallery.map((img) => (
                  <div key={img.id}>
                    <img
                      src={imageUrl(img.image_path)}
                      alt={img.caption ?? ""}
                      className="h-32 w-full rounded object-cover"
                    />
                    {img.caption && (
                      <p className="mt-1 font-body text-xs text-ink/50">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
