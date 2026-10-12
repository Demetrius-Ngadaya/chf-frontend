"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      spaceBetween={32}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
      }}
      className="pb-12"
    >
      {testimonials.map((t) => (
        <SwiperSlide key={t.id}>
          <blockquote className="flex h-full flex-col justify-between rounded-lg border border-ink/10 bg-white/60 p-8">
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
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
