import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/SuperAdmin/useOrders/useOrders";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails", "Meta"]);
  const { id } = useParams();
  const { data, isError, isLoading, error } = useGetOrderById(id);

  const order = data;

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
  } else if (!order) {
    pageStatus = PageStatus.NOT_FOUND;
  }

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <PageStatusHandler
      status={pageStatus}
      loadingText={t("loading")}
      errorMessage={pageError}
      notFoundMessage={t("not_found")}
    >
      <SEO
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
        robotsTag="noindex, nofollow"
      />
      <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
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
                <strong>{t("fields.landmark")}:</strong>{" "}
                {order.location.landmark}
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
    </PageStatusHandler>
  );
};

export default OrderDetails;
