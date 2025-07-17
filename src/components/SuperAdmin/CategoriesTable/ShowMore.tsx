import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetCategoryById,
  useAllCategories,
} from "../../../hooks/Api/SuperAdmin/useCategories/useSuperAdminCategpries";
import { useTranslation } from "react-i18next";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";
import { Category } from "../../../types/Categories";

const CategoryDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["CategoryDetails", "Meta"]);
  const [globalError, setGlobalError] = useState("");
  //const [category, setCategory] = useState<Category | null>(null);
  //const [categories, setCategories] = useState<Category[] | null>(null);
  //const [loading, setLoading] = useState(true);
  const { data, isLoading: loading, error, isError } = useGetCategoryById(id);

  const category = data;
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
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل الفئة - معرف مفقود (سوبر أدمن)",
            en: "Tashtiba - Category Details - ID Missing (Super Admin)",
          }}
          description={{
            ar: "صفحة تفاصيل الفئة تتطلب معرف فئة صالح. يرجى التأكد من توفير المعرف.",
            en: "The category details page requires a valid category ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تفاصيل الفئة",
              "معرف مفقود",
              "فئة غير صالحة",
              "تشطيبة",
              "إدارة الفئات",
              "سوبر أدمن",
            ],
            en: [
              "category details",
              "missing ID",
              "invalid category",
              "Tashtiba",
              "category management",
              "super admin",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تفاصيل الفئة - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Category Details - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل الفئة بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading category details by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل الفئة",
              "تحميل الفئة",
              "إدارة الفئات",
              "سوبر أدمن",
              "تصنيفات المنتجات",
            ],
            en: [
              "category details",
              "loading category",
              "category management",
              "super admin",
              "product classifications",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!category && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تفاصيل الفئة - غير موجودة (سوبر أدمن)",
            en: "Tashtiba - Category Details - Not Found (Super Admin)",
          }}
          description={{
            ar: "الفئة المطلوبة غير موجودة في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested category was not found on Tashtiba. Please verify the ID.",
          }}
          keywords={{
            ar: [
              "فئة غير موجودة",
              "تفاصيل الفئة",
              "خطأ 404",
              "سوبر أدمن",
              "إدارة الفئات",
            ],
            en: [
              "category not found",
              "category details",
              "404 error",
              "super admin",
              "category management",
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
            ar: "تشطيبة - تفاصيل الفئة - خطأ عام (سوبر أدمن)",
            en: "Tashtiba - Category Details - Global Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل الفئة بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading category details by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة تقنية",
              "تفاصيل الفئة",
              "سوبر أدمن",
              "فشل التحميل",
            ],
            en: [
              "global error",
              "technical issue",
              "category details",
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

  return (
    <div className="category-details p-6 max-w-5xl mx-auto space-y-8">
      <SEO
        title={{
          ar: `تشطيبة - تفاصيل الفئة ${category?.name || ""}`,
          en: `Tashtiba - Category Details ${category?.name || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للفئة "${
            category?.name || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك الوصف والعمولة والصورة.`,
          en: `View full details for category "${
            category?.name || "unknown"
          }" by Super Admin on Tashtiba, including description, commission, and image.`,
        }}
        keywords={{
          ar: [
            `الفئة ${category?.name || ""}`,
            "تفاصيل الفئة",
            "عرض الفئة",
            "عمولة الفئة",
            "صورة الفئة",
            "إدارة الفئات",
            "سوبر أدمن",
          ],
          en: [
            `category ${category?.name || ""}`,
            "category details",
            "view category",
            "category commission",
            "category image",
            "category management",
            "super admin",
          ],
        }}
      />

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
            <strong>{t("name")}:</strong> {category?.name}
          </p>
          <p>
            <strong>{t("description")}:</strong> {category?.description}
          </p>
          <p>
            <strong>{t("commissionRate")}:</strong> {category?.commission_rate}%
          </p>
          <p>
            <strong>{t("order")}:</strong> {category?.order}
          </p>
          <p>
            <strong>{t("status")}:</strong> {category?.status}
          </p>
          <p>
            <strong>{t("appearsOnWebsite")}:</strong>{" "}
            {category?.appears_in_website ? t("yes") : t("no")}
          </p>
          <p>
            <strong>{t("parentId")}:</strong>{" "}
            {category?.parent_id
              ? categories?.find(
                  (cat: Category) => cat.id === category?.parent_id
                )?.name || t("unknown")
              : t("none")}
          </p>
        </div>
      </section>
      {/* Image */}
      {category?.image && (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            {t("categoryImage")}
          </h2>
          <div className="w-full flex justify-center">
            <img
              src={category?.image}
              alt={category?.name}
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
            <strong>{t("createdAt")}:</strong>{" "}
            {formatDate(category?.created_at as string)}
          </p>
          <p>
            <strong>{t("updatedAt")}:</strong>{" "}
            {formatDate(category?.updated_at as string)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetails;
