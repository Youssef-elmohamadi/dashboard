// components/FeatureItem.jsx
import React, { ReactNode } from "react";
type FeatureItemProps = {
  icon: ReactNode; // لأنه ممكن تحط <FaTruck /> أو أي عنصر JSX
  title: string;
  description: string;
};
const FeatureItem = ({ icon, title, description }: FeatureItemProps) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="text-4xl text-purple-600 mb-2">{icon}</div>
      <h3 className="font-semibold text-sm md:text-base">{title}</h3>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureItem;
