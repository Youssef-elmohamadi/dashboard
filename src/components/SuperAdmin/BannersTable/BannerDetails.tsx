import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetBannerById } from "../../../hooks/Api/SuperAdmin/useBanners/useSuperAdminBanners";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import LazyImage from "../../common/LazyImage";
import { useCategories } from "../../../hooks/Api/EndUser/useHome/UseHomeData";

const BannerDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BannerDetails", "Meta"]);

  const { data: allCategories } = useCategories("all");
  const categories = allCategories;

  const {
    data: bannerData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetBannerById(id);
  const banner = bannerData;
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
  } else if (!banner) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageStatusHandler
      status={pageStatus}
      errorMessage={pageError}
      onRetry={() => refetch()}
    >
      <div className="banner-details p-6 max-w-5xl mx-auto space-y-8">
        <SEO
          title={{
            ar: ` تفاصيل البانر ${banner?.title || ""}`,
            en: `Banner Details ${banner?.title || ""} (Super Admin)`,
          }}
          description={{
            ar: `استعرض التفاصيل الكاملة للبانر "${
              banner?.title || "غير معروف"
            }" بواسطة المشرف العام في تشطيبة، بما في ذلك نوع الرابط والموضع والصورة.`,
            en: `View full details for banner "${
              banner?.title || "unknown"
            }" by Super Admin on Tashtiba, including link type, position, and image.`,
          }}
          keywords={{
            ar: [
              `البانر ${banner?.title || ""}`,
              "تفاصيل البانر",
              "عرض البانر",
              "نوع رابط البانر",
              "صورة البانر",
              "إدارة البانرات",
              "سوبر أدمن",
            ],
            en: [
              `banner ${banner?.title || ""}`,
              "banner details",
              "view banner",
              "banner link type",
              "banner image",
              "banner management",
              "super admin",
            ],
          }}
          robotsTag="noindex, nofollow"
        />

        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          {t("title")}
        </h1>

        {/* Basic Info */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
            {t("basicInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("bannerTitle")}:</strong> {banner?.title}
            </p>
            <p>
              <strong>{t("linkType")}:</strong> {banner?.link_type}
            </p>

            <p>
              <strong>{t("linkId")}:</strong>{" "}
              {banner?.link_type === "category"
                ? categories?.find(
                    (cat) => Number(cat?.id) === Number(banner?.link_id)
                  )?.name || t("unknown")
                : banner?.link_id}
            </p>

            <p>
              <strong>{t("position")}:</strong>{" "}
              {banner?.link_type === "category"
                ? `before ${
                    categories?.find(
                      (cat) => Number(cat?.id) === Number(banner?.link_id)
                    )?.name || t("unknown")
                  }`
                : banner?.link_id}
            </p>
            <p>
              <strong>{t("isActive")}:</strong>{" "}
              {banner?.is_active ? t("yes") : t("no")}
            </p>
            <p>
              <strong>{t("url")}:</strong>{" "}
              {banner?.url ? (
                <Link
                  className="inline-block px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                  to={banner?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("visitLink")}
                </Link>
              ) : (
                <span className="text-gray-500">{t("notAvailable")}</span>
              )}
            </p>
          </div>
        </section>

        {/* Image */}
        {banner?.image && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
              {t("bannerImage")}
            </h2>
            <div className="w-full flex justify-center">
              <LazyImage
                src={banner?.image}
                alt={banner?.title}
                className="max-w-xs h-auto rounded-lg shadow-md"
              />
            </div>
          </section>
        )}

        {/* Timestamps */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            {t("timestamps")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p>
              <strong>{t("createdAt")}:</strong>{" "}
              {formatDate(banner?.created_at)}
            </p>
            <p>
              <strong>{t("updatedAt")}:</strong>{" "}
              {formatDate(banner?.updated_at)}
            </p>
          </div>
        </section>
      </div>
    </PageStatusHandler>
  );
};

export default BannerDetails;
