import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../api/AdminApi/ordersApi/_requests";
import { useTranslation } from "react-i18next";
import { useGetOrderById } from "../../../hooks/useOrders";

// Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
}

interface OrderItem {
  id: number;
  product: Product;
  price: number;
  quantity: number;
  total: number;
}

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Location {
  street: string;
  city: string;
}

interface MainOrder {
  payment_method: string;
  user: User;
  location?: Location;
}

interface Order {
  order_id: number;
  status: string;
  total: number;
  shipping_status: string;
  tracking_number: number;
  estimated_delivery_date: string;
  created_at: string;
  updated_at: string;
  order: MainOrder;
  items: OrderItem[];
}

const OrderDetails: React.FC = () => {
  const { t } = useTranslation(["OrderDetails"]);
  const { id } = useParams();
  //const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { data, isError, error, isLoading } = useGetOrderById(id);

  const order: Order = data?.data?.data;
  // useEffect(() => {
  //   const fetchOrder = async () => {
  //     try {
  //       const response = await getOrderById(id);
  //       setOrder(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching order:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (id) fetchOrder();
  // }, [id]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("no_id")}
      </div>
    );

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("loading")}
      </div>
    );

  if (!order)
    return (
      <div className="p-8 text-center text-gray-500 dark:text-white">
        {t("not_found")}
      </div>
    );

  return (
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
            <strong>{t("fields.order_id")}:</strong> {order.order_id}
          </p>
          <p>
            <strong>{t("fields.status")}:</strong> {order.status}
          </p>
          <p>
            <strong>{t("fields.total")}:</strong> {order.total} {t("egp")}
          </p>
          <p>
            <strong>{t("fields.payment_method")}:</strong>{" "}
            {order.order?.payment_method}
          </p>
          <p>
            <strong>{t("fields.shipping_status")}:</strong>{" "}
            {order.shipping_status}
          </p>
          <p>
            <strong>{t("fields.tracking_number")}:</strong>{" "}
            {order.tracking_number}
          </p>
          <p>
            <strong>{t("fields.estimated_delivery")}:</strong>{" "}
            {formatDate(order.estimated_delivery_date)}
          </p>
        </div>
      </section>

      {/* Customer Info */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          {t("sections.customer_info")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.name")}:</strong> {order.order?.user?.first_name}{" "}
            {order.order?.user?.last_name}
          </p>
          <p>
            <strong>{t("fields.email")}:</strong> {order.order?.user?.email}
          </p>
          <p>
            <strong>{t("fields.phone")}:</strong> {order.order?.user?.phone}
          </p>
          {order.order.location && (
            <p>
              <strong>{t("fields.address")}:</strong>{" "}
              {order.order.location.street}, {order.order?.location?.city}
            </p>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          {t("sections.products")}
        </h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border dark:border-gray-700 p-4 rounded-md  dark:bg-gray-900"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 dark:text-white">
                <p>
                  <strong>{t("fields.product_name")}:</strong>{" "}
                  {item?.product.name}
                </p>
                <p>
                  <strong>{t("fields.description")}:</strong>{" "}
                  {item?.product.description}
                </p>
                <p>
                  <strong>{t("fields.price")}:</strong> {item?.price} {t("egp")}
                </p>
                <p>
                  <strong>{t("fields.quantity")}:</strong> {item?.quantity}
                </p>
                <p>
                  <strong>{t("fields.total")}:</strong> {item?.total} {t("egp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dates */}
      <section className="bg-white p-6 rounded-xl dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {t("sections.dates")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-white">
          <p>
            <strong>{t("fields.created_at")}:</strong>{" "}
            {formatDate(order.created_at)}
          </p>
          <p>
            <strong>{t("fields.updated_at")}:</strong>{" "}
            {formatDate(order.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
