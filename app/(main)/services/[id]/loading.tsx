export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-muted" />
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      </div>
    </main>
  )
}
