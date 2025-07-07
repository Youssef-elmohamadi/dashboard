import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetBrandById } from "../../../hooks/Api/SuperAdmin/useBrands/useSuperAdminBrandsManage";
import PageMeta from "../../common/SEO/PageMeta";
import { AxiosError } from "axios";

const BrandDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["BrandDetails"]);
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
        <PageMeta title={t("main_title")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!brand && !globalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Product Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
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
      <PageMeta title={t("mainTitle")} description="Product Details" />
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
