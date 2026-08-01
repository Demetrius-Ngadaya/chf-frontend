import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Video = {
  id: number;
  title: string;
  description: string;
  source: string;
  video_url: string | null;
  category: string | null;
};

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

export default async function VideosPage() {
  const videos = await apiGet<Video[]>("/videos");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Watch
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Video Gallery
          </h1>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {videos.map((video) => {
              const embedUrl = getEmbedUrl(video.video_url);

              return (
                <div key={video.id}>
                  {embedUrl ? (
                    <div className="aspect-video overflow-hidden rounded-lg bg-ink/5">
                      <iframe
                        src={embedUrl}
                        title={video.title}
                        allowFullScreen
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-ink/5">
                      <p className="font-body text-sm text-ink/40">
                        Video unavailable
                      </p>
                    </div>
                  )}
                  <h3 className="mt-3 font-display text-lg text-ink">
                    {video.title}
                  </h3>
                  {video.category && (
                    <p className="font-mono text-xs uppercase tracking-[0.1em] text-clay">
                      {video.category}
                    </p>
                  )}
                  <p className="mt-1 font-body text-sm text-ink/60">
                    {video.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
