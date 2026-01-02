import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import PageStatusHandler, { PageStatus } from "../../common/PageStatusHandler/PageStatusHandler";
import { useDirectionAndLanguage } from "../../../context/DirectionContext";
import SEO from "../../common/SEO/seo";
import { useGetOrderById } from "../../../hooks/Api/SuperAdmin/useOrders/useOrders";

const InvoicePrintable: React.FC = () => {
  const { t } = useTranslation(["InvoiceDetails"]);
  const { lang, dir } = useDirectionAndLanguage();
  const { id } = useParams();
  const { data, isError, isLoading, error, refetch } = useGetOrderById(id);

  // The main order data is now the 'data' returned by the hook (which contains id, total_amount, etc.)
  const order = data; // 'data' is the object with 'id', 'user_id', 'total_amount', etc.

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t("InvoiceDetails:not_available");
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  let pageStatus = PageStatus.SUCCESS;
  let errorMessage = "";

  if (!id) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("InvoiceDetails:no_id");
  } else if (isLoading) {
    pageStatus = PageStatus.LOADING;
  } else if (isError) {
    const axiosError = error as AxiosError;
    pageStatus = PageStatus.ERROR;
    errorMessage = t("InvoiceDetails:global_error");
  } else if (!order) {
    pageStatus = PageStatus.NOT_FOUND;
    errorMessage = t("InvoiceDetails:not_found");
  }

  // Use the new API fields: total_amount and sub_orders[0].subtotal
  const taxAndShipping = order?.transportation_price;
  const totalAmount = taxAndShipping && order?.total_amount ? order.total_amount + taxAndShipping : order?.total_amount ?? 0;
  // NOTE: This assumes we are only displaying items from the FIRST sub_order.
  const subtotal = order?.sub_orders?.[0]?.subtotal || 0;

  // Extract items from the first sub_order for display
  const orderItems = order?.sub_orders?.[0]?.items || [];

  // Extract user details 
  const customerName = order?.location?.full_name || t("InvoiceDetails:not_available");
  const customerPhone = order?.location?.phone || t("InvoiceDetails:not_available");
  const customerAddress = order?.location && `${order.location.building_number} ${order.location.street}, ${order.location.city}`;
  
  // New: Invoice Date
  const invoiceDate = formatDate(order?.created_at);

  const handleRetry = () => {
    refetch(); 
  };


  return (
    <div>
      <SEO
        title={{
          ar: ` فاتورة الطلب رقم ${order?.id || ""}`, 
          en: `Order Invoice ${order?.id || ""}`,
        }}
        description={{
          ar: `استعرض التفاصيل الكاملة للطلب رقم ${
            order?.id || "غير معروف"
            } في تشطيبة، بما في ذلك حالة الطلب، المنتجات، ومعلومات العميل.`,
          en: `View full details for order ${
            order?.id || "unknown"
            } on Tashtiba, including order status, products, and customer information.`,
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
          ],
          en: [
            `order ${order?.id || ""}`,
            "order details",
            "view order",
            "order status",
            "customer orders",
            "order management",
            "Tashtiba",
          ],
        }}
        robotsTag="noindex, nofollow"
      />
      <PageStatusHandler
        status={pageStatus}
        errorMessage={errorMessage}
        loadingText={t("InvoiceDetails:loading")}
        notFoundText={t("InvoiceDetails:not_found")}
        onRetry={handleRetry}
      >
        <div className="p-4 md:p-8 bg-gray-50 print:p-0">
          <div
            className={`max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden print:shadow-none print:border-none`}
            dir={dir}
          >
            <div
              className={`flex flex-col sm:flex-row h-auto sm:h-30 relative overflow-hidden`}
            >
              {/* --- Background Skewed Shapes (omitted for brevity) --- */}
              <div className={`absolute inset-0 z-10 bg-blue-900
                ${dir === 'rtl'
                    ? 'w-full sm:w-[85%] origin-top-right sm:skew-x-12 rtl:sm:-translate-x-70'
                    : 'w-full sm:w-[85%] origin-top-left sm:-skew-x-12 ltr:sm:translate-x-70'}
                h-full hidden sm:block`}>
              </div>
              <div className={`absolute inset-0 z-0 bg-red-600
                ${dir === 'rtl' ? 'w-full sm:w-[50%] right-0' : 'w-full sm:w-[50%] left-0'}
                h-full hidden sm:block`}>
              </div>
              <div className="absolute inset-0 z-0 bg-blue-900 h-25 sm:hidden"></div>
              {/* --- Header Content --- */}
              <div
                className={`relative z-20 flex flex-col sm:flex-row w-full h-full p-4 sm:p-8 text-white`}
              >
                <div
                  className={`w-full sm:w-1/2 flex items-center mb-2 sm:mb-0 justify-end sm:order-1 rtl:justify-start rtl:sm:order-2`}
                >
                  <img
                    src={`/images/logo/${lang}-dark-logo.webp`}
                    alt="Tashtiba Logo"
                    className="h-7 sm:h-10 md:h-12 lg:h-14 object-contain"
                  />
                </div>

                <div
                  className={`w-full sm:w-1/2 flex flex-col justify-center text-left rtl:text-right sm:order-2 rtl:sm:order-1`}
                >
                  <h2 className="md:text-4xl text-xl font-bold">
                    {t('InvoiceDetails:invoice_header', { ns: 'InvoiceDetails' })}
                  </h2>
                </div>
              </div>
            </div>
            {/* --- Customer and Totals Info --- */}
            <div
              className={`flex flex-col md:flex-row justify-between p-4 border-b border-gray-200
                md:flex-row rtl:md:flex-row-reverse`}
            >
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-red-600 font-bold mb-3">
                  {t('InvoiceDetails:fields.customer_name')}:
                </h3>
                {/* --- Customer Details --- */}
                <p className="text-sm">
                  <span className="font-semibold rtl:ml-2 ltr:mr-2">{t('InvoiceDetails:fields.name')}:</span>{" "}
                  {customerName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold rtl:ml-2 ltr:mr-2">{t('InvoiceDetails:fields.phone')}:</span>{" "}
                  {customerPhone}
                </p>
                <p className="text-sm">
                  <span className="font-semibold rtl:ml-2 ltr:mr-2">{t('InvoiceDetails:fields.email')}:</span>{" "}
                  {order?.user ? order.user?.email : t("InvoiceDetails:not_available")}
                </p>
                {order?.location && (
                  <p className="text-sm">
                    <span className="font-semibold rtl:ml-2 ltr:mr-2">{t('InvoiceDetails:fields.address')}:</span>{" "}
                    {customerAddress}
                  </p>
                )}
                {/* 🌟 New: Invoice Date 🌟 */}
                <p className="text-sm mt-3 pt-3 border-t border-dashed border-gray-300">
                    <span className="font-bold rtl:ml-2 ltr:mr-2 text-blue-900">{t('InvoiceDetails:fields.invoice_date')}:</span>{" "}
                    <span className="text-red-600 font-semibold">{invoiceDate}</span>
                </p>
                {/* 🌟 New: Order ID (If not prominently displayed elsewhere) 🌟 */}
                <p className="text-sm">
                    <span className="font-bold rtl:ml-2 ltr:mr-2 text-blue-900">{t('InvoiceDetails:fields.order_number')}:</span>{" "}
                    <span className="text-red-600 font-semibold">{order?.id || t("InvoiceDetails:not_available")}</span>
                </p>
              </div>
              {/* --- Total Amount Summary --- */}
              <div className="w-full md:w-1/3">
                <div className="bg-red-100 p-4 rounded-lg print:bg-gray-100">
                  <p className="text-lg font-bold text-red-600">
                    {t('InvoiceDetails:fields.total_amount')}
                  </p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">
                    {totalAmount.toLocaleString()} {t("InvoiceDetails:fields.egp")}
                  </p>
                </div>
              </div>
            </div>
            {/* --- Items Table (omitted for brevity) --- */}
            <div className="p-0 overflow-x-auto">
<div className="min-w-[600px] flex text-white font-bold text-sm bg-blue-900">
  <div className="p-3 flex-[2] text-center">{t('InvoiceDetails:fields.product_name')}</div>
  <div className="p-3 flex-[1] text-center">{t('InvoiceDetails:fields.quantity')}</div>
  <div className="p-3 flex-[1] text-center">{t('InvoiceDetails:fields.price_unit')}</div>
  <div className="p-3 flex-[1] text-center">{t('InvoiceDetails:fields.total')}</div>
</div>

{orderItems.map((item: any) => (
  <div
    key={item.id}
    className="min-w-[600px] flex border-b border-gray-200 text-sm"
  >
    <div className="p-3 flex-[2] text-center">
      {item?.product?.[`name_${lang}`] || t("InvoiceDetails:product_unknown")}
      {item?.varient && (
        <p className="text-xs text-gray-500">
          ({item.varient[`variant_name_${lang}`]}: {item.varient[`variant_value_${lang}`]})
        </p>
      )}
    </div>
    <div className="p-3 flex-[1] text-center">{item.quantity}</div>
    <div className="p-3 flex-[1] text-center">
      {(item?.discount_price || item.price).toLocaleString()}
    </div>
    <div className="p-3 flex-[1] text-center font-semibold">
      {item.total.toLocaleString()}
    </div>
  </div>
))}
            </div>
            {/* --- Summary and Policy (omitted for brevity) --- */}
            <div
              className={`flex flex-col md:flex-row justify-between p-8
                          md:flex-row rtl:md:flex-row-reverse`}
            >
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <h4 className="font-bold text-blue-900 mb-2">
                  {t('InvoiceDetails:sections.returns_policy')}
                </h4>
                <p className="text-xs text-gray-500 max-w-sm">
                  {t('InvoiceDetails:fields.returns_text')}
                </p>
              </div>
              {/* --- Final Breakdown --- */}
              <div className="w-full md:w-1/3">
                <div className={`flex justify-between mb-1`}>
                  <span>{t('InvoiceDetails:fields.subtotal')}</span>
                  <span className="font-medium">{subtotal.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between mb-1`}>
                  <span>{t('InvoiceDetails:fields.tax_shipping')}</span>
                  <span className="font-medium">{taxAndShipping}</span>
                </div>

                <div className={`flex justify-between text-xl font-bold bg-red-600 text-white p-2 mt-4 print:bg-red-500`}>
                  <span>{t('InvoiceDetails:fields.total')}</span>
                  <span>{totalAmount.toLocaleString()} {t("InvoiceDetails:fields.egp")}</span>
                </div>
              </div>
            </div>
            {/* --- Footer (omitted for brevity) --- */}
            <div className="p-8 border-t border-gray-200">
              <p className="text-center text-red-600 font-semibold mb-8 text-lg">
                {t('InvoiceDetails:fields.thank_you')}
              </p>

              <div className={`flex justify-end mt-4`}>
                <div className="border-t border-gray-400 pt-1 w-full md:w-1/3 text-center text-sm">
                  {t('InvoiceDetails:fields.seller_signature')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageStatusHandler>
    </div>
  );
};

export default InvoicePrintable;