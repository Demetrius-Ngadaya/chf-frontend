"use client";

import { useState } from "react";

type Image = {
  id: number;
  image_path: string;
  title: string;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default function GalleryLightbox({ images }: { images: Image[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <p className="mt-12 font-body text-sm text-ink/50">
        No photos have been uploaded to this gallery yet.
      </p>
    );
  }

  const selected = selectedIndex !== null ? images[selectedIndex] : null;

  function showPrev() {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }

  function showNext() {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className="group aspect-square overflow-hidden rounded-lg bg-ink/5"
          >
            <img
              src={imageUrl(image.image_path)}
              alt={image.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img
            src={imageUrl(selected.image_path)}
            alt={selected.title}
            className="max-h-[85vh] max-w-[85vw] rounded object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Next"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {selected.title && (
            <p className="absolute bottom-6 font-body text-sm text-white/70">
              {selected.title}
            </p>
          )}
        </div>
      )}
    </>
  );
}
