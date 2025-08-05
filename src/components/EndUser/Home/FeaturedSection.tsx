import { useTranslation } from "react-i18next";
import FeatureItem from "./FeatureItem";
import DeliveryIcon from "../../../icons/DelivaryIcon";
import ReturnIcon from "../../../icons/ReturnIcon";
import MapCoverIcon from "../../../icons/MapCoverIcon";
import OfferIcon from "../../../icons/OffersIcon";

const FeaturesSection = () => {
  const { t } = useTranslation(["EndUserHome"]);
  const features = [
    {
      icon: <DeliveryIcon className="text-[#d62828] text-6xl" />,
      title: t("featuredSection.fastDelivery.title"),
      description: t("featuredSection.fastDelivery.description"),
    },
    {
      icon: <ReturnIcon className="text-[#d62828] text-6xl" />,
      title: t("featuredSection.returnable.title"),
      description: t("featuredSection.returnable.description"),
    },
    {
      icon: <MapCoverIcon className="text-[#d62828] text-6xl" />,
      title: t("featuredSection.fullCoverage.title"),
      description: t("featuredSection.fullCoverage.description"),
    },
    {
      icon: <OfferIcon className="text-[#d62828] text-6xl" />,
      title: t("featuredSection.currentOffers.title"),
      description: t("featuredSection.currentOffers.description"),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-white p-4 rounded-xl h-[350px] md:h-[190px]">
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
