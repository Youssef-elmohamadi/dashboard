import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductById } from "../../../hooks/Api/Admin/useProducts/useAdminProducts";
import PageMeta from "../../common/SEO/PageMeta";
import { AxiosError } from "axios";

const ProductDetails: React.FC = () => {
  const { t } = useTranslation(["ProductDetails"]);
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
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("loading")}
        </div>
      </>
    );
  }

  if (!product && !globalError) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("not_found")}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <PageMeta title={t("main_title")} description="Update Product" />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("global_error")}
        </div>
      </>
    );
  }

  return (
    <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
      <PageMeta title={t("main_title")} description="Update Product" />
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {t("title")}
      </h1>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("sections.basic_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.name")}:</strong> {product?.name}
          </p>
          <p>
            <strong>{t("fields.slug")}:</strong> {product?.slug}
          </p>
          <p>
            <strong>{t("fields.description")}:</strong> {product?.description}
          </p>
          <p>
            <strong>{t("fields.status")}:</strong> {product?.status}
          </p>
          <p>
            <strong>{t("fields.featured")}:</strong>{" "}
            {product?.is_featured ? t("yes") : t("no")}
          </p>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("sections.pricing_stock")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.price")}:</strong> {product?.price} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.discount_price")}:</strong>{" "}
            {product?.discount_price} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.stock_quantity")}:</strong>{" "}
            {product?.stock_quantity}
          </p>
        </div>
      </section>

      {/* Category & Brand */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("sections.category_brand")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.category")}:</strong> {product?.category?.name}
          </p>
          <p>
            <strong>{t("fields.brand")}:</strong> {product?.brand?.name}
          </p>
        </div>
      </section>

      {/* Section 4: Vendor */}
      <section className="bg-white dark:bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">
          {t("sections.vendor_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.vendor_name")}:</strong> {product?.vendor?.name}
          </p>
          <p>
            <strong>{t("fields.vendor_email")}:</strong> {product?.vendor?.email}
          </p>
          <p>
            <strong>{t("fields.vendor_phone")}:</strong> {product?.vendor?.phone}
          </p>
        </div>
      </section>
      {/* Attributes */}
      {(product?.attributes?.length ?? 0) > 0 && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            {t("sections.attributes")}
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
            {t("sections.tags")}
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
            {t("sections.images")}
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
          {t("sections.timestamps")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.created_at")}:</strong>{" "}
            {formatDate(product?.created_at)}
          </p>
          <p>
            <strong>{t("fields.updated_at")}:</strong>{" "}
            {formatDate(product?.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
