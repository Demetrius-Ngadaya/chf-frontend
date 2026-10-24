import Link from "next/link";
import { apiGet } from "@/lib/api";
import { storageUrl } from "@/lib/media";
import { RevealGrid, RevealItem } from "@/components/RevealGrid";
import TiltCard from "@/components/TiltCard";
import { Card, CardText, CardTitle, Section, SectionHead } from "@/components/design";

type Member = {
  id: number;
  full_name: string;
  position: string;
  photo_path: string | null;
};

export default async function HomeTeamSection() {
  const members = await apiGet<Member[]>("/team?limit=4");

  if (members.length === 0) return null;

  return (
    <Section>
      <SectionHead
        eyebrow="People & governance"
        title="Leadership and accountability"
        action={{ href: "/team", label: "View all team members" }}
      />
      <RevealGrid className="grid gap-[1.6rem] sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <RevealItem key={member.id}>
            <TiltCard>
              <Link href="/team" className="block">
                <Card className="text-left transition-shadow duration-300 hover:shadow-pop">
                  {member.photo_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={storageUrl(member.photo_path)}
                      alt={member.full_name}
                      className="h-[43px] w-[43px] rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="grid h-[43px] w-[43px] place-items-center rounded-full bg-rose font-body font-extrabold text-clay"
                    >
                      {member.full_name.charAt(0)}
                    </div>
                  )}
                  <CardTitle className="mt-3">{member.full_name}</CardTitle>
                  <CardText>{member.position}</CardText>
                </Card>
              </Link>
            </TiltCard>
          </RevealItem>
        ))}
      </RevealGrid>
    </Section>
  );
}
