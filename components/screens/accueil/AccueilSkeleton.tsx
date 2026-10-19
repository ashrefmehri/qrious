/** Accueil while the student loads: same blocks as the page, in grey. */
export function AccueilSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      <span className="sr-only">Chargement…</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="q-skeleton h-8.5 w-56 sm:h-10" />
        <div className="q-skeleton h-11 w-full sm:w-75" />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-4 lg:flex-2 lg:gap-6">
          <div className="q-skeleton h-36 rounded-l sm:h-28" />
          <div className="q-skeleton h-56 rounded-l sm:h-80" />
        </div>
        <div className="hidden flex-col gap-6 lg:flex lg:flex-1">
          <div className="q-skeleton h-56 rounded-l" />
          <div className="q-skeleton h-72 rounded-l" />
        </div>
      </div>
    </div>
  );
}
