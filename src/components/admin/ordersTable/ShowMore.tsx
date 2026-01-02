import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/Admin/useOrders/useOrders";
import { AxiosError } from "axios";
import SEO from "../../common/SEO/seo";
import PageStatusHandler, {
  PageStatus,
} from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails"]);
  const { lang } = useDirectionAndLanguage();
  const { id } = useParams();
  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetOrderById(id);

  const formatDate = (dateString: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString(
          lang === "ar" ? "ar-EG" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
      : "";

  let pageStatus = PageStatus.SUCCESS;
  let errorMessage = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("OrderDetails:no_id");
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    errorMessage = t("OrderDetails:global_error");
  } else if (!order) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("OrderDetails:not_found");
  }

  const handleRetry = () => {
    refetch();
  };

  return (
    <>
      <SEO
        title={{
          ar: ` تفاصيل الطلب ${order?.order_id || ""}`,
          en: `Order Details ${order?.order_id || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للطلب رقم ${
            order?.order_id || "غير معروف"
          } في تشطيبة.`,
          en: `View full details for order ${
            order?.order_id || "unknown"
          } on Tashtiba.`,
        }}
        robotsTag="noindex, nofollow"
      />

      <PageStatusHandler
        status={pageStatus}
        errorMessage={errorMessage}
        loadingText={t("OrderDetails:loading")}
        notFoundText={t("OrderDetails:not_found")}
        onRetry={handleRetry}
      >
        <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
            {t("OrderDetails:title")}
          </h1>

          {/* معلومات الطلب الفرعي والرئيسي */}
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 shadow-sm border dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              {t("OrderDetails:sections.order_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
              <p>
                <strong>{t("OrderDetails:fields.order_id")}:</strong>{" "}
                {order?.order_id}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.status")}:</strong>{" "}
                {order?.status}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.subtotal")}:</strong>{" "}
                {order?.subtotal} {t("OrderDetails:egp")}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.total")}:</strong>{" "}
                {order?.total} {t("OrderDetails:egp")}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.payment_method")}:</strong>{" "}
                {order?.order?.payment_method}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.is_paid")}:</strong>{" "}
                {order?.order?.is_paid
                  ? t("OrderDetails:yes")
                  : t("OrderDetails:no")}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.shipping_status")}:</strong>{" "}
                {order?.shipping_status}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.tracking_number")}:</strong>{" "}
                {order?.tracking_number || t("OrderDetails:not_available")}
              </p>
            </div>
          </section>

          {/* معلومات العميل (صاحب الحساب) */}
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 shadow-sm border dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-green-700">
              {t("OrderDetails:sections.customer_info")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
              <p>
                <strong>{t("OrderDetails:fields.name")}:</strong>{" "}
                {order?.order?.user?.first_name} {order?.order?.user?.last_name}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.email")}:</strong>{" "}
                {order?.order?.user?.email}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.phone")}:</strong>{" "}
                {order?.order?.user?.phone}
              </p>
            </div>
          </section>

          {/* المنتجات والتخصيصات */}
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 shadow-sm border dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-purple-700">
              {t("OrderDetails:sections.products")}
            </h2>
            <div className="space-y-6">
              {order?.items.map((item: any) => (
                <div
                  key={item.id}
                  className="border dark:border-gray-700 p-4 rounded-md dark:bg-gray-800/50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
                    <p>
                      <strong>{t("OrderDetails:fields.product_name")}:</strong>{" "}
                      {item?.product[`name_${lang}`]}
                    </p>
                    <p>
                      <strong>{t("OrderDetails:fields.quantity")}:</strong>{" "}
                      {item?.quantity}
                    </p>
                    <p>
                      <strong>{t("OrderDetails:fields.price")}:</strong>{" "}
                      {item?.price} {t("OrderDetails:egp")}
                    </p>
                    <p>
                      <strong>{t("OrderDetails:fields.total")}:</strong>{" "}
                      {item?.total} {t("OrderDetails:egp")}
                    </p>

                    {/* عرض الأسئلة والردود (التخصيصات) */}
                    {item?.questions && item.questions.length > 0 && (
                      <div className="md:col-span-2 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-s-4 border-purple-500">
                        <h4 className="text-sm font-bold mb-3 text-purple-600 uppercase">
                          {t("OrderDetails:fields.product_customizations")}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.questions.map((q: any) => (
                            <div key={q.id} className="text-sm">
                              <p className="text-gray-500 dark:text-gray-400">
                                {q[`question_title_${lang}`]}
                              </p>
                              <p className="font-semibold">
                                {q[`answer_text_${lang}`]}
                                {parseFloat(q.price_effect) > 0 && (
                                  <span className="ms-2 text-xs text-green-600">
                                    (+{q.price_effect} {t("OrderDetails:egp")})
                                  </span>
                                )}
                              </p>
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

          {/* التواريخ */}
          <section className="bg-white p-6 rounded-xl dark:bg-gray-900 shadow-sm border dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {t("OrderDetails:sections.dates")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
              <p>
                <strong>{t("OrderDetails:fields.created_at")}:</strong>{" "}
                {formatDate(order?.created_at)}
              </p>
              <p>
                <strong>{t("OrderDetails:fields.updated_at")}:</strong>{" "}
                {formatDate(order?.updated_at)}
              </p>
            </div>
          </section>
        </div>
      </PageStatusHandler>
    </>
  );
};

export default OrderDetails;
