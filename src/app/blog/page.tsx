import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Blog = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  cover_image_path: string | null;
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default async function BlogPage() {
  const posts = await apiGet<Blog[]>("/blogs?limit=100");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Stories & Updates
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            News, stories, and updates from Caring Heart Foundation's work
            across Tanzania.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="aspect-video w-full overflow-hidden bg-ink/5">
                  {post.cover_image_path ? (
                    <img
                      src={imageUrl(post.cover_image_path)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl text-ink/20">
                      {post.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
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
                  <h3 className="mt-2 font-display text-xl text-ink">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 font-body text-sm text-ink/60">
                    {post.excerpt}
                  </p>
                  <p className="mt-3 font-mono text-xs text-ink/40">
                    {post.published_at?.slice(0, 10) ?? ""}
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
