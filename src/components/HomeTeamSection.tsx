import Link from "next/link";
import { apiGet } from "@/lib/api";
import { RevealGrid, RevealItem } from "@/components/RevealGrid";
import TiltCard from "@/components/TiltCard";

type Member = {
  id: number;
  full_name: string;
  position: string;
  photo_path: string | null;
};

function photoUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export default async function HomeTeamSection() {
  const members = await apiGet<Member[]>("/team?limit=4");

  if (members.length === 0) return null;

  return (
    <section className="bg-sand px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Who We Ar  e
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Meet Our Team
            </h2>
          </div>
          <Link
            href="/team"
            className="font-body text-sm text-baobab underline"
          >
            View all team members
          </Link>
        </div>

        <RevealGrid className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <RevealItem key={member.id}>
              <TiltCard>
                <Link
                  href="/team"
                  className="flex flex-col items-center rounded-xl border-t-2 border-baobab bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-xl"
                >
                  {member.photo_path ? (
                    <img
                      src={photoUrl(member.photo_path)}
                      alt={member.full_name}
                      className="h-24 w-24 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-baobab/10 font-display text-2xl text-baobab">
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                  <h3 className="mt-4 font-display text-lg text-ink">
                    {member.full_name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-clay">
                    {member.position}
                  </p>
                </Link>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGrid>
      </div>
    </section>
  );
}
