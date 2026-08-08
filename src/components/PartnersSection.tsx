import { apiGet } from "@/lib/api";

type Partner = {
  id: number;
  name: string;
  category: string | null;
  logo_path: string | null;
};

function logoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

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
              className="mx-8 flex items-center gap-3 whitespace-nowrap"
            >
              {partner.logo_path ? (
                <img
                  src={logoUrl(partner.logo_path)}
                  alt={partner.name}
                  className="h-9 w-9 shrink-0 rounded-full bg-white object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-baobab/10 font-display text-sm text-baobab">
                  {partner.name.charAt(0)}
                </span>
              )}
              <span className="font-display text-lg text-ink/40">
                {partner.name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
