import { apiGet } from "@/lib/api";
import { storageUrl } from "@/lib/media";

type Partner = {
  id: number;
  name: string;
  category: string | null;
  logo_path: string | null;
};

export default async function PartnersSection() {
  const partners = await apiGet<Partner[]>("/partners?limit=25");
  if (partners.length === 0) return null;

  const track = [...partners, ...partners];

  return (
    <section className="border-y border-line bg-soft py-12">
      <p className="mb-8 text-center font-body text-[0.72rem] font-extrabold uppercase tracking-[2px] text-clay">
        Trusted by our partners
      </p>
      <div className="marquee-viewport">
        <div className="marquee-track">
          {track.map((partner, index) => (
            <span
              key={`${partner.id}-${index}`}
              className="mx-8 flex items-center gap-3 whitespace-nowrap"
            >
              {partner.logo_path ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={storageUrl(partner.logo_path)}
                  alt={partner.name}
                  className="h-9 w-9 shrink-0 rounded-full bg-white object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose font-body text-sm font-bold text-clay">
                  {partner.name.charAt(0)}
                </span>
              )}
              <span className="font-body text-base font-bold text-baobab/50">{partner.name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
