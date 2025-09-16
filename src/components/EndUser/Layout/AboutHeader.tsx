import React from "react";
import LazyImage from "../../common/LazyImage";
import { useTranslation } from "react-i18next";

interface AboutHeaderProps {
  brandColor: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ brandColor }) => {
  const { t } = useTranslation("EndUserHome");

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
      <div className="lg:col-span-7">
        <h2
          className="text-2xl font-extrabold text-gray-900 sm:text-3xl"
          style={{ color: brandColor }}
        >
          {t("AboutSection.heading")}
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          {t("AboutSection.description")}
        </p>
      </div>
      <div className="mt-10 lg:mt-0 lg:col-span-5">
        <div className="relative">
          <div
            className="absolute hidden xl:block -left-10 -top-10 w-40 h-40 rounded-full opacity-20"
            style={{ backgroundColor: brandColor }}
          ></div>
          <div
            className="absolute hidden xl:block  -right-10 -bottom-10 w-40 h-40 rounded-full opacity-10"
            style={{ backgroundColor: brandColor }}
          ></div>
          <LazyImage
            src="/images/about/about.webp"
            alt={t("AboutSection.alt")}
            className="relative rounded-2xl shadow-2xl w-[500px] h-[333px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutHeader;
