import React from "react";
const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-md shadow-sm bg-white border border-gray-200 p-3 animate-pulse">
      <div className="w-full aspect-[5/6] bg-gray-200 rounded-md mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 w-3 rounded-full bg-gray-200" />
        ))}
      </div>
      <div className="h-9 bg-gray-200 rounded-md w-full" />
    </div>
  );
};
export default ProductCardSkeleton;
