import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAllCategories } from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useGetBannerById } from "../../../hooks/Api/SuperAdmin/useBanners/useSuperAdminBanners";
import { AxiosError } from "axios";
import PageMeta from "../../common/SEO/PageMeta";

const BannerDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BannerDetails"]);
  const [globalError, setGlobalError] = useState<string>("");
  const { data: allCategories } = useAllCategories();
  const categories = allCategories?.original;
  const {
    data: bannerData,
    isLoading: loading,
    isError,
    error,
  } = useGetBannerById(id);
  const banner = bannerData;
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
  if (!id) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("noData")}
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!banner && !globalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("notFound")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {globalError}
        </div>
      </>
    );
  }
  return (
    <div className="banner-details p-6 max-w-5xl mx-auto space-y-8">
      <PageMeta title={t("mainTitle")} description="Product Details" />

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
            <img
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
            <strong>{t("createdAt")}:</strong> {formatDate(banner?.created_at)}
          </p>
          <p>
            <strong>{t("updatedAt")}:</strong> {formatDate(banner?.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default BannerDetails;
