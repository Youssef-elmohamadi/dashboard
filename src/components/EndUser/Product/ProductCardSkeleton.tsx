import React from "react";

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="w-[160px] rounded-md shadow-sm bg-white border border-gray-200 p-2 animate-pulse">
      <div className="w-full h-[120px] bg-gray-200 rounded-md mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
};

export default ProductCardSkeleton;