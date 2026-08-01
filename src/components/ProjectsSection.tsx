import Link from "next/link";
import { apiGet } from "@/lib/api";

type Project = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  status: "planned" | "ongoing" | "completed" | "suspended";
  location: string | null;
  description: string;
};

const STATUS_STYLES: Record<string, string> = {
  ongoing: "bg-gold/20 text-gold",
  planned: "bg-ink/10 text-ink/60",
  completed: "bg-baobab/15 text-baobab",
  suspended: "bg-clay/15 text-clay",
};

export default async function ProjectsSection() {
  const projects = await apiGet<Project[]>("/projects?featured=1&limit=3");

  return (
    <section className="bg-sand px-6 py-20 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
              Our Work
            </p>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Featured Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden font-body text-sm text-baobab underline underline-offset-4 hover:text-clay md:block"
          >
            View all projects
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col border-t-2 border-baobab pt-6 transition-colors hover:border-clay"
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {project.category && (
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink/50">
                    {project.category}
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                    STATUS_STYLES[project.status] ?? "bg-ink/10 text-ink/60"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <h3 className="font-display text-xl text-ink group-hover:text-clay">
                {project.name}
              </h3>

              {project.location && (
                <p className="mt-1 font-body text-sm text-ink/50">
                  {project.location}
                </p>
              )}

              <p className="mt-3 line-clamp-3 font-body text-sm text-ink/70">
                {project.description}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/projects"
          className="mt-8 block text-center font-body text-sm text-baobab underline underline-offset-4 hover:text-clay md:hidden"
        >
          View all projects
        </Link>
      </div>
    </section>
  );
}
