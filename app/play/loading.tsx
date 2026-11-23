export default function PlayLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#181411]">
      {/* Header Skeleton */}
      <header className="border-b border-[#EAE0D0] bg-[#FFFDF7]/90 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div className="w-24 h-5 rounded bg-[#EAE0D0] animate-pulse" />
          <div className="w-24 h-6 rounded bg-[#EAE0D0] animate-pulse" />
          <div className="w-24 h-7 rounded-full bg-[#F7F1E6] animate-pulse" />
        </div>
      </header>

      {/* Mode Tabs Skeleton */}
      <div className="border-b border-[#EAE0D0] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex gap-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-28 h-9 shrink-0 rounded-xl bg-[#F7F1E6] animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Split Game Stage Skeleton */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Specimen Card Skeleton */}
          <section className="lg:col-span-6 rounded-2xl border border-[#EAE0D0] bg-white overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#EAE0D0] flex items-center justify-between">
              <div className="w-28 h-4 rounded bg-[#F7F1E6] animate-pulse" />
              <div className="w-24 h-6 rounded-lg bg-[#F7F1E6] animate-pulse" />
            </div>
            <div className="aspect-square w-full max-h-[420px] bg-[#FAFAFA] flex items-center justify-center p-10">
              <div className="w-56 h-56 rounded-2xl bg-[#EAE0D0]/70 animate-pulse" />
            </div>
            <div className="px-5 py-3.5 border-t border-[#EAE0D0] flex items-center justify-between">
              <div className="w-16 h-4 rounded bg-[#F7F1E6] animate-pulse" />
              <div className="w-28 h-4 rounded bg-[#EAE0D0] animate-pulse" />
            </div>
          </section>

          {/* Right Control Desk Skeleton */}
          <section className="lg:col-span-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#EAE0D0] bg-white p-5 space-y-2">
                <div className="w-24 h-3 rounded bg-[#F7F1E6] animate-pulse" />
                <div className="w-14 h-9 rounded bg-[#EAE0D0] animate-pulse" />
              </div>
              <div className="rounded-2xl border border-[#EAE0D0] bg-white p-5 space-y-2">
                <div className="w-24 h-3 rounded bg-[#F7F1E6] animate-pulse" />
                <div className="w-14 h-9 rounded bg-[#EAE0D0] animate-pulse" />
              </div>
            </div>

            <div className="rounded-2xl border border-[#EAE0D0] bg-white p-6 space-y-5">
              <div className="space-y-2">
                <div className="w-28 h-3.5 rounded bg-[#F7F1E6] animate-pulse" />
                <div className="w-60 h-8 rounded-lg bg-[#EAE0D0] animate-pulse" />
                <div className="w-72 h-4 rounded bg-[#F7F1E6] animate-pulse" />
              </div>
              <div className="w-full h-13 rounded-xl bg-[#F7F1E6] animate-pulse" />
              <div className="flex gap-2.5">
                <div className="flex-1 h-12 rounded-xl bg-[#EAE0D0] animate-pulse" />
                <div className="w-28 h-12 rounded-xl bg-[#F7F1E6] animate-pulse" />
                <div className="w-24 h-12 rounded-xl bg-[#F7F1E6] animate-pulse" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
