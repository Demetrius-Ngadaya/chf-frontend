import { apiGet } from "@/lib/api";

type SocialLink = {
  id: number;
  platform: string;
  url: string;
};

const ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 3H22l-7.2 8.2L23 21h-6.6l-5.2-6.8L5.2 21H2l7.7-8.8L1.5 3h6.7l4.7 6.2L18.9 3zm-1.2 16h1.7L7.4 5H5.6l12.1 14z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c-2.7 0-3.1 0-4.1.1-1.1 0-1.8.2-2.4.5-.7.2-1.2.6-1.8 1.1-.5.6-.9 1.1-1.1 1.8-.3.6-.5 1.3-.5 2.4C2 8.9 2 9.3 2 12s0 3.1.1 4.1c0 1.1.2 1.8.5 2.4.2.7.6 1.2 1.1 1.8.6.5 1.1.9 1.8 1.1.6.3 1.3.5 2.4.5C8.9 22 9.3 22 12 22s3.1 0 4.1-.1c1.1 0 1.8-.2 2.4-.5.7-.2 1.2-.6 1.8-1.1.5-.6.9-1.1 1.1-1.8.3-.6.5-1.3.5-2.4.1-1 .1-1.4.1-4.1s0-3.1-.1-4.1c0-1.1-.2-1.8-.5-2.4-.2-.7-.6-1.2-1.1-1.8-.6-.5-1.1-.9-1.8-1.1-.6-.3-1.3-.5-2.4-.5C15.1 2 14.7 2 12 2zm0 5.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8a.6.6 0 0 0 .6.6h16.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6zM8.3 18.1H5.7V9.9h2.6v8.2zM7 8.8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11.1 9.3h-2.6v-4c0-1-.4-1.6-1.2-1.6-.7 0-1.1.5-1.3 1-.1.2-.1.5-.1.7v3.9h-2.6s.1-7.4 0-8.2h2.6v1.2c.3-.5 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.6v4.7z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.6-.5-5.3a3 3 0 0 0-2.1-2.1C18.6 4 12 4 12 4s-6.6 0-8.4.6A3 3 0 0 0 1.5 6.7C1 8.4 1 12 1 12s0 3.6.5 5.3a3 3 0 0 0 2.1 2.1C5.4 20 12 20 12 20s6.6 0 8.4-.6a3 3 0 0 0 2.1-2.1c.5-1.7.5-5.3.5-5.3zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 2h-3.2v13.7a2.7 2.7 0 1 1-2.7-2.7c.2 0 .5 0 .7.1V9.8a5.9 5.9 0 1 0 5.2 5.9V8.4A7.6 7.6 0 0 0 21 10.6V7.4a4.3 4.3 0 0 1-4.4-4.4V2z" />
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3C8.6 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.1l-.3-.2-3 .8.8-2.9-.2-.3C4.4 15 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.2-2.8-.2-.4.2-.4.6-1.3.1-.1.1-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.8c.1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
    </svg>
  ),
};

export default async function FooterSocialLinks() {
  let links: SocialLink[] = [];
  try {
    links = await apiGet<SocialLink[]>("/social-links");
  } catch {
    return null;
  }

  if (links.length === 0) return null;

  return (
    <div className="flex gap-3">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.platform}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/10 text-sand transition-colors hover:bg-gold hover:text-baobab-dark"
        >
          {ICONS[link.platform] ?? link.platform.charAt(0).toUpperCase()}
        </a>
      ))}
    </div>
  );
}
