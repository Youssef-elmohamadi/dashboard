import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/Admin/useOrders/useOrders";
import { Order } from "../../../types/Orders";
import { AxiosError } from "axios";
// import PageMeta from "../../common/SEO/PageMeta"; // Removed PageMeta import
import SEO from "../../common/SEO/seo"; // Ensured SEO component is imported

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails", "Meta"]); // استخدام الـ namespaces هنا
  const { id } = useParams();
  const [globalError, setGlobalError] = useState(false);
  const { data, isLoading, isError, error } = useGetOrderById(id);

  const order: Order = data!!;
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
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for missing ID
          title={{
            ar: "تشطيبة - تفاصيل الطلب - معرف مفقود",
            en: "Tashtiba - Order Details - ID Missing",
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
            ],
            en: [
              "order details",
              "missing ID",
              "invalid order",
              "Tashtiba",
              "order management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("OrderDetails:no_id")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for loading state
          title={{
            ar: "تشطيبة - تفاصيل الطلب - جارٍ التحميل",
            en: "Tashtiba - Order Details - Loading",
          }}
          description={{
            ar: "جارٍ تحميل تفاصيل الطلب في تشطيبة. يرجى الانتظار.",
            en: "Loading order details on Tashtiba. Please wait.",
          }}
          keywords={{
            ar: ["تفاصيل طلب", "تحميل الطلب", "طلبات تشطيبة", "إدارة الطلبات"],
            en: [
              "order details",
              "loading order",
              "Tashtiba orders",
              "order management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("OrderDetails:loading")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  if (!order && !globalError && !isLoading) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for order not found
          title={{
            ar: "تشطيبة - تفاصيل الطلب - غير موجود",
            en: "Tashtiba - Order Details - Not Found",
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
            ],
            en: [
              "order not found",
              "order details",
              "404 error",
              "Tashtiba",
              "order management",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("OrderDetails:not_found")} {/* إضافة namespace */}
        </div>
      </>
    );
  }
  if (globalError) {
    return (
      <>
        <SEO // PageMeta replaced with SEO, and data directly set for global error
          title={{
            ar: "تشطيبة - تفاصيل الطلب - خطأ",
            en: "Tashtiba - Order Details - Error",
          }}
          description={{
            ar: "حدث خطأ عام أثناء تحميل تفاصيل الطلب في تشطيبة. يرجى المحاولة لاحقًا.",
            en: "A global error occurred while loading order details on Tashtiba. Please try again later.",
          }}
          keywords={{
            ar: ["خطأ", "مشكلة تقنية", "تفاصيل الطلب", "تشطيبة", "فشل التحميل"],
            en: [
              "error",
              "technical issue",
              "order details",
              "Tashtiba",
              "loading failed",
            ],
          }}
        />
        <div className="p-8 text-center text-gray-500 dark:text-gray-300">
          {t("OrderDetails:global_error")} {/* إضافة namespace */}
        </div>
      </>
    );
  }

  return (
    <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
      <SEO // PageMeta replaced with SEO, and data directly set
        title={{
          ar: `تشطيبة - تفاصيل الطلب ${order?.order_id || ""}`,
          en: `Tashtiba - Order Details ${order?.order_id || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للطلب رقم ${
            order?.order_id || "غير معروف"
          } في تشطيبة، بما في ذلك حالة الطلب، المنتجات، ومعلومات العميل.`,
          en: `View full details for order ${
            order?.order_id || "unknown"
          } on Tashtiba, including order status, products, and customer information.`,
        }}
        keywords={{
          ar: [
            `الطلب رقم ${order?.order_id || ""}`,
            "تفاصيل الطلب",
            "عرض الطلب",
            "حالة الطلب",
            "طلبات العملاء",
            "إدارة الطلبات",
            "تشطيبة",
          ],
          en: [
            `order ${order?.order_id || ""}`,
            "order details",
            "view order",
            "order status",
            "customer orders",
            "order management",
            "Tashtiba",
          ],
        }}
      />
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {t("OrderDetails:title")} {/* إضافة namespace */}
      </h1>

      {/* Order Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          {t("OrderDetails:sections.order_info")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("OrderDetails:fields.order_id")}:</strong>{" "}
            {order?.order_id} {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.status")}:</strong> {order?.status}{" "}
            {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.total")}:</strong> {order?.total}{" "}
            {t("OrderDetails:egp")} {/* إضافة namespace */}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.payment_method")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.order?.payment_method}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.shipping_status")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.shipping_status}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.tracking_number")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.tracking_number}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.estimated_delivery")}:</strong>{" "}
            {/* إضافة namespace */}
            {formatDate(order?.estimated_delivery_date)}
          </p>
        </div>
      </section>

      {/* Customer Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("OrderDetails:sections.customer_info")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("OrderDetails:fields.name")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.order?.user?.first_name} {order?.order?.user?.last_name}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.email")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.order?.user?.email}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.phone")}:</strong>{" "}
            {/* إضافة namespace */}
            {order?.order?.user?.phone}
          </p>
          {order?.order.location && (
            <p>
              <strong>{t("OrderDetails:fields.address")}:</strong>{" "}
              {/* إضافة namespace */}
              {order?.order.location.building_number}{" "}
              {order?.order.location.street}, {order?.order?.location?.city}
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("OrderDetails:sections.products")} {/* إضافة namespace */}
        </h2>
        <div className="space-y-4">
          {order?.items.map((item) => (
            <div
              key={item.id}
              className="border dark:border-gray-700 p-4 rounded-md  dark:bg-gray-900"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-white">
                <p>
                  <strong>{t("OrderDetails:fields.product_name")}:</strong>{" "}
                  {/* إضافة namespace */}
                  {item?.product.name}
                </p>
                <p>
                  <strong>{t("OrderDetails:fields.description")}:</strong>{" "}
                  {/* إضافة namespace */}
                  {item?.product.description}
                </p>
                <p>
                  <strong>{t("OrderDetails:fields.price")}:</strong>{" "}
                  {item?.price} {t("OrderDetails:egp")} {/* إضافة namespace */}
                </p>
                <p>
                  <strong>{t("OrderDetails:fields.quantity")}:</strong>{" "}
                  {item?.quantity} {/* إضافة namespace */}
                </p>
                <p>
                  <strong>{t("OrderDetails:fields.total")}:</strong>{" "}
                  {item?.total} {t("OrderDetails:egp")} {/* إضافة namespace */}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("OrderDetails:sections.dates")} {/* إضافة namespace */}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("OrderDetails:fields.created_at")}:</strong>{" "}
            {/* إضافة namespace */}
            {formatDate(order?.created_at)}
          </p>
          <p>
            <strong>{t("OrderDetails:fields.updated_at")}:</strong>{" "}
            {/* إضافة namespace */}
            {formatDate(order?.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
