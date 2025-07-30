import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { showReviewPopup } from "../../../components/EndUser/Table/RateProduct";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/EndUser/useOrders/useOrders";
import { AxiosError } from "axios";
import { Order } from "../../../types/Orders";
import SEO from "../../../components/common/SEO/seo"; // Import your custom SEO component
import { HiOutlineShoppingCart } from "react-icons/hi2"; // Icons for order details
import { Circles } from "react-loader-spinner"; // For loaders
import { useReviewProduct } from "../../../hooks/Api/EndUser/useProducts/useProducts";

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "shipped":
      return "text-blue-600 bg-blue-100";
    case "delivered":
      return "text-green-600 bg-green-100";
    case "canceled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useParams(); // Get language from params for alternates
  const { t } = useTranslation(["EndUserOrderHistory"]);
  const [globalError, setGlobalError] = useState(false);
  const navigate = useNavigate();

  // Brand colors from your other components
  const primaryColor = "#9810fa"; // Lighter purple for accents/active states
  const secondaryColor = "#542475"; // Deeper purple for text/main elements

  useEffect(() => {
    const token = localStorage.getItem("end_user_token");
    if (!token) {
      navigate(`/${lang}/signin`, { replace: true });
    }
  }, [navigate]);

  const { data, isError, error, isLoading } = useGetOrderById(id);
  const order: Order = data?.data?.data;

  useEffect(() => {
    if (isError && error instanceof AxiosError) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        setGlobalError(true);
      } else {
        setGlobalError(true);
      }
    }
  }, [isError, error]);
 const {mutateAsync: reviewProduct} = useReviewProduct();
  const handleRateProduct = async (productId: number) => {
    const result = await showReviewPopup(
      productId,
      t("orderDetails.ratePlaceholder"),
      t("orderDetails.titleRate"),
      t("orderDetails.rateError"),
      t("orderDetails.confirmText"),
      t("orderDetails.cancelText")
    );
    if (result) {
      try {
        await reviewProduct(result);
        Swal.fire(
          t("common.success"),
          t("orderDetails.reviewSubmitted"),
          "success"
        );
      } catch (error: any) {
        console.error("Error submitting review:", error);
        Swal.fire(t("common.error"), t("common.somethingWentWrong"), "error");
      }
    }
  };

  // SEO title depends on whether order data is loaded
  const seoTitle = order
    ? lang === "ar"
      ? `تشطيبة - تفاصيل الطلب رقم ${order.id}`
      : `Tashtiba - Order Details #${order.id}`
    : lang === "ar"
    ? `تشطيبة - تفاصيل الطلب`
    : `Tashtiba - Order Details`;

  const seoDescription = order
    ? lang === "ar"
      ? `راجع تفاصيل طلبك رقم ${order.id} من تشطيبة، بما في ذلك المنتجات، حالة الدفع، عنوان الشحن، والمزيد.`
      : `View details for your order #${order.id} from Tashtiba, including products, payment status, shipping address, and more.`
    : lang === "ar"
    ? `تفاصيل طلبك من تشطيبة. تتبع حالته ومراجعة محتوياته.`
    : `Your order details from Tashtiba. Track its status and review its contents.`;

  return (
    <div className="p-4">
      <SEO
        title={{
          ar: seoTitle,
          en: seoTitle,
        }}
        description={{
          ar: seoDescription,
          en: seoDescription,
        }}
        keywords={{
          ar: [
            "تشطيبة",
            "تفاصيل الطلب",
            "تتبع الطلب",
            "حالة الطلب",
            "مشترياتي",
            "سجل الطلبات",
            "رقم الطلب",
            "عنوان الشحن",
            "طريقة الدفع",
            "مصر",
          ],
          en: [
            "tashtiba",
            "order details",
            "track order",
            "order status",
            "my purchases",
            "order history",
            "order ID",
            "shipping address",
            "payment method",
            "Egypt",
          ],
        }}
        alternates={[
          { lang: "ar", href: `https://tashtiba.com/ar/orders/${id}` },
          { lang: "en", href: `https://tashtiba.com/en/orders/${id}` },
          {
            lang: "x-default",
            href: `https://tashtiba.com/en/orders/${id}`,
          },
        ]}
      />

      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Page Header */}
        <div className="p-6 border-b-2" style={{ borderColor: primaryColor }}>
          <h1
            className="text-3xl font-bold flex items-center gap-3"
            style={{ color: secondaryColor }}
          >
            <HiOutlineShoppingCart className="h-8 w-8" />
            {t("orderDetails.title", { defaultValue: "تفاصيل الطلب" })}
            {/* {order?.id ? `#${order.id}` : ""} */}
          </h1>
          <p className="mt-2 text-gray-600">
            {t("orderDetails.subtitle", {
              defaultValue: "راجع جميع تفاصيل طلبك والمنتجات المضمنة.",
            })}
          </p>
        </div>

        {/* Conditional Content Rendering */}
        <div className="p-6">
          {!id ? (
            <div className="text-center text-gray-500 py-10">{t("no_id")}</div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Circles
                height="80"
                width="80"
                color={secondaryColor}
                ariaLabel="loading-order-details"
              />
            </div>
          ) : globalError ? (
            <div className="text-center text-red-500 py-10">
              {t("global_error")}
            </div>
          ) : !order ? (
            <div className="text-center text-gray-500 py-10">
              {t("not_found")}
            </div>
          ) : (
            <>
              {/* Order Summary & Shipping Address */}
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                {" "}
                {/* Increased gap */}
                <div className="p-6 border border-gray-200 rounded-lg shadow-sm space-y-4">
                  {" "}
                  {/* Card styling */}
                  <h3
                    className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3"
                    style={{ borderColor: primaryColor }}
                  >
                    {t("orderDetails.orderSummary")}
                  </h3>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.orderId")}:
                    </span>{" "}
                    {order.id}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.orderDate")}:
                    </span>{" "}
                    {format(new Date(order.created_at), "yyyy/MM/dd - hh:mm a")}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.paymentMethod")}:
                    </span>{" "}
                    {order.payment_method === "wallet"
                      ? t("orderDetails.wallet")
                      : t("orderDetails.cod")}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.paymentStatus")}:
                    </span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.is_paid
                          ? "text-green-600 bg-green-100"
                          : "text-red-600 bg-red-100"
                      }`}
                    >
                      {order.is_paid
                        ? t("orderDetails.paid")
                        : t("orderDetails.unpaid")}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.status")}:
                    </span>{" "}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {t(`statuses.${order.status.toLowerCase()}`)}
                    </span>
                  </p>
                  {!order.is_paid && (
                    <button className="mt-4 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition duration-300 shadow-md">
                      {t("orderDetails.payNow")}
                    </button>
                  )}
                </div>
                <div className="p-6 border border-gray-200 rounded-lg shadow-sm space-y-4">
                  {" "}
                  {/* Card styling */}
                  <h3
                    className="text-xl font-semibold text-gray-800 border-b pb-3 mb-3"
                    style={{ borderColor: primaryColor }}
                  >
                    {t("orderDetails.shippingAddress")}
                  </h3>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.fullName")}:
                    </span>{" "}
                    {order.location.full_name}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.phone")}:
                    </span>{" "}
                    {order.location.phone}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.address")}:
                    </span>{" "}
                    {[
                      order.location.city,
                      order.location.area,
                      order.location.street,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.landmark")}:
                    </span>{" "}
                    {order.location.landmark}
                  </p>
                  <p>
                    <span className="font-semibold">
                      {t("orderDetails.apartment")}:
                    </span>{" "}
                    {order.location.building_number}, {t("orderDetails.floor")}{" "}
                    {order.location.floor_number}, {t("orderDetails.apt")}{" "}
                    {order.location.apartment_number}
                  </p>
                </div>
              </div>

              {/* Sub Orders Section */}
              {order.sub_orders.map((subOrder) => (
                <div
                  key={subOrder.id}
                  className="border border-gray-200 rounded-lg p-6 mb-6 bg-white shadow-md" // Card styling for sub-orders
                >
                  <h3
                    className="text-xl font-semibold mb-4 text-gray-800 border-b pb-3"
                    style={{ borderColor: primaryColor }}
                  >
                    {t("orderDetails.vendor")}: {subOrder.vendor.name}
                  </h3>

                  <div className="overflow-x-auto">
                    {" "}
                    {/* Ensures table is scrollable on small screens */}
                    <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                      {" "}
                      {/* Rounded table */}
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">
                            {t("orderDetails.productName")}
                          </th>
                          <th className="p-3">{t("orderDetails.quantity")}</th>
                          <th className="p-3">{t("orderDetails.price")}</th>
                          <th className="p-3">{t("orderDetails.total")}</th>
                          <th className="p-3">{t("orderDetails.actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subOrder.items.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-t border-gray-200 hover:bg-gray-50"
                          >
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3">{item.product.name}</td>
                            <td className="p-3">{item.quantity}</td>
                            <td className="p-3">
                              {item.price.toLocaleString()}{" "}
                              {t("orderDetails.egp")}
                            </td>
                            <td className="p-3">
                              {item.total.toLocaleString()}{" "}
                              {t("orderDetails.egp")}
                            </td>
                            <td className="p-3">
                              <button
                                className="bg-purple-700 hover:bg-purple-800 text-white text-xs px-4 py-1.5 rounded-full transition duration-300 shadow-sm"
                                onClick={() =>
                                  handleRateProduct(item.product.id)
                                }
                              >
                                {t("orderDetails.rateProduct")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-sm space-y-1 text-gray-700">
                    <p>
                      <span className="font-semibold">
                        {t("orderDetails.subtotal")}:
                      </span>{" "}
                      {subOrder.subtotal.toLocaleString()}{" "}
                      {t("orderDetails.egp")}
                    </p>
                    <p className="font-semibold text-base">
                      {" "}
                      {/* Slightly larger for sub-total */}
                      <span className="font-semibold">
                        {t("orderDetails.total")}:
                      </span>{" "}
                      {subOrder.total.toLocaleString()} {t("orderDetails.egp")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Overall Order Total */}
              <div className="text-right font-bold text-xl mt-8 border-t border-gray-200 pt-4 text-gray-800">
                {t("orderDetails.orderTotal")}:{" "}
                {order.total_amount.toLocaleString()} {t("orderDetails.egp")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
