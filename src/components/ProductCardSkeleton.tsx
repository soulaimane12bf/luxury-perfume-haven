export function ProductCardSkeleton() {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 sm:h-80 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Brand */}
        <div className="h-4 w-20 bg-gray-200 rounded" />
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-300 rounded" />
          <div className="h-6 w-1/2 bg-gray-300 rounded" />
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 w-24 bg-gradient-to-r from-gray-300 to-gray-200 rounded-lg" />
          <div className="h-11 w-32 bg-gradient-to-r from-gray-400 to-gray-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
