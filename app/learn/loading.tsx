import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingLearn() {
  return (
    <main className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Header Skeleton */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full bg-zinc-800" />
            <Skeleton className="h-6 w-24 bg-zinc-800" />
          </div>

          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800" />
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800" />
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800" />
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800 hidden md:block" />
            <Skeleton className="h-9 w-16 rounded-md bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-10 w-3/4 mx-auto bg-zinc-800 mb-4" />
            <Skeleton className="h-4 w-full mx-auto bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-5/6 mx-auto bg-zinc-800 mb-8" />
            <Skeleton className="h-12 w-full max-w-xl mx-auto bg-zinc-800 rounded-md" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-12">
        {/* Tabs Skeleton */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-10 w-64 bg-zinc-800 rounded-md" />
        </div>

        {/* Featured Articles Skeleton */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48 bg-zinc-800" />
            <Skeleton className="h-8 w-24 bg-zinc-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full bg-zinc-800" />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-5 w-20 bg-zinc-800 rounded-full" />
                    <Skeleton className="h-4 w-16 bg-zinc-800" />
                  </div>
                  <Skeleton className="h-7 w-5/6 bg-zinc-800 mb-4" />
                  <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-4" />
                  <Skeleton className="h-6 w-32 bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 bg-zinc-800 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-zinc-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section Skeleton */}
      <div className="bg-zinc-900 border-t border-zinc-800 mt-12">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-8 w-48 mx-auto bg-zinc-800 mb-4" />
            <Skeleton className="h-4 w-full mx-auto bg-zinc-800 mb-2" />
            <Skeleton className="h-4 w-3/4 mx-auto bg-zinc-800 mb-8" />
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Skeleton className="h-10 w-full bg-zinc-800 rounded-md" />
              <Skeleton className="h-10 w-28 bg-zinc-800 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
