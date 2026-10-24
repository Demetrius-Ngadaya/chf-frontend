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
      spaceBetween={15}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
      }}
      className="pb-12"
    >
      {testimonials.map((t) => (
        <SwiperSlide key={t.id}>
          <blockquote className="flex h-full flex-col justify-between rounded-card border-t-4 border-t-transparent bg-white p-[1.8rem] shadow-card hover:border-t-clay transition-colors">
            <p className="font-body text-base leading-[1.8] text-ink">
              &ldquo;{t.story}&rdquo;
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span
                aria-hidden
                className="grid h-[43px] w-[43px] shrink-0 place-items-center rounded-full bg-rose font-body font-extrabold text-clay"
              >
                {t.name.charAt(0)}
              </span>
              <span>
                <span className="block font-body text-sm font-bold text-baobab">{t.name}</span>
                <span className="block font-body text-[0.72rem] text-muted">
                  {CATEGORY_LABELS[t.category] ?? t.category}
                  {t.location ? ` \u00b7 ${t.location}` : ""}
                </span>
              </span>
            </footer>
          </blockquote>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
