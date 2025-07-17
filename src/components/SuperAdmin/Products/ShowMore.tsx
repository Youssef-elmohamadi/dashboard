import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductById } from "../../../hooks/Api/SuperAdmin/useProducts/useSuperAdminProductsManage";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component
import { AxiosError } from "axios";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["ProductDetails", "Meta"]);
  const [globalError, setGlobalError] = useState(false);
  const { data, isLoading: loading, error, isError } = useGetProductById(id!!);
  const product = data?.data.data;
  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error, t]);
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل المنتج - معرف مفقود (سوبر أدمن)",
            en: "Tashtiba - Product Details - ID Missing (Super Admin)",
          }}
          description={{
            ar: "صفحة تفاصيل المنتج تتطلب معرف منتج صالح. يرجى التأكد من توفير المعرف.",
            en: "The product details page requires a valid product ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تفاصيل منتج",
              "معرف مفقود",
              "منتج غير صالح",
              "تشطيبة",
              "إدارة المنتجات",
              "سوبر أدمن",
            ],
            en: [
              "product details",
              "missing ID",
              "invalid product",
              "Tashtiba",
              "product management",
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
            ar: "تشطيبة - تفاصيل المنتج - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Product Details - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل المنتج بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading product details by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل منتج",
              "تحميل المنتج",
              "منتجات تشطيبة",
              "إدارة المنتجات",
              "سوبر أدمن",
            ],
            en: [
              "product details",
              "loading product",
              "Tashtiba products",
              "product management",
              "super admin",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!product && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تفاصيل المنتج - غير موجود (سوبر أدمن)",
            en: "Tashtiba - Product Details - Not Found (Super Admin)",
          }}
          description={{
            ar: "المنتج المطلوب غير موجود في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested product was not found in Tashtiba. Please check the ID.",
          }}
          keywords={{
            ar: [
              "منتج غير موجود",
              "تفاصيل منتج",
              "خطأ 404",
              "تشطيبة",
              "إدارة المنتجات",
              "سوبر أدمن",
            ],
            en: [
              "product not found",
              "product details",
              "404 error",
              "Tashtiba",
              "product management",
              "super admin",
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
            ar: "تشطيبة - تفاصيل المنتج - خطأ عام (سوبر أدمن)",
            en: "Tashtiba - Product Details - Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل المنتج بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading product details by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ",
              "مشكلة تقنية",
              "تفاصيل المنتج",
              "تشطيبة",
              "فشل التحميل",
              "سوبر أدمن",
            ],
            en: [
              "error",
              "technical issue",
              "product details",
              "Tashtiba",
              "loading failed",
              "super admin",
            ],
          }}
        />{" "}
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("global_error")}
        </div>
      </>
    );
  }

  return (
    <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
      <SEO
        title={{
          ar: `تشطيبة - ${product?.name || "تفاصيل المنتج"} (سوبر أدمن)`,
          en: `Tashtiba - ${product?.name || "Product Details"} (Super Admin)`,
        }}
        description={{
          ar: `استعرض تفاصيل المنتج "${
            product?.name || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك السعر، الوصف، والصور.`,
          en: `View details for product "${
            product?.name || "Unknown"
          }" by Super Admin on Tashtiba, including price, description, and images.`,
        }}
        keywords={{
          ar: [
            `${product?.name || "منتج"}`,
            "تفاصيل المنتج",
            "عرض منتج",
            "سعر المنتج",
            "وصف المنتج",
            "صور المنتج",
            "تشطيبة",
            "سوبر أدمن",
          ],
          en: [
            `${product?.name || "product"}`,
            "product details",
            "view product",
            "product price",
            "product description",
            "product images",
            "Tashtiba",
            "super admin",
          ],
        }}
      />
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {t("title")}
      </h1>
      {/* Section 1: Basic Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("sections.basic_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.name")}:</strong> {product.name}
          </p>
          <p>
            <strong>{t("fields.slug")}:</strong> {product.slug}
          </p>
          <p>
            <strong>{t("fields.description")}:</strong> {product.description}
          </p>
          <p>
            <strong>{t("fields.status")}:</strong> {product.status}
          </p>
          <p>
            <strong>{t("fields.featured")}:</strong>{" "}
            {product.is_featured ? t("yes") : t("no")}
          </p>
        </div>
      </section>
      {/* Section 2: Pricing & Stock */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("sections.pricing_stock")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.price")}:</strong> {product.price} EGP
          </p>
          <p>
            <strong>{t("fields.discount_price")}:</strong>{" "}
            {product.discount_price} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.stock_quantity")}:</strong>{" "}
            {product.stock_quantity}
          </p>
        </div>
      </section>
      {/* Section 3: Category & Brand */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("sections.category_brand")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.category")}:</strong> {product.category?.name}
          </p>
          <p>
            <strong>{t("fields.brand")}:</strong> {product.brand?.name}
          </p>
        </div>
      </section>
      {/* Section 4: Vendor */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">
          {t("sections.vendor_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.vendor_name")}:</strong> {product.vendor?.name}
          </p>
          <p>
            <strong>{t("fields.vendor_email")}:</strong> {product.vendor?.email}
          </p>
          <p>
            <strong>{t("fields.vendor_phone")}:</strong> {product.vendor?.phone}
          </p>
        </div>
      </section>
      {/* Section 5: Attributes */}
      {product.attributes?.length > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            {t("sections.attributes")}
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-white">
            {product.attributes.map((attr: any) => (
              <li key={attr.id}>
                <strong>{attr.attribute_name}:</strong> {attr.attribute_value}
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* Section 6: Tags */}
      {product.tags?.length > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            {t("sections.tags")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}
      {/* Section 7: Images */}
      {product.images?.length > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            {t("sections.images")}
          </h2>
          <div className="flex flex-wrap gap-4">
            {product.images.map((img: any) => (
              <img
                key={img.id}
                src={img.image}
                alt="Product Image"
                className="w-32 h-32 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        </section>
      )}
      {/* Section 8: Dates */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("sections.timestamps")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700  dark:text-white">
          <p>
            <strong>{t("fields.created_at")}:</strong>{" "}
            {formatDate(product.created_at)}
          </p>
          <p>
            <strong>{t("fields.updated_at")}:</strong>{" "}
            {formatDate(product.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
