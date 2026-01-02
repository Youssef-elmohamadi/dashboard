import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import AboutHeader from "./AboutHeader";
import AboutFeatures from "./AboutFeatures";
import AboutPolicies from "./AboutPolicies";
import { Feature, Policy } from "../../../types/Home";

import MoneyIcon from "../../../icons/MoneyIcon";
import DeliveryIcon from "../../../icons/DelivaryIcon";
import QualityIcon from "../../../icons/QualityIcon";
import ReturnIcon from "../../../icons/ReturnIcon";
import DocumentIcon from "../../../icons/DocumentIcon";
import SupportIcon from "../../../icons/SupportIcon";
import PrivacyIcon from "../../../icons/PrivacyIcon";

const TashtibaAboutPage: React.FC = () => {
  const { lang } = useParams();
  const { t } = useTranslation();
  const brandColor: string = "#d62828";

  const location = useLocation();
  const isHomePage =  location.pathname === "/" ||
  /^\/(ar|en)$/.test(location.pathname);

  const features: Feature[] = [
    {
      icon: QualityIcon,
      title: t("Common:AboutSection.features.quality.title"),
      description: t("Common:AboutSection.features.quality.description"),
    },
    {
      icon: MoneyIcon,
      title: t("Common:AboutSection.features.price.title"),
      description: t("Common:AboutSection.features.price.description"),
    },
    {
      icon: DeliveryIcon,
      title: t("Common:AboutSection.features.delivery.title"),
      description: t("Common:AboutSection.features.delivery.description"),
    },
  ];

  const policies: Policy[] = [
    {
      href: `/${lang}/terms`,
      title: t("Common:AboutSection.Politics.terms.title"),
      icon: DocumentIcon,
    },
    {
      href: `/${lang}/return`,
      title: t("Common:AboutSection.Politics.refund.title"),
      icon: ReturnIcon,
    },
    {
      href: `/${lang}/support`,
      title: t("Common:AboutSection.Politics.support.title"),
      icon: SupportIcon,
    },
    {
      href: `/${lang}/privacy`,
      title: t("Common:AboutSection.Politics.privacy.title"),
      icon: PrivacyIcon,
    },
  ];

  return (
    <section id="aboutSection" className="bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isHomePage && <AboutHeader brandColor={brandColor} />}
        <AboutFeatures features={features} brandColor={brandColor} />
        <AboutPolicies policies={policies} />
      </div>
    </section>
  );
};

export default React.memo(TashtibaAboutPage);
