import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import TermsAccordion from "@/components/TermsAccordion";
import { apiGet } from "@/lib/api";

type Term = {
  id: number;
  title: string;
  description: string;
};

export default async function TermsPage() {
  const terms = await apiGet<Term[]>("/terms");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Legal
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Terms & Conditions
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Please review the terms that govern your use of the Caring Heart
            Foundation website and services.
          </p>

          <div className="mt-12">
            <TermsAccordion terms={terms} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
