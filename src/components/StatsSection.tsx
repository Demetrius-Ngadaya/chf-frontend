import { apiGet } from "@/lib/api";
import { Eyebrow, Section } from "@/components/design";
import StatCounter from "./StatCounter";

type Statistic = {
  id: number;
  label: string;
  value: number;
  suffix: string | null;
};

export default async function StatsSection() {
  const stats = await apiGet<Statistic[]>("/statistics");

  if (stats.length === 0) return null;

  return (
    <Section tone="navy" id="impact">
      <div className="mx-auto mb-12 max-w-[52rem] text-center">
        <Eyebrow className="text-[#fca5a5]">Our impact</Eyebrow>
        <h2 className="my-2.5 font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.25] text-white">
          The difference you help make
        </h2>
        <p className="text-base text-[#cbd5e1]">
          A transparent view of our reach, partnerships and activity across Tanzania.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-[1.4rem] md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <StatCounter
            key={stat.id}
            value={stat.value}
            suffix={stat.suffix ?? ""}
            label={stat.label}
          />
        ))}
      </div>
    </Section>
  );
}
