import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../api/AdminApi/ordersApi/_requests";

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
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500">No Order ID provided.</div>
    );
  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Loading order details...
      </div>
    );
  if (!order)
    return (
      <div className="p-8 text-center text-gray-500">Order not found.</div>
    );

  return (
    <div className="order-details p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Order Details
      </h1>

      {/*Section 1: Order Info*/}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          Order Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> {order.total} EGP
          </p>
          <p>
            <strong>Payment Method:</strong> {order.order.payment_method}
          </p>
          <p>
            <strong>Shipping Status:</strong> {order.shipping_status}
          </p>
          <p>
            <strong>Tracking Number:</strong> {order.tracking_number}
          </p>
          <p>
            <strong>Estimated Delivery:</strong>{" "}
            {formatDate(order.estimated_delivery_date)}
          </p>
        </div>
      </section>

      {/*Section 2: Customer Info*/}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">
          Customer Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Name:</strong> {order.order.user.first_name}{" "}
            {order.order.user.last_name}
          </p>
          <p>
            <strong>Email:</strong> {order.order.user.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.order.user.phone}
          </p>
          {order.order.location && (
            <p>
              <strong>Address:</strong> {order.order.location.street},{" "}
              {order.order.location.city}
            </p>
          )}
        </div>
      </section>

      {/*Section 3: Products*/}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Products</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-md shadow-sm bg-gray-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <p>
                  <strong>Product Name:</strong> {item.product.name}
                </p>
                <p>
                  <strong>Description:</strong> {item.product.description}
                </p>
                <p>
                  <strong>Price:</strong> {item.price} EGP
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Total:</strong> {item.total} EGP
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*Section 4: Dates*/}
      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Created At:</strong> {formatDate(order.created_at)}
          </p>
          <p>
            <strong>Last Updated:</strong> {formatDate(order.updated_at)}
          </p>
        </div>
      </section>
    </div>
  );
};

export default OrderDetails;
