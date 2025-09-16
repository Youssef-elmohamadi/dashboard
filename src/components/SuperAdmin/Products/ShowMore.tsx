import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetProductById } from "../../../hooks/Api/SuperAdmin/useProducts/useSuperAdminProductsManage";
import SEO from "../../common/SEO/seo";
import { AxiosError } from "axios";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation(["ProductDetails", "Meta"]);
  const { lang } = useDirectionAndLanguage();
  const { data, isLoading, error, isError } = useGetProductById(id!);

  const product = data?.data?.data;

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
  } else if (!product) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("loading")}
      errorMessage={pageError}
      notFoundMessage={t("not_found")}
    >
      <SEO
        title={{
          ar: ` ${product?.name_ar || "تفاصيل المنتج"} (سوبر أدمن)`,
          en: `${product?.name_en || "Product Details"} (Super Admin)`,
        }}
        description={{
          ar: `استعرض تفاصيل المنتج "${
            product?.name_ar || "غير معروف"
          }" بواسطة المشرف العام في تشطيبة، بما في ذلك السعر، الوصف، والصور.`,
          en: `View details for product "${
            product?.name_en || "Unknown"
          }" by Super Admin on Tashtiba, including price, description, and images.`,
        }}
        keywords={{
          ar: [
            `${product?.name_ar || "منتج"}`,
            "تفاصيل المنتج",
            "عرض منتج",
            "سعر المنتج",
            "وصف المنتج",
            "صور المنتج",
            "تشطيبة",
            "سوبر أدمن",
          ],
          en: [
            `${product?.name_en || "product"}`,
            "product details",
            "view product",
            "product price",
            "product description",
            "product images",
            "Tashtiba",
            "super admin",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <div className="product-details p-6 max-w-6xl mx-auto space-y-10">
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
              <strong>{t("fields.name")}:</strong> {product?.[`name_${lang}`]}
            </p>
            <p>
              <strong>{t("fields.slug")}:</strong> {product?.slug}
            </p>
            <p>
              <strong>{t("fields.description")}:</strong>{" "}
              {product?.[`description_${lang}`]}
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
        {/* Section 2: Pricing & Stock */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            {t("sections.pricing_stock")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("fields.price")}:</strong> {product?.price} EGP
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
        {/* Section 3: Category & Brand */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {t("sections.category_brand")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("fields.category")}:</strong>{" "}
              {product?.category?.[`name_${lang}`]}
            </p>
            <p>
              <strong>{t("fields.brand")}:</strong>{" "}
              {product?.brand?.[`name_${lang}`]}
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
              <strong>{t("fields.vendor_name")}:</strong>{" "}
              {product?.vendor?.name}
            </p>
            <p>
              <strong>{t("fields.vendor_email")}:</strong>{" "}
              {product?.vendor?.email}
            </p>
            <p>
              <strong>{t("fields.vendor_phone")}:</strong>{" "}
              {product?.vendor?.phone}
            </p>
          </div>
        </section>
        {/* Section 5: Attributes */}
        {(product?.attributes?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">
              {t("sections.attributes")}
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-white">
              {product?.attributes.map((attr: any) => (
                <li key={attr.id}>
                  <strong>{attr[`attribute_name_${lang}`]}:</strong>{" "}
                  {attr[`attribute_value_${lang}`]}
                </li>
              ))}
            </ul>
          </section>
        )}
        {/* Section 6: Tags */}
        {(product?.tags?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-pink-700">
              {t("sections.tags")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {product?.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full"
                >
                  {tag[`name_${lang}`]}
                </span>
              ))}
            </div>
          </section>
        )}
        {/* Section 7: Images */}
        {(product?.images?.length ?? 0) > 0 && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-4 text-red-700">
              {t("sections.images")}
            </h2>
            <div className="flex flex-wrap gap-4">
              {product?.images.map((img: any) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700  dark:text-white">
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
    </PageStatusHandler>
  );
};

export default ProductDetails;
