import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Testimonial = {
  id: number;
  name: string;
  category: string;
  story: string;
  location: string | null;
  rating: number | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  patient: "Patient",
  health_worker: "Health Worker",
  community_leader: "Community Leader",
  woman: "Woman Beneficiary",
  youth: "Youth Beneficiary",
  partner: "Partner",
};

export default async function TestimonialsPage() {
  const testimonials = await apiGet<Testimonial[]>("/testimonials?limit=100");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Voices From The Community
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Stories of Impact
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            Real stories from patients, health workers, community leaders,
            and the people whose lives have been touched by our work.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="flex h-full flex-col justify-between rounded-lg border border-ink/10 bg-white p-6"
              >
                <p className="font-display text-lg leading-snug text-ink">
                  &ldquo;{t.story}&rdquo;
                </p>
                <footer className="mt-6">
                  <p className="font-body text-sm font-semibold text-ink">
                    {t.name}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-ink/50">
                    {CATEGORY_LABELS[t.category] ?? t.category}
                    {t.location ? ` \u00b7 ${t.location}` : ""}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
