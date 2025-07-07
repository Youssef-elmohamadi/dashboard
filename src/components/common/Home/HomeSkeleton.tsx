// components/skeletons/DashboardSkeleton.tsx
import { Skeleton } from "../../ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 animate-pulse">
      {/* Left column */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* EcommerceMetrics Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl dark:bg-gray-800 bg-gray-300 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Sales Chart Skeleton */}
        <div className="p-4 rounded-2xl dark:bg-gray-800 bg-gray-300 h-[260px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* DemographicCard Skeleton */}
      <div className="col-span-12 xl:col-span-5">
        <div className="p-4 rounded-2xl dark:bg-gray-800 bg-gray-300 h-[260px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* StatisticsChart Skeleton */}
      <div className="col-span-12">
        <div className="p-4 rounded-2xl dark:bg-gray-800 bg-gray-300 h-[300px]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>

      {/* RecentOrders Skeleton */}
      <div className="col-span-12">
        <div className="p-4 rounded-2xl dark:bg-gray-800 bg-gray-300 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
