import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  HiOutlineChatBubbleOvalLeftEllipsis,
  HiOutlineClock,
  HiOutlineBolt,
} from "react-icons/hi2";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo";

interface Section {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const SupportPolicyPage: React.FC = () => {
  const { t } = useTranslation("SupportPolicy");
  const brandColor = "#9810fa";
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
        <HiOutlineChatBubbleOvalLeftEllipsis
          className="h-5 w-5"
          style={{ color: brandColor }}
        />
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
                className="font-semibold text-purple-700 hover:underline"
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
      icon: (
        <HiOutlineClock className="h-5 w-5" style={{ color: brandColor }} />
      ),
      content: <p>{t("support.hours.description")}</p>,
    },
    {
      title: t("support.response.title"),
      icon: <HiOutlineBolt className="h-5 w-5" style={{ color: brandColor }} />,
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
          ar: `تشطيبة - سياسة الدعم والمساعدة`,
          en: `Tashtiba - Support & Help Policy`,
        }}
        description={{
          ar: `اكتشف سياسة الدعم والمساعدة في تشطيبة. تعرف على قنوات الاتصال المتاحة، ساعات العمل، وأوقات الاستجابة لضمان أفضل تجربة لعملائنا في مصر.`,
          en: `Explore Tashtiba's comprehensive Support and Help Policy. Find out about our available contact channels, operating hours, and response times to ensure the best customer experience in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "دعم فني",
            "مساعدة",
            "خدمة عملاء",
            "سياسة الدعم",
            "اتصال",
            "مصر",
            "استفسارات",
            "حلول",
            "دعم تشطيبة",
          ],
          en: [
            "tashtiba",
            "support",
            "help",
            "customer service",
            "support policy",
            "contact us",
            "Egypt",
            "inquiries",
            "solutions",
            "Tashtiba support",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/support-policy" },
          { lang: "en", href: "https://tashtiba.com/en/support-policy" },
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
            } top-2 h-full w-0.5 bg-purple-200 hidden md:block`}
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
                <div className="h-8 w-8 flex items-center justify-center rounded-full bg-purple-100">
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

export default SupportPolicyPage;
