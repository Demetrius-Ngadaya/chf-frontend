"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HeroSlideData = {
  id: number;
  title: string;
  slug: string;
  image_path: string;
  thumbnail_path: string | null;
};

const STORAGE_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

function imageUrl(path: string) {
  return `${STORAGE_BASE}/storage/${path}`;
}

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides`)
      .then((res) => res.json())
      .then((data: HeroSlideData[]) => setSlides(data))
      .catch(() => setSlides([]));
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return <div className="aspect-[16/9] w-full bg-baobab md:aspect-[21/9]" />;
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-baobab-dark md:aspect-[21/9]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: index === current ? 1 : 0,
            transitionDuration: "1200ms",
            pointerEvents: index === current ? "auto" : "none",
          }}
        >
          <Link href={`/highlights/${slide.slug}`} className="block h-full w-full">
            <img
              src={imageUrl(slide.image_path)}
              alt={slide.title}
              className="h-full w-full object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-4 px-6 text-center md:bottom-10 md:px-10">
              <p className="font-display text-xl font-semibold text-sand md:text-4xl">
                {slide.title}
              </p>
              <span className="inline-block rounded-full border border-sand/30 px-5 py-2.5 font-body text-sm font-semibold text-sand transition-colors hover:border-gold hover:text-gold md:px-6 md:py-3">
                View Details
              </span>
            </div>
          </Link>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                index === current ? "w-6 bg-sand" : "w-1.5 bg-sand/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
