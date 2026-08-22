import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import GalleryLightbox from "@/components/GalleryLightbox";
import { apiGet } from "@/lib/api";

type GalleryDetail = {
  id: number;
  title: string;
  description: string;
  images: { id: number; image_path: string; title: string }[];
};

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await apiGet<GalleryDetail>(`/galleries/${id}`);

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Photo Gallery
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="mt-4 max-w-2xl font-body text-ink/60">
              {gallery.description}
            </p>
          )}

          <GalleryLightbox images={gallery.images} />
        </div>
      </main>
      <Footer />
    </>
  );
}
