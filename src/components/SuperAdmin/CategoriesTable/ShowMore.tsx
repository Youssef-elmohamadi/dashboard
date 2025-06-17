import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetCategoryById,
  useAllCategories,
} from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useTranslation } from "react-i18next";
import PageMeta from "../../common/PageMeta";
import { AxiosError } from "axios";
interface Category {
  id: number;
  name: string;
  description: string;
  image: string | null;
  parent_id: number | null;
  status: string;
  order: number;
  commission_rate: number;
  appears_in_website: string;
  created_at: string | null;
  updated_at: string | null;
  category?: any;
}

const CategoryDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CategoryDetails"]);
  const [globalError, setGlobalError] = useState("");
  //const [category, setCategory] = useState<Category | null>(null);
  //const [categories, setCategories] = useState<Category[] | null>(null);
  //const [loading, setLoading] = useState(true);
  const { data, isLoading: loading, error, isError } = useGetCategoryById(id);

  const category = data?.data.data;
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

  const { data: categoriesData } = useAllCategories();

  const categories = categoriesData?.data.data;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
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
        <PageMeta title={t("mainTitle")} description="Category Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Category Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!category && !globalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Category Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <PageMeta title={t("mainTitle")} description="Category Details" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {globalError}
        </div>
      </>
    );
  }

  return (
    <div className="category-details p-6 max-w-5xl mx-auto space-y-8">
      <PageMeta title={t("mainTitle")} description="Category Details" />
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        {t("title")}
      </h1>

      {/* Basic Info */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
          {t("basicInfo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("name")}:</strong> {category.name}
          </p>
          <p>
            <strong>{t("description")}:</strong> {category.description}
          </p>
          <p>
            <strong>{t("commissionRate")}:</strong> {category.commission_rate}%
          </p>
          <p>
            <strong>{t("order")}:</strong> {category.order}
          </p>
          <p>
            <strong>{t("status")}:</strong> {category.status}
          </p>
          <p>
            <strong>{t("appearsOnWebsite")}:</strong>{" "}
            {category.appears_in_website === "yes" ? t("yes") : t("no")}
          </p>
          <p>
            <strong>{t("parentId")}:</strong>{" "}
            {category.parent_id
              ? categories?.find(
                  (cat: Category) => cat.id === category.parent_id
                )?.name || t("unknown")
              : t("none")}
          </p>
        </div>
      </section>

      {/* Image */}
      {category.image && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            {t("categoryImage")}
          </h2>
          <div className="w-full flex justify-center">
            <img
              src={category.image}
              alt={category.name}
              className="max-w-xs h-auto rounded-lg shadow-md"
            />
          </div>
        </section>
      )}

      {/* Timestamps */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          {t("timestamps")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p>
            <strong>{t("createdAt")}:</strong> {formatDate(category.created_at)}
          </p>
          <p>
            <strong>{t("updatedAt")}:</strong> {formatDate(category.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetails;
