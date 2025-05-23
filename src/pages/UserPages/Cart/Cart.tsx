import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addItem,
  applyDiscount,
  removeItem,
  updateQuantity,
} from "../../../components/EndUser/Redux/cartSlice/CartSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { applyCoupon } from "../../../api/EndUserApi/ensUserProducts/_requests";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const { t } = useTranslation(["EndUserCart"]);
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const discount = useSelector((state) => state.cart.discount);
  const navigate = useNavigate();

  const [cuponData, setCuponData] = useState({
    code: "",
    order_total: totalPrice,
  });
  const [couponStatus, setCouponStatus] = useState(null);

  const handleCheckoutButton = () => {
    const token = localStorage.getItem("uToken");

    if (!token) {
      toast.error(t("please_login"));
      return;
    }

    if (items.length === 0) {
      toast.info(t("empty_cart_toast"));
      return;
    }

    navigate("/checkout");
  };

  const handleQuantityChange = (item, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id: item.id, quantity }));
    }
  };

  const handleSubmitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await applyCoupon(cuponData);
      dispatch(applyDiscount(res.data.discount));
      setCouponStatus({ success: true, message: res.data.message });
    } catch (error) {
      setCouponStatus({
        success: false,
        message: error?.response?.data?.message || t("coupon_error"),
      });
    }
  };

  const finalPrice = totalPrice - discount;

  return (
    <div className="container mx-auto p-4 py-6 flex flex-col lg:flex-row gap-6">
      {/* Order Summary */}
      <div className="lg:w-1/3 w-full bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
          {t("order_summary")}
        </h2>
        <div className="flex justify-between mb-2">
          <span>{t("items_total")}</span>
          {discount > 0 ? (
            <div className="flex flex-col items-end text-sm">
              <span className="line-through text-gray-400">
                {totalPrice.toFixed(2)} {t("egp")}
              </span>
              <span className="text-green-600 font-semibold">
                {finalPrice.toFixed(2)} {t("egp")}
              </span>
            </div>
          ) : (
            <span>
              {totalPrice.toFixed(2)} {t("egp")}
            </span>
          )}
        </div>
        <div className="flex justify-between mb-2">
          <span>{t("tax")}</span> <span>00 {t("egp")}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
          <span>{t("total")}</span>
          <span>{finalPrice ? finalPrice.toFixed(2) : totalPrice} {t("egp")}</span>
        </div>

        {/* Coupon Form */}
        <form onSubmit={handleSubmitCoupon} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder={t("have_coupon")}
            onChange={(e) =>
              setCuponData({ ...cuponData, code: e.target.value })
            }
            className={`flex-1 border border-gray-200 focus:border-gray-200 outline-none rounded px-3 py-2 text-sm ${
              couponStatus
                ? couponStatus.success
                  ? "border-green-500"
                  : "border-red-500"
                : ""
            }`}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            {t("apply")}
          </button>
        </form>

        {couponStatus && (
          <p
            className={`text-sm mt-2 ${
              couponStatus.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {couponStatus.message}
          </p>
        )}

        <button
          onClick={handleCheckoutButton}
          className="w-full bg-purple-700 text-white py-2 mt-4 rounded font-semibold"
        >
          {t("proceed_to_payment", { count: totalQuantity })}
        </button>
      </div>

      {/* Cart Items */}
      <div className="lg:w-2/3 w-full bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold border-b border-gray-200 pb-2 mb-4">
          {t("cart_items", { count: totalQuantity })}
        </h2>
        <ul className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    src={item?.images?.[0]?.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-sm mb-1">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {t("tax_label", {
                        amount: item.tax?.toFixed(2) || "0.00",
                      })}
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {t("price_label", {
                        price: (item.price * item.quantity).toFixed(2),
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-300 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item, parseInt(e.target.value))
                    }
                    className="w-10 text-center border border-gray-200 rounded"
                  />
                  <button
                    className="bg-gray-300 px-2 rounded"
                    onClick={() =>
                      handleQuantityChange(item, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeItem(item.id));
                    }}
                  >
                    <RiDeleteBin6Line className="text-error-500 text-2xl" />
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-500">{t("empty_cart")}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Cart;
