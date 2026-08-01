import { apiGet } from "@/lib/api";
import TestimonialsCarousel from "./TestimonialsCarousel";

type Testimonial = {
  id: number;
  name: string;
  category: string;
  story: string;
  location: string | null;
  rating: number | null;
};

export default async function TestimonialsSection() {
  const testimonials = await apiGet<Testimonial[]>("/testimonials?limit=6");

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-sand px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Voices From The Community
          </p>
          <h2 className="font-display text-3xl text-ink md:text-4xl">
            Stories of Impact
          </h2>
        </div>

        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
