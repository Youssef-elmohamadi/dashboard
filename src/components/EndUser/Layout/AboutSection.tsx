import React, { Suspense } from "react";
import LazyImage from "../../common/LazyImage";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

// Lazy-loaded React Icons
// We'll import each icon individually to allow for granular lazy loading
const LazyFaShippingFast = React.lazy(() =>
  import("react-icons/fa").then((module) => ({
    default: module.FaShippingFast,
  }))
);
const LazyFaUndo = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaUndo }))
);
const LazyFaLifeRing = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaLifeRing }))
);
const LazyFaClipboardCheck = React.lazy(() =>
  import("react-icons/fa").then((module) => ({
    default: module.FaClipboardCheck,
  }))
);
const LazyFaFileAlt = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaFileAlt }))
);
const LazyFaMoneyBillTransfer = React.lazy(() =>
  import("react-icons/fa6").then((module) => ({
    default: module.FaMoneyBillTransfer,
  }))
);
const LazyFaHouseLock = React.lazy(() =>
  import("react-icons/fa6").then((module) => ({ default: module.FaHouseLock }))
);

// We still need the original types for `Feature` and `Policy`
import { Feature, Policy } from "../../../types/Home";

const TashtibaAboutPage: React.FC = () => {
  const { lang } = useParams();
  const { t } = useTranslation("EndUserHome");
  const brandColor: string = "#9810fa";

  const features: Feature[] = [
    {
      icon: LazyFaClipboardCheck, // Use the lazy-loaded icon
      title: t("AboutSection.features.quality.title"),
      description: t("AboutSection.features.quality.description"),
    },
    {
      icon: LazyFaMoneyBillTransfer, // Use the lazy-loaded icon
      title: t("AboutSection.features.price.title"),
      description: t("AboutSection.features.price.description"),
    },
    {
      icon: LazyFaShippingFast, // Use the lazy-loaded icon
      title: t("AboutSection.features.delivery.title"),
      description: t("AboutSection.features.delivery.description"),
    },
  ];

  const policies: Policy[] = [
    {
      href: `/${lang}/terms`,
      title: t("AboutSection.Politics.terms.title"),
      icon: LazyFaFileAlt, // Use the lazy-loaded icon
    },
    {
      href: `/${lang}/return`,
      title: t("AboutSection.Politics.refund.title"),
      icon: LazyFaUndo, // Use the lazy-loaded icon
    },
    {
      href: `/${lang}/support`,
      title: t("AboutSection.Politics.support.title"),
      icon: LazyFaLifeRing, // Use the lazy-loaded icon
    },
    {
      href: `/${lang}/privacy`,
      title: t("AboutSection.Politics.privacy.title"),
      icon: LazyFaHouseLock, // Use the lazy-loaded icon
    },
  ];

  return (
    <section id="aboutSection" className="bg-gray-50 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-7">
            <h2
              className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
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

              {/* LazyImage is already handling its own lazy loading */}
              <LazyImage
                src="/images/about/about.webp"
                alt={t("AboutSection.alt")}
                className="relative rounded-2xl shadow-2xl w-[500px] h-[333px] object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-200">
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
                  {/* Wrap the lazy-loaded icon with Suspense and null fallback */}
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

        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-800">
              {t("AboutSection.Politics.heading")}
            </h3>
            <p className="mt-2 text-md text-gray-500">
              {t("AboutSection.Politics.description")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {policies.map((policy) => (
              <Link key={policy.title} to={policy.href} className="group">
                <div className="bg-white shadow-sm rounded-xl p-6 text-center transition-all duration-300 ease-in-out hover:shadow-purple-200 hover:shadow-lg hover:-translate-y-2 border border-transparent hover:border-purple-200">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md mx-auto bg-gray-100 group-hover:bg-purple-100 transition-colors">
                    {/* Wrap the lazy-loaded icon with Suspense and null fallback */}
                    <Suspense fallback={null}>
                      <policy.icon className="h-6 w-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
                    </Suspense>
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900">
                    {policy.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TashtibaAboutPage;
