import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo";
import DocumentIcon from "../../../icons/DocumentIcon";
import DataIcon from "../../../icons/DataIcon";
import PrivacyIcon from "../../../icons/PrivacyIcon";
import { UserCircleIcon } from "../../../icons";

interface Section {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation("PrivacyPolicy");
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
  } as const;

  const sections: Section[] = [
    {
      title: t("privacy.sections.collection.title"),
      icon: <DocumentIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("privacy.sections.collection.point1")}</li>
          <li>{t("privacy.sections.collection.point2")}</li>
        </ul>
      ),
    },
    {
      title: t("privacy.sections.usage.title"),
      icon: <DataIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("privacy.sections.usage.point1")}</li>
          <li>{t("privacy.sections.usage.point2")}</li>
          <li>{t("privacy.sections.usage.point3")}</li>
        </ul>
      ),
    },
    {
      title: t("privacy.sections.protection.title"),
      icon: <PrivacyIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("privacy.sections.protection.description")}</p>,
    },
    {
      title: t("privacy.sections.rights.title"),
      icon: (
        <UserCircleIcon className="h-5 w-5" style={{ color: brandColor }} />
      ),
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("privacy.sections.rights.point1")}</li>
          <li>{t("privacy.sections.rights.point2")}</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={{
          ar: `سياسة الخصوصية`,
          en: `Privacy Policy`,
        }}
        description={{
          ar: `اطّلع على سياسة الخصوصية لتشطيبة وكيفية جمعنا واستخدامنا وحماية بياناتك الشخصية. نوضح حقوقك فيما يتعلق بمعلوماتك عبر منصتنا في مصر.`,
          en: `Read Tashtiba's Privacy Policy to understand how we collect, use, and protect your personal data. Learn about your rights regarding your information on our platform in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "سياسة الخصوصية",
            "حماية البيانات",
            "أمن المعلومات",
            "جمع البيانات",
            "استخدام البيانات",
            "حقوق المستخدم",
            "المعلومات الشخصية",
            "مصر",
            "خصوصية",
          ],
          en: [
            "tashtiba",
            "privacy policy",
            "data protection",
            "data security",
            "data collection",
            "data usage",
            "user rights",
            "personal information",
            "Egypt",
            "privacy",
          ],
        }}
        image="https://tashtiba.com/og-image.png"
        url={`https://tashtiba.com/${lang}/privacy-policy`}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/privacy-policy" },
          { lang: "en", href: "https://tashtiba.com/en/privacy-policy" },
          { lang: "x-default", href: "https://tashtiba.com/ar/privacy-policy" },
        ]}
        structuredData={{
          "@type": "WebPage",
          url: `https://tashtiba.com/${lang}/privacy-policy`,
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
            {t("privacy.title")}
          </h1>
          <p className="mt-4 text-xl text-gray-600">{t("privacy.subtitle")}</p>
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

export default React.memo(PrivacyPolicyPage);
