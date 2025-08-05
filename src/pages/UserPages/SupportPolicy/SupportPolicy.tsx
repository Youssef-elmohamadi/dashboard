import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo";
import ConversationIcon from "../../../icons/ConversationIcon";
import ClockIcon from "../../../icons/ClockIcon";
import PowerIcon from "../../../icons/PowerIcon";

interface Section {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const SupportPolicyPage: React.FC = () => {
  const { t } = useTranslation("SupportPolicy");
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
      title: t("support.channels.title"),
      icon: (
        <ConversationIcon className="h-5 w-5" style={{ color: brandColor }} />
      ),
      content: (
        <div className="space-y-3">
          <p>{t("support.channels.description")}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>{t("support.channels.chat")}</li>
            <li>
              {t("support.channels.email")}{" "}
              <a
                href="mailto:support@tashtiba.com"
                className="font-semibold text-[#d62828] hover:underline"
              >
                support@tashtiba.com
              </a>
            </li>
            <li>
              {t("support.channels.phone")}{" "}
              <span className="text-gray-500">
                {t("support.channels.phoneNote")}
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: t("support.hours.title"),
      icon: <ClockIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("support.hours.description")}</p>,
    },
    {
      title: t("support.response.title"),
      icon: <PowerIcon className="h-5 w-5" style={{ color: brandColor }} />,
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>{t("support.response.first")}</li>
          <li>{t("support.response.second")}</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={{
          ar: "تشطيبة - سياسة الدعم",
          en: "Tashtiba - Support Policy",
        }}
        description={{
          ar: "اطلع على سياسة الدعم في تشطيبة لتعرف كيفية تقديم المساعدة قبل وبعد الشراء، وكيفية التواصل مع فريق الدعم الفني لدينا.",
          en: "Learn about Tashtiba's support policy including how we assist you before and after your purchase, and how to contact our support team.",
        }}
        keywords={{
          ar: [
            "سياسة الدعم",
            "الدعم الفني تشطيبة",
            "التواصل مع الدعم",
            "خدمة العملاء",
            "تشطيبة",
            "مساعدة الشراء",
            "مشاكل الطلبات",
            "استرجاع المنتجات",
          ],
          en: [
            "support policy",
            "customer support",
            "tashtiba help",
            "order issues",
            "contact support",
            "return policy",
            "tashtiba",
            "product assistance",
          ],
        }}
        url={`https://tashtiba.com/${lang}/support-policy`}
        image="https://tashtiba.com/og-image.png"
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/support-policy" },
          { lang: "en", href: "https://tashtiba.com/en/support-policy" },
          { lang: "x-default", href: "https://tashtiba.com/en/support-policy" },
        ]}
      />

      <div className="max-w-4xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ color: brandColor }}
          >
            {t("support.title")}
          </h1>
          <p className="mt-4 text-xl text-gray-600">{t("support.subtitle")}</p>
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

export default React.memo(SupportPolicyPage);
