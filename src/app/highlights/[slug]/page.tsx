import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";

type HeroSlideData = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  image_path: string;
  thumbnail_path: string | null;
};

async function getSlide(slug: string): Promise<HeroSlideData | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hero-slides/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HighlightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slide = await getSlide(slug);

  if (!slide) notFound();

  const storageBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

  return (
    <main>
      <SiteHeader />
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden bg-baobab">
        <img
          src={`${storageBase}/storage/${slide.image_path}`}
          alt={slide.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-baobab-dark/90 via-baobab/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-8 px-6 md:px-12">
          <h1 className="max-w-3xl font-display text-3xl font-semibold text-sand md:text-5xl">
            {slide.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 md:px-0">
        {slide.description ? (
          <p className="whitespace-pre-line font-body text-lg leading-relaxed text-ink/80">
            {slide.description}
          </p>
        ) : (
          <p className="font-body text-sm text-ink/50">No description added yet.</p>
        )}
      </section>
    </main>
  );
}
