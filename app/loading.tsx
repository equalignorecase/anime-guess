export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-[#181411]">
      {/* Header Skeleton */}
      <header className="border-b border-[#EAE0D0] bg-[#FFFDF7]/90 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EAE0D0] animate-pulse" />
            <div className="w-24 h-5 rounded-md bg-[#EAE0D0] animate-pulse" />
          </div>
          <div className="w-24 h-9 rounded-xl bg-[#EAE0D0] animate-pulse" />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Skeleton */}
        <section className="border-b border-[#EAE0D0] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <div className="w-52 h-7 rounded-full bg-[#F7F1E6] animate-pulse" />
                <div className="space-y-3">
                  <div className="w-3/4 h-12 rounded-xl bg-[#EAE0D0] animate-pulse" />
                  <div className="w-2/3 h-12 rounded-xl bg-[#F7F1E6] animate-pulse" />
                </div>
                <div className="w-full max-w-md h-5 rounded-md bg-[#F7F1E6] animate-pulse" />
                <div className="flex gap-3.5 pt-2">
                  <div className="w-36 h-12 rounded-xl bg-[#EAE0D0] animate-pulse" />
                  <div className="w-36 h-12 rounded-xl bg-[#F7F1E6] animate-pulse" />
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-[#EAE0D0] bg-white overflow-hidden">
                  <div className="h-12 border-b border-[#EAE0D0] px-5 flex items-center justify-between">
                    <div className="w-32 h-4 rounded bg-[#F7F1E6] animate-pulse" />
                    <div className="w-20 h-6 rounded-lg bg-[#F7F1E6] animate-pulse" />
                  </div>
                  <div className="aspect-[4/3] w-full bg-[#FAFAFA] flex items-center justify-center">
                    <div className="w-40 h-40 rounded-2xl bg-[#EAE0D0]/70 animate-pulse" />
                  </div>
                  <div className="p-4 border-t border-[#EAE0D0] flex gap-2.5">
                    <div className="flex-1 h-10 rounded-xl bg-[#EAE0D0] animate-pulse" />
                    <div className="w-28 h-10 rounded-xl bg-[#F7F1E6] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Grid Skeleton */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="w-32 h-4 rounded bg-[#F7F1E6] animate-pulse" />
              <div className="w-64 h-9 rounded-lg bg-[#EAE0D0] animate-pulse" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-20 h-9 rounded-xl bg-[#F7F1E6] animate-pulse" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-[#EAE0D0] p-4 flex gap-4"
              >
                <div className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-xl bg-[#F7F1E6] animate-pulse" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="w-20 h-5 rounded-md bg-[#F7F1E6] animate-pulse" />
                  <div className="w-3/4 h-6 rounded bg-[#EAE0D0] animate-pulse" />
                  <div className="w-1/2 h-3 rounded bg-[#F7F1E6] animate-pulse" />
                  <div className="w-full h-8 rounded bg-[#F7F1E6] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
