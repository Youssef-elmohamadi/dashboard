import { Skeleton } from "../../ui/skeleton";

export default function VendorEditSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-8 animate-pulse">
      <Skeleton className="h-8 w-1/3 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-5 w-1/4 mb-2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      <div>
        <Skeleton className="h-6 w-1/4 mb-4" />
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg p-5 space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <Skeleton className="w-full md:w-64 h-40 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  );
}
