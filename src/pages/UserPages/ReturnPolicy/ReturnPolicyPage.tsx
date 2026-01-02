import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo"; // Assuming you have this SEO component
import CalenderIcon from "../../../icons/CalenderIcon";

import PencilIcon from "../../../icons/PencilIcon";
import MessageIcon from "../../../icons/MessageIcon";
import ReturnIcon from "../../../icons/ReturnIcon";

interface Section {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const ReturnPolicyPage: React.FC = () => {
  const { t } = useTranslation("ReturnPolicy");
  const brandColor = "#d62828";
  const { lang } = useParams();
  const cardVariants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  const sections: Section[] = [
    {
      title: t("return.sections.conditions.title"),
      icon: <CalenderIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("return.sections.conditions.point1")}</li>
          <li>{t("return.sections.conditions.point2")}</li>
        </ul>
      ),
    },
    {
      title: t("return.sections.exceptions.title"),
      icon: <PencilIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("return.sections.exceptions.point1")}</li>
          <li>{t("return.sections.exceptions.point2")}</li>
        </ul>
      ),
    },
    {
      title: t("return.sections.process.title"),
      icon: <MessageIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("return.sections.process.point1")}</li>
          <li>{t("return.sections.process.point2")}</li>
        </ul>
      ),
    },
    {
      title: t("return.sections.exchange.title"),
      icon: <ReturnIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("return.sections.exchange.description")}</p>,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={{
          ar: "سياسة الاسترجاع والاستبدال",
          en: "Return & Exchange Policy",
        }}
        description={{
          ar: "تعرّف على سياسة الاسترجاع والاستبدال لمنتجات تشطيبة في مصر...",
          en: "Understand Tashtiba's return and exchange policy...",
        }}
        keywords={{
          ar: ["تشطيبة", "سياسة الاسترجاع", "استبدال المنتجات", "مصر"],
          en: ["tashtiba", "return policy", "exchange policy", "Egypt"],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/return" },
          { lang: "en", href: "https://tashtiba.com/en/return" },
          { lang: "x-default", href: "https://tashtiba.com/ar/return" },
        ]}
        url={`https://tashtiba.com/${lang}/return`}
        image="https://tashtiba.com/og-image.png"
        lang={lang as "ar" | "en"}
        pageType="return"
      />

      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: brandColor }}
          >
            {t("return.title")}
          </h1>
          <p className="mt-4 text-xl text-gray-600">{t("return.subtitle")}</p>
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

export default React.memo(ReturnPolicyPage);
