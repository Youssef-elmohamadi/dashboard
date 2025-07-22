import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MdMenuBook,
  MdGroups,
  MdGavel,
  MdVpnKey,
  MdShoppingBag,
  MdCopyright,
} from "react-icons/md";
import { useParams } from "react-router-dom";
import SEO from "../../../components/common/SEO/seo"; // Assuming you have this SEO component

const CreativeTermsPage: React.FC = () => {
  const { t } = useTranslation("Terms");
  const brandColor = "#542475";
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
      icon: <MdMenuBook className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.intro.content")}</p>,
    },
    {
      title: t("terms.definitions.title"),
      icon: <MdGroups className="h-5 w-5" style={{ color: brandColor }} />,
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
      icon: <MdGavel className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.usage.content")}</p>,
    },
    {
      title: t("terms.accounts.title"),
      icon: <MdVpnKey className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.accounts.content")}</p>,
    },
    {
      title: t("terms.products.title"),
      icon: <MdShoppingBag className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.products.content")}</p>,
    },
    {
      title: t("terms.copyright.title"),
      icon: <MdCopyright className="h-5 w-5" style={{ color: brandColor }} />,
      content: <p>{t("terms.copyright.content")}</p>,
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={{
          ar: `تشطيبة - الشروط والأحكام`,
          en: `Tashtiba - Terms and Conditions`,
        }}
        description={{
          ar: `اطّلع على الشروط والأحكام القانونية لاستخدام منصة تشطيبة. تتضمن هذه الصفحة تعريفات، قواعد الاستخدام، سياسات الحسابات، تفاصيل المنتجات وحقوق الملكية الفكرية في مصر.`,
          en: `Review the full Terms and Conditions for using the Tashtiba platform. This page covers definitions, usage rules, account policies, product details, and intellectual property rights in Egypt.`,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "شروط الخدمة",
            "أحكام الاستخدام",
            "سياسات المنصة",
            "اتفاقية المستخدم",
            "حقوق الملكية",
            "حسابات المستخدمين",
            "منتجات",
            "مصر",
            "قانوني",
          ],
          en: [
            "tashtiba",
            "terms of service",
            "terms and conditions",
            "usage policy",
            "user agreement",
            "intellectual property",
            "user accounts",
            "product policy",
            "Egypt",
            "legal",
          ],
        }}
        alternates={[
          { lang: "ar", href: "https://tashtiba.com/ar/terms" },
          { lang: "en", href: "https://tashtiba.com/en/terms" },
        ]}
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

export default CreativeTermsPage;
