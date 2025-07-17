import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetBrandById } from "../../../hooks/Api/SuperAdmin/useBrands/useSuperAdminBrandsManage";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BrandDetails", "Meta"]);
  const [globalError, setGlobalError] = useState<string>("");

  const { data, isLoading, error, isError } = useGetBrandById(id);

  const brand = data;

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setGlobalError(t("global_error"));
      } else {
        setGlobalError(t("general_error"));
      }
    }
  }, [isError, error, t]);
  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل الماركة - معرف مفقود (سوبر أدمن)",
            en: "Tashtiba - Brand Details - ID Missing (Super Admin)",
          }}
          description={{
            ar: "صفحة تفاصيل الماركة تتطلب معرف ماركة صالح. يرجى التأكد من توفير المعرف.",
            en: "The brand details page requires a valid brand ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تفاصيل الماركة",
              "معرف مفقود",
              "ماركة غير صالحة",
              "تشطيبة",
              "إدارة الماركات",
              "سوبر أدمن",
            ],
            en: [
              "brand details",
              "missing ID",
              "invalid brand",
              "Tashtiba",
              "brand management",
              "super admin",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تفاصيل الماركة - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Brand Details - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل الماركة بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading brand details by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل الماركة",
              "تحميل الماركة",
              "إدارة الماركات",
              "سوبر أدمن",
              "براندات المنتجات",
            ],
            en: [
              "brand details",
              "loading brand",
              "brand management",
              "super admin",
              "product brands",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!brand && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تفاصيل الماركة - غير موجودة (سوبر أدمن)",
            en: "Tashtiba - Brand Details - Not Found (Super Admin)",
          }}
          description={{
            ar: "الماركة المطلوبة غير موجودة في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested brand was not found on Tashtiba. Please verify the ID.",
          }}
          keywords={{
            ar: [
              "ماركة غير موجودة",
              "تفاصيل الماركة",
              "خطأ 404",
              "سوبر أدمن",
              "إدارة الماركات",
            ],
            en: [
              "brand not found",
              "brand details",
              "404 error",
              "super admin",
              "brand management",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for global error state
          title={{
            ar: "تشطيبة - تفاصيل الماركة - خطأ عام (سوبر أدمن)",
            en: "Tashtiba - Brand Details - Global Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل الماركة بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading brand details by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة تقنية",
              "تفاصيل الماركة",
              "سوبر أدمن",
              "فشل التحميل",
            ],
            en: [
              "global error",
              "technical issue",
              "brand details",
              "super admin",
              "loading failed",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {globalError}
        </div>
      </>
    );
  }
  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : t("noDate");
  return (
    <div className="brand-details p-6 max-w-3xl mx-auto space-y-8">
      <SEO
        title={{
          ar: `تشطيبة - تفاصيل الماركة ${brand?.name || ""}`,
          en: `Tashtiba - Brand Details ${brand?.name || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للماركة "${
            brand?.name || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك الحالة والصورة.`,
          en: `View full details for brand "${
            brand?.name || "unknown"
          }" by Super Admin on Tashtiba, including status and image.`,
        }}
        keywords={{
          ar: [
            `الماركة ${brand?.name || ""}`,
            "تفاصيل الماركة",
            "عرض الماركة",
            "حالة الماركة",
            "صورة الماركة",
            "إدارة الماركات",
            "سوبر أدمن",
          ],
          en: [
            `brand ${brand?.name || ""}`,
            "brand details",
            "view brand",
            "brand status",
            "brand image",
            "brand management",
            "super admin",
          ],
        }}
      />

      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {t("title")}
      </h1>
      {/* Brand Info */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
          {t("basicInfo")}
        </h2>
        <div className="grid grid-cols-1 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("name")}:</strong> {brand?.name}
          </p>
          <p>
            <strong>{t("status")}:</strong> {brand?.status}
          </p>
        </div>
      </section>
      {/* Image */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
          {t("image")}
        </h2>
        {brand?.image ? (
          <div className="flex justify-center">
            <img
              src={brand?.image}
              alt={brand?.name}
              className="w-64 h-64 object-contain rounded-lg border border-gray-200"
            />
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t("noImage")}</p>
        )}
      </section>
      {/* Dates */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {t("dates")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("createdAt")}:</strong> {formatDate(brand?.created_at)}
          </p>
          <p>
            <strong>{t("updatedAt")}:</strong> {formatDate(brand?.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BrandDetails;
