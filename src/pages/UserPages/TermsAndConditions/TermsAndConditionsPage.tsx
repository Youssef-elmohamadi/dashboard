import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo"; // Assuming you have this SEO component
import BookIcon from "../../../icons/BookIcon";
import Group from "../../../icons/GroupIcon";
import LawIcon from "../../../icons/LawIcon";
import KeyIcon from "../../../icons/KeyIcon";
import ShoppingBagIcon from "../../../icons/ShoppingBagIcon";
import CopyrightIcon from "../../../icons/CopyrightIcon";

const CreativeTermsPage: React.FC = () => {
  const { t } = useTranslation("Terms");
  const brandColor = "#d62828";
  const { lang } = useParams();
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", bounce: 0.4, duration: 0.8 },
    },
  };

  const sections = [
    {
      title: t("terms.intro.title"),
      icon: <BookIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.intro.content")}</p>,
    },
    {
      title: t("terms.definitions.title"),
      icon: <Group className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <div className="space-y-3">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>{t("terms.definitions.platform")}:</b>{" "}
              {t("terms.definitions.platformDesc")}
            </li>
            <li>
              <b>{t("terms.definitions.user")}:</b>{" "}
              {t("terms.definitions.userDesc")}
            </li>
            <li>
              <b>{t("terms.definitions.supplier")}:</b>{" "}
              {t("terms.definitions.supplierDesc")}
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: t("terms.usage.title"),
      icon: <LawIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.usage.content")}</p>,
    },
    {
      title: t("terms.accounts.title"),
      icon: <KeyIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.accounts.content")}</p>,
    },
    {
      title: t("terms.products.title"),
      icon: (
        <ShoppingBagIcon className="h-5 w-5" style={{ color: brandColor }} />
      ),
      content: <p>{t("terms.products.content")}</p>,
    },
    {
      title: t("terms.copyright.title"),
      icon: <CopyrightIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.copyright.content")}</p>,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={{
          ar: "الشروط والأحكام القانونية",
          en: "Legal Terms and Conditions",
        }}
        description={{
          ar: "تعرّف على الشروط والأحكام الخاصة باستخدام منصة تشطيبة بما يشمل التعريفات، سياسات الاستخدام، الحسابات، المنتجات، والملكية الفكرية داخل مصر.",
          en: "Read the legal terms and conditions of using Tashtiba's platform, including definitions, usage policies, account rules, products, and intellectual property in Egypt.",
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "الشروط والأحكام",
            "استخدام المنصة",
            "سياسات الحسابات",
            "حقوق الملكية الفكرية",
            "قوانين تشطيبة",
            "المنتجات",
            "استخدام الخدمة",
            "مصر",
            "شروط الاستخدام",
          ],
          en: [
            "tashtiba",
            "terms and conditions",
            "terms of service",
            "user agreement",
            "usage policy",
            "account policies",
            "intellectual property",
            "platform rules",
            "product terms",
            "Egypt legal",
          ],
        }}
        url={`https://tashtiba.com/${lang}/terms`}
        image="https://tashtiba.com/og-image.png"
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/terms" },
          { lang: "en", href: "https://tashtiba.com/en/terms" },
          { lang: "x-default", href: "https://tashtiba.com/ar/terms" },
        ]}
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/terms`,
          inLanguage: lang,
        }}
        lang={lang as "ar" | "en"}
      />

      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: brandColor }}
          >
            {t("terms.pageTitle")}
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            {t("terms.pageSubtitle")}
          </p>
        </div>
        <div className="relative space-y-16">
          <div
            className={`absolute ${
              lang === "ar" ? "right-9" : "left-9"
            } top-2 h-full w-0.5 bg-red-200 hidden md:block`}
          ></div>

          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="relative flex items-start space-x-6"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                <div
                  className="z-10 flex items-center justify-center h-16 w-16 rounded-full bg-white shadow-md border-2"
                  style={{ borderColor: brandColor }}
                >
                  <span
                    className="text-2xl font-bold"
                    style={{ color: brandColor }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-red-100">
                  {section.icon}
                </div>
              </div>

              <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed text-base">
                  {section.content}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CreativeTermsPage);
