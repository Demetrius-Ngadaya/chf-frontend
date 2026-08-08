import { MetadataRoute } from "next";
import { apiGet } from "@/lib/api";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thechf.or.tz";

const STATIC_ROUTES = [
  "",
  "/about-us",
  "/projects",
  "/events",
  "/blog",
  "/team",
  "/faq",
  "/testimonials",
  "/partners",
  "/contact-us",
  "/volunteer",
  "/become-a-partner",
  "/donate",
  "/terms",
  "/achievements",
  "/research",
  "/resources",
  "/videos",
  "/gallery",
  "/giving-back",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const projects = await apiGet<{ slug: string }[]>("/projects?limit=200");
    projects.forEach((p) => {
      entries.push({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch {
    // skip if API unavailable at build time
  }

  try {
    const events = await apiGet<{ slug: string }[]>("/events?limit=200");
    events.forEach((e) => {
      entries.push({
        url: `${siteUrl}/events/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  } catch {
    // skip
  }

  try {
    const posts = await apiGet<{ slug: string }[]>("/blogs?limit=200");
    posts.forEach((post) => {
      entries.push({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  } catch {
    // skip
  }

  return entries;
}
