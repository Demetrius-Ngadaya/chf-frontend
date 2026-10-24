import { apiGet } from "@/lib/api";
import { Section, SectionHead } from "@/components/design";
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

  if (testimonials.length === 0) return null;

  return (
    <Section tone="soft">
      <SectionHead
        eyebrow="Voices from the community"
        title="Stories of impact"
        action={{ href: "/testimonials", label: "More stories" }}
      />
      <TestimonialsCarousel testimonials={testimonials} />
    </Section>
  );
}
