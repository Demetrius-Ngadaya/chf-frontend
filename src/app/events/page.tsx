import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import EventsGrid from "@/components/EventsGrid";
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
  poster_path: string | null;
};

export default async function EventsPage() {
  const events = await apiGet<Event[]>("/events?limit=100");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Get Involved
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Events
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            Upcoming and past events hosted by Caring Heart Foundation.
          </p>

          <EventsGrid events={events} />
        </div>
      </main>
      <Footer />
    </>
  );
}
