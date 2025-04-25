import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../../api/AdminApi/ordersApi/_requests";
interface Product {
  id: number;
  vendor_id: number;
  name: string;
  slug: string;
  description: string;
  category_id: number;
  brand_id: number;
  price: number;
  discount_price: number;
  stock_quantity: number;
  status: string;
  is_featured: number;
  rating: number | null;
  views_count: number | null;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  sub_order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Location {
  id: number;
  order_id: number;
  user_id: number;
  full_name: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  building_number: string;
  floor_number: string;
  apartment_number: string;
  landmark: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: number;
  order_id: number;
  vendor_id: number;
  subtotal: number;
  commission: number;
  total: number;
  status: string;
  shipping_status: string;
  tracking_number: number;
  estimated_delivery_date: string;
  created_at: string;
  updated_at: string;
  order: {
    id: number;
    user_id: number;
    total_amount: number;
    payment_method: string;
    is_paid: number;
    status: string;
    created_at: string;
    updated_at: string;
    user: User;
    location: Location;
  };
  items: OrderItem[];
}

interface OrderDetailsProps {
  order: Order;
}
const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Product>();
  const { id }: any = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getOrderById(id);
        setOrder(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (!id) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        No Order data available.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        Loading Order details...
      </div>
    );
  }
  if (!order) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-300">
        No Order found.
      </div>
    );
  }
  return (
    <div className="order-details p-6">
      <h1 className="text-xl font-semibold mb-4">Order Details</h1>

      <div className="order-info mb-6">
        <h2 className="font-semibold">Order Information</h2>
        <p>
          <strong>Order ID:</strong> {order.order_id}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total Amount:</strong> {order.total}
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
          <strong>Estimated Delivery Date:</strong>
          {order?.estimated_delivery_date}
        </p>
      </div>

      <div className="user-info mb-6">
        <h2 className="font-semibold">Customer Information</h2>
        <p>
          <strong>Name:</strong> {order.order?.user.first_name}{" "}
          {order.order.user.last_name}
        </p>
        <p>
          <strong>Email:</strong> {order.order.user.email}
        </p>
        <p>
          <strong>Phone:</strong> {order.order.user.phone}
        </p>
        <p>
          <strong>Address:</strong> {order.order.location.street},{" "}
          {order?.order?.location?.city}
        </p>
      </div>

      <div className="items-info mb-6">
        <h2 className="font-semibold">Items Ordered</h2>
        <ul>
          {order.items.map((item) => (
            <li key={item.id} className="mb-4">
              <p>
                <strong>Product Name:</strong> {item.product.name}
              </p>
              <p>
                <strong>Price:</strong> {item.price}
              </p>
              <p>
                <strong>Quantity:</strong> {item.quantity}
              </p>
              <p>
                <strong>Total:</strong> {item.total}
              </p>
              <p>
                <strong>Description:</strong> {item.product.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-timestamps mb-6">
        <h2 className="font-semibold">Order Timestamps</h2>
        <p>
          <strong>Created At:</strong> {order.created_at}
        </p>
        <p>
          <strong>Updated At:</strong> {order.updated_at}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
