import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Entry = {
  id: number;
  title: string;
  description: string;
  category: string | null;
  image_path: string | null;
  video_url: string | null;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

function videoEmbedUrl(url: string) {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

export default async function GivingBackPage() {
  const entries = await apiGet<Entry[]>("/giving-back");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Impact
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Giving Back
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            Stories, community activities, and the impact of your support
            across Tanzania.
          </p>

          <div className="mt-12 space-y-16">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex flex-col gap-8 md:flex-row ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2">
                  {entry.image_path ? (
                    <img
                      src={imageUrl(entry.image_path)}
                      alt={entry.title}
                      className="aspect-video w-full rounded-lg object-cover"
                    />
                  ) : entry.video_url ? (
                    <iframe
                      title={entry.title}
                      src={videoEmbedUrl(entry.video_url)}
                      className="aspect-video w-full rounded-lg"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-baobab/10">
                      <span className="font-display text-4xl text-baobab/40">
                        {entry.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2">
                  {entry.category && (
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                      {entry.category}
                    </p>
                  )}
                  <h2 className="mt-2 font-display text-2xl text-ink">
                    {entry.title}
                  </h2>
                  <div
                    className="rich-content mt-4"
                    dangerouslySetInnerHTML={{ __html: entry.description }}
                  />
                  {entry.image_path && entry.video_url && (
                    <div className="mt-4 overflow-hidden rounded-lg">
                      <iframe
                        title={entry.title}
                        src={videoEmbedUrl(entry.video_url)}
                        className="aspect-video w-full"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
