import { apiGet } from "@/lib/api";
import StatCounter from "./StatCounter";

type Statistic = {
  id: number;
  label: string;
  value: number;
  suffix: string | null;
};

export default async function StatsSection() {
  const stats = await apiGet<Statistic[]>("/statistics");

  return (
    <section className="bg-[#edf1f5] px-[22px] py-[50px]">
      <div className="mx-auto grid max-w-[1120px] grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.id} className="rounded-[11px] border border-[#e2e8f0] bg-white p-4">
            <StatCounter
              value={stat.value}
              suffix={stat.suffix ?? ""}
              label={stat.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
