import { apiGet } from "@/lib/api";

type Partner = {
  id: number;
  name: string;
  category: string | null;
};

export default async function PartnersSection() {
  const partners = await apiGet<Partner[]>("/partners?limit=25");

  if (partners.length === 0) {
    return null;
  }

  const track = [...partners, ...partners];

  return (
    <section className="border-y border-ink/10 bg-sand py-12">
      <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink/50">
        Trusted By Our Partners
      </p>

      <div className="marquee-viewport">
        <div className="marquee-track">
          {track.map((partner, index) => (
            <span
              key={`${partner.id}-${index}`}
              className="mx-8 whitespace-nowrap font-display text-lg text-ink/40"
            >
              {partner.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
