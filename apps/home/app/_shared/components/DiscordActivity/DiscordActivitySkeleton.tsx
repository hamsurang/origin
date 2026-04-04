export const DiscordActivitySkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden animate-pulse">
      <div className="px-3.5 pt-3.5">
        <div className="flex justify-between items-center mb-2.5">
          <div className="h-4 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-12 bg-gray-100 rounded mb-1.5" />
        <div className="flex gap-4 mb-3">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="border-t border-gray-200">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="w-6 h-6 bg-gray-200 rounded-full" />
            <div className="w-[90px]">
              <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-2 w-10 bg-gray-100 rounded" />
            </div>
            <div className="flex-1 h-7 bg-gray-100 rounded" />
          </div>
        ))}
        <div className="py-2 text-center bg-gray-50">
          <div className="h-3 w-36 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  )
}
