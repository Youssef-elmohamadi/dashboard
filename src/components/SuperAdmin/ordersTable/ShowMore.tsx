import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/SuperAdmin/useOrders/useOrders";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails", "Meta"]);
  const { lang } = useDirectionAndLanguage();
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
      ? new Date(dateString).toLocaleDateString(
          lang === "ar" ? "ar-EG" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
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
          ar: ` تفاصيل الطلب ${order?.id || ""}`,
          en: `Order Details ${order?.id || ""} (Super Admin)`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للطلب رقم ${
            order?.id || "غير معروف"
          } بواسطة المشرف العام في تشطيبة.`,
          en: `View full details for order ${
            order?.id || "unknown"
          } by Super Admin on Tashtiba.`,
        }}
        robotsTag="noindex, nofollow"
      />

      <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
          {t("title")}
        </h1>

        {/* Order Info */}
        <section className="bg-white p-6 rounded-xl dark:bg-gray-900 border dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-blue-700 border-b pb-2">
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
              <strong>{t("fields.subtotal")}:</strong> {order?.total_amount}{" "}
              {t("egp")}
            </p>
            <p>
              <strong>{t("fields.shipping_price")}:</strong>{" "}
              {order?.transportation_price} {t("egp")}
            </p>
            <p>
              <strong>{t("fields.total")}:</strong>{" "}
              <span className="text-blue-600 font-bold">
                {(order?.total_amount || 0) +
                  (order?.transportation_price || 0)}{" "}
                {t("egp")}
              </span>
            </p>
            <p>
              <strong>{t("fields.payment_method")}:</strong>{" "}
              {order?.payment_method}
            </p>
            <p>
              <strong>{t("fields.is_paid")}:</strong>{" "}
              <span
                className={order?.is_paid ? "text-green-600" : "text-red-600"}
              >
                {order?.is_paid ? t("yes") : t("no")}
              </span>
            </p>
            <p>
              <strong>{t("fields.created_at")}:</strong>{" "}
              {formatDate(order?.created_at)}
            </p>
          </div>
        </section>

        {/* User Account Info (الجديد) */}
        {order?.user && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 border dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 border-b pb-2">
              {t("sections.user_account_info")}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
              {order.user.avatar && (
                <img
                  src={order.user.avatar}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border shadow-sm"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 text-gray-700 dark:text-white">
                <p>
                  <strong>{t("fields.user_id")}:</strong> {order.user.id}
                </p>
                <p>
                  <strong>{t("fields.user_name")}:</strong>{" "}
                  {order.user.first_name} {order.user.last_name}
                </p>
                <p>
                  <strong>{t("fields.user_email")}:</strong> {order.user.email}
                </p>
                <p>
                  <strong>{t("fields.user_phone")}:</strong> {order.user.phone}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Shipping Location Info */}
        {order?.location && (
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 border dark:border-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-700 border-b pb-2">
              {t("sections.shipping_address")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
              <p>
                <strong>{t("fields.recipient")}:</strong>{" "}
                {order.location.full_name}
              </p>
              <p>
                <strong>{t("fields.phone")}:</strong> {order.location.phone}
              </p>
              <p>
                <strong>{t("fields.city")}:</strong> {order.location.city}
              </p>
              <p>
                <strong>{t("fields.area")}:</strong> {order.location.area}
              </p>
              <p>
                <strong>{t("fields.street")}:</strong> {order.location.street}
              </p>
              <p>
                <strong>{t("fields.building")}:</strong>{" "}
                {order.location.building_number}
              </p>
              <p>
                <strong>{t("fields.floor")}:</strong>{" "}
                {order.location.floor_number}
              </p>
              <p>
                <strong>{t("fields.apartment")}:</strong>{" "}
                {order.location.apartment_number}
              </p>
              <p className="md:col-span-2">
                <strong>{t("fields.landmark")}:</strong>{" "}
                {order.location.landmark}
              </p>
              {order.location.notes && (
                <p className="md:col-span-2 italic text-gray-500 text-sm">
                  <strong>{t("fields.notes")}:</strong> {order.location.notes}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Sub Orders (Vendors) */}
        {order?.sub_orders?.map((sub) => (
          <section
            key={sub.id}
            className="bg-white p-6 rounded-xl dark:bg-gray-900 border dark:border-gray-800 shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 text-purple-700 border-b pb-2">
              {t("sections.vendor_order")} - {sub.vendor.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white mb-4">
              <p>
                <strong>{t("fields.vendor_phone")}:</strong> {sub.vendor.phone}
              </p>
              <p>
                <strong>{t("fields.shipping_status")}:</strong>{" "}
                {sub.shipping_status}
              </p>
              <p>
                <strong>{t("fields.tracking_number")}:</strong>{" "}
                {sub.tracking_number || t("not_available")}
              </p>
              <p>
                <strong>{t("fields.estimated_delivery")}:</strong>{" "}
                {formatDate(sub.estimated_delivery_date) || t("not_available")}
              </p>
              <p>
                <strong>{t("fields.subtotal")}:</strong> {sub.total} {t("egp")}
              </p>
            </div>

            {/* Items with Questions (الجديد) */}
            <div className="space-y-4">
              {sub.items?.map((item) => (
                <div
                  key={item.id}
                  className="border dark:border-gray-700 p-4 rounded-md dark:bg-gray-800/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-gray-700 dark:text-white">
                    <p>
                      <strong>{t("fields.product_name")}:</strong>{" "}
                      {item.product[`name_${lang}`]}
                    </p>
                    <p>
                      <strong>{t("fields.quantity")}:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>{t("fields.price")}:</strong> {item.price}{" "}
                      {t("egp")}
                    </p>
                    <p>
                      <strong>{t("fields.total")}:</strong> {item.total}{" "}
                      {t("egp")}
                    </p>

                    {/* عرض الأسئلة المخصصة للمنتج إن وجدت */}
                    {item.questions && item.questions.length > 0 && (
                      <div className="md:col-span-2 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase">
                          {t("fields.product_customizations")}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.questions.map((q) => (
                            <div
                              key={q.id}
                              className="text-sm border-s-2 border-blue-300 ps-2"
                            >
                              <span className="block text-gray-500 dark:text-gray-400">
                                {q[`question_title_${lang}`]}
                              </span>
                              <span className="font-semibold">
                                {q[`answer_text_${lang}`]}
                              </span>
                              {parseFloat(q.price_effect) > 0 && (
                                <span className="ms-2 text-xs text-green-600 font-normal">
                                  (+{q.price_effect} {t("egp")})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
