import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Resource = {
  id: number;
  type: string;
  title: string;
  description: string;
  year: number | null;
  file_path: string;
};

const STORAGE_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "");

export default async function ResourcesPage() {
  const resources = await apiGet<Resource[]>("/resources");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Transparency
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Resources
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Annual reports, our strategic plan, financial statements, and
            legal documents.
          </p>

          <div className="mt-12 divide-y divide-ink/10 border-t border-ink/10">
            {resources.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between py-5"
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                    {r.type.replace("_", " ")}
                    {r.year ? ` \u00b7 ${r.year}` : ""}
                  </p>
                  <h3 className="mt-1 font-display text-lg text-ink">
                    {r.title}
                  </h3>
                </div>
                <a
                  href={`${STORAGE_BASE}/storage/${r.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-full border border-ink/20 px-5 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-baobab hover:text-baobab"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
