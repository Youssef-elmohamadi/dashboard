import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { showReviewPopup } from "../../../components/EndUser/Table/RateProduct";
import { reviewProduct } from "../../../api/EndUserApi/ensUserProducts/_requests";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/Api/EndUser/useOrders/useOrders";

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price: number | null;
}

interface Item {
  id: number;
  quantity: number;
  price: number;
  total: number;
  product: Product;
}

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface SubOrder {
  id: number;
  vendor: Vendor;
  items: Item[];
  subtotal: number;
  total: number;
  commission: number;
  status: string;
  shipping_status: string;
}

interface Location {
  full_name: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building_number: string;
  floor_number: string;
  apartment_number: string;
  landmark: string;
}

interface Order {
  id: number;
  total_amount: number;
  payment_method: string;
  is_paid: number;
  status: string;
  created_at: string;
  sub_orders: SubOrder[];
  location: Location;
}

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
  //const [order, setOrder] = useState<Order | null>(null);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(["EndUserOrderHistory"]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("uToken");
    if (!token) {
      navigate("/signin", { replace: true });
    }
  }, []);

  const { data, isError, error, isLoading } = useGetOrderById(id);

  const order: Order = data?.data?.data;

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
        reviewProduct(result);
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

  if (!order)
    return <p className="text-center mt-10">{t("orderDetails.loading")}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{t("orderDetails.title")}</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-3">
          <p>
            <span className="font-semibold">{t("orderDetails.orderId")}:</span>{" "}
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
              className={`px-2 py-1 rounded-full text-sm font-medium ${
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
            <span className="font-semibold">{t("orderDetails.status")}:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {t(`statuses.${order.status.toLowerCase()}`)}
            </span>
          </p>
          {!order.is_paid && (
            <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow">
              {t("orderDetails.payNow")}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <p>
            <span className="font-semibold">{t("orderDetails.fullName")}:</span>{" "}
            {order.location.full_name}
          </p>
          <p>
            <span className="font-semibold">{t("orderDetails.phone")}:</span>{" "}
            {order.location.phone}
          </p>
          <p>
            <span className="font-semibold">{t("orderDetails.address")}:</span>{" "}
            {[order.location.city, order.location.area, order.location.street]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>
            <span className="font-semibold">{t("orderDetails.landmark")}:</span>{" "}
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

      {order.sub_orders.map((subOrder) => (
        <div
          key={subOrder.id}
          className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm"
        >
          <h3 className="text-xl font-semibold mb-4">
            {t("orderDetails.vendor")}: {subOrder.vendor.name}
          </h3>

          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">{t("orderDetails.productName")}</th>
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
                    {item.price.toLocaleString()} {t("orderDetails.egp")}
                  </td>
                  <td className="p-3">
                    {item.total.toLocaleString()} {t("orderDetails.egp")}
                  </td>
                  <td className="p-3">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-4 py-1.5 rounded-full transition duration-300 shadow-sm"
                      onClick={() => handleRateProduct(item.product.id)}
                    >
                      {t("orderDetails.rateProduct")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-sm space-y-1">
            <p>
              {t("orderDetails.subtotal")}: {subOrder.subtotal.toLocaleString()}{" "}
              {t("orderDetails.egp")}
            </p>
            <p>
              {t("orderDetails.commission")}:{" "}
              {subOrder.commission.toLocaleString()} {t("orderDetails.egp")}
            </p>
            <p className="font-semibold">
              {t("orderDetails.total")}: {subOrder.total.toLocaleString()}{" "}
              {t("orderDetails.egp")}
            </p>
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-lg mt-8 border-t border-gray-200 pt-4">
        {t("orderDetails.orderTotal")}: {order.total_amount.toLocaleString()}{" "}
        {t("orderDetails.egp")}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
