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
              <div key={gallery.id} className="border-t-2 border-baobab pt-6">
                <div className="flex aspect-video items-center justify-center rounded-lg bg-ink/5">
                  <p className="font-body text-xs text-ink/30">
                    {gallery.images_count > 0
                      ? `${gallery.images_count} photos`
                      : "No photos uploaded yet"}
                  </p>
                </div>
                <h3 className="mt-3 font-display text-lg text-ink">
                  {gallery.title}
                </h3>
                <p className="mt-1 font-body text-sm text-ink/60">
                  {gallery.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
