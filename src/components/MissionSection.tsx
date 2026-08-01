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

export default async function MissionSection() {
  const page = await apiGet<AboutPage>("/pages/about-us");
  const { mission, vision, objectives } = page.content;

  return (
    <section className="bg-baobab-dark px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            Our Mission
          </p>
          <p className="font-display text-2xl leading-snug text-sand md:text-3xl">
            {mission}
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">
            Our Vision
          </p>
          <p className="font-display text-2xl leading-snug text-sand md:text-3xl">
            {vision}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-6xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-gold">
          What We Focus On
        </p>
        <ul className="grid gap-6 md:grid-cols-2">
          {objectives.map((objective, index) => (
            <li
              key={index}
              className="flex gap-4 border-l-2 border-gold/40 pl-4 font-body text-sand/80"
            >
              {objective}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
