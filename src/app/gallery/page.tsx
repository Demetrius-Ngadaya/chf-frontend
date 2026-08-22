import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Gallery = {
  id: number;
  title: string;
  description: string;
  cover_image_path: string | null;
  images_count: number;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default async function GalleryPage() {
  const galleries = await apiGet<Gallery[]>("/galleries");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            See Our Work
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Photo Gallery
          </h1>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {galleries.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/gallery/${gallery.id}`}
                className="group block overflow-hidden rounded-lg border border-ink/10 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="aspect-video w-full overflow-hidden bg-ink/5">
                  {gallery.cover_image_path ? (
                    <img
                      src={imageUrl(gallery.cover_image_path)}
                      alt={gallery.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl text-ink/20">
                      {gallery.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-ink">
                    {gallery.title}
                  </h3>
                  <p className="mt-1 font-body text-sm text-ink/60">
                    {gallery.description}
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.1em] text-clay">
                    {gallery.images_count > 0
                      ? `${gallery.images_count} photo${gallery.images_count === 1 ? "" : "s"}`
                      : "No photos yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
