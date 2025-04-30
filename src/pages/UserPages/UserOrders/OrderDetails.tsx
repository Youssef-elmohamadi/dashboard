import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { getOrderById } from "../../../api/EndUserApi/endUserOrders/_requests";

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

const OrderDetailsPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const res = await getOrderById(id);
      setOrder(res.data.data);
    };
    fetchOrder();
  }, [id]);

  if (!order)
    return <p className="text-center mt-10">Loading order details...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-2">
          <p><span className="font-semibold">Order ID:</span> {order?.id}</p>
          <p><span className="font-semibold">Order Date:</span> {format(new Date(order?.created_at), 'yyyy/MM/dd - hh:mm a')}</p>
          <p><span className="font-semibold">Payment Method:</span> {order?.payment_method === 'wallet' ? 'Wallet' : 'Cash on Delivery'}</p>
          <p><span className="font-semibold">Payment Status:</span> {order?.is_paid ? 'Paid' : 'Unpaid'}</p>
          <p><span className="font-semibold">Order Status:</span> {order?.status}</p>
          {!order.is_paid && (
            <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow">
              Pay Now
            </button>
          )}
        </div>

        <div className="space-y-2">
          <p><span className="font-semibold">Full Name:</span> {order?.location?.full_name}</p>
          <p><span className="font-semibold">Phone:</span> {order?.location?.phone}</p>
          <p><span className="font-semibold">Address:</span> {[order?.location?.city, order?.location?.area, order?.location?.street].filter(Boolean).join(', ')}</p>
          <p><span className="font-semibold">Landmark:</span> {order?.location?.landmark}</p>
          <p><span className="font-semibold">Apartment:</span> {order?.location?.building_number}, Floor {order?.location?.floor_number}, Apt {order.location?.apartment_number}</p>
        </div>
      </div>

      {order.sub_orders?.map((subOrder, i) => (
        <div key={subOrder.id} className="border rounded-lg p-4 mb-6">
          <h3 className="text-xl font-semibold mb-4">Vendor: {subOrder.vendor?.name}</h3>
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Product Name</th>
                <th className="p-2">Quantity</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {subOrder.items?.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{item.product?.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">{item.price.toLocaleString()} EGP</td>
                  <td className="p-2">{item.total.toLocaleString()} EGP</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-sm">
            <p>Subtotal: {subOrder.subtotal.toLocaleString()} EGP</p>
            <p>Commission: {subOrder.commission.toLocaleString()} EGP</p>
            <p>Total: {subOrder.total.toLocaleString()} EGP</p>
          </div>
        </div>
      ))}

      <div className="text-right font-semibold text-lg mt-8">
        Order Total Amount: {order.total_amount.toLocaleString()} EGP
      </div>
    </div>
  );
};

export default OrderDetailsPage;
