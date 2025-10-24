// Fast loading skeleton component
export const FastLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pt-[88px] md:pt-[92px]">
      {/* Hero Skeleton */}
      <div className="w-full h-[600px] md:h-[700px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
      
      {/* Best Sellers Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-gray-300 rounded mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow">
              <div className="aspect-square bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
