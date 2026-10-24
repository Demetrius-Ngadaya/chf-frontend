import Link from "next/link";
import { apiGet } from "@/lib/api";
import { storageUrl } from "@/lib/media";
import { Card, CardText, CardTitle, Section, SectionHead, Tag } from "@/components/design";

type Project = {
  id: number;
  slug: string;
  name: string;
  category: string | null;
  status: "planned" | "ongoing" | "completed" | "suspended";
  location: string | null;
  image_path: string | null;
};

const STATUS_LABELS: Record<Project["status"], string> = {
  planned: "Planned",
  ongoing: "Ongoing",
  completed: "Completed",
  suspended: "Suspended",
};

export default async function ProjectsSection() {
  const projects = await apiGet<Project[]>("/projects?featured=true&limit=3");

  if (projects.length === 0) return null;

  return (
    <Section tone="soft">
      <SectionHead
        eyebrow="From ideas to action"
        title="Projects & initiatives"
        intro="Community programs we are running and the initiatives we are building with partners."
        action={{ href: "/projects", label: "View all projects" }}
      />
      <div className="grid gap-[1.6rem] md:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.slug}`} className="group flex">
            <Card className="flex w-full flex-col overflow-hidden p-0">
              <div className="aspect-video w-full overflow-hidden bg-soft">
                {project.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={storageUrl(project.image_path)}
                    alt={project.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-body text-4xl font-bold text-baobab/20">
                    {project.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Tag tone={project.status === "completed" || project.status === "ongoing" ? "active" : "warm"}>
                  {project.category ?? STATUS_LABELS[project.status]}
                </Tag>
                <CardTitle className="mt-3">{project.name}</CardTitle>
                <CardText className="mt-auto pt-2 text-[0.85rem]">
                  {STATUS_LABELS[project.status]}
                  {project.location ? ` · ${project.location}` : ""}
                </CardText>
                <span className="mt-3 font-body text-[0.9rem] font-semibold text-clay">View details →</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
