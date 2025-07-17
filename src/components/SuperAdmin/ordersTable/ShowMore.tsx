import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/SuperAdmin/useOrders/useOrders";
import { AxiosError } from "axios";
// import PageMeta from "../../common/SEO/PageMeta"; // تم إزالة استيراد PageMeta
import SEO from "../../common/SEO/seo"; // تم استيراد SEO component

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails", "Meta"]);
  const { id } = useParams();
  const [globalError, setGlobalError] = useState(false);
  const { data, isError, isLoading, error } = useGetOrderById(id);

  const order = data;
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
  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل الطلب - معرف مفقود (سوبر أدمن)",
            en: "Tashtiba - Order Details - ID Missing (Super Admin)",
          }}
          description={{
            ar: "صفحة تفاصيل الطلب تتطلب معرف طلب صالح. يرجى التأكد من توفير المعرف.",
            en: "The order details page requires a valid order ID. Please ensure the ID is provided.",
          }}
          keywords={{
            ar: [
              "تفاصيل طلب",
              "معرف مفقود",
              "طلب غير صالح",
              "تشطيبة",
              "إدارة الطلبات",
              "سوبر أدمن",
            ],
            en: [
              "order details",
              "missing ID",
              "invalid order",
              "Tashtiba",
              "order management",
              "super admin",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("no_data")}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تفاصيل الطلب - جارٍ التحميل (سوبر أدمن)",
            en: "Tashtiba - Order Details - Loading (Super Admin)",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل الطلب بواسطة المشرف العام في تشطيبة. يرجى الانتظار.",
            en: "Loading order details by Super Admin on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: [
              "تفاصيل طلب",
              "تحميل الطلب",
              "طلبات تشطيبة",
              "إدارة الطلبات",
              "سوبر أدمن",
            ],
            en: [
              "order details",
              "loading order",
              "Tashtiba orders",
              "order management",
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

  if (!order && !globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for not found state
          title={{
            ar: "تشطيبة - تفاصيل الطلب - غير موجود (سوبر أدمن)",
            en: "Tashtiba - Order Details - Not Found (Super Admin)",
          }}
          description={{
            ar: "الطلب المطلوب غير موجود في نظام تشطيبة. يرجى التحقق من المعرف.",
            en: "The requested order was not found in Tashtiba. Please check the ID.",
          }}
          keywords={{
            ar: [
              "طلب غير موجود",
              "تفاصيل طلب",
              "خطأ 404",
              "تشطيبة",
              "إدارة الطلبات",
              "سوبر أدمن",
            ],
            en: [
              "order not found",
              "order details",
              "404 error",
              "Tashtiba",
              "order management",
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
            ar: "تشطيبة - تفاصيل الطلب - خطأ عام (سوبر أدمن)",
            en: "Tashtiba - Order Details - Global Error (Super Admin)",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل الطلب بواسطة المشرف العام في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading order details by Super Admin on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: [
              "خطأ عام",
              "مشكلة تقنية",
              "تفاصيل الطلب",
              "تشطيبة",
              "فشل التحميل",
              "سوبر أدمن",
            ],
            en: [
              "global error",
              "technical issue",
              "order details",
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
    <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
      <SEO // PageMeta replaced with SEO, and data directly set for main content
        title={{
          ar: `تشطيبة - تفاصيل الطلب ${order?.id || ""}`,
          en: `Tashtiba - Order Details ${order?.id || ""} (Super Admin)`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للطلب رقم ${
            order?.id || "غير معروف"
          } بواسطة المشرف العام في تشطيبة، بما في ذلك حالة الطلب، المنتجات، ومعلومات العميل.`,
          en: `View full details for order ${
            order?.id || "unknown"
          } by Super Admin on Tashtiba, including order status, products, and customer information.`,
        }}
        keywords={{
          ar: [
            `الطلب رقم ${order?.id || ""}`,
            "تفاصيل الطلب",
            "عرض الطلب",
            "حالة الطلب",
            "طلبات العملاء",
            "إدارة الطلبات",
            "تشطيبة",
            "سوبر أدمن",
          ],
          en: [
            `order ${order?.id || ""}`,
            "order details",
            "view order",
            "order status",
            "customer orders",
            "order management",
            "Tashtiba",
            "super admin",
          ],
        }}
      />{" "}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {t("title")}
      </h1>
      {/* Order Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("sections.order_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.order_id")}:</strong> {order?.id}
          </p>
          <p>
            <strong>{t("fields.status")}:</strong> {order?.status}
          </p>
          <p>
            <strong>{t("fields.total")}:</strong> {order?.total_amount}{" "}
            {t("egp")}
          </p>
          <p>
            <strong>{t("fields.payment_method")}:</strong>{" "}
            {order?.payment_method}
          </p>
          <p>
            <strong>{t("fields.is_paid")}:</strong>{" "}
            {order?.is_paid ? t("yes") : t("no")}
          </p>
          <p>
            <strong>{t("fields.created_at")}:</strong>{" "}
            {formatDate(order?.created_at)}
          </p>
        </div>
      </section>
      {/* Location Info */}
      {order?.location && (
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            {t("sections.customer_info")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
            <p>
              <strong>{t("fields.name")}:</strong> {order.location.full_name}
            </p>
            <p>
              <strong>{t("fields.phone")}:</strong> {order.location.phone}
            </p>
            <p>
              <strong>{t("fields.address")}:</strong>
              {order.location.city}, {order.location.street},{" "}
              {order.location.area}
            </p>
            <p>
              <strong>{t("fields.floor")}:</strong>{" "}
              {order.location.floor_number}
            </p>
            <p>
              <strong>{t("fields.apartment")}:</strong>{" "}
              {order.location.apartment_number}
            </p>
            <p>
              <strong>{t("fields.landmark")}:</strong> {order.location.landmark}
            </p>
          </div>
        </section>
      )}
      {/* Sub Orders */}
      {order?.sub_orders?.map((sub) => (
        <section
          key={sub.id}
          className="bg-white p-6 rounded-xl dark:bg-gray-900"
        >
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {t("sections.vendor_order")} - {sub.vendor.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white mb-4">
            <p>
              <strong>{t("fields.shipping_status")}:</strong>{" "}
              {sub.shipping_status}
            </p>
            <p>
              <strong>{t("fields.tracking_number")}:</strong>{" "}
              {sub.tracking_number}
            </p>
            <p>
              <strong>{t("fields.estimated_delivery")}:</strong>{" "}
              {formatDate(sub.estimated_delivery_date)}
            </p>
            <p>
              <strong>{t("fields.subtotal")}:</strong> {sub.total} {t("egp")}
            </p>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {sub.items?.map((item) => (
              <div
                key={item.id}
                className="border dark:border-gray-700 p-4 rounded-md dark:bg-gray-900"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-white">
                  <p>
                    <strong>{t("fields.product_name")}:</strong>{" "}
                    {item.product.name}
                  </p>
                  <p>
                    <strong>{t("fields.description")}:</strong>{" "}
                    {item.product.description}
                  </p>
                  <p>
                    <strong>{t("fields.price")}:</strong> {item.price}{" "}
                    {t("egp")}
                  </p>
                  <p>
                    <strong>{t("fields.quantity")}:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>{t("fields.total")}:</strong> {item.total}{" "}
                    {t("egp")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default OrderDetails;
