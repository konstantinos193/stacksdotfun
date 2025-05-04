import { Skeleton } from "@/components/ui/skeleton"

export default function TermsLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header Skeleton */}
      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-md bg-zinc-800" />
              <Skeleton className="h-6 w-32 bg-zinc-800" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
              <Skeleton className="h-4 w-16 bg-zinc-800" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md bg-zinc-800" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-64 bg-zinc-800 mb-2" />
          <Skeleton className="h-5 w-48 bg-zinc-800 mb-8" />

          <div className="mb-8">
            <div className="grid grid-cols-3 gap-2 mb-8">
              <Skeleton className="h-10 rounded-md bg-zinc-800" />
              <Skeleton className="h-10 rounded-md bg-zinc-800" />
              <Skeleton className="h-10 rounded-md bg-zinc-800" />
            </div>
          </div>

          <div className="space-y-8">
            <Skeleton className="h-8 w-48 bg-zinc-800 mb-4" />
            <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-6" />

            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-zinc-800 pb-4">
                  <Skeleton className="h-6 w-64 bg-zinc-800 mb-4" />
                  <div className="pl-4">
                    <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                    <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                    <Skeleton className="h-4 w-2/3 bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Skeleton className="h-5 w-64 bg-zinc-800" />
              <Skeleton className="h-10 w-32 rounded-md bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 bg-zinc-800 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                  <Skeleton className="h-4 w-20 bg-zinc-800" />
                  <Skeleton className="h-4 w-28 bg-zinc-800" />
                  <Skeleton className="h-4 w-16 bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-800 mt-8 pt-8 text-center">
            <Skeleton className="h-4 w-64 bg-zinc-800 mx-auto" />
          </div>
        </div>
      </footer>
    </main>
  )
}
