import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import PartnerGrid from "@/components/PartnerGrid";
import { apiGet } from "@/lib/api";

type Partner = {
  id: number;
  name: string;
  category: string | null;
  description: string;
  website: string | null;
  country: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  logo_path: string | null;
};

export default async function PartnersPage() {
  const partners = await apiGet<Partner[]>("/partners?limit=100");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Working Together
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Our Partners
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            Caring Heart Foundation works with hospitals, government
            institutions, schools, and other organizations to reach
            communities across Tanzania. Click a partner to learn more.
          </p>

          <PartnerGrid partners={partners} />
        </div>
      </main>
      <Footer />
    </>
  );
}
