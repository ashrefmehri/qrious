/** Vérification while the pending e-mail loads: same shape, grey blocks. */
export function VerificationSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4 lg:gap-4.5">
      <span className="sr-only">Chargement…</span>
      <div className="flex flex-col gap-2 pt-6 lg:pt-0">
        <div className="q-skeleton h-8.5 w-2/3 lg:h-10" />
        <div className="q-skeleton h-5 w-full" />
        <div className="q-skeleton h-5 w-1/2" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="q-skeleton h-5 w-32" />
        <div className="q-skeleton h-12" />
      </div>
      <div className="q-skeleton h-14" />
      <div className="q-skeleton h-11 w-44 self-center" />
    </div>
  );
}
