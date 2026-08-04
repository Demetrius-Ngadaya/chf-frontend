import Link from "next/link";
import { apiGet } from "@/lib/api";

type Project = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  status: "planned" | "ongoing" | "completed" | "suspended";
  location: string | null;
  image_path: string | null;
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

export default async function ProjectsSection() {
  const projects = await apiGet<Project[]>("/projects?featured=true&limit=3");

  if (projects.length === 0) return null;

  return (
    <section className="bg-sand px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Our Work
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink md:text-4xl">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-body text-sm text-baobab underline"
          >
            View all projects
          </Link>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden bg-ink/5">
                {project.image_path ? (
                  <img
                    src={imageUrl(project.image_path)}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-display text-4xl text-ink/20">
                    {project.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {project.category && (
                    <span className="font-mono text-xs uppercase tracking-[0.15em] text-clay">
                      {project.category}
                    </span>
                  )}
                  <span className="rounded-full bg-baobab/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-baobab">
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl text-ink">
                  {project.name}
                </h3>
                {project.location && (
                  <p className="mt-1 font-body text-sm text-ink/50">
                    {project.location}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
