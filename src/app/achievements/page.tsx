import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

type Achievement = {
  id: number;
  title: string;
  description: string;
  type: string;
  achieved_on: string | null;
};

export default async function AchievementsPage() {
  const achievements = await apiGet<Achievement[]>("/achievements");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Our Journey
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Achievements
          </h1>

          <div className="mt-12 divide-y divide-ink/10 border-t border-ink/10">
            {achievements.map((a) => (
              <div key={a.id} className="py-6">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                  {a.type.replace("_", " ")}
                  {a.achieved_on ? ` \u00b7 ${a.achieved_on}` : ""}
                </p>
                <h3 className="mt-1 font-display text-xl text-ink">
                  {a.title}
                </h3>
                <p className="mt-2 font-body text-sm text-ink/70">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
