import React, { Suspense } from "react";
import { Feature } from "../../../types/Home";

interface AboutFeaturesProps {
  features: Feature[];
  brandColor: string;
}

const AboutFeatures: React.FC<AboutFeaturesProps> = ({
  features,
  brandColor,
}) => {
  const isHomePage =
    location.pathname === "/" || /^\/(ar|en)$/.test(location.pathname);
  return (
    <div className={`mt-2 pt-2 border-gray-200 ${isHomePage && "mt-20 pt-12"}`}>
      <div className="grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-md"
          >
            <div
              className="flex items-center justify-center h-12 w-12 rounded-full mx-auto"
              style={{ backgroundColor: brandColor }}
            >
              <Suspense fallback={null}>
                <feature.icon className="h-6 w-6 text-white" />
              </Suspense>
            </div>
            <h3 className="mt-6 text-xl font-bold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-base text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutFeatures;
