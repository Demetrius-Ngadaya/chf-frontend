import Link from "next/link";
import { apiGet } from "@/lib/api";
import { storageUrl } from "@/lib/media";
import { Card, CardText, CardTitle, Section, SectionHead, Tag } from "@/components/design";

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

export default async function EventsSection() {
  const events = await apiGet<Event[]>("/events?status=upcoming&order=asc&limit=3");

  if (events.length === 0) return null;

  return (
    <Section>
      <SectionHead
        eyebrow="Get involved"
        title="Upcoming events"
        intro="Join us at outreach days, trainings and community gatherings."
        action={{ href: "/events", label: "View all events" }}
      />
      <div className="grid gap-[1.6rem] md:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} href={`/events/${event.slug}`} className="group flex">
            <Card className="flex w-full flex-col overflow-hidden p-0">
              <div className="aspect-video w-full overflow-hidden bg-soft">
                {event.poster_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={storageUrl(event.poster_path)}
                    alt={event.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-body text-4xl font-bold text-baobab/20">
                    {event.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Tag tone="active">{event.category ?? "Event"}</Tag>
                <CardTitle className="mt-3">{event.name}</CardTitle>
                <CardText className="mt-auto pt-2 text-[0.85rem]">
                  {event.start_date?.slice(0, 10) ?? ""}
                  {event.venue ? ` · ${event.venue}` : ""}
                </CardText>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
