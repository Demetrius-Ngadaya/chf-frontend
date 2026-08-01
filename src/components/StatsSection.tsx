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
    <section className="bg-sand px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <StatCounter
            key={stat.id}
            value={stat.value}
            suffix={stat.suffix ?? ""}
            label={stat.label}
          />
        ))}
      </div>
    </section>
  );
}
