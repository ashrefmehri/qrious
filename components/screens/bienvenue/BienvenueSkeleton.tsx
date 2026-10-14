/** Bienvenue step 1 while the session and sections load: same shape, grey blocks. */
export function BienvenueSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-1 flex-col gap-5 lg:gap-5.5">
      <span className="sr-only">Chargement…</span>
      <div className="flex flex-col gap-2.5">
        <div className="flex min-h-11 items-center">
          <div className="q-skeleton h-4 w-24 rounded-pill" />
        </div>
        <div className="q-skeleton h-2 rounded-pill" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="q-skeleton h-8.5 w-3/4 lg:h-10" />
        <div className="q-skeleton h-5 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="q-skeleton h-15" />
        ))}
      </div>
      <div className="mt-auto pt-4 lg:mt-0 lg:flex lg:justify-end lg:pt-0">
        <div className="q-skeleton h-14 w-full lg:w-40" />
      </div>
    </div>
  );
}
