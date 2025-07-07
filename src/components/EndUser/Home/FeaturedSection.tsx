import { useTranslation } from "react-i18next";
import FeatureItem from "./FeatureItem";
import { FaShippingFast, FaUndo, FaMapMarkedAlt, FaTags } from "react-icons/fa";

const FeaturesSection = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const features = [
    {
      icon: <FaShippingFast />,
      title: t("featuredSection.fastDelivery.title"),
      description: t("featuredSection.fastDelivery.description"),
    },
    {
      icon: <FaUndo />,
      title: t("featuredSection.returnable.title"),
      description: t("featuredSection.returnable.description"),
    },
    {
      icon: <FaMapMarkedAlt />,
      title: t("featuredSection.fullCoverage.title"),
      description: t("featuredSection.fullCoverage.description"),
    },
    {
      icon: <FaTags />,
      title: t("featuredSection.currentOffers.title"),
      description: t("featuredSection.currentOffers.description"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-white p-4 rounded-xl">
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeaturesSection;
