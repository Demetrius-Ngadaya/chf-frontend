"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

type HeroSlideData = {
  id: number;
  title: string;
  slug: string;
  image_path: string;
  thumbnail_path: string | null;
};

const STORAGE_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

function SlideImage({ slide }: { slide: HeroSlideData }) {
  const [loaded, setLoaded] = useState(false);
  const fullUrl = `${STORAGE_BASE}/storage/${slide.image_path}`;
  const thumbUrl = slide.thumbnail_path
    ? `${STORAGE_BASE}/storage/${slide.thumbnail_path}`
    : fullUrl;

  return (
    <div className="relative h-full w-full bg-baobab-dark">
      {/* Blurred low-res placeholder fills the frame so there's never a gap */}
      <img
        src={thumbUrl}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-lg"
      />
      {/* Full image shown uncropped, letterboxed against the blurred backdrop */}
      <img
        src={fullUrl}
        alt={slide.title}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Bottom gradient so the title never blocks the picture */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-5 px-6 text-center md:px-10">
        <p className="font-display text-2xl font-semibold text-sand md:text-4xl">
          {slide.title}
        </p>
        <span className="inline-block rounded-full border border-sand/30 px-6 py-3 font-body text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold">
          View Details
        </span>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides`)
      .then((res) => res.json())
      .then((data: HeroSlideData[]) => setSlides(data))
      .catch(() => setSlides([]));
  }, []);

  if (slides.length === 0) {
    return <div className="absolute inset-0 z-0 bg-baobab" />;
  }

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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Link href={`/highlights/${slide.slug}`} className="block h-full w-full">
              <SlideImage slide={slide} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 bg-gradient-to-t from-baobab-dark/95 via-baobab/60 to-baobab/20" />
    </div>
  );
}
