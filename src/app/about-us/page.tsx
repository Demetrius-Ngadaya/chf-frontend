import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type AboutContent = {
  mission: string;
  vision: string;
  objectives: string[];
};

type AboutPage = {
  slug: string;
  title: string;
  content: AboutContent;
};

export default async function AboutUsPage() {
  const page = await apiGet<AboutPage>("/pages/about-us");
  const { mission, vision, objectives } = page.content;

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Who We Are
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            {page.title}
          </h1>

          <p className="mt-8 font-body text-lg leading-relaxed text-ink/80">
            Caring Heart Foundation (CHF) is a registered, non-profit,
            non-governmental organization committed to promoting quality
            health, social welfare, and sustainable community development
            across Tanzania. Established to respond to pressing health
            challenges and social needs affecting vulnerable populations, CHF
            works through practical, compassionate, and inclusive
            interventions.
          </p>

          <div className="mt-14 grid gap-10 border-t border-ink/10 pt-10 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
                Our Mission
              </p>
              <p className="font-display text-2xl leading-snug text-ink">
                {mission}
              </p>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
                Our Vision
              </p>
              <p className="font-display text-2xl leading-snug text-ink">
                {vision}
              </p>
            </div>
          </div>

          <div className="mt-14 border-t border-ink/10 pt-10">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-clay">
              What We Focus On
            </p>
            <ul className="grid gap-6 md:grid-cols-2">
              {objectives.map((objective, index) => (
                <li
                  key={index}
                  className="flex gap-4 border-l-2 border-baobab pl-4 font-body text-ink/70"
                >
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-14 border-t border-ink/10 pt-10">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Registration
            </p>
            <p className="font-body text-sm text-ink/60">
              Caring Heart Foundation is registered in Tanzania under
              Registration Number 00NGO/R/7471, dated 24 September 2024, to
              operate nationwide within Tanzania Mainland.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
