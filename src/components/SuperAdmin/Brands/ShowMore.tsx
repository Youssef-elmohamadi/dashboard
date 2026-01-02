import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetBrandById } from "../../../hooks/Api/SuperAdmin/useBrands/useSuperAdminBrandsManage";
import SEO from "../../common/SEO/seo";
import { AxiosError } from "axios";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import LazyImage from "../../common/LazyImage";

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BrandDetails", "Meta"]);
  const { lang } = useDirectionAndLanguage();
  const { data, isLoading, error, isError } = useGetBrandById(id!);

  const brand = data;

  let pageStatus = PageStatus.SUCCESS;
  let pageError = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    if (
      axiosError?.response?.status === 401 ||
      axiosError?.response?.status === 403
    ) {
      pageError = t("global_error");
    } else {
      pageError = t("general_error");
    }
  } else if (!brand) {
    pageStatus = PageStatus.NOT_FOUND;
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
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("loading")}
      errorMessage={pageError}
      notFoundMessage={t("not_found")}
    >
      <SEO
        title={{
          ar: ` تفاصيل الماركة ${brand?.name_ar || ""}`,
          en: `Brand Details ${brand?.name_en || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للماركة "${
            brand?.name_ar || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك الحالة والصورة.`,
          en: `View full details for brand "${
            brand?.name_en || "unknown"
          }" by Super Admin on Tashtiba, including status and image.`,
        }}
        keywords={{
          ar: [
            `الماركة ${brand?.name_ar || ""}`,
            "تفاصيل الماركة",
            "عرض الماركة",
            "حالة الماركة",
            "صورة الماركة",
            "إدارة الماركات",
            "سوبر أدمن",
          ],
          en: [
            `brand ${brand?.name_en || ""}`,
            "brand details",
            "view brand",
            "brand status",
            "brand image",
            "brand management",
            "super admin",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="brand-details p-6 max-w-3xl mx-auto space-y-8">
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
              <strong>{t("name")}:</strong> {brand?.[`name_${lang}`]}
            </p>
            <p>
              <strong>{t("status")}:</strong>{" "}
              {brand?.status === "active" ? t("active") : t("inactive")}
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
              <LazyImage
                src={brand?.image}
                alt={brand?.[`name_${lang}`]}
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
    </PageStatusHandler>
  );
};

export default BrandDetails;
