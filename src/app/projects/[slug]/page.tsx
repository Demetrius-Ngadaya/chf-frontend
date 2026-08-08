import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { apiGet } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thechf.or.tz";

type Project = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  status: "planned" | "ongoing" | "completed" | "suspended";
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string;
  is_featured: boolean;
  image_path: string | null;
  budget: number | null;
  donor: string | null;
  beneficiaries_count: number | null;
  project_manager: string | null;
  objectives: string | null;
  achievements: string | null;
  lessons_learned: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  suspended: "Suspended",
};

function imageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/storage/${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await apiGet<Project>(`/projects/${slug}`);
  const description = project.description.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: project.name,
    description,
    openGraph: {
      title: project.name,
      description,
      url: `${siteUrl}/projects/${project.slug}`,
      images: project.image_path ? [imageUrl(project.image_path)] : undefined,
    },
    twitter: {
      title: project.name,
      description,
      images: project.image_path ? [imageUrl(project.image_path)] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await apiGet<Project>(`/projects/${slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description.replace(/<[^>]+>/g, "").slice(0, 300),
    url: `${siteUrl}/projects/${project.slug}`,
    image: project.image_path ? imageUrl(project.image_path) : undefined,
    publisher: {
      "@type": "NGO",
      name: "Caring Heart Foundation",
    },
  };

  const facts = [
    project.location && { label: "Location", value: project.location },
    project.donor && { label: "Donor", value: project.donor },
    project.beneficiaries_count && {
      label: "Beneficiaries",
      value: project.beneficiaries_count.toLocaleString(),
    },
    project.project_manager && {
      label: "Project Manager",
      value: project.project_manager,
    },
    project.start_date && { label: "Start Date", value: project.start_date },
    project.end_date && { label: "End Date", value: project.end_date },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="bg-sand">
        {project.image_path ? (
          <div className="h-[50vh] w-full overflow-hidden bg-ink/5 md:h-[60vh]">
            <img
              src={imageUrl(project.image_path)}
              alt={project.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex h-[30vh] w-full items-center justify-center bg-baobab/10">
            <span className="font-display text-6xl text-baobab/40">
              {project.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
          <div className="flex flex-wrap items-center gap-2">
            {project.category && (
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                {project.category}
              </span>
            )}
            <span className="rounded-full bg-baobab/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-baobab">
              {STATUS_LABELS[project.status]}
            </span>
            {project.is_featured && (
              <span className="rounded-full bg-gold/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
                Featured
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {project.name}
          </h1>

          {facts.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-ink/10 py-6 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-body text-sm text-ink/80">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div
            className="rich-content mt-8"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          {project.objectives && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Objectives</h2>
              <p className="mt-3 whitespace-pre-line font-body text-sm leading-relaxed text-ink/70">
                {project.objectives}
              </p>
            </div>
          )}

          {project.achievements && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">Achievements</h2>
              <p className="mt-3 whitespace-pre-line font-body text-sm leading-relaxed text-ink/70">
                {project.achievements}
              </p>
            </div>
          )}

          {project.lessons_learned && (
            <div className="mt-8 border-t border-ink/10 pt-8">
              <h2 className="font-display text-xl text-ink">
                Lessons Learned
              </h2>
              <p className="mt-3 whitespace-pre-line font-body text-sm leading-relaxed text-ink/70">
                {project.lessons_learned}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
