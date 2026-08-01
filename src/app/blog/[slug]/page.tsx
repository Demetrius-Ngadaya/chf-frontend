import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string | null;
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  cover_image_path: string | null;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await apiGet<Blog>(`/blogs/${slug}`);

  return (
    <>
      <SiteHeader />
      <main className="bg-sand">
        {post.cover_image_path ? (
          <div className="h-[45vh] w-full overflow-hidden bg-ink/5 md:h-[55vh]">
            <img
              src={imageUrl(post.cover_image_path)}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-[28vh] w-full items-center justify-center bg-baobab/10">
            <span className="font-display text-6xl text-baobab/40">
              {post.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-12 md:px-12">
          <div className="flex flex-wrap items-center gap-2">
            {post.category && (
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                {post.category}
              </span>
            )}
            {post.is_featured && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-3 font-mono text-xs text-ink/40">
            {post.published_at?.slice(0, 10) ?? ""} · {post.views_count} views
          </p>

          <div
            className="rich-content mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
