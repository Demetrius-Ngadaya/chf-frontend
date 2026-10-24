/** Public URL of a file stored on the Laravel `public` disk. */
export function storageUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "";
  return `${base}/storage/${path}`;
}
