import { apiGet } from "@/lib/api";

type AboutContent = { intro?: string; mission: string; vision: string; objectives: string[] };
type AboutPage = { slug: string; title: string; content: AboutContent };

function Card({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <article className="rounded-[14px] border border-[#e2e8f0] bg-white p-[21px] shadow-[0_3px_10px_#152d4308]">
      <div className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#fff0f1] text-[1.25rem] font-extrabold text-clay">
        {icon}
      </div>
      <h3 className="mb-2 mt-[13px] text-base font-bold text-baobab">{title}</h3>
      <p className="text-[0.82rem] leading-[1.8] text-[#64748b]">{text}</p>
    </article>
  );
}

export default async function MissionSection() {
  const page = await apiGet<AboutPage>("/pages/about-us");
  const { intro, mission, vision, objectives } = page.content;

  return (
    <section className="px-[22px] py-[65px]">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-[26px] max-w-[700px]">
          <div className="text-[0.72rem] font-extrabold uppercase tracking-[2px] text-clay">Who we are</div>
          <h2 className="my-2.5 text-[clamp(1.7rem,3vw,2.35rem)] font-bold leading-[1.2] tracking-[-0.8px] text-baobab">
            A community-centered approach to health
          </h2>
          {intro && <p className="text-[0.9rem] leading-[1.85] text-[#64748b]">{intro}</p>}
        </div>

        <div className="grid gap-[15px] sm:grid-cols-2">
          <Card icon="◎" title="Our Vision" text={vision} />
          <Card icon="♥" title="Our Mission" text={mission} />
          {objectives.map((o, i) => (
            <Card key={i} icon={["✦", "✓", "⊕", "☼"][i % 4]} title={`Focus ${i + 1}`} text={o} />
          ))}
        </div>
      </div>
    </section>
  );
}
