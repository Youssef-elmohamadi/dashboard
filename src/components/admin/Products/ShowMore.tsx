import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductById } from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
// import PageMeta from "../../common/SEO/PageMeta"; // Removed PageMeta import
import SEO from "../../common/SEO/seo"; // Confirmed SEO component is imported
import { AxiosError } from "axios";

const ProductDetails: React.FC = () => {
  const { t } = useTranslation(["ProductDetails", "Meta"]); // استخدام الـ namespaces هنا
  const { id }: any = useParams();

  const { data: product, isError, error, isLoading } = useGetProductById(id);
  const [globalError, setGlobalError] = useState(false);

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
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تفاصيل المنتج - معرف مفقود",
            en: "Tashtiba - Product Details - ID Missing",
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
            ],
            en: [
              "product details",
              "missing ID",
              "invalid product",
              "Tashtiba",
              "product management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("ProductDetails:no_data")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تفاصيل المنتج - جارٍ التحميل",
            en: "Tashtiba - Product Details - Loading",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل المنتج في تشطيبة. يرجى الانتظار.",
            en: "Loading product details on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل منتج",
              "تحميل المنتج",
              "منتجات تشطيبة",
              "إدارة المنتجات",
            ],
            en: [
              "product details",
              "loading product",
              "Tashtiba products",
              "product management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("ProductDetails:loading")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (!product && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تفاصيل المنتج - غير موجود",
            en: "Tashtiba - Product Details - Not Found",
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
            ],
            en: [
              "product not found",
              "product details",
              "404 error",
              "Tashtiba",
              "product management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("ProductDetails:not_found")} {/* إضافة namespace */}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set
          title={{
            ar: "تشطيبة - تفاصيل المنتج - خطأ",
            en: "Tashtiba - Product Details - Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل المنتج في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading product details on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ",
              "مشكلة تقنية",
              "تفاصيل المنتج",
              "تشطيبة",
              "فشل التحميل",
            ],
            en: [
              "error",
              "technical issue",
              "product details",
              "Tashtiba",
              "loading failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("ProductDetails:global_error")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  return (
    <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
      <SEO
        title={{
          ar: `تشطيبة - ${product?.name || "تفاصيل المنتج"}`,
          en: `Tashtiba - ${product?.name || "Product Details"}`,
        }}
        description={{
          ar: `استعرض تفاصيل المنتج "${
            product?.name || "غير معروف"
          }" في تشطيبة، بما في ذلك السعر، الوصف، والصور.`,
          en: `View details for product "${
            product?.name || "Unknown"
          }" on Tashtiba, including price, description, and images.`,
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
          ],
          en: [
            `${product?.name || "product"}`,
            "product details",
            "view product",
            "product price",
            "product description",
            "product images",
            "Tashtiba",
          ],
        }}
      />

      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {t("ProductDetails:title")} {/* إضافة namespace */}
      </h1>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("ProductDetails:sections.basic_info")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("ProductDetails:fields.name")}:</strong> {product?.name}{" "}
            {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.slug")}:</strong> {product?.slug}{" "}
            {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.description")}:</strong>{" "}
            {product?.description} {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.status")}:</strong>{" "}
            {product?.status} {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.featured")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.is_featured
              ? t("ProductDetails:yes")
              : t("ProductDetails:no")}{" "}
            {/* إضافة namespace */}
          </p>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("ProductDetails:sections.pricing_stock")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("ProductDetails:fields.price")}:</strong>{" "}
            {product?.price} {t("ProductDetails:egp")} {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.discount_price")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.discount_price} {t("ProductDetails:egp")}{" "}
            {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.stock_quantity")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.stock_quantity}
          </p>
        </div>
      </section>

      {/* Category & Brand */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("ProductDetails:sections.category_brand")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("ProductDetails:fields.category")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.category?.name}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.brand")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.brand?.name}
          </p>
        </div>
      </section>

      {/* Section 4: Vendor */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">
          {t("ProductDetails:sections.vendor_info")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("ProductDetails:fields.vendor_name")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.vendor?.name}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.vendor_email")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.vendor?.email}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.vendor_phone")}:</strong>{" "}
            {/* إضافة namespace */}
            {product?.vendor?.phone}
          </p>
        </div>
      </section>
      {/* Attributes */}
      {(product?.attributes?.length ?? 0) > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            {t("ProductDetails:sections.attributes")} {/* إضافة namespace */}
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-white">
            {product?.attributes?.map((attr) => (
              <li key={attr.id}>
                <strong>{attr.attribute_name}:</strong> {attr.attribute_value}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {(product?.tags?.length ?? 0) > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-pink-700">
            {t("ProductDetails:sections.tags")} {/* إضافة namespace */}
          </h2>
          <div className="flex flex-wrap gap-2 text-gray-700 dark:text-white">
            {product?.tags.map((tag) => (
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

      {/* Images */}
      {(product?.images?.length ?? 0) > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-red-700">
            {t("ProductDetails:sections.images")} {/* إضافة namespace */}
          </h2>
          <div className="flex flex-wrap gap-4 text-gray-700 dark:text-white">
            {product?.images?.map((img: any) => (
              <img
                key={img.id}
                src={img.image}
                alt="Product"
                className="w-32 h-32 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        </section>
      )}

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("ProductDetails:sections.timestamps")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("ProductDetails:fields.created_at")}:</strong>{" "}
            {/* إضافة namespace */}
            {formatDate(product?.created_at)}
          </p>
          <p>
            <strong>{t("ProductDetails:fields.updated_at")}:</strong>{" "}
            {/* إضافة namespace */}
            {formatDate(product?.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
