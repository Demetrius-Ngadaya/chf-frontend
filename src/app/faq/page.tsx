import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { apiGet } from "@/lib/api";

type Faq = {
  id: number;
  category: string | null;
  question: string;
  answer: string;
};

export default async function FaqPage() {
  const faqs = await apiGet<Faq[]>("/faqs");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Questions
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Answers to common questions about donating, volunteering, and
            partnering with Caring Heart Foundation.
          </p>

          <div className="mt-12">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
