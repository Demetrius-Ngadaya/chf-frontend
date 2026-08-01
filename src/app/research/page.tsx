import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Publication = {
  id: number;
  type: string;
  title: string;
  summary: string;
  authors: string[] | null;
  category: string | null;
  published_on: string | null;
};

export default async function PublicationsPage() {
  const publications = await apiGet<Publication[]>("/publications");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Research
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Research & Publications
          </h1>

          <div className="mt-12 divide-y divide-ink/10 border-t border-ink/10">
            {publications.map((p) => (
              <div key={p.id} className="py-6">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                  {p.type.replace("_", " ")}
                  {p.category ? ` \u00b7 ${p.category}` : ""}
                  {p.published_on ? ` \u00b7 ${p.published_on}` : ""}
                </p>
                <h3 className="mt-1 font-display text-xl text-ink">
                  {p.title}
                </h3>
                <p className="mt-2 font-body text-sm text-ink/70">
                  {p.summary}
                </p>
                {p.authors && p.authors.length > 0 && (
                  <p className="mt-1 font-body text-xs text-ink/50">
                    {p.authors.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
