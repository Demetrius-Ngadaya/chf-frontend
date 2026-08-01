"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

type Slide = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

const SLIDES: Slide[] = [
  {
    id: "1",
    src: "/images/hero/slide-1.jpg",
    alt: "Tanzanian savanna landscape",
    label: "Reaching every region of Tanzania",
  },
  {
    id: "2",
    src: "/images/hero/slide-2.jpg",
    alt: "Mount Kilimanjaro",
    label: "From the highlands to the coast",
  },
  {
    id: "3",
    src: "/images/hero/slide-3.jpg",
    alt: "Zanzibar coastline at sunset",
    label: "Community by community",
  },
];

export default function HeroSlider() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full w-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-8 right-8">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-sand/70">
                  {slide.label}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 bg-gradient-to-t from-baobab-dark/95 via-baobab/60 to-baobab/20" />
    </div>
  );
}
