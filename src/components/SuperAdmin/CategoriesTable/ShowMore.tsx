import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAllCategories,
  getCategoryById,
} from "../../../api/SuperAdminApi/Categories/_requests";
import { useTranslation } from "react-i18next";

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

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id as string);
        setCategory(res.data.data.original);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching all categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("noId")}
      </div>
    );

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("loading")}
      </div>
    );

  if (!category)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        {t("notFound")}
      </div>
    );

  return (
    <div className="category-details p-6 max-w-5xl mx-auto space-y-8">
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
              ? categories?.find((cat) => cat.id === category.parent_id)
                  ?.name || t("unknown")
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
