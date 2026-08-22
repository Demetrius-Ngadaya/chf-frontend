export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-ink/10 ${className}`} />;
}

export default function AdminPageSkeleton() {
  return (
    <main className="px-6 py-8 md:px-8">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="mt-2 h-7 w-56" />

      <div className="mt-8 max-w-3xl rounded-lg border border-ink/10 bg-white p-6">
        <SkeletonBlock className="h-4 w-40" />
        <div className="mt-4 space-y-4">
          <SkeletonBlock className="h-9 w-full" />
          <SkeletonBlock className="h-9 w-full" />
          <SkeletonBlock className="h-20 w-full" />
          <SkeletonBlock className="h-9 w-1/2" />
        </div>
        <SkeletonBlock className="mt-5 h-9 w-32" />
      </div>

      <div className="mt-8 max-w-3xl divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-1/2" />
            </div>
            <div className="flex gap-3">
              <SkeletonBlock className="h-4 w-10" />
              <SkeletonBlock className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
