import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import TeamGrid from "@/components/TeamGrid";
import { apiGet } from "@/lib/api";

type Member = {
  id: number;
  full_name: string;
  position: string;
  bio: string;
  qualifications: string;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  photo_path: string | null;
};

export default async function TeamPage() {
  const members = await apiGet<Member[]>("/team");

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Who We Are
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Our Team
          </h1>
          <p className="mt-4 max-w-2xl font-body text-ink/60">
            The people behind Caring Heart Foundation&apos;s work across
            Tanzania. Click on a team member to learn more.
          </p>

          <TeamGrid members={members} />
        </div>
      </main>
      <Footer />
    </>
  );
}
