import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showCoupon } from "../../../api/AdminApi/couponsApi/_requests";

interface Coupon {
  code: string;
  type: "fixed" | "percent";
  value: string;
  max_discount: string | null;
  min_order_amount: string;
  usage_limit: number;
  used_count: string;
  active: "1" | "0";
  start_at: string;
  expires_at: string;
}

const CouponDetails: React.FC = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await showCoupon(id as string);
        setCoupon(res.data.data);
      } catch (err) {
        console.error("Error fetching coupon:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCoupon();
  }, [id]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (!id)
    return <div className="p-8 text-center text-gray-500">No Coupon ID provided.</div>;
  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading coupon details...</div>;
  if (!coupon)
    return <div className="p-8 text-center text-gray-500">Coupon not found.</div>;

  return (
    <div className="coupon-details p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Coupon Details
      </h1>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Code:</strong> {coupon.code}</p>
          <p><strong>Type:</strong> {coupon.type === "fixed" ? "Fixed Amount" : "Percentage"}</p>
          <p><strong>Value:</strong> {coupon.value}{coupon.type === "percent" ? "%" : " EGP"}</p>
          <p><strong>Status:</strong> {coupon.active === "1" ? "Active" : "Inactive"}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-700">Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Minimum Order Amount:</strong> {coupon.min_order_amount} EGP</p>
          <p><strong>Maximum Discount:</strong> {coupon.max_discount || "No Limit"}</p>
          <p><strong>Usage Limit:</strong> {coupon.usage_limit}</p>
          <p><strong>Used Count:</strong> {coupon.used_count}</p>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Validity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Start At:</strong> {formatDate(coupon.start_at)}</p>
          <p><strong>Expires At:</strong> {formatDate(coupon.expires_at)}</p>
        </div>
      </section>
    </div>
  );
};

export default CouponDetails;
